const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const  BankAccount  = require('../model/BankAccount');


const ADMIN_CREDENTIALS = {
    username: "admin",
    password: "admin", // Password can be hashed for better security
  };


exports.adminLogin = async (req, res) => {
    try {
      const { username, password } = req.body;
  
      // Check if username matches
      if (username !== ADMIN_CREDENTIALS.username) {
        return res.status(401).json({ message: "Invalid username or password" });
      }
  
      // Check if password matches
      const isPasswordValid = await bcrypt.compare(
        password,
        bcrypt.hashSync(ADMIN_CREDENTIALS.password, 10) // Hashing hardcoded password for comparison
      );
      if (!isPasswordValid) {
        return res.status(401).json({ message: "Invalid username or password" });
      }
  
    //   // Generate JWT token
    //   const token = jwt.sign({ username }, process.env.JWT_SECRET, {
    //     expiresIn: "1h",
    //   });
  
    //   res.cookie("token", token);
  
      res.status(200).json({ message: "Login successful"});
    } catch (error) {
      console.error("Error during admin login:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  };

exports.getAllUserBankAccounts = async (req, res) => {
    try {

        const accounts = await BankAccount.find();
        res.status(200).json({accounts:accounts});
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving all bank accounts', error });
    }
};

// Admin: Search and filter
exports.searchBankAccounts = async (req, res) => {
    try {
        const { query } = req.query;
        const accounts = await BankAccount.find({
          $or: [
              { bankName: { $regex: query, $options: 'i' } },
              { accountHolderName: { $regex: query, $options: 'i' } },
              { ifscCode: { $regex: query, $options: 'i' } },
              { accountNumber: { $regex: query, $options: 'i' } },
              { branchName: { $regex: query, $options: 'i' } },
          ]
      });
      
        res.status(200).json({accounts:accounts});
    } catch (error) {
        res.status(500).json({ message: 'Error searching bank accounts', error });
    }
};
