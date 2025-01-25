const express = require("express");
const { addBankAccount, getBankAccounts, deleteBankAccount, editBankAccount} = require("../controller/bankAcc.controller");
const validateBankAccount = require('../middleware/validateBankAcc.js');
const { isAuthenticated }=require("../middleware/isAuthenticated.js");



const router = express.Router();


router.post("/api/v1/addBank",isAuthenticated,validateBankAccount,addBankAccount);
router.get("/api/v1/getOwnBankAcc",isAuthenticated,getBankAccounts);
router.put("/api/v1/update/:id",isAuthenticated,validateBankAccount,editBankAccount);
router.delete("/api/v1/delete/:id",isAuthenticated,deleteBankAccount);


module.exports = router;