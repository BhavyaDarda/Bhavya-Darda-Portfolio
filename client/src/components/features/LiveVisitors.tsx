import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, X, Wifi, WifiOff, ArrowUpDown } from 'lucide-react';
import { useWebSocket } from '../../hooks/use-websocket';
import { useThemeStore } from '../../lib/theme';

interface UserPresence {
  clientId: string;
  joinedAt: string;
  theme?: string;
}

const LiveVisitors: React.FC = () => {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [activeUsers, setActiveUsers] = useState<UserPresence[]>([]);
  const { currentTheme, setTheme } = useThemeStore();
  
  // Initialize WebSocket connection
  const {
    isConnected,
    connectedUsers,
    clientId,
    sendThemeChange,
    reconnect
  } = useWebSocket({
    onMessage: (data) => {
      // Handle incoming messages based on type
      switch (data.type) {
        case 'welcome':
          // On welcome, reset the active users list and add ourselves
          setActiveUsers([{
            clientId: data.clientId,
            joinedAt: data.timestamp,
            theme: currentTheme
          }]);
          break;
          
        case 'userJoined':
          // Add new user to list
          setActiveUsers(prev => [...prev, {
            clientId: data.clientId,
            joinedAt: data.timestamp
          }]);
          
          // Send our theme to the new user
          sendThemeChange(currentTheme);
          break;
          
        case 'userLeft':
          // Remove user from list
          setActiveUsers(prev => 
            prev.filter(user => user.clientId !== data.clientId)
          );
          break;
          
        case 'userThemeChange':
          // Update user's theme in our list
          setActiveUsers(prev => 
            prev.map(user => 
              user.clientId === data.clientId 
                ? { ...user, theme: data.theme } 
                : user
            )
          );
          break;
      }
    },
    
    // When connecting, send our theme
    onConnect: () => {
      sendThemeChange(currentTheme);
    },
    
    debug: false // Set to true for verbose logging
  });
  
  // When our theme changes, broadcast it
  useEffect(() => {
    if (isConnected && clientId) {
      sendThemeChange(currentTheme);
      
      // Also update our entry in the active users list
      setActiveUsers(prev => 
        prev.map(user => 
          user.clientId === clientId 
            ? { ...user, theme: currentTheme } 
            : user
        )
      );
    }
  }, [isConnected, currentTheme, clientId, sendThemeChange]);
  
  // Format the time difference between now and a timestamp
  const formatTimeSince = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (diffInSeconds < 60) return `${diffInSeconds}s`;
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m`;
    return `${Math.floor(diffInSeconds / 3600)}h`;
  };
  
  // Apply someone else's theme
  const applyUserTheme = (theme: string) => {
    if (theme && theme !== currentTheme) {
      setTheme(theme as any);
    }
  };
  
  // Animation variants
  const containerVariants = {
    hidden: { 
      opacity: 0, 
      y: 20,
      scale: 0.95 
    },
    visible: { 
      opacity: 1, 
      y: 0,
      scale: 1,
      transition: {
        type: "spring",
        duration: 0.4
      }
    },
    exit: { 
      opacity: 0, 
      y: 20,
      scale: 0.95,
      transition: {
        duration: 0.2
      }
    }
  };
  
  // Get button background based on theme
  const getButtonBg = () => {
    switch (currentTheme) {
      case 'emerald': return 'bg-emerald-600';
      case 'platinum': return 'bg-zinc-800';
      case 'gold':
      default: return 'bg-amber-600';
    }
  };
  
  // Get theme color class
  const getThemeColor = (theme?: string) => {
    switch (theme) {
      case 'emerald': return 'bg-emerald-500';
      case 'platinum': return 'bg-zinc-400';
      case 'gold': return 'bg-amber-500';
      default: return 'bg-gray-400';
    }
  };
  
  return (
    <>
      {/* Live visitors toggle button */}
      <motion.button
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-8 right-24 z-40 flex items-center justify-center w-14 h-14 rounded-full shadow-lg ${getButtonBg()} hover:shadow-xl transition-all duration-300`}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        data-cursor="Visitors"
      >
        <div className="relative">
          <Users className="h-6 w-6 text-white" />
          {isConnected && (
            <div className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-green-500 border border-white"></div>
          )}
        </div>
      </motion.button>
      
      {/* Live visitors panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={containerVariants}
            className="fixed bottom-24 right-8 z-50 w-80 rounded-2xl shadow-2xl overflow-hidden bg-black/60 backdrop-blur-xl border border-white/10"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 bg-black/40 border-b border-white/10">
              <div className="flex items-center space-x-2">
                <Users className="h-5 w-5 text-primary" />
                <h3 className="font-semibold text-white">{t('visitors.title')}</h3>
              </div>
              <div className="flex items-center space-x-1">
                {!isConnected && (
                  <button
                    onClick={reconnect}
                    className="rounded-full p-1.5 hover:bg-white/10 transition-colors"
                    title={t('visitors.reconnect')}
                  >
                    <ArrowUpDown className="h-4 w-4 text-white" />
                  </button>
                )}
                <button
                  onClick={() => setIsOpen(false)}
                  className="rounded-full p-1.5 hover:bg-white/10 transition-colors"
                >
                  <X className="h-4 w-4 text-white" />
                </button>
              </div>
            </div>
            
            {/* Connection status */}
            <div className={`flex items-center justify-between px-4 py-2 ${isConnected ? 'bg-green-900/30' : 'bg-red-900/30'}`}>
              <div className="flex items-center space-x-2">
                {isConnected ? (
                  <Wifi className="h-4 w-4 text-green-400" />
                ) : (
                  <WifiOff className="h-4 w-4 text-red-400" />
                )}
                <span className="text-sm font-medium text-white">
                  {isConnected 
                    ? t('visitors.connected')
                    : t('visitors.disconnected')
                  }
                </span>
              </div>
              <div className="px-2 py-0.5 bg-white/10 rounded-full text-xs text-white">
                {connectedUsers} {t('visitors.online')}
              </div>
            </div>
            
            {/* Visitor list */}
            <div className="max-h-64 overflow-y-auto p-4">
              <h4 className="text-sm font-medium text-white/80 mb-2">
                {t('visitors.activeUsers')}
              </h4>
              
              {activeUsers.length === 0 ? (
                <div className="text-center py-4 text-white/60 text-sm">
                  {t('visitors.noVisitors')}
                </div>
              ) : (
                <ul className="space-y-2">
                  {activeUsers.map(user => (
                    <li 
                      key={user.clientId}
                      className={`p-3 rounded-lg ${user.clientId === clientId ? 'bg-white/20 border-l-4 border-primary' : 'bg-white/10'} flex items-center justify-between`}
                    >
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="text-sm font-medium text-white">
                            {user.clientId === clientId 
                              ? t('visitors.you')
                              : t('visitors.visitor')
                            }
                          </span>
                          <span className="text-xs text-white/60">
                            {formatTimeSince(user.joinedAt)} {t('visitors.ago')}
                          </span>
                        </div>
                        {user.clientId !== clientId && user.theme && (
                          <div className="mt-1">
                            <button
                              onClick={() => applyUserTheme(user.theme!)}
                              className="text-xs text-primary hover:underline"
                            >
                              {t('visitors.applyTheme')}
                            </button>
                          </div>
                        )}
                      </div>
                      
                      {user.theme && (
                        <div 
                          className={`w-5 h-5 rounded-full ${getThemeColor(user.theme)}`}
                          title={user.theme}
                        />
                      )}
                    </li>
                  ))}
                </ul>
              )}
            </div>
            
            {/* Footer with explanation */}
            <div className="p-3 bg-black/20 border-t border-white/10">
              <p className="text-xs text-white/70">
                {t('visitors.explanation')}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default LiveVisitors;