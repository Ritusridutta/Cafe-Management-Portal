document.addEventListener("DOMContentLoaded", () => {

  const API = "/api/menu";
  const container = document.getElementById("menu-list");
  const preview = document.getElementById("preview");

  let currentEditId = null;
  let menuData = [];

  const modal = document.getElementById("edit-modal");
  const closeBtn = document.getElementById("close-modal");
  const saveBtn = document.getElementById("save-edit");

  const addMsg = document.getElementById("add-msg");
  const editMsg = document.getElementById("edit-msg");

  const editPreview = document.getElementById("edit-preview");
  const editImageInput = document.getElementById("edit-image");

  const CATEGORIES = [
    "Main Course",
    "Snacks",
    "Pastries",
    "Beverages",
    "Desserts",
    "Fast Food",
    "Indian",
    "Chinese",
    "Combo",
    "Breakfast"
  ];

  // ================= MESSAGE =================
  function showMessage(el, text, type = "success") {
    el.textContent = text;
    el.className = `msg ${type}`;
    el.style.display = "block";

    setTimeout(() => {
      el.style.display = "none";
    }, 3000);
  }

  // ================= DROPDOWN =================
  function populateCategories() {
    const categorySelect = document.getElementById("category");
    const editCategorySelect = document.getElementById("edit-category");

    categorySelect.innerHTML = '<option value="">Select Category</option>';
    editCategorySelect.innerHTML = "";

    CATEGORIES.forEach(cat => {
      categorySelect.appendChild(new Option(cat, cat));
      editCategorySelect.appendChild(new Option(cat, cat));
    });
  }

  // ================= LOAD MENU =================
  async function loadMenu() {
    const res = await fetch(API);
    menuData = await res.json();

    container.innerHTML = "";

    menuData.forEach(item => {
      container.innerHTML += `
        <div class="order-card">
          <img src="${item.image}" width="80">
          <h3>${item.name}</h3>
          <p>₹${item.price}</p>

          <div class="menu-actions">
            <button class="edit-btn"
              onclick="editItem(${item.id}, \`${item.name}\`, ${item.price}, \`${item.category}\`, \`${item.image}\`)">
              Edit
            </button>

            <button class="delete-btn" onclick="deleteItem(${item.id})">
              Delete
            </button>
          </div>
        </div>
      `;
    });
  }

  // ================= IMAGE PREVIEW =================
  document.getElementById("image").addEventListener("change", (e) => {
    const file = e.target.files[0];
    if (file) {
      preview.src = URL.createObjectURL(file);
      preview.style.display = "block";
    }
  });

  // EDIT IMAGE PREVIEW
  editImageInput.addEventListener("change", (e) => {
    const file = e.target.files[0];
    if (file) {
      editPreview.src = URL.createObjectURL(file);
    }
  });

  // ================= DUPLICATE CHECK =================
  function isDuplicate(name, excludeId = null) {

    const normalizedName = name.trim().toLowerCase();

    return menuData.some(item =>
      item.name.toLowerCase() === normalizedName &&
      item.id !== excludeId
    );
  }

  // ================= ADD ITEM =================
  window.addItem = async function () {
    const name = document.getElementById("name").value.trim().replace(/\s+/g, " ");
    const price = document.getElementById("price").value.trim();
    const category = document.getElementById("category").value;
    const imageFile = document.getElementById("image").files[0];

    if (!name || !price || !category || !imageFile) {
      return showMessage(addMsg, "All fields are required", "error");
    }

    if (isDuplicate(name)) {
      return showMessage(addMsg, "Item already exists", "error");
    }

    const formData = new FormData();
    formData.append("name", name);
    formData.append("price", price);
    formData.append("category", category);
    formData.append("image", imageFile);

    await fetch(API, { method: "POST", body: formData });

    showMessage(addMsg, "Item added successfully");

    setTimeout(() => {
      document.getElementById("name").value = "";
      document.getElementById("price").value = "";
      document.getElementById("category").value = "";
      document.getElementById("image").value = "";
      preview.style.display = "none";
      preview.src = "";
    }, 3000);

    loadMenu();
  };

  // ================= DELETE =================
  window.deleteItem = async function (id) {
    if (!confirm("Delete this item?")) return;
    await fetch(`${API}/${id}`, { method: "DELETE" });
    loadMenu();
  };

  // ================= EDIT =================
  window.editItem = function (id, name, price, category, image) {
    currentEditId = id;

    document.getElementById("edit-name").value = name;
    document.getElementById("edit-price").value = price;
    document.getElementById("edit-category").value = category;

    // SHOW CURRENT IMAGE
    editPreview.src = image;

    modal.style.display = "flex";
  };

  closeBtn.onclick = () => modal.style.display = "none";

  window.onclick = (e) => {
    if (e.target === modal) modal.style.display = "none";
  };

  // ================= SAVE EDIT =================
  saveBtn.onclick = async () => {
    const name = document.getElementById("edit-name").value.trim().replace(/\s+/g, " ");
    const price = document.getElementById("edit-price").value.trim();
    const category = document.getElementById("edit-category").value;
    const imageFile = editImageInput.files[0];

    if (!name || !price || !category) {
      return showMessage(editMsg, "All fields are required", "error");
    }

    if (isDuplicate(name, currentEditId)) {
      return showMessage(editMsg, "Item already exists", "error");
    }

    let body;
    let headers = {};

    if (imageFile) {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("price", price);
      formData.append("category", category);
      formData.append("image", imageFile);
      body = formData;
    } else {
      headers["Content-Type"] = "application/json";
      body = JSON.stringify({ name, price, category });
    }

    await fetch(`${API}/${currentEditId}`, {
      method: "PUT",
      headers,
      body
    });

    showMessage(editMsg, "Updated successfully");

    setTimeout(() => {
      modal.style.display = "none";
      editImageInput.value = "";
      loadMenu();
    }, 3000);
  };

  populateCategories();
  loadMenu();
});