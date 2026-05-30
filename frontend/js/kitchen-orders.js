document.addEventListener("DOMContentLoaded", () => {

  const container = document.getElementById("orders-container");

  // ================= LOAD ORDERS =================
  async function loadOrders() {
    try {
      const res = await fetch("/api/orders/past");
      const orders = await res.json();

      container.innerHTML = "";

      // ✅ FILTER + SORT (latest first)
      const filtered = orders
        .filter(o => o.status === "ready" || o.status === "completed")
        .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

      if (filtered.length === 0) {
        container.innerHTML = "<p>No orders</p>";
        return;
      }

      // ================= GROUP BY DATE =================
      const grouped = {};

      filtered.forEach(order => {
        const dateKey = new Date(order.created_at).toDateString();

        if (!grouped[dateKey]) {
          grouped[dateKey] = [];
        }

        grouped[dateKey].push(order);
      });

      // ================= RENDER =================
      Object.keys(grouped).forEach(date => {

        // 🔥 GROUP WRAPPER (IMPORTANT FIX)
        const groupWrapper = document.createElement("div");
        groupWrapper.className = "date-group";

        // 🔥 DATE HEADER
        const dateDiv = document.createElement("div");
        dateDiv.className = "date-header";
        const orderCount = grouped[date].length;
        
        dateDiv.textContent = `${formatDate(date)} (${orderCount} ${orderCount === 1 ? "order" : "orders"})`;

        // 🔥 GRID
        const grid = document.createElement("div");
        grid.className = "orders-grid";

        grouped[date].forEach(order => {

          const card = document.createElement("div");
          card.className = "order-card";

          card.innerHTML = `
  <h3>Order #${order.order_id}</h3>

  <p><strong>Order Time:</strong> ${new Date(order.created_at).toLocaleTimeString()}</p>
  <p><strong>Completion Time:</strong> ${order.updated_at ? new Date(order.updated_at).toLocaleTimeString() : "-"}</p>
  <p><strong>Price:</strong> ₹${order.total}</p>

  <button class="details-btn">View Details</button>
`;

          // ✅ BUTTON CLICK
          card.querySelector(".details-btn")
            .addEventListener("click", () => openModal(order.order_id));

          grid.appendChild(card);
        });

        // ✅ APPEND PROPER STRUCTURE
        groupWrapper.appendChild(dateDiv);
        groupWrapper.appendChild(grid);

        container.appendChild(groupWrapper);
      });

    } catch (err) {
      console.error(err);
      container.innerHTML = "<p>Error loading orders</p>";
    }
  }

  // ================= DATE FORMAT =================
  function formatDate(dateStr) {
    const date = new Date(dateStr);

    return date.toLocaleDateString("en-IN", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric"
    });
  }

  // ================= MODAL =================
  window.openModal = async function(orderId) {

    const modal = document.createElement("div");
    modal.className = "modal";

    modal.innerHTML = `
      <div class="modal-box">
        <span class="close-btn">✖</span>
        <h2>Order #${orderId}</h2>
        <div id="modal-items">Loading...</div>
      </div>
    `;

    document.body.appendChild(modal);

    // ✅ CLOSE BUTTON
    modal.querySelector(".close-btn")
      .addEventListener("click", () => closeModal(modal));

    // ✅ OUTSIDE CLICK
    modal.addEventListener("click", (e) => {
      if (e.target === modal) {
        closeModal(modal);
      }
    });

    // ✅ ESC KEY
    document.onkeydown = (e) => {
      if (e.key === "Escape") {
        closeModal(modal);
      }
    };

    // ================= FETCH ITEMS =================
    try {
      const res = await fetch(`/api/orders/items/${orderId}`);
      const items = await res.json();

      if (!items || items.length === 0) {
        modal.querySelector("#modal-items").innerHTML = "<p>No items found</p>";
        return;
      }

      let total = 0;

      let html = `
        <table class="items-table">
          <tr>
            <th>Item</th>
            <th>Category</th>
            <th>Qty</th>
            <th>Price</th>
          </tr>
      `;

      items.forEach(item => {
        const itemTotal = item.price * item.quantity;
        total += itemTotal;

        html += `
          <tr>
            <td>${item.item_name}</td>
            <td>${item.category || "-"}</td>
            <td>${item.quantity}</td>
            <td>₹${itemTotal}</td>
          </tr>
        `;
      });

      html += `</table>
        <div class="modal-total">Total ₹${total}</div>
      `;

      modal.querySelector("#modal-items").innerHTML = html;

    } catch (err) {
      modal.querySelector("#modal-items").innerHTML = "<p>Error loading items</p>";
    }
  };

  // ================= CLOSE MODAL =================
  function closeModal(modal) {
    if (modal) modal.remove();
    document.onkeydown = null; // cleanup ESC listener
  }

  // ================= INIT =================
  loadOrders();
});