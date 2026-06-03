document.addEventListener("DOMContentLoaded", () => {

  const container = document.getElementById("orders-container");

  async function fetchOrders() {

    try {

      const res = await fetch("/api/orders/active");
      const orders = await res.json();

      container.innerHTML = "";

      const kitchenOrders = orders.filter(order =>
        order.status === "placed" ||
        order.status === "accepted" ||
        order.status === "preparing" ||
        order.status === "ready"
      );

      if (kitchenOrders.length === 0) {

        container.innerHTML = `
          <p class="no-orders">
            No current kitchen orders
          </p>
        `;

        return;
      }

      kitchenOrders.forEach(order => {

        const preparingDisabled =
          order.status !== "accepted";

        const readyDisabled =
          order.status !== "preparing";

        const card = document.createElement("div");

        card.classList.add("order-card");

        card.innerHTML = `
          <h3>Order ID: ${order.order_id}</h3>

          <p class="status ${order.status}">
            ${order.status}
          </p>

          <p>
            <strong>Total:</strong> ₹${order.total}
          </p>

          <p>
            <strong>Time:</strong>
            ${new Date(order.created_at).toLocaleString()}
          </p>

          <div class="btn-group">

            <button
              class="preparing-btn"
              ${preparingDisabled ? "disabled" : ""}
              onclick="updateStatus('${order.order_id}', 'preparing')">
              Start Preparing
            </button>

            <button
              class="ready-btn"
              ${readyDisabled ? "disabled" : ""}
              onclick="updateStatus('${order.order_id}', 'ready')">
              Mark Ready
            </button>

          </div>

          <button
            class="details-btn"
            onclick="openModal(
              '${order.order_id}',
              '${order.status}',
              '${order.created_at}'
            )">
            View Details
          </button>
        `;

        container.appendChild(card);
      });

    } catch (err) {

      console.error(err);

      container.innerHTML = `
        <p class="no-orders">
          Error loading orders
        </p>
      `;
    }
  }

  // ================= UPDATE STATUS =================

  window.updateStatus = async (id, status) => {

    try {

      await fetch(`/api/orders/${id}/status`, {

        method: "PUT",

        headers: {
          "Content-Type": "application/json"
        },

        body: JSON.stringify({ status })
      });

      fetchOrders();

    } catch (err) {

      console.error(err);
    }
  };

  // ================= MODAL =================

  window.openModal = async function(orderId, status, date) {

    const modal = document.createElement("div");

    modal.className = "modal";

    modal.innerHTML = `
      <div class="modal-box">

        <span class="close-btn">✖</span>

        <h2>Order Details</h2>

        <p><strong>Order ID:</strong> ${orderId}</p>
        <p><strong>Status:</strong> ${status}</p>
        <p><strong>Date:</strong> ${new Date(date).toLocaleString()}</p>

        <div id="modal-items">
          Loading...
        </div>

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

      const res =
        await fetch(`/api/orders/items/${orderId}`);

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

        const itemTotal =
          item.price * item.quantity;

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
        .innerHTML = "Error loading items";
    }
  };

  function closeModal(modal) {

    modal.remove();

    document.onkeydown = null;
  }

  // ================= LOGOUT =================

  document.getElementById("logout-btn")
    .addEventListener("click", () => {

      sessionStorage.removeItem("cookLoggedIn");

      window.location.href = "cook-login.html";
    });

  // ================= AUTO REFRESH =================

  setInterval(fetchOrders, 3000);

  fetchOrders();
});