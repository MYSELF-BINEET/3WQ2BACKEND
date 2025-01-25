const jwt = require('jsonwebtoken');

exports.generateTokens = (user) => {
    try {
        if (!user || !user.id) {
            throw new Error('Invalid user object');
        }

        const accessToken = jwt.sign(
            { id: user.id, email: user.email }, 
            process.env.JWT_SECRET, 
            { expiresIn: '1d' }
        );

        const refreshToken = jwt.sign(
            { id: user.id, email: user.email }, 
            process.env.JWT_REFRESH_SECRET, 
            { expiresIn: '7d' }
        );

        return { accessToken, refreshToken };
    } catch (error) {
        console.error('Error generating tokens:', error.message);
        throw new Error('Token generation failed');
    }
};
