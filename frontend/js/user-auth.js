document.addEventListener("DOMContentLoaded", () => {

  const nav = document.querySelector(".nav");
  const sidebar = document.querySelector(".sidebar");

  const user = JSON.parse(sessionStorage.getItem("user"));

  // ================= REMOVE OLD ELEMENTS =================

  const oldAuth = document.querySelector(".bottom-auth");
  if (oldAuth) oldAuth.remove();

  const oldDynamic = document.querySelectorAll(".dynamic-link");
  oldDynamic.forEach(el => el.remove());

  // ================= ADD USER LINKS =================

  if (user) {

    // 🔥 MY ORDERS
    const myOrders = document.createElement("a");

    myOrders.href = "/user/my-orders.html";
    myOrders.textContent = "My Orders";

    myOrders.classList.add("dynamic-link");

    // 🔥 ACCOUNT
    const account = document.createElement("a");

    account.href = "/user/account.html";
    account.textContent = "Account";

    account.classList.add("dynamic-link");

    // 🔥 INSERT AFTER CART
    const cartLink = [...nav.children]
      .find(a => a.textContent.includes("Cart"));

    if (cartLink) {

      nav.insertBefore(myOrders, cartLink.nextSibling);

      nav.insertBefore(account, myOrders.nextSibling);

    } else {

      nav.appendChild(myOrders);
      nav.appendChild(account);
    }
  }

  // ================= AUTH BOX =================

  const bottomDiv = document.createElement("div");

  bottomDiv.classList.add("bottom-auth");

  if (user) {

    bottomDiv.innerHTML = `
      <div class="auth-box">

        <p class="user-name">
          👤 ${user.name.split(" ")[0]}
        </p>

        <button id="logout-btn">
          Logout
        </button>

      </div>
    `;

  } else {

    bottomDiv.innerHTML = `
      <a href="/user/login.html" class="login-btn">
        Login / Register
      </a>
    `;
  }

  sidebar.appendChild(bottomDiv);

  // ================= LOGOUT =================

  document.addEventListener("click", (e) => {

    if (e.target.id === "logout-btn") {

      sessionStorage.removeItem("user");

      // 🔥 REDIRECT TO HOME
      window.location.href = "/user/index.html";
    }
  });

  // ================= ACTIVE LINK FIX =================

  const currentPath = window.location.pathname;

  const links = document.querySelectorAll(".nav a");

  links.forEach(link => {

    const hrefPath = new URL(link.href).pathname;

    if (hrefPath === currentPath) {

      link.classList.add("active");
    }
  });

});