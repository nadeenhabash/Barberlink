/* ============================================================
   auth-navbar.js  —  Shared avatar, dropdown & modals logic
   
   HOW TO USE IN EACH PAGE:
   1. In your <head>, add:
        <link rel="stylesheet" href="../shared/auth-navbar.css" />
   
   2. In your nav, replace the avatar block AND login button with:
        <div id="auth-nav-mount"></div>
   
   3. Just before </body>, add:
        <script src="../shared/auth-navbar.js"></script>
   
   That's it. No HTML to copy. This file injects everything itself.
   Adjust the relative path (../shared/) to match your folder structure.
   ============================================================ */


/* ── 1. Inject HTML into the page ─────────────────────────── */

(function injectAuthHTML() {
  const mount = document.getElementById("auth-nav-mount");
  if (!mount) return;

  mount.innerHTML = `
    <!-- Avatar (shown when logged in) -->
    <div class="user-profile" id="userProfile" style="display:none;">
      <div class="avatar-circle" id="userAvatar"></div>
      <div class="profile-dropdown" id="profileDropdown">
        <div class="profile-info">
          <p class="profile-name" id="profileName">User Name</p>
          <p class="profile-email" id="profileEmail"></p>
        </div>
        <div class="dropdown-divider"></div>
        <a href="#" class="dropdown-link" id="profileSettingsBtn">Profile Settings</a>
        <a href="#" class="dropdown-link" id="myBookingsBtn">My Bookings</a>
        <a href="#" class="dropdown-link" id="logoutBtn">Logout</a>
      </div>
    </div>

    <!-- Login button (shown when logged out) -->
    <a href="../Signup-login/index.html" class="login-btn" id="loginBtn" style="display:none;">Login</a>

    <!-- Profile Settings Modal -->
    <div class="auth-modal-overlay" id="profileModal">
      <div class="modal-container">
        <div class="modal-header-settings">
          <h2>Profile Settings</h2>
          <i class="bx bx-x close-modal" id="closeProfileModalBtn"></i>
        </div>
        <div class="modal-body-settings">

          <!-- Options Menu -->
          <div class="settings-options">
            <div class="settings-option" id="openUsernameForm">
              <i class="bx bx-user-circle"></i>
              <div class="option-text">
                <h3>Change Username</h3>
                <p>Update your username</p>
              </div>
              <i class="bx bx-chevron-right"></i>
            </div>
            <div class="settings-option" id="openEmailForm">
              <i class="bx bx-envelope"></i>
              <div class="option-text">
                <h3>Change Email</h3>
                <p>Update your email address</p>
              </div>
              <i class="bx bx-chevron-right"></i>
            </div>
            <div class="settings-option" id="openPasswordForm">
              <i class="bx bx-lock-alt"></i>
              <div class="option-text">
                <h3>Change Password</h3>
                <p>Update your password</p>
              </div>
              <i class="bx bx-chevron-right"></i>
            </div>
          </div>

          <!-- Username Form -->
          <div class="settings-form" id="username-form" style="display:none;">
            <button class="back-button" id="backFromUsername">
              <i class="bx bx-arrow-back"></i> Back
            </button>
            <h3 class="form-title">Change Username</h3>
            <form id="username-change-form">
              <div class="profile-field">
                <label>Current Username</label>
                <div class="input-group">
                  <i class="bx bx-user-circle"></i>
                  <input type="text" id="current-username" readonly />
                </div>
              </div>
              <div class="profile-field">
                <label>New Username</label>
                <div class="input-group">
                  <i class="bx bx-user-circle"></i>
                  <input type="text" id="new-username" placeholder="Enter new username" required />
                </div>
                <span class="field-note">Username must be unique and 3+ characters</span>
              </div>
              <div id="username-message" class="form-message"></div>
              <div class="modal-actions">
                <button type="button" class="btn-cancel" id="cancelUsernameBtn">Cancel</button>
                <button type="submit" class="btn-save">Update Username</button>
              </div>
            </form>
          </div>

          <!-- Email Form -->
          <div class="settings-form" id="email-form" style="display:none;">
            <button class="back-button" id="backFromEmail">
              <i class="bx bx-arrow-back"></i> Back
            </button>
            <h3 class="form-title">Change Email</h3>
            <form id="email-change-form">
              <div class="profile-field">
                <label>Current Email</label>
                <div class="input-group">
                  <i class="bx bx-envelope"></i>
                  <input type="email" id="current-email" readonly />
                </div>
              </div>
              <div class="profile-field">
                <label>New Email</label>
                <div class="input-group">
                  <i class="bx bx-envelope"></i>
                  <input type="email" id="new-email" placeholder="Enter new email address" required />
                </div>
              </div>
              <div class="profile-field">
                <label>Confirm Password</label>
                <div class="input-group">
                  <i class="bx bx-lock-alt"></i>
                  <input type="password" id="confirm-email-password" placeholder="Enter your password" required />
                  <i class="bx bx-hide toggle-modal-password" data-target="confirm-email-password"></i>
                </div>
              </div>
              <div id="email-message" class="form-message"></div>
              <div class="modal-actions">
                <button type="button" class="btn-cancel" id="cancelEmailBtn">Cancel</button>
                <button type="submit" class="btn-save">Update Email</button>
              </div>
            </form>
          </div>

          <!-- Password Form -->
          <div class="settings-form" id="password-form" style="display:none;">
            <button class="back-button" id="backFromPassword">
              <i class="bx bx-arrow-back"></i> Back
            </button>
            <h3 class="form-title">Change Password</h3>
            <form id="password-change-form">
              <div class="profile-field">
                <label>Current Password</label>
                <div class="input-group">
                  <i class="bx bx-lock-alt"></i>
                  <input type="password" id="old-password" placeholder="Enter current password" required />
                  <i class="bx bx-hide toggle-modal-password" data-target="old-password"></i>
                </div>
                <a href="#" class="forgot-password-link" id="forgotPasswordLink">Forgot Password?</a>
              </div>
              <div class="profile-field">
                <label>New Password</label>
                <div class="input-group">
                  <i class="bx bx-lock-alt"></i>
                  <input type="password" id="new-password" placeholder="Enter new password" required />
                  <i class="bx bx-hide toggle-modal-password" data-target="new-password"></i>
                </div>
                <span class="field-note">Must be 8+ characters with at least 1 number</span>
              </div>
              <div class="profile-field">
                <label>Confirm New Password</label>
                <div class="input-group">
                  <i class="bx bx-lock-alt"></i>
                  <input type="password" id="confirm-new-password" placeholder="Confirm new password" required />
                  <i class="bx bx-hide toggle-modal-password" data-target="confirm-new-password"></i>
                </div>
              </div>
              <div id="password-message" class="form-message"></div>
              <div class="modal-actions">
                <button type="button" class="btn-cancel" id="cancelPasswordBtn">Cancel</button>
                <button type="submit" class="btn-save">Update Password</button>
              </div>
            </form>
          </div>

        </div>
      </div>
    </div>

    <!-- Forgot Password Modal -->
    <div class="fp-modal-overlay" id="forgotPasswordOverlay"></div>
    <div class="forgot-password-modal" id="forgotPasswordModal">
      <div class="fp-modal-header">
        <h3>Reset Password</h3>
        <button class="close-modal-btn" id="closeForgotPasswordBtn">×</button>
      </div>
      <div class="fp-modal-body">
        <p class="modal-description">Enter your email address and we'll send you a link to reset your password.</p>
        <form id="forgot-password-form">
          <div class="profile-field">
            <label>Email</label>
            <div class="input-group">
              <i class="bx bx-envelope"></i>
              <input type="email" id="forgot-email" placeholder="Enter your email" required />
            </div>
          </div>
          <button type="submit" class="btn-save" style="width:100%; margin-top:20px;">Send Reset Link</button>
        </form>
      </div>
    </div>

    <!-- Reset Confirmation Alert -->
    <div class="confirmation-overlay" id="confirmationOverlay">
      <div class="reset-confirmation-alert">
        <p class="reset-confirmation-text" id="resetConfirmationText">Password reset link has been sent</p>
        <button class="reset-confirmation-btn" id="resetConfirmationOkBtn">OK</button>
      </div>
    </div>

    <!-- My Bookings Modal -->
    <div class="auth-modal-overlay" id="myBookingsModal">
      <div class="modal-container bookings-modal-container">

        <!-- Header -->
        <div class="bk-modal-header">
          <div>
            <p class="bk-modal-eyebrow">Account</p>
            <h2 class="bk-modal-title">My Bookings</h2>
          </div>
          <i class="bx bx-x bk-modal-close" id="closeMyBookingsBtn"></i>
        </div>

        <!-- Tabs -->
        <div class="bookings-tabs">
          <button class="bookings-tab active" id="tabUpcoming" onclick="switchBookingsTab('upcoming')">Upcoming</button>
          <button class="bookings-tab" id="tabPast" onclick="switchBookingsTab('past')">Past</button>
        </div>

        <!-- Bookings List -->
        <div class="bookings-list" id="bookingsList"></div>

        <!-- ── Edit Panel ── -->
        <div class="bk-edit-panel" id="bookingEditPanel" style="display:none;">
          <div class="bk-edit-header">
            <button class="back-button" id="backFromEditBooking">
              <i class="bx bx-arrow-back"></i> Back
            </button>
            <h3 class="bk-edit-title">Edit Appointment</h3>
            <div class="bk-edit-shop-label" id="editShopLabel"></div>
          </div>

          <!-- Step indicator -->
          <div class="bk-edit-steps">
            <div class="bk-step active" id="stepTab1" onclick="switchEditStep(1)">
              <span class="bk-step-num">01</span>
              <span class="bk-step-lbl">Services</span>
            </div>
            <div class="bk-step-sep"></div>
            <div class="bk-step" id="stepTab2" onclick="switchEditStep(2)">
              <span class="bk-step-num">02</span>
              <span class="bk-step-lbl">Date & Time</span>
            </div>
          </div>

          <!-- Step 1: Services dropdown -->
          <div class="bk-edit-step-body" id="editStepServices">
            <p class="bk-edit-hint">Select one or more services for this appointment.</p>

            <div class="bk-svc-dropdown-wrap">
              <div class="bk-svc-dropdown-trigger" id="svcDropdownTrigger" onclick="toggleSvcDropdown()">
                <span class="bk-svc-trigger-text" id="svcTriggerText">Choose services</span>
                <i class="bx bx-chevron-down"></i>
              </div>
              <div class="bk-svc-dropdown-menu" id="svcDropdownMenu"></div>
            </div>

            <div class="bk-svc-chips" id="svcChips"></div>
            <div class="bk-svc-total-row" id="editSvcTotal"></div>
          </div>

          <!-- Step 2: Date & Time side by side -->
          <div class="bk-edit-step-body" id="editStepDateTime" style="display:none;">
            <p class="bk-edit-hint">Pick a new date, then select a time slot.</p>
            <div class="bk-dt-grid">
              <!-- Mini calendar -->
              <div class="bk-dt-field">
                <label>Date</label>
                <div class="bk-mini-cal">
                  <div class="bk-mini-cal-nav">
                    <button class="bk-mini-cal-arrow" id="bkCalPrev"><i class="bx bx-chevron-left"></i></button>
                    <span class="bk-mini-cal-lbl" id="bkCalLabel"></span>
                    <button class="bk-mini-cal-arrow" id="bkCalNext"><i class="bx bx-chevron-right"></i></button>
                  </div>
                  <div class="bk-mini-cal-dow">
                    <span>Su</span><span>Mo</span><span>Tu</span><span>We</span><span>Th</span><span>Fr</span><span>Sa</span>
                  </div>
                  <div class="bk-mini-cal-grid" id="bkCalGrid"></div>
                </div>
              </div>
              <!-- Time column -->
              <div class="bk-dt-field">
                <label>Time</label>
                <div class="bk-time-col">
                  <div class="bk-time-col-hdr placeholder" id="bkTimeColHdr">Select a date first</div>
                  <div class="bk-time-slots-scroll" id="bkTimeGrid">
                    <div class="bk-time-placeholder">← Pick a date</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div id="edit-booking-message" class="form-message" style="margin: 0 30px 10px;"></div>

          <div class="bk-edit-footer">
            <button type="button" class="btn-cancel" id="cancelEditBookingBtn">Discard</button>
            <button type="button" class="btn-save" id="saveEditBookingBtn">Save Changes</button>
          </div>
        </div>

        <!-- ── Delete Confirmation ── -->
        <div class="booking-delete-confirm" id="bookingDeleteConfirm" style="display:none;">
          <div class="delete-confirm-inner">
            <div class="bk-del-icon-wrap"><i class="bx bx-calendar-x"></i></div>
            <p class="bk-del-title">Cancel this appointment?</p>
            <p class="bk-del-sub">This action cannot be undone. The slot will be released.</p>
            <div class="modal-actions" style="margin-top:28px;">
              <button type="button" class="btn-cancel" id="cancelDeleteBtn">Keep It</button>
              <button type="button" class="btn-delete-confirm" id="confirmDeleteBtn">Yes, Cancel</button>
            </div>
          </div>
        </div>

      </div>
    </div>
  `;
})();


/* ── 2. Helper: read/write storage ─────────────────────────── */

function getUserData() {
  try {
    return JSON.parse(localStorage.getItem("userData") || sessionStorage.getItem("userData"));
  } catch { return null; }
}

function getCurrentUserFull() {
  try {
    return JSON.parse(localStorage.getItem("currentUser") || sessionStorage.getItem("currentUser"));
  } catch { return null; }
}

function getAllRegisteredUsers() {
  try {
    return JSON.parse(localStorage.getItem("registeredUsers")) || [];
  } catch { return []; }
}

function updateCurrentSession(updatedUser) {
  const rememberMe = updatedUser.rememberMe || false;
  const userData = { name: updatedUser.username || updatedUser.name, email: updatedUser.email };

  const keep   = rememberMe ? localStorage   : sessionStorage;
  const remove = rememberMe ? sessionStorage  : localStorage;

  keep.setItem("currentUser", JSON.stringify(updatedUser));
  keep.setItem("userData",    JSON.stringify(userData));
  remove.removeItem("currentUser");
  remove.removeItem("userData");

  displayUserProfile();
}


/* ── 3. Avatar & dropdown ───────────────────────────────────── */

function displayUserProfile() {
  const user        = getUserData();
  const userProfile = document.getElementById("userProfile");
  const loginBtn    = document.getElementById("loginBtn");
  const userAvatar  = document.getElementById("userAvatar");
  const profileName = document.getElementById("profileName");
  const profileEmail= document.getElementById("profileEmail");

  if (user && user.name) {
    userAvatar.textContent   = user.name.charAt(0).toUpperCase();
    profileName.textContent  = user.name;
    profileEmail.textContent = user.email || "";
    if (userProfile) userProfile.style.display = "block";
    if (loginBtn)    loginBtn.style.display    = "none";
  } else {
    if (userProfile) userProfile.style.display = "none";
    if (loginBtn)    loginBtn.style.display    = "block";
  }
}

function toggleProfileDropdown() {
  document.getElementById("profileDropdown").classList.toggle("show");
}


/* ── 4. Logout ──────────────────────────────────────────────── */

function showLogoutModal() {
  const overlay = document.createElement("div");
  overlay.className = "logout-alert-overlay";
  overlay.innerHTML = `
    <div class="logout-alert">
      <p>Are you sure you want to logout?</p>
      <div class="logout-alert-buttons">
        <button class="alert-cancel" id="logoutCancelBtn">Cancel</button>
        <button class="alert-confirm" id="logoutConfirmBtn">Logout</button>
      </div>
    </div>`;
  document.body.appendChild(overlay);
  setTimeout(() => overlay.classList.add("active"), 10);

  overlay.querySelector("#logoutCancelBtn").addEventListener("click", () => {
    overlay.classList.remove("active");
    setTimeout(() => overlay.remove(), 300);
  });

  overlay.querySelector("#logoutConfirmBtn").addEventListener("click", () => {
    ["userData", "currentUser"].forEach(k => {
      localStorage.removeItem(k);
      sessionStorage.removeItem(k);
    });
    window.location.reload();
  });
}


/* ── 5. Profile Settings Modal ─────────────────────────────── */

function openProfileModal() {
  if (!getUserData()) { alert("Please login first"); return; }
  showSettingsOptions();
  document.getElementById("profileModal").classList.add("active");
  document.body.style.overflow = "hidden";
}

function closeProfileModal() {
  document.getElementById("profileModal").classList.remove("active");
  document.body.style.overflow = "";
  setTimeout(showSettingsOptions, 300);
}

function showSettingsOptions() {
  document.querySelector(".settings-options").style.display = "block";
  ["username-form","email-form","password-form"].forEach(id => {
    document.getElementById(id).style.display = "none";
  });
  ["username-change-form","email-change-form","password-change-form"].forEach(id => {
    document.getElementById(id).reset();
  });
  ["username-message","email-message","password-message"].forEach(clearFormMessage);
}

function showSettingForm(formType) {
  const currentUser = getCurrentUserFull();
  if (!currentUser) return;

  document.querySelector(".settings-options").style.display = "none";

  if (formType === "username") {
    document.getElementById("username-form").style.display = "block";
    document.getElementById("current-username").value = currentUser.username || currentUser.name || "";
  } else if (formType === "email") {
    document.getElementById("email-form").style.display = "block";
    document.getElementById("current-email").value = currentUser.email || "";
  } else if (formType === "password") {
    document.getElementById("password-form").style.display = "block";
  }
}

function showFormMessage(id, message, type = "success") {
  const el = document.getElementById(id);
  el.textContent  = message;
  el.className    = `form-message ${type}`;
  el.style.display = "block";
}

function clearFormMessage(id) {
  const el = document.getElementById(id);
  el.textContent  = "";
  el.className    = "form-message";
  el.style.display = "none";
}

function toggleModalPassword(inputId) {
  const input = document.getElementById(inputId);
  const icon  = document.querySelector(`[data-target="${inputId}"]`);
  const isPass = input.type === "password";
  input.type = isPass ? "text" : "password";
  icon.classList.toggle("bx-hide",  !isPass);
  icon.classList.toggle("bx-show",   isPass);
}


/* ── 6. Forgot Password ─────────────────────────────────────── */

function openForgotPasswordModal() {
  document.getElementById("forgotPasswordModal").classList.add("active");
  document.getElementById("forgotPasswordOverlay").classList.add("active");
  document.body.style.overflow = "hidden";
}

function closeForgotPasswordModal() {
  document.getElementById("forgotPasswordModal").classList.remove("active");
  document.getElementById("forgotPasswordOverlay").classList.remove("active");
  document.body.style.overflow = "";
  document.getElementById("forgot-password-form").reset();
  document.querySelectorAll(".modal-error").forEach(el => el.remove());
  const input = document.getElementById("forgot-email");
  if (input) input.classList.remove("invalid");
}

function showResetConfirmation(email) {
  document.getElementById("resetConfirmationText").textContent =
    `Password reset link has been sent to ${email}`;
  document.getElementById("confirmationOverlay").classList.add("active");
  document.body.style.overflow = "hidden";
}

function closeResetConfirmation() {
  document.getElementById("confirmationOverlay").classList.remove("active");
  document.body.style.overflow = "";
}


/* ── 8. My Bookings Modal ───────────────────────────────────── */

let _activeBookingsTab = 'upcoming';
let _editingBookingRef = null;
let _deletingBookingRef = null;
let _editCalYear = new Date().getFullYear();
let _editCalMonth = new Date().getMonth();
let _editSelDate = null;
let _editSelTime = null;
let _editSelSvcs = [];
let _editShopSvcs = [];

/* ── Open / Close ── */
function openMyBookingsModal() {
  if (!getUserData()) { alert("Please login first"); return; }
  _activeBookingsTab = 'upcoming';
  renderBookingsList();
  document.getElementById('myBookingsModal').classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeMyBookingsModal() {
  document.getElementById('myBookingsModal').classList.remove('active');
  document.body.style.overflow = '';
  hideBookingEditPanel();
  hideBookingDeleteConfirm();
}

function switchBookingsTab(tab) {
  _activeBookingsTab = tab;
  document.getElementById('tabUpcoming').classList.toggle('active', tab === 'upcoming');
  document.getElementById('tabPast').classList.toggle('active', tab === 'past');
  renderBookingsList();
}

/* ── Data helpers ── */
function getUserBookings() {
  let user = null;
  try { user = JSON.parse(localStorage.getItem('userData') || sessionStorage.getItem('userData')); } catch(e) {}
  const all = (() => { try { return JSON.parse(localStorage.getItem('barberlink_bookings') || '[]'); } catch(e) { return []; } })();
  if (!user) return all;
  const ue = (user.email || '').toLowerCase();
  const un = (user.name  || '').toLowerCase();
  return all.filter(bk =>
    (bk.userEmail && bk.userEmail.toLowerCase() === ue) ||
    (bk.email     && bk.email.toLowerCase()     === ue) ||
    (bk.client    && bk.client.toLowerCase()    === un)
  );
}

function daysUntil(dateStr, timeStr) {
  const t = new Date();
  const a = new Date(dateStr);
  a.setHours(0,0,0,0);
  const dayDiff = Math.round((a - new Date(t.getFullYear(), t.getMonth(), t.getDate())) / 86400000);
  // If it's today, check whether the actual appointment time has already passed
  if (dayDiff === 0 && timeStr) {
    const [h, m] = timeStr.split(':').map(Number);
    const appt = new Date(dateStr);
    appt.setHours(h, m, 0, 0);
    if (appt < t) return -1; // time has passed → treat as past
  }
  return dayDiff;
}

const SHOPS_DATA = {
  'Fares Barbershop': [
    {id:1,name:'Classic Haircut',dur:30,price:10},{id:2,name:'Hot Towel Shave',dur:25,price:10},
    {id:3,name:'Haircut & Beard Trim',dur:45,price:15},{id:4,name:'Kids Cut',dur:20,price:5},
    {id:5,name:'Hair Colour',dur:60,price:25},{id:6,name:'Scalp Treatment',dur:40,price:22},
    {id:7,name:'Gentleman Package',dur:75,price:20},{id:8,name:'VIP Grooming',dur:90,price:40},
    {id:9,name:'Kids & Dad Package',dur:60,price:13},{id:10,name:'Wedding Package',dur:120,price:50},
    {id:11,name:'Refresh Package',dur:70,price:18}
  ],
  'Capri Barbershop': [
    {id:1,name:'Classic Haircut',dur:30,price:6},{id:2,name:'Fade',dur:40,price:8},
    {id:3,name:'Beard Trim',dur:20,price:4},{id:4,name:'Hair Coloring',dur:60,price:20},
    {id:5,name:'Haircut & Beard',dur:50,price:9},{id:6,name:'Kids Cut',dur:25,price:5},
    {id:7,name:'Student Package',dur:40,price:7},{id:8,name:'Fade Master Package',dur:70,price:16},
    {id:9,name:'Weekend Refresh',dur:60,price:14},{id:10,name:'Executive Package',dur:85,price:25},
    {id:11,name:'Color & Style Package',dur:100,price:30},{id:12,name:'Father & Son Package',dur:65,price:10}
  ],
  'O&M Barbershop': [
    {id:1,name:'Classic Haircut',dur:30,price:8},{id:2,name:'Skin Fade',dur:45,price:12},
    {id:3,name:'Beard Sculpting',dur:30,price:8},{id:4,name:'Haircut & Beard',dur:55,price:15},
    {id:5,name:'Hair Design',dur:60,price:18},{id:6,name:'Scalp Treatment',dur:40,price:14},
    {id:7,name:'Kids Cut',dur:25,price:6},{id:8,name:'Luxury Groom Package',dur:90,price:22},
    {id:9,name:'Style & Design Package',dur:95,price:24},{id:10,name:'Royal VIP Package',dur:110,price:30},
    {id:11,name:'Color Transformation',dur:120,price:32},{id:12,name:'Groom Wedding Package',dur:140,price:40}
  ]
};

/* ── Render cards list ── */
function renderBookingsList() {
  const list = document.getElementById('bookingsList');
  document.getElementById('bookingEditPanel').style.display    = 'none';
  document.getElementById('bookingDeleteConfirm').style.display = 'none';
  list.style.display = 'block';

  const bookings = getUserBookings();
  const now = new Date();
  const getDateTime = bk => {
    if (!bk.date) return new Date(0);
    const d = new Date(bk.date);
    if (bk.time) { const [h,m] = bk.time.split(':').map(Number); d.setHours(h,m,0,0); }
    return d;
  };
  const upcoming = bookings.filter(bk => bk.date && getDateTime(bk) >= now).sort((a,b) => getDateTime(a)-getDateTime(b));
  const past     = bookings.filter(bk => !bk.date || getDateTime(bk) < now).sort((a,b) => getDateTime(b)-getDateTime(a));
  const shown    = _activeBookingsTab === 'upcoming' ? upcoming : past;

  if (shown.length === 0) {
    list.innerHTML = `<div class="bookings-empty"><i class="bx bx-calendar-x"></i><p>${_activeBookingsTab === 'upcoming' ? 'No upcoming appointments' : 'No past appointments'}</p></div>`;
    return;
  }

  list.innerHTML = shown.map(bk => {
    const d = daysUntil(bk.date, bk.time);
    const isPast = d < 0;
    const dateLabel = new Date(bk.date).toLocaleDateString('en-GB', { weekday:'long', day:'numeric', month:'long', year:'numeric' });
    const canEdit   = !isPast && d > 1;
    const canDelete = !isPast && d > 3;
    const statusLabel = isPast ? 'Past' : (d === 0 ? 'Today' : d === 1 ? 'Tomorrow' : `In ${d} days`);
    const statusClass = isPast ? 'bk-status-past' : (d <= 1 ? 'bk-status-soon' : 'bk-status-upcoming');
    const svcs = Array.isArray(bk.svcs) ? bk.svcs : (bk.svcs ? [bk.svcs] : []);
    const svcsLines = svcs.map(s => `<span class="bk-svc-line"><i class="bx bx-minus"></i>${s}</span>`).join('');

    const lockedBadge = (!isPast && !canEdit && !canDelete) ? `
      <div class="bk-locked-badge">
        <i class="bx bx-lock-alt"></i>
        <span>Modification window closed</span>
      </div>` : '';

    return `
      <div class="booking-card">
        <div class="bk-card-top">
          <div class="bk-card-top-left">
            <span class="bk-shop-name">${bk.shop}</span>
            <span class="bk-status ${statusClass}">${statusLabel}</span>
          </div>
          <span class="bk-total">${bk.total} <small>JD</small></span>
        </div>

        <div class="bk-card-body">
          <div class="bk-info-row">
            <div class="bk-info-col">
              <span class="bk-info-label">Date</span>
              <span class="bk-info-val">${dateLabel}</span>
            </div>
            <div class="bk-info-col">
              <span class="bk-info-label">Time</span>
              <span class="bk-info-val">${bk.time || '—'}</span>
            </div>
          </div>
          <div class="bk-info-row">
            <div class="bk-info-col">
              <span class="bk-info-label">Barber</span>
              <span class="bk-info-val">${bk.staff || '—'}</span>
            </div>
            <div class="bk-info-col">
              <span class="bk-info-label">Payment</span>
              <span class="bk-info-val">${bk.payment === 'cash' ? 'Cash on arrival' : 'Visa Card'}</span>
            </div>
          </div>
          <div class="bk-svcs-block">
            <span class="bk-info-label">Services</span>
            <div class="bk-svcs-lines">${svcsLines || '<span class="bk-info-val">—</span>'}</div>
          </div>
        </div>

        ${lockedBadge}

        ${isPast ? (() => {
          const existingRating = bk.rating || 0;
          if (existingRating > 0) {
            return `<div class="bk-rating-row bk-rating-done">
              <span class="bk-rating-label">Your rating</span>
              <div class="bk-stars-display">
                ${[1,2,3,4,5].map(n => `<i class="bx bxs-star" style="color:${n <= existingRating ? '#c8a86a' : '#ddd'}"></i>`).join('')}
              </div>
            </div>`;
          } else {
            return `<div class="bk-rating-row" id="bk-rate-${bk.ref}">
              <span class="bk-rating-label">How was your visit?</span>
              <div class="bk-stars-input">
                ${[1,2,3,4,5].map(n => `<i class="bx bx-star bk-star" data-val="${n}" data-ref="${bk.ref}" onmouseover="bkStarHover('${bk.ref}',${n})" onmouseout="bkStarOut('${bk.ref}')" onclick="bkStarClick('${bk.ref}',${n})"></i>`).join('')}
              </div>
            </div>`;
          }
        })() : ''}

        ${(canEdit || canDelete) ? `
        <div class="bk-card-actions">
          ${canEdit   ? `<button class="bk-btn bk-edit"   onclick="openBookingEdit('${bk.ref}')"><i class="bx bx-edit-alt"></i> Edit</button>` : ''}
          ${canDelete ? `<button class="bk-btn bk-delete" onclick="openBookingDelete('${bk.ref}')"><i class="bx bx-x"></i> Cancel</button>` : ''}
        </div>` : ''}
      </div>`;
  }).join('');
}

/* ── Star Rating ── */
function bkStarHover(ref, val) {
  document.querySelectorAll(`#bk-rate-${ref} .bk-star`).forEach(s => {
    const n = parseInt(s.dataset.val);
    s.className = n <= val ? 'bx bxs-star bk-star bk-star-lit' : 'bx bx-star bk-star';
  });
}
function bkStarOut(ref) {
  document.querySelectorAll(`#bk-rate-${ref} .bk-star`).forEach(s => {
    s.className = 'bx bx-star bk-star';
  });
}
function bkStarClick(ref, val) {
  const bookings = (() => { try { return JSON.parse(localStorage.getItem('barberlink_bookings')||'[]'); } catch(e){return[];} })();
  const idx = bookings.findIndex(b => b.ref === ref);
  if (idx === -1) return;
  bookings[idx].rating = val;
  bookings[idx].ratedAt = new Date().toISOString();
  localStorage.setItem('barberlink_bookings', JSON.stringify(bookings));
  const row = document.getElementById(`bk-rate-${ref}`);
  if (row) {
    row.classList.add('bk-rating-done');
    row.innerHTML = `<span class="bk-rating-label">Your rating</span>
      <div class="bk-stars-display">
        ${[1,2,3,4,5].map(n => `<i class="bx bxs-star" style="color:${n <= val ? '#c8a86a' : '#ddd'}"></i>`).join('')}
      </div>`;
  }
}

/* ── Edit flow ── */
function openBookingEdit(ref) {
  _editingBookingRef = ref;
  const bookings = (() => { try { return JSON.parse(localStorage.getItem('barberlink_bookings')||'[]'); } catch(e){return[];} })();
  const bk = bookings.find(b => b.ref === ref);
  if (!bk) return;

  document.getElementById('bookingsList').style.display = 'none';
  document.getElementById('bookingDeleteConfirm').style.display = 'none';
  document.getElementById('bookingEditPanel').style.display = 'block';
  clearFormMessage('edit-booking-message');

  document.getElementById('editShopLabel').textContent = bk.shop + (bk.staff ? ' · ' + bk.staff : '');

  // Load shop services
  _editShopSvcs = SHOPS_DATA[bk.shop] || [];
  _editSelSvcs  = Array.isArray(bk.svcs) ? [...bk.svcs] : (bk.svcs ? [bk.svcs] : []);

  // Calendar defaults
  const cur = new Date(bk.date);
  _editCalYear  = cur.getFullYear();
  _editCalMonth = cur.getMonth();
  _editSelDate  = bk.date ? cur.toISOString().slice(0,10) : null;
  _editSelTime  = bk.time || null;

  switchEditStep(1);
}

function switchEditStep(n) {
  document.getElementById('stepTab1').classList.toggle('active', n === 1);
  document.getElementById('stepTab2').classList.toggle('active', n === 2);
  document.getElementById('editStepServices').style.display  = n === 1 ? 'block' : 'none';
  document.getElementById('editStepDateTime').style.display  = n === 2 ? 'block' : 'none';

  if (n === 1) renderEditSvcList();
  if (n === 2) { renderEditCalendar(); renderTimeColumn(); }
}

let _svcDropdownOpen = false;

/* called by switchEditStep(1) */
function renderEditSvcList() {
  _svcDropdownOpen = false;
  const trigger = document.getElementById('svcDropdownTrigger');
  const menu    = document.getElementById('svcDropdownMenu');
  if (trigger) trigger.classList.remove('open');
  if (menu)    menu.classList.remove('open');
  _renderSvcMenu();
  _renderSvcChips();
  _updateSvcTotal();
  _updateSvcTriggerText();
}

function toggleSvcDropdown() {
  _svcDropdownOpen = !_svcDropdownOpen;
  document.getElementById('svcDropdownTrigger').classList.toggle('open', _svcDropdownOpen);
  document.getElementById('svcDropdownMenu').classList.toggle('open', _svcDropdownOpen);
}

function _renderSvcMenu() {
  const menu = document.getElementById('svcDropdownMenu');
  if (!menu) return;
  menu.innerHTML = _editShopSvcs.map(s => {
    const sel  = _editSelSvcs.includes(s.name);
    const safe = s.name.replace(/\\/g,'\\\\').replace(/'/g,"\\'");
    return `<div class="bk-svc-option${sel?' selected':''}" onclick="toggleSvcOption('${safe}',this)">
      <div class="bk-svc-opt-left">
        <div class="bk-svc-opt-check"><i class="bx bx-check"></i></div>
        <div>
          <div class="bk-svc-opt-name">${s.name}</div>
          <div class="bk-svc-opt-dur">${s.dur} min</div>
        </div>
      </div>
      <span class="bk-svc-opt-price">${s.price} JD</span>
    </div>`;
  }).join('');
}

function toggleSvcOption(name, el) {
  const idx = _editSelSvcs.indexOf(name);
  if (idx === -1) _editSelSvcs.push(name);
  else            _editSelSvcs.splice(idx, 1);
  const nowSel = _editSelSvcs.includes(name);
  el.classList.toggle('selected', nowSel);
  _renderSvcChips();
  _updateSvcTotal();
  _updateSvcTriggerText();
}

function removeSvcChip(name) {
  const idx = _editSelSvcs.indexOf(name);
  if (idx !== -1) _editSelSvcs.splice(idx, 1);
  _renderSvcMenu();
  _renderSvcChips();
  _updateSvcTotal();
  _updateSvcTriggerText();
}

function _renderSvcChips() {
  const el = document.getElementById('svcChips');
  if (!el) return;
  el.innerHTML = _editSelSvcs.map(name => {
    const safe = name.replace(/\\/g,'\\\\').replace(/'/g,"\\'");
    return `<div class="bk-svc-chip">${name}<span class="bk-svc-chip-x" onclick="removeSvcChip('${safe}')">×</span></div>`;
  }).join('');
}

function _updateSvcTriggerText() {
  const el = document.getElementById('svcTriggerText');
  if (!el) return;
  if (_editSelSvcs.length === 0) {
    el.textContent = 'Choose services';
    el.classList.remove('has-sel');
  } else {
    el.textContent = _editSelSvcs.length === 1 ? _editSelSvcs[0] : _editSelSvcs.length + ' services selected';
    el.classList.add('has-sel');
  }
}

function _updateSvcTotal() {
  const total = _editSelSvcs.reduce((sum, name) => {
    const s = _editShopSvcs.find(x => x.name === name);
    return sum + (s ? s.price : 0);
  }, 0);
  const el = document.getElementById('editSvcTotal');
  if (!el) return;
  el.innerHTML = _editSelSvcs.length
    ? `<span class="bk-svc-total-lbl">${_editSelSvcs.length} service${_editSelSvcs.length>1?'s':''}</span><span class="bk-svc-total-val">${total} JD</span>`
    : `<span class="bk-svc-total-none">Select at least one service</span>`;
}

/* ── Custom Calendar ── */
const MN_FULL = ['January','February','March','April','May','June','July','August','September','October','November','December'];
const MN_SHORT = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

function renderEditCalendar() {
  document.getElementById('bkCalLabel').textContent = MN_SHORT[_editCalMonth] + ' ' + _editCalYear;
  const grid = document.getElementById('bkCalGrid');
  const today = new Date(); today.setHours(0,0,0,0);
  const minDate = new Date(); minDate.setDate(minDate.getDate() + 2); minDate.setHours(0,0,0,0);
  const firstDay = new Date(_editCalYear, _editCalMonth, 1).getDay();
  const daysInMonth = new Date(_editCalYear, _editCalMonth + 1, 0).getDate();

  let html = '';
  for (let i = 0; i < firstDay; i++) html += '<div class="bk-mini-cal-cell empty"></div>';
  for (let d = 1; d <= daysInMonth; d++) {
    const dateObj = new Date(_editCalYear, _editCalMonth, d);
    dateObj.setHours(0,0,0,0);
    const ds = `${_editCalYear}-${String(_editCalMonth+1).padStart(2,'0')}-${String(d).padStart(2,'0')}`;
    const isPast  = dateObj < minDate;
    const isSel   = ds === _editSelDate;
    const isToday = dateObj.getTime() === today.getTime();
    html += `<div class="bk-mini-cal-cell ${isPast?'disabled':''} ${isSel?'selected':''} ${isToday&&!isSel?'today':''}"
      ${!isPast ? `onclick="selectEditDate('${ds}')"` : ''}>${d}</div>`;
  }
  grid.innerHTML = html;
}

function selectEditDate(ds) {
  _editSelDate = ds;
  _editSelTime = null;
  renderEditCalendar();
  renderTimeColumn();
}

function renderTimeColumn() {
  const hdr   = document.getElementById('bkTimeColHdr');
  const grid  = document.getElementById('bkTimeGrid');
  if (!_editSelDate) {
    hdr.textContent = 'Select a date first';
    hdr.classList.add('placeholder');
    grid.innerHTML = '<div class="bk-time-placeholder">← Pick a date</div>';
    return;
  }
  const d = new Date(_editSelDate);
  hdr.textContent = d.toLocaleDateString('en-GB', { weekday:'short', day:'numeric', month:'short' });
  hdr.classList.remove('placeholder');

  // Read admin hours for this shop
  const SHOP_KEY_MAP = {'Fares Barbershop':'fares','Capri Barbershop':'capri','O&M Barbershop':'om'};
  let openH = 9, closeH = 20;
  try {
    const bk = JSON.parse(localStorage.getItem('barberlink_bookings')||'[]').find(b=>b.ref===_editingBookingRef);
    const shopKey = bk ? (SHOP_KEY_MAP[bk.shop]||'fares') : 'fares';
    const hours = JSON.parse(localStorage.getItem('barberlink_hours')||'{}');
    const sh = hours[shopKey];
    if (sh && sh.open)  openH  = parseInt(sh.open.split(':')[0]);
    if (sh && sh.close) closeH = parseInt(sh.close.split(':')[0]);
  } catch(e) {}

  const slots = [];
  for (let h = openH; h < closeH; h++) {
    slots.push(String(h).padStart(2,'0') + ':00');
    slots.push(String(h).padStart(2,'0') + ':30');
  }
  slots.push(String(closeH).padStart(2,'0') + ':00');

  grid.innerHTML = slots.map(t =>
    `<div class="bk-time-slot ${t === _editSelTime ? 'selected' : ''}" onclick="selectEditTime('${t}')">${t}</div>`
  ).join('');
}

function selectEditTime(t) {
  _editSelTime = t;
  document.querySelectorAll('#bkTimeGrid .bk-time-slot').forEach(el => {
    el.classList.toggle('selected', el.textContent === t);
  });
}

function hideBookingEditPanel() {
  document.getElementById('bookingEditPanel').style.display = 'none';
  document.getElementById('bookingsList').style.display = 'block';
  _editingBookingRef = null;
}

function saveBookingEdit() {
  if (_editSelSvcs.length === 0) { showFormMessage('edit-booking-message','Please select at least one service.','error'); switchEditStep(1); return; }
  if (!_editSelDate) { showFormMessage('edit-booking-message','Please select a new date.','error'); switchEditStep(2); return; }
  if (!_editSelTime) { showFormMessage('edit-booking-message','Please select a new time.','error'); switchEditStep(2); return; }

  const chosen = new Date(_editSelDate); chosen.setHours(0,0,0,0);
  const today  = new Date(); today.setHours(0,0,0,0);
  if (Math.round((chosen-today)/86400000) <= 1) {
    showFormMessage('edit-booking-message','New date must be at least 2 days from today.','error');
    switchEditStep(2); return;
  }

  try {
    const bookings = JSON.parse(localStorage.getItem('barberlink_bookings')||'[]');
    const idx = bookings.findIndex(b => b.ref === _editingBookingRef);
    if (idx === -1) { showFormMessage('edit-booking-message','Booking not found.','error'); return; }

    const shopSvcs = SHOPS_DATA[bookings[idx].shop] || [];
    const newTotal = _editSelSvcs.reduce((sum,name) => {
      const s = shopSvcs.find(x => x.name === name);
      return sum + (s ? s.price : 0);
    }, 0);

    bookings[idx].svcs  = _editSelSvcs;
    bookings[idx].date  = new Date(_editSelDate).toISOString();
    bookings[idx].time  = _editSelTime;
    bookings[idx].total = newTotal;

    localStorage.setItem('barberlink_bookings', JSON.stringify(bookings));
    showFormMessage('edit-booking-message','Appointment updated successfully!','success');
    setTimeout(() => { hideBookingEditPanel(); renderBookingsList(); }, 1200);
  } catch(e) {
    showFormMessage('edit-booking-message','An error occurred. Please try again.','error');
  }
}

/* ── Delete flow ── */
function openBookingDelete(ref) {
  _deletingBookingRef = ref;
  document.getElementById('bookingsList').style.display = 'none';
  document.getElementById('bookingEditPanel').style.display = 'none';
  document.getElementById('bookingDeleteConfirm').style.display = 'block';
}

function hideBookingDeleteConfirm() {
  document.getElementById('bookingDeleteConfirm').style.display = 'none';
  document.getElementById('bookingsList').style.display = 'block';
  _deletingBookingRef = null;
}

function confirmBookingDelete() {
  try {
    const bookings = JSON.parse(localStorage.getItem('barberlink_bookings')||'[]');
    localStorage.setItem('barberlink_bookings', JSON.stringify(bookings.filter(b => b.ref !== _deletingBookingRef)));
    hideBookingDeleteConfirm();
    renderBookingsList();
  } catch(e) {}
}


/* ── 7. Wire everything up on DOMContentLoaded ──────────────── */

document.addEventListener("DOMContentLoaded", function () {

  // Display avatar or login button
  displayUserProfile();

  // Avatar click → toggle dropdown
  document.getElementById("userAvatar").addEventListener("click", e => {
    e.stopPropagation();
    toggleProfileDropdown();
  });

  // Close dropdown on outside click
  document.addEventListener("click", function (e) {
    const userProfile = document.getElementById("userProfile");
    const dropdown    = document.getElementById("profileDropdown");
    if (userProfile && !userProfile.contains(e.target)) {
      dropdown.classList.remove("show");
    }
  });

  // Logout button
  document.getElementById("logoutBtn").addEventListener("click", e => {
    e.preventDefault();
    showLogoutModal();
  });

  // Profile Settings link in dropdown
  document.getElementById("profileSettingsBtn").addEventListener("click", e => {
    e.preventDefault();
    document.getElementById("profileDropdown").classList.remove("show");
    openProfileModal();
  });

  // Close profile modal
  document.getElementById("closeProfileModalBtn").addEventListener("click", closeProfileModal);
  document.getElementById("profileModal").addEventListener("click", e => {
    if (e.target === document.getElementById("profileModal")) closeProfileModal();
  });

  // Settings option buttons
  document.getElementById("openUsernameForm").addEventListener("click", () => showSettingForm("username"));
  document.getElementById("openEmailForm").addEventListener("click",    () => showSettingForm("email"));
  document.getElementById("openPasswordForm").addEventListener("click", () => showSettingForm("password"));

  // Back buttons
  document.getElementById("backFromUsername").addEventListener("click", showSettingsOptions);
  document.getElementById("backFromEmail").addEventListener("click",    showSettingsOptions);
  document.getElementById("backFromPassword").addEventListener("click", showSettingsOptions);

  // Cancel buttons
  document.getElementById("cancelUsernameBtn").addEventListener("click", showSettingsOptions);
  document.getElementById("cancelEmailBtn").addEventListener("click",    showSettingsOptions);
  document.getElementById("cancelPasswordBtn").addEventListener("click", showSettingsOptions);

  // Password toggle icons (delegated)
  document.addEventListener("click", function (e) {
    if (e.target.classList.contains("toggle-modal-password")) {
      toggleModalPassword(e.target.dataset.target);
    }
  });

  // Forgot password link
  document.getElementById("forgotPasswordLink").addEventListener("click", e => {
    e.preventDefault();
    openForgotPasswordModal();
  });

  // Close forgot password
  document.getElementById("closeForgotPasswordBtn").addEventListener("click", closeForgotPasswordModal);
  document.getElementById("forgotPasswordOverlay").addEventListener("click", closeForgotPasswordModal);

  // Forgot password form submit
  document.getElementById("forgot-password-form").addEventListener("submit", function (e) {
    e.preventDefault();
    const submitBtn = this.querySelector(".btn-save");
    if (submitBtn.disabled) return;

    const emailInput = document.getElementById("forgot-email");
    const email = emailInput.value.trim();

    // Clear previous errors
    this.querySelectorAll(".modal-error").forEach(el => el.remove());
    emailInput.classList.remove("invalid");

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
      const err = document.createElement("div");
      err.className = "modal-error";
      err.textContent = email ? "Please enter a valid email address" : "Please enter your email address";
      emailInput.closest(".profile-field").appendChild(err);
      emailInput.classList.add("invalid");
      return;
    }

    submitBtn.disabled = true;
    submitBtn.textContent = "Sending...";

    const users = getAllRegisteredUsers();
    const userExists = users.some(u => u.email.toLowerCase() === email.toLowerCase());

    if (userExists) {
      closeForgotPasswordModal();
      setTimeout(() => {
        submitBtn.disabled = false;
        submitBtn.textContent = "Send Reset Link";
      }, 500);
      setTimeout(() => showResetConfirmation(email), 300);
    } else {
      submitBtn.disabled = false;
      submitBtn.textContent = "Send Reset Link";
      const err = document.createElement("div");
      err.className = "modal-error";
      err.textContent = "No account found with this email address";
      emailInput.closest(".profile-field").appendChild(err);
      emailInput.classList.add("invalid");
    }
  });

  // Reset confirmation OK
  document.getElementById("resetConfirmationOkBtn").addEventListener("click", e => {
    e.stopPropagation();
    closeResetConfirmation();
  });
  document.getElementById("confirmationOverlay").addEventListener("click", closeResetConfirmation);

  // Username form submit
  document.getElementById("username-change-form").addEventListener("submit", function (e) {
    e.preventDefault();
    const currentUser = getCurrentUserFull();
    if (!currentUser) { showFormMessage("username-message", "User not found. Please login again.", "error"); return; }

    const newUsername = document.getElementById("new-username").value.trim();
    if (newUsername.includes(" ")) { showFormMessage("username-message", "Username cannot contain spaces", "error"); return; }
    if (newUsername.length < 3)    { showFormMessage("username-message", "Username must be at least 3 characters", "error"); return; }

    const users = getAllRegisteredUsers();
    const userIndex = users.findIndex(u => u.email === currentUser.email);
    if (userIndex === -1) { showFormMessage("username-message", "Error: Could not find user record.", "error"); return; }

    const taken = users.some((u, i) => i !== userIndex && u.username && u.username.toLowerCase() === newUsername.toLowerCase());
    if (taken) { showFormMessage("username-message", "Username already taken. Please choose another.", "error"); return; }

    users[userIndex] = { ...users[userIndex], name: newUsername, username: newUsername, updatedAt: new Date().toISOString() };
    localStorage.setItem("registeredUsers", JSON.stringify(users));
    updateCurrentSession(users[userIndex]);
    showFormMessage("username-message", "Username updated successfully!", "success");
    setTimeout(closeProfileModal, 1500);
  });

  // Email form submit
  document.getElementById("email-change-form").addEventListener("submit", function (e) {
    e.preventDefault();
    const currentUser = getCurrentUserFull();
    if (!currentUser) { showFormMessage("email-message", "User not found. Please login again.", "error"); return; }

    const newEmail = document.getElementById("new-email").value.trim();
    const password = document.getElementById("confirm-email-password").value.trim();
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPattern.test(newEmail)) { showFormMessage("email-message", "Please enter a valid email address", "error"); return; }
    if (currentUser.password !== password) { showFormMessage("email-message", "Incorrect password", "error"); return; }

    const users = getAllRegisteredUsers();
    const userIndex = users.findIndex(u => u.email === currentUser.email);
    if (userIndex === -1) { showFormMessage("email-message", "Error: Could not find user record.", "error"); return; }

    const emailTaken = users.some((u, i) => i !== userIndex && u.email === newEmail);
    if (emailTaken) { showFormMessage("email-message", "Email already in use. Please use another.", "error"); return; }

    users[userIndex] = { ...users[userIndex], email: newEmail, updatedAt: new Date().toISOString() };
    localStorage.setItem("registeredUsers", JSON.stringify(users));
    updateCurrentSession(users[userIndex]);
    showFormMessage("email-message", "Email updated successfully!", "success");
    setTimeout(closeProfileModal, 1500);
  });

  // Password form submit
  document.getElementById("password-change-form").addEventListener("submit", function (e) {
    e.preventDefault();
    const currentUser = getCurrentUserFull();
    if (!currentUser) { showFormMessage("password-message", "User not found. Please login again.", "error"); return; }

    const oldPassword     = document.getElementById("old-password").value.trim();
    const newPassword     = document.getElementById("new-password").value.trim();
    const confirmPassword = document.getElementById("confirm-new-password").value.trim();

    if (currentUser.password !== oldPassword) { showFormMessage("password-message", "Current password is incorrect", "error"); return; }

    const passwordPattern = /^(?=.*[0-9]).{8,}$/;
    if (!passwordPattern.test(newPassword)) { showFormMessage("password-message", "Password must be 8+ characters with at least 1 number", "error"); return; }
    if (newPassword !== confirmPassword)     { showFormMessage("password-message", "New passwords do not match", "error"); return; }

    const users = getAllRegisteredUsers();
    const userIndex = users.findIndex(u => u.email === currentUser.email);
    if (userIndex === -1) { showFormMessage("password-message", "Error: Could not find user record.", "error"); return; }

    users[userIndex] = { ...users[userIndex], password: newPassword, updatedAt: new Date().toISOString() };
    localStorage.setItem("registeredUsers", JSON.stringify(users));
    updateCurrentSession(users[userIndex]);
    showFormMessage("password-message", "Password updated successfully!", "success");
    setTimeout(showSettingsOptions, 1500);
  });

  // My Bookings button in dropdown
  document.getElementById("myBookingsBtn").addEventListener("click", e => {
    e.preventDefault();
    document.getElementById("profileDropdown").classList.remove("show");
    openMyBookingsModal();
  });

  // Close My Bookings modal
  document.getElementById("closeMyBookingsBtn").addEventListener("click", closeMyBookingsModal);
  document.getElementById("myBookingsModal").addEventListener("click", e => {
    if (e.target === document.getElementById("myBookingsModal")) closeMyBookingsModal();
  });

  // Back from edit panel
  document.getElementById("backFromEditBooking").addEventListener("click", () => {
    hideBookingEditPanel();
    renderBookingsList();
  });

  // Cancel edit
  document.getElementById("cancelEditBookingBtn").addEventListener("click", () => {
    hideBookingEditPanel();
    renderBookingsList();
  });

  // Save edit
  document.getElementById("saveEditBookingBtn").addEventListener("click", saveBookingEdit);

  // Close service dropdown on outside click
  document.addEventListener("click", function(e) {
    const wrap = document.getElementById("svcDropdownTrigger");
    const menu = document.getElementById("svcDropdownMenu");
    if (wrap && menu && !wrap.contains(e.target) && !menu.contains(e.target)) {
      _svcDropdownOpen = false;
      wrap.classList.remove("open");
      menu.classList.remove("open");
    }
  });

  // Calendar nav
  document.getElementById("bkCalPrev").addEventListener("click", () => {
    _editCalMonth--;
    if (_editCalMonth < 0) { _editCalMonth = 11; _editCalYear--; }
    renderEditCalendar();
  });
  document.getElementById("bkCalNext").addEventListener("click", () => {
    _editCalMonth++;
    if (_editCalMonth > 11) { _editCalMonth = 0; _editCalYear++; }
    renderEditCalendar();
  });

  // Cancel delete
  document.getElementById("cancelDeleteBtn").addEventListener("click", hideBookingDeleteConfirm);

  // Confirm delete
  document.getElementById("confirmDeleteBtn").addEventListener("click", confirmBookingDelete);

  // Escape key closes My Bookings too

  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") {
      closeForgotPasswordModal();
      closeResetConfirmation();
      closeProfileModal();
      closeMyBookingsModal();
    }
  });
});