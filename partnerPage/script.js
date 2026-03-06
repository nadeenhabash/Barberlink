// ===================================
// User Profile & Avatar Management
// ===================================

// Get user data from localStorage or sessionStorage
function getUserData() {
  try {
    // Check localStorage first (Remember Me checked)
    let userData = localStorage.getItem('userData');
    if (userData) {
      return JSON.parse(userData);
    }
    
    // Check sessionStorage (Remember Me not checked)
    userData = sessionStorage.getItem('userData');
    if (userData) {
      return JSON.parse(userData);
    }
    
    return null;
  } catch (error) {
    console.error('Error reading user data:', error);
    return null;
  }
}

// Display user avatar and profile
function displayUserProfile() {
  const user = getUserData();
  const userProfile = document.getElementById('userProfile');
  const loginBtnLink = document.getElementById('loginBtnLink');
  const userAvatar = document.getElementById('userAvatar');
  const profileName = document.getElementById('profileName');
  const profileEmail = document.getElementById('profileEmail');
  
  if (user && user.name) {
    // User is logged in - show avatar, hide login button
    const firstLetter = user.name.charAt(0).toUpperCase();
    
    userAvatar.textContent = firstLetter;
    profileName.textContent = user.name;
    profileEmail.textContent = user.email || '';
    
    if (userProfile) userProfile.style.display = 'block';
    if (loginBtnLink) loginBtnLink.style.display = 'none';
  } else {
    // User not logged in - show login button, hide avatar
    if (userProfile) userProfile.style.display = 'none';
    if (loginBtnLink) loginBtnLink.style.display = 'block';
  }
}

// Toggle profile dropdown
function toggleProfileDropdown() {
  const dropdown = document.getElementById('profileDropdown');
  dropdown.classList.toggle('show');
}

// Logout functionality
function logout() {
  showLogoutModal();
}

// Show custom logout modal
function showLogoutModal() {
  // Create modal overlay
  const modalOverlay = document.createElement('div');
  modalOverlay.className = 'logout-alert-overlay';
  modalOverlay.innerHTML = `
    <div class="logout-alert">
      <p>Are you sure you want to logout?</p>
      <div class="logout-alert-buttons">
        <button class="alert-cancel" onclick="closeLogoutModal()">Cancel</button>
        <button class="alert-confirm" onclick="confirmLogout()">Logout</button>
      </div>
    </div>
  `;
  
  document.body.appendChild(modalOverlay);
  
  // Add active class after a small delay for animation
  setTimeout(() => {
    modalOverlay.classList.add('active');
  }, 10);
}

// Close logout modal
function closeLogoutModal() {
  const modal = document.querySelector('.logout-alert-overlay');
  if (modal) {
    modal.classList.remove('active');
    setTimeout(() => {
      modal.remove();
    }, 300);
  }
}

// Confirm logout
function confirmLogout() {
  // Clear both localStorage and sessionStorage
  localStorage.removeItem('userData');
  localStorage.removeItem('currentUser');
  sessionStorage.removeItem('userData');
  sessionStorage.removeItem('currentUser');
  window.location.reload();
}

// ===================================
// Profile Settings Modal Functions
// ===================================

// Open Profile Settings Modal
function openProfileModal() {
  const modal = document.getElementById('profileModal');
  const user = getUserData();
  
  if (!user) {
    alert('Please login first');
    return;
  }
  
  // Show main options menu
  showSettingsOptions();
  
  // Show modal
  modal.classList.add('active');
  document.body.style.overflow = 'hidden';
}

// Close Profile Settings Modal
function closeProfileModal() {
  const modal = document.getElementById('profileModal');
  modal.classList.remove('active');
  document.body.style.overflow = '';
  
  // Reset to options view
  setTimeout(() => {
    showSettingsOptions();
  }, 300);
}

// Show settings options menu
function showSettingsOptions() {
  document.querySelector('.settings-options').style.display = 'block';
  document.getElementById('username-form').style.display = 'none';
  document.getElementById('email-form').style.display = 'none';
  document.getElementById('password-form').style.display = 'none';
  
  // Clear all forms
  document.getElementById('username-change-form').reset();
  document.getElementById('email-change-form').reset();
  document.getElementById('password-change-form').reset();
  
  // Clear all messages
  clearFormMessage('username-message');
  clearFormMessage('email-message');
  clearFormMessage('password-message');
}

// Show specific setting form
function showSettingForm(formType) {
  const currentUser = getCurrentUserFull();
  if (!currentUser) return;
  
  // Hide options menu
  document.querySelector('.settings-options').style.display = 'none';
  
  // Show specific form
  if (formType === 'username') {
    document.getElementById('username-form').style.display = 'block';
    document.getElementById('current-username').value = currentUser.username || currentUser.name || '';
  } else if (formType === 'email') {
    document.getElementById('email-form').style.display = 'block';
    document.getElementById('current-email').value = currentUser.email || '';
  } else if (formType === 'password') {
    document.getElementById('password-form').style.display = 'block';
  }
}

// Toggle password visibility in modal
function toggleModalPassword(inputId, iconElement) {
  const input = document.getElementById(inputId);
  const icon = iconElement;
  
  if (input.type === 'password') {
    input.type = 'text';
    icon.classList.remove('bx-hide');
    icon.classList.add('bx-show');
  } else {
    input.type = 'password';
    icon.classList.remove('bx-show');
    icon.classList.add('bx-hide');
  }
}

// Get full current user data
function getCurrentUserFull() {
  try {
    let userData = localStorage.getItem('currentUser');
    if (userData) return JSON.parse(userData);
    
    userData = sessionStorage.getItem('currentUser');
    if (userData) return JSON.parse(userData);
    
    return null;
  } catch (error) {
    console.error('Error reading current user:', error);
    return null;
  }
}

// Get all registered users
function getAllRegisteredUsers() {
  try {
    const users = localStorage.getItem('registeredUsers');
    return users ? JSON.parse(users) : [];
  } catch (error) {
    console.error('Error reading registered users:', error);
    return [];
  }
}

// Show form message
function showFormMessage(elementId, message, type = 'success') {
  const messageDiv = document.getElementById(elementId);
  messageDiv.textContent = message;
  messageDiv.className = `form-message ${type}`;
  messageDiv.style.display = 'block';
}

// Clear form message
function clearFormMessage(elementId) {
  const messageDiv = document.getElementById(elementId);
  messageDiv.textContent = '';
  messageDiv.className = 'form-message';
  messageDiv.style.display = 'none';
}

// Update current session and UI immediately
function updateCurrentSession(updatedUser) {
  const rememberMe = updatedUser.rememberMe || false;
  
  // CRITICAL: Use username for userData.name to ensure consistency
  const userData = {
    name: updatedUser.username || updatedUser.name,
    email: updatedUser.email
  };
  
  if (rememberMe) {
    localStorage.setItem('currentUser', JSON.stringify(updatedUser));
    localStorage.setItem('userData', JSON.stringify(userData));
  } else {
    sessionStorage.setItem('currentUser', JSON.stringify(updatedUser));
    sessionStorage.setItem('userData', JSON.stringify(userData));
  }
  
  // Clear the opposite storage to avoid conflicts
  if (rememberMe) {
    sessionStorage.removeItem('currentUser');
    sessionStorage.removeItem('userData');
  } else {
    localStorage.removeItem('currentUser');
    localStorage.removeItem('userData');
  }
  
  // Update UI immediately without page reload
  displayUserProfile();
}

// ===================================
// Form Validation Utility Functions
// ===================================

function sanitizeInput(str) {
  return str.replace(/[<>]/g, "");
}

function validateEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

function validatePhone(phone) {
  const phoneRegex = /^[0-9]{9}$/;
  return phoneRegex.test(phone);
}

function showError(groupId, errorId, message) {
  const group = document.getElementById(groupId);
  const errorElement = document.getElementById(errorId);
  group.classList.add("error");
  if (message) {
    errorElement.textContent = message;
  }
}

function clearError(groupId) {
  document.getElementById(groupId).classList.remove("error");
}

// ===================================
// Navigation Functions
// ===================================

function scrollToQuestions() {
  document.getElementById("questionsSection").scrollIntoView({
    behavior: "smooth",
  });
}

function toggleFaq(element) {
  const faqItem = element.parentElement;
  const wasActive = faqItem.classList.contains("active");

  document.querySelectorAll(".faq-item").forEach((item) => {
    item.classList.remove("active");
  });

  if (!wasActive) {
    faqItem.classList.add("active");
  }
}

// ===================================
// Event Listeners Setup
// ===================================

document.addEventListener('DOMContentLoaded', function() {
  // Initialize user profile
  displayUserProfile();
  
  // Avatar click event
  const userAvatar = document.getElementById('userAvatar');
  if (userAvatar) {
    userAvatar.addEventListener('click', function(e) {
      e.stopPropagation();
      toggleProfileDropdown();
    });
  }
  
  // Logout button event
  const logoutBtn = document.getElementById('logoutBtn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', function(e) {
      e.preventDefault();
      logout();
    });
  }
  
  // Close dropdown when clicking outside
  document.addEventListener('click', function(event) {
    const userProfile = document.getElementById('userProfile');
    const dropdown = document.getElementById('profileDropdown');
    
    if (userProfile && !userProfile.contains(event.target)) {
      if (dropdown) dropdown.classList.remove('show');
    }
  });
  
  // Update Profile Settings link
  const dropdownLinks = document.querySelectorAll('.dropdown-link');
  dropdownLinks.forEach(link => {
    if (link.textContent.trim() === 'Profile Settings') {
      link.addEventListener('click', function(e) {
        e.preventDefault();
        openProfileModal();
      });
    }
  });
  
  // Username change form
  const usernameForm = document.getElementById('username-change-form');
  if (usernameForm) {
    usernameForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      const currentUser = getCurrentUserFull();
      if (!currentUser) {
        showFormMessage('username-message', 'User not found. Please login again.', 'error');
        return;
      }
      
      const newUsername = document.getElementById('new-username').value.trim();
      
      if (newUsername.includes(' ')) {
        showFormMessage('username-message', 'Username cannot contain spaces', 'error');
        return;
      }
      
      if (newUsername.length < 3) {
        showFormMessage('username-message', 'Username must be at least 3 characters', 'error');
        return;
      }
      
      const users = getAllRegisteredUsers();
      const userIndex = users.findIndex(u => u.email === currentUser.email);
      
      if (userIndex === -1) {
        showFormMessage('username-message', 'Error: Could not find user record. Please logout and login again.', 'error');
        return;
      }
      
      const usernameExists = users.some((u, index) => {
        return index !== userIndex && 
               u.username && 
               u.username.toLowerCase() === newUsername.toLowerCase();
      });
      
      if (usernameExists) {
        showFormMessage('username-message', 'Username already taken. Please choose another.', 'error');
        return;
      }
      
      users[userIndex] = {
        ...users[userIndex],
        name: newUsername,
        username: newUsername,
        updatedAt: new Date().toISOString()
      };
      
      localStorage.setItem('registeredUsers', JSON.stringify(users));
      updateCurrentSession(users[userIndex]);
      
      showFormMessage('username-message', 'Username updated successfully!', 'success');
      
      setTimeout(() => {
        closeProfileModal();
      }, 1500);
    });
  }
  
  // Email change form
  const emailForm = document.getElementById('email-change-form');
  if (emailForm) {
    emailForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      const currentUser = getCurrentUserFull();
      if (!currentUser) {
        showFormMessage('email-message', 'User not found. Please login again.', 'error');
        return;
      }
      
      const newEmail = document.getElementById('new-email').value.trim();
      const password = document.getElementById('confirm-email-password').value.trim();
      
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailPattern.test(newEmail)) {
        showFormMessage('email-message', 'Please enter a valid email address', 'error');
        return;
      }
      
      if (currentUser.password !== password) {
        showFormMessage('email-message', 'Incorrect password', 'error');
        return;
      }
      
      const users = getAllRegisteredUsers();
      const userIndex = users.findIndex(u => u.email === currentUser.email);
      
      if (userIndex === -1) {
        showFormMessage('email-message', 'Error: Could not find user record. Please logout and login again.', 'error');
        return;
      }
      
      const emailExists = users.some((u, index) => {
        return index !== userIndex && u.email === newEmail;
      });
      
      if (emailExists) {
        showFormMessage('email-message', 'Email already in use. Please use another.', 'error');
        return;
      }
      
      users[userIndex] = {
        ...users[userIndex],
        email: newEmail,
        updatedAt: new Date().toISOString()
      };
      
      localStorage.setItem('registeredUsers', JSON.stringify(users));
      updateCurrentSession(users[userIndex]);
      
      showFormMessage('email-message', 'Email updated successfully!', 'success');
      
      setTimeout(() => {
        closeProfileModal();
      }, 1500);
    });
  }
  
  // Password change form
  const passwordForm = document.getElementById('password-change-form');
  if (passwordForm) {
    passwordForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      const currentUser = getCurrentUserFull();
      if (!currentUser) {
        showFormMessage('password-message', 'User not found. Please login again.', 'error');
        return;
      }
      
      const oldPassword = document.getElementById('old-password').value.trim();
      const newPassword = document.getElementById('new-password').value.trim();
      const confirmPassword = document.getElementById('confirm-new-password').value.trim();
      
      if (currentUser.password !== oldPassword) {
        showFormMessage('password-message', 'Current password is incorrect', 'error');
        return;
      }
      
      const passwordPattern = /^(?=.*[0-9]).{8,}$/;
      if (!passwordPattern.test(newPassword)) {
        showFormMessage('password-message', 'Password must be 8+ characters with at least 1 number', 'error');
        return;
      }
      
      if (newPassword !== confirmPassword) {
        showFormMessage('password-message', 'New passwords do not match', 'error');
        return;
      }
      
      const users = getAllRegisteredUsers();
      const userIndex = users.findIndex(u => u.email === currentUser.email);
      
      if (userIndex === -1) {
        showFormMessage('password-message', 'Error: Could not find user record. Please logout and login again.', 'error');
        return;
      }
      
      users[userIndex] = {
        ...users[userIndex],
        password: newPassword,
        updatedAt: new Date().toISOString()
      };
      
      localStorage.setItem('registeredUsers', JSON.stringify(users));
      updateCurrentSession(users[userIndex]);
      
      showFormMessage('password-message', 'Password updated successfully!', 'success');
      
      setTimeout(() => {
        showSettingsOptions();
      }, 1500);
    });
  }
  
  // Close modal on outside click
  const modal = document.getElementById('profileModal');
  if (modal) {
    modal.addEventListener('click', function(e) {
      if (e.target === modal) {
        closeProfileModal();
      }
    });
  }
  
  // FAQ Navigation
  document.getElementById("questionsLink").addEventListener("click", scrollToQuestions);

  document.querySelectorAll(".faq-question").forEach((question) => {
    question.addEventListener("click", function () {
      toggleFaq(this);
    });
  });

  // Back to Top Button
  document.getElementById("backToTopBtn").addEventListener("click", function () {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  });

  // Scroll Animation Observer
  const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px",
  };

  const observer = new IntersectionObserver(function (entries) {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("fade-in");
      }
    });
  }, observerOptions);

  // Observe benefit cards
  document.querySelectorAll(".benefit-card").forEach((card) => {
    observer.observe(card);
  });

  // Observe section divider
  const divider = document.querySelector(".section-divider");
  if (divider) {
    observer.observe(divider);
  }

  // Observe FAQ items
  document.querySelectorAll(".faq-item").forEach((item) => {
    observer.observe(item);
  });
});

// ===================================
// Partner Registration Form
// ===================================

const form = document.getElementById("registrationForm");
const successMessage = document.getElementById("successMessage");
const errorAlert = document.getElementById("errorAlert");
const submitBtn = document.getElementById("submitBtn");

// License file upload handling
let uploadedFile = null;

// Custom Select Dropdown
const customSelect = document.getElementById("businessTypeSelect");
const trigger = customSelect.querySelector(".custom-select-trigger");
const options = customSelect.querySelectorAll(".custom-select-option");
const hiddenSelect = document.getElementById("businessType");
const displayText = document.getElementById("businessTypeText");

trigger.addEventListener("click", function (e) {
  e.stopPropagation();
  customSelect.classList.toggle("active");
});

options.forEach((option) => {
  option.addEventListener("click", function () {
    const value = this.getAttribute("data-value");
    const text = this.textContent;

    hiddenSelect.value = value;
    displayText.textContent = text;
    trigger.classList.remove("placeholder");

    options.forEach((opt) => opt.classList.remove("selected"));
    this.classList.add("selected");

    customSelect.classList.remove("active");
    clearError("businessTypeGroup");
  });
});

document.addEventListener("click", function (e) {
  if (!customSelect.contains(e.target)) {
    customSelect.classList.remove("active");
  }
});

// License Radio Button Handlers
const licenseYes = document.getElementById("licenseYes");
const licenseNo = document.getElementById("licenseNo");
const fileUploadSection = document.getElementById("fileUploadSection");
const licenseNotice = document.getElementById("licenseNotice");

if (licenseYes && licenseNo) {
  licenseYes.addEventListener("change", function() {
    if (this.checked) {
      fileUploadSection.style.display = "block";
      licenseNotice.style.display = "none";
      clearError("licenseGroup");
    }
  });

  licenseNo.addEventListener("change", function() {
    if (this.checked) {
      fileUploadSection.style.display = "none";
      licenseNotice.style.display = "flex";
      uploadedFile = null;
      resetFileUpload();
      clearError("licenseGroup");
    }
  });
}

// File Upload Handlers
const fileInput = document.getElementById("licenseFile");
const fileUploadArea = document.getElementById("fileUploadArea");
const uploadPlaceholder = document.getElementById("uploadPlaceholder");
const filePreview = document.getElementById("filePreview");
const removeFileBtn = document.getElementById("removeFileBtn");
const fileName = document.getElementById("fileName");
const fileSize = document.getElementById("fileSize");

// Click to upload
if (uploadPlaceholder) {
  uploadPlaceholder.addEventListener("click", function() {
    fileInput.click();
  });
}

// Drag and drop
if (fileUploadArea) {
  fileUploadArea.addEventListener("dragover", function(e) {
    e.preventDefault();
    fileUploadArea.classList.add("drag-over");
  });

  fileUploadArea.addEventListener("dragleave", function() {
    fileUploadArea.classList.remove("drag-over");
  });

  fileUploadArea.addEventListener("drop", function(e) {
    e.preventDefault();
    fileUploadArea.classList.remove("drag-over");
    
    if (e.dataTransfer.files.length > 0) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  });
}

// File input change
if (fileInput) {
  fileInput.addEventListener("change", function() {
    if (this.files.length > 0) {
      handleFileUpload(this.files[0]);
    }
  });
}

// Remove file button
if (removeFileBtn) {
  removeFileBtn.addEventListener("click", function(e) {
    e.stopPropagation();
    resetFileUpload();
  });
}

// Handle file upload
function handleFileUpload(file) {
  // Validate file type
  const validTypes = ["application/pdf", "image/jpeg", "image/jpg", "image/png"];
  if (!validTypes.includes(file.type)) {
    showError("fileUploadSection", "fileError", "Please upload a PDF, JPG, or PNG file");
    return;
  }

  // Validate file size (5MB max)
  const maxSize = 5 * 1024 * 1024; // 5MB in bytes
  if (file.size > maxSize) {
    showError("fileUploadSection", "fileError", "File size must be less than 5MB");
    return;
  }

  // Store the file
  uploadedFile = file;

  // Display file info
  fileName.textContent = file.name;
  fileSize.textContent = formatFileSize(file.size);

  // Show preview, hide placeholder
  uploadPlaceholder.style.display = "none";
  filePreview.style.display = "flex";
  
  // Clear any errors
  const fileUploadGroup = document.getElementById("fileUploadSection");
  if (fileUploadGroup) {
    fileUploadGroup.classList.remove("error");
  }
}

// Reset file upload
function resetFileUpload() {
  uploadedFile = null;
  fileInput.value = "";
  uploadPlaceholder.style.display = "flex";
  filePreview.style.display = "none";
  
  const fileUploadGroup = document.getElementById("fileUploadSection");
  if (fileUploadGroup) {
    fileUploadGroup.classList.remove("error");
  }
}

// Format file size
function formatFileSize(bytes) {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + " " + sizes[i];
}

// Clear error state when user starts typing
document.querySelectorAll("input, select").forEach((field) => {
  field.addEventListener("input", function () {
    clearError(this.closest(".form-group").id);
  });
});

document.querySelectorAll('input[name="license"]').forEach((radio) => {
  radio.addEventListener("change", function () {
    clearError("licenseGroup");
  });
});

// Phone number formatting
document.getElementById("mobile").addEventListener("input", function (e) {
  this.value = this.value.replace(/[^0-9]/g, "");
});

// Form Submission
form.addEventListener("submit", function (event) {
  event.preventDefault();

  successMessage.classList.remove("show");
  errorAlert.classList.remove("show");
  document.querySelectorAll(".form-group").forEach((group) => {
    group.classList.remove("error");
  });

  let isValid = true;
  let firstErrorField = null;

  const brandName = sanitizeInput(document.getElementById("brandName").value.trim());
  const firstName = sanitizeInput(document.getElementById("firstName").value.trim());
  const lastName = sanitizeInput(document.getElementById("lastName").value.trim());
  const businessType = document.getElementById("businessType").value;
  const email = document.getElementById("email").value.trim();
  const mobile = document.getElementById("mobile").value.trim();
  const license = document.querySelector('input[name="license"]:checked');

  if (!brandName) {
    showError("brandNameGroup", "brandNameError", "Please fill in the Brand Name field");
    if (!firstErrorField) firstErrorField = document.getElementById("brandName");
    isValid = false;
  }

  if (!firstName) {
    showError("firstNameGroup", "firstNameError", "Please fill in the First Name field");
    if (!firstErrorField) firstErrorField = document.getElementById("firstName");
    isValid = false;
  }

  if (!lastName) {
    showError("lastNameGroup", "lastNameError", "Please fill in the Last Name field");
    if (!firstErrorField) firstErrorField = document.getElementById("lastName");
    isValid = false;
  }

  if (!businessType) {
    showError("businessTypeGroup", "businessTypeError", "Please select a Business Type");
    if (!firstErrorField) firstErrorField = trigger;
    isValid = false;
  }

  if (!email) {
    showError("emailGroup", "emailError", "Please fill in the Email field");
    if (!firstErrorField) firstErrorField = document.getElementById("email");
    isValid = false;
  } else if (!validateEmail(email)) {
    showError("emailGroup", "emailError", "Please enter a valid email address (e.g., name@example.com)");
    if (!firstErrorField) firstErrorField = document.getElementById("email");
    isValid = false;
  }

  if (!mobile) {
    showError("mobileGroup", "mobileError", "Please fill in the Mobile Number field");
    if (!firstErrorField) firstErrorField = document.getElementById("mobile");
    isValid = false;
  } else if (!validatePhone(mobile)) {
    showError("mobileGroup", "mobileError", "Please enter a valid 9-digit mobile number (e.g., 791234567)");
    if (!firstErrorField) firstErrorField = document.getElementById("mobile");
    isValid = false;
  }

  if (!license) {
    showError("licenseGroup", "licenseError", "Please select whether you have a commercial license");
    isValid = false;
  } else {
    // If user selected "No", prevent form submission
    if (license.value === "no") {
      showError("licenseGroup", "licenseError", "A commercial license is required to register");
      licenseNotice.style.display = "flex";
      isValid = false;
    } 
    // If user selected "Yes", check if file is uploaded
    else if (license.value === "yes") {
      if (!uploadedFile) {
        showError("fileUploadSection", "fileError", "Please upload your commercial license");
        isValid = false;
      }
    }
  }

  if (!isValid) {
    if (firstErrorField) {
      firstErrorField.focus();
    }
    return;
  }

  // Form is valid - Save to localStorage
  // Check if user is logged in
  const userData = localStorage.getItem("userData");
  const isLoggedIn = !!userData;
  
  // Function to save partner data
  function savePartnerData(fileData) {
    const partnerId = "partner_" + Date.now() + "_" + Math.random().toString(36).substr(2, 9);
    
    const partnerData = {
      id: partnerId,
      brandName: brandName,
      firstName: firstName,
      lastName: lastName,
      businessType: businessType,
      email: email,
      mobile: mobile,
      hasLicense: license.value,
      licenseFile: fileData,
      isLoggedIn: isLoggedIn,
      status: "pending",
      date: new Date().toISOString()
    };
    
    // Get existing partners or create empty array
    const existingPartners = localStorage.getItem("barberlink_partners");
    const partners = existingPartners ? JSON.parse(existingPartners) : [];
    
    // Add new partner
    partners.unshift(partnerData);
    
    // Save to localStorage
    localStorage.setItem("barberlink_partners", JSON.stringify(partners));
    
    console.log("Partner saved to localStorage:", partnerData.id);
    console.log("License file included:", fileData ? "YES - " + fileData.name : "NO");
    
    // Show success
    successMessage.classList.add("show");
    
    // Reset form
    form.reset();
    displayText.textContent = "Business type *";
    trigger.classList.add("placeholder");
    options.forEach((opt) => opt.classList.remove("selected"));
    
    // Reset file upload
    resetFileUpload();
    fileUploadSection.style.display = "none";
    licenseNotice.style.display = "none";

    setTimeout(function () {
      successMessage.classList.remove("show");
    }, 5000);

    form.scrollIntoView({ behavior: "smooth", block: "start" });
  }
  
  // If there's a file, convert to base64 first
  if (uploadedFile) {
    const reader = new FileReader();
    
    reader.onload = function(e) {
      const fileData = {
        name: uploadedFile.name,
        size: uploadedFile.size,
        type: uploadedFile.type,
        data: e.target.result
      };
      savePartnerData(fileData);
    };
    
    reader.onerror = function() {
      console.error("Error reading file");
      savePartnerData(null);
    };
    
    reader.readAsDataURL(uploadedFile);
  } else {
    // No file, save immediately
    savePartnerData(null);
  }
});