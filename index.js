import dotenv from "dotenv";
dotenv.config();

import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import TelegramBot from "node-telegram-bot-api";
import { Keyboard } from "telegram-keyboard";
import { initializeApp } from "firebase/app";
import { getAnalytics,isSupported  } from "firebase/analytics";

// Định nghĩa __dirname cho ES Module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const TOKEN = process.env.TOKEN_BOT_TELEGRAM;
const server = express();
const bot = new TelegramBot(TOKEN, { polling: true });
const port = process.env.PORT || 5000;
const gameName = "DarkGame";
const queries = {};

// Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyAq5GQv5LSmpS-cN-Zw_5-7_vkeZf004vo",
  authDomain: "darkkinghtcoin.firebaseapp.com",
  projectId: "darkkinghtcoin",
  storageBucket: "darkkinghtcoin.firebasestorage.app",
  messagingSenderId: "804426478668",
  appId: "1:804426478668:web:8ecf9122df4b4a9dc9b0e9",
  measurementId: "G-H84V28GBP5"
};

const app = initializeApp(firebaseConfig);
if (typeof window !== "undefined") {
    isSupported().then((supported) => {
      if (supported) {
        const analytics = getAnalytics(app);
      } else {
        console.log("Analytics is not supported in this environment.");
      }
    });
  }

server.use(express.static(path.join(__dirname, "DarkGame")));

bot.onText(/help/, (msg) => bot.sendMessage(msg.from.id, "Say /game if you want to play."));
bot.onText(/start|game/, (msg) => {
    const imageUrl = "https://darkkinghtcoin.web.app/images/BannerChat.jpg";
    bot.sendPhoto(msg.from.id, imageUrl, {
        caption: "👯 Got friends? Invite them! Spread the fun and multiply your SEED together.",
        reply_markup: {
            inline_keyboard: [
                [{ text: "🎮 Play Game Here", web_app: { url: "https://darkkinghtcoin.web.app" } }]
            ]
        }
    }).then(() => console.log("✅ Image sent successfully."))
      .catch(err => console.error("❌ Error sending image:", err));
});

server.listen(port, () => console.log(`Server running on port ${port}`));

// bot.on("callback_query", function (query) {
//     if (query.game_short_name !== gameName) {
//         bot.answerCallbackQuery(query.id, "Sorry, '" + query.game_short_name + "' is not available.");
//     } else {
//         queries[query.id] = query;

//     }
// });
// bot.on("inline_query", function (iq) {
//     bot.answerInlineQuery(iq.id, [{
//         type: "game",
//         id: "0",
//         game_short_name: gameName
//     }]);
// });
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
// server.listen(port);