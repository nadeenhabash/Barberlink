// =========================================
// NAVIGATION
// =========================================

function toggleMenu() {
  document.getElementById('dropdownMenu')?.classList.toggle('active');
}

function goToHomePage() {
  try {
    const path = window.location.pathname.includes('vacancies')
      ? '../HomePage/index.html'
      : './HomePage/index.html';
    window.location.href = path;
  } catch (err) {
    console.error('Navigation error:', err);
    window.location.href = '/';
  }
}

function openJobDetails(jobId) {
  try {
    window.location.href = `../jobApplication/index.html?job=${jobId}`;
  } catch (err) {
    console.error('Navigation error:', err);
    alert('Job application page not available');
  }
}

// =========================================
// APPLIED JOBS
// =========================================

function checkAppliedJobs() {
  try {
    const userData    = localStorage.getItem('userData');
    const currentUser = userData ? JSON.parse(userData) : null;
    const email       = currentUser?.email || currentUser?.id || null;

    if (!email) return;

    const appliedJobs = JSON.parse(localStorage.getItem('appliedJobs_' + email) || '[]');
    const jobIds = [
      'barber',
      'salon-manager',
      'social-media-manager-shanab',
      'beard-specialist',
      'customer-experience',
      'marketing-specialist',
    ];

    document.querySelectorAll('.job-card').forEach((card, i) => {
      if (appliedJobs.includes(jobIds[i]) && !card.querySelector('.applied-badge')) {
        const badge = document.createElement('div');
        badge.className = 'applied-badge';
        card.appendChild(badge);
        card.classList.add('job-applied');
      }
    });
  } catch (err) {
    console.error('Error checking applied jobs:', err);
  }
}

// =========================================
// ANIMATIONS
// =========================================

function isPartiallyInViewport(el) {
  const rect   = el.getBoundingClientRect();
  const winH   = window.innerHeight || document.documentElement.clientHeight;
  const elH    = rect.height;
  return rect.top < winH - elH * 0.3 && rect.bottom > elH * 0.3;
}

function animateJobCards() {
  document.querySelectorAll('.job-card').forEach((card, i) => {
    if (isPartiallyInViewport(card) && !card.classList.contains('animate-in')) {
      setTimeout(() => card.classList.add('animate-in'), i * 80);
    }
  });
}

function throttle(fn, wait) {
  let timeout, lastRan;
  return function (...args) {
    if (!lastRan) {
      fn(...args);
      lastRan = Date.now();
    } else {
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        if (Date.now() - lastRan >= wait) {
          fn(...args);
          lastRan = Date.now();
        }
      }, wait - (Date.now() - lastRan));
    }
  };
}

const throttledAnimateJobCards = throttle(animateJobCards, 50);

// =========================================
// INIT
// =========================================

document.addEventListener('DOMContentLoaded', () => {
  checkAppliedJobs();

  setTimeout(animateJobCards, 50);

  // Optimise card rendering
  document.querySelectorAll('.job-card').forEach(card => {
    card.style.backfaceVisibility = 'hidden';
    card.style.perspective = '1000px';
  });

  // Footer fade-in
  const footerText = document.querySelector('.footer p');
  if (footerText) {
    Object.assign(footerText.style, { opacity: '0', transform: 'translateY(10px)' });
    setTimeout(() => {
      Object.assign(footerText.style, {
        transition: 'all 0.4s ease',
        opacity: '1',
        transform: 'translateY(0)',
      });
    }, 200);
  }

  // Coming Soon modal
  const overlay   = document.getElementById('csOverlay');
  const closeBtn  = document.getElementById('csClose');
  const storeLink = document.getElementById('storeNavLink');

  if (!overlay) return;

  const openModal  = e => { e.preventDefault(); overlay.classList.add('active'); };
  const closeModal = ()  => overlay.classList.remove('active');

  storeLink?.addEventListener('click', openModal);
  closeBtn?.addEventListener('click', closeModal);
  overlay.addEventListener('click', e => { if (e.target === overlay) closeModal(); });
});

// Close dropdown on outside click
document.addEventListener('click', e => {
  const container = document.querySelector('.menu-container');
  const menu      = document.getElementById('dropdownMenu');
  if (container && menu && !container.contains(e.target)) {
    menu.classList.remove('active');
  }
});

// Scroll / resize animation triggers
document.addEventListener('scroll', throttledAnimateJobCards, { passive: true });
window.addEventListener('resize', throttledAnimateJobCards);