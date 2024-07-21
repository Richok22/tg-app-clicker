const port = process.env.PORT || 3000;
const { createServer } = require('node:http');
const router = require('./router/index');
require('dotenv').config();

const { Telegraf } = require('telegraf');
const { Server } = require('socket.io');
const express = require('express');
const cors = require('cors');

const redis_db = require('./db');
const sequelize = require('./db_sql'); // Import Sequelize instance
const User = require('./model/userModel'); // Ensure correct path

const config = require('./config.json');

const app = express();

// CORS configuration
const corsOptions = {
    origin: ["https://35216fbacbd87c.lhr.life"], // List the allowed origins
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
};
app.use(cors(corsOptions));
app.use(express.json());
app.use('/api', router);

const server = createServer(app);

const bot = new Telegraf(process.env.BOT_TOKEN, {
    telegram: {
        webhookReplyTimeout: 5000, // Adjust timeout as needed (in milliseconds)
    },
});

bot.start(async (ctx) => {
    bot.start(async (ctx) => {
        const startPayload = ctx.message.text;
        const referralCode = startPayload.split('startapp=')[1];

        if (referralCode) {
            console.log(`Received referral code: ${referralCode}`);

            await ctx.reply('Welcome! You have started the bot with a referral code.');

            // Generate a link to your Web App
            const webAppLink = `https://t.me/joebiden666trapstarbot?startapp=${encodeURIComponent(referralCode)}`;

            await ctx.reply('Click the link to open the Web App:', {
                reply_markup: {
                    inline_keyboard: [
                        [{ text: 'Open Web App', url: webAppLink }]
                    ]
                }
            });
        } else {
            await ctx.reply('Welcome! You have started the bot without a referral code.');
        }
    });
});
const io = new Server(server, {
    perMessageDeflate: false,
    cors: {
        origin: "https://35216fbacbd87c.lhr.life", // Replace with your frontend URL
        methods: ["GET", "POST"],
        credentials: true
    }
});

// Track last request time for each user
const userLastRequestTime = new Map();
const SYNC_INTERVAL = 5000; // Interval to check for inactivity
const REQUEST_INTERVAL = 3000; // Time to sync data if no requests
const BATCH_SIZE = 50; // Number of records to process per batch

let lastSyncLog = Date.now();

let wasPreviousCheckEmpty = false; // Track the previous state of key presence

async function syncRedisToSQL() {
    try {
        const now = Date.now();
        if (now - lastSyncLog >= SYNC_INTERVAL) {
            lastSyncLog = now;
        }

        const keys = await redis_db.getAllKeys(); // Get all keys from Redis

        if (keys.length === 0) {
            if (!wasPreviousCheckEmpty) {
                wasPreviousCheckEmpty = true; // Update flag to indicate previous check was empty
            }
            return;
        }

        wasPreviousCheckEmpty = false; // Reset the flag since keys are found

        // Process user data in batches
        for (let i = 0; i < keys.length; i += BATCH_SIZE) {
            const batchKeys = keys.slice(i, i + BATCH_SIZE);
            const batchPromises = batchKeys.map(async (key) => {
                const id = key.split(':')[1];
                const userData = await redis_db.getUserDataFromRedis(id);

                if (!userData) {
                    console.log(`No user data found in Redis for ID ${id}`);
                    return;
                }

                try {
                    await User.upsert({
                        tgId: userData.tgId,
                        balance: userData.balance,
                        lvl: userData.lvl,
                        exp: userData.exp,
                        maxExp: userData.maxExp,
                        daily: userData.daily,
                        energy: userData.energy,
                        maxEnergy: userData.maxEnergy,
                        coin_multiplier: userData.coin_multiplier,
                        energy_multiplier: userData.energy_multiplier,
                    });
                    // Remove the processed key from Redis
                    await redis_db.deleteUserDataFromRedis(id);
                } catch (error) {
                    console.error(`Error saving user data for ID ${id}:`, error);
                }
            });

            await Promise.all(batchPromises);

            // Log batch completion every 5th batch
            if (i % (5 * BATCH_SIZE) === 0) {
                console.log(`Processed batch of ${batchKeys.length} records.`);
            }
        }

        console.log('Sync completed.');
    } catch (error) {
        console.error('Error syncing Redis data to SQL:', error);
    }
}

function startSyncInterval() {
    console.log(`Starting sync interval every ${SYNC_INTERVAL / 1000} seconds`);
    setInterval(async () => {
        try {
            const now = Date.now();
            const timeSinceLastRequest = now - Math.max(...userLastRequestTime.values());

            if (timeSinceLastRequest >= REQUEST_INTERVAL) {
                await syncRedisToSQL();
            }
        } catch (error) {
            console.error('Error during interval sync:', error);
        }
    }, SYNC_INTERVAL);
}

(async () => {
    try {
        // Connect to Redis
        await redis_db.connectToRedis();

        // Authenticate and sync Sequelize
        await sequelize.authenticate();
        console.log('Connection has been established successfully.');

        // Synchronize the database, creating tables if they do not exist
        await sequelize.sync({ alter: true }); // Use `alter` to automatically adjust existing tables

        console.log('Database synchronized.');

        // Start the server
        server.listen(process.env.WEBSOCKET_PORT || port, () => {
            console.log('Websocket is running on port: ' + (process.env.WEBSOCKET_PORT || port));
        });

        io.on('connection', (socket) => {
            console.log('A user connected:', socket.id);

            socket.on('user_tap', async (id) => {
                try {
                    userLastRequestTime.set(id, Date.now());

                    let userData = await redis_db.getUserDataFromRedis(id);

                    if (!userData) {
                        userData = await redis_db.getUserDataFromSQL(id);
                    }

                    // Increment balance by coin multiplier
                    userData.balance += userData.coin_multiplier;
                    userData.energy--;
                    userData.exp++;

                    // Level up logic
                    if (userData.exp >= userData.maxExp) {
                        userData.lvl++;
                        userData.exp = 0;
                        userData.maxExp *= config.default_upgrades.exp_upgrade_per_lvl;

                        if (userData.lvl >= config.default_upgrades.energy_restore_upgrade) {
                            userData.coin_multiplier += 1;
                        }

                        if (userData.lvl >= config.default_upgrades.coin_multiplier_upgrade) {
                            userData.maxEnergy *= userData.energy_multiplier;
                            userData.energy = userData.maxEnergy;
                        }
                    }

                    // Save updated user data to Redis
                    await redis_db.saveUserDataToRedis(userData);

                    // Emit the updated user data back to the client
                    socket.emit('user_data_update', {
                        balance: userData.balance,
                        lvl: userData.lvl,
                        exp: userData.exp,
                        maxExp: userData.maxExp,
                        daily: userData.daily,
                        energy: userData.energy,
                        maxEnergy: userData.maxEnergy,
                        coin_multiplier: userData.coin_multiplier,
                        energy_multiplier: userData.energy_multiplier
                    });

                    console.log(`Updated balance for user ${id}: ${userData.balance}`);

                } catch (error) {
                    console.error('Error handling user tap:', error);
                }
            });
        });


        // Start the bot and Express server
        app.listen(port, () => {
            console.log(`Express server started on port ${port}`);
            bot.launch();

            process.once('SIGINT', () => bot.stop('SIGINT'));
            process.once('SIGTERM', () => bot.stop('SIGTERM'));
        });

        // Start the sync interval
        startSyncInterval();
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }
})();
