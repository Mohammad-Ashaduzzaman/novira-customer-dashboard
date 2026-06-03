(() => {
  const routes = {
    dashboard: "index.html",
    trackers: "trackers.html",
    shipments: "shipments.html",
    fleets: "fleets.html",
    drivers: "drivers.html",
    alerts: "alerts.html",
    notifications: "notifications.html",
    widgets: "widgets.html",
    orders: "subscriptions.html",
    reports: "reports.html",
    "access control": "support-tickets.html",
    "help support": "support-tickets.html",
    "help & support": "support-tickets.html"
  };

  const currentPage = (window.location.pathname.split("/").pop() || "index.html").toLowerCase();
  const clean = (value) => (value || "").replace(/\s+/g, " ").trim().toLowerCase();

  const pageForDetails = (scopeText = "") => {
    const pageText = clean(`${currentPage} ${scopeText}`);

    if (pageText.includes("support") || pageText.includes("ticket")) {
      return "support-ticket-details.html";
    }

    if (pageText.includes("shipment")) {
      return "shipment-details.html";
    }

    if (pageText.includes("tracker") || pageText.includes("trac#")) {
      return "tracker-details.html";
    }

    return "";
  };

  const routeFor = (element) => {
    const label = clean([
      element.getAttribute("title"),
      element.getAttribute("aria-label"),
      element.textContent
    ].filter(Boolean).join(" "));

    if (routes[label]) {
      return routes[label];
    }

    for (const [key, href] of Object.entries(routes)) {
      if (label.includes(key)) {
        return href;
      }
    }

    if (label.includes("view tracker page")) {
      return "trackers.html";
    }

    if (label.includes("view shipment page")) {
      return "shipments.html";
    }

    if (label.includes("view fleet page")) {
      return "fleets.html";
    }

    if (label.includes("view driver page")) {
      return "drivers.html";
    }

    if (label.includes("contact support") || label.includes("create ticket")) {
      return "support-tickets.html";
    }

    if (label.includes("billing") || label.includes("subscription") || label.includes("invoice")) {
      return "subscriptions.html";
    }

    if (label.includes("view details") || label === "view") {
      const scope = element.closest(".zone, .panel, .card, tbody, main, .content");
      return pageForDetails(scope ? scope.textContent : "");
    }

    if (element.classList.contains("back")) {
      if (currentPage === "tracker-details.html") {
        return "trackers.html";
      }

      if (currentPage === "shipment-details.html") {
        return "shipments.html";
      }

      if (currentPage === "support-ticket-details.html") {
        return "support-tickets.html";
      }

      return "index.html";
    }

    if (element.classList.contains("help")) {
      return "support-tickets.html";
    }

    if (element.classList.contains("plan")) {
      return "subscriptions.html";
    }

    if (element.classList.contains("icon-btn") && element.querySelector(".badge")) {
      return "notifications.html";
    }

    return "";
  };

  const fileName = (href) => {
    try {
      return new URL(href, window.location.href).pathname.split("/").pop().toLowerCase() || "index.html";
    } catch {
      return "";
    }
  };

  const activeForCurrentPage = (target) => {
    if (target === currentPage) {
      return true;
    }

    return (currentPage === "tracker-details.html" && target === "trackers.html") ||
      (currentPage === "shipment-details.html" && target === "shipments.html") ||
      (currentPage === "support-ticket-details.html" && target === "support-tickets.html");
  };

  const makeClickable = (element, href) => {
    if (!href) {
      return;
    }

    if (element.tagName === "A") {
      element.setAttribute("href", href);
    } else {
      element.setAttribute("role", "link");
      element.setAttribute("tabindex", "0");
      element.addEventListener("click", (event) => {
        if (!event.target.closest("a")) {
          window.location.href = href;
        }
      });
      element.addEventListener("keydown", (event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          window.location.href = href;
        }
      });
    }

    element.dataset.prototypeLink = href;
    element.style.cursor = "pointer";
  };

  document.querySelectorAll('a[href="#"], a:not([href])').forEach((link) => {
    makeClickable(link, routeFor(link));
  });

  document.querySelectorAll(".btn, .help, .plan, .back, .icon-btn").forEach((control) => {
    if (control.tagName === "A" && control.getAttribute("href") && control.getAttribute("href") !== "#") {
      return;
    }

    makeClickable(control, routeFor(control));
  });

  document.querySelectorAll("tbody tr").forEach((row) => {
    const detailControl = row.querySelector('[data-prototype-link$="-details.html"], .btn-ghost');
    const detailRoute = detailControl ? detailControl.dataset.prototypeLink || routeFor(detailControl) : pageForDetails(row.textContent);

    if (detailRoute) {
      makeClickable(row, detailRoute);
    }
  });

  document.querySelectorAll(".brand").forEach((brand) => {
    makeClickable(brand, "index.html");
  });

  document.querySelectorAll(".nav a").forEach((link) => {
    const target = fileName(link.href);

    if (!target) {
      return;
    }

    if (activeForCurrentPage(target)) {
      link.classList.add("active");
    } else if (link.classList.contains("active")) {
      link.classList.remove("active");
    }
  });
})();
