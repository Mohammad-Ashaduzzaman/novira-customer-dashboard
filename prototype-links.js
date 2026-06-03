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

    if (pageText.includes("shipment") || pageText.includes("ship#")) {
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

  const isCloseIconButton = (button) => {
    if (button.matches("[data-detail-close]")) {
      return true;
    }

    const paths = [...button.querySelectorAll("path")].map((path) => path.getAttribute("d") || "").join(" ");
    return paths.includes("M6 6l12 12") || paths.includes("M18 6L6 18");
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

    if (element.tagName === "TR") {
      element.classList.add("prototype-row-link");
      element.setAttribute("title", "Open details");
    }
  };

  const detailBackRoute = () => {
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
  };

  const ensurePrototypeStyles = () => {
    if (document.getElementById("prototype-interaction-styles")) {
      return;
    }

    const style = document.createElement("style");
    style.id = "prototype-interaction-styles";
    style.textContent = `
      .prototype-row-link .mono:first-child,
      .prototype-row-link td:first-child {
        color: var(--accent, #0f6e56);
      }

      .prototype-toast {
        position: fixed;
        right: 22px;
        bottom: 22px;
        z-index: 10000;
        max-width: min(360px, calc(100vw - 32px));
        background: #15171c;
        color: #fff;
        border-radius: 12px;
        box-shadow: 0 18px 46px -24px rgba(0, 0, 0, .65);
        padding: 12px 14px;
        font: 600 13px/1.35 "Hanken Grotesk", system-ui, sans-serif;
      }

      .prototype-overlay {
        position: fixed;
        inset: 0;
        z-index: 9999;
        display: grid;
        place-items: center;
        padding: 22px;
        background: rgba(10, 12, 16, .48);
        backdrop-filter: blur(6px);
      }

      .prototype-popup {
        width: min(620px, 100%);
        max-height: calc(100vh - 44px);
        overflow: hidden;
        display: flex;
        flex-direction: column;
        background: var(--surface, #fff);
        border-radius: 16px;
        box-shadow: 0 34px 90px -34px rgba(0, 0, 0, .72);
      }

      .prototype-popup-head {
        display: flex;
        align-items: flex-start;
        justify-content: space-between;
        gap: 18px;
        padding: 18px 20px 14px;
        border-bottom: 1px solid var(--hairline, #e7eae8);
      }

      .prototype-popup-kicker {
        margin-bottom: 4px;
        color: var(--ink-3, #929aa3);
        font-size: 9px;
        font-weight: 800;
        letter-spacing: .12em;
        text-transform: uppercase;
      }

      .prototype-popup-title {
        color: var(--ink, #15171c);
        font-size: 18px;
        font-weight: 800;
        letter-spacing: -.02em;
      }

      .prototype-popup-close {
        width: 36px;
        height: 36px;
        flex: none;
        border: 1px solid var(--hairline, #e7eae8);
        border-radius: 10px;
        display: grid;
        place-items: center;
        color: var(--ink-3, #929aa3);
        background: var(--surface-2, #f7f9f8);
        cursor: pointer;
      }

      .prototype-popup-close:hover {
        color: var(--ink, #15171c);
        background: #eef1ef;
      }

      .prototype-popup-body {
        padding: 18px 20px 20px;
        overflow-y: auto;
        color: var(--ink-2, #5a616c);
      }

      .prototype-popup-foot {
        display: flex;
        justify-content: flex-end;
        gap: 10px;
        padding: 14px 20px 18px;
        border-top: 1px solid var(--hairline-soft, rgba(21, 23, 28, .05));
      }

      .prototype-grid {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 12px;
        margin-bottom: 16px;
      }

      .prototype-metric {
        border: 1px solid var(--hairline, #e7eae8);
        border-radius: 12px;
        padding: 12px;
        background: var(--surface-2, #f7f9f8);
      }

      .prototype-metric small {
        display: block;
        color: var(--ink-3, #929aa3);
        font-size: 10px;
        font-weight: 800;
        letter-spacing: .08em;
        text-transform: uppercase;
      }

      .prototype-metric strong {
        display: block;
        color: var(--ink, #15171c);
        margin-top: 6px;
        font-size: 20px;
        letter-spacing: -.02em;
      }

      .prototype-chart {
        height: 154px;
        display: grid;
        grid-template-columns: repeat(8, 1fr);
        align-items: end;
        gap: 8px;
        padding: 14px 12px 10px;
        margin: 12px 0 16px;
        border-radius: 13px;
        background: linear-gradient(180deg, #f7f9f8, #eef2ef);
        border: 1px solid var(--hairline, #e7eae8);
      }

      .prototype-bar {
        min-height: 14px;
        border-radius: 999px 999px 5px 5px;
        background: linear-gradient(180deg, var(--accent, #0f6e56), #7fd9bd);
      }

      .prototype-inline {
        margin-top: 14px;
        border: 1px solid var(--hairline, #e7eae8);
        border-radius: 13px;
        padding: 14px;
        background: var(--surface-2, #f7f9f8);
      }

      .prototype-inline-head,
      .prototype-split {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 12px;
        flex-wrap: wrap;
      }

      .prototype-inline-title {
        color: var(--ink, #15171c);
        font-weight: 800;
      }

      .prototype-inline-sub {
        margin-top: 4px;
        color: var(--ink-3, #929aa3);
        font-size: 12px;
      }

      .prototype-pill {
        display: inline-flex;
        align-items: center;
        gap: 6px;
        border-radius: 999px;
        background: var(--pos-t, rgba(15, 110, 86, .10));
        color: var(--accent, #0f6e56);
        padding: 5px 10px;
        font-size: 11px;
        font-weight: 800;
      }

      .prototype-range {
        width: 100%;
        accent-color: var(--accent, #0f6e56);
        margin-top: 10px;
      }

      .prototype-options {
        display: grid;
        gap: 8px;
      }

      .prototype-option {
        width: 100%;
        border: 1px solid var(--hairline, #e7eae8);
        border-radius: 11px;
        padding: 11px 12px;
        background: var(--surface, #fff);
        color: var(--ink, #15171c);
        font: 700 13px/1.3 "Hanken Grotesk", system-ui, sans-serif;
        text-align: left;
        cursor: pointer;
      }

      .prototype-option:hover,
      .prototype-option.on {
        border-color: var(--accent, #0f6e56);
        background: var(--pos-t, rgba(15, 110, 86, .10));
        color: var(--accent, #0f6e56);
      }

      .prototype-map-pin {
        position: absolute;
        left: 35%;
        top: 45%;
        transform: translate(-50%, -100%);
        min-width: 176px;
        border: 1px solid rgba(127, 217, 189, .35);
        border-radius: 12px;
        padding: 10px 12px;
        color: #eef7f4;
        background: rgba(15, 20, 24, .86);
        box-shadow: 0 18px 34px -18px rgba(0, 0, 0, .8);
      }

      .prototype-map-pin strong {
        display: block;
        color: #fff;
        font-size: 12px;
      }

      .prototype-map-pin span {
        display: block;
        margin-top: 3px;
        color: rgba(238, 247, 244, .72);
        font-size: 11px;
      }

      @media (max-width: 720px) {
        .prototype-grid {
          grid-template-columns: 1fr;
        }
      }
    `;

    document.head.appendChild(style);
  };

  const showToast = (message) => {
    ensurePrototypeStyles();
    document.querySelector(".prototype-toast")?.remove();

    const toast = document.createElement("div");
    toast.className = "prototype-toast";
    toast.textContent = message;
    document.body.appendChild(toast);

    window.setTimeout(() => toast.remove(), 2400);
  };

  const showPopup = ({ title, kicker = "Prototype action", body = "", footer = "" }) => {
    ensurePrototypeStyles();
    document.querySelector(".prototype-overlay")?.remove();

    const overlay = document.createElement("div");
    overlay.className = "prototype-overlay";
    overlay.setAttribute("role", "dialog");
    overlay.setAttribute("aria-modal", "true");
    overlay.innerHTML = `
      <div class="prototype-popup">
        <div class="prototype-popup-head">
          <div>
            <div class="prototype-popup-kicker">${kicker}</div>
            <div class="prototype-popup-title">${title}</div>
          </div>
          <button class="prototype-popup-close" type="button" aria-label="Close popup">X</button>
        </div>
        <div class="prototype-popup-body">${body}</div>
        ${footer ? `<div class="prototype-popup-foot">${footer}</div>` : ""}
      </div>
    `;

    let onKey;
    const close = () => {
      overlay.remove();

      if (onKey) {
        document.removeEventListener("keydown", onKey);
      }
    };
    overlay.addEventListener("click", (event) => {
      if (event.target === overlay || event.target.closest("[data-close-popup]")) {
        close();
      }
    });
    overlay.querySelector(".prototype-popup-close").addEventListener("click", close);
    document.body.appendChild(overlay);

    onKey = (event) => {
      if (event.key === "Escape") {
        close();
      }
    };
    document.addEventListener("keydown", onKey);

    return overlay;
  };

  const sensorData = {
    map: {
      title: "Map",
      value: "Union City, CA",
      status: "Live route point",
      description: "Tracker TRAC#929977 is pinned to the latest known location with route context.",
      metrics: [["Lat / Long", "37.593 / -122.043"], ["Last ping", "2 mins ago"], ["Route", "Hayward to Oakland"]],
      bars: [46, 52, 58, 62, 68, 73, 78, 84]
    },
    temperature: {
      title: "Temperature",
      value: "90.1 F",
      status: "Above threshold",
      description: "Current temperature is above the configured 90 F alert threshold.",
      metrics: [["Current", "90.1 F"], ["High", "91.6 F"], ["Threshold", "90 F"]],
      bars: [54, 58, 62, 64, 70, 76, 83, 88],
      threshold: { min: 70, max: 105, value: 90, unit: "F" }
    },
    humidity: {
      title: "Humidity",
      value: "47%",
      status: "Stable",
      description: "Humidity is inside the safe handling window for this shipment.",
      metrics: [["Current", "47%"], ["High", "54%"], ["Threshold", "65%"]],
      bars: [34, 39, 44, 47, 49, 51, 50, 47],
      threshold: { min: 20, max: 90, value: 65, unit: "%" }
    },
    light: {
      title: "Light",
      value: "1 Lux",
      status: "Low light alert",
      description: "Light dropped below the 10 Lux rule, so the alert appears in the tracker timeline.",
      metrics: [["Current", "1 Lux"], ["Lowest", "0.5 Lux"], ["Threshold", "10 Lux"]],
      bars: [36, 30, 22, 15, 11, 8, 5, 3],
      threshold: { min: 0, max: 100, value: 10, unit: "Lux" }
    },
    shock: {
      title: "Shock",
      value: "0.2 G",
      status: "Normal",
      description: "Shock readings are below the alert rule for this tracker.",
      metrics: [["Current", "0.2 G"], ["Peak", "1.1 G"], ["Threshold", "2 G"]],
      bars: [18, 20, 17, 34, 19, 22, 28, 16],
      threshold: { min: 1, max: 8, value: 2, unit: "G" }
    },
    battery: {
      title: "Battery",
      value: "9%",
      status: "Critical",
      description: "Battery is below the configured replacement threshold.",
      metrics: [["Current", "9%"], ["Warning", "25%"], ["Critical", "10%"]],
      bars: [82, 69, 55, 43, 31, 22, 14, 9],
      threshold: { min: 5, max: 60, value: 10, unit: "%" }
    },
    all: {
      title: "All Sensors",
      value: "6 streams",
      status: "Mixed health",
      description: "Temperature, light, and battery currently need attention. Humidity and shock are normal.",
      metrics: [["Attention", "3 sensors"], ["Normal", "2 sensors"], ["Live stream", "Map"]],
      bars: [52, 58, 65, 72, 64, 48, 37, 46]
    }
  };

  const keyForSensor = (chip) => {
    const label = clean(chip.textContent);

    if (label.includes("temperature")) {
      return "temperature";
    }

    if (label.includes("humidity")) {
      return "humidity";
    }

    if (label.includes("light")) {
      return "light";
    }

    if (label.includes("shock")) {
      return "shock";
    }

    if (label.includes("battery")) {
      return "battery";
    }

    if (label.includes("all")) {
      return "all";
    }

    return "map";
  };

  const chartMarkup = (bars) => `
    <div class="prototype-chart" aria-label="Reading trend">
      ${bars.map((height) => `<span class="prototype-bar" style="height:${height}%"></span>`).join("")}
    </div>
  `;

  const metricsMarkup = (sensor) => `
    <div class="prototype-grid">
      ${sensor.metrics.map(([label, value]) => `
        <div class="prototype-metric">
          <small>${label}</small>
          <strong>${value}</strong>
        </div>
      `).join("")}
    </div>
  `;

  const thresholdMarkup = (sensor) => {
    if (!sensor.threshold) {
      return "";
    }

    return `
      <div class="prototype-inline">
        <div class="prototype-split">
          <div>
            <div class="prototype-inline-title">Alert threshold</div>
            <div class="prototype-inline-sub">Drag the control to change this prototype rule.</div>
          </div>
          <span class="prototype-pill" data-threshold-readout>${sensor.threshold.value} ${sensor.threshold.unit}</span>
        </div>
        <input class="prototype-range" type="range" min="${sensor.threshold.min}" max="${sensor.threshold.max}" value="${sensor.threshold.value}" data-threshold-unit="${sensor.threshold.unit}">
        <div class="prototype-inline-sub" data-threshold-status>${sensor.title} alerts will trigger at ${sensor.threshold.value} ${sensor.threshold.unit}.</div>
      </div>
    `;
  };

  const updateInlineSensorPanel = (sensorKey) => {
    const sensor = sensorData[sensorKey] || sensorData.map;
    const liveCard = document.querySelector(".sensorbar")?.closest(".card");

    if (!liveCard) {
      return;
    }

    liveCard.querySelector(".maphead .c-title") && (liveCard.querySelector(".maphead .c-title").textContent = sensor.title);
    liveCard.querySelector(".prototype-inline")?.remove();
    liveCard.querySelector(".map .prototype-map-pin")?.remove();

    if (sensorKey === "map") {
      const map = liveCard.querySelector(".map");

      if (map) {
        const pin = document.createElement("div");
        pin.className = "prototype-map-pin";
        pin.innerHTML = `<strong>${sensor.value}</strong><span>${sensor.status}</span><span>TRAC#929977</span>`;
        map.appendChild(pin);
      }
    }

    const inline = document.createElement("div");
    inline.className = "prototype-inline";
    inline.innerHTML = `
      <div class="prototype-inline-head">
        <div>
          <div class="prototype-inline-title">${sensor.title}: ${sensor.value}</div>
          <div class="prototype-inline-sub">${sensor.description}</div>
        </div>
        <span class="prototype-pill">${sensor.status}</span>
      </div>
    `;

    const map = liveCard.querySelector(".map");

    if (map) {
      map.insertAdjacentElement("afterend", inline);
    }
  };

  const bindThresholdControls = (overlay, sensor) => {
    const range = overlay.querySelector(".prototype-range");

    if (!range) {
      return;
    }

    const readout = overlay.querySelector("[data-threshold-readout]");
    const status = overlay.querySelector("[data-threshold-status]");
    const unit = range.dataset.thresholdUnit || "";

    range.addEventListener("input", () => {
      readout.textContent = `${range.value} ${unit}`;
      status.textContent = `${sensor.title} alerts will now trigger at ${range.value} ${unit}.`;
    });
  };

  const openSensorPopup = (sensorKey) => {
    const sensor = sensorData[sensorKey] || sensorData.map;
    const overlay = showPopup({
      title: `${sensor.title} detail`,
      kicker: "Tracker detail popup",
      body: `
        ${metricsMarkup(sensor)}
        <p>${sensor.description}</p>
        ${chartMarkup(sensor.bars)}
        ${thresholdMarkup(sensor)}
      `,
      footer: `
        <button class="btn btn-out" type="button" data-close-popup>Close</button>
        <button class="btn btn-primary" type="button" data-close-popup>Apply prototype change</button>
      `
    });

    bindThresholdControls(overlay, sensor);
  };

  const openSettingsPopup = () => {
    showPopup({
      title: "Tracker settings",
      kicker: "Interactive popup",
      body: `
        <div class="prototype-options">
          <button class="prototype-option on" type="button">Data interval: 5 minutes</button>
          <button class="prototype-option" type="button">Update interval: 10 minutes</button>
          <button class="prototype-option" type="button">Share access: operations team</button>
          <button class="prototype-option" type="button">Alert rules: temperature, light, battery</button>
        </div>
      `,
      footer: `
        <button class="btn btn-out" type="button" data-close-popup>Cancel</button>
        <button class="btn btn-primary" type="button" data-close-popup>Save settings</button>
      `
    });
  };

  const openUpgradePopup = () => {
    showPopup({
      title: "Upgrade device",
      kicker: "Prototype checkout",
      body: `
        <div class="prototype-grid">
          <div class="prototype-metric"><small>Current</small><strong>NovaEdge</strong></div>
          <div class="prototype-metric"><small>Recommended</small><strong>NovaFive</strong></div>
          <div class="prototype-metric"><small>Benefit</small><strong>More sensors</strong></div>
        </div>
        <p>This prototype action illustrates the upgrade flow. The live product would continue into billing and device assignment.</p>
      `,
      footer: `
        <button class="btn btn-out" type="button" data-close-popup>Not now</button>
        <button class="btn btn-primary" type="button" data-close-popup>Request upgrade</button>
      `
    });
  };

  const openAlertPopup = (row) => {
    const title = row.querySelector(".ttl")?.textContent || row.querySelector(".pill")?.textContent || "Alert detail";
    const desc = row.querySelector(".desc")?.innerHTML || "No additional detail available.";
    const entity = row.querySelector(".id, .mono")?.textContent || "TRAC#865656";

    showPopup({
      title: title.replace(entity, "").trim() || "Alert detail",
      kicker: entity,
      body: `
        <div class="prototype-grid">
          <div class="prototype-metric"><small>Status</small><strong>Open</strong></div>
          <div class="prototype-metric"><small>Priority</small><strong>High</strong></div>
          <div class="prototype-metric"><small>Owner</small><strong>Ops team</strong></div>
        </div>
        <p>${desc}</p>
      `,
      footer: `
        <button class="btn btn-out" type="button" data-close-popup>Acknowledge</button>
        <button class="btn btn-primary" type="button" data-close-popup>Open tracker</button>
      `
    });
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
    const detailControl = row.querySelector('[data-prototype-link$="-details.html"], .btn-ghost, .btn-out, .btn-secondary');
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

  document.querySelectorAll(".h-act .iconbtn, .m-head .x").forEach((button) => {
    if (!currentPage.endsWith("-details.html")) {
      return;
    }

    if (isCloseIconButton(button)) {
      button.setAttribute("aria-label", "Close detail view");
      button.setAttribute("title", "Close detail view");
      button.addEventListener("click", (event) => {
        event.preventDefault();
        event.stopPropagation();
        window.location.assign(detailBackRoute());
      });
      return;
    }

    button.setAttribute("aria-label", "Open settings popup");
    button.setAttribute("title", "Open settings popup");
    button.addEventListener("click", (event) => {
      event.preventDefault();
      event.stopPropagation();
      openSettingsPopup();
    });
  });

  document.querySelectorAll(".h-act .btn-primary, .toolbar .btn-primary, .create").forEach((button) => {
    if (!clean(button.textContent).includes("upgrade") && !clean(button.textContent).includes("create") && !clean(button.textContent).includes("add")) {
      return;
    }

    if (button.dataset.prototypeLink) {
      return;
    }

    button.addEventListener("click", (event) => {
      event.preventDefault();
      event.stopPropagation();

      if (clean(button.textContent).includes("upgrade")) {
        openUpgradePopup();
      } else {
        showPopup({
          title: clean(button.textContent).replace(/\b\w/g, (char) => char.toUpperCase()),
          kicker: "Prototype form",
          body: `
            <div class="prototype-options">
              <button class="prototype-option on" type="button">Step 1: Basic information</button>
              <button class="prototype-option" type="button">Step 2: Assignment details</button>
              <button class="prototype-option" type="button">Step 3: Review and submit</button>
            </div>
          `,
          footer: `
            <button class="btn btn-out" type="button" data-close-popup>Cancel</button>
            <button class="btn btn-primary" type="button" data-close-popup>Save prototype</button>
          `
        });
      }
    });
  });

  document.querySelectorAll(".schip").forEach((chip) => {
    chip.setAttribute("role", "button");
    chip.setAttribute("tabindex", "0");
    chip.setAttribute("title", "Open sensor detail popup");

    const activate = (event) => {
      event.preventDefault();
      event.stopPropagation();

      const key = keyForSensor(chip);
      chip.parentElement?.querySelectorAll(".schip").forEach((item) => item.classList.remove("on"));
      chip.classList.add("on");
      updateInlineSensorPanel(key);
      openSensorPopup(key);
    };

    chip.addEventListener("click", activate);
    chip.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        activate(event);
      }
    });
  });

  if (document.querySelector(".sensorbar")) {
    updateInlineSensorPanel(keyForSensor(document.querySelector(".sensorbar .schip.on") || document.querySelector(".sensorbar .schip")));
  }

  document.querySelectorAll(".datefield").forEach((field) => {
    field.setAttribute("role", "button");
    field.setAttribute("tabindex", "0");
    field.addEventListener("click", (event) => {
      event.preventDefault();
      event.stopPropagation();

      showPopup({
        title: "Select date range",
        kicker: "Prototype control",
        body: `
          <div class="prototype-options">
            <button class="prototype-option on" type="button" data-date-choice="Today">Today</button>
            <button class="prototype-option" type="button" data-date-choice="Last 7 days">Last 7 days</button>
            <button class="prototype-option" type="button" data-date-choice="Last 30 days">Last 30 days</button>
            <button class="prototype-option" type="button" data-date-choice="Custom range">Custom range</button>
          </div>
        `,
        footer: `<button class="btn btn-primary" type="button" data-close-popup>Apply</button>`
      });

      document.querySelectorAll("[data-date-choice]").forEach((option) => {
        option.addEventListener("click", () => {
          field.querySelector(".inp").textContent = option.dataset.dateChoice;
          showToast(`Date changed to ${option.dataset.dateChoice}.`);
        });
      });
    });
  });

  document.querySelectorAll(".sel, .rsel").forEach((selectLike) => {
    selectLike.setAttribute("role", "button");
    selectLike.setAttribute("tabindex", "0");
    selectLike.addEventListener("click", (event) => {
      event.preventDefault();
      event.stopPropagation();

      const isStatus = selectLike.classList.contains("rsel");
      const options = isStatus ? ["Open", "Acknowledged", "Snoozed", "Resolved"] : ["All Type", "Temperature", "Light", "Battery", "Gateway"];

      showPopup({
        title: isStatus ? "Change alert status" : "Change filter",
        kicker: "Prototype dropdown",
        body: `
          <div class="prototype-options">
            ${options.map((option, index) => `<button class="prototype-option${index === 0 ? " on" : ""}" type="button" data-option-value="${option}">${option}</button>`).join("")}
          </div>
        `
      });

      document.querySelectorAll("[data-option-value]").forEach((option) => {
        option.addEventListener("click", () => {
          const value = option.dataset.optionValue;
          const svg = selectLike.querySelector("svg")?.outerHTML || "";
          selectLike.innerHTML = `${value}${svg}`;
          document.querySelector(".prototype-overlay")?.remove();
          showToast(`${isStatus ? "Status" : "Filter"} changed to ${value}.`);
        });
      });
    });
  });

  document.querySelectorAll(".seg button, .stat, .pg, .cbx").forEach((control) => {
    control.addEventListener("click", (event) => {
      event.stopPropagation();

      if (control.classList.contains("cbx")) {
        control.classList.toggle("on");
        return;
      }

      const group = control.closest(".seg, .stats, .pager");
      group?.querySelectorAll(".on").forEach((item) => item.classList.remove("on"));
      control.classList.add("on");
    });
  });

  document.querySelectorAll(".alert-row, .feed-row").forEach((row) => {
    row.setAttribute("role", "button");
    row.setAttribute("tabindex", "0");
    row.style.cursor = "pointer";

    const open = (event) => {
      event.preventDefault();
      event.stopPropagation();
      openAlertPopup(row);
    };

    row.addEventListener("click", open);
    row.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        open(event);
      }
    });
  });

  document.querySelectorAll(".toolbtn, .full, .recenter, .btn-out:not([data-prototype-link])").forEach((control) => {
    control.addEventListener("click", (event) => {
      event.preventDefault();
      event.stopPropagation();
      showToast("Prototype control activated.");
    });
  });
})();
