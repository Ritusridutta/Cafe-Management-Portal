const db = require("../config/db");
const bcrypt = require("bcrypt");

// ================= REGISTER =================
exports.register = async (req, res) => {
  try {
    const { name, email, password, phone, city, address } = req.body;

    if (!name || !email || !password || !phone) {
      return res.status(400).json({ message: "All fields required" });
    }

    db.query("SELECT * FROM users WHERE email = ?", [email], async (err, result) => {
      if (result.length > 0) {
        return res.status(400).json({ message: "User already exists" });
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      db.query(
        "INSERT INTO users (name, email, password, phone, city, address) VALUES (?, ?, ?, ?, ?, ?)",
        [name, email, hashedPassword, phone, city, address],
        (err, result) => {
          if (err) return res.status(500).json(err);

          res.json({
            message: "User registered successfully",
            user: {
              id: result.insertId,
              name,
              email,
              phone   // 🔥 ADDED
            }
          });
        }
      );
    });

  } catch (err) {
    res.status(500).json(err);
  }
};


// ================= LOGIN =================
exports.login = (req, res) => {
  const { email, password } = req.body;

  db.query("SELECT * FROM users WHERE email = ?", [email], async (err, result) => {

    if (result.length === 0) {
      return res.status(400).json({ message: "User not found" });
    }

    const user = result[0];

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid password" });
    }

    res.json({
      message: "Login successful",
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone   // 🔥 ADDED
      }
    });
  });
};


// ================= GET USER =================
exports.getUser = (req, res) => {
  const { email } = req.params;

  db.query(
    "SELECT name, email, phone, city, address FROM users WHERE email=?",
    [email],
    (err, result) => {
      if (err) return res.status(500).json(err);
      res.json(result[0]);
    }
  );
};


// ================= UPDATE USER =================
exports.updateUser = (req, res) => {
  const { email, name, phone, city, address, oldPassword, newPassword } = req.body;

  db.query("SELECT * FROM users WHERE email=?", [email], async (err, result) => {
    if (err) return res.status(500).json(err);

    const user = result[0];

    // 🔥 PASSWORD CHANGE
    if (newPassword) {

      if (!oldPassword) {
        return res.status(400).json({ message: "Old password required" });
      }

      const match = await bcrypt.compare(oldPassword, user.password);

      if (!match) {
        return res.status(400).json({ message: "Incorrect old password" });
      }

      const hashed = await bcrypt.hash(newPassword, 10);

      db.query(
        "UPDATE users SET name=?, phone=?, city=?, address=?, password=? WHERE email=?",
        [name, phone, city, address, hashed, email],
        (err) => {
          if (err) return res.status(500).json(err);
          res.json({ message: "Profile updated with password" });
        }
      );

    } else {
      // 🔥 WITHOUT PASSWORD
      db.query(
        "UPDATE users SET name=?, phone=?, city=?, address=? WHERE email=?",
        [name, phone, city, address, email],
        (err) => {
          if (err) return res.status(500).json(err);
          res.json({ message: "Profile updated" });
        }
      );
    }
  });
};