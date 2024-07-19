const userService = require('../service/userService');

class userController {
    async registration(req, res) {
        try {
            const { tgId, username, photoUrl } = req.body;
            const userData = await userService.registration(tgId, username, photoUrl);

            return res.status(200).json(userData);
        } catch (e) {
            console.error(e);
            return res.status(500).json({ message: 'Registration failed' });
        }
    }

    async load(req, res) {
        try {
            const { id } = req.params; // Get ID from route params
            const userData = await userService.findByTgId(id); // Fetch user data

            if (userData) {
                return res.status(200).json(userData);
            } else {
                return res.status(404).json({ message: 'User not found' });
            }
        } catch (e) {
            console.error(e);
            return res.status(500).json({ message: 'Error loading user data' });
        }
    }

}

module.exports = new userController();
