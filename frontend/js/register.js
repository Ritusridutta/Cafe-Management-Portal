document.getElementById("register-form")
  .addEventListener("submit", async (e) => {

    e.preventDefault();

    const name =
      document.getElementById("name").value.trim();

    const email =
      document.getElementById("email").value.trim();

    const password =
      document.getElementById("password").value;

    const confirmPassword =
      document.getElementById("confirm-password").value;

    const phone =
      document.getElementById("phone")?.value.trim() || "";

    const city =
      document.getElementById("city").value.trim();

    const address =
      document.getElementById("address").value.trim();

    const errorMsg =
      document.getElementById("error-msg");

    // ================= VALIDATION =================

    if (password !== confirmPassword) {

      errorMsg.textContent =
        "Passwords do not match!";

      return;
    }

    if (password.length < 5) {

      errorMsg.textContent =
        "Password must be at least 5 characters!";

      return;
    }

    try {

      const res = await fetch(
        "/api/auth/register",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json"
          },

          body: JSON.stringify({
            name,
            email,
            password,
            phone,
            city,
            address
          })
        }
      );

      const data = await res.json();

      if (!res.ok) {

        errorMsg.textContent =
          data.message || "Registration failed";

        return;
      }

      sessionStorage.setItem(
        "user",
        JSON.stringify(data.user)
      );

      alert("Registration successful 🎉");

      window.location.href = "/user/index.html";

    } catch (err) {

      console.error(err);

      errorMsg.textContent =
        "Server error. Try again.";
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