const header = document.querySelector("[data-header]");
const navToggle = document.querySelector("[data-nav-toggle]");
const navMenu = document.querySelector("[data-nav-menu]");
const navLinks = document.querySelectorAll(".nav-links a, .footer-links a");
const earlyAccessForms = document.querySelectorAll("[data-early-form]");
const storageKey = "filterWizardEarlyAccess";

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
  navMenu.classList.remove("open");
  navToggle.setAttribute("aria-expanded", "false");
  navToggle.setAttribute("aria-label", "Open navigation menu");
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

async function handleFormSubmit(event) {
  event.preventDefault();

  const form = event.currentTarget;
  const formLocation = form.dataset.formLocation;
  const source = formLocation === "hero" ? "Hero Email Form" : "Main Early Access Form";
  const attemptEvent = formLocation === "hero"
    ? "hero_form_submit_attempt"
    : "main_form_submit_attempt";
  const successMessage = form.querySelector("[data-form-success]");
  const errorMessage = form.querySelector("[data-form-error]");
  const submitButton = form.querySelector(".form-submit");

  trackEvent(attemptEvent, {
    form_location: formLocation,
    form_source: source
  });

  if (!form.checkValidity()) {
    form.reportValidity();
    return;
  }

  const formData = new FormData(form);
  const submittedAt = new Date().toISOString();
  formData.set("submittedAt", submittedAt);

  const submission = {
    email: formData.get("email"),
    phone: formData.get("phone") || "",
    source,
    submittedAt
  };

  successMessage.hidden = true;
  errorMessage.hidden = true;
  submitButton.disabled = true;
  submitButton.textContent = "Joining...";

  try {
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

    saveSubmission(submission);
    console.log("Filter Wizard early access submission:", submission);
    trackEvent("early_access_signup_success", {
      form_location: formLocation,
      form_source: source
    });

    form.reset();
    successMessage.hidden = false;
    successMessage.scrollIntoView({
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth",
      block: "nearest"
    });
  } catch (error) {
    console.error("Filter Wizard Formspree submission error:", error);
    trackEvent("early_access_signup_error", {
      form_location: formLocation,
      form_source: source
    });

    errorMessage.hidden = false;
    errorMessage.scrollIntoView({
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth",
      block: "nearest"
    });
  } finally {
    submitButton.disabled = false;
    submitButton.textContent = "Join Early Access";
  }
}

setHeaderState();
setupRevealAnimations();
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

earlyAccessForms.forEach((form) => {
  form.addEventListener("submit", handleFormSubmit);
  form.addEventListener("input", () => {
    form.querySelector("[data-form-success]").hidden = true;
    form.querySelector("[data-form-error]").hidden = true;
  });
});
