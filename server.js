const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const userRoutes=require("./routes/userRouter")
const bankRoutes=require("./routes/bankRouter");
const adminRoutes=require("./routes/adminRouter");
const cookieParser = require("cookie-parser");
// import cors from 'cors'
const cors =require("cors");

dotenv.config();

const app = express();
app.use(express.json());
app.use(express.urlencoded({extended:true}));


//cookie-parser
app.use(cookieParser());

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

app.use(cors({
    origin:["https://bankmegathreewsols.netlify.app"],
    methods:'GET,POST,PUT,DELETE',
    credentials: true,
}));

// MongoDB connection

// Routes
app.use(userRoutes);
app.use(bankRoutes);
app.use(adminRoutes);

app.get("/test", (req, res) => {
  res.json({
    message: "All ok",
    success: true,
  });
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
