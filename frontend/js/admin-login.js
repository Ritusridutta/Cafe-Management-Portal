document.addEventListener("DOMContentLoaded", () => {

  const form =
    document.getElementById("admin-login-form");

  const errorMsg =
    document.getElementById("error-msg");

  // ✅ HARDCODED CREDENTIALS
  const ADMIN_EMAIL = "admin@cafebe.com";
  const ADMIN_PASSWORD = "admin123";

  form.addEventListener("submit", (e) => {

    e.preventDefault();

    const email =
      document.getElementById("email").value.trim();

    const password =
      document.getElementById("password").value.trim();

    errorMsg.textContent = "";

    // ✅ VALIDATION
    if (!email || !password) {

      errorMsg.textContent =
        "Please enter email and password";

      return;
    }

    // ✅ LOGIN CHECK
    if (
      email === ADMIN_EMAIL &&
      password === ADMIN_PASSWORD
    ) {

      sessionStorage.setItem(
        "adminLoggedIn",
        "true"
      );

      sessionStorage.setItem(
        "adminEmail",
        email
      );

      window.location.href =
        "admin-dashboard.html";

    } else {

      errorMsg.textContent =
        "Invalid credentials";
    }
  });

  // ================= TOGGLE PASSWORD =================

  document.querySelectorAll(".toggle-password")
    .forEach(icon => {

      icon.addEventListener("click", () => {

        const input =
          document.getElementById(icon.dataset.target);

        if (input.type === "password") {

          input.type = "text";

          icon.classList.remove("fa-eye");
          icon.classList.add("fa-eye-slash");

        } else {

          input.type = "password";

          icon.classList.remove("fa-eye-slash");
          icon.classList.add("fa-eye");
        }
      });
    });

});