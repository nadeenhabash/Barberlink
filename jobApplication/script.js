let uploadedFile = null;

function switchTab(tabName) {
  const sections = document.querySelectorAll(".content-section");
  const navItems = document.querySelectorAll(".nav-item");

  sections.forEach((section) => section.classList.remove("active"));
  navItems.forEach((item) => item.classList.remove("active"));

  document.getElementById(tabName).classList.add("active");

  navItems.forEach((item) => {
    if (item.textContent.toLowerCase().includes(tabName)) {
      item.classList.add("active");
    }
  });

  window.scrollTo({ top: 0, behavior: "smooth" });
}

function goBack() {
  window.location.href = "../jobsPage/index.html";
}

// Unified file upload handler
function handleFileUpload(event, textElementId = "uploadText", isPhoto = true) {
  const file = event.target.files[0];
  if (file) {
    if (isPhoto) {
      uploadedFile = file;
    }
    const uploadText = document.getElementById(textElementId);
    uploadText.innerHTML = `<span style="color: #4caf50;">✓ ${file.name}</span>`;
  }
}

function handleResumeUpload(event) {
  handleFileUpload(event, "resumeText", false);
}

// Unified clear upload handler
function clearUpload(inputId, textElementId, shouldClearUploadedFile = false) {
  const input = document.getElementById(inputId);
  const text = document.getElementById(textElementId);

  if (input && text) {
    input.value = "";
    if (shouldClearUploadedFile) {
      uploadedFile = null;
    }
    text.innerHTML =
      '<span class="upload-link">Upload a file</span> or drag and drop here';
  }
}

function clearPhoto() {
  clearUpload("photoInput", "uploadText", true);
}

function clearResume() {
  clearUpload("resumeInput", "resumeText", false);
}

// Unified clear form fields
function clearFormFields(fieldIds) {
  fieldIds.forEach((id) => {
    const field = document.getElementById(id);
    if (field) {
      field.value = "";
    }
  });
}

function clearForm() {
  clearFormFields([
    "firstName",
    "lastName",
    "email",
    "headline",
    "phone",
    "address",
    "nationality",
    "summary",
  ]);
  clearPhoto();
  clearResume();
}

function clearDetails() {
  clearFormFields(["coverLetter"]);
}

// Unified field validation
function validateField(field, errorMessage, customValidator = null) {
  const value = field.value.trim();

  if (!value) {
    showFieldError(field, errorMessage);
    return false;
  }

  if (customValidator) {
    const result = customValidator(value);
    if (!result.valid) {
      showFieldError(field, result.message);
      return false;
    }
  }

  return true;
}

// Show field error
function showFieldError(field, message) {
  field.style.borderColor = "#d32f2f";
  showErrorMessage(message);
  field.focus();
}

// Reset all field borders
function resetFieldBorders(fields) {
  fields.forEach((field) => {
    field.style.borderColor = "#ccc";
  });
}

// Custom validators
const validators = {
  email: (value) => ({
    valid: /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
    message: "Please enter a valid email address",
  }),
  phone: (value) => ({
    valid: value.length === 9 && /^\d{9}$/.test(value),
    message: "Phone number must be exactly 9 digits",
  }),
};

function submitApplication() {
  const firstName = document.getElementById("firstName");
  const lastName = document.getElementById("lastName");
  const email = document.getElementById("email");
  const phone = document.getElementById("phone");
  const address = document.getElementById("address");
  const photoInput = document.getElementById("photoInput");
  const nationality = document.getElementById("nationality");
  const resumeInput = document.getElementById("resumeInput");

  const fields = [firstName, lastName, email, phone, address, nationality];

  // Reset all border colors
  resetFieldBorders(fields);

  // Validate all fields
  if (!validateField(firstName, "First name is required")) return;
  if (!validateField(lastName, "Last name is required")) return;
  if (!validateField(email, "Email is required", validators.email)) return;
  if (!validateField(phone, "Phone number is required", validators.phone))
    return;
  if (!validateField(address, "Address is required")) return;

  // Check Photo
  if (!photoInput.files || photoInput.files.length === 0) {
    showErrorMessage("Photo is required");
    document
      .getElementById("uploadArea")
      .scrollIntoView({ behavior: "smooth", block: "center" });
    return;
  }

  if (!validateField(nationality, "Nationality is required")) return;

  // Check Resume
  if (!resumeInput.files || resumeInput.files.length === 0) {
    showErrorMessage("Resume is required");
    document
      .querySelector("#resumeInput")
      .closest(".upload-area")
      .scrollIntoView({ behavior: "smooth", block: "center" });
    return;
  }

  // Save application status
  const urlParams = new URLSearchParams(window.location.search);
  const jobId = urlParams.get("job") || "barber";

  let appliedJobs = JSON.parse(localStorage.getItem("appliedJobs") || "[]");
  if (!appliedJobs.includes(jobId)) {
    appliedJobs.push(jobId);
    localStorage.setItem("appliedJobs", JSON.stringify(appliedJobs));
  }

  // Clear all form fields
  clearForm();
  clearDetails();

  // Show success message
  showSuccessMessage();
}

// Unified message display
function showMessage(type, iconContent, title = null, description = null) {
  // Remove any existing message of this type
  const existingMessage = document.querySelector(`.${type}-message`);
  if (existingMessage) {
    existingMessage.remove();
  }

  const messageDiv = document.createElement("div");
  messageDiv.className = `${type}-message`;

  if (type === "error") {
    messageDiv.innerHTML = `
            <div class="${type}-content">
                <div class="${type}-icon">${iconContent}</div>
                <p>${title}</p>
            </div>
        `;
  } else {
    messageDiv.innerHTML = `
            <div class="${type}-content">
                <div class="${type}-icon">${iconContent}</div>
                ${title ? `<h3>${title}</h3>` : ""}
                ${description ? `<p>${description}</p>` : ""}
            </div>
        `;
  }

  document.body.appendChild(messageDiv);

  const duration = type === "success" ? 5000 : 4000;

  setTimeout(() => {
    messageDiv.classList.add("fade-out");
    setTimeout(() => {
      if (messageDiv.parentNode) {
        messageDiv.parentNode.removeChild(messageDiv);
      }
    }, 500);
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

function loadJobData() {
  const urlParams = new URLSearchParams(window.location.search);
  const jobId = urlParams.get("job") || "barber";
  const job = jobsData[jobId];

  if (!job) {
    console.error("Job not found");
    return;
  }

  document.querySelector(".header h1").textContent = job.title;
  document.querySelector(".header h2").textContent = job.shopName;
  document.querySelector(
    ".header p"
  ).innerHTML = `${job.position}<br>${job.location}`;
  document.querySelector(".section-text").textContent = job.description;

  const lists = document.querySelectorAll(".section-list");
  lists[0].innerHTML = job.responsibilities
    .map((item) => `<li>${item}</li>`)
    .join("");
  lists[1].innerHTML = job.qualifications
    .map((item) => `<li>${item}</li>`)
    .join("");
  lists[2].innerHTML = job.offers.map((item) => `<li>${item}</li>`).join("");
}

function initAutocomplete() {
  const addressInput = document.getElementById("address");
  if (addressInput && window.google && window.google.maps) {
    const autocomplete = new google.maps.places.Autocomplete(addressInput, {
      types: ["address"],
      componentRestrictions: { country: "jo" },
    });

    autocomplete.addListener("place_changed", function () {
      const place = autocomplete.getPlace();
      if (place.formatted_address) {
        addressInput.value = place.formatted_address;
      }
    });
  }
}

window.addEventListener("DOMContentLoaded", () => {
  loadJobData();
  if (window.google && window.google.maps) {
    initAutocomplete();
  }
});

function openMapPicker() {
  showMapInstructions();
}

function showMapInstructions() {
  const existingInstruction = document.querySelector(".map-instruction");
  if (existingInstruction) {
    existingInstruction.remove();
  }

  const instructionDiv = document.createElement("div");
  instructionDiv.className = "map-instruction";
  instructionDiv.innerHTML = `
        <div style="position: fixed; top: 20px; left: 50%; transform: translateX(-50%); z-index: 1000; background: #191265; color: white; padding: 15px 25px; border-radius: 8px; box-shadow: 0 4px 20px rgba(0,0,0,0.3); max-width: 400px; text-align: center;">
            <p style="margin: 0; font-family: 'Zilla Slab', serif; font-size: 16px;">
                📍 Find your location on Google Maps, right-click on it, select "Copy address", then paste it in the address field
            </p>
            <button onclick="openGoogleMapsAndClose()" style="margin-top: 10px; padding: 5px 15px; background: white; color: #191265; border: none; border-radius: 4px; cursor: pointer; font-family: 'Zilla Slab', serif;">
                Got it
            </button>
        </div>
    `;

  document.body.appendChild(instructionDiv);

  setTimeout(() => {
    if (instructionDiv.parentNode) {
      instructionDiv.remove();
    }
  }, 15000);
}

function openGoogleMapsAndClose() {
  window.open(
    "https://www.google.com/maps/search/?api=1",
    "_blank",
    "width=800,height=600"
  );

  const instructionDiv = document.querySelector(".map-instruction");
  if (instructionDiv) {
    instructionDiv.remove();
  }
}