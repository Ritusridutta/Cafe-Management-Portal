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

router.post("/", upload.single("image"), addItem);

router.put("/:id", upload.single("image"), updateItem);

router.delete("/:id", deleteItem);

module.exports = router;