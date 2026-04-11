// ─── Init ─────────────────────────────────────────────────────────────────────
history.scrollRestoration = 'manual';

// ─── Scroll Icon ──────────────────────────────────────────────────────────────
document.addEventListener("DOMContentLoaded", function () {
  const scrollIcon = document.querySelector(".container_mouse");

  window.addEventListener("scroll", function () {
    if (!scrollIcon) return;
    if (window.scrollY > 50) {
      scrollIcon.style.opacity = "0";
      scrollIcon.style.transition = "opacity 1s ease";
    } else {
      scrollIcon.style.display = "flex";
      scrollIcon.style.opacity = "1";
      scrollIcon.style.transition = "opacity 1s ease";
    }
  });

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
      if (resetTimer) clearTimeout(resetTimer);
      resetTimer = setTimeout(() => {
        tipHint.classList.remove("active");
        isActive = false;
      }, 3000);
    };

    tipHint.addEventListener("click", activateTip);
    tipHint.addEventListener("touchstart", activateTip);
    tipHint.addEventListener("mouseenter", (e) => { if (isActive) e.preventDefault(); });
  }
});

// ─── Carousel ─────────────────────────────────────────────────────────────────
const carouselTrack = document.getElementById("carouselTrack");
const prevBtn       = document.getElementById("prevBtn");
const nextBtn       = document.getElementById("nextBtn");
const progressBar   = document.getElementById("progressBar");

let currentIndex    = 0;
const totalSlides   = 6;
const autoPlayInterval = 3000;
let autoPlayTimer, progressTimer, progressValue = 0;

// Clone slides for infinite loop
carouselTrack.querySelectorAll(".carousel-slide").forEach(slide => {
  carouselTrack.appendChild(slide.cloneNode(true));
});

function updateCarousel(instant = false) {
  const slideWidth = carouselTrack.querySelector(".carousel-slide").offsetWidth;
  const offset     = -(currentIndex * (slideWidth + 30));

  if (instant) {
    carouselTrack.style.transition = "none";
    carouselTrack.style.transform  = `translateX(${offset}px)`;
    carouselTrack.offsetHeight; // force reflow
    carouselTrack.style.transition = "transform 0.8s cubic-bezier(0.4, 0, 0.2, 1)";
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
    setTimeout(() => { currentIndex = 0; updateCarousel(true); }, 800);
  }
}

function prevSlide() {
  if (currentIndex === 0) {
    currentIndex = totalSlides;
    updateCarousel(true);
    setTimeout(() => { currentIndex--; updateCarousel(); }, 50);
  } else {
    currentIndex--;
    updateCarousel();
  }
}

function updateProgress() {
  progressValue = Math.min(progressValue + 100 / (autoPlayInterval / 50), 100);
  progressBar.style.width = progressValue + "%";
}

function startAutoPlay() {
  stopAutoPlay();
  progressTimer = setInterval(updateProgress, 50);
  autoPlayTimer = setInterval(nextSlide, autoPlayInterval);
}

function stopAutoPlay() {
  clearInterval(autoPlayTimer);
  clearInterval(progressTimer);
}

prevBtn.addEventListener("click", () => { prevSlide(); startAutoPlay(); });
nextBtn.addEventListener("click", () => { nextSlide(); startAutoPlay(); });

const carouselContainer = document.querySelector(".carousel-container");
carouselContainer.addEventListener("mouseenter", stopAutoPlay);
carouselContainer.addEventListener("mouseleave", startAutoPlay);

let resizeTimer;
window.addEventListener("resize", () => {
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(() => updateCarousel(true), 250);
});

updateCarousel(true);
startAutoPlay();

// ─── Search & Filter State ────────────────────────────────────────────────────
let allShops        = [];
let favorites       = JSON.parse(localStorage.getItem("favoriteShops")) || [];
let selectionMode   = false;
let selectedFavorites = new Set();
let selectedFilter  = "all";
let currentSortValue = "default";
let suggestionIndex = -1;
let sortOptionIndex = -1;

document.addEventListener("DOMContentLoaded", function () {
  loadShopsData();
  updateFavoritesCount();
  updateAllFavoriteButtons();
});

// ─── Shop Data ────────────────────────────────────────────────────────────────
function loadShopsData() {
  allShops = Array.from(document.querySelectorAll(".shop-card")).map(card => ({
    id:       card.dataset.id,
    name:     card.querySelector(".shop-name").textContent,
    location: card.querySelector(".shop-location").textContent.trim().split("\n")[0].trim(),
    city:     card.dataset.city,
    rating:   parseFloat(card.querySelector(".rating-number").textContent),
    reviews:  parseInt(card.querySelector(".rating-count").textContent.replace(/[()]/g, "")),
    price:    card.querySelectorAll(".price-symbol:not(.inactive)").length,
    element:  card,
  }));
}

// ─── Search & Filter ──────────────────────────────────────────────────────────
function filterBranches() {
  const searchTerm = document.getElementById("searchInput")?.value.toLowerCase().trim() || "";

  if (searchTerm.length > 0) showSuggestions(searchTerm);
  else hideSuggestions();

  let filtered = allShops.filter(shop => {
    const matchesSearch = !searchTerm || shop.name.toLowerCase().includes(searchTerm) || shop.location.toLowerCase().includes(searchTerm);
    const matchesCity   = selectedFilter === "all" || shop.city === selectedFilter;
    return matchesSearch && matchesCity;
  });

  displayShops(sortShops(filtered));
}

function showSuggestions(searchTerm) {
  const suggestionsDiv = document.getElementById("suggestions");
  if (!suggestionsDiv) return;

  const matches = allShops
    .filter(shop => shop.name.toLowerCase().includes(searchTerm) || shop.location.toLowerCase().includes(searchTerm))
    .slice(0, 5);

  if (!matches.length) { hideSuggestions(); return; }

  suggestionsDiv.innerHTML = "";
  matches.forEach((shop, index) => {
    const item = document.createElement("div");
    item.className    = "suggestion-item";
    item.dataset.index = index;
    item.innerHTML    = `
      <div class="suggestion-text">
        <div class="suggestion-name">${highlightMatch(shop.name, searchTerm)}</div>
        <div class="suggestion-location">${highlightMatch(shop.location, searchTerm)}</div>
      </div>`;
    item.onclick = () => selectSuggestion(shop);
    suggestionsDiv.appendChild(item);
  });

  const searchInput = document.getElementById("searchInput");
  if (searchInput) {
    const rect = searchInput.getBoundingClientRect();
    Object.assign(suggestionsDiv.style, {
      top:   `${rect.bottom + 8}px`,
      left:  `${rect.left}px`,
      width: `${rect.width}px`,
      right: "auto",
    });
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
  return text.replace(new RegExp(`(${searchTerm})`, "gi"), '<span class="suggestion-match">$1</span>');
}

function selectSuggestion(shop) {
  const searchInput = document.getElementById("searchInput");
  if (searchInput) searchInput.value = shop.name;
  hideSuggestions();
  filterBranches();
}

function sortShops(shops) {
  const sorted = [...shops];
  switch (currentSortValue) {
    case "rating-high":  sorted.sort((a, b) => b.rating - a.rating); break;
    case "rating-low":   sorted.sort((a, b) => a.rating - b.rating); break;
    case "reviews-high": sorted.sort((a, b) => a.price  - b.price  || b.rating - a.rating); break;
    case "reviews-low":  sorted.sort((a, b) => b.price  - a.price  || b.rating - a.rating); break;
    case "name-asc":     sorted.sort((a, b) => a.name.localeCompare(b.name)); break;
    case "name-desc":    sorted.sort((a, b) => b.name.localeCompare(a.name)); break;
  }
  return sorted;
}

function displayShops(shops) {
  const grid = document.getElementById("shopsGrid");
  grid.innerHTML = "";

  if (!shops.length) {
    grid.innerHTML = `
      <div style="grid-column:1/-1;display:flex;flex-direction:column;align-items:center;padding:60px 20px;text-align:center;">
        <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="#ccc" stroke-width="2" style="margin-bottom:20px;"><circle cx="11" cy="11" r="8"></circle><path d="m21 21-4.35-4.35"></path><line x1="11" y1="8" x2="11" y2="14"></line><line x1="8" y1="11" x2="14" y2="11"></line></svg>
        <h3 style="color:#191265;font-size:20px;margin-bottom:10px;font-weight:600;">No Shops Found</h3>
        <p style="color:#666;font-size:14px;margin-bottom:20px;max-width:400px;">We could not find any barbershops matching your search.</p>
        <div style="background:#f8f9ff;padding:20px;border-radius:12px;max-width:450px;">
          <p style="color:#191265;font-weight:600;margin-bottom:12px;font-size:14px;">Try these options:</p>
          <ul style="text-align:left;color:#666;font-size:13px;line-height:1.8;list-style:none;padding:0;">
            <li style="margin-bottom:8px;">✓ Check your spelling</li>
            <li style="margin-bottom:8px;">✓ Use different keywords</li>
            <li style="margin-bottom:8px;">✓ Try selecting "All" in the city filter</li>
            <li style="margin-bottom:8px;">✓ Clear your search and browse all shops</li>
          </ul>
        </div>
      </div>`;
    return;
  }

  shops.forEach(shop => grid.appendChild(shop.element));
}

// ─── Sort Dropdown ────────────────────────────────────────────────────────────
function toggleSortIconDropdown() {
  const dropdown = document.getElementById("sortIconDropdown");
  const btn      = document.getElementById("sortIconBtn");
  if (!dropdown || !btn) return;

  const isActive = dropdown.classList.contains("active");
  dropdown.classList.toggle("active");
  btn.classList.toggle("active");

  if (!isActive) {
    const rect = btn.getBoundingClientRect();
    Object.assign(dropdown.style, { top: `${rect.bottom + 10}px`, left: `${rect.right - 200}px`, right: "auto" });

    sortOptionIndex = -1;
    dropdown.querySelectorAll(".sort-icon-option").forEach((opt, i) => {
      if (opt.classList.contains("selected")) sortOptionIndex = i;
    });
  }
}

function selectSortIconOption(value) {
  currentSortValue = value;

  document.querySelectorAll(".sort-icon-option").forEach(opt => {
    opt.classList.toggle("selected", opt.dataset.value === value);
  });

  const dropdown = document.getElementById("sortIconDropdown");
  const btn      = document.getElementById("sortIconBtn");
  dropdown?.classList.remove("active");
  btn?.classList.remove("active");

  filterBranches();
}

function resetSearch() {
  const searchInput = document.getElementById("searchInput");
  if (searchInput) searchInput.value = "";
  hideSuggestions();
  filterBranches();
}

function selectFilter(filter) {
  selectedFilter = filter;
  document.querySelectorAll(".filter-btn").forEach(btn => btn.classList.remove("active"));
  event.target.classList.add("active");
  filterBranches();
}

function performSearch() { filterBranches(); }

// ─── Favorites ────────────────────────────────────────────────────────────────
function toggleFavorite(shopId, event) {
  event.stopPropagation();
  const index = favorites.indexOf(shopId);
  if (index > -1) favorites.splice(index, 1);
  else favorites.push(shopId);

  localStorage.setItem("favoriteShops", JSON.stringify(favorites));
  updateFavoritesCount();
  updateFavoriteButton(shopId);
  updateFavoritesPanel();
}

function updateFavoritesCount() {
  const countEl = document.getElementById("favoritesCount");
  if (!countEl) return;
  countEl.textContent = favorites.length;
  countEl.classList.toggle("hidden", favorites.length === 0);
}

function updateFavoriteButton(shopId) {
  const card = document.querySelector(`.shop-card[data-id="${shopId}"]`);
  if (!card) return;
  const svg = card.querySelector(".favorite-btn svg");
  const isFav = favorites.includes(shopId);
  svg.setAttribute("data-favorited", isFav ? "true" : "");
  svg.style.fill   = isFav ? "#191265" : "none";
  svg.style.stroke = "#191265";
}

function updateAllFavoriteButtons() {
  document.querySelectorAll(".shop-card").forEach(card => updateFavoriteButton(card.dataset.id));
}

function toggleFavoritesPanel() {
  const panel = document.getElementById("favoritesPanel");
  panel.classList.toggle("active");

  if (panel.classList.contains("active")) updateFavoritesPanel();
  else if (selectionMode) exitSelectionMode();
}

function updateFavoritesPanel() {
  const listEl    = document.getElementById("favoritesList");
  const selectBtn = document.getElementById("selectModeBtn");

  if (!favorites.length) {
    listEl.innerHTML = '<p class="no-favorites">No favorites yet</p>';
    if (selectBtn) selectBtn.style.display = "none";
    if (selectionMode) exitSelectionMode();
    return;
  }

  if (selectBtn) selectBtn.style.display = "block";
  listEl.innerHTML = "";

  favorites.forEach(shopId => {
    const shop = allShops.find(s => s.id === shopId);
    if (!shop) return;

    const item       = document.createElement("div");
    item.className   = "favorite-item";
    item.dataset.shopId = shopId;

    if (!selectionMode) {
      item.onclick = () => scrollToShop(shopId);
    } else {
      item.classList.add("selection-mode");
      if (selectedFavorites.has(shopId)) item.classList.add("selected");
    }

    const imgSrc = shop.element.querySelector(".card-image img")?.src || "";

    item.innerHTML = `
      <input type="checkbox" class="favorite-item-checkbox" ${selectedFavorites.has(shopId) ? "checked" : ""}
             onchange="toggleItemSelection('${shopId}', this)" onclick="event.stopPropagation()">
      <img src="${imgSrc}" alt="${shop.name}">
      <div class="favorite-item-info">
        <div class="favorite-item-name">${shop.name}</div>
        <div class="favorite-item-location">${shop.location}</div>
      </div>
      <button class="remove-favorite" onclick="event.stopPropagation(); toggleFavorite('${shopId}', event)">×</button>`;

    listEl.appendChild(item);
  });
}

function scrollToShop(shopId) {
  const card = document.querySelector(`.shop-card[data-id="${shopId}"]`);
  if (!card) return;
  toggleFavoritesPanel();
  card.scrollIntoView({ behavior: "smooth", block: "center" });
  card.style.animation = "highlight 1s ease";
  setTimeout(() => (card.style.animation = ""), 1000);
}

function enterSelectionMode() {
  selectionMode = true;
  selectedFavorites.clear();

  document.getElementById("selectModeBtn").style.display = "none";
  document.getElementById("selectionModeButtons").classList.add("active");
  document.getElementById("selectAllCheckbox").classList.add("active");
  document.querySelector(".favorites-panel-header").classList.add("selection-active");

  document.querySelectorAll(".favorite-item").forEach(item => {
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
  document.querySelector(".favorites-panel-header").classList.remove("selection-active");

  document.querySelectorAll(".favorite-item").forEach(item => {
    item.classList.remove("selection-mode", "selected");
    const cb = item.querySelector(".favorite-item-checkbox");
    if (cb) cb.checked = false;
  });

  updateFavoritesPanel();
}

function toggleItemSelection(shopId, checkbox) {
  if (checkbox.checked) { selectedFavorites.add(shopId); checkbox.closest(".favorite-item").classList.add("selected"); }
  else                  { selectedFavorites.delete(shopId); checkbox.closest(".favorite-item").classList.remove("selected"); }

  const total = document.querySelectorAll(".favorite-item").length;
  document.getElementById("selectAllInput").checked = selectedFavorites.size === total;
  updateDeleteButton();
}

function toggleSelectAll() {
  const isChecked = document.getElementById("selectAllInput").checked;
  selectedFavorites.clear();

  document.querySelectorAll(".favorite-item").forEach(item => {
    const cb     = item.querySelector(".favorite-item-checkbox");
    const shopId = item.dataset.shopId;
    cb.checked   = isChecked;
    if (isChecked) { selectedFavorites.add(shopId); item.classList.add("selected"); }
    else             item.classList.remove("selected");
  });

  updateDeleteButton();
}

function updateDeleteButton() {
  const btn   = document.getElementById("deleteSelectedBtn");
  const count = selectedFavorites.size;
  btn.disabled    = count === 0;
  btn.textContent = count > 0 ? `Delete (${count})` : "Delete";
}

function deleteSelected() {
  if (!selectedFavorites.size) return;
  selectedFavorites.forEach(shopId => {
    const i = favorites.indexOf(shopId);
    if (i > -1) favorites.splice(i, 1);
  });
  localStorage.setItem("favoriteShops", JSON.stringify(favorites));
  updateFavoritesCount();
  updateAllFavoriteButtons();
  exitSelectionMode();
  updateFavoritesPanel();
}

// ─── Click-Outside Handling ───────────────────────────────────────────────────
document.addEventListener("click", function (e) {
  const sortWrapper  = document.querySelector(".sort-icon-wrapper");
  const sortDropdown = document.getElementById("sortIconDropdown");
  const sortBtn      = document.getElementById("sortIconBtn");

  if (sortWrapper && sortDropdown && sortBtn && !sortWrapper.contains(e.target) && !sortDropdown.contains(e.target)) {
    sortDropdown.classList.remove("active");
    sortBtn.classList.remove("active");
    sortOptionIndex = -1;
  }

  const favWrapper = document.getElementById("favoritesIconWrapper");
  const favPanel   = document.getElementById("favoritesPanel");
  if (favWrapper && favPanel && !favWrapper.contains(e.target)) {
    favPanel.classList.remove("active");
  }

  if (!e.target.closest(".search-container")) {
    document.getElementById("suggestions")?.classList.remove("active");
    suggestionIndex = -1;
  }
});

// ─── Keyboard Navigation ──────────────────────────────────────────────────────
document.addEventListener("keydown", function (e) {
  const sortDropdown = document.getElementById("sortIconDropdown");

  if (sortDropdown?.classList.contains("active")) {
    const options = sortDropdown.querySelectorAll(".sort-icon-option");
    if (!options.length) return;

    if (e.key === "ArrowDown") { e.preventDefault(); sortOptionIndex = (sortOptionIndex + 1) % options.length; updateSortOptionSelection(options); }
    else if (e.key === "ArrowUp") { e.preventDefault(); sortOptionIndex = sortOptionIndex <= 0 ? options.length - 1 : sortOptionIndex - 1; updateSortOptionSelection(options); }
    else if (e.key === "Enter" && sortOptionIndex >= 0) { e.preventDefault(); selectSortIconOption(options[sortOptionIndex].dataset.value); }
    else if (e.key === "Escape") { sortDropdown.classList.remove("active"); document.getElementById("sortIconBtn").classList.remove("active"); sortOptionIndex = -1; }
    return;
  }

  const suggestions = document.getElementById("suggestions");
  if (!suggestions?.classList.contains("active")) return;

  const items = suggestions.querySelectorAll(".suggestion-item");
  if (!items.length) return;

  if (e.key === "ArrowDown") { e.preventDefault(); suggestionIndex = (suggestionIndex + 1) % items.length; updateSuggestionSelection(items); }
  else if (e.key === "ArrowUp") { e.preventDefault(); suggestionIndex = suggestionIndex <= 0 ? items.length - 1 : suggestionIndex - 1; updateSuggestionSelection(items); }
  else if (e.key === "Enter" && suggestionIndex >= 0) { e.preventDefault(); items[suggestionIndex].click(); }
  else if (e.key === "Escape") { suggestions.classList.remove("active"); suggestionIndex = -1; }
});

function updateSortOptionSelection(options) {
  options.forEach((opt, i) => {
    opt.style.background = i === sortOptionIndex ? "#f8f9ff" : (opt.classList.contains("selected") ? "" : "");
    if (i === sortOptionIndex) opt.scrollIntoView({ block: "nearest", behavior: "smooth" });
  });
}

function updateSuggestionSelection(items) {
  items.forEach((item, i) => {
    item.classList.toggle("selected", i === suggestionIndex);
    if (i === suggestionIndex) item.scrollIntoView({ block: "nearest", behavior: "smooth" });
  });
}

// ─── Quiz ─────────────────────────────────────────────────────────────────────
let quizCurrentQuestion = 1;
const quizTotalQuestions = 5;
const quizUserAnswers    = {};

const quizQuestions = [
  { id: 1, question: "What's your hair type?",       options: [{ text: "Straight Hair", value: "straight" }, { text: "Wavy Hair", value: "wavy" }, { text: "Curly Hair", value: "curly" }, { text: "Coily/Thick Hair", value: "coily" }] },
  { id: 2, question: "What's your preferred style?", options: [{ text: "Classic & Clean", value: "classic" }, { text: "Modern & Trendy", value: "modern" }, { text: "Fade & Sharp Lines", value: "fade" }, { text: "Long & Styled", value: "long" }] },
  { id: 3, question: "What's your budget?",           options: [{ text: "Budget (5-8 JOD)", value: "budget" }, { text: "Standard (8-12 JOD)", value: "standard" }, { text: "Premium (12-20 JOD)", value: "premium" }, { text: "Luxury (20+ JOD)", value: "luxury" }] },
  { id: 4, question: "What vibe do you prefer?",      options: [{ text: "Traditional & Quiet", value: "traditional" }, { text: "Modern & Energetic", value: "energetic" }, { text: "Upscale & Sophisticated", value: "upscale" }, { text: "Casual & Friendly", value: "casual" }] },
  { id: 5, question: "Any special services?",          options: [{ text: "Beard Grooming", value: "beard" }, { text: "Hair Coloring", value: "coloring" }, { text: "Scalp Treatment", value: "scalp" }, { text: "Just Haircut", value: "haircut_only" }] },
];

const shopPreferences = {
  1:  { straight:4, wavy:5, curly:4, coily:3, classic:3, modern:5, fade:5, long:3, budget:2, standard:5, premium:3, luxury:2, traditional:2, energetic:5, upscale:3, casual:4, beard:5, coloring:3, scalp:2, haircut_only:4 },
  2:  { straight:5, wavy:4, curly:3, coily:3, classic:5, modern:2, fade:3, long:4, budget:1, standard:3, premium:5, luxury:4, traditional:5, energetic:2, upscale:5, casual:3, beard:5, coloring:2, scalp:4, haircut_only:5 },
  3:  { straight:5, wavy:4, curly:3, coily:4, classic:2, modern:5, fade:5, long:2, budget:5, standard:4, premium:2, luxury:1, traditional:1, energetic:5, upscale:2, casual:5, beard:4, coloring:3, scalp:2, haircut_only:5 },
  4:  { straight:4, wavy:4, curly:4, coily:3, classic:4, modern:3, fade:3, long:3, budget:3, standard:5, premium:3, luxury:2, traditional:3, energetic:3, upscale:3, casual:5, beard:4, coloring:2, scalp:3, haircut_only:5 },
  5:  { straight:5, wavy:4, curly:3, coily:2, classic:4, modern:3, fade:4, long:2, budget:5, standard:4, premium:2, luxury:1, traditional:3, energetic:3, upscale:1, casual:5, beard:3, coloring:1, scalp:1, haircut_only:5 },
  6:  { straight:5, wavy:5, curly:4, coily:3, classic:5, modern:3, fade:2, long:5, budget:1, standard:2, premium:4, luxury:5, traditional:5, energetic:2, upscale:5, casual:2, beard:5, coloring:4, scalp:5, haircut_only:4 },
  7:  { straight:5, wavy:5, curly:5, coily:4, classic:3, modern:5, fade:5, long:4, budget:2, standard:3, premium:5, luxury:4, traditional:2, energetic:5, upscale:5, casual:3, beard:5, coloring:5, scalp:4, haircut_only:4 },
  8:  { straight:5, wavy:4, curly:3, coily:3, classic:5, modern:2, fade:3, long:3, budget:5, standard:4, premium:2, luxury:1, traditional:5, energetic:2, upscale:2, casual:4, beard:4, coloring:1, scalp:2, haircut_only:5 },
  9:  { straight:4, wavy:5, curly:5, coily:4, classic:3, modern:5, fade:4, long:5, budget:2, standard:4, premium:4, luxury:3, traditional:2, energetic:4, upscale:4, casual:3, beard:3, coloring:5, scalp:4, haircut_only:3 },
  10: { straight:5, wavy:5, curly:5, coily:5, classic:5, modern:4, fade:3, long:5, budget:1, standard:2, premium:4, luxury:5, traditional:4, energetic:3, upscale:5, casual:2, beard:5, coloring:5, scalp:5, haircut_only:4 },
  11: { straight:4, wavy:4, curly:3, coily:3, classic:4, modern:3, fade:3, long:2, budget:3, standard:5, premium:3, luxury:2, traditional:4, energetic:3, upscale:2, casual:5, beard:5, coloring:2, scalp:2, haircut_only:5 },
  12: { straight:5, wavy:4, curly:3, coily:2, classic:5, modern:2, fade:3, long:2, budget:5, standard:4, premium:2, luxury:1, traditional:4, energetic:2, upscale:1, casual:5, beard:3, coloring:1, scalp:1, haircut_only:5 },
};

function openQuizModal()  { document.getElementById("quizModalOverlay").classList.add("active"); document.body.style.overflow = "hidden"; }
function closeQuizModal() { document.getElementById("quizModalOverlay").classList.remove("active"); document.body.style.overflow = ""; }

function quizSelectAnswer(answerText, answerValue) {
  const chatArea    = document.getElementById("quizChatArea");
  const optionsArea = document.getElementById("quizOptionsArea");

  quizUserAnswers[`q${quizCurrentQuestion}`] = answerValue;

  const userBubble = document.createElement("div");
  userBubble.className = "chat-bubble bubble-user";
  userBubble.innerHTML = `<div class="bubble-text">${answerText}</div><div class="bubble-label">You</div>`;
  chatArea.appendChild(userBubble);
  setTimeout(() => chatArea.scrollTo({ top: chatArea.scrollHeight, behavior: "smooth" }), 100);

  optionsArea.innerHTML = "";

  setTimeout(() => {
    const typing = document.createElement("div");
    typing.className = "quiz-typing-indicator";
    typing.innerHTML = `<div class="quiz-typing-dot"></div><div class="quiz-typing-dot"></div><div class="quiz-typing-dot"></div>`;
    chatArea.appendChild(typing);
    setTimeout(() => chatArea.scrollTo({ top: chatArea.scrollHeight, behavior: "smooth" }), 100);

    setTimeout(() => {
      typing.remove();
      if (quizCurrentQuestion < quizTotalQuestions) { quizCurrentQuestion++; showNextQuizQuestion(); }
      else showQuizResults();
    }, 1500);
  }, 600);
}

function showNextQuizQuestion() {
  const chatArea    = document.getElementById("quizChatArea");
  const optionsArea = document.getElementById("quizOptionsArea");
  const question    = quizQuestions[quizCurrentQuestion - 1];

  updateQuizProgress();

  const botBubble = document.createElement("div");
  botBubble.className = "chat-bubble bubble-bot";
  botBubble.innerHTML = `<div class="bubble-text">${question.question}</div><div class="bubble-label">BarberLink</div>`;
  chatArea.appendChild(botBubble);
  setTimeout(() => chatArea.scrollTo({ top: chatArea.scrollHeight, behavior: "smooth" }), 100);

  optionsArea.innerHTML = "";

  [question.options.slice(0, 2), question.options.slice(2, 4)].forEach(rowOptions => {
    const row = document.createElement("div");
    row.className = "quiz-options-row";
    rowOptions.forEach(option => {
      const btn = document.createElement("button");
      btn.className = "quiz-option-btn";
      btn.onclick   = () => quizSelectAnswer(option.text, option.value);
      btn.innerHTML = `<span>${option.text}</span>`;
      row.appendChild(btn);
    });
    optionsArea.appendChild(row);
  });
}

function updateQuizProgress() {
  const pct = (quizCurrentQuestion / quizTotalQuestions) * 100;
  document.getElementById("quizProgressBar").style.width = pct + "%";
  document.getElementById("quizProgressText").textContent = `Question ${quizCurrentQuestion} of ${quizTotalQuestions}`;
}

function calculateShopMatch(shopId) {
  const prefs = shopPreferences[shopId];
  if (!prefs) return 0;

  let total = 0, max = 0;
  Object.values(quizUserAnswers).forEach(answer => {
    if (prefs[answer] !== undefined) total += prefs[answer];
    max += 5;
  });

  const base       = Math.round((total / max) * 100);
  const adjustment = Math.floor(Math.random() * 7) - 3;
  return Math.max(55, Math.min(98, base + adjustment));
}

function showQuizResults() {
  const chatArea    = document.getElementById("quizChatArea");
  const optionsArea = document.getElementById("quizOptionsArea");
  const resultsEl   = document.getElementById("quizResultsScreen");
  const barEl       = document.getElementById("progressBar");
  const pctEl       = document.getElementById("progressPercentage");
  const statusEl    = document.getElementById("progressStatus");
  const retakeBtn   = document.getElementById("retakeQuizBtn");

  retakeBtn.style.display = "none";

  const shopMatches = Array.from(document.querySelectorAll(".shop-card"))
    .map(card => ({ id: card.dataset.id, match: calculateShopMatch(card.dataset.id), card }))
    .sort((a, b) => b.match - a.match);

  window.quizShopMatches = shopMatches;
  shopMatches.forEach((shop, i) => addMatchRingToCard(shop.card, shop.match, i < 3));

  chatArea.style.display    = "none";
  optionsArea.style.display = "none";
  resultsEl.classList.add("active");

  let progress = 0;
  const steps  = 60;
  const inc    = 100 / steps;
  const stepMs = 3000 / steps;

  const interval = setInterval(() => {
    progress = Math.min(progress + inc, 100);
    barEl.style.width        = progress + "%";
    pctEl.textContent        = Math.round(progress) + "%";

    if      (progress < 30)  statusEl.textContent = "Analyzing preferences...";
    else if (progress < 60)  statusEl.textContent = "Matching barbershops...";
    else if (progress < 95)  statusEl.textContent = "Calculating scores...";
    else if (progress < 100) statusEl.textContent = "Almost done...";

    if (progress >= 100) {
      clearInterval(interval);
      statusEl.textContent    = "Complete!";
      retakeBtn.style.display = "block";
      setTimeout(closeAndShowFullResults, 2000);
    }
  }, stepMs);

  window.quizProgressInterval = interval;
}

function closeAndShowFullResults() {
  clearInterval(window.quizProgressInterval);
  closeQuizModal();

  setTimeout(() => {
    document.querySelector(".search-filter-section")?.scrollIntoView({ behavior: "smooth", block: "start" });

    window.quizShopMatches?.slice(0, 3).forEach((shop, i) => {
      setTimeout(() => {
        shop.card.style.animation = "highlight 2s ease";
        setTimeout(() => (shop.card.style.animation = ""), 2000);
      }, i * 500);
    });
  }, 300);
}

function addMatchRingToCard(card, matchPercentage, isTopMatch = false) {
  card.querySelector(".match-ring-container")?.remove();

  const cardImage = card.querySelector(".card-image");
  if (!cardImage) return;

  const circumference = 2 * Math.PI * 25;
  const offset        = circumference - (matchPercentage / 100) * circumference;
  const color         = isTopMatch ? "#22c55e" : "#ffffff";

  const container = document.createElement("div");
  container.className = "match-ring-container";
  container.innerHTML = `
    <svg class="match-ring" width="60" height="60">
      <circle class="match-ring-circle match-ring-bg"       cx="30" cy="30" r="25" style="stroke:${color};stroke-width:5;fill:none;"/>
      <circle class="match-ring-circle match-ring-progress" cx="30" cy="30" r="25" style="stroke:${color};stroke-width:5;fill:none;stroke-linecap:round;"
              stroke-dasharray="${circumference}" stroke-dashoffset="${circumference}"/>
    </svg>
    <div class="match-ring-text" style="color:${color};">${matchPercentage}%</div>`;

  cardImage.appendChild(container);
  setTimeout(() => { container.querySelector(".match-ring-progress").style.strokeDashoffset = offset; }, 100);
}

function restartQuiz() {
  quizCurrentQuestion = 1;
  Object.keys(quizUserAnswers).forEach(k => delete quizUserAnswers[k]);

  const chatArea    = document.getElementById("quizChatArea");
  const optionsArea = document.getElementById("quizOptionsArea");
  const resultsEl   = document.getElementById("quizResultsScreen");

  chatArea.innerHTML = `
    <div class="chat-bubble bubble-bot"><div class="bubble-text">Welcome! Let's find the perfect barbershop for you.</div><div class="bubble-label">BarberLink</div></div>
    <div class="chat-bubble bubble-bot"><div class="bubble-text">Answer 5 quick questions and we'll match you with the best shops.</div><div class="bubble-label">BarberLink</div></div>
    <div class="chat-bubble bubble-bot"><div class="bubble-text">What's your hair type?</div><div class="bubble-label">BarberLink</div></div>`;

  optionsArea.innerHTML = `
    <div class="quiz-options-row">
      <button class="quiz-option-btn" onclick="quizSelectAnswer('Straight Hair', 'straight')"><span>Straight Hair</span></button>
      <button class="quiz-option-btn" onclick="quizSelectAnswer('Wavy Hair', 'wavy')"><span>Wavy Hair</span></button>
    </div>
    <div class="quiz-options-row">
      <button class="quiz-option-btn" onclick="quizSelectAnswer('Curly Hair', 'curly')"><span>Curly Hair</span></button>
      <button class="quiz-option-btn" onclick="quizSelectAnswer('Coily/Thick Hair', 'coily')"><span>Coily/Thick Hair</span></button>
    </div>`;

  chatArea.style.display    = "flex";
  optionsArea.style.display = "flex";
  resultsEl.classList.remove("active");

  document.querySelectorAll(".match-ring-container").forEach(r => r.remove());
  updateQuizProgress();
}

// ─── Coming Soon Modal ────────────────────────────────────────────────────────
document.addEventListener("DOMContentLoaded", function () {
  const overlay  = document.getElementById("csOverlay");
  const closeBtn = document.getElementById("csClose");
  const shopLink = document.getElementById("shopNavLink");
  if (!overlay) return;

  const open  = e => { e.preventDefault(); overlay.classList.add("active"); };
  const close = ()  => overlay.classList.remove("active");

  shopLink?.addEventListener("click", open);
  closeBtn?.addEventListener("click", close);
  overlay.addEventListener("click", e => { if (e.target === overlay) close(); });
});

// ─── Highlight Keyframe (injected once) ───────────────────────────────────────
const _highlightStyle = document.createElement("style");
_highlightStyle.textContent = `
  @keyframes highlight {
    0%, 100% { transform: scale(1);    box-shadow: 0 4px 12px rgba(0,0,0,.1); }
    50%       { transform: scale(1.03); box-shadow: 0 8px 30px rgba(25,18,101,.3); }
  }`;
document.head.appendChild(_highlightStyle);

// ─── Quiz Progress Init ───────────────────────────────────────────────────────
updateQuizProgress();