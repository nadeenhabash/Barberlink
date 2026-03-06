const highlight = document.querySelector(".cursor-highlight");

document.addEventListener("mousemove", (e) => {
  highlight.style.top = e.clientY + "px";
  highlight.style.left = e.clientX + "px";
});

// When hovering over links or buttons
document.querySelectorAll("a, button").forEach((el) => {
  el.addEventListener("mouseenter", () => {
    highlight.style.transform = "translate(-50%, -50%) scale(2.5)"; // grow
    highlight.style.background = "rgba(255, 0, 0, 0.52)"; // less transparent
  });

  el.addEventListener("mouseleave", () => {
    highlight.style.transform = "translate(-50%, -50%) scale(1)"; // back to normal
    highlight.style.background = "rgba(255, 0, 0, 0.87)"; // restore transparency
  });
});

// User Profile & Avatar Management

// Get user data from localStorage or sessionStorage
function getUserData() {
  try {
    // Check localStorage first (Remember Me checked)
    let userData = localStorage.getItem("userData");
    if (userData) {
      return JSON.parse(userData);
    }

    // Check sessionStorage (Remember Me not checked)
    userData = sessionStorage.getItem("userData");
    if (userData) {
      return JSON.parse(userData);
    }

    return null;
  } catch (error) {
    console.error("Error reading user data:", error);
    return null;
  }
}

// Display user avatar and profile
function displayUserProfile() {
  const user = getUserData();
  const userProfile = document.getElementById("userProfile");
  const loginBtn = document.getElementById("loginBtn");
  const userAvatar = document.getElementById("userAvatar");
  const profileName = document.getElementById("profileName");
  const profileEmail = document.getElementById("profileEmail");

  if (user && user.name) {
    // User is logged in - show avatar, hide login button
    const firstLetter = user.name.charAt(0).toUpperCase();

    userAvatar.textContent = firstLetter;
    profileName.textContent = user.name;
    profileEmail.textContent = user.email || "";

    if (userProfile) userProfile.style.display = "block";
    if (loginBtn) loginBtn.style.display = "none";
  } else {
    // User not logged in - show login button, hide avatar
    if (userProfile) userProfile.style.display = "none";
    if (loginBtn) loginBtn.style.display = "block";
  }
}

// Toggle profile dropdown
function toggleProfileDropdown() {
  const dropdown = document.getElementById("profileDropdown");
  dropdown.classList.toggle("show");
}

// Logout functionality
function logout() {
  showLogoutModal();
}

// Show custom logout modal
function showLogoutModal() {
  // Create modal overlay
  const modalOverlay = document.createElement("div");
  modalOverlay.className = "logout-alert-overlay";
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
    modalOverlay.classList.add("active");
  }, 10);
}

// Close logout modal
function closeLogoutModal() {
  const modal = document.querySelector(".logout-alert-overlay");
  if (modal) {
    modal.classList.remove("active");
    setTimeout(() => {
      modal.remove();
    }, 300);
  }
}

// Confirm logout
function confirmLogout() {
  // Clear both localStorage and sessionStorage
  localStorage.removeItem("userData");
  localStorage.removeItem("currentUser");
  sessionStorage.removeItem("userData");
  sessionStorage.removeItem("currentUser");
  window.location.reload();
}

// Initialize profile on page load
document.addEventListener("DOMContentLoaded", function () {
  displayUserProfile();

  // Avatar click event
  const userAvatar = document.getElementById("userAvatar");
  if (userAvatar) {
    userAvatar.addEventListener("click", function (e) {
      e.stopPropagation();
      toggleProfileDropdown();
    });
  }

  // Logout button event
  const logoutBtn = document.getElementById("logoutBtn");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", function (e) {
      e.preventDefault();
      logout();
    });
  }

  // Close dropdown when clicking outside
  document.addEventListener("click", function (event) {
    const userProfile = document.getElementById("userProfile");
    const dropdown = document.getElementById("profileDropdown");

    if (userProfile && !userProfile.contains(event.target)) {
      if (dropdown) dropdown.classList.remove("show");
    }
  });
});


// Barberlink Logo Animation
// Triggers 1.5 seconds after page load
window.addEventListener("load", function () {
  setTimeout(function () {
    // Animate letters to scattered positions
    const letters = document.querySelectorAll(".letter");
    letters.forEach((letter) => {
      letter.classList.remove("initial");
    });

    // Show all barbering tool images
    const tools = document.querySelectorAll(".tool-img");
    tools.forEach((tool) => {
      tool.classList.add("show");
    });
  }, 1500);
});

// About Section Animations

// Letter Drop Animation for Title
function letterDrop() {
  const h1 = document.querySelector(".about-title");
  const text = h1.textContent;
  const arr = text.split("");

  h1.textContent = "";
  h1.classList.add("ready");

  arr.forEach((char) => {
    const delay = Math.floor(Math.random() * 9) + 1;
    const span = document.createElement("span");
    span.className = `letterDrop ld${delay}`;
    span.innerHTML = char === " " ? "&nbsp;" : char;
    h1.appendChild(span);
  });
}

// Paragraph Fade-Up Animation
function animateParagraph() {
  const text = document.getElementById("about-text");
  if (!text) return;

  text.classList.add("ready");

  // Show shop button and bottom line after paragraph
  setTimeout(() => {
    const shopBtn = document.querySelector(
      ".about-title-section .cta-container"
    );
    const aboutSection = document.querySelector(".about-title-section");

    if (shopBtn) shopBtn.classList.add("show");
    if (aboutSection) aboutSection.classList.add("line-show");

    // *** HIGHLIGHT ANIMATION - Trigger after paragraph fade completes ***
    setTimeout(() => {
      const highlightElements = document.querySelectorAll(
        ".highlight-on-scroll"
      );
      highlightElements.forEach((el) => el.classList.add("highlighted"));
    }, 500); // Start highlighting 0.5 seconds after paragraph appears

    // Show testimonials section after shop button
    setTimeout(() => {
      const testimonialsSection = document.querySelector(".testimonial-area");
      if (testimonialsSection) testimonialsSection.classList.add("fade-in");

      // Show footer after testimonials
      setTimeout(() => {
        const footer = document.querySelector(".footer-contact");
        if (footer) footer.classList.add("fade-in");
      }, 800);
    }, 600);
  }, 1000);
}

// Intersection Observer for About Section
const aboutObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        // Reset animations
        const text = document.getElementById("about-text");
        const shopBtn = document.querySelector(
          ".about-title-section .cta-container"
        );
        const aboutSection = document.querySelector(".about-title-section");
        const highlightElements = document.querySelectorAll(
          ".highlight-on-scroll"
        );

        if (text) text.classList.remove("ready");
        if (shopBtn) shopBtn.classList.remove("show");
        if (aboutSection) aboutSection.classList.remove("line-show");

        // Reset highlight animation
        highlightElements.forEach((el) => el.classList.remove("highlighted"));

        // Trigger animations
        letterDrop();
        setTimeout(() => {
          animateParagraph();
        }, 1800);

        // Only animate once
        aboutObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.001 }
);

// Observe about section
const aboutTitle = document.querySelector(".about-title-section");
if (aboutTitle) {
  aboutObserver.observe(aboutTitle);
}

// Testimonials Carousel

$(".testimonial-content").owlCarousel({
  loop: true,
  items: 2,
  margin: 50,
  dots: true,
  nav: false,
  mouseDrag: true,
  autoplay: true,
  autoplayTimeout: 3000,
  smartSpeed: 800,
});

// Load Testimonials from Admin Panel

function loadTestimonialsFromAdmin() {
  const stored = localStorage.getItem("barberlink_testimonials");
  if (!stored) return;

  try {
    const testimonials = JSON.parse(stored);
    const container = document.querySelector(".testimonial-content");

    if (!container || testimonials.length === 0) return;

    // Destroy existing carousel
    $(container).owlCarousel("destroy");
    container.innerHTML = "";

    // Add testimonials from admin
    testimonials.forEach((t) => {
      const testimonialHTML = `
                <div class="single-testimonial">
                    <div class="round-1 round"></div>
                    <div class="round-2 round"></div>
                    <p>${escapeHTML(t.review)}</p>
                    <div class="client-info">
                        <div class="client-details">
                            <h6>${escapeHTML(t.name)}</h6>
                            <span>${escapeHTML(t.role)}</span>
                        </div>
                    </div>
                </div>
            `;
      container.insertAdjacentHTML("beforeend", testimonialHTML);
    });

    // Reinitialize carousel
    $(container).owlCarousel({
      loop: true,
      items: 2,
      margin: 50,
      dots: true,
      nav: false,
      mouseDrag: true,
      autoplay: true,
      autoplayTimeout: 3000,
      smartSpeed: 800,
    });
  } catch (error) {
    console.error("Error loading testimonials:", error);
  }
}

// Helper function to escape HTML
function escapeHTML(str) {
  const div = document.createElement("div");
  div.textContent = str;
  return div.innerHTML;
}

// Load testimonials after page load
setTimeout(loadTestimonialsFromAdmin, 200);

// Profile Settings Modal Functions

// Open Profile Settings Modal
function openProfileModal() {
  const modal = document.getElementById("profileModal");
  const user = getUserData();

  if (!user) {
    alert("Please login first");
    return;
  }

  // Show main options menu
  showSettingsOptions();

  // Show modal
  modal.classList.add("active");
  document.body.style.overflow = "hidden";
}

// Close Profile Settings Modal
function closeProfileModal() {
  const modal = document.getElementById("profileModal");
  modal.classList.remove("active");
  document.body.style.overflow = "";

  // Reset to options view
  setTimeout(() => {
    showSettingsOptions();
  }, 300);
}

// Show settings options menu
function showSettingsOptions() {
  document.querySelector(".settings-options").style.display = "block";
  document.getElementById("username-form").style.display = "none";
  document.getElementById("email-form").style.display = "none";
  document.getElementById("password-form").style.display = "none";

  // Clear all forms
  document.getElementById("username-change-form").reset();
  document.getElementById("email-change-form").reset();
  document.getElementById("password-change-form").reset();

  // Clear all messages
  clearFormMessage("username-message");
  clearFormMessage("email-message");
  clearFormMessage("password-message");
}

// Show specific setting form
function showSettingForm(formType) {
  const currentUser = getCurrentUserFull();
  if (!currentUser) return;

  // Hide options menu
  document.querySelector(".settings-options").style.display = "none";

  // Show specific form
  if (formType === "username") {
    document.getElementById("username-form").style.display = "block";
    // Show current username - fallback to name if username doesn't exist
    document.getElementById("current-username").value =
      currentUser.username || currentUser.name || "";
  } else if (formType === "email") {
    document.getElementById("email-form").style.display = "block";
    document.getElementById("current-email").value = currentUser.email || "";
  } else if (formType === "password") {
    document.getElementById("password-form").style.display = "block";
  }
}

// Toggle password visibility in modal
function toggleModalPassword(inputId, iconElement) {
  const input = document.getElementById(inputId);
  const icon = iconElement;

  if (input.type === "password") {
    input.type = "text";
    icon.classList.remove("bx-hide");
    icon.classList.add("bx-show");
  } else {
    input.type = "password";
    icon.classList.remove("bx-show");
    icon.classList.add("bx-hide");
  }
}

// Get full current user data
function getCurrentUserFull() {
  try {
    let userData = localStorage.getItem("currentUser");
    if (userData) return JSON.parse(userData);

    userData = sessionStorage.getItem("currentUser");
    if (userData) return JSON.parse(userData);

    return null;
  } catch (error) {
    console.error("Error reading current user:", error);
    return null;
  }
}

// Get all registered users
function getAllRegisteredUsers() {
  try {
    const users = localStorage.getItem("registeredUsers");
    return users ? JSON.parse(users) : [];
  } catch (error) {
    console.error("Error reading registered users:", error);
    return [];
  }
}

// Show form message
function showFormMessage(elementId, message, type = "success") {
  const messageDiv = document.getElementById(elementId);
  messageDiv.textContent = message;
  messageDiv.className = `form-message ${type}`;
  messageDiv.style.display = "block";
}

// Clear form message
function clearFormMessage(elementId) {
  const messageDiv = document.getElementById(elementId);
  messageDiv.textContent = "";
  messageDiv.className = "form-message";
  messageDiv.style.display = "none";
}

// Update current session and UI immediately
function updateCurrentSession(updatedUser) {
  const rememberMe = updatedUser.rememberMe || false;

  // CRITICAL: Use username for userData.name to ensure consistency
  const userData = {
    name: updatedUser.username || updatedUser.name,
    email: updatedUser.email,
  };

  if (rememberMe) {
    localStorage.setItem("currentUser", JSON.stringify(updatedUser));
    localStorage.setItem("userData", JSON.stringify(userData));
  } else {
    sessionStorage.setItem("currentUser", JSON.stringify(updatedUser));
    sessionStorage.setItem("userData", JSON.stringify(userData));
  }

  // Clear the opposite storage to avoid conflicts
  if (rememberMe) {
    sessionStorage.removeItem("currentUser");
    sessionStorage.removeItem("userData");
  } else {
    localStorage.removeItem("currentUser");
    localStorage.removeItem("userData");
  }

  // Update UI immediately without page reload
  displayUserProfile();
}

// Initialize event listeners
document.addEventListener("DOMContentLoaded", function () {
  // Username change form
  const usernameForm = document.getElementById("username-change-form");
  if (usernameForm) {
    usernameForm.addEventListener("submit", function (e) {
      e.preventDefault();

      const currentUser = getCurrentUserFull();
      if (!currentUser) {
        showFormMessage(
          "username-message",
          "User not found. Please login again.",
          "error"
        );
        return;
      }

      const newUsername = document.getElementById("new-username").value.trim();

      // Validate username - no spaces allowed
      if (newUsername.includes(" ")) {
        showFormMessage(
          "username-message",
          "Username cannot contain spaces",
          "error"
        );
        return;
      }

      // Validate username length
      if (newUsername.length < 3) {
        showFormMessage(
          "username-message",
          "Username must be at least 3 characters",
          "error"
        );
        return;
      }

      // Get all users
      const users = getAllRegisteredUsers();

      // Find current user by email (most reliable identifier)
      const userIndex = users.findIndex((u) => u.email === currentUser.email);

      if (userIndex === -1) {
        showFormMessage(
          "username-message",
          "Error: Could not find user record. Please logout and login again.",
          "error"
        );
        return;
      }

      // Check if new username already exists (case insensitive, excluding current user)
      const usernameExists = users.some((u, index) => {
        return (
          index !== userIndex &&
          u.username &&
          u.username.toLowerCase() === newUsername.toLowerCase()
        );
      });

      if (usernameExists) {
        showFormMessage(
          "username-message",
          "Username already taken. Please choose another.",
          "error"
        );
        return;
      }

      // Update user with new username
      users[userIndex] = {
        ...users[userIndex],
        name: newUsername,
        username: newUsername,
        updatedAt: new Date().toISOString(),
      };

      // Save to localStorage
      localStorage.setItem("registeredUsers", JSON.stringify(users));

      // Update current session and UI
      updateCurrentSession(users[userIndex]);

      showFormMessage(
        "username-message",
        "Username updated successfully!",
        "success"
      );

      setTimeout(() => {
        closeProfileModal();
      }, 1500);
    });
  }

  // Email change form
  const emailForm = document.getElementById("email-change-form");
  if (emailForm) {
    emailForm.addEventListener("submit", function (e) {
      e.preventDefault();

      const currentUser = getCurrentUserFull();
      if (!currentUser) {
        showFormMessage(
          "email-message",
          "User not found. Please login again.",
          "error"
        );
        return;
      }

      const newEmail = document.getElementById("new-email").value.trim();
      const password = document
        .getElementById("confirm-email-password")
        .value.trim();

      // Validate email
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailPattern.test(newEmail)) {
        showFormMessage(
          "email-message",
          "Please enter a valid email address",
          "error"
        );
        return;
      }

      // Verify password
      if (currentUser.password !== password) {
        showFormMessage("email-message", "Incorrect password", "error");
        return;
      }

      // Get all users
      const users = getAllRegisteredUsers();

      // Find current user by email
      const userIndex = users.findIndex((u) => u.email === currentUser.email);

      if (userIndex === -1) {
        showFormMessage(
          "email-message",
          "Error: Could not find user record. Please logout and login again.",
          "error"
        );
        return;
      }

      // Check if new email already exists (excluding current user)
      const emailExists = users.some((u, index) => {
        return index !== userIndex && u.email === newEmail;
      });

      if (emailExists) {
        showFormMessage(
          "email-message",
          "Email already in use. Please use another.",
          "error"
        );
        return;
      }

      // Update user with new email
      users[userIndex] = {
        ...users[userIndex],
        email: newEmail,
        updatedAt: new Date().toISOString(),
      };

      // Save to localStorage
      localStorage.setItem("registeredUsers", JSON.stringify(users));

      // Update current session and UI
      updateCurrentSession(users[userIndex]);

      showFormMessage(
        "email-message",
        "Email updated successfully!",
        "success"
      );

      setTimeout(() => {
        closeProfileModal();
      }, 1500);
    });
  }

  // Password change form
  const passwordForm = document.getElementById("password-change-form");
  if (passwordForm) {
    passwordForm.addEventListener("submit", function (e) {
      e.preventDefault();

      const currentUser = getCurrentUserFull();
      if (!currentUser) {
        showFormMessage(
          "password-message",
          "User not found. Please login again.",
          "error"
        );
        return;
      }

      const oldPassword = document.getElementById("old-password").value.trim();
      const newPassword = document.getElementById("new-password").value.trim();
      const confirmPassword = document
        .getElementById("confirm-new-password")
        .value.trim();

      // Verify old password
      if (currentUser.password !== oldPassword) {
        showFormMessage(
          "password-message",
          "Current password is incorrect",
          "error"
        );
        return;
      }

      // Validate new password
      const passwordPattern = /^(?=.*[0-9]).{8,}$/;
      if (!passwordPattern.test(newPassword)) {
        showFormMessage(
          "password-message",
          "Password must be 8+ characters with at least 1 number",
          "error"
        );
        return;
      }

      // Check if passwords match
      if (newPassword !== confirmPassword) {
        showFormMessage(
          "password-message",
          "New passwords do not match",
          "error"
        );
        return;
      }

      // Get all users
      const users = getAllRegisteredUsers();

      // Find current user by email
      const userIndex = users.findIndex((u) => u.email === currentUser.email);

      if (userIndex === -1) {
        showFormMessage(
          "password-message",
          "Error: Could not find user record. Please logout and login again.",
          "error"
        );
        return;
      }

      // Update user with new password
      users[userIndex] = {
        ...users[userIndex],
        password: newPassword,
        updatedAt: new Date().toISOString(),
      };

      // Save to localStorage
      localStorage.setItem("registeredUsers", JSON.stringify(users));

      // Update current session (password change doesn't affect displayed info)
      updateCurrentSession(users[userIndex]);

      showFormMessage(
        "password-message",
        "Password updated successfully!",
        "success"
      );

      setTimeout(() => {
        showSettingsOptions();
      }, 1500);
    });
  }

  // Update Profile Settings link
  const dropdownLinks = document.querySelectorAll(".dropdown-link");
  dropdownLinks.forEach((link) => {
    if (link.textContent.trim() === "Profile Settings") {
      link.addEventListener("click", function (e) {
        e.preventDefault();
        openProfileModal();
      });
    }
  });

  // Close modal on outside click
  const modal = document.getElementById("profileModal");
  if (modal) {
    modal.addEventListener("click", function (e) {
      if (e.target === modal) {
        closeProfileModal();
      }
    });
  }
});

// Add scroll effect to navigation
window.addEventListener("scroll", function () {
  const nav = document.querySelector("nav");
  if (window.scrollY > 50) {
    nav.classList.add("scrolled");
  } else {
    nav.classList.remove("scrolled");
  }
});

// Forgot Password Functionality

// Open Forgot Password Modal
function openForgotPasswordModal() {
  const modal = document.getElementById("forgotPasswordModal");
  const overlay = document.getElementById("forgotPasswordOverlay");

  modal.classList.add("active");
  overlay.classList.add("active");
  document.body.style.overflow = "hidden";
}

// Close Forgot Password Modal
function closeForgotPasswordModal() {
  const modal = document.getElementById("forgotPasswordModal");
  const overlay = document.getElementById("forgotPasswordOverlay");

  modal.classList.remove("active");
  overlay.classList.remove("active");
  document.body.style.overflow = "";

  // Clear form
  const form = document.getElementById("forgot-password-form");
  if (form) {
    form.reset();
  }

  // Clear error messages
  const errorMessages = document.querySelectorAll(".modal-error");
  errorMessages.forEach((msg) => msg.remove());

  const forgotEmail = document.getElementById("forgot-email");
  if (forgotEmail) {
    forgotEmail.classList.remove("invalid");
  }
}

// Handle Forgot Password Form Submission
function handleForgotPassword(e) {
  e.preventDefault();

  const form = e.target;
  const submitBtn = form.querySelector(".btn-save");

  // Prevent double submission
  if (submitBtn.disabled) return;

  const email = document.getElementById("forgot-email").value.trim();
  const emailInput = document.getElementById("forgot-email");

  // Clear any existing error messages
  const existingError = form.querySelector(".modal-error");
  if (existingError) existingError.remove();
  emailInput.classList.remove("invalid");

  // Basic email validation
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailPattern.test(email)) {
    // Show styled error message
    const errorDiv = document.createElement("div");
    errorDiv.className = "modal-error";
    errorDiv.textContent = !email
      ? "Please enter your email address"
      : "Please enter a valid email address";

    const emailField = emailInput.closest(".profile-field");
    emailField.appendChild(errorDiv);
    emailInput.classList.add("invalid");

    return;
  }

  // Disable button to prevent re-clicking
  submitBtn.disabled = true;
  submitBtn.textContent = "Sending...";

  // Check if email exists in registered users
  const users = getAllUsers();
  const userExists = users.some(
    (user) => user.email.toLowerCase() === email.toLowerCase()
  );

  if (userExists) {
    // Close the forgot password modal
    closeForgotPasswordModal();

    // Re-enable button after closing modal
    setTimeout(() => {
      submitBtn.disabled = false;
      submitBtn.textContent = "Send Reset Link";
    }, 500);

    // Show styled confirmation alert
    setTimeout(() => {
      showResetConfirmation(email);
    }, 300);
  } else {
    // Re-enable button if email not found
    submitBtn.disabled = false;
    submitBtn.textContent = "Send Reset Link";

    // Show styled error message
    const errorDiv = document.createElement("div");
    errorDiv.className = "modal-error";
    errorDiv.textContent = "No account found with this email address";

    const emailField = emailInput.closest(".profile-field");
    emailField.appendChild(errorDiv);
    emailInput.classList.add("invalid");
  }
}

// Get all registered users
function getAllUsers() {
  try {
    const users = localStorage.getItem("registeredUsers");
    return users ? JSON.parse(users) : [];
  } catch (error) {
    console.error("Error reading users:", error);
    return [];
  }
}

// Show Reset Confirmation Alert
function showResetConfirmation(email) {
  const overlay = document.getElementById("confirmationOverlay");
  const text = document.getElementById("resetConfirmationText");

  text.textContent = `Password reset link has been sent to ${email}`;

  overlay.classList.add("active");
  document.body.style.overflow = "hidden";
}

// Close Reset Confirmation Alert
function closeResetConfirmation() {
  const overlay = document.getElementById("confirmationOverlay");

  overlay.classList.remove("active");
  document.body.style.overflow = "";
}

// Close modal with Escape key
document.addEventListener("keydown", function (e) {
  if (e.key === "Escape") {
    closeForgotPasswordModal();
    closeResetConfirmation();
  }
});
