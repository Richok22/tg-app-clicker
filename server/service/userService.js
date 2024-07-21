const User = require('../model/userModel');
const sequelize = require('../db_sql');
const config = require('../config.json')

class UserService {
    async registration(tgId, username, photoUrl, referralCode, is_premium) {
        try {
            tgId = Number(tgId); // Convert tgId to number

            // Log the parameters received
            console.log('Registration parameters:', {
                tgId,
                username,
                photoUrl,
                referralCode,
                is_premium
            });

            // Check if user with tgId already exists
            const existingUser = await User.findByPk(tgId);
            if (existingUser) {
                console.log(`User with tgId ${tgId} already exists.`);
                throw new Error('User already exists');
            }

            // Set initial balance
            let initialBalance = is_premium ? config.default_values.premiumBonus : 0;

            // Create new user
            const newUser = await User.create({
                tgId,
                username,
                photoUrl,
                balance: initialBalance,
                is_premium
            });

            console.log(`New user created with tgId ${tgId}.`);

            if (referralCode) {
                // Find referrer by referral code
                const referrer = await User.findOne({ where: { referralCode } });
                if (referrer) {
                    // Update the referrer's friends list using JSON_ARRAY_APPEND
                    await User.update(
                        {
                            friends: sequelize.fn('JSON_ARRAY_APPEND', sequelize.col('friends'), '$', tgId)
                        },
                        {
                            where: { tgId: referrer.tgId }
                        }
                    );
                    console.log(`Added tgId ${tgId} to referrer's friends list.`);

                    // Update the referrer's balance
                    await referrer.update({ balance: referrer.balance + config.default_values.referralCoins });
                    console.log(`Updated referrer's balance by ${config.default_values.referralCoins}.`);

                    // Update the new user's balance by 1000 coins for using a referral code
                    await newUser.update({ balance: newUser.balance + config.default_values.referralBonus });
                    console.log(`Updated new user's balance by 1000 coins for using referral code.`);
                } else {
                    console.warn('Invalid referral code:', referralCode);
                }
            } else {
                console.log('No referral code provided.');
            }

            return newUser;
        } catch (error) {
            console.error('Detailed error:', error);
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
