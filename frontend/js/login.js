document.getElementById("login-form")
  .addEventListener("submit", async (e) => {

    e.preventDefault();

    const email =
      document.getElementById("email").value.trim();

    const password =
      document.getElementById("password").value;

    const errorMsg =
      document.getElementById("error-msg");

    try {

      const res = await fetch(
        "/api/auth/login",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json"
          },

          body: JSON.stringify({
            email,
            password
          })
        }
      );

      const data = await res.json();

      if (!res.ok) {

        errorMsg.textContent =
          data.message || "Login failed";

        return;
      }

      // ✅ SAVE USER
      sessionStorage.setItem(
        "user",
        JSON.stringify(data.user)
      );

      alert("Login successful ✅");

      window.location.href = "/user/index.html";

    } catch (err) {

      console.error(err);

      errorMsg.textContent = "Server error";
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