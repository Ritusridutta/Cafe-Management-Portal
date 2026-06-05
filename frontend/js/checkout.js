document.addEventListener("DOMContentLoaded", () => {

  const orderItemsBox = document.getElementById("order-items");
  const totalItemsEl = document.getElementById("summary-items");
  const grandTotalEl = document.getElementById("summary-total");
  const placeOrderBtn = document.getElementById("place-order-btn");

  const fullNameInput = document.getElementById("full-name");
  const emailInput = document.getElementById("email");
  const phoneInput = document.getElementById("phone");

  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  const user = JSON.parse(sessionStorage.getItem("user"));

  // ================= AUTO-FILL USER =================
  if (user) {
    fullNameInput.value = user.name || "";
    emailInput.value = user.email || "";
    phoneInput.value = user.phone || "";
  } else {
    // Disable button if not logged in
    placeOrderBtn.disabled = true;
  }

  // ================= RENDER ORDER SUMMARY =================
  function renderOrderSummary() {

    if (cart.length === 0) {
      orderItemsBox.innerHTML = "<p>No items in cart</p>";
      totalItemsEl.textContent = 0;
      grandTotalEl.textContent = 0;
      placeOrderBtn.disabled = true;
      return;
    }

    orderItemsBox.innerHTML = "";

    let totalItems = 0;
    let grandTotal = 0;

    cart.forEach(item => {
      const itemTotal = item.price * item.qty;
      totalItems += item.qty;
      grandTotal += itemTotal;

      const row = document.createElement("div");
      row.style.display = "flex";
      row.style.justifyContent = "space-between";
      row.style.marginBottom = "8px";

      row.innerHTML = `
        <span>${item.name} × ${item.qty}</span>
        <span>₹${itemTotal}</span>
      `;

      orderItemsBox.appendChild(row);
    });

    totalItemsEl.textContent = totalItems;
    grandTotalEl.textContent = grandTotal;
  }

  // ================= PLACE ORDER =================
  placeOrderBtn.addEventListener("click", async () => {

    // 🔒 BLOCK IF NOT LOGGED IN
    if (!user) {
      alert("Please login to order items");
      window.location.href = "/user/login.html";
      return;
    }

    const name = fullNameInput.value.trim();
    const email = emailInput.value.trim();
    const phone = phoneInput.value.trim();

    if (!name || !email || !phone) {
      alert("❗ Please fill all the required fields");
      return;
    }

    if (cart.length === 0) {
      alert("Cart is empty!");
      return;
    }

    const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);

    try {
      const res = await fetch("/api/orders/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          user_email: email,
          items: cart,
          total
        })
      });

      const data = await res.json();

      // Save order
      localStorage.setItem("lastOrder", JSON.stringify(data));

      // Clear cart
      localStorage.removeItem("cart");

      // Redirect
      window.location.href = "checkout-success.html";

    } catch (err) {
      console.error(err);
      alert("Server error. Try again.");
    }
  });

  // ================= INIT =================
  renderOrderSummary();
});