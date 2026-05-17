import { siteProfile } from "../../data/site.js";
import { mountSiteChrome, runRevealPass, sitePath } from "./shared.js";

mountSiteChrome(siteProfile);

const nodes = {
  applied: document.getElementById("applied-experience-log"),
  education: document.getElementById("education-log"),
  toolkitIntro: document.getElementById("toolkit-intro"),
  toolkitBody: document.getElementById("toolkit-register-body"),
  certifications: document.getElementById("certification-register-body")
};

const degreeLine = "Bachelor of Engineering (Honours), Mechanical Engineering";

function cleanText(value) {
  const text = value === undefined || value === null ? "" : String(value);
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function titleWithDash(title) {
  return cleanText(title).replace(/\s-\s/g, " &mdash; ");
}

function numberedCode(prefix, index) {
  return `${prefix}-${String(index + 1).padStart(2, "0")}`;
}

function renderAppliedExperience(items = []) {
  if (!nodes.applied) {
    return;
  }

  nodes.applied.innerHTML = items
    .map(
      (item, index) => `
        <article class="capability-log-row">
          <p class="capability-log-code">${numberedCode("EXP", index)}</p>
          <div class="capability-log-copy">
            <h3>${titleWithDash(item.title)}</h3>
            <p class="capability-log-meta">${cleanText(item.period)}</p>
            <p>${cleanText(item.detail)}</p>
          </div>
        </article>
      `
    )
    .join("");
}

function renderEducation(items = []) {
  if (!nodes.education) {
    return;
  }

  nodes.education.innerHTML = items
    .map(
      (item, index) => `
        <article class="capability-log-row">
          <p class="capability-log-code">${numberedCode("EDU", index)}</p>
          <div class="capability-log-copy">
            <h3>${cleanText(item.title)}</h3>
            <p class="capability-log-meta">${cleanText(degreeLine)}</p>
            <p class="capability-log-period">${cleanText(item.period)}</p>
            <p>${cleanText(item.detail)}</p>
          </div>
        </article>
      `
    )
    .join("");
}

function renderToolkit(groups = []) {
  if (nodes.toolkitIntro) {
    nodes.toolkitIntro.textContent = siteProfile.techStackIntro || "";
  }

  if (!nodes.toolkitBody) {
    return;
  }

  nodes.toolkitBody.innerHTML = groups
    .map(
      (group) => `
        <tr>
          <th scope="row">${cleanText(group.category)}</th>
          <td>${cleanText(group.level)}</td>
          <td>
            <div class="toolkit-token-list">
              ${(group.items || [])
                .map((item) => `<span class="toolkit-token">${cleanText(item)}</span>`)
                .join("")}
            </div>
          </td>
        </tr>
      `
    )
    .join("");
}

function certificationActions(item) {
  const actions = [];

  if (item.verification) {
    actions.push(
      `<a href="${encodeURI(item.verification)}" target="_blank" rel="noreferrer">Verify</a>`
    );
  }

  if (item.document) {
    actions.push(
      `<a href="${sitePath(item.document)}" target="_blank" rel="noreferrer">Open PDF</a>`
    );
  }

  return actions.join("");
}

function renderCertifications(items = []) {
  if (!nodes.certifications) {
    return;
  }

  nodes.certifications.innerHTML = items
    .map((item, index) => {
      const imageSource = item.image ? sitePath(item.image) : "";
      const year = item.year ? `<span>${cleanText(item.year)}</span>` : "";

      return `
        <article class="cert-register-row">
          <p class="cert-register-code">${numberedCode("CERT", index)}</p>
          ${
            imageSource
              ? `<img class="cert-register-image" src="${imageSource}" alt="${cleanText(
                  item.title
                )} certificate thumbnail" loading="lazy" />`
              : `<div class="cert-register-image cert-register-image-empty" aria-hidden="true"></div>`
          }
          <div class="cert-register-copy">
            <h3>${cleanText(item.title)}</h3>
            <p>${cleanText(item.issuer)} ${year}</p>
          </div>
          <div class="cert-register-actions">${certificationActions(item)}</div>
        </article>
      `;
    })
    .join("");
}

renderAppliedExperience(siteProfile.experienceTimeline || []);
renderEducation(siteProfile.educationTimeline || []);
renderToolkit(siteProfile.techStack || []);
renderCertifications(siteProfile.certifications || []);
runRevealPass();
