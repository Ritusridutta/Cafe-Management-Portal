const express = require("express");
const router = express.Router();

const {
  register,
  login,
  getUser,
  updateUser
} = require("../controllers/authController");

// 🔥 ACCOUNT ROUTES
router.get("/user/:email", getUser);
router.put("/update", updateUser);

// 🔥 AUTH
router.post("/register", register);
router.post("/login", login);

module.exports = router;