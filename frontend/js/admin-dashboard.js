document.addEventListener("DOMContentLoaded", async () => {

  if (sessionStorage.getItem("adminLoggedIn") !== "true") {
    window.location.href = "admin-login.html";
    return;
  }

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

      const menuRes =
        await fetch("/api/menu");

      const menu =
        await menuRes.json();

      allOrders = [
        ...activeOrders,
        ...pastOrders
      ];

      let revenue = 0;

      allOrders.forEach(order => {
        revenue += Number(order.total);
      });

      const avgOrderValue =
        allOrders.length
          ? Math.round(revenue / allOrders.length)
          : 0;

      document.getElementById("total-orders")
        .textContent = allOrders.length;

      document.getElementById("total-revenue")
        .textContent = revenue;

      document.getElementById("menu-count")
        .textContent = menu.length;

      document.getElementById("avg-order-value")
        .textContent = avgOrderValue;

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

    const completed =
      filtered.filter(o =>
        o.status === "completed"
      ).length;

    const active =
      filtered.filter(o =>
        o.status !== "completed"
      ).length;

    document.getElementById("date-orders")
      .textContent = filtered.length;

    document.getElementById("date-revenue")
      .textContent = revenue;

    document.getElementById("date-completed")
      .textContent = completed;

    document.getElementById("date-active")
      .textContent = active;
  }

  document
    .getElementById("load-analytics-btn")
    .addEventListener("click", loadDateAnalytics);

  loadDashboard();
});