document.addEventListener("DOMContentLoaded", () => {

  const isLoggedIn = sessionStorage.getItem("adminLoggedIn");

  if (!isLoggedIn) {
    window.location.href = "admin-login.html";
    return;
  }

  const logoutBtn = document.getElementById("logout-btn");

  if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
      sessionStorage.removeItem("adminLoggedIn");
      sessionStorage.removeItem("adminEmail");

      window.location.href = "admin-login.html";
    });
  }

});