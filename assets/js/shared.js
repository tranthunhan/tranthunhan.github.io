const SELF_CONTAINED_PATH = /^(?:[a-z][a-z\d+.-]*:|\/|#|\.\.\/)/i;

function projectPagePrefix() {
  return document.body.classList.contains("project-page") ? "../" : "";
}

function applyPagePrefix(path, prefix = projectPagePrefix()) {
  if (!path) {
    return "";
  }

  if (SELF_CONTAINED_PATH.test(path)) {
    return encodeURI(path);
  }

  return encodeURI(`${prefix}${path}`);
}

function fillTextSlots(profile) {
  document.querySelectorAll("[data-profile]").forEach((node) => {
    const value = profile[node.dataset.profile];

    if (value !== undefined && value !== null && value !== "") {
      node.textContent = value;
    }
  });

  document.querySelectorAll(".brand-subtitle").forEach((node) => {
    node.textContent =
      profile.siteSubtitle ||
      profile.archiveTitle ||
      node.textContent.trim() ||
      "MECHANICAL RESEARCH LOGBOOK";
  });
}

function fillBrandMarks(profile) {
  const logoSource = applyPagePrefix(profile.brandLogo || "");

  document.querySelectorAll(".brand-mark").forEach((node) => {
    node.replaceChildren();

    if (!logoSource) {
      node.dataset.hasLogo = "false";
      node.textContent = profile.initials || "ND";
      return;
    }

    const image = document.createElement("img");
    image.src = logoSource;
    image.alt = `${profile.name || "Profile"} logo`;
    image.decoding = "async";
    image.loading = "lazy";

    node.dataset.hasLogo = "true";
    node.appendChild(image);
  });
}

function profileHref(profile, key) {
  if (key === "email" || key === "contact") {
    return profile.contactEmail ? `mailto:${profile.contactEmail}` : "";
  }

  return profile.links?.[key] || "";
}

function fillProfileLinks(profile) {
  document.querySelectorAll("[data-profile-link]").forEach((node) => {
    const href = profileHref(profile, node.dataset.profileLink);
    const wrapper = node.closest(".contact-card");

    if (!href) {
      node.removeAttribute("href");
      node.hidden = true;
      if (wrapper) {
        wrapper.hidden = true;
      }
      return;
    }

    node.href = applyPagePrefix(href);
    node.hidden = false;

    if (/^https?:\/\//i.test(href)) {
      node.target = "_blank";
      node.rel = "noreferrer";
    } else {
      node.removeAttribute("target");
      node.removeAttribute("rel");
    }

    if (wrapper) {
      wrapper.hidden = false;
    }
  });
}

function fillYearStamps() {
  const currentYear = String(new Date().getFullYear());

  document.querySelectorAll("[data-current-year]").forEach((node) => {
    node.textContent = currentYear;
  });
}

export function mountSiteChrome(profile = {}) {
  fillTextSlots(profile);
  fillBrandMarks(profile);
  fillProfileLinks(profile);
  fillYearStamps();
}

export function sitePath(path, prefix = projectPagePrefix()) {
  return applyPagePrefix(path, prefix);
}

export function runRevealPass() {
  const items = Array.from(document.querySelectorAll(".reveal"));

  if (!items.length) {
    return;
  }

  if (!window.IntersectionObserver) {
    items.forEach((item) => item.classList.add("is-visible"));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) {
          return;
        }

        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    },
    { threshold: 0.12 }
  );

  items.forEach((item) => observer.observe(item));
}
