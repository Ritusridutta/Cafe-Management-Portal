document.addEventListener("DOMContentLoaded", () => {

  const loggedIn = sessionStorage.getItem("adminLoggedIn");

  if (loggedIn !== "true") {
    window.location.href = "admin-login.html";
  }

  const container =
    document.getElementById("orders-container");

  async function loadOrders() {

    try {

      const res = await fetch(
        "/api/orders/active"
      );

      const activeOrders = await res.json();

      const res2 = await fetch(
        "/api/orders/past"
      );

      const pastOrders = await res2.json();

      const orders = [
        ...activeOrders,
        ...pastOrders
      ];

      container.innerHTML = "";

      orders.sort(
        (a, b) =>
          new Date(b.created_at) -
          new Date(a.created_at)
      );

      if (orders.length === 0) {

        container.innerHTML =
          "<p class='no-orders'>No orders found</p>";

        return;
      }

      const grouped = {};

      orders.forEach(order => {

        const dateKey =
          new Date(order.created_at).toDateString();

        if (!grouped[dateKey]) {
          grouped[dateKey] = [];
        }

        grouped[dateKey].push(order);
      });

      Object.keys(grouped).forEach(date => {

        const wrapper =
          document.createElement("div");

        wrapper.className = "date-group";

        const dateDiv =
          document.createElement("div");

        dateDiv.className = "date-header";

        const count =
          grouped[date].length;

        dateDiv.textContent =
          `${formatDate(date)} (${count} ${count === 1 ? "order" : "orders"})`;

        const grid =
          document.createElement("div");

        grid.className = "orders-grid";

        grouped[date].forEach(order => {

          const card =
            document.createElement("div");

          card.className = "order-card";

          card.innerHTML = `
            <h3>Order #${order.order_id}</h3>

            <p>
              <strong>Order Time:</strong>
              ${new Date(order.created_at).toLocaleTimeString()}
            </p>

            <p>
              <strong>Last Updated:</strong>
              ${order.updated_at
                ? new Date(order.updated_at).toLocaleTimeString()
                : "-"
              }
            </p>

            <p>
              <strong>Price:</strong>
              ₹${order.total}
            </p>

            <div class="status-badge ${order.status}">
              ${order.status.toUpperCase()}
            </div>

            <button class="details-btn">
              View Details
            </button>
          `;

          card.querySelector(".details-btn")
            .addEventListener("click", () =>
              openModal(
                order.order_id,
                order.status,
                order.created_at
              )
            );

          grid.appendChild(card);
        });

        wrapper.appendChild(dateDiv);
        wrapper.appendChild(grid);

        container.appendChild(wrapper);
      });

    } catch (err) {

      console.error(err);

      container.innerHTML =
        "<p class='no-orders'>Error loading orders</p>";
    }
  }

  function formatDate(dateStr) {

    return new Date(dateStr)
      .toLocaleDateString("en-IN", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric"
      });
  }

  // ================= MODAL =================

  window.openModal = async function(orderId, status, date) {

    const modal =
      document.createElement("div");

    modal.className = "modal";

    modal.innerHTML = `
      <div class="modal-box">

        <span class="close-btn">✖</span>

        <h2>Order Details</h2>

        <p><strong>Order ID:</strong> ${orderId}</p>
        <p><strong>Status:</strong> ${status.toUpperCase()}</p>
        <p><strong>Date:</strong> ${new Date(date).toLocaleDateString("en-GB")} ${new Date(date).toLocaleTimeString()}</p>

        <div id="modal-items">
          Loading...
        </div>

      </div>
    `;

    document.body.appendChild(modal);

    modal.querySelector(".close-btn")
      .addEventListener("click", () =>
        closeModal(modal)
      );

    modal.addEventListener("click", e => {
      if (e.target === modal) {
        closeModal(modal);
      }
    });

    document.onkeydown = e => {
      if (e.key === "Escape") {
        closeModal(modal);
      }
    };

    try {

      const res = await fetch(
        `/api/orders/items/${orderId}`
      );

      const items =
        await res.json();

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

        const t =
          item.price * item.quantity;

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

      html += `
        </table>

        <div class="modal-total">
          Total: ₹${total}
        </div>
      `;

      modal.querySelector("#modal-items")
        .innerHTML = html;

    } catch {

      modal.querySelector("#modal-items")
        .innerHTML =
          "Error loading items";
    }
  };

  function closeModal(modal) {

    modal.remove();

    document.onkeydown = null;
  }

  document.getElementById("logout-btn")
    .addEventListener("click", () => {

      sessionStorage.removeItem("adminLoggedIn");

      window.location.href =
        "admin-login.html";
    });

  loadOrders();
});