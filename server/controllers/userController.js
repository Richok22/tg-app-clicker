const userService = require('../service/userService');

class UserController {
    async registration(req, res) {
        try {
            const { tgId, username, photoUrl, referralCode, is_premium } = req.body;
            const userData = await userService.registration(tgId, username, photoUrl, referralCode, is_premium);

            return res.status(200).json(userData);
        } catch (e) {
            console.error('Error during registration:', e.message);
            if (e.message === 'User already exists') {
                return res.status(400).json({ message: 'User already exists' });
            } else if (e.message === 'Referral code is invalid') {
                return res.status(400).json({ message: 'Referral code is invalid' });
            }
            return res.status(500).json({ message: `Registration failed: ${e.message}` });
        }
    }

    async load(req, res) {
        try {
            const { id } = req.params;
            const userData = await userService.findByTgId(id);

            if (userData) {
                return res.status(200).json(userData);
            } else {
                return res.status(404).json({ message: 'User not found' });
            }
        } catch (e) {
            console.error('Error loading user data:', e);
            return res.status(500).json({ message: 'Error loading user data' });
        }
    }

    async referral(req, res) {
        try {
            const { referralCode } = req.params;
            const userData = await userService.findByReferral(referralCode);

            if (userData) {
                return res.status(200).json({
                    "Balance": userData.balance,
                    "Username": userData.username,
                    "tgId": userData.tgId
                });
            } else {
                return res.status(404).json({ message: `Referral not found: ${referralCode}` });
            }
        } catch (e) {
            console.error('Error loading user data:', e);
            return res.status(500).json({ message: 'Error loading user data' });
        }
    }

    async fetchFriends(req, res) {
        try {
            const { id } = req.params; // Assuming `id` is the tgId
            const friendsData = await userService.findFriendsByTgId(id);

            if (friendsData && friendsData.length > 0) {
                return res.status(200).json(friendsData);
            } else {
                return res.status(404).json({ message: 'No friends found' });
            }
        } catch (e) {
            console.error('Error fetching friends data:', e);
            return res.status(500).json({ message: 'Error fetching friends data' });
        }
    }
}

module.exports = new UserController();
