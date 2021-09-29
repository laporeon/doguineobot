require('dotenv').config();

const express = require('express');
const { Telegraf } = require('telegraf');
const bot = new Telegraf(process.env.TOKEN);

const app = express();

const PORT = process.env.PORT || 3000;

bot.command('start', (ctx) => {
  bot.launch();
  console.log(ctx.from);
  bot.telegram.sendMessage(
    ctx.chat.id,
    `Olá, ${ctx.chat.first_name}! Seja bem-vinde ao Doguíneo. Para receber fotos, digite /doguinho`,
    {}
  );
});

const fetchDogPictures = async (ctx) => {
  bot.telegram.sendMessage(
    ctx.chat.id,
    `Perfeito! Aqui está a sua foto. 💞`,
    {}
  );
  await ctx.replyWithPhoto({
    url: process.env.FETCH_URL,
  });

  bot.telegram.sendMessage(ctx.chat.id, `Gostaria de receber outra?`, {
    reply_markup: {
      inline_keyboard: [
        [
          {
            text: 'sim',
            callback_data: 'yes',
          },
          {
            text: 'não',
            callback_data: 'no',
          },
        ],
      ],
    },
  });
};

bot.hears('/doguinho', fetchDogPictures);

bot.action('yes', fetchDogPictures);

bot.action('no', (ctx) => {
  bot.telegram.sendMessage(
    ctx.chat.id,
    `Entendido! Para receber uma nova foto, digite /doguinho`,
    {}
  );
});

bot.command('stop', (ctx) => {
  bot.telegram.sendMessage(
    ctx.chat.id,
    `Muito obrigado por ter usado meu bot. Para recomeçar, digite /start a qualquer momento.`,
    {}
  );
  bot.stop();
});

bot.launch();

app
  .get('/', function (request, response) {
    var result = 'App is running';
    response.send(result);
  })
  .listen(PORT, function () {
    console.log(`Our app is running on port ${PORT}`);
  });
