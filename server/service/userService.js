const User = require('../model/userModel');

class UserService {
    async registration(tgId, username, photoUrl) {
        try {
            const [user, created] = await User.findOrCreate({
                where: { tgId },
                defaults: {
                    username,
                    photoUrl,
                    tgId,
                }
            });

            console.log(created ? 'New user created:' : 'Existing user found:',);
            return { user, created };
        } catch (error) {
            console.error('Error in user registration:', error);
            throw error;
        }
    }

    async findByTgId(tgId) {
        try {
            const user = await User.findByPk(tgId);
            return user;
        } catch (error) {
            console.error('Error finding user:', error);
            throw error;
        }
    }
}

module.exports = new UserService();