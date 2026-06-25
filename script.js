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
const countdownEls = document.querySelectorAll("[data-countdown]");
const countdownView = document.querySelector("[data-countdown-view]");
const storageKey = "filterWizardReservations";
const countdownKey = "filterWizardFounderOfferEndsAt";
const fallbackPlan = {
  plan: "Plus",
  regular: "$39.99 / month",
  founder: "$19.99 / month"
};
let selectedPlan = { ...fallbackPlan };
let countdownViewed = false;

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
  selectedPlan = plan;
  document.querySelector("[data-selected-plan]").textContent = plan.plan;
  document.querySelector("[data-selected-regular]").textContent = plan.regular;
  document.querySelector("[data-selected-founder]").textContent = plan.founder;
  document.querySelector("[data-plan-field]").value = plan.plan;
  document.querySelector("[data-regular-field]").value = plan.regular;
  document.querySelector("[data-founder-field]").value = plan.founder;
}

function openReservation(plan = fallbackPlan) {
  setSelectedPlan(plan);

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

  modalBackdrop.classList.remove("closing");
  modalBackdrop.hidden = true;
  modalBackdrop.style.display = "none";
  document.body.classList.remove("modal-open");
  document.documentElement.classList.remove("modal-open");
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

setHeaderState();
setupRevealAnimations();
setupCountdownTracking();
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

planButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const plan = {
      plan: button.dataset.plan,
      regular: button.dataset.regular,
      founder: button.dataset.founder
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
