// BarberLink Admin Dashboard — JavaScript
// Initialise EmailJS



// ─────────────────────────────────────────────────────────

// ── MODULE-LEVEL CONSTANTS ─────────────────────────────
const MONTHS = [
  'January','February','March','April','May','June',
  'July','August','September','October','November','December'
];
const DAY_FULL_NAMES = [
  'Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'
];
const el = id => document.getElementById(id);
const SHOP_NAME_MAP = {
  'Fares Barbershop': 'fares',
  'Capri Barbershop': 'capri',
  'O&M Barbershop':  'om',
};

// ── DATA — matches booking system exactly ──────────
      const shopData = {
        fares: {
          name: "Fares Barbershop",
          address: "Abdoun Circle, Amman",
          stats: { bookings: 0, revenue: "0 JD", barbers: 5, first: 0 },
          barbers: [
            {
              name: "Fares Al-Nasser",
              initials: "FA",
              cls: "av1",
              available: true,
            },
            {
              name: "Omar Khalil",
              initials: "OK",
              cls: "av2",
              available: true,
            },
            {
              name: "Rami Hassan",
              initials: "RH",
              cls: "av3",
              available: true,
            },
            {
              name: "Ziad Mansour",
              initials: "ZM",
              cls: "av4",
              available: true,
            },
            {
              name: "Ibrahim Khalil",
              initials: "IK",
              cls: "av1",
              available: true,
            },
          ],
          appointments: [],
          blocked: [],
          days: [0, 1, 2, 3, 4, 6],
          hours: { open: "09:00", close: "19:00" },
        },
        capri: {
          name: "Capri Barbershop",
          address: "Swefieh, Amman",
          stats: { bookings: 0, revenue: "0 JD", barbers: 3, first: 0 },
          barbers: [
            {
              name: "Capri Haddad",
              initials: "CH",
              cls: "av1",
              available: true,
            },
            { name: "Mhmd Saad", initials: "MS", cls: "av2", available: true },
            {
              name: "Anas Yousef",
              initials: "AY",
              cls: "av3",
              available: true,
            },
          ],
          appointments: [],
          blocked: [],
          days: [0, 1, 2, 3, 4, 5],
          hours: { open: "10:00", close: "20:00" },
        },
        om: {
          name: "O&M Barbershop",
          address: "Shmeisani, Amman",
          stats: { bookings: 0, revenue: "0 JD", barbers: 4, first: 0 },
          barbers: [
            {
              name: "Omar Al-Khateeb",
              initials: "OK",
              cls: "av1",
              available: true,
            },
            {
              name: "Mustafa Nour",
              initials: "MN",
              cls: "av2",
              available: true,
            },
            { name: "Rami Saleh", initials: "RS", cls: "av3", available: true },
            { name: "Hasan Odeh", initials: "HO", cls: "av4", available: true },
          ],
          appointments: [],
          blocked: [],
          days: [1, 2, 3, 4, 5, 6],
          hours: { open: "09:00", close: "18:00" },
        },
      };

      // ── SHOP SERVICES — mirrors script.js SHOPS exactly ─
      const SHOP_SERVICES = {
        fares: [
          { name: "Classic Haircut", price: 10 },
          { name: "Hot Towel Shave", price: 10 },
          { name: "Haircut & Beard Trim", price: 15 },
          { name: "Kids Cut", price: 5 },
          { name: "Hair Colour", price: 25 },
          { name: "Scalp Treatment", price: 22 },
          { name: "Gentleman Package", price: 20 },
          { name: "VIP Grooming", price: 40 },
          { name: "Kids & Dad Package", price: 13 },
          { name: "Wedding Package", price: 50 },
          { name: "Refresh Package", price: 18 },
        ],
        capri: [
          { name: "Classic Haircut", price: 6 },
          { name: "Fade", price: 8 },
          { name: "Beard Trim", price: 4 },
          { name: "Hair Coloring", price: 20 },
          { name: "Haircut & Beard", price: 9 },
          { name: "Kids Cut", price: 5 },
          { name: "Student Package", price: 7 },
          { name: "Fade Master Package", price: 16 },
          { name: "Weekend Refresh", price: 14 },
          { name: "Executive Package", price: 25 },
          { name: "Color & Style Package", price: 30 },
          { name: "Father & Son Package", price: 10 },
        ],
        om: [
          { name: "Classic Haircut", price: 8 },
          { name: "Skin Fade", price: 12 },
          { name: "Beard Sculpting", price: 8 },
          { name: "Haircut & Beard", price: 15 },
          { name: "Hair Design", price: 18 },
          { name: "Scalp Treatment", price: 14 },
          { name: "Kids Cut", price: 6 },
          { name: "Luxury Groom Package", price: 22 },
          { name: "Style & Design Package", price: 24 },
          { name: "Royal VIP Package", price: 30 },
          { name: "Color Transformation", price: 32 },
          { name: "Groom Wedding Package", price: 40 },
        ],
      };
      function loadBookingsFromStorage() {
        const raw = JSON.parse(
          localStorage.getItem("barberlink_bookings") || "[]",
        );

        // Reset appointments, waiting list and stats
        Object.values(shopData).forEach((s) => {
          s.appointments = [];
          s.waitingList = [];
          s.stats = {
            bookings: 0,
            revenue: "0 JD",
            barbers: s.barbers.length,
            first: 0,
          };
        });

        const shopNameMap = SHOP_NAME_MAP;
        const seenClients = {};

        raw.forEach((bk) => {
          const key = shopNameMap[bk.shop];
          if (!key) return;
          const shop = shopData[key];

          const clientKey = bk.client + "_" + key;
          const isFirst = !seenClients[clientKey];
          seenClients[clientKey] = true;

          const dur = bk.total ? bk.total + " min" : "30 min";
          const price = (bk.total || 0) + " JD";
          const service = Array.isArray(bk.svcs)
            ? bk.svcs.join(", ")
            : bk.svcs || "Service";

          const isAnyAvailable =
            (bk.staff || "").toLowerCase() === "any available";
          const isWaitingList = !bk.time;

          // ── WAITING LIST ─────────────────────────────────
          if (isWaitingList) {
            shop.waitingList.push({
              client: bk.client || "Unknown",
              service,
              price,
              phone: bk.phone || "",
              first: isFirst,
              note: bk.note || "",
              _date: bk.date,
              _ref: bk.ref,
              _at: bk.at,
            });
            shop.stats.bookings += 1;
            const rev = parseInt(shop.stats.revenue) + (bk.total || 0);
            shop.stats.revenue = rev + " JD";
            if (isFirst) shop.stats.first += 1;
            return;
          }

          // ── REGULAR or ANY AVAILABLE ──────────────────────
          let barberIdx = shop.barbers.findIndex(
            (b) => b.name.toLowerCase() === (bk.staff || "").toLowerCase(),
          );
          // Any Available → assign to first available barber, flag it
          if (barberIdx < 0) barberIdx = 0;

          shop.appointments.push({
            barber: barberIdx,
            time: bk.time,
            client: bk.client || "Unknown",
            service,
            duration: dur,
            price,
            first: isFirst,
            phone: bk.phone || "",
            anyAvailable: isAnyAvailable,
            _date: bk.date,
            _ref: bk.ref,
          });

          shop.stats.bookings += 1;
          const rev = parseInt(shop.stats.revenue) + (bk.total || 0);
          shop.stats.revenue = rev + " JD";
          if (isFirst) shop.stats.first += 1;
        });
      }

      // ── CUSTOMERS — built from localStorage ───────────
      function buildCustomersFromStorage() {
        const raw = JSON.parse(
          localStorage.getItem("barberlink_bookings") || "[]",
        );
        const clientMap = {};
        raw.forEach((bk) => {
          const k = bk.client + "_" + bk.shop;
          if (!clientMap[k]) {
            clientMap[k] = {
              name: bk.client,
              shop: bk.shop,
              visits: 0,
              last: "",
              date: "",
              spent: 0,
              ratingSum: 0,
              ratingCount: 0,
            };
          }
          clientMap[k].visits += 1;
          clientMap[k].last = Array.isArray(bk.svcs) ? bk.svcs[0] : bk.svcs;
          clientMap[k].date = bk.date
            ? new Date(bk.date).toLocaleDateString("en-GB", {
                day: "2-digit",
                month: "short",
                year: "numeric",
              })
            : "—";
          clientMap[k].spent += bk.total || 0;
          if (bk.rating) {
            clientMap[k].ratingSum += bk.rating;
            clientMap[k].ratingCount += 1;
          }
        });
        return Object.values(clientMap).map((c) => ({
          ...c,
          spent: c.spent + " JD",
          avgRating: c.ratingCount > 0 ? (c.ratingSum / c.ratingCount) : 0,
        }));
      }

      function buildTimes(shopKey) {
        const saved = JSON.parse(
          localStorage.getItem("barberlink_shop_hours") || "{}",
        );
        const hours = saved[shopKey] || shopData[shopKey].hours;
        const openH = parseInt((hours.open || "09:00").split(":")[0]);
        const closeH = parseInt((hours.close || "21:00").split(":")[0]);
        const times = [];
        for (let h = openH; h <= closeH; h++) {
          times.push(`${String(h).padStart(2, "0")}:00`);
          if (h < closeH) times.push(`${String(h).padStart(2, "0")}:30`);
        }
        return times;
      }

      let TIMES = buildTimes("fares");
      const DAY_NAMES = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
      let currentShop = "fares",
        blockedSlots = {},
        pendingBlock = null;
      let weekStart = new Date();
      weekStart.setDate(weekStart.getDate() - weekStart.getDay());
      let selectedDate = new Date();

      // ── PAGE NAV ──────────────────────────────────────
      function showPage(page, navEl) {
        document
          .querySelectorAll(".page")
          .forEach((p) => p.classList.remove("active"));
        document
          .querySelectorAll(".nav-item")
          .forEach((n) => n.classList.remove("active"));
        document.getElementById("page-" + page).classList.add("active");
        if (navEl) {
          navEl.classList.add("active");
        } else {
          const match = document.querySelector('.nav-item[href="#' + page + '"]');
          if (match) match.classList.add("active");
        }
        if (location.hash !== "#" + page) history.pushState(null, "", "#" + page);
        const titles = {
          dashboard: "Dashboard",
          appointments: "Appointments",
          customers: "Customers",
          shops: "Shops",
          partners: "Partner Applications",
          jobapps:  "Job Applications",
          email: "Daily Email",
          ratings: "Ratings",
          promos: "Promo Codes",
          settings: "Settings",
        };
        document.getElementById("page-title").textContent = titles[page] || "";
        document.getElementById("shop-switcher").style.display =
          page === "appointments" ? "flex" : "none";
        if (page === "customers") renderCustomers(buildCustomersFromStorage());
        if (page === "ratings") renderRatings();
        if (page === "promos") renderPromos();
        if (page === "shops") renderShops();
        if (page === "dashboard") renderDashboard();
        if (page === "partners") loadPartners();
        if (page === "jobapps")  loadJobApps();
      }

      // ── SHOP SWITCH ───────────────────────────────────
      function switchShop(el, shop) {
        document
          .querySelectorAll(".shop-tab")
          .forEach((t) => t.classList.remove("active"));
        el.classList.add("active");
        currentShop = shop;
        TIMES = buildTimes(shop);
        hideTooltip();
        initBlocked();
        renderStats();
        renderBarberHeaders();
        renderGrid();
        renderWaitingList();
      }

      // ── WEEK STRIP ────────────────────────────────────
      function shiftWeek(dir) {
        weekStart.setDate(weekStart.getDate() + dir * 7);
        renderWeekStrip();
      }

      function renderWeekStrip() {
        const wrap = document.getElementById("week-days");
        wrap.innerHTML = "";
        const today = new Date();
        // Week end date
        const weekEnd = new Date(weekStart);
        weekEnd.setDate(weekEnd.getDate() + 6);

        // Month label — show both if week spans two months
        const startMonth = MONTHS[weekStart.getMonth()];
        const endMonth = MONTHS[weekEnd.getMonth()];
        const year = weekStart.getFullYear();
        const monthLbl =
          startMonth === endMonth
            ? `${startMonth} ${year}`
            : `${startMonth} — ${endMonth} ${year}`;
        const mlEl = document.getElementById("month-label");
        if (mlEl) mlEl.textContent = monthLbl;

        // Week range label
        const wrlEl = document.getElementById("week-range-label");
        if (wrlEl)
          wrlEl.textContent = `${weekStart.getDate()} – ${weekEnd.getDate()} ${endMonth}`;

        for (let i = 0; i < 7; i++) {
          const d = new Date(weekStart);
          d.setDate(d.getDate() + i);
          const isToday = d.toDateString() === today.toDateString();
          const isSel = d.toDateString() === selectedDate.toDateString();
          const count = isSel
            ? shopData[currentShop].appointments.filter((a) => {
                if (!a._date) return true;
                const ad = new Date(a._date);
                return ad.toDateString() === d.toDateString();
              }).length
            : 0;
          const box = document.createElement("div");
          box.className =
            "day-box" + (isToday ? " today" : "") + (isSel ? " selected" : "");
          box.innerHTML = `<div class="day-name">${DAY_NAMES[d.getDay()]}</div><div class="day-num">${d.getDate()}</div><div class="day-appt-count">${isSel ? count + " appts" : ""}</div>`;
          box.addEventListener("click", () => {
            selectedDate = new Date(d);
            renderWeekStrip();
            renderStats();
            renderGrid();
            renderWaitingList();
          });
          wrap.appendChild(box);
        }
      }

      // ── STATS ─────────────────────────────────────────
      function renderStats() {
        const shop = shopData[currentShop];
        const selStr = selectedDate.toDateString();
        const dayAppts = shop.appointments.filter((a) => {
          if (!a._date) return false;
          return new Date(a._date).toDateString() === selStr;
        });

        const bookings = dayAppts.length;
        const revenue = dayAppts.reduce(
          (s, a) => s + (parseInt(a.price) || 0),
          0,
        );
        const barbers = shop.barbers.filter((b) => b.available).length;
        const first = dayAppts.filter((a) => a.first).length;

        const isToday = selStr === new Date().toDateString();
        const dateLabel = isToday
          ? "Today"
          : selectedDate.toLocaleDateString("en-GB", {
              day: "numeric",
              month: "short",
            });

        document.getElementById("s-bookings").textContent = bookings;
        document.getElementById("s-revenue").textContent = revenue + " JD";
        document.getElementById("s-barbers").textContent = barbers;
        document.getElementById("s-first").textContent = first;

        document.getElementById("s-lbl-bookings").textContent =
          "Bookings — " + dateLabel;
        document.getElementById("s-lbl-revenue").textContent =
          "Revenue — " + dateLabel;
        document.getElementById("s-lbl-first").textContent =
          "First-Time — " + dateLabel;
      }

      // ── BARBER HEADERS ────────────────────────────────
      function renderBarberHeaders() {
        const row = document.getElementById("barber-header-row");
        while (row.children.length > 1) row.removeChild(row.lastChild);
        shopData[currentShop].barbers.forEach((b, i) => {
          const div = document.createElement("div");
          div.className = "bh-col";
          div.title = b.available
            ? "Click to mark day off"
            : "Click to mark available";
          div.innerHTML = `<div class="bh-avatar ${b.cls}">${b.initials}</div><div><div class="bh-name">${b.name}</div><div class="bh-status">${b.available ? "Available" : "Day Off"}</div></div><div class="bh-avail ${b.available ? "" : "off"}"></div>`;
          div.addEventListener("click", () => toggleBarber(i, b));
          row.appendChild(div);
        });
      }

      // ── GRID ──────────────────────────────────────────
      function initBlocked() {
        blockedSlots = {};
        shopData[currentShop].blocked.forEach((b) => {
          blockedSlots[`${b.barber}-${b.time}`] = true;
        });
      }

      function renderGrid() {
        const calRows = document.getElementById("cal-rows");
        calRows.innerHTML = "";
        const shop = shopData[currentShop];

        const selStr = selectedDate.toDateString();
        const dayAppts = shop.appointments.filter((a) => {
          if (!a._date) return false;
          return new Date(a._date).toDateString() === selStr;
        });
        const apptMap = {};
        dayAppts.forEach((a) => {
          apptMap[`${a.barber}-${a.time}`] = a;
        });

        TIMES.forEach((t) => {
          const isHalf = t.endsWith(":30");

          // Full row: time label + all barber cells
          const row = document.createElement("div");
          row.className = "cal-row";

          // Time label — lives inside the row so height is shared
          const lbl = document.createElement("div");
          lbl.className = "time-slot-label" + (isHalf ? " half" : "");
          lbl.textContent = t;
          row.appendChild(lbl);

          shop.barbers.forEach((b, bi) => {
            const cell = document.createElement("div");
            cell.className = "slot-cell";
            const key = `${bi}-${t}`;
            const isBlocked = blockedSlots[key];
            const appt = apptMap[key];

            if (isBlocked) {
              cell.classList.add("blocked");
              cell.title = "Blocked — click to unblock";
              cell.addEventListener("click", () => {
                delete blockedSlots[key];
                try {
                  const blocked = JSON.parse(
                    localStorage.getItem("barberlink_blocked") || "{}",
                  );
                  if (blocked[currentShop]) {
                    delete blocked[currentShop][key];
                    localStorage.setItem(
                      "barberlink_blocked",
                      JSON.stringify(blocked),
                    );
                  }
                } catch (e) {}
                renderGrid();
              });
            } else if (appt) {
              const card = document.createElement("div");
              const anyClass = appt.anyAvailable
                ? " any-available"
                : ` b${(bi % 4) + 1}`;
              card.className = `appt-card${anyClass}${appt.tall ? " tall" : ""}`;
              const badges = [
                appt.first ? '<span class="new-badge">New</span>' : "",
                appt.anyAvailable
                  ? '<span class="any-badge">Assign</span>'
                  : "",
              ].join("");
              const corners = appt.anyAvailable
                ? `<div style="position:absolute;top:2px;right:2px;width:10px;height:10px;border-top:2px solid #b06848;border-right:2px solid #b06848;border-radius:0 3px 0 0"></div>
                   <div style="position:absolute;bottom:2px;left:2px;width:10px;height:10px;border-bottom:2px solid #b06848;border-left:2px solid #b06848;border-radius:0 0 0 3px"></div>`
                : "";
              card.dataset.ref = appt._ref || '';
              card.innerHTML = `${corners}<div class="ac-client">${appt.client}${badges}</div><div class="ac-service">${appt.service}</div><div class="ac-meta"><span class="ac-dur">${appt.duration}</span><span class="ac-price">${appt.price}</span><button class="ac-cancel-btn" title="Cancel booking" onclick="cancelBooking(event, '${appt._ref || ''}', '${appt.client}', '${appt.service}', '${appt.time || ''}')">&#x2715;</button></div>`;
              card.addEventListener("mouseenter", (e) => showTooltip(e, appt));
              card.addEventListener("mouseleave", hideTooltip);
              card.addEventListener("click", (e) => e.stopPropagation());
              cell.appendChild(card);
              cell.style.cursor = "default";
            } else {
              cell.title = "Click to block slot";
              cell.addEventListener("click", () => promptBlock(bi, t, b.name));
            }
            row.appendChild(cell);
          });

          calRows.appendChild(row);
        });

        renderWaitingList();
      }

      // ── WAITING LIST ──────────────────────────────────
      function renderWaitingList() {
        const shop = shopData[currentShop];
        const selStr = selectedDate.toDateString();
        const wl = (shop.waitingList || []).filter((a) => {
          if (!a._date) return false;
          return new Date(a._date).toDateString() === selStr;
        });

        document.getElementById("wl-count").textContent = wl.length;
        const body = document.getElementById("wl-body");

        if (wl.length === 0) {
          body.innerHTML = `<div class="wl-empty">No waiting list entries for this day.</div>`;
          return;
        }

        body.innerHTML = wl
          .map((a) => {
            const initials = a.client
              .split(" ")
              .map((n) => n[0])
              .join("")
              .slice(0, 2)
              .toUpperCase();
            const rawPhone = (a.phone || "").replace(/\s+/g, "");
            const waPhone = rawPhone.startsWith("+")
              ? rawPhone.slice(1)
              : rawPhone;
            const phoneHTML = rawPhone
              ? `<div class="wl-phone">
                <a href="tel:${rawPhone}" style="color:var(--text-muted);text-decoration:none">${a.phone}</a>
                &nbsp;·&nbsp;
                <a href="https://wa.me/${waPhone}" style="color:#25d366;text-decoration:none">WhatsApp</a>
               </div>`
              : "";
            return `<div class="wl-row">
            <div class="wl-avatar">${initials}</div>
            <div>
              <div class="wl-client">${a.client}${a.first ? '<span class="wl-new-badge">New</span>' : ""}</div>
              <div class="wl-service">${a.service}</div>
            </div>
            <div class="wl-meta">
              <div class="wl-price">${a.price}</div>
              ${phoneHTML}
            </div>
          </div>`;
          })
          .join("");
      }

      function toggleBarber(i, b) {
        b.available = !b.available;
        TIMES.forEach((t) => {
          const k = `${i}-${t}`;
          b.available ? delete blockedSlots[k] : (blockedSlots[k] = true);
        });

        // Write to barberlink_barbers so booking system reads it immediately
        try {
          const barberData = JSON.parse(
            localStorage.getItem("barberlink_barbers") || "{}",
          );
          if (!barberData[currentShop]) barberData[currentShop] = [];
          if (!b.available) {
            if (!barberData[currentShop].includes(b.name))
              barberData[currentShop].push(b.name);
          } else {
            barberData[currentShop] = barberData[currentShop].filter(
              (n) => n !== b.name,
            );
          }
          localStorage.setItem(
            "barberlink_barbers",
            JSON.stringify(barberData),
          );
        } catch (e) {}

        // Also persist to barberlink_shop_settings so admin survives refresh
        try {
          const saved = JSON.parse(
            localStorage.getItem("barberlink_shop_settings") || "{}",
          );
          if (!saved[currentShop]) saved[currentShop] = {};
          saved[currentShop].barbers = shopData[currentShop].barbers.map(
            (b) => ({
              name: b.name,
              available: b.available,
            }),
          );
          localStorage.setItem(
            "barberlink_shop_settings",
            JSON.stringify(saved),
          );
        } catch (e) {}

        renderBarberHeaders();
        renderGrid();
      }

      // ── BLOCK MODAL ───────────────────────────────────
      function promptBlock(barber, time, name) {
        pendingBlock = { barber, time };
        document.getElementById("modal-title").textContent =
          `Block ${time} slot?`;
        document.getElementById("modal-desc").textContent =
          `The ${time} slot for ${name} will be marked as unavailable.`;
        document.getElementById("overlay").classList.add("visible");
      }
      function confirmBlock() {
        if (!pendingBlock) return;
        const key = `${pendingBlock.barber}-${pendingBlock.time}`;
        blockedSlots[key] = true;
        try {
          const blocked = JSON.parse(
            localStorage.getItem("barberlink_blocked") || "{}",
          );
          if (!blocked[currentShop]) blocked[currentShop] = {};
          blocked[currentShop][key] = selectedDate.toISOString();
          localStorage.setItem("barberlink_blocked", JSON.stringify(blocked));
        } catch (e) {}
        closeModal();
        renderGrid();
      }
      function closeModal() {
        document.getElementById("overlay").classList.remove("visible");
        pendingBlock = null;
      }
      document
        .getElementById("overlay")
        .addEventListener("click", function (e) {
          if (e.target === this) closeModal();
        });

      // ── TOOLTIP ───────────────────────────────────────
      function showTooltip(e, appt) {
        const tip = document.getElementById("tooltip");
        tip.innerHTML = `<div class="tip-client">${appt.client}</div><div class="tip-service">${appt.service}</div><div class="tip-row"><span>Time</span><strong>${appt.time}</strong></div><div class="tip-row"><span>Duration</span><strong>${appt.duration}</strong></div><div class="tip-row"><span>Price</span><strong>${appt.price}</strong></div>${appt.first ? '<div class="tip-new">First visit — new client</div>' : ""}`;
        const rect = e.currentTarget.getBoundingClientRect();
        let left = rect.right + 10,
          top = rect.top;
        if (left + 240 > window.innerWidth) left = rect.left - 248;
        if (top + 200 > window.innerHeight) top = window.innerHeight - 210;
        tip.style.left = left + "px";
        tip.style.top = Math.max(8, top) + "px";
        tip.classList.add("visible");
      }
      function hideTooltip() {
        document.getElementById("tooltip").classList.remove("visible");
      }

      // ── CUSTOMERS ─────────────────────────────────────
      const avatarColors = [
        "#c8906a",
        "#6a90b8",
        "#6aa87a",
        "#a870b0",
        "#b0906a",
        "#6ab0b0",
      ];
      function renderCustomers(list) {
        const tbody = document.getElementById("cust-tbody");
        tbody.innerHTML = "";
        list.forEach((c, i) => {
          const maxDots = 8;
          const filled = Math.min(c.visits, maxDots);
          const dots = Array.from(
            { length: maxDots },
            (_, j) => `<div class="vdot${j < filled ? " filled" : ""}"></div>`,
          ).join("");
          const tr = document.createElement("tr");
          const ratingHtml = c.avgRating > 0
            ? `<span style="color:#c8a86a;font-size:14px">${'★'.repeat(Math.round(c.avgRating))}${'☆'.repeat(5-Math.round(c.avgRating))}</span> <span style="font-size:11px;color:var(--text-muted);font-family:'Libre Baskerville',serif">${c.avgRating.toFixed(1)}</span>`
            : `<span style="font-size:11px;color:var(--text-muted);font-style:italic">No rating</span>`;
          tr.innerHTML = `<td><span class="cust-avatar-sm" style="background:${avatarColors[i % avatarColors.length]}">${c.name
            .split(" ")
            .map((n) => n[0])
            .join("")
            .slice(
              0,
              2,
            )}</span>${c.name}</td><td>${c.shop}</td><td><div class="visits-dots">${dots}<span style="margin-left:5px;font-size:11px;color:var(--text-muted);font-family:'Libre Baskerville',serif">${c.visits}x</span></div></td><td>${c.last}</td><td>${c.date}</td><td style="font-family:'Cormorant Garamond',serif;font-size:16px;font-weight:700">${c.spent}</td><td>${ratingHtml}</td>`;
          tbody.appendChild(tr);
        });
      }
      function filterCustomers(q) {
        const all = buildCustomersFromStorage();
        const filtered = all.filter(
          (c) =>
            c.name.toLowerCase().includes(q.toLowerCase()) ||
            c.shop.toLowerCase().includes(q.toLowerCase()),
        );
        renderCustomers(filtered);
      }

      // ── RATINGS ───────────────────────────────────────
      function renderRatings() {
        const raw = JSON.parse(localStorage.getItem("barberlink_bookings") || "[]");
        const rated = raw.filter(b => b.rating);

        // Summary cards
        const summary = document.getElementById("ratings-summary");
        const totalRated = rated.length;
        const avgAll = totalRated > 0 ? (rated.reduce((s,b) => s + b.rating, 0) / totalRated) : 0;
        const fiveStars = rated.filter(b => b.rating === 5).length;
        const lowStars  = rated.filter(b => b.rating <= 2).length;

        const shopAvgs = ["Fares Barbershop","Capri Barbershop","O&M Barbershop"].map(name => {
          const s = rated.filter(b => b.shop === name);
          return { name: name.replace(" Barbershop",""), avg: s.length ? (s.reduce((a,b) => a + b.rating,0)/s.length).toFixed(1) : null, count: s.length };
        });

        summary.innerHTML = `
          <div class="rating-stat-card">
            <div class="rating-stat-label">Overall Average</div>
            <div class="rating-stat-val">
              ${avgAll > 0 ? avgAll.toFixed(1) : '—'}
              ${avgAll > 0 ? `<span class="rating-stat-stars">${'★'.repeat(Math.round(avgAll))}${'☆'.repeat(5-Math.round(avgAll))}</span>` : ''}
            </div>
            <div class="rating-stat-sub">${totalRated} rating${totalRated !== 1 ? 's' : ''} total</div>
          </div>
          ${shopAvgs.map(s => `
          <div class="rating-stat-card">
            <div class="rating-stat-label">${s.name}</div>
            <div class="rating-stat-val">
              ${s.avg || '—'}
              ${s.avg ? `<span class="rating-stat-stars">${'★'.repeat(Math.round(s.avg))}${'☆'.repeat(5-Math.round(s.avg))}</span>` : ''}
            </div>
            <div class="rating-stat-sub">${s.count} rating${s.count !== 1 ? 's' : ''}</div>
          </div>`).join('')}
        `;

        // Filters
        const shopFilter = document.getElementById("ratings-shop-filter").value;
        const starFilter = document.getElementById("ratings-star-filter").value;

        let filtered = rated;
        if (shopFilter !== "all") filtered = filtered.filter(b => b.shop === shopFilter);
        if (starFilter !== "all") filtered = filtered.filter(b => b.rating === parseInt(starFilter));

        // Sort newest first
        filtered.sort((a,b) => new Date(b.ratedAt||b.date) - new Date(a.ratedAt||a.date));

        const tbody = document.getElementById("ratings-tbody");
        if (filtered.length === 0) {
          tbody.innerHTML = `<tr><td colspan="7" class="rating-empty">No ratings found.</td></tr>`;
          return;
        }

        tbody.innerHTML = filtered.map(bk => {
          const stars = '★'.repeat(bk.rating) + '☆'.repeat(5 - bk.rating);
          const dateStr = bk.date ? new Date(bk.date).toLocaleDateString("en-GB", { day:"2-digit", month:"short", year:"numeric" }) : "—";
          const ratedOnStr = bk.ratedAt ? new Date(bk.ratedAt).toLocaleDateString("en-GB", { day:"2-digit", month:"short", year:"numeric" }) : "—";
          const svc = Array.isArray(bk.svcs) ? bk.svcs.join(", ") : (bk.svcs || "—");
          return `<tr>
            <td>${bk.client || "—"}</td>
            <td>${bk.shop || "—"}</td>
            <td>${bk.staff || "—"}</td>
            <td>${svc}</td>
            <td>${dateStr}</td>
            <td><span class="rating-stars-cell">${stars}</span> <span style="font-size:11px;color:var(--text-muted);font-family:'Libre Baskerville',serif">${bk.rating}/5</span></td>
            <td style="color:var(--text-muted);font-size:13px">${ratedOnStr}</td>
          </tr>`;
        }).join("");
      }

      // ── PROMO CODES ───────────────────────────────────
      const PROMO_STORAGE_KEY = 'barberlink_promos';

      function getPromos() {
        try { return JSON.parse(localStorage.getItem(PROMO_STORAGE_KEY) || '[]'); }
        catch(e) { return []; }
      }
      function savePromos(list) {
        localStorage.setItem(PROMO_STORAGE_KEY, JSON.stringify(list));
      }

      function createPromo() {
        const code     = document.getElementById('pf-code').value.trim().toUpperCase();
        const type     = document.getElementById('pf-type').value;
        const value    = parseFloat(document.getElementById('pf-value').value);
        const uses     = parseInt(document.getElementById('pf-uses').value) || 0;
        const minOrder = parseFloat(document.getElementById('pf-minorder').value) || 0;
        const shop     = document.getElementById('pf-shop').value;
        const expiry   = document.getElementById('pf-expiry').value || null;
        let hasErr     = false;

        ['pf-code','pf-value'].forEach(id => document.getElementById(id).classList.remove('err'));
        document.getElementById('pf-code-err').textContent  = '';
        document.getElementById('pf-value-err').textContent = '';

        if (!code) {
          document.getElementById('pf-code').classList.add('err');
          document.getElementById('pf-code-err').textContent = 'Code is required';
          hasErr = true;
        }
        if (!value || value <= 0) {
          document.getElementById('pf-value').classList.add('err');
          document.getElementById('pf-value-err').textContent = 'Enter a valid value';
          hasErr = true;
        }
        if (type === 'percent' && value > 100) {
          document.getElementById('pf-value').classList.add('err');
          document.getElementById('pf-value-err').textContent = 'Cannot exceed 100%';
          hasErr = true;
        }
        if (hasErr) return;

        const promos = getPromos();
        if (promos.find(p => p.code === code)) {
          document.getElementById('pf-code').classList.add('err');
          document.getElementById('pf-code-err').textContent = 'Code already exists';
          return;
        }

        promos.push({ code, type, value, maxUses: uses, usedCount: 0, minOrder, shop, expiry, createdAt: new Date().toISOString() });
        savePromos(promos);

        document.getElementById('pf-code').value     = '';
        document.getElementById('pf-value').value    = '';
        document.getElementById('pf-uses').value     = '0';
        document.getElementById('pf-minorder').value = '0';
        document.getElementById('pf-shop').value     = 'all';
        document.getElementById('pf-expiry').value   = '';
        renderPromos();
      }

      function deletePromo(code) {
        savePromos(getPromos().filter(p => p.code !== code));
        renderPromos();
      }

      function renderPromos() {
        const promos = getPromos();
        document.getElementById('promo-count').textContent = `${promos.length} code${promos.length !== 1 ? 's' : ''}`;
        const tbody = document.getElementById('promos-tbody');

        if (promos.length === 0) {
          tbody.innerHTML = `<tr><td colspan="10" style="text-align:center;padding:30px;color:var(--text-muted);font-style:italic;font-family:'EB Garamond',serif">No promo codes yet. Create one above.</td></tr>`;
          return;
        }

        tbody.innerHTML = promos.map(p => {
          const dateStr    = new Date(p.createdAt).toLocaleDateString('en-GB', { day:'2-digit', month:'short', year:'numeric' });
          const badgeClass = p.type === 'percent' ? 'promo-badge-percent' : 'promo-badge-fixed';
          const typeLabel  = p.type === 'percent' ? 'Percent' : 'Fixed';
          const valLabel   = p.type === 'percent' ? `${p.value}%` : `${p.value} JD`;
          const maxLabel   = p.maxUses === 0 ? 'Unlimited' : p.maxUses;
          const minLabel   = p.minOrder > 0 ? `${p.minOrder} JD` : '—';
          const shopLabel  = p.shop && p.shop !== 'all' ? p.shop.replace(' Barbershop','') : 'All Shops';
          const expiryLabel = p.expiry ? new Date(p.expiry).toLocaleDateString('en-GB', { day:'2-digit', month:'short', year:'numeric' }) : '—';
          const isExpired  = p.expiry && new Date(p.expiry) < new Date();
          return `<tr style="${isExpired ? 'opacity:0.5' : ''}">
            <td style="font-family:'Cormorant Garamond',serif;font-size:17px;font-weight:700;letter-spacing:0.05em">${p.code}${isExpired ? ' <span style="font-size:10px;color:#c0392b;font-family:\'Libre Baskerville\',serif">EXPIRED</span>' : ''}</td>
            <td><span class="promo-badge ${badgeClass}">${typeLabel}</span></td>
            <td style="font-family:'Cormorant Garamond',serif;font-size:17px;font-weight:700">${valLabel}</td>
            <td>${p.usedCount || 0}</td>
            <td>${maxLabel}</td>
            <td style="font-size:13px">${minLabel}</td>
            <td style="font-size:13px">${shopLabel}</td>
            <td style="font-size:13px;color:${isExpired ? '#c0392b' : 'var(--text-muted)'}">${expiryLabel}</td>
            <td style="color:var(--text-muted);font-size:13px">${dateStr}</td>
            <td><button class="promo-delete-btn" onclick="deletePromo('${p.code}')">Delete</button></td>
          </tr>`;
        }).join('');
      }

      // ── SHOPS ─────────────────────────────────────────
      function renderShops() {
        const grid = document.getElementById("shops-grid");
        grid.innerHTML = "";
        Object.values(shopData).forEach((shop) => {
          const card = document.createElement("div");
          card.className = "shop-card";

          const daysHtml = DAY_NAMES.map(
            (d, i) =>
              `<div class="day-pill${shop.days.includes(i) ? " on" : ""}" onclick="this.classList.toggle('on')">${d}</div>`,
          ).join("");

          const barbersHtml = shop.barbers
            .map(
              (b) =>
                `<div class="shop-barber-row">
                <div class="bh-avatar ${b.cls}" style="width:26px;height:26px;font-size:11px;flex-shrink:0">${b.initials}</div>
                <div class="shop-barber-name">${b.name}</div>
                <div class="shop-barber-role">${b.available ? "Available" : "Day off"}</div>
                <div class="toggle${b.available ? " on" : ""}" onclick="this.classList.toggle('on');this.previousElementSibling.textContent=this.classList.contains('on')?'Available':'Day off'"></div>
              </div>`,
            )
            .join("");

          card.innerHTML = `
            <div class="shop-card-head">
              <div>
                <div class="shop-card-name">${shop.name}</div>
                <div class="shop-card-addr">${shop.address}</div>
              </div>
              <div class="shop-open-badge">Open</div>
            </div>
            <div class="shop-divider"></div>
            <div class="shop-card-body">
              <div class="shop-field">
                <div class="shop-field-lbl">Days</div>
                <div class="days-grid">${daysHtml}</div>
              </div>
              <div class="shop-field">
                <div class="shop-field-lbl">Hours</div>
                <div class="hours-row">
                  <input class="hours-input" value="${shop.hours.open}">
                  <span class="hours-lbl">—</span>
                  <input class="hours-input" value="${shop.hours.close}">
                </div>
              </div>
              <div class="shop-field top">
                <div class="shop-field-lbl" style="padding-top:9px">Barbers</div>
                <div class="shop-barbers">${barbersHtml}</div>
              </div>
            </div>
            <div class="shop-card-footer">
              <button class="btn-shop-save">Save changes</button>
            </div>`;

          // Wire Save button with the shop key
          const shopKey = Object.keys(shopData).find(
            (k) => shopData[k] === shop,
          );
          card.querySelector(".btn-shop-save").addEventListener("click", () => {
            saveShopSettings(shopKey, card);
          });

          grid.appendChild(card);
        });
      }



      // ── DAILY EMAIL ───────────────────────────────────
      function generateEmailHTML(shopKey) {
        const shop = shopData[shopKey];
        const date = selectedDate;
        const selStr = date.toDateString();
        const dateStr = `${DAY_FULL_NAMES[date.getDay()]}, ${date.getDate()} ${MONTHS[date.getMonth()]} ${date.getFullYear()}`;

        // Filter appointments and waiting list to selected date only
        const dayAppts = shop.appointments.filter(
          (a) => a._date && new Date(a._date).toDateString() === selStr,
        );
        const dayWL = (shop.waitingList || []).filter(
          (a) => a._date && new Date(a._date).toDateString() === selStr,
        );

        const totalRevenue =
          dayAppts.reduce((s, a) => s + (parseInt(a.price) || 0), 0) +
          dayWL.reduce((s, a) => s + (parseInt(a.price) || 0), 0);
        const newClients = [...dayAppts, ...dayWL].filter(
          (a) => a.first,
        ).length;

        const grouped = {};
        shop.barbers.forEach((b, i) => {
          grouped[i] = [];
        });
        dayAppts.forEach((a) => {
          if (grouped[a.barber] !== undefined) grouped[a.barber].push(a);
        });
        Object.values(grouped).forEach((arr) =>
          arr.sort((a, b) => a.time.localeCompare(b.time)),
        );

        const accentColors = ["#c8906a", "#6a90b8", "#6aa87a", "#a870b0"];

        const makeContactLine = (a) => {
          const rawPhone = (a.phone || "").replace(/\s+/g, "");
          const waPhone = rawPhone.startsWith("+")
            ? rawPhone.slice(1)
            : rawPhone;
          return rawPhone
            ? `
            <div style="font-family:'Libre Baskerville',Georgia,serif;font-size:12px;color:#a09890;margin-top:2px">
              <a href="tel:${rawPhone}" style="color:#a09890;text-decoration:none">${a.phone}</a>
              &nbsp;&nbsp;
              <a href="https://wa.me/${waPhone}" style="color:#25d366;text-decoration:none;border-bottom:1px solid #25d36655">WhatsApp</a>
            </div>`
            : "";
        };

        let barbersHTML = "";
        shop.barbers.forEach((b, i) => {
          const appts = grouped[i];
          const accent = accentColors[i % 4];

          if (!b.available) {
            barbersHTML += `
        <div style="margin-bottom:32px;padding-left:18px;border-left:3px solid #e8e4dc">
          <div style="font-family:'Libre Baskerville',Georgia,serif;font-size:12px;letter-spacing:0.12em;text-transform:uppercase;color:#a09890;margin-bottom:6px">${b.name}</div>
          <div style="font-family:'Libre Baskerville',Georgia,serif;font-size:13px;color:#c8b8a8;font-style:italic">Not available today</div>
        </div>`;
            return;
          }

          const rows =
            appts.length === 0
              ? `<div style="font-family:'Libre Baskerville',Georgia,serif;font-size:13px;color:#a09890;font-style:italic;padding:4px 0">No appointments scheduled</div>`
              : appts
                  .map((a) => {
                    const anyLabel = a.anyAvailable
                      ? `&nbsp;<span style="font-family:'Libre Baskerville',Georgia,serif;font-size:9px;letter-spacing:0.08em;text-transform:uppercase;padding:2px 6px;background:#f5340e;color:white;border-radius:3px;vertical-align:middle">Assigned barber</span>`
                      : "";
                    const newLabel = a.first
                      ? `&nbsp;<span style="font-family:'Libre Baskerville',Georgia,serif;font-size:9px;letter-spacing:0.08em;text-transform:uppercase;padding:2px 6px;background:#fdf3e0;color:#8a6a20;border-radius:3px;vertical-align:middle">New</span>`
                      : "";
                    return `
        <table width="100%" cellpadding="0" cellspacing="0" border="0" style="border-collapse:collapse;border-bottom:1px solid #f5f4f0">
          <tr>
            <td width="56" style="padding:12px 0;vertical-align:top">
              <div style="font-family:'Libre Baskerville',Georgia,serif;font-size:13px;color:#a09890">${a.time}</div>
            </td>
            <td style="padding:12px 16px 12px 0;vertical-align:top">
              <div style="font-family:'Cormorant Garamond',Georgia,serif;font-size:20px;font-weight:700;color:#1a1814;line-height:1">${a.client}${newLabel}${anyLabel}</div>
              <div style="font-family:'Libre Baskerville',Georgia,serif;font-size:12px;color:#a09890;margin-top:4px">${a.service} &nbsp;·&nbsp; ${a.duration}</div>
              ${makeContactLine(a)}
            </td>
            <td width="80" style="padding:12px 0;vertical-align:top;text-align:right">
              <div style="font-family:'Cormorant Garamond',Georgia,serif;font-size:19px;font-weight:700;color:#1a1814">${a.price}</div>
            </td>
          </tr>
        </table>`;
                  })
                  .join("");

          barbersHTML += `
      <div style="margin-bottom:32px;padding-left:18px;border-left:3px solid ${accent}">
        <div style="display:flex;justify-content:space-between;align-items:baseline;margin-bottom:10px">
          <div style="font-family:'Libre Baskerville',Georgia,serif;font-size:12px;letter-spacing:0.12em;text-transform:uppercase;color:#6b6560">${b.name}</div>
          <div style="font-family:'Libre Baskerville',Georgia,serif;font-size:11px;color:#a09890">${appts.length} appointment${appts.length !== 1 ? "s" : ""}</div>
        </div>
        ${rows}
      </div>`;
        });

        // Waiting list section
        const wlHTML =
          dayWL.length === 0
            ? ""
            : `
    <div style="padding:28px 40px;border-top:1px solid #e8e4dc">
      <div style="font-family:'Libre Baskerville',Georgia,serif;font-size:10px;letter-spacing:0.16em;text-transform:uppercase;color:#a09890;margin-bottom:20px">Waiting List — ${dayWL.length} entr${dayWL.length !== 1 ? "ies" : "y"}</div>
      ${dayWL
        .map((a) => {
          const newLabel = a.first
            ? `&nbsp;<span style="font-family:'Libre Baskerville',Georgia,serif;font-size:9px;letter-spacing:0.08em;text-transform:uppercase;padding:2px 6px;background:#fdf3e0;color:#8a6a20;border-radius:3px;vertical-align:middle">New</span>`
            : "";
          return `
        <table width="100%" cellpadding="0" cellspacing="0" border="0" style="border-collapse:collapse;border-bottom:1px solid #f5f4f0">
          <tr>
            <td style="padding:12px 16px 12px 0;vertical-align:top">
              <div style="font-family:'Cormorant Garamond',Georgia,serif;font-size:20px;font-weight:700;color:#1a1814;line-height:1">${a.client}${newLabel}</div>
              <div style="font-family:'Libre Baskerville',Georgia,serif;font-size:12px;color:#a09890;margin-top:4px">${a.service}</div>
              ${makeContactLine(a)}
            </td>
            <td width="80" style="padding:12px 0;vertical-align:top;text-align:right">
              <div style="font-family:'Cormorant Garamond',Georgia,serif;font-size:19px;font-weight:700;color:#1a1814">${a.price}</div>
            </td>
          </tr>
        </table>`;
        })
        .join("")}
    </div>`;

        return `<div style="background:#ffffff;font-family:'Cormorant Garamond',Georgia,serif;max-width:600px;margin:0 auto">

    <div style="padding:36px 40px 28px;border-bottom:1px solid #e8e4dc">
      <div style="font-family:'Libre Baskerville',Georgia,serif;font-size:11px;letter-spacing:0.16em;text-transform:uppercase;color:#a09890">BarberLink</div>
      <div style="font-family:'Cormorant Garamond',Georgia,serif;font-size:32px;font-weight:700;color:#1a1814;margin-top:8px;line-height:1">${shop.name}</div>
      <div style="font-family:'Libre Baskerville',Georgia,serif;font-size:13px;color:#a09890;margin-top:6px">${dateStr}</div>
      <div style="margin-top:20px;padding-top:20px;border-top:1px solid #f0ece4">
        <table width="100%" cellpadding="0" cellspacing="0" border="0" style="border-collapse:collapse">
          <tr>
            <td width="33%" style="padding-right:24px;border-right:1px solid #e8e4dc;vertical-align:top">
              <div style="font-family:'Cormorant Garamond',Georgia,serif;font-size:30px;font-weight:700;color:#1a1814;line-height:1">${dayAppts.length + dayWL.length}</div>
              <div style="font-family:'Libre Baskerville',Georgia,serif;font-size:10px;letter-spacing:0.1em;text-transform:uppercase;color:#a09890;margin-top:5px">Appointments</div>
            </td>
            <td width="33%" style="padding-left:24px;padding-right:24px;border-right:1px solid #e8e4dc;vertical-align:top">
              <div style="font-family:'Cormorant Garamond',Georgia,serif;font-size:30px;font-weight:700;color:#1a1814;line-height:1">${totalRevenue} JD</div>
              <div style="font-family:'Libre Baskerville',Georgia,serif;font-size:10px;letter-spacing:0.1em;text-transform:uppercase;color:#a09890;margin-top:5px">Expected Revenue</div>
            </td>
            <td width="33%" style="padding-left:24px;vertical-align:top">
              <div style="font-family:'Cormorant Garamond',Georgia,serif;font-size:30px;font-weight:700;color:#1a1814;line-height:1">${newClients}</div>
              <div style="font-family:'Libre Baskerville',Georgia,serif;font-size:10px;letter-spacing:0.1em;text-transform:uppercase;color:#a09890;margin-top:5px">New Clients</div>
            </td>
          </tr>
        </table>
      </div>
    </div>

    <div style="padding:32px 40px">
      <div style="font-family:'Libre Baskerville',Georgia,serif;font-size:10px;letter-spacing:0.16em;text-transform:uppercase;color:#a09890;margin-bottom:24px">Appointments by Barber</div>
      ${barbersHTML}
    </div>

    ${wlHTML}

    <div style="padding:20px 40px;border-top:1px solid #e8e4dc">
      <div style="font-family:'Cormorant Garamond',Georgia,serif;font-size:16px;font-weight:700;color:#1a1814">BarberLink</div>
      <div style="font-family:'Libre Baskerville',Georgia,serif;font-size:11px;color:#a09890;letter-spacing:0.06em;margin-top:3px">Automated daily summary</div>
    </div>

  </div>`;
      }

      function previewEmail() {
        const shopKey = document.getElementById("email-shop-select").value;
        document.getElementById("email-preview-body").innerHTML =
          generateEmailHTML(shopKey);
        document.getElementById("email-overlay").classList.add("visible");
      }

      async function sendDailyEmail() {
        const shopKey = document.getElementById("email-shop-select")
          ? document.getElementById("email-shop-select").value
          : currentShop;
        const recipient = document.getElementById("email-recipient")
          ? document.getElementById("email-recipient").value.trim()
          : "";

        if (!recipient) {
          showToast("Please enter a recipient email address.", "warning");
          document.getElementById("email-overlay").classList.remove("visible");
          showPage('email', null);
          return;
        }

        const shop = shopData[shopKey];
        const date = selectedDate;
        const dateStr = `${date.getDate()} ${MONTHS[date.getMonth()]} ${date.getFullYear()}`;

        const btn = document.getElementById("send-email-btn");
        if (btn) {
          btn.textContent = "Sending...";
          btn.disabled = true;
        }

        try {
          await emailjs.send("service_w2j1m8g", "template_me8cio3", {
            to_email: recipient,
            shop_name: shop.name,
            date: dateStr,
            html_content: generateEmailHTML(shopKey),
          });
          showToast("Daily email sent to " + recipient, "success");
          document.getElementById("email-overlay").classList.remove("visible");
        } catch (err) {
          showToast("Failed to send email. Please check your connection.", "error");
        } finally {
          if (btn) {
            btn.textContent = "Send Now";
            btn.disabled = false;
          }
        }
      }

      function copyEmailHTML() {
        const shopKey = document.getElementById("email-shop-select")
          ? document.getElementById("email-shop-select").value
          : currentShop;
        const html = generateEmailHTML(shopKey);
        navigator.clipboard
          .writeText(html)
          .then(() => {
            showToast("Email HTML copied to clipboard.", "success");
          })
          .catch(() => {
            showToast("Copy failed — please copy manually from the preview.", "error");
          });
      }

      document
        .getElementById("email-overlay")
        .addEventListener("click", function (e) {
          if (e.target === this) this.classList.remove("visible");
        });

      function openNewAppt() {
        const shop = shopData[currentShop];
        document.getElementById("na-shop-name").textContent = shop.name;

        // Barber select — from actual shop data
        const barberSel = document.getElementById("na-barber");
        barberSel.innerHTML = shop.barbers
          .map(
            (b, i) =>
              `<option value="${i}">${b.name}${b.available ? "" : " (Day Off)"}</option>`,
          )
          .join("");

        // Service select — from actual shop services in SHOP_SERVICES map
        const svcSel = document.getElementById("na-service");
        const svcs = SHOP_SERVICES[currentShop] || [];
        svcSel.innerHTML =
          `<option value="">Select a service</option>` +
          svcs
            .map(
              (s) =>
                `<option value="${s.name}" data-price="${s.price}">${s.name} — ${s.price} JD</option>`,
            )
            .join("");
        svcSel.onchange = function () {
          const opt = this.selectedOptions[0];
          if (opt && opt.dataset.price) {
            document.getElementById("na-price").value = opt.dataset.price;
          }
        };

        // Time select — from shop hours
        const timeSel = document.getElementById("na-time");
        const hoursData = JSON.parse(
          localStorage.getItem("barberlink_shop_hours") || "{}",
        );
        const shopHours = hoursData[currentShop] || shop.hours;
        const openH = parseInt((shopHours.open || "09:00").split(":")[0]);
        const closeH = parseInt((shopHours.close || "21:00").split(":")[0]);
        let timeOpts = "";
        for (let h = openH; h < closeH; h++) {
          for (let m of [0, 30]) {
            const lbl = `${String(h).padStart(2, "0")}:${m === 0 ? "00" : "30"}`;
            timeOpts += `<option value="${lbl}">${lbl}</option>`;
          }
        }
        timeSel.innerHTML = timeOpts;

        // Date — default to selected date
        document.getElementById("na-date").value =
          `${selectedDate.getFullYear()}-${String(selectedDate.getMonth() + 1).padStart(2, "0")}-${String(selectedDate.getDate()).padStart(2, "0")}`;
        document.getElementById("na-client").value = "";
        document.getElementById("na-price").value = "";
        document.getElementById("na-first").checked = false;
        document.getElementById("na-overlay").classList.add("visible");
      }

      function closeNewAppt() {
        document.getElementById("na-overlay").classList.remove("visible");
      }

      function submitNewAppt() {
        const client = document.getElementById("na-client").value.trim();
        const service = document.getElementById("na-service").value;
        const barberI = parseInt(document.getElementById("na-barber").value);
        const time = document.getElementById("na-time").value;
        const dateVal = document.getElementById("na-date").value;
        const priceRaw = document.getElementById("na-price").value;
        const first = document.getElementById("na-first").checked;

        if (!client || !service || !priceRaw || !dateVal) {
          showToast("Please fill in all required fields.", "warning");
          return;
        }

        const price = parseFloat(priceRaw) || 0;
        const shop = shopData[currentShop];
        const barber = shop.barbers[barberI];
        const dateObj = new Date(dateVal + "T00:00:00");

        // 1. Write to barberlink_bookings so booking system sees slot as taken
        try {
          const bks = JSON.parse(
            localStorage.getItem("barberlink_bookings") || "[]",
          );
          bks.push({
            client,
            shop: shop.name,
            staff: barber ? barber.name : "",
            svcs: [service],
            time,
            date: dateObj.toISOString(),
            total: price,
            ref: "ADM-" + Date.now(),
            at: new Date().toISOString(),
          });
          localStorage.setItem("barberlink_bookings", JSON.stringify(bks));
        } catch (e) {}

        // 2. Also push into shopData.appointments for the admin calendar
        shop.appointments.push({
          barber: barberI,
          time,
          client,
          service,
          duration: "30 min",
          price: price + " JD",
          first,
          _date: dateObj.toISOString(),
        });

        addNotification('booking-new', {
          firstName: client,
          lastName: '',
          sub: service,
          shopName: shop.name,
          time: time,
          date: dateObj.toISOString(),
        });

        closeNewAppt();
        loadBookingsFromStorage();
        renderStats();
        renderWeekStrip();
        renderGrid();
      }

      document
        .getElementById("na-overlay")
        .addEventListener("click", function (e) {
          if (e.target === this) closeNewAppt();
        });

      // ── DASHBOARD ─────────────────────────────────────
      function renderDashboard() {
        const raw = JSON.parse(
          localStorage.getItem("barberlink_bookings") || "[]",
        );
        const today = new Date().toDateString();

        ["fares", "capri", "om"].forEach((key) => {
          const shopName = shopData[key].name;
          const shopBks = raw.filter((b) => b.shop === shopName);
          const todayBks = shopBks.filter(
            (b) => b.date && new Date(b.date).toDateString() === today,
          );
          const totalRev = todayBks.reduce((s, b) => s + (b.total || 0), 0);

          // First-time clients today = clients whose first ever booking is today
          const clientFirstDate = {};
          shopBks.forEach((b) => {
            const k = b.client;
            if (
              !clientFirstDate[k] ||
              new Date(b.at || b.date) < clientFirstDate[k]
            )
              clientFirstDate[k] = new Date(b.at || b.date);
          });
          const newCount = todayBks.filter(
            (b) =>
              clientFirstDate[b.client] &&
              clientFirstDate[b.client].toDateString() === today,
          ).length;

          const maxB = 20;
          const pct = Math.min(100, Math.round((todayBks.length / maxB) * 100));
          if (el(`dash-${key}-bookings`))
            el(`dash-${key}-bookings`).textContent = todayBks.length;
          if (el(`dash-${key}-revenue`))
            el(`dash-${key}-revenue`).textContent = totalRev + " JD";
          if (el(`dash-${key}-first`))
            el(`dash-${key}-first`).textContent = newCount;
          if (el(`dash-${key}-bar`))
            el(`dash-${key}-bar`).style.width = pct + "%";
          if (el(`dash-${key}-util`))
            el(`dash-${key}-util`).textContent = pct + "% capacity utilisation";

          // Avg rating for this shop
          const rated = shopBks.filter(b => b.rating);
          const avgRating = rated.length > 0
            ? (rated.reduce((s, b) => s + b.rating, 0) / rated.length).toFixed(1)
            : null;
          if (el(`dash-${key}-rating`))
            el(`dash-${key}-rating`).innerHTML = avgRating
              ? `<span style="color:#c8a86a">★</span> ${avgRating} <span style="font-size:11px;color:var(--text-muted);font-family:'Libre Baskerville',serif">(${rated.length})</span>`
              : '—';
        });

        // Recent table — today's bookings across all shops
        const tbody = document.getElementById("dash-recent-tbody");
        if (tbody) {
          const todayAll = raw.filter(
            (b) => b.date && new Date(b.date).toDateString() === today,
          );
          if (todayAll.length === 0) {
            tbody.innerHTML = `<tr><td colspan="7" style="text-align:center;color:var(--text-muted);font-style:italic;padding:20px;font-family:'EB Garamond',serif">No bookings today yet.</td></tr>`;
          } else {
            const clientFirstDate = {};
            raw.forEach((b) => {
              const k = b.client + "_" + b.shop;
              if (
                !clientFirstDate[k] ||
                new Date(b.at || b.date) < new Date(clientFirstDate[k])
              )
                clientFirstDate[k] = b.at || b.date;
            });
            tbody.innerHTML = [...todayAll]
              .reverse()
              .map((bk) => {
                const isFirst =
                  clientFirstDate[bk.client + "_" + bk.shop] &&
                  new Date(
                    clientFirstDate[bk.client + "_" + bk.shop],
                  ).toDateString() === today;
                return `<tr>
          <td>${bk.client || "—"}</td>
          <td>${bk.shop || "—"}</td>
          <td>${bk.staff || "—"}</td>
          <td>${Array.isArray(bk.svcs) ? bk.svcs.join(", ") : bk.svcs || "—"}</td>
          <td>${bk.time || "—"}</td>
          <td style="font-family:'Cormorant Garamond',serif;font-size:16px;font-weight:700">${bk.total || 0} JD</td>
          <td><span class="tag ${isFirst ? "new" : "ret"}">${isFirst ? "New Client" : "Returning"}</span></td>
        </tr>`;
              })
              .join("");
          }
        }
      }

      // ── REPORTS ───────────────────────────────────────
      function renderChart() {
        const raw = JSON.parse(
          localStorage.getItem("barberlink_bookings") || "[]",
        );

        // Revenue per shop
        const shopRevenue = {
          fares: raw
            .filter((b) => b.shop === "Fares Barbershop")
            .reduce((s, b) => s + (b.total || 0), 0),
          capri: raw
            .filter((b) => b.shop === "Capri Barbershop")
            .reduce((s, b) => s + (b.total || 0), 0),
          om: raw
            .filter((b) => b.shop === "O&M Barbershop")
            .reduce((s, b) => s + (b.total || 0), 0),
        };
        const maxRev = Math.max(...Object.values(shopRevenue), 1);
        const wrap = document.getElementById("chart-bars");
        wrap.innerHTML = "";
        [
          { label: "Fares", key: "fares", color: "var(--b1-accent)" },
          { label: "Capri", key: "capri", color: "var(--b2-accent)" },
          { label: "O&M", key: "om", color: "var(--b3-accent)" },
        ].forEach((s) => {
          const col = document.createElement("div");
          col.className = "chart-bar-wrap";
          const pct = Math.round((shopRevenue[s.key] / maxRev) * 100);
          col.innerHTML = `<div style="font-family:'Cormorant Garamond',serif;font-size:13px;font-weight:700;color:var(--text-primary);margin-bottom:4px">${shopRevenue[s.key]} JD</div><div class="chart-bar" style="background:${s.color};height:${Math.max(pct, 2)}%;width:100%;flex:none"></div><div class="chart-bar-lbl">${s.label}</div>`;
          wrap.appendChild(col);
        });

        // Top services
        const svcCount = {};
        raw.forEach((b) => {
          const svcs = Array.isArray(b.svcs) ? b.svcs : [b.svcs];
          svcs.forEach((s) => {
            if (s) svcCount[s] = (svcCount[s] || 0) + 1;
          });
        });
        const sorted = Object.entries(svcCount)
          .sort((a, b) => b[1] - a[1])
          .slice(0, 5);
        const maxCount = sorted[0] ? sorted[0][1] : 1;
        const svcEl = document.getElementById("top-services");
        if (svcEl)
          svcEl.innerHTML =
            sorted.length === 0
              ? `<div style="font-size:13px;font-family:'EB Garamond',serif;color:var(--text-muted);font-style:italic">No bookings yet.</div>`
              : sorted
                  .map(
                    ([name, count]) =>
                      `<div class="svc-row"><span class="svc-name">${name}</span><div class="svc-bar-bg"><div class="svc-bar-fill" style="width:${Math.round((count / maxCount) * 100)}%"></div></div><span class="svc-count">${count}</span></div>`,
                  )
                  .join("");

        // Glance
        if (el("rep-total-bookings"))
          el("rep-total-bookings").textContent = raw.length;
        if (el("rep-new-clients"))
          el("rep-new-clients").textContent = new Set(
            raw.map((b) => b.client + "_" + b.shop),
          ).size;
        if (el("rep-revenue"))
          el("rep-revenue").textContent = raw.reduce(
            (s, b) => s + (b.total || 0),
            0,
          );

        // Retention
        const clientVisits = {};
        raw.forEach((b) => {
          const k = b.client + "_" + b.shop;
          clientVisits[k] = (clientVisits[k] || 0) + 1;
        });
        const total = Object.keys(clientVisits).length;
        const returning = Object.values(clientVisits).filter(
          (v) => v > 1,
        ).length;
        const retPct = total > 0 ? Math.round((returning / total) * 100) : 0;
        if (el("rep-retention-ring"))
          el("rep-retention-ring").setAttribute(
            "stroke-dasharray",
            `${retPct} 100`,
          );
        if (el("rep-retention-pct"))
          el("rep-retention-pct").textContent = retPct + "%";
        if (el("rep-retention-txt"))
          el("rep-retention-txt").textContent =
            total === 0
              ? "No bookings recorded yet."
              : `${retPct}% of clients have booked more than once across all three shops.`;
      }

      // ── SHOP SETTINGS — persist to localStorage ────────
      // Key: barberlink_shop_settings = { fares: { days, hours, barbers }, ... }

      function normalizeTime(val) {
        // Accepts "9:00", "9", "09:00", "900" — always returns "HH:MM"
        const s = (val || "").trim().replace(/[^0-9:]/g, "");
        if (!s) return null;
        if (s.includes(":")) {
          const [h, m] = s.split(":");
          return `${String(parseInt(h) || 0).padStart(2, "0")}:${String(parseInt(m) || 0).padStart(2, "0")}`;
        }
        if (s.length <= 2) return `${String(parseInt(s)).padStart(2, "0")}:00`;
        const h = s.slice(0, s.length - 2),
          m = s.slice(-2);
        return `${String(parseInt(h) || 0).padStart(2, "0")}:${String(parseInt(m) || 0).padStart(2, "0")}`;
      }

      function loadShopSettings() {
        try {
          const saved = JSON.parse(
            localStorage.getItem("barberlink_shop_settings") || "{}",
          );
          Object.keys(shopData).forEach((key) => {
            if (!saved[key]) return;
            const s = saved[key];
            if (s.days) shopData[key].days = s.days;
            if (s.hours) shopData[key].hours = s.hours;
            if (s.barbers) {
              s.barbers.forEach(({ name, available }) => {
                const b = shopData[key].barbers.find((b) => b.name === name);
                if (b) b.available = available;
              });
            }
          });
        } catch (e) {}

        // Re-sync barberlink_barbers from loaded settings so booking system is in sync
        try {
          const barberData = {};
          Object.keys(shopData).forEach((key) => {
            barberData[key] = shopData[key].barbers
              .filter((b) => !b.available)
              .map((b) => b.name);
          });
          localStorage.setItem(
            "barberlink_barbers",
            JSON.stringify(barberData),
          );
        } catch (e) {}
      }

      function saveShopSettings(shopKey, card) {
        const shop = shopData[shopKey];

        // Read days from toggled pills in this card
        const pills = card.querySelectorAll(".day-pill");
        const days = [];
        pills.forEach((p, i) => {
          if (p.classList.contains("on")) days.push(i);
        });
        shop.days = days;

        // Read and normalize hours inputs
        const inputs = card.querySelectorAll(".hours-input");
        if (inputs.length >= 2) {
          const openNorm = normalizeTime(inputs[0].value);
          const closeNorm = normalizeTime(inputs[1].value);
          if (openNorm) {
            shop.hours.open = openNorm;
            inputs[0].value = openNorm;
          }
          if (closeNorm) {
            shop.hours.close = closeNorm;
            inputs[1].value = closeNorm;
          }
        }

        // Read barber toggles
        const barberToggles = card.querySelectorAll(".shop-barber-row .toggle");
        barberToggles.forEach((tog, i) => {
          if (shop.barbers[i])
            shop.barbers[i].available = tog.classList.contains("on");
        });

        // Persist all shop settings
        try {
          const saved = JSON.parse(
            localStorage.getItem("barberlink_shop_settings") || "{}",
          );
          saved[shopKey] = {
            days: shop.days,
            hours: shop.hours,
            barbers: shop.barbers.map((b) => ({
              name: b.name,
              available: b.available,
            })),
          };
          localStorage.setItem(
            "barberlink_shop_settings",
            JSON.stringify(saved),
          );
        } catch (e) {}

        // Sync barberlink_barbers — booking system reads this for unavailable barbers
        try {
          const barberData = JSON.parse(
            localStorage.getItem("barberlink_barbers") || "{}",
          );
          barberData[shopKey] = shop.barbers
            .filter((b) => !b.available)
            .map((b) => b.name);
          localStorage.setItem(
            "barberlink_barbers",
            JSON.stringify(barberData),
          );
        } catch (e) {}

        // Sync barberlink_shop_hours — booking system reads this for time slots
        try {
          const hoursData = JSON.parse(
            localStorage.getItem("barberlink_shop_hours") || "{}",
          );
          hoursData[shopKey] = shop.hours;
          localStorage.setItem(
            "barberlink_shop_hours",
            JSON.stringify(hoursData),
          );
        } catch (e) {}

        // Sync barberlink_shop_days — booking system reads this for open days calendar
        try {
          const daysData = JSON.parse(
            localStorage.getItem("barberlink_shop_days") || "{}",
          );
          daysData[shopKey] = shop.days;
          localStorage.setItem(
            "barberlink_shop_days",
            JSON.stringify(daysData),
          );
        } catch (e) {}

        // Flash confirmation on button
        const btn = card.querySelector(".btn-shop-save");
        if (btn) {
          btn.textContent = "Saved ✓";
          btn.style.background = "#7ab87a";
          setTimeout(() => {
            btn.textContent = "Save changes";
            btn.style.background = "";
          }, 1800);
        }

        // Re-render barber headers + grid to reflect changes immediately
        if (shopKey === currentShop) TIMES = buildTimes(shopKey);
        renderBarberHeaders();
        renderGrid();
      }

      // ── INIT ──────────────────────────────────────────
      loadShopSettings();
      loadBookingsFromStorage();
      document.getElementById("shop-switcher").style.display = "flex";
      initBlocked();
      renderStats();
      renderWeekStrip();
      renderBarberHeaders();
      renderGrid();
      renderWaitingList();

// ─────────────────────────────────────────────────────────

// ── JOB APPLICATIONS ──────────────────────────────────────────────────

      let allJobApps = [];
      let currentJobAppId = null;
      let currentJobAppFilter = 'all';

      const JA_STATUS = {
        new:       { label: 'New',        badgeCls: 'jb-new',       dotCls: 'jsd-new'       },
        reviewed:  { label: 'Reviewed',   badgeCls: 'jb-reviewed',  dotCls: 'jsd-reviewed'  },
        shortlist: { label: 'Shortlisted',badgeCls: 'jb-shortlist', dotCls: 'jsd-shortlist' },
        interview: { label: 'Interview',  badgeCls: 'jb-interview', dotCls: 'jsd-interview' },
        rejected:  { label: 'Rejected',   badgeCls: 'jb-rejected',  dotCls: 'jsd-rejected'  },
      };

      function loadJobApps() {
        try { allJobApps = JSON.parse(localStorage.getItem('barberlink_job_applications') || '[]'); }
        catch(e) { allJobApps = []; }
        renderJobAppsStats();
        renderJobAppsGrid();
        updateNavBadges();
      }

      function renderJobAppsStats() {
        const s = { new:0, reviewed:0, shortlist:0, interview:0, rejected:0 };
        allJobApps.forEach(a => { if (s[a.status] !== undefined) s[a.status]++; });
        document.getElementById('jas-total').textContent    = allJobApps.length;
        document.getElementById('jas-new').textContent      = s.new;
        document.getElementById('jas-reviewed').textContent = s.reviewed;
        document.getElementById('jas-shortlist').textContent= s.shortlist;
        document.getElementById('jas-interview').textContent= s.interview;
        document.getElementById('jas-rejected').textContent = s.rejected;
      }

      function getFilteredJobApps() {
        const q = (document.getElementById('jobapps-search')?.value || '').trim().toLowerCase();
        return allJobApps.filter(a => {
          const matchStatus = currentJobAppFilter === 'all' || a.status === currentJobAppFilter;
          const matchQuery  = !q ||
            ((a.firstName||'') + ' ' + (a.lastName||'')).toLowerCase().includes(q) ||
            (a.jobTitle  ||'').toLowerCase().includes(q) ||
            (a.shopName  ||'').toLowerCase().includes(q) ||
            (a.email     ||'').toLowerCase().includes(q);
          return matchStatus && matchQuery;
        });
      }

      function renderJobAppsGrid() {
        const grid = document.getElementById('jobapps-grid');
        const list = getFilteredJobApps();
        const countEl = document.getElementById('jobapps-count');
        if (countEl) countEl.textContent = list.length + ' result' + (list.length !== 1 ? 's' : '');

        if (list.length === 0) {
          grid.innerHTML = '<div style="grid-column:1/-1;text-align:center;color:var(--text-muted);font-style:italic;font-family:\'EB Garamond\',serif;padding:40px">No applications found.</div>';
          return;
        }

        grid.innerHTML = list.map(a => {
          const st   = JA_STATUS[a.status] || JA_STATUS.new;
          const name = ((a.firstName||'') + ' ' + (a.lastName||'')).trim() || '—';
          const initials = ((a.firstName||'')[0]||'') + ((a.lastName||'')[0]||'');
          const date = a.submittedAt ? new Date(a.submittedAt).toLocaleDateString('en-GB',{day:'2-digit',month:'short',year:'numeric'}) : '—';
          const avatarHtml = a.photo
            ? `<div class="jac-avatar"><img src="${a.photo}" alt="${escHtml(name)}"/></div>`
            : `<div class="jac-avatar">${escHtml(initials.toUpperCase())}</div>`;

          return `<div class="jac" onclick="openJobApp('${a.id}')">
            <div class="jac-top">
              ${avatarHtml}
              <div style="min-width:0">
                <div class="jac-name">${escHtml(name)}</div>
                <div class="jac-headline">${escHtml(a.headline || a.nationality || '')}</div>
              </div>
              <span class="jac-badge ${st.badgeCls}">${st.label}</span>
            </div>
            <div class="jac-body">
              <div class="jac-row"><span class="jac-row-lbl">Position</span><span class="jac-row-val">${escHtml(a.jobTitle||'—')}</span></div>
              <div class="jac-row"><span class="jac-row-lbl">Shop</span><span class="jac-row-val">${escHtml(a.shopName||'—')}</span></div>
              <div class="jac-row"><span class="jac-row-lbl">Email</span><span class="jac-row-val">${escHtml(a.email||'—')}</span></div>
              <div class="jac-row"><span class="jac-row-lbl">Phone</span><span class="jac-row-val">${escHtml(a.phone||'—')}</span></div>
            </div>
            <div class="jac-foot">
              <span class="jac-foot-date">${date}</span>
            </div>
          </div>`;
        }).join('');
      }

      function setJobAppFilter(btn, filter) {
        currentJobAppFilter = filter;
        document.querySelectorAll('.jobapps-filter-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        renderJobAppsGrid();
      }

      function openJobApp(id) {
        const a = allJobApps.find(x => x.id === id);
        if (!a) return;
        currentJobAppId = id;
        const name = ((a.firstName||'') + ' ' + (a.lastName||'')).trim() || '—';
        const initials = ((a.firstName||'')[0]||'') + ((a.lastName||'')[0]||'');

        // Header
        const photoEl = document.getElementById('jad-photo');
        if (a.photo) {
          photoEl.innerHTML = '<img src="' + a.photo + '" alt="' + escHtml(name) + '"/>';
        } else {
          photoEl.textContent = initials.toUpperCase();
        }
        document.getElementById('jad-name').textContent = name;
        document.getElementById('jad-sub').textContent  = (a.jobTitle||'') + (a.shopName ? ' · ' + a.shopName : '');

        // Status stepper — sync active state
        const currentStatus = a.status || 'new';
        document.querySelectorAll('.jad-step-btn').forEach(btn => {
          btn.classList.toggle('active', btn.dataset.status === currentStatus);
        });
        // Reset interview fields and send buttons
        const iFields     = document.getElementById('jad-interview-fields');
        const rejectPanel = document.getElementById('jad-reject-panel');
        if (iFields)     iFields.style.display     = currentStatus === 'interview' ? 'block' : 'none';
        if (rejectPanel) rejectPanel.style.display  = currentStatus === 'rejected'  ? 'block' : 'none';
        const sendBtn = document.getElementById('jad-send-btn');
        if (sendBtn) { sendBtn.disabled = false; }
        const sendReject = document.getElementById('jad-send-reject-btn');
        if (sendReject) { sendReject.disabled = false; }
        const d = document.getElementById('jad-idate'); if (d) d.value = '';
        const t = document.getElementById('jad-itime'); if (t) t.value = '';

        // Date
        const date = a.submittedAt ? new Date(a.submittedAt).toLocaleString('en-GB',{day:'2-digit',month:'short',year:'numeric',hour:'2-digit',minute:'2-digit'}) : '';
        document.getElementById('jad-footer-date').textContent = date ? 'Submitted ' + date : '';

        // Body
        const fmtSize = bytes => {
          if (!bytes) return '';
          if (bytes < 1024) return bytes + ' B';
          if (bytes < 1024*1024) return (bytes/1024).toFixed(1) + ' KB';
          return (bytes/(1024*1024)).toFixed(2) + ' MB';
        };

        let body = '';
        body += '<div class="jad-section-lbl">Contact Information</div>';
        body += '<div class="jad-grid">';
        body += '<div class="jad-field"><div class="jad-field-lbl">First Name</div><div class="jad-field-val">' + escHtml(a.firstName||'—') + '</div></div>';
        body += '<div class="jad-field"><div class="jad-field-lbl">Last Name</div><div class="jad-field-val">'  + escHtml(a.lastName||'—')  + '</div></div>';
        body += '<div class="jad-field"><div class="jad-field-lbl">Email</div><div class="jad-field-val">'       + escHtml(a.email||'—')     + '</div></div>';
        body += '<div class="jad-field"><div class="jad-field-lbl">Phone</div><div class="jad-field-val">'       + escHtml(a.phone||'—')     + '</div></div>';
        body += '<div class="jad-field"><div class="jad-field-lbl">Address</div><div class="jad-field-val">'     + escHtml(a.address||'—')   + '</div></div>';
        body += '<div class="jad-field"><div class="jad-field-lbl">Nationality</div><div class="jad-field-val">' + escHtml(a.nationality||'—')+ '</div></div>';
        if (a.headline) body += '<div class="jad-field full"><div class="jad-field-lbl">Headline</div><div class="jad-field-val">' + escHtml(a.headline) + '</div></div>';
        body += '</div>';

        body += '<div class="jad-section-lbl">Job Details</div>';
        body += '<div class="jad-grid">';
        body += '<div class="jad-field"><div class="jad-field-lbl">Position</div><div class="jad-field-val">'  + escHtml(a.jobTitle||'—') + '</div></div>';
        body += '<div class="jad-field"><div class="jad-field-lbl">Shop</div><div class="jad-field-val">'      + escHtml(a.shopName||'—') + '</div></div>';
        body += '<div class="jad-field"><div class="jad-field-lbl">Location</div><div class="jad-field-val">'  + escHtml(a.location||'—') + '</div></div>';
        body += '</div>';

        if (a.summary) {
          body += '<div class="jad-section-lbl">Summary</div>';
          body += '<div class="jad-text-block">' + escHtml(a.summary) + '</div>';
        }
        if (a.coverLetter) {
          body += '<div class="jad-section-lbl">Cover Letter</div>';
          body += '<div class="jad-text-block">' + escHtml(a.coverLetter) + '</div>';
        }

        if (a.resume && a.resume.data) {
          body += '<div class="jad-section-lbl">Resume</div>';
          body += '<div class="jad-resume-row">';
          body += '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" stroke-width="1.8"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>';
          body += '<div><div class="jad-resume-name">' + escHtml(a.resume.name) + '</div>';
          if (a.resume.size) body += '<div class="jad-resume-size">' + fmtSize(a.resume.size) + '</div>';
          body += '</div>';
          body += '<a href="' + a.resume.data + '" download="' + escHtml(a.resume.name) + '" class="jad-download" target="_blank">Download</a>';
          body += '</div>';
        }

        document.getElementById('jad-body').innerHTML = body;
        document.getElementById('jad-overlay').classList.add('visible');
      }

      function closeJobApp() {
        document.getElementById('jad-overlay').classList.remove('visible');
        currentJobAppId = null;
      }

      function updateJobAppStatus(status) {
        if (!currentJobAppId) return;
        const idx = allJobApps.findIndex(a => a.id === currentJobAppId);
        if (idx < 0) return;
        allJobApps[idx].status = status;
        localStorage.setItem('barberlink_job_applications', JSON.stringify(allJobApps));
        renderJobAppsStats();
        renderJobAppsGrid();

        // Update stepper highlight
        document.querySelectorAll('.jad-step-btn').forEach(btn => {
          btn.classList.toggle('active', btn.dataset.status === status);
        });

        // Show/hide interview fields and send buttons
        const iFields    = document.getElementById('jad-interview-fields');
        const rejectPanel = document.getElementById('jad-reject-panel');
        if (iFields)     iFields.style.display     = status === 'interview' ? 'block' : 'none';
        if (rejectPanel) rejectPanel.style.display  = status === 'rejected'  ? 'block' : 'none';

        // Clear any previous date/time when switching away from interview
        if (status !== 'interview') {
          const d = document.getElementById('jad-idate');
          const t = document.getElementById('jad-itime');
          if (d) d.value = '';
          if (t) t.value = '';
        }

        updateNavBadges();
      }

      async function sendJobAppEmailManual() {
        if (!currentJobAppId) return;
        const idx = allJobApps.findIndex(a => a.id === currentJobAppId);
        if (idx < 0) return;
        const app    = allJobApps[idx];
        const status = app.status;

        if (status === 'interview') {
          const iDate = document.getElementById('jad-idate')?.value || '';
          const iTime = document.getElementById('jad-itime')?.value || '';
          if (!iDate || !iTime) {
            showToast('Please set an interview date and time before sending.', 'warning');
            return;
          }
          await sendJobAppEmail(app, 'interview', iDate, iTime);
        } else if (status === 'rejected') {
          await sendJobAppEmail(app, 'rejected', '', '');
        }
        addNotification(status === 'interview' ? 'job-interview' : 'job-rejected', app);

        // Disable button after sending to prevent double-send
        const btn = status === 'interview'
          ? document.getElementById('jad-send-btn')
          : document.getElementById('jad-send-reject-btn');
        if (btn) { btn.disabled = true; btn.style.opacity = '0.35'; }
      }

      function jobAppEmailHTML(app, status, iDate, iTime) {
        var fn   = app.firstName || 'there';
        var pos  = app.jobTitle  || 'the position';
        var shop = app.shopName  || 'our barbershop';
        var yr   = new Date().getFullYear();

        // Format interview date/time for display
        var dateDisplay = 'To be confirmed';
        var timeDisplay = 'To be confirmed';
        if (iDate) {
          try {
            dateDisplay = new Date(iDate).toLocaleDateString('en-GB', { weekday:'long', day:'numeric', month:'long', year:'numeric' });
          } catch(e) { dateDisplay = iDate; }
        }
        if (iTime) {
          try {
            var parts = iTime.split(':');
            var h = parseInt(parts[0]), m = parts[1];
            var ampm = h >= 12 ? 'PM' : 'AM';
            h = h % 12 || 12;
            timeDisplay = h + ':' + m + ' ' + ampm;
          } catch(e) { timeDisplay = iTime; }
        }

        var o = '';
        o += '<!DO' + 'CTYPE html>';
        o += '<' + 'html><' + 'head><meta charset="UTF-8"><\/' + 'head>';
        o += '<' + 'body style="margin:0;padding:0;background:#f5f4f0;font-family:Georgia,serif;">';
        o += '<table width="100%" cellpadding="0" cellspacing="0" style="padding:40px 20px;"><tr><td align="center">';
        o += '<table width="560" cellpadding="0" cellspacing="0" style="background:#fff;border-radius:12px;border:1px solid #e8e4dc;">';
        o += '<tr><td style="padding:36px 40px 28px;">';

        if (status === 'interview') {
          // Header
          o += '<table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:8px;"><tr>';
          o += '<td style="font-family:Georgia,serif;font-size:26px;font-weight:700;color:#191265;">BarberLink<\/td>';
          o += '<td align="right" style="font-family:Arial,sans-serif;font-size:10px;letter-spacing:0.14em;text-transform:uppercase;color:#3a8a5a;vertical-align:bottom;">Interview Invitation<\/td>';
          o += '<\/tr><\/table>';
          o += '<div style="height:3px;background:linear-gradient(90deg,#5aaa7a 0%,#b0ddc0 60%,transparent 100%);margin-bottom:26px;border-radius:2px;"><\/div>';
          o += '<div style="font-size:17px;color:#1a1814;margin-bottom:14px;font-style:italic;">Dear ' + fn + ',<\/div>';
          o += '<div style="font-size:15px;color:#3a3630;line-height:1.75;margin-bottom:18px;">Thank you for applying for the <strong>' + pos + '<\/strong> position at <strong>' + shop + '<\/strong>. We have reviewed your application and are pleased to invite you to a first interview with our team.<\/div>';
          // Table Option F
          o += '<table width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;border:1.5px solid #191265;border-radius:8px;overflow:hidden;margin-bottom:18px;">';
          o += '<tr style="border-bottom:1px solid #e8e8f0;"><td style="padding:11px 16px;font-size:13px;font-weight:700;color:#191265;width:100px;border-right:1.5px solid #191265;font-family:Arial,sans-serif;">Date<\/td><td style="padding:11px 16px;font-size:14px;color:#3a3630;font-family:Georgia,serif;">' + dateDisplay + '<\/td><\/tr>';
          o += '<tr style="border-bottom:1px solid #e8e8f0;"><td style="padding:11px 16px;font-size:13px;font-weight:700;color:#191265;border-right:1.5px solid #191265;font-family:Arial,sans-serif;">Time<\/td><td style="padding:11px 16px;font-size:14px;color:#3a3630;font-family:Georgia,serif;">' + timeDisplay + '<\/td><\/tr>';
          o += '<tr style="border-bottom:1px solid #e8e8f0;"><td style="padding:11px 16px;font-size:13px;font-weight:700;color:#191265;border-right:1.5px solid #191265;font-family:Arial,sans-serif;">Location<\/td><td style="padding:11px 16px;font-size:14px;color:#3a3630;font-family:Georgia,serif;">' + shop + ', Jordan<\/td><\/tr>';
          o += '<tr><td style="padding:11px 16px;font-size:13px;font-weight:700;color:#191265;border-right:1.5px solid #191265;font-family:Arial,sans-serif;">Contact<\/td><td style="padding:11px 16px;font-size:14px;color:#3a3630;font-family:Georgia,serif;">hr@barberlink.jo<\/td><\/tr>';
          o += '<\/table>';
          o += '<div style="font-size:15px;color:#3a3630;line-height:1.75;margin-bottom:28px;">Please confirm your attendance by replying to this email. If you have any questions or need to reschedule, do not hesitate to reach out.<\/div>';
          o += '<div style="font-size:14px;color:#6b6560;">Warm regards,<br><strong>The BarberLink Hiring Team<\/strong><\/div>';

        } else {
          // Rejection
          o += '<div style="font-family:Georgia,serif;font-size:26px;font-weight:700;color:#191265;margin-bottom:6px;">BarberLink<\/div>';
          o += '<div style="height:2px;background:#191265;margin-bottom:12px;"><\/div>';
          o += '<div style="font-family:Arial,sans-serif;font-size:11px;letter-spacing:0.08em;text-transform:uppercase;color:#c83030;margin-bottom:20px;">' + pos + ' &nbsp;&middot;&nbsp; ' + shop + '<\/div>';
          o += '<div style="font-size:17px;color:#1a1814;margin-bottom:14px;font-style:italic;">Dear ' + fn + ',<\/div>';
          o += '<div style="font-size:15px;color:#3a3630;line-height:1.75;margin-bottom:16px;">Thank you for your interest in joining the BarberLink network and for the time you invested in applying for this position.<\/div>';
          o += '<div style="background:#fff0f0;border-left:3px solid #c83030;border-radius:0 8px 8px 0;padding:14px 18px;margin-bottom:18px;font-size:15px;color:#8a1a1a;line-height:1.6;">After carefully reviewing all applications, we regret to inform you that we will not be moving forward with your candidacy at this time.<\/div>';
          o += '<div style="font-size:15px;color:#3a3630;line-height:1.75;margin-bottom:16px;">This was a competitive process and the decision was not easy.<\/div>';
          o += '<div style="height:1px;background:#f5d0d0;margin:18px 0;"><\/div>';
          o += '<div style="font-size:14px;color:#9ca3af;font-style:italic;line-height:1.7;padding-left:14px;border-left:2px solid #e8d0d0;margin-bottom:28px;">We encourage you to keep an eye on future openings at BarberLink and welcome you to apply again. We appreciate your interest and wish you the very best in your career.<\/div>';
          o += '<div style="font-size:14px;color:#6b6560;">Kind regards,<br><strong>The BarberLink Hiring Team<\/strong><\/div>';
        }

        o += '<div style="height:1px;background:#e8e4dc;margin-top:26px;margin-bottom:12px;"><\/div>';
        o += '<div style="font-size:11px;color:#a09890;">&copy; ' + yr + ' BarberLink &middot; Jordan &middot; barberlink.jo<\/div>';
        o += '<\/td><\/tr><\/table><\/td><\/tr><\/table>';
        o += '<\/' + 'body><\/' + 'html>';
        return o;
      }

      async function sendJobAppEmail(app, status, iDate, iTime) {
        if (!app.email) return;
        try {
          await emailjs.send('service_w2j1m8g', 'template_me8cio3', {
            to_email:     app.email,
            shop_name:    app.shopName || 'BarberLink',
            date:         new Date().toLocaleDateString('en-GB', { day:'2-digit', month:'short', year:'numeric' }),
            html_content: jobAppEmailHTML(app, status, iDate, iTime),
          });
          showToast((status === 'interview' ? 'Interview invitation' : 'Rejection') + ' email sent to ' + app.email, 'success');
        } catch(err) {
          showToast('Status updated, but email could not be sent.', 'error');
          console.error('Job app email failed:', err);
        }
      }

// ─────────────────────────────────────────────────────────

// ── PARTNERS PAGE ─────────────────────────────────────────────────────

      // ── Toast notification ──
      let _toastTimer = null;
      function showToast(msg, type) {
        const bar  = document.getElementById('toast-bar');
        const dot  = document.getElementById('toast-dot');
        const text = document.getElementById('toast-msg');
        if (!bar) return;
        const colors = { success: '#7ab87a', error: '#c87a7a', warning: '#c8a86a', info: '#6a90b8' };
        dot.style.background = colors[type] || colors.info;
        text.textContent = msg;
        bar.classList.add('show');
        if (_toastTimer) clearTimeout(_toastTimer);
        _toastTimer = setTimeout(dismissToast, 4000);
      }
      function dismissToast() {
        const bar = document.getElementById('toast-bar');
        if (bar) bar.classList.remove('show');
        if (_toastTimer) { clearTimeout(_toastTimer); _toastTimer = null; }
      }

      let allPartners = [];
      let currentPartnerFilter = 'all';
      let currentPartnerId = null;

      const BUSINESS_TYPE_LABELS = {
        sole_proprietorship: "Sole Proprietorship",
        partnership: "Partnership",
        corporation: "Corporation",
        llc: "LLC",
        other: "Other"
      };

      function loadPartners() {
        try {
          allPartners = JSON.parse(localStorage.getItem('barberlink_partners') || '[]');
        } catch(e) { allPartners = []; }
        renderPartnerStats();
        renderPartnersTable();
        updateNavBadges();
      }

      function renderPartnerStats() {
        const total    = allPartners.length;
        const pending  = allPartners.filter(p => p.status === 'pending').length;
        const approved = allPartners.filter(p => p.status === 'approved').length;
        const rejected = allPartners.filter(p => p.status === 'rejected').length;
        document.getElementById('ps-total').textContent    = total;
        document.getElementById('ps-pending').textContent  = pending;
        document.getElementById('ps-approved').textContent = approved;
        document.getElementById('ps-rejected').textContent = rejected;
        // Refresh nav badge
        const partnerNavItem = document.querySelector('[onclick*="partners"]');
        if (partnerNavItem) {
          let badge = document.getElementById('partner-nav-badge');
          if (pending > 0) {
            if (!badge) {
              badge = document.createElement('span');
              badge.id = 'partner-nav-badge';
              badge.style.cssText = "margin-left:auto;background:#d4a84a;color:white;font-size:10px;font-family:'Libre Baskerville',serif;padding:1px 7px;border-radius:10px;";
              partnerNavItem.appendChild(badge);
            }
            badge.textContent = pending;
          } else if (badge) {
            badge.remove();
          }
        }
      }

      function getFilteredPartners() {
        const query = (document.getElementById('partners-search')?.value || '').trim().toLowerCase();
        return allPartners.filter(p => {
          const matchStatus = currentPartnerFilter === 'all' || p.status === currentPartnerFilter;
          const matchQuery  = !query ||
            (p.brandName  || '').toLowerCase().includes(query) ||
            (p.firstName  || '').toLowerCase().includes(query) ||
            (p.lastName   || '').toLowerCase().includes(query) ||
            (p.email      || '').toLowerCase().includes(query) ||
            (p.businessType || '').toLowerCase().includes(query);
          return matchStatus && matchQuery;
        });
      }

      function renderPartnersTable() {
        const tbody = document.getElementById('partners-tbody');
        const list  = getFilteredPartners();
        const countLabel = document.getElementById('partners-count-label');
        if (countLabel) countLabel.textContent = list.length + ' result' + (list.length !== 1 ? 's' : '');

        if (list.length === 0) {
          tbody.innerHTML = `<tr><td colspan="9" style="text-align:center;color:var(--text-muted);font-style:italic;padding:30px;font-family:'EB Garamond',serif">No applications found.</td></tr>`;
          return;
        }

        tbody.innerHTML = list.map(p => {
          const name     = ((p.firstName || '') + ' ' + (p.lastName || '')).trim() || '—';
          const bizLabel = BUSINESS_TYPE_LABELS[p.businessType] || p.businessType || '—';
          const hasFile  = p.licenseFile && p.licenseFile.data;
          const licenseHTML = p.hasLicense === 'yes'
            ? (hasFile ? `<span style="color:#3a6a3a;font-family:'Libre Baskerville',serif;font-size:11px">File uploaded</span>` : `<span style="color:#8a6a20;font-family:'Libre Baskerville',serif;font-size:11px">Yes (no file)</span>`)
            : `<span style="color:#8a2020;font-family:'Libre Baskerville',serif;font-size:11px">No license</span>`;
          const date = p.date ? new Date(p.date).toLocaleDateString('en-GB', { day:'2-digit', month:'short', year:'numeric' }) : '—';
          const statusClass = { pending:'psb-pending', approved:'psb-approved', rejected:'psb-rejected' }[p.status] || 'psb-pending';
          const statusLabel = (p.status || 'pending').charAt(0).toUpperCase() + (p.status || 'pending').slice(1);
          return `<tr style="cursor:pointer" onclick="openPartnerModal('${p.id}')">
            <td style="font-weight:600;font-family:'EB Garamond',serif">${escHtml(p.brandName || '—')}</td>
            <td>${escHtml(name)}</td>
            <td style="font-size:15px">${escHtml(bizLabel)}</td>
            <td style="font-size:15px">${escHtml(p.email || '—')}</td>
            <td style="font-size:15px">${escHtml(p.mobile || '—')}</td>
            <td>${licenseHTML}</td>
            <td style="font-size:14px;font-family:'Libre Baskerville',serif;color:var(--text-muted)">${date}</td>
            <td><span class="partner-status-badge ${statusClass}">${statusLabel}</span></td>
            <td onclick="event.stopPropagation()" style="white-space:nowrap">
              <button class="partner-action-btn approve" onclick="updatePartnerStatus('${p.id}','approved')">Approve</button>
              <button class="partner-action-btn reject" style="margin-left:5px" onclick="updatePartnerStatus('${p.id}','rejected')">Reject</button>
            </td>
          </tr>`;
        }).join('');
      }

      function escHtml(str) {
        return String(str).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
      }

      function filterPartners() { renderPartnersTable(); }

      function setPartnerFilter(btn, filter) {
        currentPartnerFilter = filter;
        document.querySelectorAll('.partners-filter-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        renderPartnersTable();
      }

      function updatePartnerStatus(id, status) {
        const idx = allPartners.findIndex(p => p.id === id);
        if (idx < 0) return;
        const prev = allPartners[idx].status;
        allPartners[idx].status = status;
        localStorage.setItem('barberlink_partners', JSON.stringify(allPartners));
        renderPartnerStats();
        renderPartnersTable();
        if (currentPartnerId === id) {
          refreshModalFooter(allPartners[idx]);
        }
        // Send email only when status actually changes to approved or rejected
        if (status !== prev && (status === 'approved' || status === 'rejected')) {
          sendPartnerEmail(allPartners[idx], status);
          addNotification('partner-' + status, allPartners[idx]);
        }
        updateNavBadges();
      }

      // ── Partner email HTML builders ────────────────────────────────────────

      function partnerEmailHTML(partner, status) {
        var fn   = partner.firstName || 'there';
        var bn   = partner.brandName  || 'your barbershop';
        var yr   = new Date().getFullYear();
        var hBg  = status === 'approved' ? '#f0faf4' : '#fef2f2';
        var hBrd = status === 'approved' ? '#6ab87a' : '#e87a7a';
        var hClr = status === 'approved' ? '#1a4a2a' : '#7a1a1a';
        var hTxt = status === 'approved'
          ? 'Your barbershop is now cleared for onboarding. A member of our team will be in touch shortly to guide you through the next steps and get you live on the platform.'
          : 'Your application does not meet our current partner requirements. This may be due to licensing, business type eligibility, or availability in your area.';
        var body = status === 'approved'
          ? 'Thank you for your interest in becoming a BarberLink partner. We are pleased to inform you that your application for <strong>' + bn + '<\/strong> has been reviewed and approved.'
          : 'Thank you for taking the time to apply as a BarberLink partner. After careful review of your application for <strong>' + bn + '<\/strong>, we regret to inform you that we are unable to move forward at this time.';
        var closing = status === 'approved'
          ? 'We look forward to working with you and growing together.'
          : 'We encourage you to revisit the requirements and reapply in the future. We appreciate your interest in BarberLink and wish you the best.';

        var o = '';
        o += '<!DO' + 'CTYPE html>';
        o += '<' + 'html><' + 'head><meta charset="UTF-8"><\/' + 'head>';
        o += '<' + 'body style="margin:0;padding:0;background:#f5f4f0;font-family:Georgia,serif;">';
        o += '<table width="100%" cellpadding="0" cellspacing="0" style="padding:40px 20px;"><tr><td align="center">';
        o += '<table width="560" cellpadding="0" cellspacing="0" style="background:#fff;border-radius:12px;border:1px solid #e8e4dc;">';
        o += '<tr><td style="padding:36px 40px 28px;">';
        o += '<div style="font-size:28px;font-weight:700;color:#191265;margin-bottom:24px;">BarberLink<\/div>';
        o += '<div style="height:2px;background:#191265;margin-bottom:28px;"><\/div>';
        o += '<div style="font-size:18px;color:#1a1814;margin-bottom:16px;font-style:italic;">Dear ' + fn + ',<\/div>';
        o += '<div style="font-size:15px;color:#3a3630;line-height:1.75;margin-bottom:20px;">' + body + '<\/div>';
        o += '<div style="background:' + hBg + ';border-left:3px solid ' + hBrd + ';padding:14px 18px;border-radius:0 8px 8px 0;font-size:15px;color:' + hClr + ';margin-bottom:20px;line-height:1.6;">' + hTxt + '<\/div>';
        o += '<div style="font-size:15px;color:#3a3630;line-height:1.75;margin-bottom:28px;">' + closing + '<\/div>';
        o += '<div style="font-size:14px;color:#6b6560;">Warm regards,<br><strong>The BarberLink Team<\/strong><\/div>';
        o += '<div style="height:1px;background:#e8e4dc;margin-top:28px;margin-bottom:16px;"><\/div>';
        o += '<div style="font-size:11px;color:#a09890;">&copy; ' + yr + ' BarberLink &middot; Jordan &middot; barberlink.jo<\/div>';
        o += '<\/td><\/tr><\/table><\/td><\/tr><\/table>';
        o += '<\/' + 'body><\/' + 'html>';
        return o;
      }

      async function sendPartnerEmail(partner, status) {
        if (!partner.email) return;
        const subject = status === 'approved'
          ? `Your BarberLink Application — Approved`
          : `Your BarberLink Application — Update`;
        try {
          await emailjs.send('service_w2j1m8g', 'template_me8cio3', {
            to_email:     partner.email,
            shop_name:    partner.brandName || 'Applicant',
            date:         new Date().toLocaleDateString('en-GB', { day:'2-digit', month:'short', year:'numeric' }),
            html_content: partnerEmailHTML(partner, status),
          });
          showToast((status === 'approved' ? 'Approval' : 'Rejection') + ' email sent to ' + partner.email, 'success');
          console.log('Partner email sent to', partner.email);
        } catch (err) {
          console.error('Partner email failed:', err);
          showToast("Status updated, but the notification email could not be sent.", "error");
        }
      }

      function openPartnerModal(id) {
        const p = allPartners.find(p => p.id === id);
        if (!p) return;
        currentPartnerId = id;

        document.getElementById('pm-brand').textContent     = p.brandName || '—';
        document.getElementById('pm-sub').textContent       = 'Partner Application';
        document.getElementById('pm-firstname').textContent = p.firstName || '—';
        document.getElementById('pm-lastname').textContent  = p.lastName  || '—';
        document.getElementById('pm-email').textContent     = p.email     || '—';
        document.getElementById('pm-mobile').textContent    = p.mobile    || '—';
        document.getElementById('pm-brandname').textContent = p.brandName || '—';
        document.getElementById('pm-biztype').textContent   = BUSINESS_TYPE_LABELS[p.businessType] || p.businessType || '—';
        document.getElementById('pm-loggedin').textContent  = p.isLoggedIn ? 'Logged-in user' : 'Guest submission';

        const statusClass = { pending:'psb-pending', approved:'psb-approved', rejected:'psb-rejected' }[p.status] || 'psb-pending';
        const statusLabel = (p.status||'pending').charAt(0).toUpperCase()+(p.status||'pending').slice(1);
        document.getElementById('pm-status-field').innerHTML = `<span class="partner-status-badge ${statusClass}">${statusLabel}</span>`;

        // License section
        const licSec = document.getElementById('pm-license-section');
        if (p.hasLicense === 'yes' && p.licenseFile && p.licenseFile.data) {
          const sizeFmt = p.licenseFile.size ? formatBytes(p.licenseFile.size) : '';
          const isImage = p.licenseFile.type && p.licenseFile.type.startsWith('image/');
          licSec.innerHTML = `
            <div class="pm-license-preview">
              <div class="pm-license-icon">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" stroke-width="1.8"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
              </div>
              <div>
                <div class="pm-license-name">${escHtml(p.licenseFile.name)}</div>
                <div class="pm-license-size">${sizeFmt}</div>
              </div>
              <a href="${p.licenseFile.data}" download="${escHtml(p.licenseFile.name)}" class="pm-license-view" target="_blank">View / Download</a>
            </div>
            ${isImage ? `<div style="margin-top:12px"><img src="${p.licenseFile.data}" style="max-width:100%;border-radius:8px;border:1px solid var(--border)" /></div>` : ''}
          `;
        } else if (p.hasLicense === 'no') {
          licSec.innerHTML = `<div style="font-family:'EB Garamond',serif;font-size:16px;color:var(--text-muted);font-style:italic;padding:10px 0">Applicant does not have a commercial license.</div>`;
        } else {
          licSec.innerHTML = `<div style="font-family:'EB Garamond',serif;font-size:16px;color:var(--text-muted);font-style:italic;padding:10px 0">No license file uploaded.</div>`;
        }

        const date = p.date ? new Date(p.date).toLocaleString('en-GB', { day:'2-digit', month:'short', year:'numeric', hour:'2-digit', minute:'2-digit' }) : '';
        document.getElementById('pm-date-note').textContent = date ? 'Submitted ' + date : '';

        refreshModalFooter(p);
        document.getElementById('partner-overlay').classList.add('visible');
      }

      function refreshModalFooter(p) {
        const approveBtn = document.getElementById('pm-approve-btn');
        const rejectBtn  = document.getElementById('pm-reject-btn');
        if (p.status === 'approved') {
          approveBtn.style.opacity = '0.4'; approveBtn.style.pointerEvents = 'none';
          rejectBtn.style.opacity  = '1';   rejectBtn.style.pointerEvents  = 'auto';
        } else if (p.status === 'rejected') {
          rejectBtn.style.opacity  = '0.4'; rejectBtn.style.pointerEvents = 'none';
          approveBtn.style.opacity = '1';   approveBtn.style.pointerEvents = 'auto';
        } else {
          approveBtn.style.opacity = '1'; approveBtn.style.pointerEvents = 'auto';
          rejectBtn.style.opacity  = '1'; rejectBtn.style.pointerEvents  = 'auto';
        }
        // Refresh status badge inside modal
        const statusClass = { pending:'psb-pending', approved:'psb-approved', rejected:'psb-rejected' }[p.status] || 'psb-pending';
        const statusLabel = (p.status||'pending').charAt(0).toUpperCase()+(p.status||'pending').slice(1);
        const sf = document.getElementById('pm-status-field');
        if (sf) sf.innerHTML = `<span class="partner-status-badge ${statusClass}">${statusLabel}</span>`;
      }

      function partnerModalAction(status) {
        if (!currentPartnerId) return;
        updatePartnerStatus(currentPartnerId, status);
      }

      function closePartnerModal() {
        document.getElementById('partner-overlay').classList.remove('visible');
        currentPartnerId = null;
      }

      function formatBytes(bytes) {
        if (!bytes) return '';
        if (bytes < 1024) return bytes + ' B';
        if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
        return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
      }

      // ── BOOKING CANCEL ──────────────────────────────────────────────────

      function cancelBooking(e, ref, client, service, time) {
        e.stopPropagation();
        if (!confirm('Cancel booking for ' + client + '?')) return;
        try {
          let bks = JSON.parse(localStorage.getItem('barberlink_bookings') || '[]');
          const idx = ref ? bks.findIndex(b => b.ref === ref) : bks.findIndex(b => b.client === client && b.time === time);
          const removed = idx > -1 ? bks.splice(idx, 1)[0] : null;
          localStorage.setItem('barberlink_bookings', JSON.stringify(bks));
          if (removed) {
            addNotification('booking-cancelled', {
              firstName: removed.client,
              lastName: '',
              sub: Array.isArray(removed.svcs) ? removed.svcs.join(', ') : (removed.svcs || service),
              shopName: removed.shop || '',
              time: removed.time || time,
            });
          }
          loadBookingsFromStorage();
          renderStats();
          renderWeekStrip();
          renderGrid();
          showToast('Booking for ' + client + ' cancelled.', 'warning');
        } catch(err) {
          showToast('Could not cancel booking.', 'error');
        }
      }

      // Listen for bookings submitted from the public booking site
      window.addEventListener('storage', function(e) {
        if (e.key !== 'barberlink_bookings') return;
        const newList  = JSON.parse(e.newValue  || '[]');
        const oldList  = JSON.parse(e.oldValue  || '[]');
        const added    = newList.filter(nb => !oldList.find(ob => ob.ref === nb.ref));
        added.forEach(bk => {
          if (bk.ref && bk.ref.startsWith('ADM-')) return; // ignore admin-created, already handled
          addNotification('booking-new', {
            firstName: bk.client,
            lastName: '',
            sub: Array.isArray(bk.svcs) ? bk.svcs.join(', ') : (bk.svcs || ''),
            shopName: bk.shop || '',
            time: bk.time || '',
            date: bk.date || '',
          });
        });
        loadBookingsFromStorage();
        renderStats();
        renderWeekStrip();
        renderGrid();
        if (added.length > 0) showToast(added.length + ' new booking' + (added.length > 1 ? 's' : '') + ' received.', 'success');
      });

      // ── NOTIFICATION SYSTEM ─────────────────────────────────────────────

      function getNotifs() {
        try { return JSON.parse(localStorage.getItem('barberlink_notifs') || '[]'); } catch(e) { return []; }
      }
      function saveNotifs(notifs) {
        try { localStorage.setItem('barberlink_notifs', JSON.stringify(notifs)); } catch(e) {}
      }

      function addNotification(type, data) {
        const notifs = getNotifs();
        notifs.unshift({
          id:    'n_' + Date.now(),
          type:  type,
          name:  ((data.firstName || '') + ' ' + (data.lastName || '')).trim() || (data.brandName || 'Applicant'),
          sub:   data.jobTitle || data.position || '',
          shop:  data.shopName || '',
          time:  new Date().toISOString(),
          read:  false,
        });
        saveNotifs(notifs.slice(0, 50)); // keep max 50
        renderNotifDropdown();
        updateNavBadges();
      }

      function renderNotifDropdown() {
        const notifs  = getNotifs();
        const list    = document.getElementById('notif-list');
        const badge   = document.getElementById('notif-badge-dot');
        if (!list) return;
        const unread  = notifs.filter(n => !n.read).length;
        if (badge) {
          if (unread > 0) { badge.textContent = unread > 9 ? '9+' : unread; badge.classList.add('visible'); }
          else            { badge.classList.remove('visible'); }
        }
        if (notifs.length === 0) {
          list.innerHTML = '<div class="notif-empty">No notifications yet.</div>';
          return;
        }
        list.innerHTML = notifs.map(n => {
          const isJob     = n.type.startsWith('job');
          const isBooking = n.type.startsWith('booking');
          const iconColor = isBooking ? 'ni-booking' : isJob ? 'ni-job' : 'ni-partner';
          const iconSvg   = isBooking
            ? '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="' + (n.type === 'booking-cancelled' ? '#a06060' : '#6a8ab0') + '" stroke-width="1.8"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>'
            : isJob
            ? '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#c8906a" stroke-width="1.8"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>'
            : '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#6a8a6a" stroke-width="1.8"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/></svg>';
          const labels = { 'job-new':'New job application', 'job-interview':'Interview scheduled', 'job-rejected':'Application rejected', 'partner-new':'New partner application', 'partner-approved':'Partner approved', 'partner-rejected':'Partner rejected', 'booking-new':'New booking', 'booking-cancelled':'Booking cancelled' };
          const label  = labels[n.type] || 'New notification';
          const time   = n.time ? new Date(n.time).toLocaleString('en-GB',{day:'2-digit',month:'short',hour:'2-digit',minute:'2-digit'}) : '';
          const page   = isBooking ? 'appointments' : isJob ? 'jobapps' : 'partners';
          return '<div class="notif-item' + (n.read ? '' : ' unread') + '" onclick="openNotif(\'' + n.id + '\',\'' + page + '\')">'
            + '<div class="notif-icon ' + iconColor + '">' + iconSvg + '</div>'
            + '<div class="notif-text">'
            + '<div class="notif-item-title">' + escHtml(n.name) + '</div>'
            + '<div class="notif-item-sub">' + escHtml(label) + (n.sub ? ' · ' + escHtml(n.sub) : '') + '</div>'
            + '<div class="notif-item-sub">' + time + '</div>'
            + '</div>'
            + (n.read ? '' : '<div class="notif-unread-dot"></div>')
            + '</div>';
        }).join('');
      }

      function openNotif(id, page) {
        const notifs = getNotifs();
        const n = notifs.find(x => x.id === id);
        if (n) { n.read = true; saveNotifs(notifs); }
        renderNotifDropdown();
        toggleNotifDropdown();
        showPage(page, null);
      }

      function clearAllNotifs() {
        const notifs = getNotifs().map(n => ({ ...n, read: true }));
        saveNotifs(notifs);
        renderNotifDropdown();
      }

      function toggleNotifDropdown() {
        const dd = document.getElementById('notif-dropdown');
        if (dd) dd.classList.toggle('open');
      }

      document.addEventListener('click', function(e) {
        const wrap = document.getElementById('notif-wrap');
        const dd   = document.getElementById('notif-dropdown');
        if (wrap && dd && !wrap.contains(e.target)) dd.classList.remove('open');
      });

      // ── NAV BADGES (partners pending + job apps new) ─────────────────────
      function updateNavBadges() {
        // Partner badge
        const pendingPartners = (JSON.parse(localStorage.getItem('barberlink_partners') || '[]')).filter(p => p.status === 'pending').length;
        const partnerNav = document.querySelector('[onclick*="\'partners\'"]');
        if (partnerNav) {
          let pb = document.getElementById('partner-nav-badge');
          if (pendingPartners > 0) {
            if (!pb) { pb = document.createElement('span'); pb.id = 'partner-nav-badge'; pb.style.cssText = "margin-left:auto;background:#d4a84a;color:white;font-size:10px;font-family:'Libre Baskerville',serif;padding:1px 7px;border-radius:10px;"; partnerNav.appendChild(pb); }
            pb.textContent = pendingPartners;
          } else if (pb) pb.remove();
        }
        // Job apps badge
        const newJobApps = (JSON.parse(localStorage.getItem('barberlink_job_applications') || '[]')).filter(a => a.status === 'new').length;
        const jobNav = document.querySelector('[onclick*="\'jobapps\'"]');
        if (jobNav) {
          let jb = document.getElementById('jobapps-nav-badge');
          if (newJobApps > 0) {
            if (!jb) { jb = document.createElement('span'); jb.id = 'jobapps-nav-badge'; jb.style.cssText = "margin-left:auto;background:#d4a84a;color:white;font-size:10px;font-family:'Libre Baskerville',serif;padding:1px 7px;border-radius:10px;"; jobNav.appendChild(jb); }
            jb.textContent = newJobApps;
          } else if (jb) jb.remove();
        }
      }

document.addEventListener('DOMContentLoaded', function() {
  if (typeof emailjs !== 'undefined') {
    emailjs.init('cDUi14ftfEXNfpYTx');
  }
  // Pre-load all data so badges and notifications are correct on startup
  try { allPartners = JSON.parse(localStorage.getItem('barberlink_partners') || '[]'); } catch(e) { allPartners = []; }
  try { allJobApps  = JSON.parse(localStorage.getItem('barberlink_job_applications') || '[]'); } catch(e) { allJobApps = []; }
  renderNotifDropdown();
  updateNavBadges();

  // Hash-based routing: navigate to the section in the URL on load
  const validPages = ['dashboard','appointments','customers','shops','partners','jobapps','ratings','promos','email','settings'];
  function navigateToHash() {
    const hash = location.hash.replace('#', '');
    const page = validPages.includes(hash) ? hash : 'appointments';
    showPage(page, null);
  }
  navigateToHash();
  window.addEventListener('hashchange', navigateToHash);

  // Intercept nav link clicks to prevent page jump, handle via JS
  document.querySelectorAll('.nav-item').forEach(function(link) {
    link.addEventListener('click', function(e) {
      e.preventDefault();
      const page = this.getAttribute('href').replace('#', '');
      showPage(page, this);
    });
  });
});