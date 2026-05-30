const express = require("express");
const router = express.Router();

const {
  createOrder,
  getActiveOrders,
  getPastOrders,
  updateOrderStatus,
  getUserOrders,
  getOrderItems
} = require("../controllers/orderController");

// USER
router.post("/create", createOrder);

// ✅ USE EMAIL
router.get("/user/:userEmail", getUserOrders);

router.get("/items/:orderId", getOrderItems);

// RECEPTIONIST
router.get("/active", getActiveOrders);
router.get("/past", getPastOrders);

// UPDATE
router.put("/:id/status", updateOrderStatus);

module.exports = router;