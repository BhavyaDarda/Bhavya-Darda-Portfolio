
import { useTranslation } from 'react-i18next';
import { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

const AIChat = () => {
  const { t, i18n } = useTranslation();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Reset chat when language changes
    setMessages([{
      type: 'bot',
      content: t('chatbot.welcome')
    }]);
  }, [i18n.language]);

  const handleSend = async () => {
    if (!input.trim()) return;
    
    setIsLoading(true);
    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          message: input,
          language: i18n.language
        })
      });
      
      const data = await response.json();
      setMessages(prev => [...prev, 
        { type: 'user', content: input },
        { type: 'bot', content: data.response }
      ]);
    } catch (error) {
      console.error('Chat error:', error);
    } finally {
      setIsLoading(false);
      setInput('');
    }
  };

  return (
    <div className="fixed bottom-4 right-4 w-80 bg-background/95 backdrop-blur rounded-lg shadow-xl border border-border">
      <div className="h-96 p-4 flex flex-col">
        <div className="flex-1 overflow-y-auto space-y-4">
          <AnimatePresence>
            {messages.map((msg, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`max-w-[80%] p-2 rounded ${
                  msg.type === 'user' ? 'bg-primary text-primary-foreground' : 'bg-muted'
                }`}>
                  {msg.content}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
        
        <div className="mt-4 flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={t('chatbot.placeholder')}
            className="flex-1 bg-background border border-border rounded-md px-3 py-2"
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
          />
          <button
            onClick={handleSend}
            disabled={isLoading}
            className="bg-primary text-primary-foreground px-4 py-2 rounded-md disabled:opacity-50"
          >
            {isLoading ? t('chatbot.loading') : t('chatbot.send')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AIChat;
