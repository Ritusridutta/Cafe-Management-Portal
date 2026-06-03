const db = require("../config/db");
const sendOrderEmail = require("../utils/sendEmail");

function generateOrderId() {
  return "ORD" + Date.now();
}

// ================= CREATE ORDER =================
exports.createOrder = (req, res) => {
  const { user_email, items, total } = req.body;

  if (!user_email || !items || items.length === 0) {
    return res.status(400).json({ message: "Invalid data" });
  }

  const orderId = generateOrderId();

  db.query(
    "INSERT INTO orders (order_id, user_email, total, status) VALUES (?, ?, ?, ?)",
    [orderId, user_email, total, "placed"],
    (err) => {
      if (err) {
        console.error(err);
        return res.status(500).json(err);
      }

      // 🔥 INCLUDE CATEGORY
      const values = items.map(item => [
        orderId,
        item.name,
        item.category,
        item.price,
        item.qty
      ]);

      db.query(
        "INSERT INTO order_items (order_id, item_name, category, price, quantity) VALUES ?",
        [values],
        async (err) => {
          if (err) {
            console.error(err);
            return res.status(500).json(err);
          }

          // ================= SEND EMAIL =================
          try {
            const orderData = {
              order_id: orderId,
              items,
              total
            };

            await sendOrderEmail(user_email, orderData);
          } catch (emailErr) {
            console.error("Email failed:", emailErr);
          }

          // ================= RESPONSE =================
          res.json({
            message: "Order placed successfully",
            order_id: orderId,
            items
          });
        }
      );
    }
  );
};

// ================= GET USER ORDERS =================
exports.getUserOrders = (req, res) => {
  const email = req.params.userEmail;

  db.query(
    `SELECT * FROM orders 
     WHERE user_email = ? 
     ORDER BY created_at DESC`,
    [email],
    (err, results) => {
      if (err) return res.status(500).json(err);
      res.json(results);
    }
  );
};

// ================= ACTIVE =================
exports.getActiveOrders = (req, res) => {
  db.query(
    `SELECT * FROM orders 
     WHERE status != 'completed' 
     ORDER BY created_at DESC`,
    (err, results) => {
      if (err) return res.status(500).json(err);
      res.json(results);
    }
  );
};

// ================= PAST =================
exports.getPastOrders = (req, res) => {
  db.query(
    `SELECT * FROM orders 
     WHERE status = 'completed' 
     ORDER BY created_at DESC`,
    (err, results) => {
      if (err) return res.status(500).json(err);
      res.json(results);
    }
  );
};

// ================= UPDATE =================
exports.updateOrderStatus = (req, res) => {

  const { status } = req.body;
  const { id } = req.params;

  db.query(
    "UPDATE orders SET status = ? WHERE order_id = ?",
    [status, id],
    (err, result) => {

      if (err) {

        console.error(err);

        return res.status(500).json(err);
      }

      if (result.affectedRows === 0) {

        return res.status(404).json({
          message: "Order not found"
        });
      }

      res.json({
        message: "Status updated successfully"
      });
    }
  );
};

// ================= GET ORDER ITEMS =================
exports.getOrderItems = (req, res) => {
  const orderId = req.params.orderId;

  db.query(
    `SELECT 
      item_name,
      quantity,
      price,
      category
     FROM order_items
     WHERE order_id = ?`,
    [orderId],
    (err, results) => {
      if (err) {
        console.error(err);
        return res.status(500).json(err);
      }

      res.json(results);
    }
  );
};