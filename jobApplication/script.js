// ─── State ────────────────────────────────────────────────────────────────────
let uploadedFile = null;

// ─── Navigation ───────────────────────────────────────────────────────────────

function switchTab(tabName) {
  document.querySelectorAll(".content-section").forEach(s => s.classList.remove("active"));
  document.querySelectorAll(".nav-item").forEach(item => {
    item.classList.toggle("active", item.textContent.toLowerCase().includes(tabName));
  });

  document.getElementById(tabName).classList.add("active");
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function goBack() {
  window.location.href = "../jobsPage/index.html";
}

// ─── File Upload ───────────────────────────────────────────────────────────────

function handleFileUpload(event, textElementId = "uploadText", isPhoto = true) {
  const file = event.target.files[0];
  if (!file) return;

  if (isPhoto) uploadedFile = file;

  document.getElementById(textElementId).innerHTML =
    `<span style="color:#4caf50;">✓ ${file.name}</span>`;
}

function clearUpload(inputId, textElementId, shouldClearUploadedFile = false) {
  const input = document.getElementById(inputId);
  const text  = document.getElementById(textElementId);
  if (!input || !text) return;

  input.value = "";
  if (shouldClearUploadedFile) uploadedFile = null;
  text.innerHTML = '<span class="upload-link">Upload a file</span> or drag and drop here';
}

function clearPhoto()  { clearUpload("photoInput",  "uploadText",  true);  }
function clearResume() { clearUpload("resumeInput", "resumeText",  false); }

// ─── Form Clearing ────────────────────────────────────────────────────────────

function clearFormFields(ids) {
  ids.forEach(id => {
    const el = document.getElementById(id);
    if (el) el.value = "";
  });
}

function clearForm() {
  clearFormFields(["firstName","lastName","email","headline","phone","address","nationality","summary"]);
  clearPhoto();
  clearResume();
}

function clearDetails() {
  clearFormFields(["coverLetter"]);
}

// ─── Validation ───────────────────────────────────────────────────────────────

const validators = {
  email: value => ({
    valid:   /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
    message: "Please enter a valid email address",
  }),
  phone: value => ({
    valid:   value.length === 9 && /^\d{9}$/.test(value),
    message: "Phone number must be exactly 9 digits",
  }),
};

function validateField(field, errorMessage, customValidator = null) {
  const value = field.value.trim();
  if (!value) { showFieldError(field, errorMessage); return false; }

  if (customValidator) {
    const result = customValidator(value);
    if (!result.valid) { showFieldError(field, result.message); return false; }
  }

  return true;
}

function showFieldError(field, message) {
  field.style.borderColor = "#d32f2f";
  showErrorMessage(message);
  field.focus();
}

function resetFieldBorders(fields) {
  fields.forEach(f => (f.style.borderColor = "#ccc"));
}

// ─── Submit ───────────────────────────────────────────────────────────────────

function submitApplication() {
  const fields = {
    firstName:   document.getElementById("firstName"),
    lastName:    document.getElementById("lastName"),
    email:       document.getElementById("email"),
    phone:       document.getElementById("phone"),
    address:     document.getElementById("address"),
    nationality: document.getElementById("nationality"),
  };

  const photoInput  = document.getElementById("photoInput");
  const resumeInput = document.getElementById("resumeInput");

  resetFieldBorders(Object.values(fields));

  if (!validateField(fields.firstName,   "First name is required"))                          return;
  if (!validateField(fields.lastName,    "Last name is required"))                           return;
  if (!validateField(fields.email,       "Email is required",        validators.email))      return;
  if (!validateField(fields.phone,       "Phone number is required", validators.phone))      return;
  if (!validateField(fields.address,     "Address is required"))                             return;

  if (!photoInput.files?.length) {
    showErrorMessage("Photo is required");
    document.getElementById("uploadArea").scrollIntoView({ behavior: "smooth", block: "center" });
    return;
  }

  if (!validateField(fields.nationality, "Nationality is required"))                         return;

  if (!resumeInput.files?.length) {
    showErrorMessage("Resume is required");
    resumeInput.closest(".form-group").scrollIntoView({ behavior: "smooth", block: "center" });
    return;
  }

  // ── Resolve job & user context ─────────────────────────────────
  const jobId       = new URLSearchParams(window.location.search).get("job") || "barber";
  const userData    = localStorage.getItem("userData");
  const currentUser = userData ? JSON.parse(userData) : null;
  const userEmail   = currentUser ? (currentUser.email || currentUser.id || null) : null;
  const appliedKey  = userEmail ? `appliedJobs_${userEmail}` : "appliedJobs_guest";

  const appliedJobs = JSON.parse(localStorage.getItem(appliedKey) || "[]");
  if (!appliedJobs.includes(jobId)) {
    appliedJobs.push(jobId);
    localStorage.setItem(appliedKey, JSON.stringify(appliedJobs));
  }

  // ── Build application object ───────────────────────────────────
  const job = (typeof jobsData !== "undefined" && jobsData[jobId]) ? jobsData[jobId] : {};

  const appData = {
    id:          `app_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
    jobId,
    jobTitle:    job.position || jobId,
    shopName:    job.shopName || "",
    location:    job.location || "",
    submittedAt: new Date().toISOString(),
    status:      "new",
    submittedBy: userEmail || null,
    firstName:   fields.firstName.value.trim(),
    lastName:    fields.lastName.value.trim(),
    email:       fields.email.value.trim(),
    phone:       (document.getElementById("countryCode").value || "+962") + fields.phone.value.trim(),
    headline:    document.getElementById("headline").value.trim(),
    address:     fields.address.value.trim(),
    nationality: fields.nationality.value.trim(),
    summary:     document.getElementById("summary").value.trim(),
    coverLetter: document.getElementById("coverLetter").value.trim(),
    resumeName:  resumeInput.files[0]?.name  || null,
    resumeSize:  resumeInput.files[0]?.size  || null,
  };

  // ── Save with optional file data ───────────────────────────────
  function saveApplication(photoData, resumeData) {
    appData.photo  = photoData || null;
    appData.resume = resumeData
      ? { name: appData.resumeName, size: appData.resumeSize, data: resumeData }
      : null;

    try {
      const existing = JSON.parse(localStorage.getItem("barberlink_job_applications") || "[]");
      existing.unshift(appData);
      localStorage.setItem("barberlink_job_applications", JSON.stringify(existing));
    } catch {
      // Quota exceeded — retry without binary data
      try {
        appData.photo  = null;
        appData.resume = appData.resume ? { name: appData.resume.name, size: appData.resume.size } : null;
        const existing = JSON.parse(localStorage.getItem("barberlink_job_applications") || "[]");
        existing.unshift(appData);
        localStorage.setItem("barberlink_job_applications", JSON.stringify(existing));
      } catch (e) {
        console.error("Failed to save application:", e);
      }
    }

    clearForm();
    clearDetails();
    showSuccessMessage();
  }

  // ── Read files asynchronously ──────────────────────────────────
  let photoData = null, resumeData = null, pending = 0;

  function checkAndSave() {
    if (--pending === 0) saveApplication(photoData, resumeData);
  }

  if (photoInput.files[0]) {
    pending++;
    const img       = new Image();
    const objectUrl = URL.createObjectURL(photoInput.files[0]);

    img.onload = () => {
      const canvas  = document.createElement("canvas");
      const maxSize = 300;
      let [w, h]    = [img.width, img.height];

      if (w > h) { if (w > maxSize) { h = h * maxSize / w; w = maxSize; } }
      else        { if (h > maxSize) { w = w * maxSize / h; h = maxSize; } }

      canvas.width  = w;
      canvas.height = h;
      canvas.getContext("2d").drawImage(img, 0, 0, w, h);
      photoData = canvas.toDataURL("image/jpeg", 0.7);
      URL.revokeObjectURL(objectUrl);
      checkAndSave();
    };
    img.onerror = () => { URL.revokeObjectURL(objectUrl); checkAndSave(); };
    img.src     = objectUrl;
  }

  if (resumeInput.files[0]) {
    pending++;
    const reader    = new FileReader();
    reader.onload   = e => { resumeData = e.target.result; checkAndSave(); };
    reader.onerror  = ()  => { checkAndSave(); };
    reader.readAsDataURL(resumeInput.files[0]);
  }

  if (pending === 0) saveApplication(null, null);
}

// ─── Messages ─────────────────────────────────────────────────────────────────

function showMessage(type, icon, title = null, description = null) {
  document.querySelector(`.${type}-message`)?.remove();

  const div = document.createElement("div");
  div.className = `${type}-message`;

  div.innerHTML = type === "error"
    ? `<div class="${type}-content"><div class="${type}-icon">${icon}</div><p>${title}</p></div>`
    : `<div class="${type}-content">
         <div class="${type}-icon">${icon}</div>
         ${title       ? `<h3>${title}</h3>`       : ""}
         ${description ? `<p>${description}</p>`   : ""}
       </div>`;

  document.body.appendChild(div);

  const duration = type === "success" ? 5000 : 4000;
  setTimeout(() => {
    div.classList.add("fade-out");
    setTimeout(() => div.parentNode?.removeChild(div), 500);
  }, duration);
}

function showErrorMessage(message) {
  showMessage("error", "!", message);
}

function showSuccessMessage() {
  showMessage(
    "success",
    "✓",
    "Application Submitted Successfully!",
    "Thank you for applying. We'll review your application and get back to you soon."
  );
  window.scrollTo({ top: 0, behavior: "smooth" });
}

// ─── Data Loading ─────────────────────────────────────────────────────────────

function loadJobData() {
  const jobId = new URLSearchParams(window.location.search).get("job") || "barber";
  const job   = jobsData[jobId];
  if (!job) { console.error("Job not found:", jobId); return; }

  document.querySelector(".header h1").textContent        = job.title;
  document.querySelector(".header h2").textContent        = job.shopName;
  document.querySelector(".header p").innerHTML           = `${job.position}<br>${job.location}`;
  document.querySelector(".section-text").textContent     = job.description;

  const lists = document.querySelectorAll(".section-list");
  const toItems = arr => arr.map(item => `<li>${item}</li>`).join("");
  lists[0].innerHTML = toItems(job.responsibilities);
  lists[1].innerHTML = toItems(job.qualifications);
  lists[2].innerHTML = toItems(job.offers);
}

// ─── Map Picker ───────────────────────────────────────────────────────────────

function openMapPicker() {
  document.querySelector(".map-instruction")?.remove();

  const div = document.createElement("div");
  div.className = "map-instruction";
  div.innerHTML = `
    <div style="position:fixed;top:20px;left:50%;transform:translateX(-50%);z-index:1000;
                background:#191265;color:white;padding:15px 25px;border-radius:8px;
                box-shadow:0 4px 20px rgba(0,0,0,.3);max-width:400px;text-align:center;">
      <p style="margin:0;font-family:'Zilla Slab',serif;font-size:16px;">
        📍 Find your location on Google Maps, right-click on it, select "Copy address",
        then paste it in the address field
      </p>
      <button onclick="openGoogleMapsAndClose()"
              style="margin-top:10px;padding:5px 15px;background:white;color:#191265;
                     border:none;border-radius:4px;cursor:pointer;font-family:'Zilla Slab',serif;">
        Got it
      </button>
    </div>`;

  document.body.appendChild(div);
  setTimeout(() => div.parentNode && div.remove(), 15000);
}

function openGoogleMapsAndClose() {
  window.open("https://www.google.com/maps/search/?api=1", "_blank", "width=800,height=600");
  document.querySelector(".map-instruction")?.remove();
}

// ─── Google Maps Autocomplete ─────────────────────────────────────────────────

function initAutocomplete() {
  const addressInput = document.getElementById("address");
  if (!addressInput || !window.google?.maps) return;

  const autocomplete = new google.maps.places.Autocomplete(addressInput, {
    types:                ["address"],
    componentRestrictions: { country: "jo" },
  });

  autocomplete.addListener("place_changed", () => {
    const place = autocomplete.getPlace();
    if (place.formatted_address) addressInput.value = place.formatted_address;
  });
}

// ─── Init ─────────────────────────────────────────────────────────────────────

window.addEventListener("DOMContentLoaded", () => {
  loadJobData();
  if (window.google?.maps) initAutocomplete();
});