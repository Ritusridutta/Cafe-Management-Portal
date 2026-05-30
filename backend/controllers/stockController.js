const db = require("../config/db");

// GET STOCK
exports.getStock = (req, res) => {
  db.query("SELECT * FROM raw_items", (err, result) => {
    if (err) return res.status(500).json(err);
    res.json(result);
  });
};

// UPDATE STOCK
exports.updateStock = (req, res) => {
  const { id } = req.params;
  const { stock } = req.body;

  db.query(
    "UPDATE raw_items SET stock=? WHERE id=?",
    [stock, id],
    (err) => {
      if (err) return res.status(500).json(err);
      res.json({ message: "Stock updated" });
    }
  );
};