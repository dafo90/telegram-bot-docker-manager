const canAnswer = function(chat) {
  const chatIds = process.env.CHAT_IDS.split(",").map(chatId => Number(chatId));
  console.log(chatIds)
  return !chatIds || chatIds.length === 0 || chatIds.includes(chat.id);
};

module.exports = canAnswer;
