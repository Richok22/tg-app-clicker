const { createClient } = require('redis');
const mysql = require('mysql2/promise');

let client;
const REQUEST_INTERVAL = 5000; // 10 seconds
const MYSQL_CONFIG = {
    host: 'localhost',
    user: 'root',
    database: 'riot',
    password: '',
};

const lastRequestTime = {}; // Track last request time for each user

async function connectToRedis() {
    try {
        client = createClient();
        client.on('error', (error) => {
            console.error(`Redis client error:`, error);
        });
        await client.connect();
        console.log('Connected to Redis');
    } catch (e) {
        console.error(e);
    }
}

async function connectToMySQL() {
    try {
        const connection = await mysql.createConnection(MYSQL_CONFIG);
        console.log('Connected to MySQL');
        return connection;
    } catch (e) {
        console.error('MySQL connection error:', e);
    }
}

async function sendDataToMySQL(connection, data) {
    try {
        const query = `
            INSERT INTO user (tgId, exp, balance, energy, lvl, coin_multiplier) 
            VALUES (?, ?, ?, ?, ?, ?) 
            ON DUPLICATE KEY UPDATE 
                exp = VALUES(exp), 
                balance = VALUES(balance), 
                energy = VALUES(energy), 
                lvl = VALUES(lvl),
                coin_multiplier = VALUES(coin_multiplier);
        `;
        await connection.execute(query, [
            data.id, // Use 'id' here
            data.exp,
            data.balance,
            data.energy,
            data.lvl,
            data.coin_multiplier
        ]);
        console.log('User data processed in MySQL:', data);
    } catch (e) {
        console.error('Error sending data to MySQL:', e);
    }
}

async function pollRedis(connection) {
    setInterval(async () => {
        const users = Object.keys(lastRequestTime);

        for (const id of users) {
            const currentTime = Date.now();
            if (currentTime - lastRequestTime[id] > REQUEST_INTERVAL) {
                const value = await client.get(`tap:${id}`);
                if (value) {
                    const data = parseData(value);
                    await sendDataToMySQL(connection, data);
                    await client.del(`tap:${id}`); // Clear the Redis key after sending
                    delete lastRequestTime[id]; // Remove from tracking
                    console.log(`Data cleared from Redis after sending to MySQL for ${id}`);
                }
            }
        }
    }, 5000); // Check every 5 seconds
}

function parseData(value) {
    const dataParts = value.split(' ');
    const id = dataParts[0].split(':')[1]; // Use 'id'
    const exp = parseInt(dataParts[1].split(':')[1]);
    const balance = parseFloat(dataParts[2].split(':')[1]);
    const energy = parseInt(dataParts[3].split(':')[1]);
    const lvl = parseInt(dataParts[4].split(':')[1]);
    const coin_multiplier = parseFloat(dataParts[5].split(':')[1]);

    return { id, exp, balance, energy, lvl, coin_multiplier }; // Include 'id' in returned data
}

async function sendDataToRedis(data) {
    console.log('[REDIS] Sending data to Redis:', data);

    if (!client) {
        console.error('Redis client is not connected');
        return;
    }

    try {
        const userKey = `tap:${data.id}`; // Unique key for each user
        await client.set(userKey, `tgId:${data.id} Exp:${data.exp} Balance:${data.balance} Energy:${data.energy} Lvl:${data.lvl} CoinMultiplier:${data.coin_multiplier}`);
        lastRequestTime[data.id] = Date.now(); // Update last request time
        const value = await client.get(userKey);
        console.log('Stored value:', value);
    } catch (e) {
        console.error('Error sending data to Redis:', e);
    }
}

// Main function to connect and start polling
async function main() {
    await connectToRedis();
    const mysqlConnection = await connectToMySQL();
    await pollRedis(mysqlConnection);
}

main().catch((e) => console.error('Error in main:', e));

module.exports = {
    sendDataToRedis,
    connectToRedis,
};
