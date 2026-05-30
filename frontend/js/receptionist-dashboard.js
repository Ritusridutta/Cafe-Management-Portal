document.addEventListener("DOMContentLoaded", () => {

  const activeCountEl = document.getElementById("active-count");
  const completedCountEl = document.getElementById("completed-count");
  const revenueEl = document.getElementById("total-revenue");
  const awaitingEl = document.getElementById("awaiting-count");
  const readyEl = document.getElementById("ready-count");

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

      let revenue = 0;

      allOrders.forEach(order => {
        revenue += Number(order.total);
      });

      activeCountEl.textContent =
        activeOrders.length;

      completedCountEl.textContent =
        pastOrders.length;

      revenueEl.textContent =
        revenue;

      awaitingEl.textContent =
        activeOrders.filter(
          o => o.status === "placed"
        ).length;

      readyEl.textContent =
        activeOrders.filter(
          o => o.status === "ready"
        ).length;

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

    let revenue = 0;

    filtered.forEach(order => {
      revenue += Number(order.total);
    });

    document.getElementById("date-orders")
      .textContent = filtered.length;

    document.getElementById("date-revenue")
      .textContent = revenue;

    document.getElementById("date-completed")
      .textContent =
        filtered.filter(
          o => o.status === "completed"
        ).length;

    document.getElementById("date-pending")
      .textContent =
        filtered.filter(
          o => o.status !== "completed"
        ).length;
  }

  document
    .getElementById("load-analytics-btn")
    .addEventListener("click", loadDateAnalytics);

  loadDashboard();

  setInterval(loadDashboard, 5000);

  const logoutBtn =
    document.getElementById("logout-btn");

  if (logoutBtn) {

    logoutBtn.addEventListener("click", () => {

      sessionStorage.removeItem(
        "receptionistLoggedIn"
      );

      window.location.href =
        "receptionist-login.html";
    });
  }
});