document.addEventListener("DOMContentLoaded", () => {

  if (!sessionStorage.getItem("cookLoggedIn")) {
    window.location.href = "cook-login.html";
  }

});