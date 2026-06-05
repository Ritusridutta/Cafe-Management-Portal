document.addEventListener("DOMContentLoaded", () => {

  const container = document.getElementById("menu-container");

  // ================= FETCH MENU =================
  async function fetchMenu() {
    try {
      const res = await fetch("/api/menu");
      const data = await res.json();

      renderMenu(data);

    } catch (err) {
      console.error(err);
      container.innerHTML = "<p>Error loading menu</p>";
    }
  }

  // ================= RENDER MENU =================
  function renderMenu(items) {

    const categories = {};

    // Group by category
    items.forEach(item => {
      if (!categories[item.category]) {
        categories[item.category] = [];
      }
      categories[item.category].push(item);
    });

    container.innerHTML = "";

    // Loop categories
    for (let category in categories) {

      const section = document.createElement("section");
      section.classList.add("menu-section");

      section.innerHTML = `
        <h2>${getEmoji(category)} ${category}</h2>
        <div class="menu-grid">
          ${categories[category].map(item => `
            <div class="menu-card">
              <img src="${item.image}" alt="${item.name}">
              <h3>${item.name}</h3>
              <p>${item.description || ""}</p>
              <span>₹${item.price}</span>
              <button class="add-cart"
                data-name="${item.name}"
                data-price="${item.price}"
                data-category="${item.category}">
                Add to Cart
              </button>
            </div>
          `).join("")}
        </div>
      `;

      container.appendChild(section);
    }

    activateCartButtons(); // re-bind buttons
  }

  // ================= EMOJIS =================
  function getEmoji(category) {
    switch (category.toLowerCase()) {
      case "main course": return "🍛";
      case "snacks": return "🥪";
      case "pastries": return "🥐";
      case "beverages": return "🥤";
      case "desserts": return "🍰";
      case "fast food": return "🍔";
      case "indian": return "🍛";
      case "chinese": return "🥡";
      case "combo": return "🍱";
      case "breakfast": return "🍳";
      default: return "🍽️";
    }
  }

  // ================= CART BUTTON BIND =================
  function activateCartButtons() {

    let cart = JSON.parse(localStorage.getItem("cart")) || [];

    const buttons = document.querySelectorAll(".add-cart");

    buttons.forEach(btn => {
      btn.addEventListener("click", () => {

        const name = btn.dataset.name;
        const price = Number(btn.dataset.price);
        const category = btn.dataset.category;

        const existing = cart.find(item => item.name === name);

        if (existing) {
          existing.qty += 1;
        } else {
          cart.push({ name, price, qty: 1, category });
        }

        localStorage.setItem("cart", JSON.stringify(cart));

        updateCartCount();

        btn.textContent = "Added ✓";
        btn.disabled = true;

        setTimeout(() => {
          btn.textContent = "Add to Cart";
          btn.disabled = false;
        }, 1000);
      });
    });

    updateCartCount();
  }

  // ================= CART COUNT =================
  function updateCartCount() {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    const total = cart.reduce((sum, i) => sum + i.qty, 0);

    const counter = document.getElementById("cart-count");
    if (counter) counter.textContent = total;
  }

  fetchMenu();
});