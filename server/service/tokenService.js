const { SignJWT } = require('jose'); // Ensure correct import from 'jose'
const User = require('../model/userModel');

class TokenService {
    generateToken(payload) {
        // Create a new instance of SignJWT with the payload
        const accessToken = new SignJWT(payload)
            .setProtectedHeader({ alg: 'HS256' }) // Set the algorithm (example: HS256)
            .setExpirationTime('30d') // Set expiration time for access token
            .sign(Buffer.from(process.env.ACCESS_KEY, 'utf-8')); // Sign with the access key

        const refreshToken = new SignJWT(payload)
            .setProtectedHeader({ alg: 'HS256' }) // Set the algorithm
            .setExpirationTime('60d') // Set expiration time for refresh token
            .sign(Buffer.from(process.env.REFRESH_KEY, 'utf-8')); // Sign with the refresh key

        return {
            accessToken,
            refreshToken
        };
    }

    async saveToken(userId, refreshToken) {
        const tokenData = await User.findOne({ where: { id: userId } });

        if (tokenData) {
            tokenData.refreshToken = refreshToken;
            return tokenData.save();
        }

        const token = await User.create({ id: userId, refreshToken });
        return token;
    }
}

module.exports = new TokenService();
