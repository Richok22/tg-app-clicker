const User = require('../model/userModel');
const sequelize = require('../db_sql');
const config = require('../config.json');
const TokenService = require('./tokenService'); // Import the TokenService

class UserService {
    async registration(tgId, username, photoUrl, referralCode, is_premium) {
        try {
            tgId = Number(tgId);

            // Check if user with tgId already exists
            const existingUser = await User.findByPk(tgId);
            if (existingUser) {
                throw new Error('User already exists');
            }

            // Set initial balance
            let initialBalance = is_premium ? config.default_values.premiumBonus : 0;

            // Generate JWT tokens
            const tokens = await TokenService.generateToken({ tgId });

            // Create new user with tokens
            const newUser = await User.create({
                tgId,
                username,
                photoUrl,
                balance: initialBalance,
                is_premium,
                accessToken: tokens.accessToken, // Ensure this is a string
                refreshToken: tokens.refreshToken  // Ensure this is a string
            });

            // Handle referral code logic if applicable...

            return { newUser, tokens };
        } catch (error) {
            console.error('Registration failed:', error);
            throw new Error(`Registration failed: ${error.message}`);
        }
    }

    async findByTgId(tgId) {
        try {
            const user = await User.findByPk(tgId);
            return user;
        } catch (error) {
            console.error('Error loading user data:', error);
            throw new Error('Failed to load user data');
        }
    }

    async findByReferral(referralCode) {
        try {
            const user = await User.findOne({ where: { referralCode } });
            return user;
        } catch (error) {
            console.error('Error finding user by referral code:', error);
            throw new Error('Failed to find user by referral code');
        }
    }

    async findFriendsByTgId(tgId) {
        try {
            // Find the user by tgId
            const user = await User.findByPk(tgId);
            if (!user) {
                throw new Error('User not found');
            }

            console.log(`User found: ${JSON.stringify(user)}`);

            // Parse the friends' array
            const friendIds = JSON.parse(user.friends);
            console.log(`Friends IDs: ${JSON.stringify(friendIds)}`);

            if (friendIds.length === 0) {
                return [];
            }

            // Fetch details for each friend
            const friendsDetails = await User.findAll({
                where: {
                    tgId: friendIds
                },
                attributes: ['username', 'balance', 'tgId']
            });

            console.log(`Friends details: ${JSON.stringify(friendsDetails)}`);

            return friendsDetails;
        } catch (error) {
            console.error('Error finding friends:', error);
            throw new Error('Failed to fetch friends');
        }
    }
}

module.exports = new UserService();
