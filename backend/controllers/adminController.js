const db = require("../config/db");

// LOGIN
exports.login = (req, res) => {
  const { email, password } = req.body;

  const query = "SELECT * FROM admins WHERE email = ?";

  db.query(query, [email], (err, result) => {
    if (err) return res.status(500).json(err);

    if (result.length === 0) {
      return res.status(401).json({ message: "Admin not found" });
    }

    const admin = result[0];

    if (admin.password !== password) {
      return res.status(401).json({ message: "Wrong password" });
    }

    res.json({ message: "Login successful", adminId: admin.id });
  });
};