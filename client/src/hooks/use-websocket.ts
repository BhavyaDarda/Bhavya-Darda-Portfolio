import { useState, useEffect, useRef, useCallback } from 'react';

export type WebSocketMessage = {
  type: string;
  [key: string]: any;
};

interface WebSocketHookOptions {
  onMessage?: (data: WebSocketMessage) => void;
  onConnect?: (clientId: string) => void;
  onDisconnect?: () => void;
  reconnectInterval?: number;
  maxReconnectAttempts?: number;
  debug?: boolean;
}

export function useWebSocket(options: WebSocketHookOptions = {}) {
  const [isConnected, setIsConnected] = useState(false);
  const [connectionError, setConnectionError] = useState<string | null>(null);
  const [clientId, setClientId] = useState<string | null>(null);
  const [connectedUsers, setConnectedUsers] = useState(0);
  const [lastMessage, setLastMessage] = useState<WebSocketMessage | null>(null);
  const webSocketRef = useRef<WebSocket | null>(null);
  const reconnectAttemptsRef = useRef(0);
  const reconnectIntervalRef = useRef<number | null>(null);
  
  const {
    onMessage,
    onConnect,
    onDisconnect,
    reconnectInterval = 3000,
    maxReconnectAttempts = 5,
    debug = false
  } = options;
  
  // Helper function for logging if debug is enabled
  const log = useCallback((...args: any[]) => {
    if (debug) {
      console.log('[WebSocket]', ...args);
    }
  }, [debug]);
  
  // Connect to WebSocket server
  const connect = useCallback(() => {
    // Close existing connection if any
    if (webSocketRef.current) {
      webSocketRef.current.close();
    }
    
    try {
      // Create new WebSocket connection
      const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
      const wsUrl = `${protocol}//${window.location.host}/ws`;
      
      log('Connecting to', wsUrl);
      
      const ws = new WebSocket(wsUrl);
      webSocketRef.current = ws;
      
      // Connection opened
      ws.addEventListener('open', () => {
        log('Connected to WebSocket server');
        setIsConnected(true);
        setConnectionError(null);
        reconnectAttemptsRef.current = 0;
        
        // Clear any reconnect interval
        if (reconnectIntervalRef.current) {
          clearInterval(reconnectIntervalRef.current);
          reconnectIntervalRef.current = null;
        }
      });
      
      // Listen for messages
      ws.addEventListener('message', (event) => {
        try {
          const data = JSON.parse(event.data) as WebSocketMessage;
          log('Received message:', data);
          setLastMessage(data);
          
          // Handle welcome message to get client ID
          if (data.type === 'welcome') {
            setClientId(data.clientId);
            setConnectedUsers(data.connectedUsers || 0);
            
            if (onConnect) {
              onConnect(data.clientId);
            }
          }
          
          // Update connected users count
          if (data.connectedUsers !== undefined) {
            setConnectedUsers(data.connectedUsers);
          }
          
          // Pass message to callback if provided
          if (onMessage) {
            onMessage(data);
          }
        } catch (error) {
          console.error('Error parsing WebSocket message:', error);
        }
      });
      
      // Connection closed
      ws.addEventListener('close', () => {
        log('Disconnected from WebSocket server');
        setIsConnected(false);
        
        if (onDisconnect) {
          onDisconnect();
        }
        
        // Attempt to reconnect if not at max attempts
        if (reconnectAttemptsRef.current < maxReconnectAttempts) {
          log(`Reconnecting in ${reconnectInterval}ms (attempt ${reconnectAttemptsRef.current + 1}/${maxReconnectAttempts})`);
          
          reconnectIntervalRef.current = window.setTimeout(() => {
            reconnectAttemptsRef.current += 1;
            connect();
          }, reconnectInterval) as unknown as number;
        } else {
          setConnectionError('Maximum reconnection attempts reached');
        }
      });
      
      // Connection error
      ws.addEventListener('error', (error) => {
        console.error('WebSocket error:', error);
        setConnectionError('Connection error');
      });
    } catch (error) {
      console.error('Error creating WebSocket connection:', error);
      setConnectionError('Failed to create connection');
    }
  }, [debug, log, maxReconnectAttempts, onConnect, onDisconnect, onMessage, reconnectInterval]);
  
  // Reconnect manually
  const reconnect = useCallback(() => {
    reconnectAttemptsRef.current = 0;
    setConnectionError(null);
    connect();
  }, [connect]);
  
  // Send message to server
  const sendMessage = useCallback((message: WebSocketMessage) => {
    if (webSocketRef.current && isConnected) {
      try {
        log('Sending message:', message);
        webSocketRef.current.send(JSON.stringify(message));
        return true;
      } catch (error) {
        console.error('Error sending WebSocket message:', error);
        return false;
      }
    } else {
      log('Cannot send message: not connected');
      return false;
    }
  }, [isConnected, log]);
  
  // Send cursor position for collaborative features
  const sendCursorPosition = useCallback((x: number, y: number) => {
    return sendMessage({
      type: 'cursorPosition',
      x,
      y
    });
  }, [sendMessage]);
  
  // Send interaction event
  const sendInteractionEvent = useCallback((event: string, metadata: any = {}) => {
    return sendMessage({
      type: 'interactionEvent',
      event,
      metadata
    });
  }, [sendMessage]);
  
  // Send theme change
  const sendThemeChange = useCallback((theme: string) => {
    return sendMessage({
      type: 'themeChange',
      theme
    });
  }, [sendMessage]);
  
  // Connect when component mounts, disconnect when it unmounts
  useEffect(() => {
    connect();
    
    return () => {
      if (webSocketRef.current) {
        webSocketRef.current.close();
      }
      
      if (reconnectIntervalRef.current) {
        clearTimeout(reconnectIntervalRef.current);
      }
    };
  }, [connect]);
  
  // Return connection state and methods
  return {
    isConnected,
    connectionError,
    clientId,
    connectedUsers,
    lastMessage,
    sendMessage,
    sendCursorPosition,
    sendInteractionEvent,
    sendThemeChange,
    reconnect
  };
}