document.addEventListener("DOMContentLoaded", () => {

  const orderIdEl = document.getElementById("order-id");
  const orderItemsBox = document.getElementById("order-items");
  const totalItemsEl = document.getElementById("total-items");
  const grandTotalEl = document.getElementById("grand-total");

  // Retrieve saved order
  const order = JSON.parse(localStorage.getItem("lastOrder"));

  if (!order) {
    orderItemsBox.innerHTML = "<p>No order details found.</p>";
    return;
  }

  orderIdEl.textContent = order.order_id;

  let totalItems = 0;
  let grandTotal = 0;

  order.items.forEach(item => {
    const itemTotal = item.price * item.qty;
    totalItems += item.qty;
    grandTotal += itemTotal;

    const row = document.createElement("div");
    row.style.display = "flex";
    row.style.justifyContent = "space-between";

    row.innerHTML = `
      <span>${item.name} × ${item.qty}</span>
      <span>₹${itemTotal}</span>
    `;

    orderItemsBox.appendChild(row);
  });

  totalItemsEl.textContent = totalItems;
  grandTotalEl.textContent = grandTotal;

  // Clear order after displaying
  localStorage.removeItem("lastOrder");
});
