document.addEventListener("DOMContentLoaded", () => {

  // ✅ AUTH CHECK
  const isLoggedIn = sessionStorage.getItem("adminLoggedIn");

  if (!isLoggedIn) {
    window.location.href = "admin-login.html";
    return;
  }

  // ✅ LOGOUT HANDLER (WORKS ON ALL PAGES)
  const logoutBtn = document.getElementById("logout-btn");

  if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
      sessionStorage.removeItem("adminLoggedIn");
      sessionStorage.removeItem("adminEmail");

      window.location.href = "admin-login.html";
    });
  }

});