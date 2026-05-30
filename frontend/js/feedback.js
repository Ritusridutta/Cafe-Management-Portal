document.addEventListener("DOMContentLoaded", () => {

  const form = document.getElementById("feedback-form");
  const successMsg = document.getElementById("success-msg");

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const message = document.getElementById("message").value.trim();
    const ratingElement = document.querySelector("input[name='rating']:checked");

    // Validation
    if (!name || !email || !message || !ratingElement) {
      alert("⚠ Please fill all fields and select rating");
      return;
    }

    const feedback = {
      name: name,
      email: email,
      rating: ratingElement.value,
      message: message,
      date: new Date().toISOString()
    };

    const allFeedback = JSON.parse(localStorage.getItem("feedback")) || [];
    allFeedback.push(feedback);
    localStorage.setItem("feedback", JSON.stringify(allFeedback));

    form.reset();
    successMsg.style.display = "block";

    setTimeout(() => {
      successMsg.style.display = "none";
    }, 3000);
  });

});
