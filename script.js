const header = document.querySelector("[data-header]");
const navToggle = document.querySelector("[data-nav-toggle]");
const navMenu = document.querySelector("[data-nav-menu]");
const navLinks = document.querySelectorAll(".nav-links a, .footer-links a");
const subscriptionCtas = document.querySelectorAll("[data-subscription-cta]");
const planButtons = document.querySelectorAll("[data-plan-button]");
const modalBackdrop = document.querySelector("[data-modal-backdrop]");
const closeModalButton = document.querySelector("[data-close-modal]");
const openReservationButtons = document.querySelectorAll("[data-open-reservation]");
const reservationForm = document.querySelector("[data-reservation-form]");
const reservationSuccess = document.querySelector("[data-reservation-success]");
const continueBrowsingButton = document.querySelector("[data-continue-browsing]");
const filterFinder = document.querySelector("[data-filter-finder]");
const finderStartButton = document.querySelector("[data-finder-start]");
const finderQuiz = document.querySelector("[data-finder-quiz]");
const finderSteps = document.querySelectorAll("[data-finder-step]");
const finderBackButton = document.querySelector("[data-finder-back]");
const finderNextButton = document.querySelector("[data-finder-next]");
const finderCompleteButton = document.querySelector("[data-finder-complete]");
const finderProgressLabel = document.querySelector("[data-finder-progress-label]");
const finderProgressBar = document.querySelector("[data-finder-progress-bar]");
const knownSizeField = document.querySelector("[data-known-size-field]");
const finderKnownSizeInput = document.querySelector("[data-finder-size-known]");
const finderFinalSizeInput = document.querySelector("[data-finder-size-final]");
const finderEmailInput = document.querySelector("[data-finder-email]");
const finderResult = document.querySelector("[data-finder-result]");
const finderResultSize = document.querySelector("[data-finder-result-size]");
const finderLocationGuidance = document.querySelector("[data-finder-location-guidance]");
const finderResultSchedule = document.querySelector("[data-finder-result-schedule]");
const finderEmailNote = document.querySelector("[data-finder-email-note]");
const finderStatusBadge = document.querySelector("[data-finder-status-badge]");
const finderSizeStatus = document.querySelector("[data-finder-size-status]");
const finderAnswerPills = document.querySelector("[data-finder-answer-pills]");
const finderGuidanceLabel = document.querySelector("[data-finder-guidance-label]");
const finderGuidanceShort = document.querySelector("[data-finder-guidance-short]");
const finderCopyButton = document.querySelector("[data-finder-copy]");
const finderCopyStatus = document.querySelector("[data-finder-copy-status]");
const finderToPlansButton = document.querySelector("[data-finder-to-plans]");
const finderToReservationButton = document.querySelector("[data-finder-to-reservation]");
const finderMatchScore = document.querySelector("[data-finder-match-score]");
const finderMatchBar = document.querySelector("[data-finder-match-bar]");
const finderMerv = document.querySelector("[data-finder-merv]");
const finderMervCopy = document.querySelector("[data-finder-merv-copy]");
const finderMonths = document.querySelector("[data-finder-months]");
const finderReminderCount = document.querySelector("[data-finder-reminder-count]");
const faqItems = document.querySelectorAll("[data-faq-item]");
const pricingSection = document.querySelector("#plans");
const pricingCards = document.querySelectorAll(".pricing-card");
const sizeAutocompleteInputs = document.querySelectorAll("[data-size-autocomplete]");
const exitAssist = document.querySelector("[data-exit-assist]");
const exitAssistText = document.querySelector("[data-exit-assist-text]");
const exitAssistAction = document.querySelector("[data-exit-assist-action]");
const exitAssistClose = document.querySelector("[data-exit-assist-close]");
const countdownEls = document.querySelectorAll("[data-countdown]");
const countdownView = document.querySelector("[data-countdown-view]");
const storageKey = "filterWizardReservations";
const finderStorageKey = "filterWizardFinderResults";
const countdownKey = "filterWizardFounderOfferEndsAt";
const fallbackPlan = {
  plan: "Plus",
  regular: "$39.99 / month",
  founder: "$19.99 / month",
  savings: "You save $20"
};
let selectedPlan = { ...fallbackPlan };
let countdownViewed = false;
let finderCurrentStep = 1;
const finderTotalSteps = 4;
const finderState = {
  knowsSize: "",
  location: "",
  conditions: [],
  knownSize: "",
  finalSize: "",
  email: "",
  recommendedSchedule: "",
  normalizedSize: "",
  recommendedFilterType: "",
  matchScore: 60,
  reminderMonths: []
};
let latestFinderReport = null;
let finderStarted = false;
let finderCompleted = false;
let finderAbandonedTracked = false;
let reservationModalOpened = false;
let reservationSubmitted = false;
let pricingViewedTracked = false;
let exitAssistShown = false;

const commonFilterSizes = [
  "10x20x1",
  "12x12x1",
  "12x20x1",
  "14x14x1",
  "14x20x1",
  "14x24x1",
  "14x25x1",
  "16x16x1",
  "16x20x1",
  "16x24x1",
  "16x25x1",
  "18x18x1",
  "18x20x1",
  "18x24x1",
  "18x25x1",
  "20x20x1",
  "20x24x1",
  "20x25x1",
  "20x30x1",
  "24x24x1",
  "24x30x1",
  "25x25x1"
];

function trackEvent(eventName, parameters = {}) {
  if (typeof window.gtag === "function") {
    window.gtag("event", eventName, parameters);
  }
}

function setHeaderState() {
  if (header) {
    header.classList.toggle("scrolled", window.scrollY > 8);
  }
}

function closeNav() {
  document.body.classList.remove("nav-open");
  navMenu?.classList.remove("open");
  navToggle?.setAttribute("aria-expanded", "false");
  navToggle?.setAttribute("aria-label", "Open navigation menu");
}

function toggleNav() {
  const isOpen = navToggle.getAttribute("aria-expanded") === "true";
  document.body.classList.toggle("nav-open", !isOpen);
  navMenu.classList.toggle("open", !isOpen);
  navToggle.setAttribute("aria-expanded", String(!isOpen));
  navToggle.setAttribute("aria-label", isOpen ? "Open navigation menu" : "Close navigation menu");
}

function setupRevealAnimations() {
  const revealItems = document.querySelectorAll(".reveal");

  if (!("IntersectionObserver" in window)) {
    revealItems.forEach((item) => item.classList.add("visible"));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12 }
  );

  revealItems.forEach((item) => observer.observe(item));
}

function getStoredReservations() {
  try {
    return JSON.parse(localStorage.getItem(storageKey)) || [];
  } catch (error) {
    console.warn("Filter Wizard reservations could not be read from localStorage.", error);
    return [];
  }
}

function saveReservation(reservation) {
  try {
    const reservations = getStoredReservations();
    reservations.push(reservation);
    localStorage.setItem(storageKey, JSON.stringify(reservations));
  } catch (error) {
    console.warn("Filter Wizard reservation could not be saved to localStorage.", error);
  }
}

function saveFinderResult(result) {
  try {
    const results = JSON.parse(localStorage.getItem(finderStorageKey)) || [];
    results.push(result);
    localStorage.setItem(finderStorageKey, JSON.stringify(results));
  } catch (error) {
    console.warn("Filter Wizard finder result could not be saved to localStorage.", error);
  }
}

function scrollToElement(element) {
  element?.scrollIntoView({
    behavior: "smooth",
    block: "start"
  });
}

function updateFinderProgress() {
  if (!finderProgressLabel || !finderProgressBar) return;
  finderProgressLabel.textContent = `Step ${finderCurrentStep} of ${finderTotalSteps} - ${getFinderStepLabel(finderCurrentStep)}`;
  finderProgressBar.style.width = `${(finderCurrentStep / finderTotalSteps) * 100}%`;
}

function showFinderStep(step) {
  finderCurrentStep = Math.min(finderTotalSteps, Math.max(1, step));

  finderSteps.forEach((stepEl) => {
    const isActive = Number(stepEl.dataset.finderStep) === finderCurrentStep;
    stepEl.hidden = !isActive;
    stepEl.classList.toggle("is-active", isActive);
    clearFinderError(stepEl);
  });

  if (finderBackButton) finderBackButton.hidden = finderCurrentStep === 1;
  if (finderNextButton) finderNextButton.hidden = finderCurrentStep === finderTotalSteps;
  if (finderCompleteButton) finderCompleteButton.hidden = finderCurrentStep !== finderTotalSteps;
  updateFinderProgress();
}

function startFilterFinder() {
  if (!finderQuiz || !filterFinder) return;

  finderStarted = true;
  finderQuiz.hidden = false;
  finderResult.hidden = true;
  finderResult?.classList.remove("report-visible");
  if (finderStartButton) finderStartButton.hidden = true;
  showFinderStep(1);
  scrollToElement(filterFinder);
  trackEvent("filter_finder_started");
}

function setFinderOption(button) {
  const group = button.dataset.finderOption;
  const value = button.dataset.value;

  if (group === "conditions") {
    updateFinderConditions(button, value);
    clearFinderError(button.closest("[data-finder-step]"));
    return;
  }

  finderState[group] = value;
  document.querySelectorAll(`[data-finder-option="${group}"]`).forEach((option) => {
    option.classList.toggle("selected", option === button);
    option.setAttribute("aria-pressed", String(option === button));
  });

  if (group === "knowsSize" && knownSizeField) {
    knownSizeField.hidden = value !== "Yes, I know it";
    if (value === "Yes, I know it") {
      setTimeout(() => finderKnownSizeInput?.focus(), 40);
    }
  }

  clearFinderError(button.closest("[data-finder-step]"));
}

function getFinderSize() {
  finderState.knownSize = finderKnownSizeInput?.value.trim() || "";
  finderState.finalSize = finderFinalSizeInput?.value.trim() || "";
  return normalizeFilterSize(finderState.finalSize || finderState.knownSize);
}

function normalizeFilterSize(value) {
  const trimmed = String(value || "").trim();
  if (!trimmed) return "";

  const lowered = trimmed
    .replace(/[×X]/g, "x")
    .replace(/\s*x\s*/g, "x")
    .replace(/\s+/g, " ");

  const spaceSeparatedNumbers = lowered.match(/^(\d+(?:\.\d+)?)\s+(\d+(?:\.\d+)?)\s+(\d+(?:\.\d+)?)$/);
  if (spaceSeparatedNumbers) {
    return `${spaceSeparatedNumbers[1]}x${spaceSeparatedNumbers[2]}x${spaceSeparatedNumbers[3]}`;
  }

  return lowered.replace(/\s+/g, "");
}

function updateFinderConditions(button, value) {
  if (value === "None of these") {
    finderState.conditions = button.classList.contains("selected") ? [] : ["None of these"];
  } else {
    const current = new Set(finderState.conditions.filter((condition) => condition !== "None of these"));
    if (current.has(value)) {
      current.delete(value);
    } else {
      current.add(value);
    }
    finderState.conditions = [...current];
  }

  document.querySelectorAll('[data-finder-option="conditions"]').forEach((option) => {
    const selected = finderState.conditions.includes(option.dataset.value);
    option.classList.toggle("selected", selected);
    option.setAttribute("aria-pressed", String(selected));
  });
}

function getActiveFinderStep() {
  return document.querySelector(`[data-finder-step="${finderCurrentStep}"]`);
}

function setFinderError(stepEl, message) {
  const errorEl = stepEl?.querySelector("[data-finder-error]");
  if (!errorEl) return;
  errorEl.textContent = message;
  errorEl.hidden = false;
}

function clearFinderError(stepEl) {
  const errorEl = stepEl?.querySelector("[data-finder-error]");
  if (!errorEl) return;
  errorEl.textContent = "";
  errorEl.hidden = true;
}

function validateFinderStep(step = finderCurrentStep) {
  const stepEl = document.querySelector(`[data-finder-step="${step}"]`);
  clearFinderError(stepEl);

  if (step === 1) {
    if (!finderState.knowsSize) {
      setFinderError(stepEl, "Choose one option to continue.");
      return false;
    }

    if (finderState.knowsSize === "Yes, I know it" && !finderKnownSizeInput?.value.trim()) {
      setFinderError(stepEl, "Enter your filter size before continuing.");
      finderKnownSizeInput?.focus();
      return false;
    }
  }

  if (step === 2 && !finderState.location) {
    setFinderError(stepEl, "Choose where your filter is located.");
    return false;
  }

  if (step === 4 && finderEmailInput?.value.trim() && !finderEmailInput.validity.valid) {
    setFinderError(stepEl, "Enter a valid email address or leave it blank.");
    finderEmailInput.focus();
    return false;
  }

  return true;
}

function getFinderStepName(step) {
  const names = {
    1: "filter_size",
    2: "filter_location",
    3: "home_conditions",
    4: "results"
  };
  return names[step] || `step_${step}`;
}

function getFinderStepLabel(step) {
  const labels = {
    1: "Filter Size",
    2: "Location",
    3: "Home Conditions",
    4: "Results"
  };
  return labels[step] || "Finder";
}

function trackFinderStepCompleted(step) {
  trackEvent("filter_finder_step_completed", {
    step_number: step,
    step_name: getFinderStepName(step)
  });
}

function getLocationGuidance(location) {
  const guidance = {
    "Ceiling return vent": "Check the edge of the filter behind your ceiling return grille. The size is usually printed on the cardboard frame.",
    "Wall return vent": "Open the wall return grille and check the cardboard edge of the filter for printed dimensions like 20x25x1.",
    "Furnace or air handler": "Look near the blower compartment or filter slot beside the furnace or air handler. The size is usually printed on the filter frame.",
    "I'm not sure": "Look for a large return grille inside your home or a filter slot near your HVAC unit. The filter size is usually printed on the cardboard edge."
  };
  return guidance[location] || guidance["I'm not sure"];
}

function getLocationVisual(location) {
  const visuals = {
    "Ceiling return vent": {
      label: "Ceiling return vent",
      text: "Start at the ceiling grille and check the filter frame edge."
    },
    "Wall return vent": {
      label: "Wall return vent",
      text: "Open the wall grille and look for printed dimensions on the filter frame."
    },
    "Furnace or air handler": {
      label: "Furnace or air handler",
      text: "Check the filter slot near the blower compartment or air handler."
    },
    "I'm not sure": {
      label: "Not sure",
      text: "Look for a large return grille or a filter slot near your HVAC unit."
    }
  };
  return visuals[location] || visuals["I'm not sure"];
}

function renderFinderPills(result) {
  if (!finderAnswerPills) return;

  const conditionPills = result.homeConditions.length
    ? result.homeConditions
    : ["Standard home conditions"];
  const pills = [
    result.knowsSize,
    result.location,
    ...conditionPills
  ].filter(Boolean);

  finderAnswerPills.innerHTML = "";
  pills.forEach((pill) => {
    const item = document.createElement("span");
    item.textContent = `✓ ${pill}`;
    finderAnswerPills.appendChild(item);
  });
}

function renderFinderReport(result) {
  const hasSize = result.filterSize !== "Check before ordering";
  const statusText = hasSize ? "✓ Likely Match" : "Size Confirmation Needed";
  const locationVisual = getLocationVisual(result.location);

  if (finderResultSize) finderResultSize.textContent = result.filterSize;
  if (finderStatusBadge) {
    finderStatusBadge.textContent = statusText;
    finderStatusBadge.classList.toggle("needs-confirmation", !hasSize);
  }
  if (finderSizeStatus) finderSizeStatus.textContent = hasSize ? "Likely Match" : "Size confirmation needed";
  if (finderLocationGuidance) finderLocationGuidance.textContent = getLocationGuidance(result.location);
  if (finderResultSchedule) finderResultSchedule.textContent = result.recommendedSchedule;
  if (finderMatchScore) finderMatchScore.textContent = `${result.matchScore}%`;
  if (finderMatchBar) finderMatchBar.style.width = `${result.matchScore}%`;
  if (finderMerv) finderMerv.textContent = result.recommendedFilterType;
  if (finderMervCopy) finderMervCopy.textContent = result.recommendedFilterCopy;
  if (finderMonths) {
    finderMonths.innerHTML = "";
    result.reminderMonths.forEach((month) => {
      const item = document.createElement("span");
      item.textContent = month;
      finderMonths.appendChild(item);
    });
  }
  if (finderReminderCount) finderReminderCount.textContent = String(result.reminderMonths.length);
  if (finderGuidanceLabel) finderGuidanceLabel.textContent = locationVisual.label;
  if (finderGuidanceShort) finderGuidanceShort.textContent = locationVisual.text;
  renderFinderPills(result);
}

function getFinderCopyText(result) {
  return [
    "Filter Wizard Report",
    `Filter size: ${result.filterSize}`,
    `Location: ${result.location}`,
    `Home conditions: ${result.homeConditions.length ? result.homeConditions.join(", ") : "Standard home conditions"}`,
    `Recommended schedule: ${result.recommendedSchedule}`,
    `Recommended filter type: ${result.recommendedFilterType}`,
    `Estimated reminders: ${result.reminderMonths.join(", ")}`
  ].join("\n");
}

function setFinderCopyStatus(message) {
  if (!finderCopyStatus) return;
  finderCopyStatus.textContent = message;
  finderCopyStatus.hidden = false;
}

function getRecommendedSchedule() {
  const conditions = finderState.conditions;
  if (conditions.some((condition) => ["Pets", "Allergies", "Heavy dust"].includes(condition))) {
    return "Every 30-60 days";
  }
  if (conditions.length === 1 && conditions.includes("Kids at home")) {
    return "Every 60-90 days";
  }
  if (conditions.includes("None of these")) {
    return "Every 90 days";
  }
  return "Every 60-90 days";
}

function getRecommendedFilterType() {
  const conditions = finderState.conditions;
  if (conditions.includes("Allergies")) {
    return {
      type: "MERV 13",
      copy: "MERV 13: Best for allergy-sensitive homes."
    };
  }
  if (conditions.some((condition) => ["Pets", "Heavy dust"].includes(condition))) {
    return {
      type: "MERV 11",
      copy: "MERV 11: Better for pets, dust, and higher filtration needs."
    };
  }
  return {
    type: "MERV 8",
    copy: "MERV 8: Best for most standard homes."
  };
}

function getReminderMonths(schedule) {
  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const count = schedule === "Every 30-60 days" ? 6 : 4;
  const interval = schedule === "Every 30-60 days" ? 2 : 3;
  const startMonth = new Date().getMonth();

  return Array.from({ length: count }, (_, index) => monthNames[(startMonth + index * interval) % 12]);
}

function getMatchScore(size, location) {
  if (size && location) return 94;
  if (size && !location) return 88;
  if (!size && location) return 72;
  return 60;
}

async function submitFinderEmail(result) {
  if (!reservationForm || !result.email) return true;

  const formData = new FormData();
  formData.set("_subject", "New Filter Wizard filter finder result");
  formData.set("source", "Filter Finder");
  formData.set("email", result.email);
  formData.set("knownSizeStatus", result.knowsSize);
  formData.set("enteredFilterSize", result.filterSize);
  formData.set("filterLocation", result.location);
  formData.set("homeConditions", result.homeConditions.join(", ") || "Not specified");
  formData.set("recommendedSchedule", result.recommendedSchedule);
  formData.set("recommendedFilterType", result.recommendedFilterType);
  formData.set("estimatedReminderMonths", result.reminderMonths.join(", "));
  formData.set("filterMatchScore", `${result.matchScore}%`);
  formData.set("submittedAt", result.submittedAt);

  try {
    await postToFormspree(reservationForm, formData);
    return true;
  } catch (error) {
    console.error("Filter Wizard finder email submission error:", error);
    return false;
  }
}

async function completeFilterFinder() {
  if (!validateFinderStep(finderCurrentStep)) return;

  trackFinderStepCompleted(finderCurrentStep);

  const foundSize = getFinderSize();
  finderState.email = finderEmailInput?.value.trim() || "";
  finderState.recommendedSchedule = getRecommendedSchedule();
  finderState.normalizedSize = foundSize;
  const filterType = getRecommendedFilterType();
  finderState.recommendedFilterType = filterType.type;
  finderState.matchScore = getMatchScore(foundSize, finderState.location);
  finderState.reminderMonths = getReminderMonths(finderState.recommendedSchedule);

  if (finderEmailNote) finderEmailNote.hidden = true;
  if (finderCopyStatus) finderCopyStatus.hidden = true;

  const result = {
    knowsSize: finderState.knowsSize || "Not answered",
    location: finderState.location || "Not answered",
    filterSize: foundSize || "Check before ordering",
    homeConditions: [...finderState.conditions],
    recommendedSchedule: finderState.recommendedSchedule,
    recommendedFilterType: filterType.type,
    recommendedFilterCopy: filterType.copy,
    reminderMonths: [...finderState.reminderMonths],
    matchScore: finderState.matchScore,
    normalizedFilterSize: foundSize || "",
    email: finderState.email || "",
    submittedAt: new Date().toISOString()
  };

  latestFinderReport = result;
  renderFinderReport(result);
  saveFinderResult(result);

  const shouldSubmitEmail = Boolean(finderState.email);

  if (shouldSubmitEmail) {
    trackEvent("filter_finder_email_entered");
  }

  trackEvent("filter_finder_completed", {
    knows_size: finderState.knowsSize,
    location: finderState.location,
    has_email: Boolean(finderState.email),
    recommended_schedule: finderState.recommendedSchedule,
    recommended_filter_type: result.recommendedFilterType,
    match_score: result.matchScore
  });
  trackEvent("filter_finder_result_viewed", {
    normalized_filter_size: result.normalizedFilterSize || "not_specified",
    location: result.location,
    recommended_schedule: result.recommendedSchedule,
    recommended_filter_type: result.recommendedFilterType,
    conditions_count: result.homeConditions.length,
    match_score: result.matchScore
  });

  finderCompleted = true;
  if (finderQuiz) finderQuiz.hidden = true;
  if (finderResult) {
    finderResult.hidden = false;
    window.requestAnimationFrame(() => {
      finderResult.classList.add("report-visible");
    });
  }
  scrollToElement(finderResult || filterFinder);

  if (shouldSubmitEmail) {
    const emailSubmitted = await submitFinderEmail(result);
    if (!emailSubmitted && finderEmailNote) {
      finderEmailNote.hidden = false;
    }
  }
}

function getCountdownEnd() {
  const fortyEightHours = 48 * 60 * 60 * 1000;
  const now = Date.now();

  try {
    const stored = Number(localStorage.getItem(countdownKey));
    if (stored && stored > now) return stored;

    const end = now + fortyEightHours;
    localStorage.setItem(countdownKey, String(end));
    return end;
  } catch (error) {
    return now + fortyEightHours;
  }
}

const countdownEnd = getCountdownEnd();

function formatTime(ms) {
  const totalSeconds = Math.max(0, Math.floor(ms / 1000));
  const hours = String(Math.floor(totalSeconds / 3600)).padStart(2, "0");
  const minutes = String(Math.floor((totalSeconds % 3600) / 60)).padStart(2, "0");
  const seconds = String(totalSeconds % 60).padStart(2, "0");
  return `${hours}:${minutes}:${seconds}`;
}

function updateCountdown() {
  const remaining = countdownEnd - Date.now();
  const display = remaining > 0 ? formatTime(remaining) : "Founder spots still open";
  countdownEls.forEach((el) => {
    el.textContent = display;
  });
}

function setupCountdownTracking() {
  if (!countdownView || !("IntersectionObserver" in window)) {
    trackCountdownViewed();
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          trackCountdownViewed();
          observer.disconnect();
        }
      });
    },
    { threshold: 0.35 }
  );

  observer.observe(countdownView);
}

function trackCountdownViewed() {
  if (countdownViewed) return;
  countdownViewed = true;
  trackEvent("founder_countdown_viewed");
}

function setSelectedPlan(plan) {
  selectedPlan = { ...fallbackPlan, ...plan };
  document.querySelector("[data-selected-plan]").textContent = selectedPlan.plan;
  document.querySelector("[data-selected-regular]").textContent = selectedPlan.regular;
  document.querySelector("[data-selected-founder]").textContent = selectedPlan.founder;
  document.querySelector("[data-selected-savings]").textContent = selectedPlan.savings;
  document.querySelector("[data-plan-field]").value = selectedPlan.plan;
  document.querySelector("[data-regular-field]").value = selectedPlan.regular;
  document.querySelector("[data-founder-field]").value = selectedPlan.founder;
}

function openReservation(plan = fallbackPlan) {
  setSelectedPlan(plan);
  reservationModalOpened = true;
  reservationSubmitted = false;
  if (exitAssist) {
    exitAssist.classList.remove("visible");
    exitAssist.hidden = true;
  }

  modalBackdrop.hidden = false;
  modalBackdrop.style.display = "grid";
  modalBackdrop.classList.remove("closing");

  reservationSuccess.hidden = true;
  reservationForm.hidden = false;

  setFormMessage(reservationForm, "clear");
  document.body.classList.add("modal-open");
  document.documentElement.classList.add("modal-open");

  setTimeout(() => {
    reservationForm?.querySelector("input[name='email']")?.focus();
  }, 50);

  trackEvent("reservation_started", {
    plan_name: plan.plan
  });
}

function closeReservation() {
  if (!modalBackdrop) return;

  const wasOpen = !modalBackdrop.hidden;
  modalBackdrop.classList.remove("closing");
  modalBackdrop.hidden = true;
  modalBackdrop.style.display = "none";
  document.body.classList.remove("modal-open");
  document.documentElement.classList.remove("modal-open");

  if (wasOpen && !reservationSubmitted) {
    trackEvent("reservation_modal_closed", {
      plan_name: selectedPlan.plan
    });
  }
}

window.closeReservation = closeReservation;

function setFormMessage(form, type, message = "") {
  const successMessage = form.querySelector("[data-form-success]");
  const errorMessage = form.querySelector("[data-form-error]");

  if (type === "success") {
    if (successMessage) successMessage.hidden = false;
    if (errorMessage) errorMessage.hidden = true;
    return;
  }

  if (type === "error") {
    if (message && errorMessage) errorMessage.textContent = message;
    if (errorMessage) errorMessage.hidden = false;
    if (successMessage) successMessage.hidden = true;
    return;
  }

  if (successMessage) successMessage.hidden = true;
  if (errorMessage) errorMessage.hidden = true;
}

async function postToFormspree(form, formData) {
  const response = await fetch(form.action, {
    method: "POST",
    body: formData,
    headers: {
      Accept: "application/json"
    }
  });

  if (!response.ok) {
    throw new Error(`Formspree submission failed with status ${response.status}`);
  }
}

async function handleReservationSubmit(event) {
  event.preventDefault();

  if (!reservationForm.checkValidity()) {
    reservationForm.reportValidity();
    return;
  }

  const formData = new FormData(reservationForm);
  const submitButton = reservationForm.querySelector(".form-submit");
  const submittedAt = new Date().toISOString();
  const email = String(formData.get("email") || "").trim();

  formData.set("submittedAt", submittedAt);
  formData.set("selectedPlan", selectedPlan.plan);
  formData.set("plannedRegularPrice", selectedPlan.regular);
  formData.set("founderPrice", selectedPlan.founder);
  formData.set("founderSavings", selectedPlan.savings);

  setFormMessage(reservationForm, "clear");
  submitButton.disabled = true;
  submitButton.textContent = "Reserving...";

  try {
    await postToFormspree(reservationForm, formData);
    const reservation = {
      email,
      selectedPlan: selectedPlan.plan,
      plannedRegularPrice: selectedPlan.regular,
      founderPrice: selectedPlan.founder,
      founderSavings: selectedPlan.savings,
      freeShipping: true,
      submittedAt
    };
    saveReservation(reservation);
    console.log("Filter Wizard subscription interest:", reservation);
    trackEvent("generate_lead", {
      form_location: "reservation_modal",
      plan_name: selectedPlan.plan
    });
    trackEvent("subscription_interest_confirmed", {
      plan_name: selectedPlan.plan
    });
    reservationSubmitted = true;
    reservationForm.hidden = true;
    reservationSuccess.hidden = false;
    reservationForm.reset();
  } catch (error) {
    console.error("Filter Wizard reservation submission error:", error);
    setFormMessage(reservationForm, "error", "Something went wrong while reserving your plan. Please try again in a moment.");
  } finally {
    submitButton.disabled = false;
    submitButton.textContent = "Reserve My Plan";
  }
}

function hideSizeSuggestions(container) {
  if (!container) return;
  container.hidden = true;
  container.innerHTML = "";
}

function renderSizeSuggestions(input) {
  const container = input.parentElement?.querySelector("[data-size-suggestions]");
  if (!container) return;

  const query = normalizeFilterSize(input.value);
  if (!query) {
    hideSizeSuggestions(container);
    return;
  }

  const matches = commonFilterSizes
    .filter((size) => size.startsWith(query) || size.includes(query))
    .slice(0, 6);

  if (!matches.length) {
    hideSizeSuggestions(container);
    return;
  }

  container.innerHTML = "";
  matches.forEach((size) => {
    const button = document.createElement("button");
    button.type = "button";
    button.textContent = size;
    button.addEventListener("click", () => {
      input.value = size;
      hideSizeSuggestions(container);
      input.focus();
      clearFinderError(input.closest("[data-finder-step]"));
    });
    container.appendChild(button);
  });
  container.hidden = false;
}

function setupSizeAutocomplete() {
  sizeAutocompleteInputs.forEach((input) => {
    input.addEventListener("input", () => renderSizeSuggestions(input));
    input.addEventListener("focus", () => renderSizeSuggestions(input));
    input.addEventListener("blur", () => {
      const container = input.parentElement?.querySelector("[data-size-suggestions]");
      window.setTimeout(() => hideSizeSuggestions(container), 140);
    });
  });
}

function setupPricingViewedTracking() {
  if (!pricingSection || pricingViewedTracked) return;

  if (!("IntersectionObserver" in window)) {
    pricingViewedTracked = true;
    trackEvent("pricing_card_viewed", {
      card_count: pricingCards.length
    });
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      if (entries.some((entry) => entry.isIntersecting) && !pricingViewedTracked) {
        pricingViewedTracked = true;
        trackEvent("pricing_card_viewed", {
          card_count: pricingCards.length
        });
        observer.disconnect();
      }
    },
    { threshold: 0.28 }
  );

  observer.observe(pricingSection);
}

function setupFinderAbandonTracking() {
  if (!filterFinder || !("IntersectionObserver" in window)) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (finderStarted && !finderCompleted && !finderAbandonedTracked && !entry.isIntersecting) {
          finderAbandonedTracked = true;
          trackEvent("finder_abandoned", {
            current_step: finderCurrentStep
          });
        }
      });
    },
    { threshold: 0.08 }
  );

  observer.observe(filterFinder);
}

function setupFaqTracking() {
  faqItems.forEach((item) => {
    item.addEventListener("toggle", () => {
      if (!item.open) return;

      faqItems.forEach((otherItem) => {
        if (otherItem !== item) otherItem.open = false;
      });

      trackEvent("faq_opened", {
        question: item.querySelector("summary")?.textContent.trim() || "Unknown question"
      });
    });
  });
}

function exitAssistDismissed() {
  try {
    return sessionStorage.getItem("filterWizardExitAssistDismissed") === "true";
  } catch (error) {
    return false;
  }
}

function dismissExitAssist() {
  if (!exitAssist) return;
  exitAssist.classList.remove("visible");
  exitAssist.hidden = true;
  try {
    sessionStorage.setItem("filterWizardExitAssistDismissed", "true");
  } catch (error) {
    // Session storage is optional; dismissal still works for this page view.
  }
}

function showExitAssist() {
  if (!exitAssist || exitAssistShown || exitAssistDismissed() || reservationModalOpened) return;

  exitAssistShown = true;
  if (exitAssistText) {
    exitAssistText.textContent = finderCompleted
      ? "Ready to never remember this again?"
      : "Still not sure what filter you need?";
  }
  if (exitAssistAction) {
    exitAssistAction.textContent = finderCompleted ? "Reserve Founder Pricing" : "Try Free Filter Finder";
  }

  exitAssist.hidden = false;
  window.requestAnimationFrame(() => exitAssist.classList.add("visible"));
  trackEvent("exit_assist_shown", {
    finder_completed: finderCompleted
  });
}

function setupExitAssist() {
  if (!exitAssist) return;

  window.addEventListener("scroll", () => {
    const scrollable = document.documentElement.scrollHeight - window.innerHeight;
    if (scrollable <= 0) return;
    const scrolled = window.scrollY / scrollable;
    if (scrolled >= 0.8) showExitAssist();
  }, { passive: true });

  exitAssistClose?.addEventListener("click", dismissExitAssist);
  exitAssistAction?.addEventListener("click", () => {
    trackEvent("exit_assist_clicked", {
      finder_completed: finderCompleted
    });
    dismissExitAssist();

    if (finderCompleted) {
      openReservation(selectedPlan);
      return;
    }

    startFilterFinder();
  });
}

setHeaderState();
setupRevealAnimations();
setupCountdownTracking();
setupPricingViewedTracking();
setupFinderAbandonTracking();
setupFaqTracking();
setupSizeAutocomplete();
setupExitAssist();
updateCountdown();
window.setInterval(updateCountdown, 1000);
window.addEventListener("scroll", setHeaderState, { passive: true });

if (navToggle && navMenu) {
  navToggle.addEventListener("click", toggleNav);

  navLinks.forEach((link) => {
    link.addEventListener("click", closeNav);
  });
}

subscriptionCtas.forEach((cta) => {
  cta.addEventListener("click", () => {
    trackEvent("subscription_cta_clicked", {
      link_text: cta.textContent.trim()
    });
  });
});

document.querySelector(".hero-actions [data-subscription-cta]")?.addEventListener("click", () => {
  trackEvent("hero_cta_clicked", {
    link_text: "Build My Filter Plan"
  });
});

planButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const plan = {
      plan: button.dataset.plan,
      regular: button.dataset.regular,
      founder: button.dataset.founder,
      savings: button.dataset.savings
    };
    trackEvent("plan_selected", {
      plan_name: plan.plan
    });
    openReservation(plan);
  });
});

openReservationButtons.forEach((button) => {
  button.addEventListener("click", () => {
    openReservation(selectedPlan);
  });
});

finderStartButton?.addEventListener("click", startFilterFinder);

document.querySelectorAll("[data-finder-option]").forEach((button) => {
  button.setAttribute("aria-pressed", "false");
  button.addEventListener("click", () => setFinderOption(button));
});

finderKnownSizeInput?.addEventListener("input", () => {
  clearFinderError(document.querySelector('[data-finder-step="1"]'));
});

finderEmailInput?.addEventListener("input", () => {
  clearFinderError(document.querySelector('[data-finder-step="4"]'));
});

finderNextButton?.addEventListener("click", () => {
  if (!validateFinderStep(finderCurrentStep)) return;
  trackFinderStepCompleted(finderCurrentStep);
  showFinderStep(finderCurrentStep + 1);
});

finderBackButton?.addEventListener("click", () => {
  showFinderStep(finderCurrentStep - 1);
});

finderCompleteButton?.addEventListener("click", completeFilterFinder);

finderToPlansButton?.addEventListener("click", () => {
  trackEvent("filter_finder_to_plans_clicked");
});

finderToReservationButton?.addEventListener("click", () => {
  trackEvent("filter_finder_to_reservation_clicked");
  openReservation(selectedPlan);
});

finderCopyButton?.addEventListener("click", async () => {
  if (!latestFinderReport) return;

  if (!navigator.clipboard?.writeText) {
    setFinderCopyStatus("Copy not available on this browser.");
    return;
  }

  try {
    await navigator.clipboard.writeText(getFinderCopyText(latestFinderReport));
    setFinderCopyStatus("Recommendation copied.");
    trackEvent("filter_finder_recommendation_copied", {
      normalized_filter_size: latestFinderReport.normalizedFilterSize || "not_specified",
      location: latestFinderReport.location,
      recommended_schedule: latestFinderReport.recommendedSchedule,
      recommended_filter_type: latestFinderReport.recommendedFilterType,
      conditions_count: latestFinderReport.homeConditions.length
    });
  } catch (error) {
    console.warn("Filter Wizard recommendation could not be copied.", error);
    setFinderCopyStatus("Copy not available on this browser.");
  }
});

closeModalButton?.addEventListener("click", closeReservation);

continueBrowsingButton?.addEventListener("click", closeReservation);

modalBackdrop.addEventListener("click", function(event) {
  if (event.target === modalBackdrop) {
    closeReservation();
  }
});

document.addEventListener("keydown", function(event) {
  if (event.key === "Escape") {
    if (navMenu?.classList.contains("open")) closeNav();
    closeReservation();
  }
});

reservationForm?.addEventListener("input", () => {
  setFormMessage(reservationForm, "clear");
});

reservationForm?.addEventListener("submit", handleReservationSubmit);
