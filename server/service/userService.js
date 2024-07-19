const { User } = require('../model/userModel');
const { v4: uuidv4 } = require('uuid');

class UserService {
    async registration(tgId, username, photoUrl) {
        try {
            const existingUser = await User.findOne({ where: { tgId } });
            if (existingUser) {
                return { user: existingUser, created: false };
            }

            const newUser = await User.create({
                tgId,
                username,
                photoUrl,
                referralCode: uuidv4()
            });

            return { user: newUser, created: true };
        } catch (error) {
            return { error: error.message, created: false };
        }
    }

    async findByTgId(tgId) {
        try {
            const user = await User.findOne({ where: { tgId } });
            return user || null;
        } catch (error) {
            console.error('Error finding user:', error);
            throw new Error('Error retrieving user data');
        }
    }
}


module.exports = new UserService();
