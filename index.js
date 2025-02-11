const express = require("express");
const path = require("path");
const TelegramBot = require("node-telegram-bot-api");
const TOKEN = "7661488868:AAE6sHVGGKBZ13Reg4kHZryTTMT7H3VG5lU";
const server = express();
const bot = new TelegramBot(TOKEN, {
    polling: true
});
const port = process.env.PORT || 5000;
const gameName = "DarkGame";
const queries = {};
const { Keyboard } = require('telegram-keyboard')

server.use(express.static(path.join(__dirname, 'DarkGame')));
bot.onText(/help/, (msg) => bot.sendMessage(msg.from.id, "Say /game if you want to play."));
bot.onText(/start|game/, (msg) => {


    const imageUrl = "https://mrhia.github.io/DarkKnightwebgl/images/BannerChat.jpg";
    bot.sendPhoto(msg.from.id, imageUrl, {
        caption: "👯 Got friends? Invite them! Spread the fun and multiply your SEED together."
            + " That’s all you need to know to get started. ⬇️",
        reply_markup: {
            inline_keyboard: [
                [{
                    text: '🎮 Play Game Here',
                    web_app: {
                        url: "https://mrhia.github.io/DarkKnightwebgl"
                    }
                }]
            ]
        }
    }).then(() => {
        console.log('✅ Image sent successfully.');
    }).catch(err => {
        console.error('❌ Error sending image:', err);
        bot.sendMessage(msg.from.id, "⚠️ Oops! There was an issue sending the image.");
    });

});

bot.on("callback_query", function (query) {
    if (query.game_short_name !== gameName) {
        bot.answerCallbackQuery(query.id, "Sorry, '" + query.game_short_name + "' is not available.");
    } else {
        queries[query.id] = query;

    }
});
bot.on("inline_query", function (iq) {
    bot.answerInlineQuery(iq.id, [{
        type: "game",
        id: "0",
        game_short_name: gameName
    }]);
});

// server.get("/highscore/:score", function (req, res, next) {
//     if (!Object.hasOwnProperty.call(queries, req.query.id)) return next();
//     let query = queries[req.query.id];
//     let options;
//     if (query.message) {
//         options = {
//             chat_id: query.message.chat.id,
//             message_id: query.message.message_id
//         };
//     } else {
//         options = {
//             inline_message_id: query.inline_message_id
//         };
//     }
//     bot.setGameScore(query.from.id, parseInt(req.params.score), options,
//         function (err, result) { });
// });
server.listen(port);
