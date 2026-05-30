const cartTable = document.getElementById("cart-items");
const totalItemsEl = document.getElementById("total-items");
const grandTotalEl = document.getElementById("grand-total");

const cartSection = document.getElementById("cart-section");
const emptyCartMsg = document.getElementById("empty-cart");

let cart = JSON.parse(localStorage.getItem("cart")) || [];

// ================= RENDER CART =================
function renderCart() {

  // Empty cart state
  if (cart.length === 0) {
    cartSection.style.display = "none";
    emptyCartMsg.style.display = "block";
    return;
  }

  cartSection.style.display = "block";
  emptyCartMsg.style.display = "none";

  cartTable.innerHTML = "";

  let totalItems = 0;
  let grandTotal = 0;

  cart.forEach((item, index) => {
    const itemTotal = item.price * item.qty;
    totalItems += item.qty;
    grandTotal += itemTotal;

    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${item.name}</td>
      <td>${item.category || "-"}</td>
      <td>₹${item.price}</td>
      <td>
        <button class="qty-btn" onclick="changeQty(${index}, -1)">-</button>
        ${item.qty}
        <button class="qty-btn" onclick="changeQty(${index}, 1)">+</button>
      </td>
      <td>₹${itemTotal}</td>
      <td>
        <button class="remove-btn" onclick="removeItem(${index})">X</button>
      </td>
    `;
    cartTable.appendChild(row);
  });

  totalItemsEl.textContent = totalItems;
  grandTotalEl.textContent = grandTotal;
}

// ================= CHANGE QUANTITY =================
function changeQty(index, amount) {
  cart[index].qty += amount;

  if (cart[index].qty <= 0) {
    cart.splice(index, 1);
  }

  localStorage.setItem("cart", JSON.stringify(cart));
  renderCart();
}

// ================= REMOVE ITEM =================
function removeItem(index) {
  cart.splice(index, 1);
  localStorage.setItem("cart", JSON.stringify(cart));
  renderCart();
}

// ================= INITIAL LOAD =================
renderCart();
