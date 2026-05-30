const express = require("express");
const router = express.Router();

const {
  getMenu,
  addItem,
  updateItem,
  deleteItem
} = require("../controllers/menuController");

const upload = require("../middleware/upload");

router.get("/", getMenu);

// ✅ ADD (already correct)
router.post("/", upload.single("image"), addItem);

// 🔥 FIX: ADD multer here
router.put("/:id", upload.single("image"), updateItem);

router.delete("/:id", deleteItem);

module.exports = router;