document.addEventListener("DOMContentLoaded", () => {

  const form =
    document.getElementById("login-form");

  const errorMsg =
    document.getElementById("error-msg");

  // ✅ HARDCODED CREDENTIALS
  const validEmail = "reception@cafebe.com";
  const validPassword = "12345";

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

    if (
      email === validEmail &&
      password === validPassword
    ) {

      sessionStorage.setItem(
        "receptionistLoggedIn",
        "true"
      );

      sessionStorage.setItem(
        "receptionistEmail",
        email
      );

      window.location.href =
        "receptionist-dashboard.html";

    } else {

      errorMsg.textContent =
        "Invalid Email or Password!";
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