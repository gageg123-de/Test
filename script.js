const header = document.querySelector("[data-header]");
const navToggle = document.querySelector("[data-nav-toggle]");
const navMenu = document.querySelector("[data-nav-menu]");
const navLinks = document.querySelectorAll(".nav-links a, .footer-links a");
const heroFinderCta = document.querySelector("[data-hero-finder-cta]");
const filterFinder = document.querySelector("[data-filter-finder]");
const finderStartButton = document.querySelector("[data-finder-start]");
const finderModal = document.querySelector("[data-finder-modal]");
const finderModalCard = document.querySelector(".finder-modal");
const finderCloseButton = document.querySelector("[data-finder-close]");
const finderQuiz = document.querySelector("[data-finder-quiz]");
const finderSteps = document.querySelectorAll("[data-finder-step]");
const finderBackButton = document.querySelector("[data-finder-back]");
const finderNextButton = document.querySelector("[data-finder-next]");
const finderCompleteButton = document.querySelector("[data-finder-complete]");
const finderProgressLabel = document.querySelector("[data-finder-progress-label]");
const finderProgressBar = document.querySelector("[data-finder-progress-bar]");
const knownSizeField = document.querySelector("[data-known-size-field]");
const knownSizeOptions = document.querySelector("[data-known-size-options]");
const finderKnownSizeInput = document.querySelector("[data-finder-size-known]");
const finderAnalyzing = document.querySelector("[data-finder-analyzing]");
const finderAnalyzingSteps = document.querySelectorAll("[data-analyzing-step]");
const finderResult = document.querySelector("[data-finder-result]");
const finderResultHeading = document.querySelector("[data-finder-result-heading]");
const finderResultSubheading = document.querySelector("[data-finder-result-subheading]");
const finderResultSizeItems = document.querySelectorAll("[data-finder-result-size]");
const finderResultSchedule = document.querySelector("[data-finder-result-schedule]");
const finderNextChange = document.querySelector("[data-finder-next-change]");
const finderYearlyCost = document.querySelector("[data-finder-yearly-cost]");
const finderEmailNote = document.querySelector("[data-finder-email-note]");
const finderMerv = document.querySelector("[data-finder-merv]");
const finderMervCopy = document.querySelector("[data-finder-merv-copy]");
const finderMervBenefit = document.querySelector("[data-finder-merv-benefit]");
const finderMervCaution = document.querySelector("[data-finder-merv-caution]");
const finderWhyTitle = document.querySelector("[data-finder-why-title]");
const finderMonths = document.querySelector("[data-finder-months]");
const finderCopyButton = document.querySelector("[data-finder-copy]");
const finderCopyStatus = document.querySelector("[data-finder-copy-status]");
const finderConfidencePill = document.querySelector("[data-finder-confidence-pill]");
const finderAnswerPills = document.querySelector("[data-finder-answer-pills]");
const finderInsightTitle = document.querySelector("[data-finder-insight-title]");
const finderInsightCopy = document.querySelector("[data-finder-insight-copy]");
const finderSizeGuidance = document.querySelector("[data-finder-size-guidance]");
const finderSizeGuidanceCopy = document.querySelector("[data-finder-size-guidance-copy]");
const finderEmailSkipButton = document.querySelector("[data-finder-email-skip]");
const finderEmailSkipped = document.querySelector("[data-finder-email-skipped]");
const finderProductImage = document.querySelector("[data-finder-product-image]");
const finderProductPlaceholder = document.querySelector("[data-finder-product-placeholder]");
const finderProductSizeTitle = document.querySelector("[data-finder-product-size-title]");
const finderProductTypeTitle = document.querySelector("[data-finder-product-type-title]");
const finderProductBestFor = document.querySelector("[data-finder-product-best-for]");
const finderProductPrice = document.querySelector("[data-finder-product-price]");
const finderProductYearlyCost = document.querySelector("[data-finder-product-yearly-cost]");
const finderProductCta = document.querySelector("[data-finder-product-cta]");
const finderSkipToRetailers = document.querySelector("[data-finder-skip-to-retailers]");
const finderContinueToRetailers = document.querySelector("[data-finder-continue-to-retailers]");
const finderRetailerBlock = document.querySelector("[data-finder-retailer-block]");
const finderRetailerOptions = document.querySelector("[data-finder-retailer-options]");
const finderRetailerSummary = document.querySelector("[data-finder-retailer-summary]");
const sizeAutocompleteInputs = document.querySelectorAll("[data-size-autocomplete]");
const resultEmailForm = document.querySelector("[data-result-email-form]");
const resultEmailInput = document.querySelector("[data-result-email]");
const resultEmailSuccess = document.querySelector("[data-result-email-success]");
const earlyAccessForm = document.querySelector("[data-reservation-form]");
const earlyAccessSuccess = document.querySelector("[data-reservation-success]");
const finderStorageKey = "filterWizardFinderResults";
const emailStorageKey = "filterWizardEmailSignups";
const finderTotalSteps = 4;
const amazonAffiliateTag = "";

let finderCurrentStep = 1;
let finderEmailEnteredTracked = false;
let latestFinderReport = null;
let finderModalOpener = null;
let finderCompleted = false;
let finderAnalyzingTimer = null;
let finderAnalysisStepTimer = null;
let retailerViewedObserver = null;
let retailerViewedTracked = false;

const finderState = {
  knowsSize: "",
  location: "",
  conditions: [],
  knownSize: "",
  email: "",
  recommendedSchedule: "",
  normalizedSize: "",
  sizeSelectedFromSuggestion: false
};

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
  header?.classList.toggle("scrolled", window.scrollY > 8);
}

function closeNav() {
  document.body.classList.remove("nav-open");
  navMenu?.classList.remove("open");
  navToggle?.setAttribute("aria-expanded", "false");
  navToggle?.setAttribute("aria-label", "Open navigation menu");
}

function toggleNav() {
  const isOpen = navToggle?.getAttribute("aria-expanded") === "true";
  document.body.classList.toggle("nav-open", !isOpen);
  navMenu?.classList.toggle("open", !isOpen);
  navToggle?.setAttribute("aria-expanded", String(!isOpen));
  navToggle?.setAttribute("aria-label", isOpen ? "Open navigation menu" : "Close navigation menu");
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

function scrollToElement(element) {
  element?.scrollIntoView({
    behavior: "smooth",
    block: "start"
  });
}

function getFocusableElements(container) {
  return Array.from(
    container?.querySelectorAll(
      'a[href], button:not([disabled]):not([hidden]), input:not([disabled]):not([hidden]), select:not([disabled]):not([hidden]), textarea:not([disabled]):not([hidden]), [tabindex]:not([tabindex="-1"])'
    ) || []
  ).filter((element) => element.offsetParent !== null);
}

function closeFinderModal(reason = "closed") {
  if (!finderModal || finderModal.hidden) return;

  const wasCompleted = finderCompleted;
  window.clearTimeout(finderAnalyzingTimer);
  window.clearInterval(finderAnalysisStepTimer);
  finderAnalyzingTimer = null;
  finderAnalysisStepTimer = null;
  retailerViewedObserver?.disconnect();
  retailerViewedObserver = null;
  retailerViewedTracked = false;
  finderModal.hidden = true;
  finderModal.style.display = "none";
  document.body.classList.remove("modal-open");
  document.documentElement.classList.remove("modal-open");

  trackEvent("filter_finder_modal_closed", {
    current_step: finderCurrentStep,
    completed: wasCompleted,
    reason
  });

  if (!wasCompleted) {
    trackEvent("finder_abandoned", {
      current_step: finderCurrentStep,
      knows_size: finderState.knowsSize || "Not answered",
      completed: false
    });
  }

  finderModalOpener?.focus?.();
}

function openFinderModal(opener = finderStartButton) {
  if (!finderModal) return;

  finderModalOpener = opener;
  finderCompleted = false;
  finderModal.hidden = false;
  finderModal.style.display = "grid";
  document.body.classList.add("modal-open");
  document.documentElement.classList.add("modal-open");
  trackEvent("filter_finder_modal_opened");
  resetFinderForModal();
  startFilterFinder();

  window.setTimeout(() => {
    const firstInteractive = finderModal.querySelector("[data-finder-option]") || finderModal.querySelector("button, input");
    firstInteractive?.focus();
  }, 40);
}

function resetFinderForModal() {
  window.clearTimeout(finderAnalyzingTimer);
  window.clearInterval(finderAnalysisStepTimer);
  finderAnalyzingTimer = null;
  finderAnalysisStepTimer = null;
  finderState.knowsSize = "";
  finderState.location = "";
  finderState.conditions = [];
  finderState.knownSize = "";
  finderState.email = "";
  finderState.recommendedSchedule = "";
  finderState.normalizedSize = "";
  finderState.sizeSelectedFromSuggestion = false;
  finderEmailEnteredTracked = false;

  document.querySelectorAll("[data-finder-option]").forEach((option) => {
    option.classList.remove("selected");
    option.setAttribute("aria-pressed", "false");
  });
  if (knownSizeField) knownSizeField.hidden = true;
  if (finderKnownSizeInput) finderKnownSizeInput.value = "";
  if (resultEmailInput) resultEmailInput.value = "";
  if (resultEmailForm) resultEmailForm.hidden = false;
  if (resultEmailSuccess) resultEmailSuccess.hidden = true;
  if (finderEmailSkipped) finderEmailSkipped.hidden = true;
  if (finderEmailNote) finderEmailNote.hidden = true;
  if (finderCopyStatus) finderCopyStatus.hidden = true;
  if (finderAnalyzing) finderAnalyzing.hidden = true;
  finderAnalyzingSteps.forEach((step) => step.classList.remove("is-active"));
  if (finderCompleteButton) finderCompleteButton.disabled = false;
}

function saveToLocalStorage(key, value) {
  try {
    const current = JSON.parse(localStorage.getItem(key)) || [];
    current.push(value);
    localStorage.setItem(key, JSON.stringify(current));
  } catch (error) {
    console.warn("Filter Wizard could not save to localStorage.", error);
  }
}

function normalizeFilterSize(value) {
  const trimmed = String(value || "").trim();
  if (!trimmed) return "";

  const lowered = trimmed
    .replace(/[X]/g, "x")
    .replace(/\s*x\s*/g, "x")
    .replace(/\s+/g, " ");

  const spaceSeparatedNumbers = lowered.match(/^(\d+(?:\.\d+)?)\s+(\d+(?:\.\d+)?)\s+(\d+(?:\.\d+)?)$/);
  if (spaceSeparatedNumbers) {
    return `${spaceSeparatedNumbers[1]}x${spaceSeparatedNumbers[2]}x${spaceSeparatedNumbers[3]}`;
  }

  return lowered.replace(/\s+/g, "");
}

function parseFilterSize(value) {
  const normalized = normalizeFilterSize(value);
  const match = normalized.match(/^(\d{1,2}(?:\.\d+)?)x(\d{1,2}(?:\.\d+)?)x(\d{1,2}(?:\.\d+)?)$/);

  if (!match) return null;

  const width = Number(match[1]);
  const height = Number(match[2]);
  const depth = Number(match[3]);
  const realistic = width >= 6
    && width <= 40
    && height >= 6
    && height <= 40
    && depth >= 0.5
    && depth <= 12;

  if (!realistic) return null;

  return {
    normalized,
    width,
    height,
    depth
  };
}

function isValidFilterSize(value) {
  return Boolean(parseFilterSize(value));
}

function getFinderSize() {
  if (finderState.knowsSize !== "Yes, I know it") return "";
  finderState.knownSize = finderKnownSizeInput?.value.trim() || "";
  return parseFilterSize(finderState.knownSize)?.normalized || "";
}

function getFinderStepLabel(step) {
  const labels = {
    1: "Filter Size",
    2: "Location",
    3: "Home Conditions",
    4: "Review"
  };
  return labels[step] || "Finder";
}

function getFinderStepName(step) {
  const names = {
    1: "filter_size",
    2: "filter_location",
    3: "home_conditions",
    4: "review"
  };
  return names[step] || `step_${step}`;
}

function updateFinderProgress() {
  if (!finderProgressLabel || !finderProgressBar) return;
  finderProgressLabel.textContent = `Step ${finderCurrentStep} • ${getFinderStepLabel(finderCurrentStep)}`;
  finderProgressBar.style.width = `${(finderCurrentStep / finderTotalSteps) * 100}%`;
}

function updateFinderActionLabels() {
  if (!finderNextButton) return;
  finderNextButton.textContent = finderCurrentStep === 1 && finderState.knowsSize === "Yes, I know it"
    ? "Continue"
    : "Next";
}

function clearFinderError(stepEl) {
  const errorEl = stepEl?.querySelector("[data-finder-error]");
  if (!errorEl) return;
  errorEl.textContent = "";
  errorEl.hidden = true;
}

function setFinderError(stepEl, message) {
  const errorEl = stepEl?.querySelector("[data-finder-error]");
  if (!errorEl) return;
  errorEl.textContent = message;
  errorEl.hidden = false;
}

function showFinderStep(step) {
  finderCurrentStep = Math.min(finderTotalSteps, Math.max(1, step));

  finderSteps.forEach((stepEl) => {
    const isActive = Number(stepEl.dataset.finderStep) === finderCurrentStep;
    stepEl.hidden = !isActive;
    stepEl.classList.toggle("is-active", isActive);
    clearFinderError(stepEl);
  });

  if (finderBackButton) {
    finderBackButton.hidden = false;
    finderBackButton.disabled = finderCurrentStep === 1;
    finderBackButton.setAttribute("aria-disabled", String(finderCurrentStep === 1));
  }
  if (finderNextButton) finderNextButton.hidden = finderCurrentStep === finderTotalSteps;
  if (finderCompleteButton) finderCompleteButton.hidden = finderCurrentStep !== finderTotalSteps;
  updateFinderProgress();
  updateFinderActionLabels();
}

function startFilterFinder() {
  if (!finderQuiz) return;

  finderQuiz.hidden = false;
  if (finderAnalyzing) finderAnalyzing.hidden = true;
  if (finderResult) finderResult.hidden = true;
  finderResult?.classList.remove("report-visible");
  showFinderStep(1);
  trackEvent("filter_finder_started");
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

function setFinderOption(button) {
  const group = button.dataset.finderOption;
  const value = button.dataset.value;

  if (group === "conditions") {
    updateFinderConditions(button, value);
    return;
  }

  finderState[group] = value;
  document.querySelectorAll(`[data-finder-option="${group}"]`).forEach((option) => {
    const selected = option === button;
    option.classList.toggle("selected", selected);
    option.setAttribute("aria-pressed", String(selected));
  });

  if (group === "knowsSize" && knownSizeField) {
    knownSizeField.hidden = value !== "Yes, I know it";
    if (value === "Yes, I know it") {
      setTimeout(() => {
        finderKnownSizeInput?.focus({ preventScroll: true });
      }, 40);
    } else {
      if (finderKnownSizeInput) finderKnownSizeInput.value = "";
      finderState.knownSize = "";
      finderState.normalizedSize = "";
      finderState.sizeSelectedFromSuggestion = false;
      clearFinderError(document.querySelector('[data-finder-step="1"]'));
      hideSizeSuggestions(finderKnownSizeInput?.parentElement?.querySelector("[data-size-suggestions]"));
    }
    updateFinderActionLabels();
  }
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
      finderKnownSizeInput?.focus({ preventScroll: true });
      return false;
    }
    if (finderState.knowsSize === "Yes, I know it" && !isValidFilterSize(finderKnownSizeInput?.value)) {
      setFinderError(stepEl, "Enter a size in width x height x depth format, such as 20x25x1.");
      trackEvent("filter_finder_invalid_size_entered", {
        raw_length: finderKnownSizeInput?.value.length || 0,
        knows_size: finderState.knowsSize,
        current_step: step
      });
      finderKnownSizeInput?.focus({ preventScroll: true });
      return false;
    }
  }

  if (step === 2 && !finderState.location) {
    setFinderError(stepEl, "Choose where your filter is located.");
    return false;
  }

  return true;
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
      copy: "Best fit for allergy-sensitive homes and finer particle filtration.",
      benefit: "Designed to capture finer airborne particles than lower-rated filters.",
      caution: "Higher filtration can create more airflow resistance, so check your HVAC manufacturer's guidance before upgrading."
    };
  }
  if (conditions.some((condition) => ["Pets", "Heavy dust"].includes(condition))) {
    return {
      type: "MERV 11",
      copy: "Better fit for pets, dust, and higher everyday filtration needs.",
      benefit: "Provides stronger particle capture than a basic household filter while remaining practical for many residential systems.",
      caution: "Confirm that your HVAC equipment supports the filter rating recommended by its manufacturer."
    };
  }
  return {
    type: "MERV 8",
    copy: "Good fit for standard homes with normal dust levels.",
    benefit: "Captures common household dust, pollen, and larger airborne particles.",
    caution: "A practical default when pets, heavy dust, or allergy concerns are not major factors."
  };
}

function getFinderInsight(result) {
  const conditions = result.homeConditions || [];
  const sizeNeedsConfirmation = result.filterSize === "Check before ordering";
  let insight = {
    title: "You probably do not need to over-filter",
    copy: "A standard pleated filter should provide practical everyday filtration without unnecessary restriction."
  };

  if (conditions.includes("Allergies")) {
    insight = {
      title: "Stronger filtration makes sense here",
      copy: "Because allergies were selected, we recommend finer filtration than a basic household filter."
    };
  } else if (conditions.includes("Pets")) {
    insight = {
      title: "Pets can load filters faster",
      copy: "Pet hair and dander can shorten filter life, which is why your replacement timing is more frequent."
    };
  } else if (conditions.includes("Heavy dust")) {
    insight = {
      title: "Your filter may fill faster than average",
      copy: "Heavy dust increases particle load, so a shorter replacement interval is the safer recommendation."
    };
  } else if (conditions.length === 1 && conditions.includes("Kids at home")) {
    insight = {
      title: "A balanced filter is likely enough",
      copy: "Your home may benefit from dependable everyday filtration without jumping to the highest MERV rating."
    };
  }

  if (sizeNeedsConfirmation) {
    insight.copy = `${insight.copy} Confirm the printed size before ordering.`;
  }

  return insight;
}

function getNextSuggestedChange(schedule) {
  const daysToAdd = schedule === "Every 30-60 days"
    ? 45
    : schedule === "Every 60-90 days"
      ? 75
      : 90;
  const date = new Date();
  date.setDate(date.getDate() + daysToAdd);
  return date.toLocaleDateString("en-US", { month: "long", year: "numeric" });
}

function getSizeConfidence(result) {
  const hasValidSize = result.filterSize
    && result.filterSize !== "Check before ordering"
    && Boolean(parseFilterSize(result.filterSize));

  if (!hasValidSize) {
    return {
      label: "Confirm size before ordering",
      level: "needs-confirmation"
    };
  }

  if (result.sizeSelectedFromSuggestion) {
    return {
      label: "✓ High confidence",
      level: "high"
    };
  }

  return {
    label: "✓ Size format confirmed",
    level: "format-confirmed"
  };
}

function getEstimatedYearlyCost(schedule, merv) {
  if (merv === "MERV 13") {
    return schedule === "Every 30-60 days" ? "$96-$150/year" : "$64-$100/year";
  }
  if (merv === "MERV 11") {
    return schedule === "Every 30-60 days" ? "$72-$108/year" : "$48-$72/year";
  }
  return schedule === "Every 30-60 days" ? "$48-$84/year" : "$32-$56/year";
}

function getProductRecommendation(result) {
  const merv = result.recommendedFilterType || "MERV 8";
  const size = result.filterSize && result.filterSize !== "Check before ordering"
    ? result.filterSize
    : "Check before ordering";
  const productDetails = {
    "MERV 13": {
      image: "assets/images/filter-product-merv-13.webp",
      bestFor: "Allergies • Fine particles • Stronger filtration",
      priceRange: "Estimated $16-$25 each"
    },
    "MERV 11": {
      image: "assets/images/filter-product-merv-11.webp",
      bestFor: "Pets • Dust • Everyday filtration",
      priceRange: "Estimated $12-$18 each"
    },
    "MERV 8": {
      image: "assets/images/filter-product-merv-8.webp",
      bestFor: "Standard homes • Normal dust",
      priceRange: "Estimated $8-$14 each"
    }
  };
  const details = productDetails[merv] || productDetails["MERV 8"];

  return {
    title: size === "Check before ordering"
      ? `Confirm Size Before Ordering ${merv} Pleated Air Filter`
      : `${size} ${merv} Pleated Air Filter`,
    sizeTitle: size === "Check before ordering" ? "Check before ordering" : size,
    typeTitle: `${merv} Pleated Filter`,
    image: details.image,
    size,
    merv,
    bestFor: details.bestFor,
    priceRange: details.priceRange,
    yearlyCost: getEstimatedYearlyCost(result.recommendedSchedule, merv),
    schedule: result.recommendedSchedule
  };
}

function buildRetailerSearchQuery(result) {
  const size = result.productSize && result.productSize !== "Check before ordering"
    ? result.productSize
    : "";
  return [size, result.productMerv || result.recommendedFilterType, "air filter"]
    .filter(Boolean)
    .join(" ")
    .replace(/\s+/g, " ")
    .trim();
}

function getRetailerLinks(result) {
  const searchQuery = buildRetailerSearchQuery(result);
  const encodedSearchQuery = encodeURIComponent(searchQuery);
  const amazonUrl = amazonAffiliateTag
    ? `https://www.amazon.com/s?k=${encodedSearchQuery}&tag=${encodeURIComponent(amazonAffiliateTag)}`
    : `https://www.amazon.com/s?k=${encodedSearchQuery}`;

  return [
    {
      name: "Amazon",
      subtext: "Fast shipping and multi-pack options",
      // TODO: Add real Amazon Associates tag before monetized launch.
      url: amazonUrl
    },
    {
      name: "Home Depot",
      subtext: "Good for local pickup and common sizes",
      // TODO: Replace with a final affiliate/deep link if available.
      url: `https://www.homedepot.com/s/${encodedSearchQuery}`
    },
    {
      name: "Lowe's",
      subtext: "Useful for pickup or delivery",
      // TODO: Replace with a final affiliate/deep link if available.
      url: `https://www.lowes.com/search?searchTerm=${encodedSearchQuery}`
    },
    {
      name: "Filterbuy",
      subtext: "Bulk packs and specialty sizes",
      // TODO: Replace with a final affiliate/deep link if available.
      url: `https://filterbuy.com/air-filters/${encodedSearchQuery}`
    }
  ];
}

function setupRetailerViewedTracking(result) {
  if (!finderRetailerBlock || typeof IntersectionObserver !== "function") return;

  retailerViewedTracked = false;
  retailerViewedObserver?.disconnect();
  retailerViewedObserver = new IntersectionObserver((entries) => {
    const isVisible = entries.some((entry) => entry.isIntersecting);
    if (!isVisible || retailerViewedTracked) return;

    retailerViewedTracked = true;
    trackEvent("filter_finder_buying_options_viewed", {
      product_size: result.productSize,
      product_merv: result.productMerv,
      recommended_schedule: result.recommendedSchedule,
      size_confidence_level: result.sizeConfidenceLevel
    });
    retailerViewedObserver?.disconnect();
  }, {
    root: finderModalCard?.querySelector(".finder-modal-scroll") || null,
    threshold: 0.35
  });

  retailerViewedObserver.observe(finderRetailerBlock);
}

function getReminderMonths(schedule) {
  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const count = schedule === "Every 30-60 days" ? 6 : 4;
  const interval = schedule === "Every 30-60 days" ? 2 : 3;
  const startMonth = new Date().getMonth();

  return Array.from({ length: count }, (_, index) => monthNames[(startMonth + index * interval) % 12]);
}

function renderFinderReport(result) {
  const hasValidSize = Boolean(parseFilterSize(result.filterSize));
  const confidence = getSizeConfidence(result);

  if (finderResultHeading) {
    finderResultHeading.textContent = hasValidSize
      ? "You're all set"
      : "Your filter type is ready";
  }
  if (finderResultSubheading) {
    finderResultSubheading.textContent = hasValidSize
      ? "We found your best match."
      : "Confirm the printed size before ordering.";
  }
  if (finderConfidencePill) {
    finderConfidencePill.textContent = confidence.label;
    finderConfidencePill.classList.remove("is-high-confidence", "is-format-confirmed", "needs-confirmation");
    finderConfidencePill.classList.add(
      confidence.level === "high"
        ? "is-high-confidence"
        : confidence.level === "format-confirmed"
          ? "is-format-confirmed"
          : "needs-confirmation"
    );
  }
  finderResultSizeItems.forEach((item) => {
    item.textContent = result.filterSize;
  });
  if (finderResultSchedule) finderResultSchedule.textContent = result.recommendedSchedule;
  if (finderNextChange) finderNextChange.textContent = result.nextSuggestedChange;
  if (finderYearlyCost) finderYearlyCost.textContent = result.productYearlyCost;
  if (finderMerv) finderMerv.textContent = result.recommendedFilterType;
  if (finderMervCopy) finderMervCopy.textContent = result.recommendedFilterCopy;
  if (finderMervBenefit) finderMervBenefit.textContent = result.recommendedFilterBenefit;
  if (finderMervCaution) finderMervCaution.textContent = result.recommendedFilterCaution;
  if (finderWhyTitle) finderWhyTitle.textContent = `Why we chose ${result.recommendedFilterType}`;
  if (finderInsightTitle) finderInsightTitle.textContent = result.insightTitle;
  if (finderInsightCopy) finderInsightCopy.textContent = result.insightCopy;
  if (finderSizeGuidance) finderSizeGuidance.hidden = hasValidSize;
  if (finderSizeGuidanceCopy) finderSizeGuidanceCopy.textContent = result.sizeGuidance || "";
  if (finderAnswerPills) {
    finderAnswerPills.innerHTML = "";
    const answers = [
      result.knowsSize,
      result.location,
      ...(result.homeConditions.length ? result.homeConditions : ["Standard home conditions"])
    ].filter(Boolean).slice(0, 3);
    answers.forEach((answer) => {
      const pill = document.createElement("span");
      pill.textContent = `✓ ${answer}`;
      finderAnswerPills.appendChild(pill);
    });
  }
  if (finderMonths) {
    finderMonths.innerHTML = "";
    result.reminderMonths.forEach((month) => {
      const item = document.createElement("span");
      item.textContent = month;
      finderMonths.appendChild(item);
    });
  }
  if (resultEmailInput && result.email) {
    resultEmailInput.value = result.email;
  }
  if (finderProductSizeTitle) finderProductSizeTitle.textContent = result.productSizeTitle;
  if (finderProductTypeTitle) finderProductTypeTitle.textContent = result.productTypeTitle;
  if (finderProductBestFor) finderProductBestFor.textContent = result.productBestFor;
  if (finderProductPrice) finderProductPrice.textContent = result.productPrice;
  if (finderProductYearlyCost) finderProductYearlyCost.textContent = `Estimated yearly cost: ${result.productYearlyCost}`;
  if (finderRetailerSummary) {
    const sizeLabel = result.productSize && result.productSize !== "Check before ordering"
      ? result.productSize
      : "Confirm size";
    finderRetailerSummary.textContent = `${sizeLabel} • ${result.productMerv}`;
  }
  if (finderProductImage) {
    const imageUrl = result.productImage;

    finderProductImage.alt = result.productTitle || "Recommended air filter";
    finderProductImage.hidden = true;
    if (finderProductPlaceholder) finderProductPlaceholder.hidden = false;

    const testImage = new Image();

    testImage.onload = () => {
      finderProductImage.src = imageUrl;
      finderProductImage.hidden = false;
      if (finderProductPlaceholder) finderProductPlaceholder.hidden = true;
    };

    testImage.onerror = () => {
      finderProductImage.hidden = true;
      if (finderProductPlaceholder) finderProductPlaceholder.hidden = false;
    };

    testImage.src = imageUrl;
  }
  if (finderRetailerOptions) {
    finderRetailerOptions.innerHTML = "";
    const searchQuery = buildRetailerSearchQuery(result);
    getRetailerLinks(result).forEach((retailer) => {
      const card = document.createElement("article");
      card.className = "finder-retailer-card";

      const title = document.createElement("strong");
      title.textContent = retailer.name;

      const copy = document.createElement("p");
      copy.textContent = retailer.subtext;

      const link = document.createElement("a");
      link.className = "btn btn-secondary";
      link.href = retailer.url;
      link.target = "_blank";
      link.rel = "noopener sponsored nofollow";
      link.textContent = "View Options";
      link.dataset.retailerName = retailer.name;
      link.dataset.retailerUrl = retailer.url;
      link.addEventListener("click", () => {
        trackEvent("filter_finder_retailer_clicked", {
          retailer: retailer.name,
          product_size: result.productSize,
          product_merv: result.productMerv,
          search_query: searchQuery,
          recommended_schedule: result.recommendedSchedule
        });
      });

      card.append(title, copy, link);
      finderRetailerOptions.appendChild(card);
    });
  }
  trackEvent("filter_finder_product_recommendation_viewed", {
    product_merv: result.productMerv,
    product_size: result.productSize,
    product_price: result.productPrice,
    recommended_schedule: result.recommendedSchedule,
    normalized_filter_size: result.normalizedFilterSize,
    size_confidence_level: result.sizeConfidenceLevel,
    size_selected_from_suggestion: result.sizeSelectedFromSuggestion
  });
  trackEvent("filter_finder_profile_viewed", {
    filter_size: result.filterSize,
    recommended_filter_type: result.recommendedFilterType,
    recommended_schedule: result.recommendedSchedule,
    next_suggested_change: result.nextSuggestedChange,
    estimated_yearly_cost: result.productYearlyCost,
    confidence_status: confidence.label,
    size_confidence_level: confidence.level
  });
  setupRetailerViewedTracking(result);
}

function getFinderCopyText(result) {
  return [
    "Filter Wizard Recommendation",
    `Recommended filter: ${result.productTitle}`,
    `Filter size: ${result.filterSize}`,
    `Size confidence: ${result.sizeConfidenceLabel}`,
    result.sizeGuidance ? `Size confirmation guidance: ${result.sizeGuidance}` : "",
    `MERV: ${result.recommendedFilterType}`,
    `Schedule: ${result.recommendedSchedule}`,
    `Estimated price range: ${result.productPrice}`,
    `Estimated yearly cost: ${result.productYearlyCost}`,
    `Next suggested change: ${result.nextSuggestedChange}`,
    `Best for: ${result.productBestFor}`,
    `Location: ${result.location}`,
    `Filter type benefit: ${result.recommendedFilterBenefit}`,
    `Filter type note: ${result.recommendedFilterCaution}`,
    `Insight: ${result.insightTitle} - ${result.insightCopy}`,
    `Reminder months: ${result.reminderMonths.join(", ")}`,
    `Buying search: ${buildRetailerSearchQuery(result)}`
  ].filter(Boolean).join("\n");
}

function setFinderCopyStatus(message) {
  if (!finderCopyStatus) return;
  finderCopyStatus.textContent = message;
  finderCopyStatus.hidden = false;
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

function addResultFields(formData, result) {
  if (!result) return;
  formData.set("knownSizeStatus", result.knowsSize);
  formData.set("enteredFilterSize", result.filterSize);
  formData.set("sizeConfidenceLevel", result.sizeConfidenceLevel || "");
  formData.set("sizeConfidenceLabel", result.sizeConfidenceLabel || "");
  formData.set("sizeSelectedFromSuggestion", String(Boolean(result.sizeSelectedFromSuggestion)));
  formData.set("sizeGuidance", result.sizeGuidance || "");
  formData.set("filterLocation", result.location);
  formData.set("homeConditions", result.homeConditions.join(", ") || "Not specified");
  formData.set("recommendedSchedule", result.recommendedSchedule);
  formData.set("recommendedFilterType", result.recommendedFilterType);
  formData.set("recommendedFilterBenefit", result.recommendedFilterBenefit || "");
  formData.set("recommendedFilterCaution", result.recommendedFilterCaution || "");
  formData.set("estimatedReminderMonths", result.reminderMonths.join(", "));
  formData.set("nextSuggestedChange", result.nextSuggestedChange || "");
  formData.set("filterInsightTitle", result.insightTitle || "");
  formData.set("filterInsightCopy", result.insightCopy || "");
  formData.set("recommendedFilterProduct", result.productTitle || "");
  formData.set("recommendedFilterBestFor", result.productBestFor || "");
  formData.set("estimatedFilterPrice", result.productPrice || "");
  formData.set("estimatedYearlyCost", result.productYearlyCost || "");
  formData.set("buyingSearchQuery", buildRetailerSearchQuery(result));
  formData.set("buyingSearchLinks", getRetailerLinks(result).map((retailer) => `${retailer.name}: ${retailer.url}`).join("\n"));
  formData.set("productImage", result.productImage || "");
}

async function submitFinderEmail(result) {
  if (!result.email) return true;

  const formData = new FormData();
  formData.set("_subject", "New Filter Wizard filter finder result");
  formData.set("source", "Filter Finder");
  formData.set("email", result.email);
  formData.set("submittedAt", result.submittedAt);
  addResultFields(formData, result);

  try {
    await postToFormspree(resultEmailForm || earlyAccessForm, formData);
    trackEvent("filter_finder_email_submitted", {
      recommended_schedule: result.recommendedSchedule,
      recommended_filter_type: result.recommendedFilterType,
      recommended_filter_benefit: result.recommendedFilterBenefit,
      next_suggested_change: result.nextSuggestedChange,
      size_confidence_level: result.sizeConfidenceLevel,
      size_selected_from_suggestion: result.sizeSelectedFromSuggestion,
      location: result.location
    });
    return true;
  } catch (error) {
    console.error("Filter Wizard finder email submission error:", error);
    return false;
  }
}

async function completeFilterFinder() {
  if (finderAnalyzingTimer) return;
  if (!validateFinderStep(finderCurrentStep)) return;

  trackFinderStepCompleted(finderCurrentStep);

  const parsedSize = finderState.knowsSize === "Yes, I know it"
    ? parseFilterSize(finderKnownSizeInput?.value)
    : null;
  const foundSize = parsedSize?.normalized || "";
  const filterType = getRecommendedFilterType();
  finderState.email = "";
  finderState.recommendedSchedule = getRecommendedSchedule();
  finderState.normalizedSize = foundSize;

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
    recommendedFilterBenefit: filterType.benefit,
    recommendedFilterCaution: filterType.caution,
    reminderMonths: getReminderMonths(finderState.recommendedSchedule),
    normalizedFilterSize: foundSize || "",
    sizeSelectedFromSuggestion: finderState.sizeSelectedFromSuggestion,
    sizeGuidance: foundSize ? "" : getLocationGuidance(finderState.location || "I'm not sure"),
    email: finderState.email || "",
    submittedAt: new Date().toISOString()
  };
  const confidence = getSizeConfidence(result);
  const insight = getFinderInsight(result);
  const nextSuggestedChange = getNextSuggestedChange(result.recommendedSchedule);
  const product = getProductRecommendation(result);
  Object.assign(result, {
    sizeConfidenceLevel: confidence.level,
    sizeConfidenceLabel: confidence.label,
    insightTitle: insight.title,
    insightCopy: insight.copy,
    nextSuggestedChange,
    productTitle: product.title,
    productSizeTitle: product.sizeTitle,
    productTypeTitle: product.typeTitle,
    productImage: product.image,
    productSize: product.size,
    productMerv: product.merv,
    productBestFor: product.bestFor,
    productPrice: product.priceRange,
    productYearlyCost: product.yearlyCost,
    productSchedule: product.schedule
  });

  latestFinderReport = result;
  if (finderQuiz) finderQuiz.hidden = true;
  if (finderResult) finderResult.hidden = true;
  finderResult?.classList.remove("report-visible");
  if (finderAnalyzing) finderAnalyzing.hidden = false;
  if (finderCompleteButton) finderCompleteButton.disabled = true;

  let activeAnalysisStep = 0;
  finderAnalyzingSteps.forEach((step, index) => {
    step.classList.toggle("is-active", index === activeAnalysisStep);
  });
  window.clearInterval(finderAnalysisStepTimer);
  finderAnalysisStepTimer = window.setInterval(() => {
    activeAnalysisStep = (activeAnalysisStep + 1) % Math.max(finderAnalyzingSteps.length, 1);
    finderAnalyzingSteps.forEach((step, index) => {
      step.classList.toggle("is-active", index === activeAnalysisStep);
    });
  }, 430);

  trackEvent("filter_finder_analysis_started", {
    knows_size: result.knowsSize,
    location: result.location,
    home_conditions: result.homeConditions.join(", ") || "Not specified",
    normalized_filter_size: result.normalizedFilterSize,
    size_selected_from_suggestion: result.sizeSelectedFromSuggestion
  });

  finderAnalyzingTimer = window.setTimeout(() => {
    window.clearInterval(finderAnalysisStepTimer);
    finderAnalysisStepTimer = null;
    if (finderAnalyzing) finderAnalyzing.hidden = true;
    if (finderCompleteButton) finderCompleteButton.disabled = false;

    renderFinderReport(result);
    saveToLocalStorage(finderStorageKey, result);
    finderCompleted = true;

    trackEvent("filter_finder_analysis_completed", {
      recommended_filter_type: result.recommendedFilterType,
      recommended_schedule: result.recommendedSchedule,
      normalized_filter_size: result.normalizedFilterSize,
      size_confidence_level: result.sizeConfidenceLevel
    });
    trackEvent("filter_finder_completed", {
      knows_size: result.knowsSize,
      normalized_filter_size: result.normalizedFilterSize,
      location: result.location,
      has_email: Boolean(result.email),
      recommended_schedule: result.recommendedSchedule,
      recommended_filter_type: result.recommendedFilterType,
      size_confidence_level: result.sizeConfidenceLevel,
      size_selected_from_suggestion: result.sizeSelectedFromSuggestion,
      has_valid_size: Boolean(parsedSize)
    });
    trackEvent("filter_finder_result_viewed", {
      knows_size: result.knowsSize,
      normalized_filter_size: result.normalizedFilterSize,
      location: result.location,
      recommended_schedule: result.recommendedSchedule,
      recommended_filter_type: result.recommendedFilterType,
      has_email: false,
      completed: true,
      size_confidence_level: result.sizeConfidenceLevel,
      size_selected_from_suggestion: result.sizeSelectedFromSuggestion,
      has_valid_size: Boolean(parsedSize)
    });
    trackEvent("filter_finder_email_prompt_viewed", {
      recommended_schedule: result.recommendedSchedule,
      recommended_filter_type: result.recommendedFilterType
    });
  
    if (finderResult) {
      finderResult.hidden = false;
      window.requestAnimationFrame(() => finderResult.classList.add("report-visible"));
    }
    finderModalCard?.querySelector(".finder-modal-scroll")?.scrollTo({ top: 0, behavior: "smooth" });
  }, 1500);
}

function setFormMessage(form, message = "") {
  const errorMessage = form?.querySelector("[data-form-error]");
  if (!errorMessage) return;
  errorMessage.textContent = message || errorMessage.textContent;
  errorMessage.hidden = !message;
}

async function handleEmailFormSubmit(event, eventName, successElement) {
  event.preventDefault();
  const form = event.currentTarget;

  if (!form.checkValidity()) {
    form.reportValidity();
    return;
  }

  const submitButton = form.querySelector(".form-submit");
  const originalText = submitButton?.textContent || "Submit";
  const formData = new FormData(form);
  const email = String(formData.get("email") || "").trim();
  const submittedAt = new Date().toISOString();

  formData.set("submittedAt", submittedAt);
  addResultFields(formData, latestFinderReport);

  setFormMessage(form);
  if (submitButton) {
    submitButton.disabled = true;
    submitButton.textContent = "Sending...";
  }

  try {
    await postToFormspree(form, formData);
    const signup = {
      email,
      source: String(formData.get("source") || "Email Form"),
      submittedAt
    };
    saveToLocalStorage(emailStorageKey, signup);
    trackEvent(eventName, {
      form_location: String(formData.get("source") || "Email Form"),
      has_finder_result: Boolean(latestFinderReport),
      normalized_filter_size: latestFinderReport?.normalizedFilterSize || "",
      recommended_schedule: latestFinderReport?.recommendedSchedule || "",
      recommended_filter_type: latestFinderReport?.recommendedFilterType || "",
      recommended_filter_benefit: latestFinderReport?.recommendedFilterBenefit || "",
      next_suggested_change: latestFinderReport?.nextSuggestedChange || "",
      size_confidence_level: latestFinderReport?.sizeConfidenceLevel || "",
      size_selected_from_suggestion: Boolean(latestFinderReport?.sizeSelectedFromSuggestion),
      recommended_filter_product: latestFinderReport?.productTitle || "",
      estimated_filter_price: latestFinderReport?.productPrice || "",
      has_email: Boolean(email)
    });
    trackEvent("generate_lead", {
      form_location: String(formData.get("source") || "Email Form"),
      normalized_filter_size: latestFinderReport?.normalizedFilterSize || "",
      recommended_schedule: latestFinderReport?.recommendedSchedule || "",
      recommended_filter_type: latestFinderReport?.recommendedFilterType || "",
      recommended_filter_benefit: latestFinderReport?.recommendedFilterBenefit || "",
      next_suggested_change: latestFinderReport?.nextSuggestedChange || "",
      size_confidence_level: latestFinderReport?.sizeConfidenceLevel || "",
      size_selected_from_suggestion: Boolean(latestFinderReport?.sizeSelectedFromSuggestion),
      recommended_filter_product: latestFinderReport?.productTitle || "",
      estimated_filter_price: latestFinderReport?.productPrice || ""
    });
    form.reset();
    form.hidden = true;
    if (successElement) successElement.hidden = false;
  } catch (error) {
    console.error("Filter Wizard email submission error:", error);
    const fallbackMessage = form === resultEmailForm
      ? "We could not email your report, but your recommendation is shown above."
      : "Something went wrong. Please try again in a moment.";
    setFormMessage(form, fallbackMessage);
  } finally {
    if (submitButton) {
      submitButton.disabled = false;
      submitButton.textContent = originalText;
    }
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
    button.setAttribute("aria-label", `Use filter size ${size}`);
    button.addEventListener("click", () => {
      input.value = size;
      finderState.sizeSelectedFromSuggestion = true;
      hideSizeSuggestions(container);
      input.focus();
      clearFinderError(input.closest("[data-finder-step]"));
    });
    container.appendChild(button);
  });
  container.hidden = false;
}

function getSuggestionButtons(container) {
  return Array.from(container?.querySelectorAll("button") || []);
}

function moveSuggestionFocus(container, direction) {
  const buttons = getSuggestionButtons(container);
  if (!buttons.length) return;

  const currentIndex = buttons.indexOf(document.activeElement);
  const nextIndex = currentIndex === -1
    ? 0
    : (currentIndex + direction + buttons.length) % buttons.length;
  buttons[nextIndex].focus();
}

function setupSizeAutocomplete() {
  sizeAutocompleteInputs.forEach((input) => {
    const container = input.parentElement?.querySelector("[data-size-suggestions]");

    input.addEventListener("input", () => renderSizeSuggestions(input));
    input.addEventListener("focus", () => renderSizeSuggestions(input));
    input.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        hideSizeSuggestions(container);
        return;
      }
      if (event.key === "ArrowDown") {
        renderSizeSuggestions(input);
        if (!container?.hidden) {
          event.preventDefault();
          moveSuggestionFocus(container, 1);
        }
      }
    });
    input.addEventListener("blur", () => {
      window.setTimeout(() => hideSizeSuggestions(container), 140);
    });

    container?.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        event.preventDefault();
        hideSizeSuggestions(container);
        input.focus();
        return;
      }
      if (event.key === "ArrowDown" || event.key === "ArrowUp") {
        event.preventDefault();
        moveSuggestionFocus(container, event.key === "ArrowDown" ? 1 : -1);
      }
    });
  });
}

setHeaderState();
setupRevealAnimations();
setupSizeAutocomplete();
window.addEventListener("scroll", setHeaderState, { passive: true });

if (navToggle && navMenu) {
  navToggle.addEventListener("click", toggleNav);
  navLinks.forEach((link) => link.addEventListener("click", closeNav));
}

heroFinderCta?.addEventListener("click", (event) => {
  event.preventDefault();
  trackEvent("hero_filter_finder_clicked");
  openFinderModal(event.currentTarget);
});

finderStartButton?.addEventListener("click", (event) => {
  openFinderModal(event.currentTarget);
});

finderCloseButton?.addEventListener("click", () => closeFinderModal("close_button"));

finderModal?.addEventListener("click", (event) => {
  if (event.target === finderModal) {
    closeFinderModal("overlay");
  }
});

document.addEventListener("keydown", (event) => {
  if (!finderModal || finderModal.hidden) return;

  if (event.key === "Escape") {
    event.preventDefault();
    closeFinderModal("escape");
    return;
  }

  if (event.key !== "Tab") return;
  const focusable = getFocusableElements(finderModal);
  if (!focusable.length) return;

  const first = focusable[0];
  const last = focusable[focusable.length - 1];

  if (event.shiftKey && document.activeElement === first) {
    event.preventDefault();
    last.focus();
  } else if (!event.shiftKey && document.activeElement === last) {
    event.preventDefault();
    first.focus();
  }
});

document.querySelectorAll("[data-finder-option]").forEach((button) => {
  button.setAttribute("aria-pressed", "false");
  button.addEventListener("click", () => setFinderOption(button));
});

finderKnownSizeInput?.addEventListener("input", () => {
  finderState.sizeSelectedFromSuggestion = false;
  clearFinderError(document.querySelector('[data-finder-step="1"]'));
});

resultEmailInput?.addEventListener("input", () => {
  if (!finderEmailEnteredTracked && resultEmailInput.value.trim()) {
    finderEmailEnteredTracked = true;
    trackEvent("filter_finder_email_entered");
  }
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

finderCopyButton?.addEventListener("click", async () => {
  if (!latestFinderReport) return;

  if (!navigator.clipboard?.writeText) {
    setFinderCopyStatus("Copy not available on this browser.");
    return;
  }

  try {
    await navigator.clipboard.writeText(getFinderCopyText(latestFinderReport));
    setFinderCopyStatus("Recommendation copied.");
    trackEvent("copy_recommendation_clicked", {
      recommended_schedule: latestFinderReport.recommendedSchedule,
      recommended_filter_type: latestFinderReport.recommendedFilterType
    });
  } catch (error) {
    console.warn("Filter Wizard recommendation could not be copied.", error);
    setFinderCopyStatus("Copy not available on this browser.");
  }
});

finderEmailSkipButton?.addEventListener("click", () => {
  if (resultEmailForm) resultEmailForm.hidden = true;
  if (finderEmailSkipped) finderEmailSkipped.hidden = false;
  trackEvent("filter_finder_email_skipped", {
    recommended_schedule: latestFinderReport?.recommendedSchedule,
    recommended_filter_type: latestFinderReport?.recommendedFilterType,
    has_email: false
  });
});

finderProductCta?.addEventListener("click", () => {
  trackEvent("filter_finder_view_buying_options_clicked", {
    product_merv: latestFinderReport?.productMerv || "",
    product_size: latestFinderReport?.productSize || "",
    product_price: latestFinderReport?.productPrice || "",
    recommended_schedule: latestFinderReport?.recommendedSchedule || "",
    normalized_filter_size: latestFinderReport?.normalizedFilterSize || "",
    size_confidence_level: latestFinderReport?.sizeConfidenceLevel || ""
  });
  finderRetailerBlock?.scrollIntoView({ behavior: "smooth", block: "center" });
});

finderSkipToRetailers?.addEventListener("click", () => {
  trackEvent("filter_finder_save_result_link_clicked", {
    product_merv: latestFinderReport?.productMerv || "",
    product_size: latestFinderReport?.productSize || "",
    recommended_schedule: latestFinderReport?.recommendedSchedule || "",
    size_confidence_level: latestFinderReport?.sizeConfidenceLevel || ""
  });
  resultEmailForm?.scrollIntoView({ behavior: "smooth", block: "center" });
  window.setTimeout(() => resultEmailInput?.focus({ preventScroll: true }), 260);
});

finderContinueToRetailers?.addEventListener("click", () => {
  trackEvent("filter_finder_continue_to_retailers_clicked", {
    product_merv: latestFinderReport?.productMerv || "",
    product_size: latestFinderReport?.productSize || "",
    recommended_schedule: latestFinderReport?.recommendedSchedule || ""
  });
  finderRetailerBlock?.scrollIntoView({ behavior: "smooth", block: "center" });
});

resultEmailForm?.addEventListener("submit", (event) => {
  handleEmailFormSubmit(event, "filter_finder_email_submitted", resultEmailSuccess);
});

earlyAccessForm?.addEventListener("submit", (event) => {
  handleEmailFormSubmit(event, "early_access_submitted", earlyAccessSuccess);
});

