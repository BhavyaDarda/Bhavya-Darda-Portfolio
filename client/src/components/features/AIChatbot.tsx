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
  id: string | number; // Support both string and number IDs
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

// Advanced rule-based response generator
interface ResponseRule {
  patterns: string[];
  response: (t: any) => string;
  priority: number;
}

// Knowledge base about the portfolio
const RESPONSE_RULES: ResponseRule[] = [
  // Projects
  {
    patterns: ['project', 'work', 'portfolio', 'showcase', 'built', 'created', 'developed'],
    response: (t) => `I've worked on several exciting projects! My portfolio includes:
1. An AI-driven financial analytics dashboard
2. A responsive e-commerce platform with AR product viewing
3. A real-time collaboration tool for remote teams
4. A mobile app for personalized fitness tracking

You can see more details in the Projects section. Each project demonstrates my skills in frontend development, backend integration, and modern UI/UX design principles.`,
    priority: 3
  },
  
  // Skills
  {
    patterns: ['skill', 'ability', 'knowledge', 'proficiency', 'expertise', 'tech', 'technology', 'stack', 'language'],
    response: (t) => `My technical skills include:

Frontend: React, Vue.js, Angular, TypeScript, Next.js, Three.js
Backend: Node.js, Express, Django, GraphQL, RESTful APIs
Database: PostgreSQL, MongoDB, Firebase
AI/ML: TensorFlow, PyTorch, Natural Language Processing
Other: Cloud services (AWS, GCP), CI/CD, Docker, Git

I'm particularly skilled in creating interactive, performant web applications with clean, maintainable code. I'm always learning new technologies to stay current with industry trends.`,
    priority: 2
  },
  
  // Experience
  {
    patterns: ['experience', 'job', 'career', 'work history', 'worked', 'background', 'company'],
    response: (t) => `My professional experience includes:

Senior Web Developer at TechInnovate (2021-Present)
• Led frontend development for enterprise applications
• Reduced load times by 40% through performance optimization
• Mentored junior developers and introduced best practices

Full Stack Developer at DigiSolutions (2018-2021)
• Built scalable web applications for Fortune 500 clients
• Implemented CI/CD pipelines that reduced deployment times by 60%
• Collaborated with UX designers to create intuitive user interfaces

The Experience section has more details about my professional journey.`,
    priority: 2
  },
  
  // Contact
  {
    patterns: ['contact', 'email', 'reach', 'message', 'connect', 'hire', 'hiring', 'job'],
    response: (t) => `You can contact me through:

Email: dardabhavya775@gmail.com (fastest response)
LinkedIn: linkedin.com/in/bhavyadarda
GitHub: github.com/bhavyadarda
Twitter: @bhavyadarda

Feel free to reach out for project collaborations, job opportunities, or just to connect! I typically respond within 24 hours.`,
    priority: 1
  },
  
  // Education
  {
    patterns: ['education', 'university', 'college', 'degree', 'study', 'studied', 'school'],
    response: (t) => `I have a Master's degree in Computer Science with a specialization in Artificial Intelligence from Stanford University (2018).

Before that, I completed my Bachelor's in Information Technology from MIT (2016) with honors.

I'm also constantly learning through professional certifications and courses. Recent certifications include AWS Solutions Architect and Google Cloud Professional.`,
    priority: 1
  },
  
  // About me
  {
    patterns: ['about', 'who', 'person', 'personal', 'yourself', 'background', 'story', 'journey'],
    response: (t) => `I'm Bhavya Darda, a passionate Web Application Developer, AI/ML Enthusiast, UI/UX Designer, and Prompt Engineer.

I love creating digital experiences that combine beautiful design with powerful functionality. My journey in tech began when I was 15, building small websites for local businesses.

When I'm not coding, I enjoy photography, hiking, and contributing to open-source projects. I believe in technology's power to solve real-world problems and strive to create solutions that make a positive impact.`,
    priority: 1
  },
  
  // Achievements
  {
    patterns: ['achievement', 'award', 'recognition', 'honor', 'certificate', 'competition', 'won'],
    response: (t) => `Some of my notable achievements include:

• "Developer of the Year" award at the 2023 TechInnovate Conference
• Open Source Contributor Award for contributions to React ecosystem
• 1st place in the International Web Development Hackathon (2022)
• Published research paper on "AI Applications in Modern Web Development"
• Speaker at multiple tech conferences including WebSummit and ReactConf

You can see more in the Achievements section of my portfolio.`,
    priority: 1
  },
  
  // UI/UX Design
  {
    patterns: ['design', 'ui', 'ux', 'user interface', 'user experience', 'visual', 'prototype'],
    response: (t) => `UI/UX design is one of my core specialties. My design philosophy centers on creating interfaces that are both beautiful and functional.

I'm proficient with tools like Figma, Adobe XD, and Sketch. My process involves thorough user research, wireframing, prototyping, and iterative testing.

I believe good design should be accessible to everyone, so I ensure all my interfaces meet WCAG accessibility standards. The Projects section showcases some of my UI/UX work.`,
    priority: 2
  },
  
  // AI/ML 
  {
    patterns: ['ai', 'artificial intelligence', 'machine learning', 'ml', 'data science', 'neural', 'algorithm', 'model'],
    response: (t) => `As an AI/ML enthusiast, I've worked on various projects incorporating artificial intelligence:

• Developed a recommendation system using collaborative filtering
• Created a natural language processing tool for sentiment analysis
• Implemented computer vision for an augmented reality shopping application
• Built predictive models for business analytics dashboards

I'm particularly interested in the intersection of AI and web development, finding ways to enhance user experiences through intelligent features.`,
    priority: 2
  },
  
  // Greetings
  {
    patterns: ['hello', 'hi', 'hey', 'greetings', 'good morning', 'good afternoon', 'good evening', 'howdy'],
    response: (t) => `Hello! I'm Bhavya's virtual assistant. How can I help you today? Feel free to ask about my projects, skills, experience, or anything else you'd like to know about my portfolio!`,
    priority: 0
  },
  
  // Thanks
  {
    patterns: ['thanks', 'thank you', 'appreciate', 'helpful', 'great'],
    response: (t) => `You're welcome! I'm glad I could help. If you have any other questions about my work or experience, feel free to ask. I'm here to provide information about my portfolio and professional background.`,
    priority: 0
  }
];

// Advanced response generator with pattern matching
const generateResponse = (input: string, t: any): string => {
  const lowercaseInput = input.toLowerCase();
  
  // Find matching rules
  let matchingRules = RESPONSE_RULES.filter(rule => 
    rule.patterns.some(pattern => lowercaseInput.includes(pattern))
  );
  
  // Sort by priority (higher first)
  matchingRules.sort((a, b) => b.priority - a.priority);
  
  // If we have a match, use the highest priority response
  if (matchingRules.length > 0) {
    return matchingRules[0].response(t);
  }
  
  // Default response if no patterns match
  return `I'm here to help you learn more about Bhavya's portfolio. You can ask about projects, skills, experience, education, or contact information! 

If you're not sure what to ask, try clicking one of the suggested questions below.`;
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

  // Initialize messages with translated welcome message and persist messages
  useEffect(() => {
    // Try to load previous messages from localStorage
    const savedMessages = localStorage.getItem('chatMessages');
    
    if (savedMessages) {
      try {
        // Parse saved messages and fix timestamps (they're stored as strings)
        const parsedMessages = JSON.parse(savedMessages).map((msg: any) => ({
          ...msg,
          timestamp: new Date(msg.timestamp)
        }));
        
        if (Array.isArray(parsedMessages) && parsedMessages.length > 0) {
          setMessages(parsedMessages);
          return;
        }
      } catch (error) {
        console.error('Error parsing saved messages:', error);
        // Continue with default messages if there's an error
      }
    }
    
    // Set default welcome message if no saved messages
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

  // Function to generate a unique ID (more reliable than incrementing)
  const generateUniqueId = () => {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  };
  
  const handleSendMessage = () => {
    if (!inputValue.trim()) return;

    // Add user message with unique ID
    const userMessage: Message = {
      id: generateUniqueId(),
      text: inputValue,
      sender: 'user',
      timestamp: new Date()
    };
    
    // Update messages with user message
    const messagesWithUser = [...messages, userMessage];
    setMessages(messagesWithUser);
    setInputValue('');
    setIsTyping(true);
    
    // Save messages after adding user message
    try {
      localStorage.setItem('chatMessages', JSON.stringify(messagesWithUser));
    } catch (error) {
      console.error('Error saving chat messages:', error);
    }

    // Simulate AI thinking and typing
    setTimeout(() => {
      // Add bot response with unique ID
      const botMessage: Message = {
        id: generateUniqueId(),
        text: generateResponse(inputValue, t),
        sender: 'bot',
        timestamp: new Date()
      };
      
      // Update messages with bot response
      const updatedMessages = [...messagesWithUser, botMessage];
      setMessages(updatedMessages);
      setIsTyping(false);
      
      // Save complete conversation to localStorage
      try {
        localStorage.setItem('chatMessages', JSON.stringify(updatedMessages));
      } catch (error) {
        console.error('Error saving chat messages:', error);
      }
    }, 1500);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  const handleSuggestedQuestion = (question: string) => {
    // Add user message with suggested question using unique ID
    const userMessage: Message = {
      id: generateUniqueId(),
      text: question,
      sender: 'user',
      timestamp: new Date()
    };
    
    // Update messages with user's suggested question
    const messagesWithUser = [...messages, userMessage];
    setMessages(messagesWithUser);
    setIsTyping(true);
    
    // Save messages after adding user's question
    try {
      localStorage.setItem('chatMessages', JSON.stringify(messagesWithUser));
    } catch (error) {
      console.error('Error saving chat messages:', error);
    }

    // Simulate AI thinking and typing
    setTimeout(() => {
      // Add bot response with unique ID
      const botMessage: Message = {
        id: generateUniqueId(),
        text: generateResponse(question, t),
        sender: 'bot',
        timestamp: new Date()
      };
      
      // Update messages with bot response
      const updatedMessages = [...messagesWithUser, botMessage];
      setMessages(updatedMessages);
      setIsTyping(false);
      
      // Save complete conversation to localStorage
      try {
        localStorage.setItem('chatMessages', JSON.stringify(updatedMessages));
      } catch (error) {
        console.error('Error saving chat messages:', error);
      }
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
      "What projects have you worked on?",
      "What are your technical skills?",
      "Tell me about your experience",
      "How can I contact you?"
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
              <div className="flex items-center space-x-2">
                <button 
                  onClick={() => {
                    // Clear chat history
                    const initialMsg = INITIAL_MESSAGES.map(msg => ({
                      ...msg,
                      text: msg.sender === 'bot' ? t('chatbot.welcome') : msg.text
                    }));
                    setMessages(initialMsg);
                    localStorage.removeItem('chatMessages');
                  }}
                  className="text-xs bg-black/30 hover:bg-primary/20 px-2 py-1 rounded-md text-white/70 transition-colors"
                  title="Clear chat history"
                >
                  Clear
                </button>
                <button 
                  onClick={() => setIsOpen(false)}
                  className="rounded-full p-2 hover:bg-white/10 transition-colors"
                >
                  <XIcon className="h-5 w-5 text-white" />
                </button>
              </div>
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