document.addEventListener("DOMContentLoaded", () => {

  const isLoggedIn = sessionStorage.getItem("receptionistLoggedIn");

  // ❌ If not logged in → redirect to login
  if (!isLoggedIn) {
    window.location.href = "receptionist-login.html";
  }

});