import React, { useState, useEffect } from 'react';
import i18n from 'i18next';
import { useTranslation } from 'react-i18next';


const CHAT_PATTERNS = [
  {
    pattern: /hello/i,
    responses: {
      en: ['Hello there!', 'Hi!'],
      fr: ['Bonjour !', 'Salut !'],
      es: ['¡Hola!', '¡Buenos días!'],
      ja: ['こんにちは！', 'ハーイ！'],
      zh: ['你好！', '嗨！']
    }
  },
  {
    pattern: /how are you/i,
    responses: {
      en: ["I'm doing well, thank you!", "I'm good, how about you?"],
      fr: ["Je vais bien, merci !", "Je vais bien, et vous ?"],
      es: ["¡Estoy bien, gracias!", "¡Bien, ¿y tú?"],
      ja: ["おかげさまで元気です！", "元気です、あなたは？"],
      zh: ["我很好，谢谢！", "我很好，你呢？"]
    }
  }
];


const generateResponse = (question: string) => {
  const currentLang = i18n.language;

  for (const pattern of CHAT_PATTERNS) {
    if (pattern.pattern.test(question)) {
      const responses = pattern.responses[currentLang as keyof typeof pattern.responses] || pattern.responses.en;
      const response = responses[Math.floor(Math.random() * responses.length)];
      return response;
    }
  }
  return "I'm not sure I understand.";
};

const LanguageSwitcher = () => {
  const { i18n } = useTranslation();

  const handleLanguageChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    i18n.changeLanguage(event.target.value);
  };

  return (
    <select title="Select language" onChange={handleLanguageChange} value={i18n.language}>
      <option value="en">English</option>
      <option value="fr">French</option>
      <option value="es">Spanish</option>
      <option value="ja">Japanese</option>
      <option value="zh">Chinese</option>
    </select>
  );
};

const AIChat = () => {
  const { t } = useTranslation();
  const [question, setQuestion] = useState('');
  const [responses, setResponses] = useState<{ role: string; content: string }[]>([]);

  const handleAsk = () => {
    const response = generateResponse(question);
    setResponses([...responses, { role: 'bot', content: response }]);
    setQuestion('');
  };

  return (
    <div>
      <LanguageSwitcher />
      <h1>{t('chatbot.title')}</h1> {/*Example usage of translation*/}
      <input type="text" title="Question" placeholder="Enter your question" value={question} onChange={e => setQuestion(e.target.value)} />
      <button onClick={handleAsk}>{t('chatbot.askButton')}</button> {/*Example usage of translation*/}
      <ul>
        {responses.map((resp, index) => (
          <li key={index}>{resp.content}</li>
        ))}
      </ul>
    </div>
  );
};


export default AIChat;