const jwt = require('jsonwebtoken');
const BankAccount = require('../model/BankAccount'); // Adjust the path accordingly

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

exports.addBankAccount = async (req, res) => {
    try {
        const token = req.cookies.accessToken;

        if (!token) {
            return res.status(401).json({ message: 'Access denied. No token provided.' });
        }

        // Verify the token asynchronously
        const decoded = await verifyToken(token, process.env.JWT_SECRET);

        const { ifscCode, branchName, bankName, accountNumber, accountHolderName } = req.body;
        
        // Create the bank account with the user ID from the decoded token
        const newAccount = await BankAccount.create({
            ifscCode,
            branchName,
            bankName,
            accountNumber,
            accountHolderName,
            user: decoded.id // Attach the user ID from the token
        });

        res.status(201).json({ message: 'Bank account added successfully', newAccount });
    } catch (error) {
        res.status(500).json({ message: 'Error adding bank account', error });
    }
};


// View bank accounts
exports.getBankAccounts = async (req, res) => {
    try {
        const token = req.cookies.accessToken;

        if (!token) {
            return res.status(401).json({ message: 'Access denied. No token provided.' });
        }

        // Verify the token asynchronously
        const decoded = await verifyToken(token, process.env.JWT_SECRET);
        const accounts = await BankAccount.find({ user: decoded.id });
        res.status(200).json(accounts);
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving bank accounts', error });
    }
};

// Edit bank account
exports.editBankAccount = async (req, res) => {
    try {
        const { id } = req.params;
        const updatedData = req.body;
        await BankAccount.findByIdAndUpdate(id,updatedData);
        res.status(200).json({ message: 'Bank account updated successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error updating bank account', error });
    }
};

// Remove bank account
exports.deleteBankAccount = async (req, res) => {
    try {
        const { id } = req.params;
        await BankAccount.findByIdAndDelete(id);
        res.status(200).json({ message: 'Bank account deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting bank account', error });
    }
};