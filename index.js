const TelegramApi = require("node-telegram-bot-api");

const {gameOptions,againOptions}=require('./option')

const token = "6016744447:AAFllkjc5kWYJCQvkD8Vcx9pDc-lB0NdUd0";

const bot = new TelegramApi(token, { polling: true });

const chats = {};



const startGame = async (chatId) => {
  await bot.sendMessage(chatId, "I'm guess the number from 0 to 9");
  const randomNumber = Math.floor(Math.random() * 10);
  chats[chatId] = randomNumber;
  await bot.sendMessage(chatId, "Try to find it", gameOptions);
};

const start = () => {
  bot.setMyCommands([
    { command: "/start", description: "Здравствуйте!" },
    { command: "/info", description: "Информация о пользователе!" },
    { command: "/game", description: "Игра" },
  ]);

  bot.on("message", async (msg) => {
    const text = msg.text;
    const chatId = msg.chat.id;

    if (text === "/start") {
      return bot.sendMessage(chatId, `Welcome ${msg.from.first_name}`);
    }
    if (text === "/info") {
      return bot.sendMessage(
        chatId,
        `You are ${msg.from.first_name} ${msg.from.last_name}`
      );
    }
    if (text === "/game") {
      return startGame(chatId);
    }
    return bot.sendMessage(chatId, "Wrong message");
  });

  bot.on("callback_query", async (msg) => {
    const data = msg.data;
    const chatId = msg.message.chat.id;
    if (data === "/again") {
      return startGame(chatId)
    }

    if (chats[chatId] == data) {
      return await bot.sendMessage(chatId, "You are win!!!", againOptions);
    } else {
      return bot.sendMessage(
        chatId,
        `You made incorrect chose, bot guessed ${chats[chatId]}`,
        againOptions
      );
    }
  });
};
start();
