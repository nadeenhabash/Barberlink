// GLOBAL VARIABLES

let allShops = [];
let favorites = JSON.parse(localStorage.getItem("favoriteShops")) || [];
let selectionMode = false;
let selectedFavorites = new Set();
let selectedFilter = "all";
let currentSortValue = "default";
let suggestionIndex = -1;
let sortOptionIndex = -1;

// Quiz variables
let quizCurrentQuestion = 1;
const quizTotalQuestions = 5;
const quizUserAnswers = {};

// CAROUSEL FUNCTIONALITY

function initializeCarousel() {
  const carouselTrack = document.getElementById("carouselTrack");
  const prevBtn = document.getElementById("prevBtn");
  const nextBtn = document.getElementById("nextBtn");
  const progressBar = document.getElementById("progressBar");

  if (!carouselTrack || !prevBtn || !nextBtn || !progressBar) return;

  let currentIndex = 0;
  const totalSlides = 6;
  const slidesToShow = 3;
  const autoPlayInterval = 3000;
  let autoPlayTimer;
  let progressTimer;
  let progressValue = 0;

  // Clone slides for infinite loop
  const slides = carouselTrack.querySelectorAll(".carousel-slide");
  slides.forEach((slide) => {
    const clone = slide.cloneNode(true);
    carouselTrack.appendChild(clone);
  });

  function updateCarousel(instant = false) {
    const slideWidth =
      carouselTrack.querySelector(".carousel-slide").offsetWidth;
    const gap = 30;
    const offset = -(currentIndex * (slideWidth + gap));

    if (instant) {
      carouselTrack.style.transition = "none";
      carouselTrack.style.transform = `translateX(${offset}px)`;
      carouselTrack.offsetHeight;
      carouselTrack.style.transition =
        "transform 0.8s cubic-bezier(0.4, 0, 0.2, 1)";
    } else {
      carouselTrack.style.transform = `translateX(${offset}px)`;
    }

    progressValue = 0;
    progressBar.style.width = "0%";
  }

  function nextSlide() {
    currentIndex++;
    updateCarousel();

    if (currentIndex >= totalSlides) {
      setTimeout(() => {
        currentIndex = 0;
        updateCarousel(true);
      }, 800);
    }
  }

  function prevSlide() {
    if (currentIndex === 0) {
      currentIndex = totalSlides;
      updateCarousel(true);
      setTimeout(() => {
        currentIndex--;
        updateCarousel();
      }, 50);
    } else {
      currentIndex--;
      updateCarousel();
    }
  }

  function updateProgress() {
    progressValue += 100 / (autoPlayInterval / 50);
    if (progressValue >= 100) {
      progressValue = 100;
    }
    progressBar.style.width = progressValue + "%";
  }

  function startAutoPlay() {
    stopAutoPlay();
    progressTimer = setInterval(updateProgress, 50);
    autoPlayTimer = setInterval(() => {
      nextSlide();
    }, autoPlayInterval);
  }

  function stopAutoPlay() {
    if (autoPlayTimer) clearInterval(autoPlayTimer);
    if (progressTimer) clearInterval(progressTimer);
  }

  prevBtn.addEventListener("click", () => {
    prevSlide();
    startAutoPlay();
  });

  nextBtn.addEventListener("click", () => {
    nextSlide();
    startAutoPlay();
  });

  const carouselContainer = document.querySelector(".carousel-container");
  if (carouselContainer) {
    carouselContainer.addEventListener("mouseenter", stopAutoPlay);
    carouselContainer.addEventListener("mouseleave", startAutoPlay);
  }

  let resizeTimer;
  window.addEventListener("resize", () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      updateCarousel(true);
    }, 250);
  });

  updateCarousel(true);
  startAutoPlay();
}

// SHOPS DATA AND FILTERING

function loadShopsData() {
  const shopCards = document.querySelectorAll(".shop-card");
  allShops = Array.from(shopCards).map((card) => ({
    id: card.dataset.id,
    name: card.querySelector(".shop-name").textContent,
    location: card
      .querySelector(".shop-location")
      .textContent.trim()
      .split("\n")[0]
      .trim(),
    city: card.dataset.city,
    rating: parseFloat(card.querySelector(".rating-number").textContent),
    reviews: parseInt(
      card.querySelector(".rating-count").textContent.replace(/[()]/g, "")
    ),
    price: card.querySelectorAll(".price-symbol:not(.inactive)").length,
    element: card,
  }));
}

function filterBranches() {
  const searchInput = document.getElementById("searchInput");
  const searchTerm = searchInput ? searchInput.value.toLowerCase().trim() : "";

  if (searchTerm.length > 0) {
    showSuggestions(searchTerm);
  } else {
    hideSuggestions();
  }

  let filteredShops = allShops.filter((shop) => {
    const matchesSearch =
      searchTerm === "" ||
      shop.name.toLowerCase().includes(searchTerm) ||
      shop.location.toLowerCase().includes(searchTerm);
    const matchesCity =
      selectedFilter === "all" || shop.city === selectedFilter;
    return matchesSearch && matchesCity;
  });

  filteredShops = sortShops(filteredShops);
  displayShops(filteredShops);
}

function sortShops(shops) {
  const sorted = [...shops];

  switch (currentSortValue) {
    case "rating-high":
      sorted.sort((a, b) => b.rating - a.rating);
      break;
    case "rating-low":
      sorted.sort((a, b) => a.rating - b.rating);
      break;
    case "reviews-high":
      sorted.sort((a, b) => a.price - b.price || b.rating - a.rating);
      break;
    case "reviews-low":
      sorted.sort((a, b) => b.price - a.price || b.rating - a.rating);
      break;
    case "name-asc":
      sorted.sort((a, b) => a.name.localeCompare(b.name));
      break;
    case "name-desc":
      sorted.sort((a, b) => b.name.localeCompare(a.name));
      break;
    default:
      break;
  }

  return sorted;
}

function displayShops(shops) {
  const grid = document.getElementById("shopsGrid");
  grid.innerHTML = "";

  if (shops.length === 0) {
    grid.innerHTML = `<div style="grid-column: 1/-1; display: flex; flex-direction: column; align-items: center; padding: 60px 20px; text-align: center;"><svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="#ccc" stroke-width="2" style="margin-bottom: 20px;"><circle cx="11" cy="11" r="8"></circle><path d="m21 21-4.35-4.35"></path><line x1="11" y1="8" x2="11" y2="14"></line><line x1="8" y1="11" x2="14" y2="11"></line></svg><h3 style="color: #191265; font-size: 20px; margin-bottom: 10px; font-weight: 600;">No Shops Found</h3><p style="color: #666; font-size: 14px; margin-bottom: 20px; max-width: 400px;">We could not find any barbershops matching your search.</p><div style="background: #f8f9ff; padding: 20px; border-radius: 12px; max-width: 450px;"><p style="color: #191265; font-weight: 600; margin-bottom: 12px; font-size: 14px;">Try these options:</p><ul style="text-align: left; color: #666; font-size: 13px; line-height: 1.8; list-style: none; padding: 0;"><li style="margin-bottom: 8px;">✓ Check your spelling</li><li style="margin-bottom: 8px;">✓ Use different keywords</li><li style="margin-bottom: 8px;">✓ Try selecting "All" in the city filter</li><li style="margin-bottom: 8px;">✓ Clear your search and browse all shops</li></ul></div></div>`;
    return;
  }

  shops.forEach((shop) => {
    grid.appendChild(shop.element);
  });
}

// SEARCH SUGGESTIONS

function showSuggestions(searchTerm) {
  const suggestionsDiv = document.getElementById("suggestions");
  if (!suggestionsDiv) return;

  const matches = allShops
    .filter(
      (shop) =>
        shop.name.toLowerCase().includes(searchTerm) ||
        shop.location.toLowerCase().includes(searchTerm)
    )
    .slice(0, 5);

  if (matches.length === 0) {
    hideSuggestions();
    return;
  }

  suggestionsDiv.innerHTML = "";

  matches.forEach((shop, index) => {
    const item = document.createElement("div");
    item.className = "suggestion-item";
    item.dataset.index = index;

    const highlightedName = highlightMatch(shop.name, searchTerm);
    const highlightedLocation = highlightMatch(shop.location, searchTerm);

    item.innerHTML = `
      <div class="suggestion-text">
        <div class="suggestion-name">${highlightedName}</div>
        <div class="suggestion-location">${highlightedLocation}</div>
      </div>
    `;

    item.onclick = () => selectSuggestion(shop);
    suggestionsDiv.appendChild(item);
  });

  const searchInput = document.getElementById("searchInput");
  if (searchInput) {
    const rect = searchInput.getBoundingClientRect();
    suggestionsDiv.style.top = `${rect.bottom + 8}px`;
    suggestionsDiv.style.left = `${rect.left}px`;
    suggestionsDiv.style.width = `${rect.width}px`;
    suggestionsDiv.style.right = "auto";
  }

  suggestionsDiv.classList.add("active");
}

function hideSuggestions() {
  const suggestionsDiv = document.getElementById("suggestions");
  if (suggestionsDiv) {
    suggestionsDiv.classList.remove("active");
    suggestionsDiv.innerHTML = "";
  }
  suggestionIndex = -1;
}

function highlightMatch(text, searchTerm) {
  const regex = new RegExp(`(${searchTerm})`, "gi");
  return text.replace(regex, '<span class="suggestion-match">$1</span>');
}

function selectSuggestion(shop) {
  const searchInput = document.getElementById("searchInput");
  if (searchInput) {
    searchInput.value = shop.name;
  }
  hideSuggestions();
  filterBranches();
}

function resetSearch() {
  const searchInput = document.getElementById("searchInput");
  if (searchInput) {
    searchInput.value = "";
  }
  hideSuggestions();
  filterBranches();
}

function performSearch() {
  filterBranches();
}

// SORT FUNCTIONALITY

function toggleSortIconDropdown() {
  const dropdown = document.getElementById("sortIconDropdown");
  const btn = document.getElementById("sortIconBtn");
  if (dropdown && btn) {
    const isActive = dropdown.classList.contains("active");
    dropdown.classList.toggle("active");
    btn.classList.toggle("active");

    if (!isActive) {
      const rect = btn.getBoundingClientRect();
      dropdown.style.top = `${rect.bottom + 10}px`;
      dropdown.style.left = `${rect.right - 200}px`;
      dropdown.style.right = "auto";
    }

    if (!isActive) {
      sortOptionIndex = -1;
      const options = dropdown.querySelectorAll(".sort-icon-option");
      options.forEach((opt, index) => {
        if (opt.classList.contains("selected")) {
          sortOptionIndex = index;
        }
      });
    }
  }
}

function selectSortIconOption(value, text) {
  currentSortValue = value;

  document.querySelectorAll(".sort-icon-option").forEach((opt) => {
    opt.classList.remove("selected");
    if (opt.dataset.value === value) {
      opt.classList.add("selected");
    }
  });

  const dropdown = document.getElementById("sortIconDropdown");
  const btn = document.getElementById("sortIconBtn");
  if (dropdown && btn) {
    dropdown.classList.remove("active");
    btn.classList.remove("active");
  }

  filterBranches();
}

function updateSortOptionSelection(options) {
  options.forEach((option, index) => {
    if (index === sortOptionIndex) {
      option.style.background = "#f8f9ff";
      option.scrollIntoView({ block: "nearest", behavior: "smooth" });
    } else if (!option.classList.contains("selected")) {
      option.style.background = "";
    }
  });
}

// FILTER FUNCTIONALITY

function selectFilter(filter) {
  selectedFilter = filter;

  document.querySelectorAll(".filter-btn").forEach((btn) => {
    btn.classList.remove("active");
  });

  event.target.classList.add("active");
  filterBranches();
}

// FAVORITES FUNCTIONALITY

function toggleFavorite(shopId, event) {
  event.stopPropagation();

  const index = favorites.indexOf(shopId);
  if (index > -1) {
    favorites.splice(index, 1);
  } else {
    favorites.push(shopId);
  }

  localStorage.setItem("favoriteShops", JSON.stringify(favorites));
  updateFavoritesCount();
  updateFavoriteButton(shopId);
  updateFavoritesPanel();
}

function updateFavoritesCount() {
  const countElement = document.getElementById("favoritesCount");
  if (countElement) {
    countElement.textContent = favorites.length;
    if (favorites.length === 0) {
      countElement.classList.add("hidden");
    } else {
      countElement.classList.remove("hidden");
    }
  }
}

function updateFavoriteButton(shopId) {
  const card = document.querySelector(`.shop-card[data-id="${shopId}"]`);
  if (card) {
    const btn = card.querySelector(".favorite-btn");
    const svg = btn.querySelector("svg");
    if (favorites.includes(shopId)) {
      svg.setAttribute("data-favorited", "true");
      svg.style.fill = "#191265";
      svg.style.stroke = "#191265";
    } else {
      svg.removeAttribute("data-favorited");
      svg.style.fill = "none";
      svg.style.stroke = "#191265";
    }
  }
}

function updateAllFavoriteButtons() {
  document.querySelectorAll(".shop-card").forEach((card) => {
    const shopId = card.dataset.id;
    updateFavoriteButton(shopId);
  });
}

function toggleFavoritesPanel() {
  const panel = document.getElementById("favoritesPanel");
  const wasActive = panel.classList.contains("active");

  panel.classList.toggle("active");

  if (panel.classList.contains("active")) {
    updateFavoritesPanel();
  } else {
    if (selectionMode) {
      exitSelectionMode();
    }
  }
}

function updateFavoritesPanel() {
  const listElement = document.getElementById("favoritesList");
  const selectBtn = document.getElementById("selectModeBtn");

  if (favorites.length === 0) {
    listElement.innerHTML = '<p class="no-favorites">No favorites yet</p>';
    if (selectBtn) {
      selectBtn.style.display = "none";
    }
    if (selectionMode) {
      exitSelectionMode();
    }
    return;
  }

  if (selectBtn) {
    selectBtn.style.display = "block";
  }

  listElement.innerHTML = "";

  favorites.forEach((shopId) => {
    const shop = allShops.find((s) => s.id === shopId);
    if (shop) {
      const item = document.createElement("div");
      item.className = "favorite-item";
      item.dataset.shopId = shopId;

      if (!selectionMode) {
        item.onclick = () => scrollToShop(shopId);
      } else {
        item.classList.add("selection-mode");
        if (selectedFavorites.has(shopId)) {
          item.classList.add("selected");
        }
      }

      const img = shop.element.querySelector(".card-image img");
      const imgSrc = img ? img.src : "";

      const checkboxHtml = `<input type="checkbox" class="favorite-item-checkbox" ${
        selectedFavorites.has(shopId) ? "checked" : ""
      } onchange="toggleItemSelection('${shopId}', this)" onclick="event.stopPropagation()">`;

      item.innerHTML = `
        ${checkboxHtml}
        <img src="${imgSrc}" alt="${shop.name}">
        <div class="favorite-item-info">
          <div class="favorite-item-name">${shop.name}</div>
          <div class="favorite-item-location">${shop.location}</div>
        </div>
        <button class="remove-favorite" onclick="event.stopPropagation(); toggleFavorite('${shopId}', event)">×</button>
      `;

      listElement.appendChild(item);
    }
  });
}

function scrollToShop(shopId) {
  const card = document.querySelector(`.shop-card[data-id="${shopId}"]`);
  if (card) {
    toggleFavoritesPanel();
    card.scrollIntoView({ behavior: "smooth", block: "center" });
    card.style.animation = "highlight 1s ease";
    setTimeout(() => {
      card.style.animation = "";
    }, 1000);
  }
}

function enterSelectionMode() {
  selectionMode = true;
  selectedFavorites.clear();

  document.getElementById("selectModeBtn").style.display = "none";
  document.getElementById("selectionModeButtons").classList.add("active");
  document.getElementById("selectAllCheckbox").classList.add("active");
  document
    .querySelector(".favorites-panel-header")
    .classList.add("selection-active");

  document.querySelectorAll(".favorite-item").forEach((item) => {
    item.classList.add("selection-mode");
    item.onclick = null;
  });

  updateDeleteButton();
}

function exitSelectionMode() {
  selectionMode = false;
  selectedFavorites.clear();

  document.getElementById("selectModeBtn").style.display = "block";
  document.getElementById("selectionModeButtons").classList.remove("active");
  document.getElementById("selectAllCheckbox").classList.remove("active");
  document.getElementById("selectAllInput").checked = false;
  document
    .querySelector(".favorites-panel-header")
    .classList.remove("selection-active");

  document.querySelectorAll(".favorite-item").forEach((item) => {
    item.classList.remove("selection-mode", "selected");
    const checkbox = item.querySelector(".favorite-item-checkbox");
    if (checkbox) checkbox.checked = false;
  });

  updateFavoritesPanel();
}

function toggleItemSelection(shopId, checkbox) {
  if (checkbox.checked) {
    selectedFavorites.add(shopId);
    checkbox.closest(".favorite-item").classList.add("selected");
  } else {
    selectedFavorites.delete(shopId);
    checkbox.closest(".favorite-item").classList.remove("selected");
  }

  const selectAllInput = document.getElementById("selectAllInput");
  const totalItems = document.querySelectorAll(".favorite-item").length;
  selectAllInput.checked = selectedFavorites.size === totalItems;

  updateDeleteButton();
}

function toggleSelectAll() {
  const selectAllInput = document.getElementById("selectAllInput");
  const isChecked = selectAllInput.checked;

  selectedFavorites.clear();

  document.querySelectorAll(".favorite-item").forEach((item) => {
    const checkbox = item.querySelector(".favorite-item-checkbox");
    const shopId = item.dataset.shopId;

    checkbox.checked = isChecked;

    if (isChecked) {
      selectedFavorites.add(shopId);
      item.classList.add("selected");
    } else {
      item.classList.remove("selected");
    }
  });

  updateDeleteButton();
}

function updateDeleteButton() {
  const deleteBtn = document.getElementById("deleteSelectedBtn");
  const count = selectedFavorites.size;

  deleteBtn.disabled = count === 0;
  deleteBtn.textContent = count > 0 ? `Delete (${count})` : "Delete";
}

function deleteSelected() {
  if (selectedFavorites.size === 0) return;

  selectedFavorites.forEach((shopId) => {
    const index = favorites.indexOf(shopId);
    if (index > -1) {
      favorites.splice(index, 1);
    }
  });

  localStorage.setItem("favoriteShops", JSON.stringify(favorites));
  updateFavoritesCount();
  updateAllFavoriteButtons();
  exitSelectionMode();
  updateFavoritesPanel();
}

// USER AUTHENTICATION

function getUserData() {
  try {
    let userData = localStorage.getItem("userData");
    if (userData) {
      return JSON.parse(userData);
    }

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

function displayUserProfile() {
  const user = getUserData();
  const userProfile = document.getElementById("userProfile");
  const loginBtn = document.getElementById("loginBtn");
  const userAvatar = document.getElementById("userAvatar");
  const profileName = document.getElementById("profileName");
  const profileEmail = document.getElementById("profileEmail");

  if (user && user.name) {
    const firstLetter = user.name.charAt(0).toUpperCase();

    userAvatar.textContent = firstLetter;
    profileName.textContent = user.name;
    profileEmail.textContent = user.email || "";

    if (userProfile) userProfile.style.display = "block";
    if (loginBtn) loginBtn.style.display = "none";
  } else {
    if (userProfile) userProfile.style.display = "none";
    if (loginBtn) loginBtn.style.display = "block";
  }
}

function toggleProfileDropdown() {
  const dropdown = document.getElementById("profileDropdown");
  dropdown.classList.toggle("show");
}

function logout() {
  showLogoutModal();
}

function showLogoutModal() {
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

  setTimeout(() => {
    modalOverlay.classList.add("active");
  }, 10);
}

function closeLogoutModal() {
  const modal = document.querySelector(".logout-alert-overlay");
  if (modal) {
    modal.classList.remove("active");
    setTimeout(() => {
      modal.remove();
    }, 300);
  }
}

function confirmLogout() {
  localStorage.removeItem("userData");
  localStorage.removeItem("currentUser");
  sessionStorage.removeItem("userData");
  sessionStorage.removeItem("currentUser");
  window.location.reload();
}

// PROFILE SETTINGS MODAL

function openProfileModal() {
  const modal = document.getElementById("profileModal");
  const user = getUserData();

  if (!user) {
    alert("Please login first");
    return;
  }

  showSettingsOptions();
  modal.classList.add("active");
  document.body.style.overflow = "hidden";
}

function closeProfileModal() {
  const modal = document.getElementById("profileModal");
  modal.classList.remove("active");
  document.body.style.overflow = "";

  setTimeout(() => {
    showSettingsOptions();
  }, 300);
}

function showSettingsOptions() {
  document.querySelector(".settings-options").style.display = "block";
  document.getElementById("username-form").style.display = "none";
  document.getElementById("email-form").style.display = "none";
  document.getElementById("password-form").style.display = "none";

  document.getElementById("username-change-form").reset();
  document.getElementById("email-change-form").reset();
  document.getElementById("password-change-form").reset();

  clearFormMessage("username-message");
  clearFormMessage("email-message");
  clearFormMessage("password-message");
}

function showSettingForm(formType) {
  const currentUser = getCurrentUserFull();
  if (!currentUser) return;

  document.querySelector(".settings-options").style.display = "none";

  if (formType === "username") {
    document.getElementById("username-form").style.display = "block";
    document.getElementById("current-username").value =
      currentUser.username || currentUser.name || "";
  } else if (formType === "email") {
    document.getElementById("email-form").style.display = "block";
    document.getElementById("current-email").value = currentUser.email || "";
  } else if (formType === "password") {
    document.getElementById("password-form").style.display = "block";
  }
}

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

function getAllRegisteredUsers() {
  try {
    const users = localStorage.getItem("registeredUsers");
    return users ? JSON.parse(users) : [];
  } catch (error) {
    console.error("Error reading registered users:", error);
    return [];
  }
}

function showFormMessage(elementId, message, type = "success") {
  const messageDiv = document.getElementById(elementId);
  messageDiv.textContent = message;
  messageDiv.className = `form-message ${type}`;
  messageDiv.style.display = "block";
}

function clearFormMessage(elementId) {
  const messageDiv = document.getElementById(elementId);
  messageDiv.textContent = "";
  messageDiv.className = "form-message";
  messageDiv.style.display = "none";
}

function updateCurrentSession(updatedUser) {
  const rememberMe = updatedUser.rememberMe || false;

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

  if (rememberMe) {
    sessionStorage.removeItem("currentUser");
    sessionStorage.removeItem("userData");
  } else {
    localStorage.removeItem("currentUser");
    localStorage.removeItem("userData");
  }

  displayUserProfile();
}

// FORGOT PASSWORD

function openForgotPasswordModal() {
  const modal = document.getElementById("forgotPasswordModal");
  const overlay = document.getElementById("forgotPasswordOverlay");

  modal.classList.add("active");
  overlay.classList.add("active");
  document.body.style.overflow = "hidden";
}

function closeForgotPasswordModal() {
  const modal = document.getElementById("forgotPasswordModal");
  const overlay = document.getElementById("forgotPasswordOverlay");

  modal.classList.remove("active");
  overlay.classList.remove("active");
  document.body.style.overflow = "";

  const form = document.getElementById("forgot-password-form");
  if (form) {
    form.reset();
  }

  const errorMessages = document.querySelectorAll(".modal-error");
  errorMessages.forEach((msg) => msg.remove());

  const forgotEmail = document.getElementById("forgot-email");
  if (forgotEmail) {
    forgotEmail.classList.remove("invalid");
  }
}

function handleForgotPassword(e) {
  e.preventDefault();

  const form = e.target;
  const submitBtn = form.querySelector(".btn-save");

  if (submitBtn.disabled) return;

  const email = document.getElementById("forgot-email").value.trim();
  const emailInput = document.getElementById("forgot-email");

  const existingError = form.querySelector(".modal-error");
  if (existingError) existingError.remove();
  emailInput.classList.remove("invalid");

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailPattern.test(email)) {
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

  submitBtn.disabled = true;
  submitBtn.textContent = "Sending...";

  const users = getAllUsers();
  const userExists = users.some(
    (user) => user.email.toLowerCase() === email.toLowerCase()
  );

  if (userExists) {
    closeForgotPasswordModal();

    setTimeout(() => {
      submitBtn.disabled = false;
      submitBtn.textContent = "Send Reset Link";
    }, 500);

    setTimeout(() => {
      showResetConfirmation(email);
    }, 300);
  } else {
    submitBtn.disabled = false;
    submitBtn.textContent = "Send Reset Link";

    const errorDiv = document.createElement("div");
    errorDiv.className = "modal-error";
    errorDiv.textContent = "No account found with this email address";

    const emailField = emailInput.closest(".profile-field");
    emailField.appendChild(errorDiv);
    emailInput.classList.add("invalid");
  }
}

function getAllUsers() {
  try {
    const users = localStorage.getItem("registeredUsers");
    return users ? JSON.parse(users) : [];
  } catch (error) {
    console.error("Error reading users:", error);
    return [];
  }
}

function showResetConfirmation(email) {
  const overlay = document.getElementById("confirmationOverlay");
  const text = document.getElementById("resetConfirmationText");

  text.textContent = `Password reset link has been sent to ${email}`;

  overlay.classList.add("active");
  document.body.style.overflow = "hidden";
}

function closeResetConfirmation() {
  const overlay = document.getElementById("confirmationOverlay");

  overlay.classList.remove("active");
  document.body.style.overflow = "";
}

// QUIZ FUNCTIONALITY

const quizQuestions = [
  {
    id: 1,
    question: "What's your hair type?",
    options: [
      { text: "Straight Hair", value: "straight" },
      { text: "Wavy Hair", value: "wavy" },
      { text: "Curly Hair", value: "curly" },
      { text: "Coily/Thick Hair", value: "coily" },
    ],
  },
  {
    id: 2,
    question: "What's your preferred style?",
    options: [
      { text: "Classic & Clean", value: "classic" },
      { text: "Modern & Trendy", value: "modern" },
      { text: "Fade & Sharp Lines", value: "fade" },
      { text: "Long & Styled", value: "long" },
    ],
  },
  {
    id: 3,
    question: "What's your budget?",
    options: [
      { text: "Budget (5-8 JOD)", value: "budget" },
      { text: "Standard (8-12 JOD)", value: "standard" },
      { text: "Premium (12-20 JOD)", value: "premium" },
      { text: "Luxury (20+ JOD)", value: "luxury" },
    ],
  },
  {
    id: 4,
    question: "What vibe do you prefer?",
    options: [
      { text: "Traditional & Quiet", value: "traditional" },
      { text: "Modern & Energetic", value: "energetic" },
      { text: "Upscale & Sophisticated", value: "upscale" },
      { text: "Casual & Friendly", value: "casual" },
    ],
  },
  {
    id: 5,
    question: "Any special services?",
    options: [
      { text: "Beard Grooming", value: "beard" },
      { text: "Hair Coloring", value: "coloring" },
      { text: "Scalp Treatment", value: "scalp" },
      { text: "Just Haircut", value: "haircut_only" },
    ],
  },
];

const shopPreferences = {
  1: {
    straight: 4,
    wavy: 5,
    curly: 4,
    coily: 3,
    classic: 3,
    modern: 5,
    fade: 5,
    long: 3,
    budget: 2,
    standard: 5,
    premium: 3,
    luxury: 2,
    traditional: 2,
    energetic: 5,
    upscale: 3,
    casual: 4,
    beard: 5,
    coloring: 3,
    scalp: 2,
    haircut_only: 4,
  },
  2: {
    straight: 5,
    wavy: 4,
    curly: 3,
    coily: 3,
    classic: 5,
    modern: 2,
    fade: 3,
    long: 4,
    budget: 1,
    standard: 3,
    premium: 5,
    luxury: 4,
    traditional: 5,
    energetic: 2,
    upscale: 5,
    casual: 3,
    beard: 5,
    coloring: 2,
    scalp: 4,
    haircut_only: 5,
  },
  3: {
    straight: 5,
    wavy: 4,
    curly: 3,
    coily: 4,
    classic: 2,
    modern: 5,
    fade: 5,
    long: 2,
    budget: 5,
    standard: 4,
    premium: 2,
    luxury: 1,
    traditional: 1,
    energetic: 5,
    upscale: 2,
    casual: 5,
    beard: 4,
    coloring: 3,
    scalp: 2,
    haircut_only: 5,
  },
  4: {
    straight: 4,
    wavy: 4,
    curly: 4,
    coily: 3,
    classic: 4,
    modern: 3,
    fade: 3,
    long: 3,
    budget: 3,
    standard: 5,
    premium: 3,
    luxury: 2,
    traditional: 3,
    energetic: 3,
    upscale: 3,
    casual: 5,
    beard: 4,
    coloring: 2,
    scalp: 3,
    haircut_only: 5,
  },
  5: {
    straight: 5,
    wavy: 4,
    curly: 3,
    coily: 2,
    classic: 4,
    modern: 3,
    fade: 4,
    long: 2,
    budget: 5,
    standard: 4,
    premium: 2,
    luxury: 1,
    traditional: 3,
    energetic: 3,
    upscale: 1,
    casual: 5,
    beard: 3,
    coloring: 1,
    scalp: 1,
    haircut_only: 5,
  },
  6: {
    straight: 5,
    wavy: 5,
    curly: 4,
    coily: 3,
    classic: 5,
    modern: 3,
    fade: 2,
    long: 5,
    budget: 1,
    standard: 2,
    premium: 4,
    luxury: 5,
    traditional: 5,
    energetic: 2,
    upscale: 5,
    casual: 2,
    beard: 5,
    coloring: 4,
    scalp: 5,
    haircut_only: 4,
  },
  7: {
    straight: 5,
    wavy: 5,
    curly: 5,
    coily: 4,
    classic: 3,
    modern: 5,
    fade: 5,
    long: 4,
    budget: 2,
    standard: 3,
    premium: 5,
    luxury: 4,
    traditional: 2,
    energetic: 5,
    upscale: 5,
    casual: 3,
    beard: 5,
    coloring: 5,
    scalp: 4,
    haircut_only: 4,
  },
  8: {
    straight: 5,
    wavy: 4,
    curly: 3,
    coily: 3,
    classic: 5,
    modern: 2,
    fade: 3,
    long: 3,
    budget: 5,
    standard: 4,
    premium: 2,
    luxury: 1,
    traditional: 5,
    energetic: 2,
    upscale: 2,
    casual: 4,
    beard: 4,
    coloring: 1,
    scalp: 2,
    haircut_only: 5,
  },
  9: {
    straight: 4,
    wavy: 5,
    curly: 5,
    coily: 4,
    classic: 3,
    modern: 5,
    fade: 4,
    long: 5,
    budget: 2,
    standard: 4,
    premium: 4,
    luxury: 3,
    traditional: 2,
    energetic: 4,
    upscale: 4,
    casual: 3,
    beard: 3,
    coloring: 5,
    scalp: 4,
    haircut_only: 3,
  },
  10: {
    straight: 5,
    wavy: 5,
    curly: 5,
    coily: 5,
    classic: 5,
    modern: 4,
    fade: 3,
    long: 5,
    budget: 1,
    standard: 2,
    premium: 4,
    luxury: 5,
    traditional: 4,
    energetic: 3,
    upscale: 5,
    casual: 2,
    beard: 5,
    coloring: 5,
    scalp: 5,
    haircut_only: 4,
  },
  11: {
    straight: 4,
    wavy: 4,
    curly: 3,
    coily: 3,
    classic: 4,
    modern: 3,
    fade: 3,
    long: 2,
    budget: 3,
    standard: 5,
    premium: 3,
    luxury: 2,
    traditional: 4,
    energetic: 3,
    upscale: 2,
    casual: 5,
    beard: 5,
    coloring: 2,
    scalp: 2,
    haircut_only: 5,
  },
  12: {
    straight: 5,
    wavy: 4,
    curly: 3,
    coily: 2,
    classic: 5,
    modern: 2,
    fade: 3,
    long: 2,
    budget: 5,
    standard: 4,
    premium: 2,
    luxury: 1,
    traditional: 4,
    energetic: 2,
    upscale: 1,
    casual: 5,
    beard: 3,
    coloring: 1,
    scalp: 1,
    haircut_only: 5,
  },
};

function openQuizModal() {
  document.getElementById("quizModalOverlay").classList.add("active");
  document.body.style.overflow = "hidden";
}

function closeQuizModal() {
  document.getElementById("quizModalOverlay").classList.remove("active");
  document.body.style.overflow = "";
}

function quizSelectAnswer(answerText, answerValue) {
  const chatArea = document.getElementById("quizChatArea");
  const optionsArea = document.getElementById("quizOptionsArea");

  quizUserAnswers[`q${quizCurrentQuestion}`] = answerValue;

  const userBubble = document.createElement("div");
  userBubble.className = "chat-bubble bubble-user";
  userBubble.innerHTML = `
    <div class="bubble-text">${answerText}</div>
    <div class="bubble-label">You</div>
  `;
  chatArea.appendChild(userBubble);

  setTimeout(() => {
    chatArea.scrollTo({
      top: chatArea.scrollHeight,
      behavior: "smooth",
    });
  }, 100);

  optionsArea.innerHTML = "";

  setTimeout(() => {
    const typingIndicator = document.createElement("div");
    typingIndicator.className = "quiz-typing-indicator";
    typingIndicator.innerHTML = `
      <div class="quiz-typing-dot"></div>
      <div class="quiz-typing-dot"></div>
      <div class="quiz-typing-dot"></div>
    `;
    chatArea.appendChild(typingIndicator);

    setTimeout(() => {
      chatArea.scrollTo({
        top: chatArea.scrollHeight,
        behavior: "smooth",
      });
    }, 100);

    setTimeout(() => {
      typingIndicator.remove();

      if (quizCurrentQuestion < quizTotalQuestions) {
        quizCurrentQuestion++;
        showNextQuizQuestion();
      } else {
        showQuizResults();
      }
    }, 1500);
  }, 600);
}

function showNextQuizQuestion() {
  const chatArea = document.getElementById("quizChatArea");
  const optionsArea = document.getElementById("quizOptionsArea");
  const question = quizQuestions[quizCurrentQuestion - 1];

  updateQuizProgress();

  const botBubble = document.createElement("div");
  botBubble.className = "chat-bubble bubble-bot";
  botBubble.innerHTML = `
    <div class="bubble-text">${question.question}</div>
    <div class="bubble-label">BarberLink</div>
  `;
  chatArea.appendChild(botBubble);

  setTimeout(() => {
    chatArea.scrollTo({
      top: chatArea.scrollHeight,
      behavior: "smooth",
    });
  }, 100);

  optionsArea.innerHTML = "";

  const row1 = document.createElement("div");
  row1.className = "quiz-options-row";
  question.options.slice(0, 2).forEach((option) => {
    const btn = document.createElement("button");
    btn.className = "quiz-option-btn";
    btn.onclick = () => quizSelectAnswer(option.text, option.value);
    btn.innerHTML = `<span>${option.text}</span>`;
    row1.appendChild(btn);
  });
  optionsArea.appendChild(row1);

  const row2 = document.createElement("div");
  row2.className = "quiz-options-row";
  question.options.slice(2, 4).forEach((option) => {
    const btn = document.createElement("button");
    btn.className = "quiz-option-btn";
    btn.onclick = () => quizSelectAnswer(option.text, option.value);
    btn.innerHTML = `<span>${option.text}</span>`;
    row2.appendChild(btn);
  });
  optionsArea.appendChild(row2);
}

function updateQuizProgress() {
  const progressBar = document.getElementById("quizProgressBar");
  const progressText = document.getElementById("quizProgressText");
  const percentage = (quizCurrentQuestion / quizTotalQuestions) * 100;

  progressBar.style.width = percentage + "%";
  progressText.textContent = `Question ${quizCurrentQuestion} of ${quizTotalQuestions}`;
}

function calculateShopMatch(shopId) {
  const prefs = shopPreferences[shopId];
  if (!prefs) return 0;

  let totalScore = 0;
  let maxPossibleScore = 0;

  Object.keys(quizUserAnswers).forEach((key) => {
    const answer = quizUserAnswers[key];
    if (prefs[answer] !== undefined) {
      totalScore += prefs[answer];
    }
    maxPossibleScore += 5;
  });

  const basePercentage = Math.round((totalScore / maxPossibleScore) * 100);
  const randomAdjustment = Math.floor(Math.random() * 7) - 3;
  const finalPercentage = Math.max(
    55,
    Math.min(98, basePercentage + randomAdjustment)
  );

  return finalPercentage;
}

function showQuizResults() {
  const chatArea = document.getElementById("quizChatArea");
  const optionsArea = document.getElementById("quizOptionsArea");
  const resultsScreen = document.getElementById("quizResultsScreen");
  const progressBar = document.getElementById("progressBar");
  const progressPercentage = document.getElementById("progressPercentage");
  const progressStatus = document.getElementById("progressStatus");
  const retakeBtn = document.getElementById("retakeQuizBtn");

  retakeBtn.style.display = "none";

  const shopCards = document.querySelectorAll(".shop-card");
  const shopMatches = [];

  shopCards.forEach((card) => {
    const shopId = card.getAttribute("data-id");
    const match = calculateShopMatch(shopId);

    shopMatches.push({
      id: shopId,
      match: match,
      card: card,
    });
  });

  shopMatches.sort((a, b) => b.match - a.match);

  window.quizShopMatches = shopMatches;

  shopMatches.forEach((shop, index) => {
    const isTopMatch = index < 3;
    addMatchRingToCard(shop.card, shop.match, isTopMatch);
  });

  chatArea.style.display = "none";
  optionsArea.style.display = "none";

  resultsScreen.classList.add("active");

  let progress = 0;
  const duration = 3000;
  const steps = 60;
  const increment = 100 / steps;
  const stepDuration = duration / steps;

  const progressInterval = setInterval(() => {
    progress += increment;

    if (progress >= 100) {
      progress = 100;
      clearInterval(progressInterval);

      progressStatus.textContent = "Complete!";
      retakeBtn.style.display = "block";

      setTimeout(() => {
        closeAndShowFullResults();
      }, 2000);
    }

    progressBar.style.width = progress + "%";
    progressPercentage.textContent = Math.round(progress) + "%";

    if (progress < 30) {
      progressStatus.textContent = "Analyzing preferences...";
    } else if (progress < 60) {
      progressStatus.textContent = "Matching barbershops...";
    } else if (progress < 95) {
      progressStatus.textContent = "Calculating scores...";
    } else if (progress < 100) {
      progressStatus.textContent = "Almost done...";
    }
  }, stepDuration);

  window.quizProgressInterval = progressInterval;
}

function closeAndShowFullResults() {
  if (window.quizProgressInterval) {
    clearInterval(window.quizProgressInterval);
  }

  closeQuizModal();

  setTimeout(() => {
    const bookingSection = document.querySelector(".booking-section");
    if (bookingSection) {
      bookingSection.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }

    if (window.quizShopMatches) {
      window.quizShopMatches.slice(0, 3).forEach((shop, index) => {
        setTimeout(() => {
          shop.card.style.animation = "highlight 2s ease";
          setTimeout(() => {
            shop.card.style.animation = "";
          }, 2000);
        }, index * 500);
      });
    }
  }, 300);
}

function addMatchRingToCard(card, matchPercentage, isTopMatch = false) {
  const existingRing = card.querySelector(".match-ring-container");
  if (existingRing) {
    existingRing.remove();
  }

  const cardImage = card.querySelector(".card-image");
  if (!cardImage) return;

  const circumference = 2 * Math.PI * 25;
  const offset = circumference - (matchPercentage / 100) * circumference;

  const ringColor = isTopMatch ? "#22c55e" : "#ffffff";
  const ringBgColor = isTopMatch ? "#22c55e" : "#ffffff";
  const textColor = isTopMatch ? "#22c55e" : "#ffffff";

  const ringContainer = document.createElement("div");
  ringContainer.className = "match-ring-container";
  ringContainer.innerHTML = `
    <svg class="match-ring" width="60" height="60">
      <circle class="match-ring-circle match-ring-bg" cx="30" cy="30" r="25" 
        style="stroke: ${ringBgColor}; stroke-width: 5; fill: none;"/>
      <circle class="match-ring-circle match-ring-progress" cx="30" cy="30" r="25" 
        style="stroke: ${ringColor}; stroke-width: 5; fill: none; stroke-linecap: round;"
        stroke-dasharray="${circumference}" stroke-dashoffset="${circumference}"/>
    </svg>
    <div class="match-ring-text" style="color: ${textColor};">${matchPercentage}%</div>
  `;

  cardImage.appendChild(ringContainer);

  setTimeout(() => {
    const progressCircle = ringContainer.querySelector(".match-ring-progress");
    progressCircle.style.strokeDashoffset = offset;
  }, 100);
}

function restartQuiz() {
  quizCurrentQuestion = 1;
  Object.keys(quizUserAnswers).forEach((key) => delete quizUserAnswers[key]);

  const chatArea = document.getElementById("quizChatArea");
  const optionsArea = document.getElementById("quizOptionsArea");
  const resultsScreen = document.getElementById("quizResultsScreen");

  chatArea.innerHTML = `
    <div class="chat-bubble bubble-bot">
      <div class="bubble-text">Welcome! Let's find the perfect barbershop for you.</div>
      <div class="bubble-label">BarberLink</div>
    </div>
    <div class="chat-bubble bubble-bot">
      <div class="bubble-text">Answer 5 quick questions and we'll match you with the best shops.</div>
      <div class="bubble-label">BarberLink</div>
    </div>
    <div class="chat-bubble bubble-bot">
      <div class="bubble-text">What's your hair type?</div>
      <div class="bubble-label">BarberLink</div>
    </div>
  `;

  optionsArea.innerHTML = `
    <div class="quiz-options-row">
      <button class="quiz-option-btn" onclick="quizSelectAnswer('Straight Hair', 'straight')">
        <span>Straight Hair</span>
      </button>
      <button class="quiz-option-btn" onclick="quizSelectAnswer('Wavy Hair', 'wavy')">
        <span>Wavy Hair</span>
      </button>
    </div>
    <div class="quiz-options-row">
      <button class="quiz-option-btn" onclick="quizSelectAnswer('Curly Hair', 'curly')">
        <span>Curly Hair</span>
      </button>
      <button class="quiz-option-btn" onclick="quizSelectAnswer('Coily/Thick Hair', 'coily')">
        <span>Coily/Thick Hair</span>
      </button>
    </div>
  `;

  chatArea.style.display = "flex";
  optionsArea.style.display = "flex";
  resultsScreen.classList.remove("active");

  document
    .querySelectorAll(".match-ring-container")
    .forEach((ring) => ring.remove());

  updateQuizProgress();
}

// EVENT LISTENERS & INITIALIZATION

function updateSuggestionSelection(items) {
  items.forEach((item, index) => {
    if (index === suggestionIndex) {
      item.classList.add("selected");
      item.scrollIntoView({ block: "nearest", behavior: "smooth" });
    } else {
      item.classList.remove("selected");
    }
  });
}

function initializeEventListeners() {
  // Avatar click
  const userAvatar = document.getElementById("userAvatar");
  if (userAvatar) {
    userAvatar.addEventListener("click", function (e) {
      e.stopPropagation();
      toggleProfileDropdown();
    });
  }

  // Logout button
  const logoutBtn = document.getElementById("logoutBtn");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", function (e) {
      e.preventDefault();
      logout();
    });
  }

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

      if (newUsername.includes(" ")) {
        showFormMessage(
          "username-message",
          "Username cannot contain spaces",
          "error"
        );
        return;
      }

      if (newUsername.length < 3) {
        showFormMessage(
          "username-message",
          "Username must be at least 3 characters",
          "error"
        );
        return;
      }

      const users = getAllRegisteredUsers();
      const userIndex = users.findIndex((u) => u.email === currentUser.email);

      if (userIndex === -1) {
        showFormMessage(
          "username-message",
          "Error: Could not find user record. Please logout and login again.",
          "error"
        );
        return;
      }

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

      users[userIndex] = {
        ...users[userIndex],
        name: newUsername,
        username: newUsername,
        updatedAt: new Date().toISOString(),
      };

      localStorage.setItem("registeredUsers", JSON.stringify(users));
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

      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailPattern.test(newEmail)) {
        showFormMessage(
          "email-message",
          "Please enter a valid email address",
          "error"
        );
        return;
      }

      if (currentUser.password !== password) {
        showFormMessage("email-message", "Incorrect password", "error");
        return;
      }

      const users = getAllRegisteredUsers();
      const userIndex = users.findIndex((u) => u.email === currentUser.email);

      if (userIndex === -1) {
        showFormMessage(
          "email-message",
          "Error: Could not find user record. Please logout and login again.",
          "error"
        );
        return;
      }

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

      users[userIndex] = {
        ...users[userIndex],
        email: newEmail,
        updatedAt: new Date().toISOString(),
      };

      localStorage.setItem("registeredUsers", JSON.stringify(users));
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

      if (currentUser.password !== oldPassword) {
        showFormMessage(
          "password-message",
          "Current password is incorrect",
          "error"
        );
        return;
      }

      const passwordPattern = /^(?=.*[0-9]).{8,}$/;
      if (!passwordPattern.test(newPassword)) {
        showFormMessage(
          "password-message",
          "Password must be 8+ characters with at least 1 number",
          "error"
        );
        return;
      }

      if (newPassword !== confirmPassword) {
        showFormMessage(
          "password-message",
          "New passwords do not match",
          "error"
        );
        return;
      }

      const users = getAllRegisteredUsers();
      const userIndex = users.findIndex((u) => u.email === currentUser.email);

      if (userIndex === -1) {
        showFormMessage(
          "password-message",
          "Error: Could not find user record. Please logout and login again.",
          "error"
        );
        return;
      }

      users[userIndex] = {
        ...users[userIndex],
        password: newPassword,
        updatedAt: new Date().toISOString(),
      };

      localStorage.setItem("registeredUsers", JSON.stringify(users));
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

  // Profile Settings link
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

  // Close dropdown when clicking outside
  document.addEventListener("click", function (event) {
    const userProfile = document.getElementById("userProfile");
    const dropdown = document.getElementById("profileDropdown");

    if (userProfile && !userProfile.contains(event.target)) {
      if (dropdown) dropdown.classList.remove("show");
    }

    // Close sort dropdown
    const sortWrapper = document.querySelector(".sort-icon-wrapper");
    const sortDropdown = document.getElementById("sortIconDropdown");
    const sortBtn = document.getElementById("sortIconBtn");

    if (
      sortWrapper &&
      sortDropdown &&
      sortBtn &&
      !sortWrapper.contains(event.target)
    ) {
      sortDropdown.classList.remove("active");
      sortBtn.classList.remove("active");
      sortOptionIndex = -1;
    }

    // Close favorites panel
    const favWrapper = document.getElementById("favoritesIconWrapper");
    const favPanel = document.getElementById("favoritesPanel");

    if (favWrapper && favPanel && !favWrapper.contains(event.target)) {
      favPanel.classList.remove("active");
    }

    // Close suggestions
    if (!event.target.closest(".search-container")) {
      const suggestions = document.getElementById("suggestions");
      if (suggestions) {
        suggestions.classList.remove("active");
      }
      suggestionIndex = -1;
    }
  });

  // Keyboard navigation
  document.addEventListener("keydown", function (e) {
    // Sort dropdown
    const sortDropdown = document.getElementById("sortIconDropdown");
    if (sortDropdown && sortDropdown.classList.contains("active")) {
      const options = sortDropdown.querySelectorAll(".sort-icon-option");
      if (options.length === 0) return;

      if (e.key === "ArrowDown") {
        e.preventDefault();
        sortOptionIndex = (sortOptionIndex + 1) % options.length;
        updateSortOptionSelection(options);
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        sortOptionIndex =
          sortOptionIndex <= 0 ? options.length - 1 : sortOptionIndex - 1;
        updateSortOptionSelection(options);
      } else if (e.key === "Enter" && sortOptionIndex >= 0) {
        e.preventDefault();
        const selectedOption = options[sortOptionIndex];
        const value = selectedOption.getAttribute("data-value");
        selectSortIconOption(value, selectedOption.textContent.trim());
      } else if (e.key === "Escape") {
        sortDropdown.classList.remove("active");
        document.getElementById("sortIconBtn").classList.remove("active");
        sortOptionIndex = -1;
      }
      return;
    }

    // Suggestions
    const suggestions = document.getElementById("suggestions");
    if (!suggestions || !suggestions.classList.contains("active")) {
      // Escape key for modals
      if (e.key === "Escape") {
        closeForgotPasswordModal();
        closeResetConfirmation();
        closeProfileModal();
        closeQuizModal();
      }
      return;
    }

    const items = suggestions.querySelectorAll(".suggestion-item");
    if (items.length === 0) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      suggestionIndex = (suggestionIndex + 1) % items.length;
      updateSuggestionSelection(items);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      suggestionIndex =
        suggestionIndex <= 0 ? items.length - 1 : suggestionIndex - 1;
      updateSuggestionSelection(items);
    } else if (e.key === "Enter" && suggestionIndex >= 0) {
      e.preventDefault();
      items[suggestionIndex].click();
    } else if (e.key === "Escape") {
      suggestions.classList.remove("active");
      suggestionIndex = -1;
    }
  });

  // Scroll icon behavior
  const scrollIcon = document.querySelector(".container_mouse");
  if (scrollIcon) {
    window.addEventListener("scroll", function () {
      if (window.scrollY > 50) {
        scrollIcon.style.opacity = "0";
        scrollIcon.style.transition = "opacity 1s ease";
      } else {
        scrollIcon.style.display = "flex";
        scrollIcon.style.opacity = "1";
        scrollIcon.style.transition = "opacity 1s ease";
      }
    });
  }

  // Tip icon interaction
  const tipHint = document.querySelector(".item-hints .hint");
  let resetTimer = null;
  let isActive = false;

  if (tipHint) {
    const activateTip = (e) => {
      e.preventDefault();
      e.stopPropagation();

      isActive = true;
      tipHint.classList.add("active");

      if (resetTimer) {
        clearTimeout(resetTimer);
      }

      resetTimer = setTimeout(() => {
        tipHint.classList.remove("active");
        isActive = false;
      }, 3000);
    };

    tipHint.addEventListener("click", activateTip);
    tipHint.addEventListener("touchstart", activateTip);

    tipHint.addEventListener("mouseenter", (e) => {
      if (isActive) {
        e.preventDefault();
      }
    });
  }
}

// INITIALIZE ON PAGE LOAD

document.addEventListener("DOMContentLoaded", function () {
  // Initialize carousel
  initializeCarousel();

  // Load shops data
  loadShopsData();

  // Update favorites
  updateFavoritesCount();
  updateAllFavoriteButtons();

  // Display user profile
  displayUserProfile();

  // Initialize all event listeners
  initializeEventListeners();

  // Initialize quiz progress
  updateQuizProgress();

  // Add highlight animation keyframes
  const style = document.createElement("style");
  style.textContent = `
    @keyframes highlight {
      0%, 100% {
        transform: scale(1);
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
      }
      50% {
        transform: scale(1.03);
        box-shadow: 0 8px 30px rgba(25, 18, 101, 0.3);
      }
    }
  `;
  document.head.appendChild(style);
});

// Make functions globally accessible for onclick handlers in HTML
window.toggleFavorite = toggleFavorite;
window.toggleFavoritesPanel = toggleFavoritesPanel;
window.scrollToShop = scrollToShop;
window.enterSelectionMode = enterSelectionMode;
window.exitSelectionMode = exitSelectionMode;
window.toggleItemSelection = toggleItemSelection;
window.toggleSelectAll = toggleSelectAll;
window.deleteSelected = deleteSelected;
window.filterBranches = filterBranches;
window.performSearch = performSearch;
window.resetSearch = resetSearch;
window.selectFilter = selectFilter;
window.toggleSortIconDropdown = toggleSortIconDropdown;
window.selectSortIconOption = selectSortIconOption;
window.openProfileModal = openProfileModal;
window.closeProfileModal = closeProfileModal;
window.showSettingsOptions = showSettingsOptions;
window.showSettingForm = showSettingForm;
window.toggleModalPassword = toggleModalPassword;
window.openForgotPasswordModal = openForgotPasswordModal;
window.closeForgotPasswordModal = closeForgotPasswordModal;
window.handleForgotPassword = handleForgotPassword;
window.closeResetConfirmation = closeResetConfirmation;
window.openQuizModal = openQuizModal;
window.closeQuizModal = closeQuizModal;
window.quizSelectAnswer = quizSelectAnswer;
window.restartQuiz = restartQuiz;
window.logout = logout;
window.closeLogoutModal = closeLogoutModal;
window.confirmLogout = confirmLogout;
