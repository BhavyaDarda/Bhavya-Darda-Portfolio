const generateResponse = (question: string, t: any) => {
  // Find matching patterns and responses
  for (const pattern of CHAT_PATTERNS) {
    if (pattern.patterns.some(p => question.toLowerCase().includes(p))) {
      return typeof pattern.response === 'function' ? pattern.response(t) : pattern.response;
    }
  }

  // Default response if no pattern matches
  return t('chatbot.defaultResponse', 'I\'ll do my best to help you with that. You can also try some of the suggested questions below.');
};