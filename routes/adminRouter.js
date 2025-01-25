const express = require("express");
const { adminLogin, getAllUserBankAccounts, searchBankAccounts } = require("../controller/admin.controller");

const router = express.Router();

// Admin login route
router.post("/api/admin/login", adminLogin);

router.get("/api/admin/getAllBank", getAllUserBankAccounts);

router.get("/api/admin/search",searchBankAccounts);

module.exports = router;
