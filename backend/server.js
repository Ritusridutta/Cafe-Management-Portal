require("dotenv").config();

const express = require("express");
const cors = require("cors");
const path = require("path");

const db = require("./config/db");
const initDB = require("./models/initDB");

// Routes
const orderRoutes = require("./routes/orderRoutes");
const menuRoutes = require("./routes/menuRoutes");
const adminRoutes = require("./routes/adminRoutes");
const stockRoutes = require("./routes/stockRoutes");
const authRoutes = require("./routes/authRoutes");

const app = express();

// ================= MIDDLEWARE =================
app.use(cors());
app.use(express.json());

// ================= DB CONNECTION =================
db.connect((err) => {

  if (err) {

    console.error("DB Connection Failed:", err);

  } else {

    console.log("MySQL Connected ✅");

    initDB();
  }
});

// ================= STATIC FILES =================
app.use("/uploads", express.static("uploads"));

// ================= API ROUTES =================
app.use("/api/orders", orderRoutes);
app.use("/api/menu", menuRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/stock", stockRoutes);
app.use("/api/auth", authRoutes);

// ================= USER PAGE REDIRECT FIX =================
app.get("/:page", (req, res, next) => {

  const allowedPages = [

    "index.html",
    "about.html",
    "gallery.html",
    "menu.html",
    "cart.html",
    "contact.html",

    "login.html",
    "register.html",

    "checkout.html",
    "checkout-success.html",

    "my-orders.html",
    "account.html"

  ];

  const page = req.params.page;

  if (allowedPages.includes(page)) {

    return res.redirect(`/user/${page}`);
  }

  next();
});

// ================= FRONTEND =================
app.use(
  express.static(
    path.join(__dirname, "../frontend")
  )
);

// ================= HOME ROUTE =================
app.get("/", (req, res) => {

  res.sendFile(
    path.join(
      __dirname,
      "../frontend/user/index.html"
    )
  );
});

// ================= ERROR HANDLER =================
app.use((err, req, res, next) => {

  console.error(err.stack);

  res.status(500).json({
    message: "Something went wrong"
  });
});

// ================= SERVER =================
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {

  console.log(
    `Server running on port ${PORT}`
  );
});