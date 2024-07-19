const port = process.env.PORT || 3000;
const { createServer } = require('node:http');
const router = require('./router/index');
require('dotenv').config();

const { Telegraf } = require('telegraf');
const { Server } = require('socket.io');

const express = require('express');
const app = express();

const redis_db = require('./db');
const sequelize = require('./db_sql'); // Import Sequelize instance
const userModel = require('./model/userModel'); // Ensure correct path

const cors = require('cors');
app.use(cors());
app.use(express.json());
app.use('/api', router);

const server = createServer(app);

const bot = new Telegraf(process.env.BOT_TOKEN, {
    telegram: {
        webhookReplyTimeout: 5000, // Adjust timeout as needed (in milliseconds)
    },
});

bot.start((ctx) => {
    // Send a hello message and options button
    ctx.reply('Hello! What would you like to do?', {
        reply_markup: {
            inline_keyboard: [
                [{ text: 'Start farm', url: 'https://t.me/joebiden666trapstarbot/dev?mode=compact' }]
            ]
        }
    });
});

const io = new Server(server, {
    perMessageDeflate: false,
    cors: {
        origin: "https://e5191b1b7a123b.lhr.life", // Replace with your frontend URL
        methods: ["GET", "POST"],
        credentials: true
    }
});

(async () => {
    try {
        // Connect to Redis
        await redis_db.connectToRedis();

        // Authenticate and sync Sequelize
        await sequelize.authenticate();
        console.log('Connection has been established successfully.');
        await sequelize.sync();
        console.log('Database synchronized.');

        // Start the server
        server.listen(process.env.WEBSOCKET_PORT, () => {
            console.log('Websocket is running on port: ' + process.env.WEBSOCKET_PORT);
        });

        // Socket.io events
        io.on('connection', (socket) => {
            socket.on('user_tap', (id, balance, energy, exp, lvl, coin_multiplier) => {
                console.log("[SOCKET] User:" + id + " Exp:" + exp + " Balance:" + balance + " Energy:" + energy + "LVL:" + lvl + "CoinMultiplier:" + coin_multiplier);
                let data = { id, exp, balance, energy, lvl, coin_multiplier };
                redis_db.sendDataToRedis(data);
            });

        });

        // Start the bot and Express server
        app.listen(port, () => {
            console.log(`Bot started!`);
            bot.launch();

            process.once('SIGINT', () => bot.stop('SIGINT'));
            process.once('SIGTERM', () => bot.stop('SIGTERM'));
        });
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }
})();
