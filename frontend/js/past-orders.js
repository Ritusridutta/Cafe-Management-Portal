document.addEventListener("DOMContentLoaded", () => {

  const loggedIn = sessionStorage.getItem("receptionistLoggedIn");
  if (loggedIn !== "true") {
    window.location.href = "receptionist-login.html";
  }

  const container = document.getElementById("past-orders-container");

  // ================= LOAD ORDERS =================
  async function loadPastOrders() {
    try {
      const res = await fetch("/api/orders/past");
      const orders = await res.json();

      container.innerHTML = "";

      const filtered = orders
        .filter(o => o.status === "ready" || o.status === "completed")
        .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

      if (filtered.length === 0) {
        container.innerHTML = "<p class='no-orders'>No orders</p>";
        return;
      }

      // ===== GROUP BY DATE =====
      const grouped = {};

      filtered.forEach(order => {
        const dateKey = new Date(order.created_at).toDateString();

        if (!grouped[dateKey]) {
          grouped[dateKey] = [];
        }

        grouped[dateKey].push(order);
      });

      // ===== RENDER =====
      Object.keys(grouped).forEach(date => {

        const groupWrapper = document.createElement("div");
        groupWrapper.className = "date-group";

        // DATE HEADER WITH COUNT
        const dateDiv = document.createElement("div");
        dateDiv.className = "date-header";

        const count = grouped[date].length;

        dateDiv.textContent =
          `${formatDate(date)} (${count} ${count === 1 ? "order" : "orders"})`;

        // GRID
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

          card.querySelector(".details-btn")
            .addEventListener("click", () =>
              openModal(order.order_id, order.status, order.created_at)
            );

          grid.appendChild(card);
        });

        groupWrapper.appendChild(dateDiv);
        groupWrapper.appendChild(grid);
        container.appendChild(groupWrapper);
      });

    } catch (err) {
      console.error(err);
    }
  }

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
  window.openModal = async function(orderId, status, date) {

    const modal = document.createElement("div");
    modal.className = "modal";

    modal.innerHTML = `
      <div class="modal-box">
        <span class="close-btn">✖</span>

        <h2>Order Details</h2>
        <p><strong>Order ID:</strong> ${orderId}</p>
        <p><strong>Status:</strong> ${status.toUpperCase()}</p>
        <p><strong>Date:</strong> ${new Date(date).toLocaleDateString("en-GB")} ${new Date(date).toLocaleTimeString()}</p>

        <div id="modal-items">Loading...</div>
      </div>
    `;

    document.body.appendChild(modal);

    modal.querySelector(".close-btn")
      .addEventListener("click", () => closeModal(modal));

    modal.addEventListener("click", (e) => {
      if (e.target === modal) closeModal(modal);
    });

    document.onkeydown = (e) => {
      if (e.key === "Escape") closeModal(modal);
    };

    try {
      const res = await fetch(`/api/orders/items/${orderId}`);
      const items = await res.json();

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
        const t = item.price * item.quantity;
        total += t;

        html += `
          <tr>
            <td>${item.item_name}</td>
            <td>${item.category || "-"}</td>
            <td>${item.quantity}</td>
            <td>₹${t}</td>
          </tr>
        `;
      });

      html += `</table>
        <div class="modal-total">Total: ₹${total}</div>
      `;

      modal.querySelector("#modal-items").innerHTML = html;

    } catch {
      modal.querySelector("#modal-items").innerHTML = "Error loading items";
    }
  };

  function closeModal(modal) {
    modal.remove();
    document.onkeydown = null;
  }

  document.getElementById("logout-btn").onclick = () => {
    sessionStorage.removeItem("receptionistLoggedIn");
    window.location.href = "receptionist-login.html";
  };

  loadPastOrders();
});