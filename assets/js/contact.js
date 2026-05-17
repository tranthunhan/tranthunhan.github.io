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
      purpose: "Public portfolio repository and engineering project source context.",
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
          <span class="contact-register-code">${safeText(row.code)}</span>
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
  contactIntro.textContent = `This contact note is for portfolio review, project discussion, mechanical design context, and engineering collaboration. ${context}`;
}

if (contactLocation) {
  const location = siteProfile.location || siteProfile.address || "Sydney, Australia";
  contactLocation.textContent = `Location: ${location}`;
}

renderContactRegister(contactRows());
runRevealPass();
