import { useState, useRef, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { 
  MessageSquareIcon, 
  XIcon, 
  SendIcon, 
  BotIcon, 
  UserIcon,
  ChevronRightIcon
} from 'lucide-react';
import { useThemeStore } from '../../lib/theme';

interface Message {
  id: number;
  text: string;
  sender: 'bot' | 'user';
  timestamp: Date;
}

const INITIAL_MESSAGES: Message[] = [
  {
    id: 1,
    text: 'welcome',
    sender: 'bot',
    timestamp: new Date()
  }
];

// Simple responses based on user input - in a real app, this would be replaced with an actual AI service
const generateResponse = (input: string, t: any): string => {
  const lowercaseInput = input.toLowerCase();
  
  if (lowercaseInput.includes('project') || lowercaseInput.includes('work')) {
    return t('chatbot.suggestedQuestions.0');
  } else if (lowercaseInput.includes('skill') || lowercaseInput.includes('ability')) {
    return t('chatbot.suggestedQuestions.1');
  } else if (lowercaseInput.includes('contact') || lowercaseInput.includes('email')) {
    return t('chatbot.suggestedQuestions.2');
  } else if (lowercaseInput.includes('experience') || lowercaseInput.includes('work')) {
    return t('chatbot.suggestedQuestions.3');
  } else {
    return "I'm here to help you learn more about Bhavya's portfolio. Feel free to ask about projects, skills, experience, or contact information!";
  }
};

const AIChatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { t } = useTranslation();
  const { currentTheme } = useThemeStore();
  const inputRef = useRef<HTMLInputElement>(null);

  // Initialize messages with translated welcome message
  useEffect(() => {
    const initialMsg = INITIAL_MESSAGES.map(msg => ({
      ...msg,
      text: msg.sender === 'bot' ? t('chatbot.welcome') : msg.text
    }));
    setMessages(initialMsg);
  }, [t]);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Focus input when chat is opened
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 300);
    }
  }, [isOpen]);

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;

    // Add user message
    const userMessage: Message = {
      id: messages.length + 1,
      text: inputValue,
      sender: 'user',
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    // Simulate AI thinking and typing
    setTimeout(() => {
      // Add bot response
      const botMessage: Message = {
        id: messages.length + 2,
        text: generateResponse(inputValue, t),
        sender: 'bot',
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, botMessage]);
      setIsTyping(false);
    }, 1500);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  const handleSuggestedQuestion = (question: string) => {
    // Add user message with suggested question
    const userMessage: Message = {
      id: messages.length + 1,
      text: question,
      sender: 'user',
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setIsTyping(true);

    // Simulate AI thinking and typing
    setTimeout(() => {
      // Add bot response
      const botMessage: Message = {
        id: messages.length + 2,
        text: generateResponse(question, t),
        sender: 'bot',
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, botMessage]);
      setIsTyping(false);
    }, 1500);
  };

  // Chat bubble variants
  const chatBubbleVariants = {
    hidden: {
      opacity: 0,
      y: 20,
      scale: 0.8
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: "spring",
        duration: 0.5,
        bounce: 0.3
      }
    },
    exit: {
      opacity: 0,
      scale: 0.8,
      transition: {
        duration: 0.2
      }
    }
  };

  // Chat container variants
  const chatContainerVariants = {
    hidden: {
      opacity: 0,
      y: 50,
      scale: 0.8
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: "spring",
        duration: 0.4,
        bounce: 0.2
      }
    },
    exit: {
      opacity: 0,
      y: 50,
      scale: 0.8,
      transition: {
        duration: 0.3
      }
    }
  };

  // Button background color based on theme
  const getButtonBgColor = () => {
    switch (currentTheme) {
      case 'emerald': return 'bg-emerald-600';
      case 'platinum': return 'bg-zinc-800';
      case 'gold':
      default: return 'bg-amber-600';
    }
  };

  const getSuggestedQuestions = () => {
    return [
      t('chatbot.suggestedQuestions.0'),
      t('chatbot.suggestedQuestions.1'),
      t('chatbot.suggestedQuestions.2'),
      t('chatbot.suggestedQuestions.3')
    ];
  };

  return (
    <>
      {/* Chat toggle button */}
      <motion.button
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-8 left-8 z-40 flex items-center justify-center w-14 h-14 rounded-full shadow-lg ${getButtonBgColor()} hover:shadow-xl transition-all duration-300`}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        data-cursor="Chat"
      >
        <MessageSquareIcon className="h-6 w-6 text-white" />
      </motion.button>

      {/* Chat interface */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={chatContainerVariants}
            className="fixed bottom-8 left-8 sm:left-24 z-50 w-full sm:w-96 h-[500px] rounded-2xl shadow-2xl overflow-hidden flex flex-col bg-black/50 backdrop-blur-xl border border-white/10"
          >
            {/* Chat header */}
            <div className="flex items-center justify-between p-4 bg-black/40 border-b border-white/10">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-primary/80 to-primary flex items-center justify-center shadow-inner">
                  <BotIcon className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-white">Bhavya's Assistant</h3>
                  <div className="flex items-center">
                    <span className="h-2 w-2 bg-green-500 rounded-full mr-2"></span>
                    <span className="text-xs text-gray-300">Online</span>
                  </div>
                </div>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="rounded-full p-2 hover:bg-white/10 transition-colors"
              >
                <XIcon className="h-5 w-5 text-white" />
              </button>
            </div>

            {/* Chat messages */}
            <div className="flex-1 p-4 overflow-y-auto scrollbar-thin">
              <AnimatePresence>
                {messages.map((message) => (
                  <motion.div
                    key={message.id}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    variants={chatBubbleVariants}
                    className={`flex ${message.sender === 'bot' ? 'justify-start' : 'justify-end'} mb-4`}
                  >
                    {message.sender === 'bot' && (
                      <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center mr-2">
                        <BotIcon className="h-4 w-4 text-primary" />
                      </div>
                    )}
                    <div 
                      className={`max-w-[80%] p-3 rounded-2xl shadow-md ${
                        message.sender === 'bot' 
                          ? 'bg-black/40 text-white rounded-tl-sm' 
                          : 'bg-primary/80 text-white rounded-tr-sm'
                      }`}
                    >
                      <p>{message.text}</p>
                      <div className={`text-xs mt-1 ${message.sender === 'bot' ? 'text-gray-400' : 'text-white/70'}`}>
                        {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </div>
                    {message.sender === 'user' && (
                      <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center ml-2">
                        <UserIcon className="h-4 w-4 text-primary" />
                      </div>
                    )}
                  </motion.div>
                ))}
                {isTyping && (
                  <motion.div
                    initial="hidden"
                    animate="visible"
                    variants={chatBubbleVariants}
                    className="flex justify-start mb-4"
                  >
                    <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center mr-2">
                      <BotIcon className="h-4 w-4 text-primary" />
                    </div>
                    <div className="bg-black/40 text-white p-3 rounded-2xl rounded-tl-sm max-w-[80%]">
                      <div className="flex space-x-1">
                        <motion.div
                          className="h-2 w-2 bg-gray-400 rounded-full"
                          animate={{ y: [0, -5, 0] }}
                          transition={{ duration: 0.6, repeat: Infinity, delay: 0 }}
                        />
                        <motion.div
                          className="h-2 w-2 bg-gray-400 rounded-full"
                          animate={{ y: [0, -5, 0] }}
                          transition={{ duration: 0.6, repeat: Infinity, delay: 0.2 }}
                        />
                        <motion.div
                          className="h-2 w-2 bg-gray-400 rounded-full"
                          animate={{ y: [0, -5, 0] }}
                          transition={{ duration: 0.6, repeat: Infinity, delay: 0.4 }}
                        />
                      </div>
                    </div>
                  </motion.div>
                )}
                <div ref={messagesEndRef} />
              </AnimatePresence>
            </div>

            {/* Suggested questions */}
            {messages.length <= 2 && (
              <div className="px-4 py-2 bg-black/20">
                <p className="text-xs text-gray-400 mb-2">{t('chatbot.suggestedQuestions')}</p>
                <div className="flex flex-wrap gap-2">
                  {getSuggestedQuestions().map((question, index) => (
                    <button
                      key={index}
                      onClick={() => handleSuggestedQuestion(question)}
                      className="text-xs bg-black/30 text-white px-3 py-1.5 rounded-full hover:bg-primary/20 transition-colors flex items-center"
                    >
                      {question}
                      <ChevronRightIcon className="h-3 w-3 ml-1" />
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Chat input */}
            <div className="p-3 bg-black/30 border-t border-white/10">
              <div className="flex items-center bg-black/30 rounded-full px-4 py-2 border border-white/10">
                <input
                  ref={inputRef}
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder={t('chatbot.placeholder')}
                  className="flex-1 bg-transparent border-none outline-none text-white placeholder-gray-500"
                  disabled={isTyping}
                />
                <button
                  onClick={handleSendMessage}
                  disabled={!inputValue.trim() || isTyping}
                  className={`${
                    !inputValue.trim() || isTyping ? 'opacity-50 cursor-not-allowed' : 'hover:bg-primary/20'
                  } p-2 rounded-full transition-colors`}
                >
                  <SendIcon className="h-5 w-5 text-primary" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default AIChatbot;