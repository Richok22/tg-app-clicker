const { createClient } = require('redis');
const User = require('./model/userModel'); // Import User model

let redisClient;
const REQUEST_INTERVAL = 10000; // 10 seconds interval for syncing

// Initialize Redis connection
async function connectToRedis() {
    try {
        redisClient = createClient();
        redisClient.on('error', (error) => {
            console.error('Redis client error:', error);
        });
        await redisClient.connect();
        console.log('Connected to Redis');
    } catch (error) {
        console.error('Error connecting to Redis:', error);
    }
}

// Fetch all keys from Redis
async function getAllKeys() {
    try {
        const keys = await redisClient.keys('*'); // Fetch all keys
        return keys;
    } catch (error) {
        console.error('Error fetching all keys from Redis:', error);
        throw error;
    }
}

// Fetch user data from Redis
async function getUserDataFromRedis(id) {
    try {
        const value = await redisClient.get(`user:${id}`);
        return value ? JSON.parse(value) : null;
    } catch (error) {
        console.error(`Error fetching user data for ID ${id} from Redis:`, error);
        throw error;
    }
}

// Save user data to Redis
async function saveUserDataToRedis(userData) {
    try {
        await redisClient.set(`user:${userData.tgId}`, JSON.stringify(userData));
        // Log only when saving fails
    } catch (error) {
        console.error(`Error saving user data for ID ${userData.tgId} to Redis:`, error);
        throw error;
    }
}

// Delete user data from Redis
async function deleteUserDataFromRedis(id) {
    try {
        await redisClient.del(`user:${id}`);
        // Log only when deleting fails
    } catch (error) {
        console.error(`Error deleting user data for ID ${id} from Redis:`, error);
        throw error;
    }
}

// Fetch user data from SQL
async function getUserDataFromSQL(tgId) {
    try {
        const user = await User.findOne({ where: { tgId } });
        return user ? user.toJSON() : null;
    } catch (error) {
        console.error(`Error fetching user data for ID ${tgId} from SQL:`, error);
        throw error;
    }
}

// Save or update user data in SQL
async function saveUserDataToSQL(userData) {
    try {
        await User.upsert(userData); // upsert is used to insert or update
        // Log only when saving fails
    } catch (error) {
        console.error(`Error saving user data for ID ${userData.tgId} to SQL:`, error);
        throw error;
    }
}

module.exports = {
    connectToRedis,
    getUserDataFromRedis,
    saveUserDataToRedis,
    deleteUserDataFromRedis,
    getUserDataFromSQL,
    saveUserDataToSQL,
    getAllKeys,
};
