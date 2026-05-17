import { siteProfile } from "../../data/site.js";
import {
  initRevealAnimations,
  populateSharedProfile
} from "./shared.js";

populateSharedProfile(siteProfile);

const map = document.getElementById("contact-map");
const locationLabel = document.getElementById("contact-location");
const contactSubheading = document.getElementById("contact-subheading");
const socialGrid = document.getElementById("contact-social-grid");
const form = document.getElementById("contact-form");
const submitButton = document.getElementById("contact-submit");
const formHelp = document.getElementById("contact-form-help");

const socialBadgeByLabel = {
  Discord:
    "https://img.shields.io/badge/Discord-%237289DA.svg?logo=discord&logoColor=white",
  Instagram:
    "https://img.shields.io/badge/Instagram-%23E4405F.svg?logo=Instagram&logoColor=white",
  LinkedIn:
    "https://img.shields.io/badge/LinkedIn-%230077B5.svg?logo=linkedin&logoColor=white",
  Pinterest:
    "https://img.shields.io/badge/Pinterest-%23E60023.svg?logo=Pinterest&logoColor=white",
  TikTok:
    "https://img.shields.io/badge/TikTok-%23000000.svg?logo=TikTok&logoColor=white",
  YouTube:
    "https://img.shields.io/badge/YouTube-%23FF0000.svg?logo=YouTube&logoColor=white",
  GitHub:
    "https://img.shields.io/badge/GitHub-%23181717.svg?logo=github&logoColor=white"
};

const socialCtaByLabel = {
  Discord: "open profile",
  Instagram: "open profile",
  LinkedIn: "view my profile",
  Pinterest: "open profile",
  TikTok: "open profile",
  YouTube: "view channel",
  GitHub: "view my projects"
};

if (map) {
  map.src = siteProfile.mapEmbedUrl || "";
}

if (locationLabel) {
  locationLabel.textContent = siteProfile.address || siteProfile.location || "";
}

if (contactSubheading) {
  contactSubheading.textContent =
    siteProfile.contactSubheading ||
    "Mechanical Engineering student at the University of Technology Sydney.";
}

if (socialGrid) {
  const socialSection = socialGrid.closest(".section");
  const socials = siteProfile.socials || [];

  if (!socials.length) {
    if (socialSection) {
      socialSection.hidden = true;
    }
  } else {
    socialGrid.innerHTML = socials
      .map((social) => {
        const badgeSrc = socialBadgeByLabel[social.label];
        const badgeMarkup = badgeSrc
          ? `
            <img
              class="social-badge"
              src="${badgeSrc}"
              alt="${social.label} logo badge"
              loading="lazy"
              decoding="async"
            />
          `
          : "";
        const socialCta = socialCtaByLabel[social.label] || "Open profile";

        return `
          <a class="contact-card reveal" href="${social.url}" target="_blank" rel="noreferrer" aria-label="${social.label}">
            ${badgeMarkup}
            <p class="text-link social-cta">${socialCta}</p>
          </a>
        `;
      })
      .join("");
  }
}

if (form && submitButton) {
  const formSection = form.closest(".section");
  const hasContactEmail =
    siteProfile.contactEmail && siteProfile.contactEmail.includes("@");

  if (!hasContactEmail && formSection) {
    formSection.hidden = true;
  }

  if (formHelp && hasContactEmail) {
    formHelp.innerHTML = `This static GitHub Pages form opens your email app. You can also email me directly at <a href="mailto:${siteProfile.contactEmail}">${siteProfile.contactEmail}</a>.`;
  }

  const fields = [...form.querySelectorAll(".form-input")];

  const updateFormState = () => {
    submitButton.disabled = fields.some((field) => !field.value.trim());
  };

  fields.forEach((field) => {
    field.addEventListener("input", updateFormState);
  });
  updateFormState();

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    const name = form.elements.namedItem("fullname")?.value.trim() || "";
    const email = form.elements.namedItem("email")?.value.trim() || "";
    const message = form.elements.namedItem("message")?.value.trim() || "";

    const subject = encodeURIComponent(`Portfolio contact from ${name}`);
    const body = encodeURIComponent(
      `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`
    );

    if (hasContactEmail) {
      window.location.href = `mailto:${siteProfile.contactEmail}?subject=${subject}&body=${body}`;
    }
  });
}

initRevealAnimations();
