// Menu functionality
function toggleMenu() {
    const menu = document.getElementById('dropdownMenu');
    menu.classList.toggle('active');
}

// Close menu when clicking outside
document.addEventListener('click', function(event) {
    const menuContainer = document.querySelector('.menu-container');
    const menu = document.getElementById('dropdownMenu');
    
    if (!menuContainer.contains(event.target)) {
        menu.classList.remove('active');
    }
});

// Toggle password visibility
function togglePasswordVisibility(inputId, iconElement) {
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

// Form switching functionality
const loginContainer = document.getElementById("login");
const registerContainer = document.getElementById("register");

function login() {
  loginContainer.style.left = "4px";
  registerContainer.style.right = "-520px";
  loginContainer.style.opacity = 1;
  registerContainer.style.opacity = 0;
  
  // Clear any existing messages
  clearMessages();
  
  // Clear all input fields in register form
  clearFormInputs('register-form');
}

function register() {
  loginContainer.style.left = "-510px";
  registerContainer.style.right = "5px";
  loginContainer.style.opacity = 0;
  registerContainer.style.opacity = 1;
  
  // Clear any existing messages
  clearMessages();
  
  // Clear all input fields in login form
  clearFormInputs('login-form');
}

// Validation utilities
class FormValidator {
  constructor() {
    this.patterns = {
      email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
      password: /^(?=.*[0-9]).{8,}$/,
      name: /^[a-zA-Z\s]{3,}$/
    };
    
    this.messages = {
      required: "This field is required",
      email: "Enter a valid email (example@outlook.com)",
      password: "Password must be 8+ characters and include a number",
      name: "Name must be at least 3 characters and contain only letters"
    };
  }

  validateField(input, type = 'text') {
    const value = input.value.trim();
    let isValid = true;
    let message = "";

    // Check if field is required and empty
    if (input.hasAttribute('required') && !value) {
      isValid = false;
      message = this.messages.required;
    }
    // Validate specific field types
    else if (value) {
      switch (type) {
        case 'email':
          if (!this.patterns.email.test(value)) {
            isValid = false;
            message = this.messages.email;
          }
          break;
        case 'password':
          if (!this.patterns.password.test(value)) {
            isValid = false;
            message = this.messages.password;
          }
          break;
        case 'name':
          if (!this.patterns.name.test(value)) {
            isValid = false;
            message = this.messages.name;
          }
          break;
      }
    }

    return { isValid, message };
  }

  validateForm(form) {
    const inputs = form.querySelectorAll('input[type="text"], input[type="email"], input[type="password"]');
    let formValid = true;

    // Clear previous messages
    this.clearFieldMessages(form);

    inputs.forEach(input => {
      let fieldType = 'text';
      
      // Determine field type based on input type or id
      if (input.type === 'email') fieldType = 'email';
      else if (input.type === 'password') fieldType = 'password';
      else if (input.id.includes('firstname') || input.id.includes('lastname')) fieldType = 'name';

      const validation = this.validateField(input, fieldType);
      
      if (!validation.isValid) {
        this.showFieldMessage(input, validation.message, 'error');
        formValid = false;
      }
    });

    return formValid;
  }

  showFieldMessage(input, message, type = 'error') {
    const formControl = input.closest('.form-control');
    if (!formControl) return;

    // Add invalid class to input for red border
    if (type === 'error') {
      input.classList.add('invalid');
    }

    // Remove any existing message in this form control
    const existingMessage = formControl.querySelector('.warning, .success');
    if (existingMessage) {
      existingMessage.remove();
    }

    const messageElement = document.createElement('div');
    messageElement.className = type === 'error' ? 'warning' : 'success';
    messageElement.textContent = message;
    
    formControl.appendChild(messageElement);
  }

  clearFieldMessages(form) {
    const messages = form.querySelectorAll('.warning, .success');
    messages.forEach(message => message.remove());
    
    // Remove invalid class from all inputs
    const inputs = form.querySelectorAll('input.invalid');
    inputs.forEach(input => input.classList.remove('invalid'));
  }
}

// User account management functions
function getAllUsers() {
  try {
    const users = localStorage.getItem('registeredUsers');
    return users ? JSON.parse(users) : [];
  } catch (error) {
    console.error('Error reading users:', error);
    return [];
  }
}

function saveUser(userData) {
  try {
    const users = getAllUsers();
    users.push(userData);
    localStorage.setItem('registeredUsers', JSON.stringify(users));
    return true;
  } catch (error) {
    console.error('Error saving user:', error);
    return false;
  }
}

// FIXED: Only check username and email - ignore old 'name' field
function findUserByCredential(credential) {
  const users = getAllUsers();
  const searchTerm = credential.toLowerCase().trim();
  
  const foundUser = users.find(user => {
    // Check email match (case insensitive)
    const emailMatch = user.email && user.email.toLowerCase() === searchTerm;
    
    // Check username match (case insensitive) - ONLY current username field
    const usernameMatch = user.username && user.username.toLowerCase() === searchTerm;
    
    return emailMatch || usernameMatch;
  });
  
  console.log('Search term:', searchTerm);
  console.log('Found user:', foundUser);
  
  return foundUser;
}

function checkIfUserExists(email, username) {
  const users = getAllUsers();
  return users.some(user => 
    user.email.toLowerCase() === email.toLowerCase() ||
    (user.username && user.username.toLowerCase() === username.toLowerCase())
  );
}

function setCurrentUser(userData, rememberMe = false) {
  try {
    const userDataWithRemember = {
      ...userData,
      rememberMe: rememberMe,
      loginTime: new Date().toISOString()
    };
    
    // Create userData for display - use username field
    const displayData = {
      name: userData.username || userData.name,
      email: userData.email,
      loginDate: new Date().toISOString()
    };
    
    if (rememberMe) {
      // Store in localStorage (permanent until logout)
      localStorage.setItem('currentUser', JSON.stringify(userDataWithRemember));
      localStorage.setItem('userData', JSON.stringify(displayData));
      // Clear sessionStorage to avoid conflicts
      sessionStorage.removeItem('currentUser');
      sessionStorage.removeItem('userData');
    } else {
      // Store in sessionStorage (expires when browser closes)
      sessionStorage.setItem('currentUser', JSON.stringify(userDataWithRemember));
      sessionStorage.setItem('userData', JSON.stringify(displayData));
      // Clear localStorage to avoid conflicts
      localStorage.removeItem('currentUser');
      localStorage.removeItem('userData');
    }
    return true;
  } catch (error) {
    console.error('Error setting current user:', error);
    return false;
  }
}

// Form handling
class FormHandler {
  constructor() {
    this.validator = new FormValidator();
    this.initializeEventListeners();
  }

  initializeEventListeners() {
    // Login form
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
      loginForm.addEventListener('submit', (e) => this.handleLogin(e));
    }

    // Register form
    const registerForm = document.getElementById('register-form');
    if (registerForm) {
      registerForm.addEventListener('submit', (e) => this.handleRegister(e));
    }

    // Real-time validation and label management
    document.addEventListener('blur', (e) => {
      if (e.target.matches('input[type="text"], input[type="email"], input[type="password"]')) {
        this.validateFieldRealTime(e.target);
        this.manageLabelPosition(e.target);
      }
    }, true);

    // Handle input events for label positioning
    document.addEventListener('input', (e) => {
      if (e.target.matches('input[type="text"], input[type="email"], input[type="password"]')) {
        this.manageLabelPosition(e.target);
      }
    }, true);
  }

  manageLabelPosition(input) {
    // Keep label up if input has value
    if (input.value.trim() !== '') {
      input.setAttribute('data-has-value', 'true');
    } else {
      input.removeAttribute('data-has-value');
    }
  }

  validateFieldRealTime(input) {
    // Skip real-time validation for login form password field
    const isLoginPassword = input.closest('#login-form') && input.type === 'password';
    if (isLoginPassword) {
      return; // Don't validate password in login form in real-time
    }
    
    let fieldType = 'text';
    
    if (input.type === 'email') fieldType = 'email';
    else if (input.type === 'password') fieldType = 'password';
    else if (input.id.includes('firstname') || input.id.includes('lastname')) fieldType = 'name';

    const validation = this.validator.validateField(input, fieldType);
    
    // Clear existing messages for this field
    const formControl = input.closest('.form-control');
    if (formControl) {
      const existingMessages = formControl.querySelectorAll('.warning, .success');
      existingMessages.forEach(msg => msg.remove());

      // Show message if validation failed
      if (!validation.isValid && input.value.trim()) {
        this.validator.showFieldMessage(input, validation.message, 'error');
      }
    }
  }

  // FIXED: Only check current username and email fields
  handleLogin(e) {
    e.preventDefault();
    
    const form = e.target;
    const credential = document.getElementById('login-username').value.trim();
    const password = document.getElementById('login-password').value.trim();
    const rememberMe = document.getElementById('login-check').checked;
    
    // Clear ALL previous messages including field-level warnings
    this.validator.clearFieldMessages(form);
    const existingMessages = form.querySelectorAll('.form-success, .form-error');
    existingMessages.forEach(msg => msg.remove());
    
    // Check if fields are empty
    if (!credential || !password) {
      this.showErrorMessage(form, "Please enter both username/email and password");
      return;
    }
    
    // Find user by current username or email ONLY
    const user = findUserByCredential(credential);
    
    if (!user) {
      this.showErrorMessage(form, "Invalid username or email");
      return;
    }
    
    // Check if password matches (case sensitive)
    if (user.password !== password) {
      this.showErrorMessage(form, "Sorry, your password was incorrect. Please double-check your password.");
      return;
    }
    
    // Login successful - prepare login data with current fields
    const loginData = {
      name: user.username || user.name,
      firstname: user.firstname,
      lastname: user.lastname,
      email: user.email,
      username: user.username,
      password: user.password,
      rememberMe: rememberMe
    };
    
    // Update user's login time in registeredUsers array
    const users = getAllUsers();
    const userIndex = users.findIndex(u => u.email === user.email);
    if (userIndex !== -1) {
      users[userIndex].loginTime = new Date().toISOString();
      users[userIndex].rememberMe = rememberMe;
      localStorage.setItem('registeredUsers', JSON.stringify(users));
    }
    
    if (setCurrentUser(loginData, rememberMe)) {
      this.showSuccessMessage(form, "Login successful! Redirecting...");
      
      setTimeout(() => {
        this.clearFormAfterSuccess('login-form');
        window.location.href = getRedirectUrl();
      }, 1500);
    } else {
      this.showErrorMessage(form, "Error logging in. Please try again.");
    }
  }

  // Register handler with username validation (no spaces)
  handleRegister(e) {
    e.preventDefault();
    
    const form = e.target;
    
    // Validate form fields FIRST
    if (!this.validator.validateForm(form)) {
      return; // Stop if fields are invalid
    }
    
    // Explicitly check password requirements
    const password = document.getElementById('register-password').value.trim();
    if (password.length < 8 || !/\d/.test(password)) {
      const passwordInput = document.getElementById('register-password');
      this.validator.showFieldMessage(passwordInput, 'Password must be 8+ characters and include a number', 'error');
      return;
    }
    
    // THEN check if terms are accepted
    const termsCheckbox = document.getElementById('terms-check');
    if (!termsCheckbox.checked) {
      // Remove any existing warning
      const existingWarning = document.querySelector('.terms-warning');
      if (existingWarning) {
        existingWarning.remove();
      }
      
      // Show warning message in the two-col div (right after terms checkbox)
      const twoColDiv = document.querySelector('.register-container .two-col');
      const warningMsg = document.createElement('div');
      warningMsg.className = 'terms-warning';
      warningMsg.textContent = 'You must agree to the Terms & Conditions';
      twoColDiv.appendChild(warningMsg);
      
      // Highlight the checkbox
      termsCheckbox.style.outline = '2px solid #dc3545';
      setTimeout(() => {
        termsCheckbox.style.outline = '';
      }, 2000);
      
      return;
    }
    
    // If we get here, everything is valid - proceed with registration
    // Get form data
    const firstname = document.getElementById('register-firstname').value.trim();
    const lastname = document.getElementById('register-lastname').value.trim();
    const email = document.getElementById('register-email').value.trim();
    // password already declared above

    
    // Create username from firstname + lastname (remove spaces, lowercase)
    const username = (firstname + lastname).toLowerCase().replace(/\s+/g, '');
    
    // Validate username has no spaces (extra check)
    if (username.includes(' ')) {
      this.showErrorMessage(form, "Username cannot contain spaces. Please check your first and last name.");
      return;
    }
    
    // Check if user already exists
    if (checkIfUserExists(email, username)) {
      this.showErrorMessage(form, "An account with this email or username already exists. Please login.");
      return;
    }
    
    // Create user data object
    const userData = {
      name: username, // Use username as name for consistency
      firstname: firstname,
      lastname: lastname,
      email: email,
      username: username, // Username is firstname+lastname (e.g., johndoe)
      password: password,
      registrationDate: new Date().toISOString(),
      rememberMe: false
    };
    
    // Save user to registered users list
    if (saveUser(userData)) {
      // Also set as current user (auto-login after registration)
      setCurrentUser(userData, true); // Auto-enable remember me for new registrations
      
      // Show success message
      this.showSuccessMessage(form, "Registration successful! Redirecting...");
      
      // Redirect to homepage
      setTimeout(() => {
        this.clearFormAfterSuccess('register-form');
        window.location.href = getRedirectUrl();
      }, 2000);
    } else {
      this.showErrorMessage(form, "Error creating account. Please try again.");
    }
  }

  showSuccessMessage(form, message) {
    // Remove any existing messages
    const existingSuccess = form.querySelector('.form-success');
    const existingError = form.querySelector('.form-error');
    if (existingSuccess) existingSuccess.remove();
    if (existingError) existingError.remove();

    const successDiv = document.createElement('div');
    successDiv.className = 'form-success';
    successDiv.textContent = message;
    
    const submitButton = form.querySelector('.submit');
    submitButton.parentNode.insertBefore(successDiv, submitButton.nextSibling);
  }

  showErrorMessage(form, message) {
    // Remove any existing messages
    const existingError = form.querySelector('.form-error');
    const existingSuccess = form.querySelector('.form-success');
    if (existingError) existingError.remove();
    if (existingSuccess) existingSuccess.remove();

    const errorDiv = document.createElement('div');
    errorDiv.className = 'form-error';
    errorDiv.textContent = message;
    
    const submitButton = form.querySelector('.submit');
    submitButton.parentNode.insertBefore(errorDiv, submitButton.nextSibling);
  }

  clearFormAfterSuccess(formId) {
    const form = document.getElementById(formId);
    if (form) {
      const inputs = form.querySelectorAll('input[type="text"], input[type="email"], input[type="password"]');
      inputs.forEach(input => {
        input.value = '';
        // Remove data-has-value to reset label position
        input.removeAttribute('data-has-value');
      });
      
      // Clear checkboxes
      const checkboxes = form.querySelectorAll('input[type="checkbox"]');
      checkboxes.forEach(checkbox => {
        checkbox.checked = false;
      });
    }
  }
}

// Get redirect URL based on query parameter
function getRedirectUrl() {
  // First, check if there's a returnUrl parameter in the URL
  const urlParams = new URLSearchParams(window.location.search);
  const returnUrl = urlParams.get('returnUrl');
  
  const redirectMap = {
    'booking': '../BookingPage/index.html',
    'home': '../HomePage/index.html',
    'jobs': '../jobsPage/index.html',
    'shop': '../ShopPage/index.html',
    'partner': '../partnerPage/index.html',
    'bookingsystem': '../BookingSystem/index.html'
  };

  if (returnUrl && redirectMap[returnUrl]) {
    // Preserve shop param if present
    const shopId = urlParams.get('shop');
    const base = redirectMap[returnUrl];
    return shopId ? `${base}?shop=${shopId}` : base;
  }
  
  // If no returnUrl parameter, detect from referrer (previous page)
  const referrer = document.referrer;
  
  if (referrer) {
    if (referrer.includes('partnerPage') || referrer.includes('partner')) {
      return '../partnerPage/index.html';
    } else if (referrer.includes('BookingPage') || referrer.includes('booking')) {
      return '../BookingPage/index.html';
    } else if (referrer.includes('jobsPage') || referrer.includes('jobs')) {
      return '../jobsPage/index.html';
    } else if (referrer.includes('ShopPage') || referrer.includes('shop')) {
      return '../ShopPage/index.html';
    } else if (referrer.includes('HomePage') || referrer.includes('home')) {
      return '../HomePage/index.html';
    }
  }
  
  // Default to HomePage if nothing matches
  return '../HomePage/index.html';
}

// Utility functions
function clearMessages() {
  const messages = document.querySelectorAll('.warning, .success, .form-success, .form-error');
  messages.forEach(message => message.remove());
}

function clearFormInputs(formId) {
  const form = document.getElementById(formId);
  if (form) {
    const inputs = form.querySelectorAll('input[type="text"], input[type="email"], input[type="password"]');
    inputs.forEach(input => {
      input.value = '';
      // Remove valid state to reset label position
      input.removeAttribute('data-has-value');
    });
    
    // Clear checkboxes
    const checkboxes = form.querySelectorAll('input[type="checkbox"]');
    checkboxes.forEach(checkbox => {
      checkbox.checked = false;
    });
  }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
  // Initialize form handler
  new FormHandler();
  
  // Initialize label positions for any pre-filled inputs
  const allInputs = document.querySelectorAll('input[type="text"], input[type="email"], input[type="password"]');
  allInputs.forEach(input => {
    if (input.value.trim() !== '') {
      input.setAttribute('data-has-value', 'true');
    }
  });
  
  // Add smooth transitions for form switching
  const style = document.createElement('style');
  style.textContent = `
    .login-container, .register-container {
      transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
    }
  `;
  document.head.appendChild(style);
  
  // Initialize with login form visible
  login();
});

// Enhanced responsive behavior
window.addEventListener('resize', function() {
  if (window.innerWidth <= 540) {
    // Mobile adjustments
    const formBox = document.querySelector('.form-box');
    if (formBox) {
      formBox.style.height = 'auto';
      formBox.style.minHeight = '600px';
    }
  }
});

// Prevent form submission on Enter key in certain cases
document.addEventListener('keydown', function(e) {
  if (e.key === 'Enter' && e.target.type !== 'submit') {
    const form = e.target.closest('form');
    if (form) {
      e.preventDefault();
      const submitButton = form.querySelector('.submit');
      if (submitButton) {
        submitButton.click();
      }
    }
  }
});
// Terms & Conditions Sidebar Functions
function openTermsSidebar() {
  const sidebar = document.getElementById('termsSidebar');
  const overlay = document.getElementById('sidebarOverlay');
  
  sidebar.classList.add('active');
  overlay.classList.add('active');
  
  // Prevent body scroll when sidebar is open
  document.body.style.overflow = 'hidden';
}

function closeTermsSidebar() {
  const sidebar = document.getElementById('termsSidebar');
  const overlay = document.getElementById('sidebarOverlay');
  
  sidebar.classList.remove('active');
  overlay.classList.remove('active');
  
  // Restore body scroll
  document.body.style.overflow = '';
}

function acceptTerms() {
  // Check the terms checkbox
  const termsCheckbox = document.getElementById('terms-check');
  if (termsCheckbox) {
    termsCheckbox.checked = true;
    
    // Remove any warning messages
    const existingWarning = document.querySelector('.terms-warning');
    if (existingWarning) {
      existingWarning.remove();
    }
    
    // Remove red outline
    termsCheckbox.style.outline = '';
  }
  
  // Close the sidebar
  closeTermsSidebar();
}

// Close sidebar with Escape key
document.addEventListener('keydown', function(e) {
  if (e.key === 'Escape') {
    closeTermsSidebar();
  }
});

// Forgot Password Modal Functions
function openForgotPasswordModal() {
  const modal = document.getElementById('forgotPasswordModal');
  const overlay = document.getElementById('forgotPasswordOverlay');
  
  modal.classList.add('active');
  overlay.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeForgotPasswordModal() {
  const modal = document.getElementById('forgotPasswordModal');
  const overlay = document.getElementById('forgotPasswordOverlay');
  
  modal.classList.remove('active');
  overlay.classList.remove('active');
  document.body.style.overflow = '';
  
  // Clear form
  const form = document.getElementById('forgot-password-form');
  form.reset();
  
  // Clear error messages and invalid state
  const errorMessages = form.querySelectorAll('.modal-error');
  errorMessages.forEach(msg => msg.remove());
  
  const forgotEmail = document.getElementById('forgot-email');
  if (forgotEmail) {
    forgotEmail.removeAttribute('data-has-value');
    forgotEmail.classList.remove('invalid');
  }
}

function handleForgotPassword(e) {
  e.preventDefault();
  
  const form = e.target;
  const submitBtn = form.querySelector('.submit');
  
  // Prevent double submission
  if (submitBtn.disabled) return;
  
  const email = document.getElementById('forgot-email').value.trim();
  const emailInput = document.getElementById('forgot-email');
  
  // Clear any existing error messages
  const existingError = form.querySelector('.modal-error');
  if (existingError) existingError.remove();
  emailInput.classList.remove('invalid');
  
  // Basic email validation
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailPattern.test(email)) {
    // Show styled error message
    const errorDiv = document.createElement('div');
    errorDiv.className = 'modal-error';
    errorDiv.textContent = !email ? 'Please enter your email address' : 'Please enter a valid email address';
    
    const emailControl = emailInput.closest('.form-control');
    emailControl.appendChild(errorDiv);
    emailInput.classList.add('invalid');
    
    return;
  }
  
  // Disable button to prevent re-clicking
  submitBtn.disabled = true;
  submitBtn.textContent = 'Sending...';
  
  // Check if email exists in registered users
  const users = getAllUsers();
  const userExists = users.some(user => user.email.toLowerCase() === email.toLowerCase());
  
  if (userExists) {
    // Close the forgot password modal
    closeForgotPasswordModal();
    
    // Re-enable button after closing modal
    setTimeout(() => {
      submitBtn.disabled = false;
      submitBtn.textContent = 'Send Reset Link';
    }, 500);
    
    // Show styled confirmation alert
    setTimeout(() => {
      showResetConfirmation(email);
    }, 300);
  } else {
    // Re-enable button if email not found
    submitBtn.disabled = false;
    submitBtn.textContent = 'Send Reset Link';
    
    // Show styled error message
    const errorDiv = document.createElement('div');
    errorDiv.className = 'modal-error';
    errorDiv.textContent = 'No account found with this email address';
    
    const emailControl = emailInput.closest('.form-control');
    emailControl.appendChild(errorDiv);
    emailInput.classList.add('invalid');
  }
}

// Show reset confirmation alert
function showResetConfirmation(email) {
  const overlay = document.getElementById('confirmationOverlay');
  const text = document.getElementById('resetConfirmationText');
  
  text.textContent = `Password reset link has been sent to ${email}`;
  
  overlay.classList.add('active');
  document.body.style.overflow = 'hidden';
}

// Close reset confirmation alert
function closeResetConfirmation() {
  const overlay = document.getElementById('confirmationOverlay');
  
  overlay.classList.remove('active');
  document.body.style.overflow = '';
}

// Close modal with Escape key
document.addEventListener('keydown', function(e) {
  if (e.key === 'Escape') {
    closeForgotPasswordModal();
  }
});

// Password Strength Checker
function checkPasswordStrength(password) {
  let strength = 0;
  
  // Length check
  if (password.length >= 8) strength++;
  if (password.length >= 12) strength++;
  
  // Contains number
  if (/\d/.test(password)) strength++;
  
  // Contains lowercase and uppercase
  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++;
  
  // Contains special character
  if (/[^A-Za-z0-9]/.test(password)) strength++;
  
  return strength;
}

function updatePasswordStrength() {
  const password = document.getElementById('register-password').value;
  const strengthBar = document.querySelector('.password-strength-bar');
  const strengthFill = document.getElementById('password-strength-fill');
  const strengthText = document.getElementById('password-strength-text');
  const passwordField = document.querySelector('#register-password').closest('.form-control');
  
  // If password is empty, hide everything
  if (!password || password.length === 0) {
    strengthBar.classList.remove('visible');
    strengthText.classList.remove('visible');
    strengthText.textContent = '';
    passwordField.classList.remove('strength-weak', 'strength-medium', 'strength-strong');
    return;
  }
  
  // Show bar and text when user starts typing
  strengthBar.classList.add('visible');
  strengthText.classList.add('visible');
  
  const strength = checkPasswordStrength(password);
  
  // Remove all strength classes
  passwordField.classList.remove('strength-weak', 'strength-medium', 'strength-strong');
  
  if (strength <= 2) {
    passwordField.classList.add('strength-weak');
    strengthText.textContent = 'Weak password';
  } else if (strength <= 3) {
    passwordField.classList.add('strength-medium');
    strengthText.textContent = 'Medium password';
  } else {
    passwordField.classList.add('strength-strong');
    strengthText.textContent = 'Strong password';
  }
}

// Add event listener for password strength
document.addEventListener('DOMContentLoaded', function() {
  const registerPassword = document.getElementById('register-password');
  if (registerPassword) {
    registerPassword.addEventListener('input', updatePasswordStrength);
  }
  
  // Add event listener for terms checkbox to clear warning when checked
  const termsCheckbox = document.getElementById('terms-check');
  if (termsCheckbox) {
    termsCheckbox.addEventListener('change', function() {
      if (this.checked) {
        // Remove any existing warning
        const existingWarning = document.querySelector('.terms-warning');
        if (existingWarning) {
          existingWarning.remove();
        }
        // Remove red outline
        this.style.outline = '';
      }
    });
  }
  
  // Add event listeners to registration form inputs to clear error messages when user types
  const registerForm = document.getElementById('register-form');
  if (registerForm) {
    const registerInputs = registerForm.querySelectorAll('input[type="text"], input[type="email"], input[type="password"]');
    registerInputs.forEach(input => {
      input.addEventListener('input', function() {
        // Remove form-level error messages when user starts typing
        const formError = registerForm.querySelector('.form-error');
        if (formError) {
          formError.remove();
        }
      });
    });
  }
});

// Coming Soon Modal
document.addEventListener("DOMContentLoaded", function () {
  var overlay = document.getElementById("csOverlay");
  var closeBtn = document.getElementById("csClose");
  var storeLink = document.getElementById("storeNavLink");
  if (!overlay) return;
  function openModal(e) { e.preventDefault(); overlay.classList.add("active"); }
  function closeModal() { overlay.classList.remove("active"); }
  if (storeLink) storeLink.addEventListener("click", openModal);
  if (closeBtn) closeBtn.addEventListener("click", closeModal);
  overlay.addEventListener("click", function(e) { if (e.target === overlay) closeModal(); });
});