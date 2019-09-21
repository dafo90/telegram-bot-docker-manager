module.exports = chat => {
  const chatIds = process.env.CHAT_IDS.split(',').map(chatId => Number(chatId));
  return !chatIds || chatIds.length === 0 || chatIds.includes(chat.id);
};
