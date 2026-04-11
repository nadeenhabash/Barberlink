/* ─── SHOP DATA ───────────────────────────────────────────── */
const SHOPS = {
  1: {
    name: "Fares Barbershop",
    location: "Abdoun Circle, Amman",
    svcs: [
      { id: 1,  name: "Classic Haircut",     desc: "Scissor or clipper finish",                        dur: 30,  price: 10 },
      { id: 2,  name: "Hot Towel Shave",      desc: "Traditional straight razor shave",                 dur: 25,  price: 10 },
      { id: 3,  name: "Haircut & Beard Trim", desc: "Full service — cut and beard sculpting",           dur: 45,  price: 15 },
      { id: 4,  name: "Kids Cut",             desc: "Under 12. Clean and simple.",                      dur: 20,  price: 5  },
      { id: 5,  name: "Hair Colour",          desc: "Full colour application and finish",               dur: 60,  price: 25 },
      { id: 6,  name: "Scalp Treatment",      desc: "Deep cleanse with hot steam massage",              dur: 40,  price: 22 },
      { id: 7,  name: "Gentleman Package",    desc: "Haircut + beard trim + hot towel shave",           dur: 75,  price: 20 },
      { id: 8,  name: "VIP Grooming",         desc: "Haircut + beard + facial cleanse + scalp massage", dur: 90,  price: 40 },
      { id: 9,  name: "Kids & Dad Package",   desc: "Haircut for father and child",                     dur: 60,  price: 13 },
      { id: 10, name: "Wedding Package",      desc: "Premium haircut + beard styling + facial treatment", dur: 120, price: 50 },
      { id: 11, name: "Refresh Package",      desc: "Haircut + scalp treatment + hair wash",            dur: 70,  price: 18 },
    ],
    staff: [
      { id: 1, name: "Fares Al-Nasser", role: "Master Barber",   init: "FA", badge: "Owner", stars: "★★★★★" },
      { id: 2, name: "Omar Khalil",     role: "Senior Barber",   init: "OK", badge: null,    stars: "★★★★★" },
      { id: 3, name: "Rami Hassan",     role: "Barber",          init: "RH", badge: null,    stars: "★★★★☆" },
      { id: 4, name: "Ziad Mansour",    role: "Barber",          init: "ZM", badge: null,    stars: "★★★★☆" },
      { id: 5, name: "Ibrahim Khalil",  role: "Senior Barber",   init: "IK", badge: null,    stars: "★★★★★" },
      { id: 6, name: "Any Available",   role: "First Available", init: "?",  badge: null,    stars: "★★★★★" },
    ],
  },
  2: {
    name: "Capri Barbershop",
    location: "Swefieh, Amman",
    svcs: [
      { id: 1,  name: "Classic Haircut",        desc: "Clean scissor or clipper cut",                  dur: 30,  price: 6  },
      { id: 2,  name: "Fade",                   desc: "Skin or low fade, sharp finish",                dur: 40,  price: 8  },
      { id: 3,  name: "Beard Trim",             desc: "Shape and define your beard",                   dur: 20,  price: 4  },
      { id: 4,  name: "Hair Coloring",          desc: "Full colour application and finish",            dur: 60,  price: 20 },
      { id: 5,  name: "Haircut & Beard",        desc: "Combined cut and beard sculpting",              dur: 50,  price: 9  },
      { id: 6,  name: "Kids Cut",               desc: "Under 12. Quick and comfortable.",              dur: 25,  price: 5  },
      { id: 7,  name: "Student Package",        desc: "Haircut + quick styling for students",          dur: 40,  price: 7  },
      { id: 8,  name: "Fade Master Package",    desc: "Skin fade + beard line-up + styling",           dur: 70,  price: 16 },
      { id: 9,  name: "Weekend Refresh",        desc: "Haircut + wash + scalp massage",                dur: 60,  price: 14 },
      { id: 10, name: "Executive Package",      desc: "Premium haircut + beard trim + facial towel",   dur: 85,  price: 25 },
      { id: 11, name: "Color & Style Package",  desc: "Hair coloring + haircut + finish styling",      dur: 100, price: 30 },
      { id: 12, name: "Father & Son Package",   desc: "Haircuts for father and child",                 dur: 65,  price: 10 },
    ],
    staff: [
      { id: 1, name: "Capri Haddad",  role: "Master Barber",   init: "CH", badge: "Owner", stars: "★★★★★" },
      { id: 2, name: "Mhmd Saad",     role: "Senior Barber",   init: "MS", badge: null,    stars: "★★★★★" },
      { id: 3, name: "Anas Yousef",   role: "Barber",          init: "AY", badge: null,    stars: "★★★★☆" },
      { id: 4, name: "Any Available", role: "First Available", init: "?",  badge: null,    stars: "★★★★★" },
    ],
  },
  3: {
    name: "O&M Barbershop",
    location: "Shmeisani, Amman",
    svcs: [
      { id: 1,  name: "Classic Haircut",         desc: "Scissor or clipper finish",                        dur: 30,  price: 8  },
      { id: 2,  name: "Skin Fade",               desc: "Zero-to-skin fade with sharp lines",               dur: 45,  price: 12 },
      { id: 3,  name: "Beard Sculpting",         desc: "Precision beard shape and trim",                   dur: 30,  price: 8  },
      { id: 4,  name: "Haircut & Beard",         desc: "Full service — cut and beard sculpting",           dur: 55,  price: 15 },
      { id: 5,  name: "Hair Design",             desc: "Custom design patterns and colour",                dur: 60,  price: 18 },
      { id: 6,  name: "Scalp Treatment",         desc: "Deep cleanse with hot steam massage",              dur: 40,  price: 14 },
      { id: 7,  name: "Kids Cut",                desc: "Under 12. Clean and comfortable.",                 dur: 25,  price: 6  },
      { id: 8,  name: "Luxury Groom Package",    desc: "Haircut + beard sculpting + scalp treatment",      dur: 90,  price: 22 },
      { id: 9,  name: "Style & Design Package",  desc: "Skin fade + custom hair design + styling",        dur: 95,  price: 24 },
      { id: 10, name: "Royal VIP Package",       desc: "Haircut + beard + facial towel + scalp massage",   dur: 110, price: 30 },
      { id: 11, name: "Color Transformation",    desc: "Hair coloring + haircut + design finish",          dur: 120, price: 32 },
      { id: 12, name: "Groom Wedding Package",   desc: "Premium full grooming for wedding events",         dur: 140, price: 40 },
    ],
    staff: [
      { id: 1, name: "Omar Al-Khateeb", role: "Master Barber",     init: "OK", badge: "Owner", stars: "★★★★★" },
      { id: 2, name: "Mustafa Nour",    role: "Senior Barber",     init: "MN", badge: null,    stars: "★★★★★" },
      { id: 3, name: "Rami Saleh",      role: "Colour Specialist", init: "RS", badge: null,    stars: "★★★★★" },
      { id: 4, name: "Hasan Odeh",      role: "Barber",            init: "HO", badge: null,    stars: "★★★★☆" },
      { id: 5, name: "Any Available",   role: "First Available",   init: "?",  badge: null,    stars: "★★★★★" },
    ],
  },
};

/* ─── SHOP INIT ───────────────────────────────────────────── */
const _shopId  = parseInt(new URLSearchParams(window.location.search).get("shop")) || 1;
const _shop    = SHOPS[_shopId] || SHOPS[1];
const SVCS     = _shop.svcs;
const STAFF    = _shop.staff;

const SHOP_KEY_MAP = {
  "Fares Barbershop": "fares",
  "Capri Barbershop": "capri",
  "O&M Barbershop":   "om",
};
const _shopKey = SHOP_KEY_MAP[_shop.name] || "fares";

/* ─── STATE ───────────────────────────────────────────────── */
const st = {
  svcs: [],
  staff: null,
  date: null,
  time: null,
  payment: "cash",
  cy: new Date().getFullYear(),
  cm: new Date().getMonth(),
};

let TAKEN        = {};
let wlSel        = null;
let appliedPromo = null;

const MN = [
  "January","February","March","April","May","June",
  "July","August","September","October","November","December",
];

/* ─── HARDCODED PROMO CODES (fallback) ───────────────────── */
const PROMO_CODES = {
  BARBER10: { type: "percent", value: 10, label: "10% off" },
  BARBER20: { type: "percent", value: 20, label: "20% off" },
  WELCOME5: { type: "fixed",   value: 5,  label: "5 JD off" },
  VIP15:    { type: "percent", value: 15, label: "15% off" },
};

/* ─── HELPERS ─────────────────────────────────────────────── */
function $id(id) { return document.getElementById(id); }

function lsJson(key, fallback) {
  try { return JSON.parse(localStorage.getItem(key) || JSON.stringify(fallback)); }
  catch (e) { return fallback; }
}

/* ─── TAKEN SLOT BUILDER ──────────────────────────────────── */
function buildTakenForBarber(staffName) {
  const taken = {};
  if (!staffName) return taken;

  // Admin-blocked slots
  const blocked    = lsJson("barberlink_blocked", {});
  const shopBlocks = blocked[_shopKey] || {};

  Object.keys(shopBlocks).forEach(key => {
    const parts = key.split("-");
    if (parts.length < 2) return;
    const barberIdx    = parseInt(parts[0]);
    const time         = parts.slice(1).join("-");
    const datePart     = shopBlocks[key];
    const blockedStaff = STAFF[barberIdx];
    if (typeof datePart !== "string") return;
    if (blockedStaff && blockedStaff.name !== staffName) return;
    const d = new Date(datePart).getDate();
    if (!taken[d]) taken[d] = [];
    if (!taken[d].includes(time)) taken[d].push(time);
  });

  // Existing bookings
  const bookings = lsJson("barberlink_bookings", []);
  bookings.forEach(bk => {
    if (bk.shop !== _shop.name || !bk.date || !bk.time) return;
    if (bk.staff !== staffName) return;
    const d = new Date(bk.date).getDate();
    if (!taken[d]) taken[d] = [];
    if (!taken[d].includes(bk.time)) taken[d].push(bk.time);
  });

  return taken;
}

/* ─── PROMO HELPERS ───────────────────────────────────────── */
function getAdminPromos() {
  return lsJson("barberlink_promos", []);
}

function findPromoCode(code) {
  const adminPromo = getAdminPromos().find(p => p.code === code);
  if (adminPromo) {
    if (adminPromo.expiry && new Date(adminPromo.expiry) < new Date())
      return { error: "This promo code has expired." };
    if (adminPromo.maxUses > 0 && (adminPromo.usedCount || 0) >= adminPromo.maxUses)
      return { error: "This promo code has reached its usage limit." };
    if (adminPromo.shop && adminPromo.shop !== "all" && adminPromo.shop !== _shop.name)
      return { error: `This code is only valid at ${adminPromo.shop}.` };
    if (adminPromo.minOrder > 0 && getRawTotal() < adminPromo.minOrder)
      return { error: `This code requires a minimum order of ${adminPromo.minOrder} JD. Your current total is ${getRawTotal()} JD.` };
    const label = adminPromo.type === "percent"
      ? `${adminPromo.value}% off`
      : `${adminPromo.value} JD off`;
    return { type: adminPromo.type, value: adminPromo.value, label, _adminPromo: adminPromo };
  }
  return PROMO_CODES[code] ? { ...PROMO_CODES[code] } : { error: "Invalid promo code." };
}

function getRawTotal() {
  return st.svcs.reduce((sum, id) => sum + (SVCS.find(x => x.id === id)?.price || 0), 0);
}

function getFinalTotal() {
  const raw = getRawTotal();
  if (!appliedPromo) return raw;
  if (appliedPromo.type === "percent") return Math.max(0, raw - Math.round(raw * appliedPromo.value / 100));
  return Math.max(0, raw - appliedPromo.value);
}

function applyPromo() {
  const code = $id("fPromo")?.value.trim().toUpperCase();
  const msg  = $id("promoMsg");
  if (!code) return;
  const result = findPromoCode(code);
  if (!result || result.error) {
    appliedPromo        = null;
    msg.textContent     = result?.error || "Invalid promo code.";
    msg.className       = "promo-msg promo-err";
    sync();
    return;
  }
  appliedPromo    = result;
  msg.textContent = `✓ Code applied — ${result.label}`;
  msg.className   = "promo-msg promo-ok";
  sync();
}

function resetPromo() {
  appliedPromo = null;
  const msg = $id("promoMsg");
  if (msg) { msg.textContent = ""; msg.className = "promo-msg"; }
  document.querySelectorAll(".promo-pill").forEach(p => p.classList.remove("applied"));
  sync();
}

function pillApply(code) {
  const input = $id("fPromo");
  if (input) input.value = code;
  applyPromo();
  document.querySelectorAll(".promo-pill").forEach(p => {
    p.classList.toggle("applied", p.dataset.code === code && !!appliedPromo);
  });
}

function renderPromoPills() {
  const container = $id("promoPills");
  if (!container) return;
  const now   = new Date();
  const valid = getAdminPromos().filter(p => {
    if (p.expiry && new Date(p.expiry) < now) return false;
    if (p.maxUses > 0 && (p.usedCount || 0) >= p.maxUses) return false;
    if (p.shop && p.shop !== "all" && p.shop !== _shop.name) return false;
    return true;
  });

  if (!valid.length) { container.innerHTML = ""; return; }

  container.innerHTML = valid.map(p => {
    const valLabel = p.type === "percent" ? `${p.value}% off` : `${p.value} JD off`;
    const minLabel = p.minOrder > 0 ? `${p.minOrder} JD` : "No minimum";
    const expLabel = p.expiry
      ? new Date(p.expiry).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })
      : "No expiry";
    return `
      <div class="promo-pill" data-code="${p.code}" onclick="pillApply('${p.code}')">
        ${p.code}
        <div class="promo-pill-tip">
          <div class="pill-tip-row"><span class="pill-tip-lbl">Discount</span><span class="pill-tip-val">${valLabel}</span></div>
          <div class="pill-tip-row"><span class="pill-tip-lbl">Min. order</span><span class="pill-tip-val">${minLabel}</span></div>
          <div class="pill-tip-row"><span class="pill-tip-lbl">Expires</span><span class="pill-tip-val">${expLabel}</span></div>
        </div>
      </div>`;
  }).join("");
}

/* ─── PACKAGE DETECTION ───────────────────────────────────── */
const PKG_KEYWORDS = [
  "package","grooming","vip","wedding","gentleman","refresh","executive",
  "luxury","royal","master","transformation","groom","color & style",
  "fade master","weekend refresh","father","style & design",
];
function isPackage(s) {
  const lower = s.name.toLowerCase();
  return PKG_KEYWORDS.some(kw => lower.includes(kw));
}

/* ─── DOM READY ───────────────────────────────────────────── */
document.addEventListener("DOMContentLoaded", () => {
  // Page meta
  document.title = `Book — ${_shop.name} · BarberLink`;
  const asideSN = $id("asideShopName");
  if (asideSN) asideSN.innerHTML = _shop.name.replace(" ", "<br />");
  const hdrShop = $id("hdrShopName");
  if (hdrShop) hdrShop.textContent = _shop.name;
  const hdrLoc = $id("hdrShopLoc");
  if (hdrLoc) hdrLoc.textContent = _shop.location;

  // Render services
  const regularSvcs = SVCS.filter(s => !isPackage(s));
  const packageSvcs = SVCS.filter(s =>  isPackage(s));

  const checkSVG = `<svg viewBox="0 0 24 24"><path d="M20 6L9 17l-5-5"/></svg>`;

  const regularHTML = regularSvcs.map((s, i) => {
    const isLast = packageSvcs.length && i === regularSvcs.length - 1;
    return `
      <div class="svc-item${isLast ? " no-bottom-border" : ""}" id="si${s.id}" onclick="togSvc(${s.id})">
        <div class="svc-left">
          <div class="svc-name">${s.name}</div>
          <div class="svc-desc">${s.desc}</div>
        </div>
        <div class="svc-dur">${s.dur}&thinsp;min</div>
        <div class="svc-price">${s.price}&thinsp;JD</div>
        <div class="svc-box">${checkSVG}</div>
      </div>`;
  }).join("");

  const packageHTML = packageSvcs.length ? `
    <div class="pkg-divider">
      <div class="pkg-divider-line"></div>
      <div class="pkg-divider-label">Packages</div>
      <div class="pkg-divider-line"></div>
    </div>
    ${packageSvcs.map(s => `
      <div class="pkg-item" id="si${s.id}" onclick="togSvc(${s.id})">
        <div class="pkg-item-label">
          <div class="pkg-item-label-dot"></div>
          <div class="pkg-item-label-text">Package</div>
          <div class="pkg-item-label-dot"></div>
        </div>
        <div>
          <div class="pkg-item-name">${s.name}</div>
          <div class="pkg-item-desc">${s.desc}</div>
        </div>
        <div class="pkg-item-dur">${s.dur}&thinsp;min</div>
        <div class="pkg-item-price">${s.price}&thinsp;JD</div>
        <div class="pkg-item-box">${checkSVG}</div>
      </div>`).join("")}
  ` : "";

  $id("svcList").innerHTML = regularHTML + packageHTML;

  // Render staff
  const unavailableBarbers = lsJson("barberlink_barbers", {})[_shopKey] || [];
  $id("staffGrid").innerHTML = STAFF.map(s => {
    const isUnavailable = unavailableBarbers.includes(s.name);
    return `
      <div class="staff-card${isUnavailable ? " unavailable" : ""}" id="sf${s.id}"
        ${isUnavailable ? 'title="Not available today"' : `onclick="pickStaff(${s.id})"`}>
        ${s.badge ? `<div class="staff-badge">${s.badge}</div>` : ""}
        <div class="staff-init">${s.init}</div>
        <div class="staff-name">${s.name}</div>
        <div class="staff-role">${isUnavailable ? "Not available today" : s.role}</div>
        <div class="staff-stars">${s.stars}</div>
        ${isUnavailable ? `<div style="font-size:11px;color:#c87a7a;margin-top:4px;font-family:'Jost',sans-serif;letter-spacing:0.04em">Unavailable</div>` : ""}
      </div>`;
  }).join("");

  renderCal();
});

/* ─── STEP 1: SERVICES ────────────────────────────────────── */
function togSvc(id) {
  const i = st.svcs.indexOf(id);
  i === -1 ? st.svcs.push(id) : st.svcs.splice(i, 1);
  SVCS.forEach(s => $id("si" + s.id)?.classList.toggle("sel", st.svcs.includes(s.id)));
  $id("b1").disabled = st.svcs.length === 0;
  sync();
}

/* ─── STEP 2: STAFF ───────────────────────────────────────── */
function pickStaff(id) {
  st.staff = id;
  STAFF.forEach(s => $id("sf" + s.id)?.classList.toggle("sel", s.id === id));
  $id("b2").disabled = false;
  sync();
}

/* ─── STEP 3: CALENDAR ────────────────────────────────────── */
function renderCal() {
  const { cy, cm } = st;
  const first = new Date(cy, cm, 1).getDay();
  const days  = new Date(cy, cm + 1, 0).getDate();
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const daysData = lsJson("barberlink_shop_days", {});
  const openDays = (daysData[_shopKey] && Array.isArray(daysData[_shopKey]))
    ? daysData[_shopKey]
    : [0, 1, 2, 3, 4, 5, 6];

  $id("calLbl").textContent = `${MN[cm]} ${cy}`;

  const notice = $id("cal-sameday-notice");
  if (notice) {
    notice.style.display = (cy === today.getFullYear() && cm === today.getMonth())
      ? "block" : "none";
  }

  let h = "";
  for (let i = 0; i < first; i++) h += `<div class="cal-cell empty"></div>`;

  for (let d = 1; d <= days; d++) {
    const dt     = new Date(cy, cm, d);
    const past   = dt <= today;
    const isT    = dt.getTime() === today.getTime();
    const closed = !openDays.includes(dt.getDay());
    const sel    = st.date
      && st.date.getDate()     === d
      && st.date.getMonth()    === cm
      && st.date.getFullYear() === cy;

    let c = "cal-cell";
    if (past || closed) c += " past";
    if (isT)  c += " today";
    if (sel)  c += " sel";

    const title = closed ? "Closed" : isT ? "Same-day bookings unavailable" : "";
    h += (past || closed)
      ? `<div class="${c}" title="${title}">${d}</div>`
      : `<div class="${c}" onclick="pickDate(${cy},${cm},${d})">${d}</div>`;
  }
  $id("calGrid").innerHTML = h;
}

function shiftM(d) {
  st.cm += d;
  if (st.cm < 0)  { st.cm = 11; st.cy--; }
  if (st.cm > 11) { st.cm = 0;  st.cy++; }
  const now = new Date();
  if (st.cy < now.getFullYear() || (st.cy === now.getFullYear() && st.cm < now.getMonth())) {
    st.cm = now.getMonth();
    st.cy = now.getFullYear();
  }
  renderCal();
}

function pickDate(y, m, d) {
  st.date = new Date(y, m, d);
  st.time = null;
  $id("b3").disabled = wlSel ? false : true;
  renderCal();
  renderTimes();
  sync();
  updCancel();
}

/* ─── STEP 3: TIME SLOTS ──────────────────────────────────── */
function renderTimes() {
  if (!st.date) return;
  $id("tPh").style.display  = "none";
  $id("tBox").style.display = "block";
  $id("tBoxHeader").textContent = st.date.toLocaleDateString("en-GB", {
    weekday: "long", day: "numeric", month: "long",
  });

  const selectedStaff = st.staff ? STAFF.find(x => x.id === st.staff) : null;
  TAKEN = buildTakenForBarber(selectedStaff ? selectedStaff.name : null);

  const hoursData = lsJson("barberlink_shop_hours", {});
  const shopHours = hoursData[_shopKey];
  const _openH  = shopHours ? (parseInt(shopHours.open.split(":")[0])  || 9)  : 9;
  const _closeH = shopHours ? (parseInt(shopHours.close.split(":")[0]) || 20) : 20;

  const dk    = st.date.getDate();
  const taken = TAKEN[dk] || [];
  const now   = new Date();
  const isT   = st.date.toDateString() === now.toDateString();
  const AM = [], PM = [], EVE = [];

  for (let h = _openH; h < _closeH; h++) {
    for (const mn of [0, 30]) {
      const lbl = `${String(h).padStart(2, "0")}:${mn ? "30" : "00"}`;
      const sd  = new Date(st.date);
      sd.setHours(h, mn);
      const gone = (isT && sd <= now) || taken.includes(lbl);
      (h < 12 ? AM : h < 17 ? PM : EVE).push({ lbl, gone });
    }
  }

  const mkGrid = arr => arr.map(t => {
    const cls  = t.gone ? "tbtn taken" : st.time === t.lbl ? "tbtn sel" : "tbtn";
    const attr = t.gone ? "" : ` onclick="pickTime('${t.lbl}')"`;
    return `<div class="${cls}"${attr}>${t.lbl}</div>`;
  }).join("");

  $id("tBoxBody").innerHTML =
    `<div class="tp-lbl">Morning</div><div class="tgrid">${mkGrid(AM)}</div>` +
    `<div class="tp-lbl">Afternoon</div><div class="tgrid">${mkGrid(PM)}</div>` +
    `<div class="tp-lbl">Evening</div><div class="tgrid">${mkGrid(EVE)}</div>`;
}

function pickTime(t) {
  st.time = t;
  wlSel   = null;
  document.querySelectorAll(".wl-cell").forEach(c => c.classList.remove("sel"));
  document.querySelectorAll(".tbtn").forEach(b => b.classList.remove("sel"));
  ["wlTimeBefore","wlTimeAfter","wlTimeBetween"].forEach(id => $id(id).style.display = "none");
  event.currentTarget.classList.add("sel");
  $id("b3").disabled = false;
  sync();
  updCancel();
}

/* ─── STEP 3: WAITING LIST ────────────────────────────────── */
function wlTimeValid() {
  if (!wlSel || wlSel === "any") return true;
  if (wlSel === "before")  return !!$id("wlTimeBeforeVal").value;
  if (wlSel === "after")   return !!$id("wlTimeAfterVal").value;
  if (wlSel === "between") return !!$id("wlTimeFrom").value && !!$id("wlTimeTo").value;
  return true;
}

function pickWL(type) {
  wlSel   = type;
  st.time = null;
  document.querySelectorAll(".tbtn").forEach(b => b.classList.remove("sel"));
  document.querySelectorAll(".wl-cell").forEach(c => c.classList.remove("sel"));
  const cells = { any: 0, before: 1, after: 2, between: 3 };
  document.querySelectorAll(".wl-cell")[cells[type]].classList.add("sel");
  $id("wlTimeBefore").style.display   = type === "before"  ? "flex" : "none";
  $id("wlTimeAfter").style.display    = type === "after"   ? "flex" : "none";
  $id("wlTimeBetween").style.display  = type === "between" ? "flex" : "none";
  if (st.date) $id("b3").disabled = !wlTimeValid();
}

/* ─── NAVIGATION ──────────────────────────────────────────── */
function go(n) {
  if (n > 1 && st.svcs.length === 0) return;
  if (n > 2 && !st.staff) return;
  if (n > 3 && (!st.date || (!st.time && !wlSel))) return;
  ["s1","s2","s3","s4"].forEach((id, i) =>
    $id(id).classList.toggle("active", i + 1 === n)
  );
  document.querySelectorAll(".rail-step").forEach(el => {
    const s = +el.dataset.s;
    el.classList.toggle("active", s === n);
    el.classList.toggle("done",   s < n);
  });
  if (n === 4) renderPromoPills();
  window.scrollTo({ top: 0, behavior: "smooth" });
}

/* ─── SUMMARY SYNC ────────────────────────────────────────── */
function sync() {
  // Services
  $id("sSvc").innerHTML = st.svcs.length
    ? `<div class="sum-tags">${st.svcs.map(id => `<span class="sum-tag">${SVCS.find(x => x.id === id).name}</span>`).join("")}</div>`
    : '<span class="empty">Not selected</span>';

  // Staff
  const sf = STAFF.find(x => x.id === st.staff);
  $id("sStaff").innerHTML = sf
    ? sf.name
    : '<span class="empty">Not selected</span>';

  // Date
  $id("sDate").innerHTML = st.date
    ? st.date.toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "long", year: "numeric" })
    : '<span class="empty">Not selected</span>';

  // Time
  $id("sTime").innerHTML = st.time
    ? st.time
    : '<span class="empty">Not selected</span>';

  // Duration
  const mins = st.svcs.reduce((a, id) => a + (SVCS.find(x => x.id === id)?.dur || 0), 0);
  if (mins) {
    const h = Math.floor(mins / 60), m = mins % 60;
    $id("sDur").textContent = h ? `${h}h${m ? " " + m + "min" : ""}` : m + " min";
  } else {
    $id("sDur").innerHTML = '<span class="empty">—</span>';
  }

  // Total
  const rawTotal   = getRawTotal();
  const finalTotal = getFinalTotal();
  $id("sTotal").textContent = `${finalTotal} JD`;

  const origEl = $id("sTotalOriginal");
  if (origEl) {
    const showOrig = appliedPromo && finalTotal !== rawTotal;
    origEl.textContent = showOrig ? `${rawTotal} JD` : "";
    origEl.style.display = showOrig ? "block" : "none";
  }
}

function syncName() {
  const fn   = $id("fFN")?.value.trim() || "";
  const ln   = $id("fLN")?.value.trim() || "";
  const full = (fn + " " + ln).trim();
  $id("sClient").innerHTML = full
    ? full
    : '<span class="empty">Not entered</span>';
}

/* ─── CANCELLATION NOTICE ─────────────────────────────────── */
function updCancel() {
  if (!st.date || !st.time) return;
  const appt = new Date(st.date);
  const [h, m] = st.time.split(":").map(Number);
  appt.setHours(h, m);
  const dl = new Date(appt);
  dl.setDate(dl.getDate() - 3);
  $id("cPill").textContent = `Cancel before ${dl.toLocaleDateString("en-GB", { day: "numeric", month: "short" })}`;
  $id("cNote").innerHTML =
    `Please cancel or reschedule before <strong>` +
    `${dl.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit", hour12: false })} ` +
    `on ${dl.toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long" })}` +
    `</strong> to avoid a late-cancellation charge. ` +
    `<a onclick="document.getElementById('policyModal').classList.add('show')" style="cursor:pointer;">See full policy →</a>`;
}

/* ─── FORM VALIDATION ─────────────────────────────────────── */
function formatPhone(el) {
  let v = el.value.replace(/\D/g, "");
  if (v.startsWith("0")) v = "962" + v.slice(1);
  if (!v.startsWith("962")) v = "962" + v;
  const local = v.slice(3, 12);
  const p1 = local.slice(0, 2);
  const p2 = local.slice(2, 5);
  const p3 = local.slice(5, 9);
  let fmt = "+962";
  if (p1) fmt += " " + p1;
  if (p2) fmt += " " + p2;
  if (p3) fmt += " " + p3;
  el.value = fmt;
  clearErr("fPh", "fPh-e");
}

function validateEmail(el) {
  clearErr("fEm", "fEm-e");
  const v = el.value.trim();
  if (v && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) {
    el.classList.add("err");
    $id("fEm-e").textContent  = "Enter a valid email address";
    $id("fEm-e").style.display = "block";
  }
}

function clearErr(inputId, errId) {
  $id(inputId)?.classList.remove("err");
  const e = $id(errId);
  if (e) e.style.display = "none";
}

function shakeErr(inputId, errId) {
  const el  = $id(inputId);
  const err = $id(errId);
  if (!el) return;
  el.classList.add("err");
  if (err) err.style.display = "block";
  el.style.animation = "shake 0.35s ease";
  setTimeout(() => (el.style.animation = ""), 400);
}

/* ─── CONFIRM & SUBMIT ────────────────────────────────────── */
function doConfirm() {
  const fields = [["fFN","fFN-e"],["fLN","fLN-e"],["fPh","fPh-e"],["fEm","fEm-e"]];
  let hasErr = false;
  fields.forEach(([id, eid]) => {
    if (!$id(id)?.value.trim()) { shakeErr(id, eid); hasErr = true; }
  });

  const phVal = $id("fPh")?.value.replace(/\D/g, "");
  if (phVal && phVal.length !== 12) {
    shakeErr("fPh", "fPh-e");
    $id("fPh-e").textContent = "Enter a valid 9-digit Jordanian number";
    hasErr = true;
  }

  const emVal = $id("fEm")?.value.trim();
  if (emVal && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emVal)) {
    shakeErr("fEm", "fEm-e");
    $id("fEm-e").textContent = "Enter a valid email address";
    hasErr = true;
  }
  if (hasErr) return;

  const fn  = $id("fFN").value.trim();
  const ph  = $id("fPh").value.trim();
  const ref = "FB-" + Math.random().toString(36).toUpperCase().slice(2, 8);
  const sf  = STAFF.find(x => x.id === st.staff);

  // Show confirmation screen
  ["s1","s2","s3","s4"].forEach(id => $id(id).classList.remove("active"));
  $id("rail").style.opacity      = ".2";
  $id("rail").style.pointerEvents = "none";
  document.querySelector(".aside").style.display = "none";
  document.querySelector(".wrap").style.gridTemplateColumns = "1fr";
  Object.assign($id("confirmScr").style, { maxWidth: "860px", margin: "0 auto", width: "100%" });
  $id("confirmScr").classList.add("show");

  // Fill confirmation details
  $id("cSub").innerHTML =
    `<strong>${st.date?.toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}</strong>` +
    ` at <strong>${st.time || wlSel || "—"}</strong>` +
    `<br>with <strong>${sf?.name}</strong> · ${_shop.name}, ${_shop.location}`;

  $id("cGridSvc").textContent = st.svcs.map(id => SVCS.find(x => x.id === id)?.name).join(", ") || "—";
  $id("cGridPay").innerHTML   =
    `Cash on Arrival<span style="display:block;font-size:11px;font-weight:400;color:#9896b8;margin-top:4px;letter-spacing:0.03em;font-family:'Jost',sans-serif;">All payments are cash only</span>`;

  const rawT   = getRawTotal();
  const finalT = getFinalTotal();
  $id("cGridTotal").innerHTML = (appliedPromo && finalT !== rawT)
    ? `<span style="text-decoration:line-through;color:#9896b8;font-size:14px;margin-right:6px">${rawT} JD</span>${finalT} JD`
    : `${finalT} JD`;

  // Persist booking
  const emVal2 = $id("fEm")?.value.trim().toLowerCase() || null;
  let _userEmail = null;
  try {
    const _ud = JSON.parse(localStorage.getItem("userData") || sessionStorage.getItem("userData"));
    if (_ud?.email) _userEmail = _ud.email.toLowerCase();
  } catch (e) {}

  const bookings = lsJson("barberlink_bookings", []);
  bookings.push({
    ref,
    shop:          _shop.name,
    staff:         sf?.name,
    date:          st.date?.toISOString(),
    time:          st.time,
    svcs:          st.svcs.map(id => SVCS.find(x => x.id === id)?.name),
    payment:       st.payment,
    client:        fn,
    phone:         ph,
    email:         emVal2,
    userEmail:     _userEmail || emVal2,
    note:          $id("fNt")?.value,
    total:         getFinalTotal(),
    originalTotal: getRawTotal(),
    promoCode:     appliedPromo ? $id("fPromo")?.value.trim().toUpperCase() : null,
    at:            new Date().toISOString(),
  });
  localStorage.setItem("barberlink_bookings", JSON.stringify(bookings));

  // Increment admin promo use count
  if (appliedPromo?._adminPromo) {
    const promos = lsJson("barberlink_promos", []);
    const idx = promos.findIndex(p => p.code === $id("fPromo")?.value.trim().toUpperCase());
    if (idx !== -1) {
      promos[idx].usedCount = (promos[idx].usedCount || 0) + 1;
      localStorage.setItem("barberlink_promos", JSON.stringify(promos));
    }
  }

  // Send confirmation email
  if (emVal2) {
    const mins = st.svcs.reduce((a, id) => a + (SVCS.find(x => x.id === id)?.dur || 0), 0);
    const h = Math.floor(mins / 60), m = mins % 60;
    emailjs.send("service_w2j1m8g", "template_xlswjos", {
      to_email:         emVal2,
      client_name:      fn,
      shop_name:        _shop.name,
      barber_name:      sf?.name || "—",
      appointment_date: st.date?.toLocaleDateString("en-GB", { weekday:"long", day:"numeric", month:"long", year:"numeric" }),
      appointment_time: st.time || wlSel || "—",
      duration:         h ? `${h}h${m ? " "+m+"min" : ""}` : m + " min",
      services:         st.svcs.map(id => SVCS.find(x => x.id === id)?.name).join(", ") || "—",
      total:            getFinalTotal(),
    })
    .then(() => console.log("Confirmation email sent."))
    .catch(err => console.warn("Email failed:", err));
  }

  window.scrollTo({ top: 0, behavior: "smooth" });
}

/* ─── MODAL ───────────────────────────────────────────────── */
function closePolicyModal(e) {
  if (e.target === $id("policyModal"))
    $id("policyModal").classList.remove("show");
}

/* ─── LIVE SYNC WITH ADMIN ────────────────────────────────── */
const WATCHED_KEYS = [
  "barberlink_bookings","barberlink_blocked","barberlink_shop_hours",
  "barberlink_shop_days","barberlink_barbers","barberlink_promos",
];

window.addEventListener("storage", e => {
  if (!WATCHED_KEYS.includes(e.key)) return;
  renderCal();
  if (st.date) renderTimes();
});

// Fallback polling (same-tab admin changes don't fire storage event)
setInterval(() => {
  renderCal();
  if (st.date) renderTimes();
}, 1000);