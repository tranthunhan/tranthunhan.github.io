import { siteProfile } from "../../data/site.js";
import { mountSiteChrome, runRevealPass } from "./shared.js";

mountSiteChrome(siteProfile);

const contactIntro = document.getElementById("contact-note-body");
const contactLocation = document.getElementById("contact-location");
const contactRegister = document.getElementById("contact-register-list");

function safeText(value) {
  const text = value === undefined || value === null ? "" : String(value);
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function socialUrl(label) {
  const match = (siteProfile.socials || []).find(
    (social) => social.label.toLowerCase() === label.toLowerCase()
  );

  return match?.url || siteProfile.links?.[label.toLowerCase()] || "";
}

function publicEmail() {
  const email = siteProfile.contactEmail || "";
  return email.includes("@") ? email : "";
}

function contactIconSvg(label) {
  const key = String(label || "").toLowerCase();
  const icons = {
    github: `
      <svg viewBox="0 0 16 16" focusable="false" aria-hidden="true">
        <path d="M8 1.35a6.7 6.7 0 0 0-2.12 13.06c.33.06.45-.14.45-.31v-1.12c-1.84.4-2.23-.78-2.23-.78-.3-.77-.74-.98-.74-.98-.6-.41.05-.4.05-.4.67.05 1.02.68 1.02.68.59 1.01 1.55.72 1.93.55.06-.43.23-.72.42-.89-1.47-.17-3.01-.74-3.01-3.27 0-.72.26-1.31.68-1.77-.07-.17-.3-.84.06-1.74 0 0 .56-.18 1.84.68A6.4 6.4 0 0 1 8 4.93c.57 0 1.13.08 1.67.22 1.27-.86 1.83-.68 1.83-.68.37.9.14 1.57.07 1.74.42.46.68 1.05.68 1.77 0 2.54-1.55 3.1-3.02 3.26.24.21.45.61.45 1.22v1.82c0 .17.12.38.46.31A6.7 6.7 0 0 0 8 1.35Z" />
      </svg>
    `,
    linkedin: `
      <svg viewBox="0 0 16 16" focusable="false" aria-hidden="true">
        <path d="M3.7 5.94h2.06v6.6H3.7v-6.6Zm1.03-3.28a1.19 1.19 0 1 1 0 2.38 1.19 1.19 0 0 1 0-2.38Zm2.32 3.28h1.97v.9h.03c.27-.52.95-1.07 1.95-1.07 2.08 0 2.47 1.37 2.47 3.16v3.61h-2.05V9.34c0-.77-.02-1.75-1.07-1.75-1.07 0-1.23.83-1.23 1.69v3.26H7.05v-6.6Z" />
      </svg>
    `
  };

  return icons[key] || `
    <svg viewBox="0 0 16 16" focusable="false" aria-hidden="true">
      <path d="M2.4 4.2h11.2v7.6H2.4V4.2Zm1.1 1.1v.16L8 8.38l4.5-2.92V5.3h-9Zm9 5.4V6.76L8 9.66 3.5 6.76v3.94h9Z" />
    </svg>
  `;
}

function contactRows() {
  const rows = [
    {
      code: "LINK-01",
      label: "LinkedIn",
      purpose: "Professional profile and project discussion.",
      href: socialUrl("LinkedIn")
    },
    {
      code: "LINK-02",
      label: "GitHub",
      purpose: "GitHub profile and public project repositories.",
      href: socialUrl("GitHub")
    }
  ];

  const email = publicEmail();
  if (email) {
    rows.push({
      code: "LINK-03",
      label: "Email",
      purpose: "Direct email contact.",
      href: `mailto:${email}`
    });
  }

  return rows.filter((row) => row.href);
}

function renderContactRegister(rows) {
  if (!contactRegister) {
    return;
  }

  contactRegister.innerHTML = rows
    .map((row) => {
      const external = /^https?:\/\//i.test(row.href);
      const target = external ? ' target="_blank" rel="noreferrer"' : "";

      return `
        <a class="contact-register-row" href="${encodeURI(row.href)}"${target}>
          <span class="contact-register-icon">${contactIconSvg(row.label)}</span>
          <span class="contact-register-main">
            <strong>${safeText(row.label)}</strong>
            <em>${safeText(row.purpose)}</em>
          </span>
          <span class="contact-register-action">Open</span>
        </a>
      `;
    })
    .join("");
}

if (contactIntro) {
  const context =
    siteProfile.contactSubheading ||
    "Mechanical engineering student focused on project review, design context, and collaboration discussion.";
  contactIntro.textContent = `This page is for portfolio review, project discussion, mechanical design context, and engineering collaboration. ${context}`;
}

if (contactLocation) {
  const location = siteProfile.location || siteProfile.address || "Sydney, Australia";
  contactLocation.textContent = `Location: ${location}`;
}

renderContactRegister(contactRows());
runRevealPass();
