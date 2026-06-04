const db = require("../config/db");

// ================= GET MENU =================
exports.getMenu = (req, res) => {
  db.query("SELECT * FROM menu_items", (err, result) => {
    if (err) return res.status(500).json(err);
    res.json(result);
  });
};

// ================= ADD ITEM =================
exports.addItem = (req, res) => {
  const { name, price, category } = req.body;

  const image = req.file ? req.file.path : null;

  db.query(
    "INSERT INTO menu_items (name, price, category, image) VALUES (?, ?, ?, ?)",
    [name, price, category, image],
    (err) => {
      if (err) return res.status(500).json(err);
      res.json({ message: "Item added" });
    }
  );
};

// ================= UPDATE ITEM =================
exports.updateItem = (req, res) => {
  const { id } = req.params;
  const { name, price, category } = req.body;

  // 🔥 If new image uploaded
  if (req.file) {

    const newImage = req.file.path;

    // 🔥 First get old image
    db.query(
      "SELECT image FROM menu_items WHERE id=?",
      [id],
      (err, result) => {
        if (err) return res.status(500).json(err);

        // 🔥 Update with new image
        db.query(
          "UPDATE menu_items SET name=?, price=?, category=?, image=? WHERE id=?",
          [name, price, category, newImage, id],
          (err) => {
            if (err) return res.status(500).json(err);
            res.json({ message: "Updated with new image" });
          }
        );
      }
    );

  } else {
    // 🔥 No image → update only text
    db.query(
      "UPDATE menu_items SET name=?, price=?, category=? WHERE id=?",
      [name, price, category, id],
      (err) => {
        if (err) return res.status(500).json(err);
        res.json({ message: "Updated" });
      }
    );
  }
};

// ================= DELETE ITEM =================
exports.deleteItem = (req, res) => {
  const { id } = req.params;

  // 🔥 Get image first
  db.query(
    "SELECT image FROM menu_items WHERE id=?",
    [id],
    (err, result) => {
      if (err) return res.status(500).json(err);

      // 🔥 Delete DB record
      db.query("DELETE FROM menu_items WHERE id=?", [id], (err) => {
        if (err) return res.status(500).json(err);
        res.json({ message: "Deleted" });
      });
    }
  );
};