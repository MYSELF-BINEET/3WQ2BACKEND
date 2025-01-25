const bcrypt = require('bcryptjs');
const User = require('../model/User');
const { generateTokens }=require("../utils/generateTokens");
const cloudinary = require('cloudinary').v2;
const jwt = require('jsonwebtoken');

exports.register = async (req, res) => {
    try {
        const { username, email, password } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await User.create({ username:username, email:email, password: hashedPassword });
        newUser.save();
        res.status(201).json({ message: 'User registered successfully', user: newUser });
    } catch (error) {
        res.status(500).json({ message: 'Error registering user', error });
    }
};

// User login
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email: email });

        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Generate tokens for the user
        const tokens = generateTokens(user);

        // Set the tokens in cookies (accessToken and refreshToken)
        res.cookie('accessToken', tokens.accessToken, {  
            secure: true, 
            sameSite: "None",// Only send cookies over HTTPS in production
            maxAge: 1 * 24 * 60 * 60 * 1000 // 15 minutes expiration for access token
        });
        res.cookie('refreshToken', tokens.refreshToken, {   
            secure: true,
            sameSite: "None", // Only send cookies over HTTPS in production
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days expiration for refresh token
        });

        res.status(200).json({ message: 'Login successful' ,data:tokens});
    } catch (error) {
        res.status(500).json({ message: 'Error logging in', error });
    }
};

exports.logout=async(req,res)=>{
    try {
        res.cookie("access_token", "", { maxAge: 0 });
        res.cookie("refresh_token", "", { maxAge: 0 });


        res.status(200).json({
          success: true,
          message: "Logged out successfully",
        });
      } catch (error) {
        return next(new ErrorHandler(error.message, 400));
      }
}

exports.me=async(req,res)=>{
    try{
        const token = req.cookies.accessToken;

        if (!token) {
            return res.status(401).json({ message: 'Access denied. No token provided.' });
        }

        // Verify the token asynchronously
        const decoded = await jwt.verify(token, process.env.JWT_SECRET);

        const user=await User.findById(decoded.id);

        res.status(200).json({ 
            message: 'Acc Fetch Successfully', 
             user
        })

    }catch(error){
        console.log(error);
    }
}



exports.profilePic = async (req, res) => {
    try {
        const token = req.cookies.accessToken;

        if (!token) {
            return res.status(401).json({ message: 'Access denied. No token provided.' });
        }

        // Verify the token asynchronously
        const decoded = await jwt.verify(token, process.env.JWT_SECRET);

        const imagePath=req.file.path;


        const user=await User.findByIdAndUpdate(decoded.id,{profilePhoto:imagePath},{new:true})
        

        res.status(200).json({ 
            message: 'Profile photo uploaded successfully', 
             user
        });

    } catch (error) {
        console.error("Server Error:", error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};