document.addEventListener("DOMContentLoaded", () => {

  // Do NOTHING if not on menu page
  if (!document.querySelector(".add-cart")) {
    return;
  }

  let cart = JSON.parse(localStorage.getItem("cart")) || [];

  const cartCounter = document.getElementById("cart-count");
  const buttons = document.querySelectorAll(".add-cart");

  function updateCartCount() {
    const total = cart.reduce((sum, item) => sum + item.qty, 0);
    if (cartCounter) cartCounter.textContent = total;
  }

  buttons.forEach(button => {
    button.type = "button"; // 🔒 force non-submit

    button.addEventListener("click", () => {
      const name = button.dataset.name;
      const price = Number(button.dataset.price);

      const existing = cart.find(item => item.name === name);

      if (existing) {
        existing.qty += 1;
      } else {
        const category = button.dataset.category;

        cart.push({ name, price, qty: 1, category });
      }

      localStorage.setItem("cart", JSON.stringify(cart));
      updateCartCount();

      button.textContent = "Added ✓";
      button.disabled = true;

      setTimeout(() => {
        button.textContent = "Add to Cart";
        button.disabled = false;
      }, 1200);
    });
  });

  updateCartCount();
});
