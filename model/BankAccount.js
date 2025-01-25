const mongoose = require('mongoose');

// Bank Account Schema
const bankAccountSchema = new mongoose.Schema({
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    ifscCode: {
      type: String,
      required: true,
      // trim: true,
      uppercase: true
    },
    branchName: {
      type: String,
      required: true,
      // trim: true
    },
    bankName: {
      type: String,
      required: true,
      // trim: true
    },
    accountNumber: {
      type: String,
      required: true,
      unique: true,
      // trim: true
    },
    accountHolderName: {
      type: String,
      required: true,
      // trim: true
    }
  }, { timestamps: true });
  

const BankAccount = mongoose.model('BankAccount', bankAccountSchema);

module.exports = BankAccount ;
