// ===================================
// User Profile & Avatar Management
// ===================================

// SAFE Get user data from localStorage or sessionStorage
function getUserData() {
  try {
    let userData = localStorage.getItem('userData');
    if (userData) {
      return JSON.parse(userData);
    }
    
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

// Display user avatar and profile - WITH SAFETY CHECKS
function displayUserProfile() {
  const user = getUserData();
  const userProfile = document.getElementById('userProfile');
  const signUpLink = document.getElementById('signUpLink');
  const userAvatar = document.getElementById('userAvatar');
  const profileName = document.getElementById('profileName');
  const profileEmail = document.getElementById('profileEmail');
  
  // Safety check - if elements don't exist, exit gracefully
  if (!userProfile || !userAvatar) {
    console.warn('User profile elements not found in DOM');
    return;
  }
  
  if (user && user.name) {
    const firstLetter = user.name.charAt(0).toUpperCase();
    
    userAvatar.textContent = firstLetter;
    if (profileName) profileName.textContent = user.name;
    if (profileEmail) profileEmail.textContent = user.email || '';
    
    userProfile.style.display = 'block';
    if (signUpLink) signUpLink.style.display = 'none';
  } else {
    userProfile.style.display = 'none';
    if (signUpLink) signUpLink.style.display = 'block';
  }
}

// Toggle profile dropdown - WITH SAFETY CHECK
function toggleProfileDropdown() {
  const dropdown = document.getElementById('profileDropdown');
  if (!dropdown) {
    console.warn('Profile dropdown not found');
    return;
  }
  dropdown.classList.toggle('show');
}

// Logout functionality
function logout() {
  showLogoutModal();
}

function showLogoutModal() {
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
  setTimeout(() => modalOverlay.classList.add('active'), 10);
}

function closeLogoutModal() {
  const modal = document.querySelector('.logout-alert-overlay');
  if (modal) {
    modal.classList.remove('active');
    setTimeout(() => modal.remove(), 300);
  }
}

function confirmLogout() {
  try {
    localStorage.removeItem('userData');
    localStorage.removeItem('currentUser');
    sessionStorage.removeItem('userData');
    sessionStorage.removeItem('currentUser');
    window.location.reload();
  } catch (error) {
    console.error('Error during logout:', error);
    window.location.reload();
  }
}

// Menu functionality
function toggleMenu() {
    const menu = document.getElementById('dropdownMenu');
    if (menu) {
        menu.classList.toggle('active');
    }
}

// Logo and Home navigation
function goToHomePage() {
    try {
        if (window.location.pathname.includes('vacancies')) {
            window.location.href = '../HomePage/index.html';
        } else {
            window.location.href = './HomePage/index.html';
        }
    } catch (error) {
        console.error('Navigation error:', error);
        window.location.href = '/';
    }
}

function openJobDetails(jobId) {
    try {
        window.location.href = `../jobApplication/index.html?job=${jobId}`;
    } catch (error) {
        console.error('Navigation error:', error);
        alert('Job application page not available');
    }
}

// Check and mark applied jobs - WITH TRY-CATCH
function checkAppliedJobs() {
  try {
    const appliedJobs = JSON.parse(localStorage.getItem('appliedJobs') || '[]');
    const jobIds = ['barber', 'salon-manager', 'social-media-manager-shanab', 'beard-specialist', 'customer-experience', 'marketing-specialist'];
    
    jobIds.forEach((jobId, index) => {
        const jobCard = document.querySelectorAll('.job-card')[index];
        if (jobCard && appliedJobs.includes(jobId)) {
            if (!jobCard.querySelector('.applied-badge')) {
                const badge = document.createElement('div');
                badge.className = 'applied-badge';
                badge.innerHTML = '';
                jobCard.appendChild(badge);
                jobCard.classList.add('job-applied');
            }
        }
    });
  } catch (error) {
    console.error('Error checking applied jobs:', error);
  }
}

// Animation functions
function isElementPartiallyInViewport(el) {
  const rect = el.getBoundingClientRect();
  const windowHeight = window.innerHeight || document.documentElement.clientHeight;
  const elementHeight = rect.height;
  
  return (
    rect.top < windowHeight - (elementHeight * 0.3) &&
    rect.bottom > (elementHeight * 0.3)
  );
}

function animateJobCards() {
  const jobCards = document.querySelectorAll('.job-card');
  jobCards.forEach((card, index) => {
    if (isElementPartiallyInViewport(card) && !card.classList.contains('animate-in')) {
      setTimeout(() => {
        card.classList.add('animate-in');
      }, index * 80);
    }
  });
}

function throttle(func, wait) {
  let timeout;
  let lastRan;
  return function executedFunction(...args) {
    if (!lastRan) {
      func(...args);
      lastRan = Date.now();
    } else {
      clearTimeout(timeout);
      timeout = setTimeout(function() {
        if ((Date.now() - lastRan) >= wait) {
          func(...args);
          lastRan = Date.now();
        }
      }, wait - (Date.now() - lastRan));
    }
  };
}

const throttledAnimateJobCards = throttle(animateJobCards, 50);

// ===================================
// Event Listeners - WITH SAFETY CHECKS
// ===================================

document.addEventListener('DOMContentLoaded', function() {
    // Initialize user profile safely
    try {
        displayUserProfile();
    } catch (error) {
        console.error('Error displaying user profile:', error);
    }
    
    // Avatar click event - WITH NULL CHECK
    const userAvatar = document.getElementById('userAvatar');
    if (userAvatar) {
        userAvatar.addEventListener('click', function(e) {
            e.stopPropagation();
            toggleProfileDropdown();
        });
    }
    
    // Logout button event - WITH NULL CHECK
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function(e) {
            e.preventDefault();
            logout();
        });
    }
    
    // Check applied jobs on page load
    checkAppliedJobs();
    
    // Initialize job card animations
    setTimeout(() => {
        animateJobCards();
    }, 50);
    
    // Job card perspective settings
    const jobCards = document.querySelectorAll('.job-card');
    jobCards.forEach(card => {
        card.style.backfaceVisibility = 'hidden';
        card.style.perspective = '1000px';
    });

    // Footer animation
    const footer = document.querySelector('.footer p');
    if (footer) {
        footer.style.opacity = '0';
        footer.style.transform = 'translateY(10px)';
        
        setTimeout(() => {
            footer.style.transition = 'all 0.4s ease';
            footer.style.opacity = '1';
            footer.style.transform = 'translateY(0)';
        }, 200);
    }
});

// Close menu when clicking outside - WITH NULL CHECKS
document.addEventListener('click', function(event) {
  const menuContainer = document.querySelector('.menu-container');
  const menu = document.getElementById('dropdownMenu');
  const userProfile = document.getElementById('userProfile');
  const profileDropdown = document.getElementById('profileDropdown');
  
  if (menuContainer && menu && !menuContainer.contains(event.target)) {
    menu.classList.remove('active');
  }
  
  if (userProfile && profileDropdown && !userProfile.contains(event.target)) {
    profileDropdown.classList.remove('show');
  }
});

// Scroll and resize listeners
document.addEventListener('scroll', throttledAnimateJobCards, { passive: true });
window.addEventListener('resize', throttledAnimateJobCards);