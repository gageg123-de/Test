const header = document.querySelector("[data-header]");
const navToggle = document.querySelector("[data-nav-toggle]");
const navMenu = document.querySelector("[data-nav-menu]");
const navLinks = document.querySelectorAll(".nav-links a, .footer-links a");
const startToolLinks = document.querySelectorAll("[data-start-tool]");
const toolForm = document.querySelector("[data-tool-form]");
const finalForm = document.querySelector("[data-final-form]");
const resultCard = document.querySelector("[data-result-card]");
const resultCta = document.querySelector("[data-result-cta]");
const finalConfirmation = document.querySelector("[data-final-confirmation]");
const storageKey = "filterWizardEarlyAccess";
let hasTrackedToolStart = false;
let latestToolEmail = "";

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

function getStoredSubmissions() {
  try {
    return JSON.parse(localStorage.getItem(storageKey)) || [];
  } catch (error) {
    console.warn("Filter Wizard submissions could not be read from localStorage.", error);
    return [];
  }
}

function saveSubmission(submission) {
  const submissions = getStoredSubmissions();
  submissions.push(submission);
  localStorage.setItem(storageKey, JSON.stringify(submissions));
}

function markToolStarted(source = "interaction") {
  if (hasTrackedToolStart) return;
  hasTrackedToolStart = true;
  trackEvent("filter_tool_started", { source });
}

function updateSizeFields() {
  if (!toolForm) return;

  const selected = toolForm.querySelector("input[name='sizeKnowledge']:checked")?.value;
  const knownSize = toolForm.querySelector("[data-known-size]");
  const guidance = toolForm.querySelector("[data-size-guidance]");

  if (knownSize) {
    knownSize.hidden = selected !== "known";
  }

  if (guidance) {
    guidance.hidden = !(selected === "unsure" || selected === "help");
  }
}

function updateNoneOption(changedInput) {
  if (!toolForm || changedInput?.name !== "homeConditions") return;

  const noneOption = toolForm.querySelector("[data-none-option]");
  const conditionInputs = [...toolForm.querySelectorAll("input[name='homeConditions']")];

  if (changedInput === noneOption && noneOption.checked) {
    conditionInputs.forEach((input) => {
      if (input !== noneOption) input.checked = false;
    });
    return;
  }

  if (changedInput !== noneOption && changedInput.checked && noneOption) {
    noneOption.checked = false;
  }
}

function updateProgress() {
  if (!toolForm) return;

  const progressItems = [...toolForm.querySelectorAll(".tool-progress span")];
  const formData = new FormData(toolForm);
  const completed = [
    Boolean(formData.get("sizeKnowledge")),
    formData.getAll("homeConditions").length > 0,
    Boolean(formData.get("replacementTiming")),
    Boolean(formData.get("email"))
  ];

  progressItems.forEach((item, index) => {
    item.classList.toggle("active", completed[index] || index === 0);
  });
}

function getRecommendation(formData) {
  const knownSize = String(formData.get("knownFilterSize") || "").trim();
  const visibleSize = String(formData.get("visibleFilterSize") || "").trim();
  const filterSize = knownSize || visibleSize || "Check the printed size on your current filter before ordering.";
  const conditions = formData.getAll("homeConditions");
  const timing = String(formData.get("replacementTiming") || "");
  const hasPetsAllergiesDust = conditions.some((condition) =>
    ["Pets", "Allergies", "Dust buildup"].includes(condition)
  );
  const hasKidsOnly = conditions.includes("Kids at home") && !hasPetsAllergiesDust;

  let schedule = "Every 90 days";
  if (hasPetsAllergiesDust) {
    schedule = "Every 30-60 days";
  } else if (hasKidsOnly) {
    schedule = "Every 60-90 days";
  }

  const warning = timing === "Once a year or less" || timing === "I forget";

  return {
    filterSize,
    schedule,
    warning,
    conditions: conditions.length ? conditions.join(", ") : "Not specified",
    timing: timing || "Not specified"
  };
}

function renderResult(recommendation) {
  if (!resultCard) return;

  resultCard.querySelector("[data-result-size]").textContent = recommendation.filterSize;
  resultCard.querySelector("[data-result-schedule]").textContent = recommendation.schedule;
  resultCard.querySelector("[data-result-warning]").hidden = !recommendation.warning;
  resultCard.hidden = false;
  resultCard.classList.add("visible");

  trackEvent("filter_result_viewed", {
    recommended_schedule: recommendation.schedule,
    has_warning: recommendation.warning
  });
}

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

function syncFinalOffer(email) {
  if (!email || !finalForm) return;

  latestToolEmail = email;
  const finalEmail = finalForm.querySelector("input[name='email']");
  if (finalEmail) finalEmail.value = email;

  finalForm.hidden = true;
  if (finalConfirmation) finalConfirmation.hidden = false;
}

async function handleToolSubmit(event) {
  event.preventDefault();
  markToolStarted("submit");

  if (!toolForm.checkValidity()) {
    toolForm.reportValidity();
    return;
  }

  const formData = new FormData(toolForm);
  const conditions = formData.getAll("homeConditions");

  if (!conditions.length) {
    setFormMessage(toolForm, "error", "Choose at least one home condition, or select None of these.");
    return;
  }

  const submitButton = toolForm.querySelector(".form-submit");
  const submittedAt = new Date().toISOString();
  const recommendation = getRecommendation(formData);
  const email = String(formData.get("email") || "").trim();
  const source = "Filter Wizard Finder";

  formData.set("submittedAt", submittedAt);
  formData.set("filterRecommendation", JSON.stringify(recommendation));

  const submission = {
    email,
    source,
    submittedAt,
    filterSize: recommendation.filterSize,
    recommendedSchedule: recommendation.schedule,
    homeConditions: recommendation.conditions,
    replacementTiming: recommendation.timing,
    warning: recommendation.warning
  };

  setFormMessage(toolForm, "clear");
  submitButton.disabled = true;
  submitButton.textContent = "Sending...";

  try {
    await postToFormspree(toolForm, formData);
    saveSubmission(submission);
    console.log("Filter Wizard finder submission:", submission);
    trackEvent("generate_lead", {
      form_location: "filter_finder",
      recommended_schedule: recommendation.schedule
    });
    renderResult(recommendation);
    syncFinalOffer(email);
    setFormMessage(toolForm, "success");
    resultCard?.scrollIntoView({
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth",
      block: "nearest"
    });
  } catch (error) {
    console.error("Filter Wizard finder submission error:", error);
    setFormMessage(toolForm, "error", "Something went wrong while sending your result. Please try again in a moment.");
  } finally {
    submitButton.disabled = false;
    submitButton.textContent = "Email My Results";
  }
}

async function handleFinalSubmit(event) {
  event.preventDefault();

  if (!finalForm.checkValidity()) {
    finalForm.reportValidity();
    return;
  }

  const formData = new FormData(finalForm);
  const submitButton = finalForm.querySelector(".form-submit");
  const submittedAt = new Date().toISOString();
  const email = String(formData.get("email") || "").trim();
  const source = "Founding Member Offer";

  formData.set("submittedAt", submittedAt);
  setFormMessage(finalForm, "clear");
  submitButton.disabled = true;
  submitButton.textContent = "Joining...";

  try {
    await postToFormspree(finalForm, formData);
    const submission = { email, source, submittedAt };
    saveSubmission(submission);
    console.log("Filter Wizard waitlist submission:", submission);
    trackEvent("generate_lead", { form_location: "founding_member_offer" });
    latestToolEmail = email;
    setFormMessage(finalForm, "success");
    finalForm.reset();
  } catch (error) {
    console.error("Filter Wizard waitlist submission error:", error);
    setFormMessage(finalForm, "error", "Something went wrong while joining the list. Please try again in a moment.");
  } finally {
    submitButton.disabled = false;
    submitButton.textContent = "Get My 50% Off";
  }
}

function handleStartTool(event) {
  event.preventDefault();
  markToolStarted("cta_click");

  const tool = document.querySelector("#free-tool");
  tool?.scrollIntoView({
    behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth",
    block: "start"
  });

  window.setTimeout(() => {
    toolForm?.querySelector("input[name='sizeKnowledge']")?.focus({ preventScroll: true });
  }, 350);

  closeNav();
}

setHeaderState();
setupRevealAnimations();
updateProgress();
window.addEventListener("scroll", setHeaderState, { passive: true });

if (navToggle && navMenu) {
  navToggle.addEventListener("click", toggleNav);

  navLinks.forEach((link) => {
    link.addEventListener("click", closeNav);
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && navMenu.classList.contains("open")) {
      closeNav();
    }
  });
}

startToolLinks.forEach((link) => {
  link.addEventListener("click", handleStartTool);
});

if (toolForm) {
  toolForm.addEventListener("change", (event) => {
    markToolStarted("field_change");
    updateNoneOption(event.target);
    updateSizeFields();
    updateProgress();
    setFormMessage(toolForm, "clear");
  });

  toolForm.addEventListener("input", () => {
    markToolStarted("field_input");
    updateProgress();
    setFormMessage(toolForm, "clear");
  });

  toolForm.addEventListener("submit", handleToolSubmit);
}

if (finalForm) {
  finalForm.addEventListener("input", () => setFormMessage(finalForm, "clear"));
  finalForm.addEventListener("submit", handleFinalSubmit);
}

if (resultCta) {
  resultCta.addEventListener("click", () => {
    const target = latestToolEmail ? finalConfirmation : finalForm;
    target?.scrollIntoView({
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth",
      block: "center"
    });
  });
}
