const container = document.getElementById("orders-container");

const user = JSON.parse(sessionStorage.getItem("user"));

if (!user) {
  alert("Please login first");
  window.location.href = "login.html";
}

async function loadOrders() {
  try {
    const res = await fetch(`/api/orders/user/${user.email}`);
    const data = await res.json();

    container.innerHTML = "";

    data.forEach(order => {
      const date = new Date(order.created_at).toLocaleString();

      container.innerHTML += `
        <div class="order-card">
          <div class="order-header">
            <span>Order #${order.order_id}</span>
            <span class="status ${getStatusClass(order.status)}">${order.status}</span>
          </div>

          <div class="order-meta">
            <span>₹${order.total}</span>
            <span class="order-date">${date}</span>
          </div>

          <button class="details-btn"
            onclick="openModal('${order.order_id}', '${order.status}', '${date}')">
            Order Details
          </button>
        </div>
      `;
    });

  } catch (err) {
    console.error(err);
  }
}

function getStatusClass(status) {
  if (status === "placed") return "pending";
  if (status === "being_prepared") return "preparing";
  if (status === "ready") return "ready";
  return "";
}

// ===== MODAL =====
function openModal(id, orderId, status, date) {

  const modal = document.getElementById("order-modal");

  modal.innerHTML = `
    <div class="modal-box">
      <span class="close-btn" onclick="closeModal()">✖</span>

      <h2>Order Details</h2>

      <p><strong>Order ID:</strong> ${orderId}</p>
      <p><strong>Status:</strong> ${status}</p>
      <p><strong>Date:</strong> ${date}</p>

      <div id="modal-items">Loading items...</div>
    </div>
  `;

  modal.style.display = "flex";

  // ✅ OUTSIDE CLICK
  modal.onclick = (e) => {
    if (e.target.id === "order-modal") {
      closeModal();
    }
  };

  // ✅ ESC KEY
  document.onkeydown = (e) => {
    if (e.key === "Escape") {
      closeModal();
    }
  };

  loadOrderItems(id);
}

// ===== CLOSE =====
function closeModal() {
  const modal = document.getElementById("order-modal");
  modal.style.display = "none";

  document.onkeydown = null; // cleanup ESC
}

// ===== FETCH ITEMS =====
async function loadOrderItems(orderId) {
  try {
    const res = await fetch(`/api/orders/items/${orderId}`);
    const items = await res.json();

    const container = document.getElementById("modal-items");

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
      <div class="modal-total">Total: ₹${total}</div>
    `;

    container.innerHTML = html;

  } catch (err) {
    console.error(err);
  }
}

loadOrders();