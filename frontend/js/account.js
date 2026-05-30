const container = document.getElementById("account-container");
const user = JSON.parse(sessionStorage.getItem("user"));

let userData = {};

if (!user) {
  alert("Please login first");
  window.location.href = "login.html";
}

// ================= MESSAGE FUNCTION =================

function showMessage(el, text, type = "success") {

  el.textContent = text;

  el.className = `msg ${type}`;

  el.style.display = "block";

  setTimeout(() => {
    el.style.display = "none";
  }, 3000);
}

// ================= LOAD ACCOUNT =================

async function loadAccount() {

  try {

    const res =
      await fetch(
        `/api/auth/user/${user.email}`
      );

    const data =
      await res.json();

    userData = data;

    container.innerHTML = `
      <div class="account-card">

        <p>
          <strong>Name:</strong>
          ${data.name || "-"}
        </p>

        <p>
          <strong>Email:</strong>
          ${data.email}
        </p>

        <p>
          <strong>Phone:</strong>
          ${data.phone || "-"}
        </p>

        <p>
          <strong>City:</strong>
          ${data.city || "-"}
        </p>

        <p>
          <strong>Address:</strong>
          ${data.address || "-"}
        </p>

        <button
          class="edit-btn"
          onclick="openModal()">

          Edit Details

        </button>

      </div>
    `;

  } catch (err) {

    console.error(err);

    container.innerHTML = `
      <p>Error loading account details</p>
    `;
  }
}

// ================= OPEN MODAL =================

function openModal() {

  const modal =
    document.getElementById("account-modal");

  modal.innerHTML = `
    <div class="modal-box">

      <span
        class="close-btn"
        onclick="closeModal()">

        ✖

      </span>

      <h2>Edit Account</h2>

      <input
        id="name"
        value="${userData.name || ""}">

      <input
        id="email"
        value="${userData.email}"
        disabled>

      <input
        id="phone"
        value="${userData.phone || ""}">

      <input
        id="city"
        value="${userData.city || ""}">

      <textarea id="address">${userData.address || ""}</textarea>

      <h3>Change Password</h3>

      <div class="password-box">

        <input
          type="password"
          id="old-password"
          placeholder="Old Password">

        <i
          class="fa-solid fa-eye toggle-password"
          data-target="old-password"></i>

      </div>

      <div class="password-box">

        <input
          type="password"
          id="new-password"
          placeholder="New Password">

        <i
          class="fa-solid fa-eye toggle-password"
          data-target="new-password"></i>

      </div>

      <div class="password-box">

        <input
          type="password"
          id="confirm-password"
          placeholder="Confirm Password">

        <i
          class="fa-solid fa-eye toggle-password"
          data-target="confirm-password"></i>

      </div>

      <button onclick="saveChanges()">
        Save Changes
      </button>

      <p
        id="account-msg"
        class="msg"></p>

    </div>
  `;

  modal.style.display = "flex";

  // ================= PASSWORD TOGGLE =================

  modal.querySelectorAll(".toggle-password")
    .forEach(icon => {

      icon.addEventListener("click", () => {

        const input =
          document.getElementById(
            icon.dataset.target
          );

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

  // ================= OUTSIDE CLICK =================

  modal.onclick = (e) => {

    if (e.target.id === "account-modal") {

      closeModal();
    }
  };

  // ================= ESC CLOSE =================

  document.onkeydown = (e) => {

    if (e.key === "Escape") {

      closeModal();
    }
  };
}

// ================= CLOSE MODAL =================

function closeModal() {

  const modal =
    document.getElementById("account-modal");

  modal.style.display = "none";

  document.onkeydown = null;
}

// ================= SAVE CHANGES =================

async function saveChanges() {

  const msg =
    document.getElementById("account-msg");

  const name =
    document.getElementById("name").value.trim();

  const phone =
    document.getElementById("phone").value.trim();

  const city =
    document.getElementById("city").value.trim();

  const address =
    document.getElementById("address").value.trim();

  const oldPass =
    document.getElementById("old-password").value;

  const newPass =
    document.getElementById("new-password").value;

  const confirmPass =
    document.getElementById("confirm-password").value;

  // ================= PASSWORD CHECK =================

  if (
    newPass &&
    newPass !== confirmPass
  ) {

    return showMessage(
      msg,
      "Passwords do not match",
      "error"
    );
  }

  try {

    const res =
      await fetch(
        "/api/auth/update",
        {
          method: "PUT",

          headers: {
            "Content-Type": "application/json"
          },

          body: JSON.stringify({

            email: user.email,

            name,
            phone,
            city,
            address,

            oldPassword: oldPass,
            newPassword: newPass
          })
        }
      );

    const data =
      await res.json();

    if (!res.ok) {

      return showMessage(
        msg,
        data.message || "Error updating profile",
        "error"
      );
    }

    showMessage(
      msg,
      "Profile updated successfully",
      "success"
    );

    setTimeout(() => {

      closeModal();

      loadAccount();

    }, 3000);

  } catch (err) {

    console.error(err);

    showMessage(
      msg,
      "Server error",
      "error"
    );
  }
}

// ================= INIT =================

loadAccount();