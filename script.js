const header = document.querySelector("[data-header]");
const navToggle = document.querySelector("[data-nav-toggle]");
const navMenu = document.querySelector("[data-nav-menu]");
const navLinks = document.querySelectorAll(".nav-links a, .footer-links a, .hero-actions a, .final-cta a, .pricing-card a");
const planButtons = document.querySelectorAll("[data-plan]");
const form = document.querySelector("[data-early-form]");
const successMessage = document.querySelector("[data-form-success]");
const errorMessage = document.querySelector("[data-form-error]");
const storageKey = "filterWizardEarlyAccess";

function setHeaderState() {
  header.classList.toggle("scrolled", window.scrollY > 8);
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
    { threshold: 0.14 }
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

function handlePlanSelection(event) {
  event.preventDefault();

  const selectedPlan = event.currentTarget.dataset.plan;
  const planSelect = form.querySelector("#selectedPlan");
  const matchingOption = Array.from(planSelect.options)
    .some((option) => option.value === selectedPlan);
  const formSection = document.querySelector("#early-access");

  if (matchingOption) {
    planSelect.value = selectedPlan;
  }

  formSection.scrollIntoView({
    behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth",
    block: "start"
  });

  window.setTimeout(() => {
    form.querySelector("#name").focus({ preventScroll: true });
  }, 450);
}

async function handleFormSubmit(event) {
  event.preventDefault();

  if (!form.checkValidity()) {
    form.reportValidity();
    return;
  }

  const formData = new FormData(form);
  const selectedPlan = formData.get("selectedPlan") || "Not specified";
  formData.set("selectedPlan", selectedPlan);
  const submitButton = form.querySelector(".form-submit");
  const submission = {
    name: formData.get("name"),
    email: formData.get("email"),
    phone: formData.get("phone"),
    selectedPlan,
    submittedAt: new Date().toISOString()
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

    successMessage.hidden = false;
    form.reset();
    successMessage.scrollIntoView({ behavior: "smooth", block: "nearest" });
  } catch (error) {
    console.error("Filter Wizard Formspree submission error:", error);
    errorMessage.hidden = false;
    errorMessage.scrollIntoView({ behavior: "smooth", block: "nearest" });
  } finally {
    submitButton.disabled = false;
    submitButton.textContent = "Join Early Access";
  }
}

if (header && navToggle && navMenu && form && successMessage && errorMessage) {
  setHeaderState();
  setupRevealAnimations();

  window.addEventListener("scroll", setHeaderState, { passive: true });

  navToggle.addEventListener("click", toggleNav);

  navLinks.forEach((link) => {
    link.addEventListener("click", () => {
      if (navMenu.classList.contains("open")) {
        closeNav();
      }
    });
  });

  planButtons.forEach((button) => {
    button.addEventListener("click", handlePlanSelection);
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && navMenu.classList.contains("open")) {
      closeNav();
    }
  });

  form.addEventListener("submit", handleFormSubmit);

  form.addEventListener("input", () => {
    successMessage.hidden = true;
    errorMessage.hidden = true;
  });
}
