document.addEventListener("DOMContentLoaded", () => {

  let allOrders = [];

  async function loadDashboard() {

    try {

      const activeRes =
        await fetch("/api/orders/active");

      const activeOrders =
        await activeRes.json();

      const pastRes =
        await fetch("/api/orders/past");

      const pastOrders =
        await pastRes.json();

      allOrders = [
        ...activeOrders,
        ...pastOrders
      ];

      document.getElementById("awaiting-count")
        .textContent =
          activeOrders.filter(
            o => o.status === "accepted"
          ).length;

      document.getElementById("preparing-count")
        .textContent =
          activeOrders.filter(
            o => o.status === "preparing"
          ).length;

      document.getElementById("ready-count")
        .textContent =
          activeOrders.filter(
            o => o.status === "ready"
          ).length;

      document.getElementById("completed-count")
        .textContent =
          pastOrders.length;

    } catch (err) {

      console.error(err);
    }
  }

  function loadDateAnalytics() {

    const selectedDate =
      document.getElementById("analytics-date").value;

    if (!selectedDate) {

      alert("Please select a date");

      return;
    }

    const filtered =
      allOrders.filter(order => {

        const orderDate =
          new Date(order.created_at)
            .toISOString()
            .split("T")[0];

        return orderDate === selectedDate;
      });

    document.getElementById("date-orders")
      .textContent = filtered.length;

    document.getElementById("date-accepted")
      .textContent =
        filtered.filter(
          o => o.status === "accepted"
        ).length;

    document.getElementById("date-ready")
      .textContent =
        filtered.filter(
          o => o.status === "ready"
        ).length;

    document.getElementById("date-completed")
      .textContent =
        filtered.filter(
          o => o.status === "completed"
        ).length;
  }

  document
    .getElementById("load-analytics-btn")
    .addEventListener("click", loadDateAnalytics);

  loadDashboard();

  setInterval(loadDashboard, 5000);

  document
    .getElementById("logout-btn")
    .addEventListener("click", () => {

      sessionStorage.removeItem("cookLoggedIn");

      window.location.href =
        "cook-login.html";
    });
});