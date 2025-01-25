const jwt = require('jsonwebtoken');
const { generateTokens } = require('../utils/generateTokens');
const { updateToken } = require('../utils/updateToken');

exports.isAuthenticated = (req, res, next) => {
    const token = req.cookies.accessToken;

    if (!token ) {
        return res.status(401).json({ message: 'Access denied. No token provided.' });
    }


    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {

            if (err.name === 'TokenExpiredError') {
                return res.status(401).json({ message: 'Token expired' });
            }
            return res.status(403).json({ message: 'Invalid token' });
        }


        req.user = decoded;
        if(decoded.exp<=Date.now()/1000){
            updateToken(req,res);
        }
        next(); // Proceed to the next middleware or route handler
    });
};
