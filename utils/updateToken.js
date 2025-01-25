const jwt = require('jsonwebtoken');
const { generateTokens } = require('./generateTokens'); // Adjust the path accordingly

// Function to verify JWT and return a promise
const verifyToken = (token, secret) => {
    return new Promise((resolve, reject) => {
        jwt.verify(token, secret, (err, decoded) => {
            if (err) {
                reject(err);
            } else {
                resolve(decoded);
            }
        });
    });
};

exports.updateToken = async (req, res) => { // Marked this function as async
    try {
        const refresh_token = req.cookies.refreshToken ;
        // console.log(refresh_token);
        const decoded = jwt.verify(
          refresh_token,
          process.env.REFRESH_TOKEN 
        ) ;

        // console.log(decoded);
  
        const message = "Could not refresh token";
        if (!decoded) {
          return next(new ErrorHandler(message, 400));
        }

  
        const accessToken = jwt.sign(
          { id: user._id },
          process.env.ACCESS_TOKEN ,
          {
            expiresIn: "1d",
          }
        );
  
        const refreshToken = jwt.sign(
          { id: user._id },
          process.env.REFRESH_TOKEN,
          {
            expiresIn: "7d",
          }
        );

  
        // req.user = user;
  
        res.cookie("accessToken", accessToken, accessTokenOptions);
        res.cookie("refresToken", refreshToken, refreshTokenOptions);

    } catch (error) {
        // Check for specific error types to handle expiration
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ message: 'Refresh token expired' });
        }
        res.status(403).json({ message: 'Invalid refresh token', error: error.message });
    }
};



// 