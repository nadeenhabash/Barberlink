// =============================================
// Utility Functions
// =============================================

function sanitizeInput(str) {
  return str.replace(/[<>]/g, "");
}

function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function validatePhone(phone) {
  return /^[0-9]{9}$/.test(phone);
}

function showError(groupId, errorId, message) {
  const group = document.getElementById(groupId);
  const errorEl = document.getElementById(errorId);
  group.classList.add("error");
  if (message) errorEl.textContent = message;
}

function clearError(groupId) {
  document.getElementById(groupId).classList.remove("error");
}

function formatFileSize(bytes) {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
}

// =============================================
// Application Status Config
// =============================================

const STATUS_CONFIG = {
  pending: {
    badge:    "Under Review",
    dotCls:   "dot-pending",
    tabDot:   "tab-dot-pending",
    title:    "Application Received",
    subtitle: "We're reviewing your submission",
    message:  "Your application is currently being reviewed by our team. This usually takes 2–5 business days. We'll be in touch via email once a decision has been made.",
    iconSvg:  `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#c8960a" stroke-width="1.8"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>`,
  },
  approved: {
    badge:    "Approved",
    dotCls:   "dot-approved",
    tabDot:   "tab-dot-approved",
    title:    "Welcome to BarberLink",
    subtitle: "Your application has been approved",
    message:  "Congratulations! Your partnership application has been approved. Our onboarding team will contact you shortly with next steps to get your barbershop live on the platform.",
    iconSvg:  `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#0a8a50" stroke-width="1.8"><circle cx="12" cy="12" r="10"/><polyline points="9 12 11 14 15 10"/></svg>`,
  },
  rejected: {
    badge:    "Not Approved",
    dotCls:   "dot-rejected",
    tabDot:   "tab-dot-rejected",
    title:    "Application Unsuccessful",
    subtitle: "We were unable to approve your application",
    message:  "Unfortunately, your application does not meet our current partner requirements. This may be due to licensing, business type eligibility, or capacity in your area. You are welcome to reapply in the future.",
    iconSvg:  `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#c82a2a" stroke-width="1.8"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>`,
  },
};

let activeTabIndex = 0;
let uploadedFile = null;

// =============================================
// Application Status UI
// =============================================

function buildApplicationCard(partner) {
  const status = partner.status || "pending";
  const cfg = STATUS_CONFIG[status] || STATUS_CONFIG.pending;
  const date = partner.date
    ? new Date(partner.date).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })
    : "—";

  return `
    <div class="adc adc-${status}">
      <div class="adc-header">
        <div class="adc-icon">${cfg.iconSvg}</div>
        <div>
          <div class="adc-title">${cfg.title}</div>
          <div class="adc-subtitle">${cfg.subtitle}</div>
        </div>
      </div>
      <div class="adc-badge">
        <div class="adc-badge-dot"></div>
        ${cfg.badge}
      </div>
      <div class="adc-fields">
        <div>
          <div class="adc-field-lbl">Brand Name</div>
          <div class="adc-field-val">${partner.brandName || "—"}</div>
        </div>
        <div>
          <div class="adc-field-lbl">Submitted</div>
          <div class="adc-field-val">${date}</div>
        </div>
      </div>
      <div class="adc-msg">${cfg.message}</div>
    </div>`;
}

function renderDropdown(partners, tabIndex) {
  const dropdown = document.getElementById("applDropdown");
  if (!dropdown) return;

  if (partners.length === 0) {
    dropdown.innerHTML = "";
    return;
  }

  if (partners.length === 1) {
    dropdown.classList.remove("has-tabs");
    dropdown.innerHTML = buildApplicationCard(partners[0]);
    return;
  }

  dropdown.classList.add("has-tabs");
  const idx = Math.min(tabIndex, partners.length - 1);

  const tabsHtml = `
    <div class="appl-tabs">
      ${partners.map((p, i) => {
        const s = p.status || "pending";
        const cfg = STATUS_CONFIG[s] || STATUS_CONFIG.pending;
        const rawLabel = p.brandName || "Shop " + (i + 1);
        const label = rawLabel.length > 14 ? rawLabel.slice(0, 13) + "…" : rawLabel;
        return `<button class="appl-tab${i === idx ? " active" : ""}" onclick="event.stopPropagation(); switchTab(${i})">
          <span class="appl-tab-dot ${cfg.tabDot}"></span>${label}
        </button>`;
      }).join("")}
    </div>`;

  dropdown.innerHTML = tabsHtml + buildApplicationCard(partners[idx]);
}

function getUserPartners() {
  const rawUser = localStorage.getItem("userData");
  if (!rawUser) return null;
  const currentUser = JSON.parse(rawUser);
  const currentEmail = currentUser.email || currentUser.id || null;
  let partners = [];
  try { partners = JSON.parse(localStorage.getItem("barberlink_partners") || "[]"); } catch (e) {}
  return partners.filter(p => p.submittedBy && p.submittedBy === currentEmail);
}

function updateStatusUI() {
  const btn = document.getElementById("applStatusBtn");
  const dot = document.getElementById("applStatusDot");
  if (!btn) return;

  const partners = getUserPartners();
  if (!partners || partners.length === 0) {
    btn.style.display = "none";
    return;
  }

  btn.style.display = "flex";
  const latestStatus = partners[0].status || "pending";
  dot.className = "appl-status-dot " + (STATUS_CONFIG[latestStatus] || STATUS_CONFIG.pending).dotCls;
  renderDropdown(partners, activeTabIndex);
}

function switchTab(index) {
  activeTabIndex = index;
  const partners = getUserPartners() || [];
  renderDropdown(partners, activeTabIndex);
}

function toggleStatusDropdown() {
  document.getElementById("applDropdown")?.classList.toggle("open");
}

function showStatusCard() {
  if (!localStorage.getItem("userData")) return;
  activeTabIndex = 0;
  updateStatusUI();
  document.getElementById("applDropdown")?.classList.add("open");
}

// =============================================
// Navigation
// =============================================

function scrollToQuestions() {
  document.getElementById("questionsSection").scrollIntoView({ behavior: "smooth" });
}

function toggleFaq(element) {
  const faqItem = element.parentElement;
  const wasActive = faqItem.classList.contains("active");
  document.querySelectorAll(".faq-item").forEach(item => item.classList.remove("active"));
  if (!wasActive) faqItem.classList.add("active");
}

// =============================================
// File Upload
// =============================================

function handleFileUpload(file) {
  const validTypes = ["application/pdf", "image/jpeg", "image/jpg", "image/png"];
  if (!validTypes.includes(file.type)) {
    showError("fileUploadSection", "fileError", "Please upload a PDF, JPG, or PNG file");
    return;
  }
  if (file.size > 5 * 1024 * 1024) {
    showError("fileUploadSection", "fileError", "File size must be less than 5MB");
    return;
  }

  uploadedFile = file;
  document.getElementById("fileName").textContent = file.name;
  document.getElementById("fileSize").textContent = formatFileSize(file.size);
  document.getElementById("uploadPlaceholder").style.display = "none";
  document.getElementById("filePreview").style.display = "flex";
  document.getElementById("fileUploadSection").classList.remove("error");
}

function resetFileUpload() {
  uploadedFile = null;
  document.getElementById("licenseFile").value = "";
  document.getElementById("uploadPlaceholder").style.display = "flex";
  document.getElementById("filePreview").style.display = "none";
  document.getElementById("fileUploadSection").classList.remove("error");
}

// =============================================
// DOMContentLoaded — Wire Up All Event Listeners
// =============================================

document.addEventListener("DOMContentLoaded", function () {

  // ── Navigation ──
  document.getElementById("questionsLink").addEventListener("click", scrollToQuestions);

  document.querySelectorAll(".faq-question").forEach(q => {
    q.addEventListener("click", function () { toggleFaq(this); });
  });

  document.getElementById("backToTopBtn").addEventListener("click", function () {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  // ── Intersection Observer (scroll animations) ──
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) entry.target.classList.add("fade-in");
    });
  }, { threshold: 0.1, rootMargin: "0px 0px -50px 0px" });

  document.querySelectorAll(".benefit-card, .faq-item").forEach(el => observer.observe(el));
  const divider = document.querySelector(".section-divider");
  if (divider) observer.observe(divider);

  // ── Status dropdown: close on outside click ──
  document.addEventListener("click", function (e) {
    const btn      = document.getElementById("applStatusBtn");
    const dropdown = document.getElementById("applDropdown");
    if (!dropdown || !btn) return;
    if (!btn.contains(e.target) && !dropdown.contains(e.target)) {
      dropdown.classList.remove("open");
    }
  });

  // ── Custom Select ──
  const customSelect  = document.getElementById("businessTypeSelect");
  const trigger       = customSelect.querySelector(".custom-select-trigger");
  const selectOptions = customSelect.querySelectorAll(".custom-select-option");
  const hiddenSelect  = document.getElementById("businessType");
  const displayText   = document.getElementById("businessTypeText");

  trigger.addEventListener("click", function (e) {
    e.stopPropagation();
    customSelect.classList.toggle("active");
  });

  selectOptions.forEach(option => {
    option.addEventListener("click", function () {
      hiddenSelect.value = this.getAttribute("data-value");
      displayText.textContent = this.textContent;
      trigger.classList.remove("placeholder");
      selectOptions.forEach(opt => opt.classList.remove("selected"));
      this.classList.add("selected");
      customSelect.classList.remove("active");
      clearError("businessTypeGroup");
    });
  });

  document.addEventListener("click", function (e) {
    if (!customSelect.contains(e.target)) customSelect.classList.remove("active");
  });

  // ── License Radio Buttons ──
  const licenseYes       = document.getElementById("licenseYes");
  const licenseNo        = document.getElementById("licenseNo");
  const fileUploadSection = document.getElementById("fileUploadSection");
  const licenseNotice    = document.getElementById("licenseNotice");

  licenseYes.addEventListener("change", function () {
    if (this.checked) {
      fileUploadSection.style.display = "block";
      licenseNotice.style.display = "none";
      clearError("licenseGroup");
    }
  });

  licenseNo.addEventListener("change", function () {
    if (this.checked) {
      fileUploadSection.style.display = "none";
      licenseNotice.style.display = "flex";
      uploadedFile = null;
      resetFileUpload();
      clearError("licenseGroup");
    }
  });

  // ── File Upload Area ──
  const fileInput       = document.getElementById("licenseFile");
  const fileUploadArea  = document.getElementById("fileUploadArea");
  const uploadPlaceholder = document.getElementById("uploadPlaceholder");

  uploadPlaceholder.addEventListener("click", () => fileInput.click());

  fileUploadArea.addEventListener("dragover", function (e) {
    e.preventDefault();
    this.classList.add("drag-over");
  });
  fileUploadArea.addEventListener("dragleave", function () {
    this.classList.remove("drag-over");
  });
  fileUploadArea.addEventListener("drop", function (e) {
    e.preventDefault();
    this.classList.remove("drag-over");
    if (e.dataTransfer.files.length > 0) handleFileUpload(e.dataTransfer.files[0]);
  });

  fileInput.addEventListener("change", function () {
    if (this.files.length > 0) handleFileUpload(this.files[0]);
  });

  document.getElementById("removeFileBtn").addEventListener("click", function (e) {
    e.stopPropagation();
    resetFileUpload();
  });

  // ── Clear errors on input ──
  document.querySelectorAll("input, select").forEach(field => {
    field.addEventListener("input", function () {
      const group = this.closest(".form-group");
      if (group) clearError(group.id);
    });
  });

  document.querySelectorAll('input[name="license"]').forEach(radio => {
    radio.addEventListener("change", () => clearError("licenseGroup"));
  });

  // ── Phone: digits only ──
  document.getElementById("mobile").addEventListener("input", function () {
    this.value = this.value.replace(/[^0-9]/g, "");
  });

  // ── Form Submission ──
  const form           = document.getElementById("registrationForm");
  const successMessage = document.getElementById("successMessage");
  const errorAlert     = document.getElementById("errorAlert");

  form.addEventListener("submit", function (event) {
    event.preventDefault();

    successMessage.classList.remove("show");
    errorAlert.classList.remove("show");
    document.querySelectorAll(".form-group").forEach(g => g.classList.remove("error"));

    let isValid = true;
    let firstErrorField = null;

    const brandName    = sanitizeInput(document.getElementById("brandName").value.trim());
    const firstName    = sanitizeInput(document.getElementById("firstName").value.trim());
    const lastName     = sanitizeInput(document.getElementById("lastName").value.trim());
    const businessType = document.getElementById("businessType").value;
    const email        = document.getElementById("email").value.trim();
    const mobile       = document.getElementById("mobile").value.trim();
    const license      = document.querySelector('input[name="license"]:checked');

    function flagError(groupId, errorId, message, fieldId) {
      showError(groupId, errorId, message);
      if (!firstErrorField) firstErrorField = document.getElementById(fieldId);
      isValid = false;
    }

    if (!brandName)    flagError("brandNameGroup",    "brandNameError",    "Please fill in the Brand Name field",  "brandName");
    if (!firstName)    flagError("firstNameGroup",    "firstNameError",    "Please fill in the First Name field",  "firstName");
    if (!lastName)     flagError("lastNameGroup",     "lastNameError",     "Please fill in the Last Name field",   "lastName");
    if (!businessType) flagError("businessTypeGroup", "businessTypeError", "Please select a Business Type",        "businessTypeSelect");

    if (!email) {
      flagError("emailGroup", "emailError", "Please fill in the Email field", "email");
    } else if (!validateEmail(email)) {
      flagError("emailGroup", "emailError", "Please enter a valid email address (e.g., name@example.com)", "email");
    }

    if (!mobile) {
      flagError("mobileGroup", "mobileError", "Please fill in the Mobile Number field", "mobile");
    } else if (!validatePhone(mobile)) {
      flagError("mobileGroup", "mobileError", "Please enter a valid 9-digit mobile number (e.g., 791234567)", "mobile");
    }

    if (!license) {
      showError("licenseGroup", "licenseError", "Please select whether you have a commercial license");
      isValid = false;
    } else if (license.value === "no") {
      showError("licenseGroup", "licenseError", "A commercial license is required to register");
      licenseNotice.style.display = "flex";
      isValid = false;
    } else if (license.value === "yes" && !uploadedFile) {
      showError("fileUploadSection", "fileError", "Please upload your commercial license");
      isValid = false;
    }

    if (!isValid) {
      if (firstErrorField) firstErrorField.focus();
      return;
    }

    // ── Save to localStorage ──
    const userData    = localStorage.getItem("userData");
    const currentUser = userData ? JSON.parse(userData) : null;
    const submittedBy = currentUser ? (currentUser.email || currentUser.id || null) : null;

    function savePartnerData(fileData) {
      const partnerData = {
        id:          "partner_" + Date.now() + "_" + Math.random().toString(36).substr(2, 9),
        brandName,
        firstName,
        lastName,
        businessType,
        email,
        mobile,
        hasLicense:  license.value,
        licenseFile: fileData,
        isLoggedIn:  !!userData,
        submittedBy,
        status:      "pending",
        date:        new Date().toISOString(),
      };

      const partners = JSON.parse(localStorage.getItem("barberlink_partners") || "[]");
      partners.unshift(partnerData);
      localStorage.setItem("barberlink_partners", JSON.stringify(partners));

      console.log("Partner saved:", partnerData.id);
      console.log("License file:", fileData ? "YES - " + fileData.name : "NO");

      successMessage.classList.add("show");

      // Reset form
      form.reset();
      displayText.textContent = "Business type *";
      trigger.classList.add("placeholder");
      selectOptions.forEach(opt => opt.classList.remove("selected"));
      resetFileUpload();
      fileUploadSection.style.display = "none";
      licenseNotice.style.display = "none";

      showStatusCard();
      setTimeout(() => successMessage.classList.remove("show"), 5000);
      form.scrollIntoView({ behavior: "smooth", block: "start" });
    }

    if (uploadedFile) {
      const reader = new FileReader();
      reader.onload  = e => savePartnerData({ name: uploadedFile.name, size: uploadedFile.size, type: uploadedFile.type, data: e.target.result });
      reader.onerror = () => savePartnerData(null);
      reader.readAsDataURL(uploadedFile);
    } else {
      savePartnerData(null);
    }
  });

  // ── Init status icon on load ──
  updateStatusUI();
});