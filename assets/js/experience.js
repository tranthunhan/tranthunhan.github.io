import { siteProfile } from "../../data/site.js";
import { projects } from "../../data/projects.js";
import { initClickSpark } from "./click-spark.js";
import { initSiteDock } from "./dock.js";
import { initLogoLoop } from "./logo-loop.js";
import {
  initRandomProjectLink,
  initRevealAnimations,
  populateSharedProfile,
  resolveImagePath
} from "./shared.js";

populateSharedProfile(siteProfile);
initSiteDock();
initLogoLoop();
initRandomProjectLink(projects);
initClickSpark();

const experienceList = document.getElementById("experience-list");
const educationList = document.getElementById("education-list");
const certificationGrid = document.getElementById("certification-grid");
const techStackIntro = document.getElementById("tech-stack-intro");
const techStackGrid = document.getElementById("tech-stack-grid");

function createTimelineItems(items) {
  return items
    .map(
      (item) => `
        <li class="timeline-item">
          <h3 class="h4 timeline-item-title">${item.title}</h3>
          <span>${item.period}</span>
          <p class="timeline-text">${item.detail}</p>
        </li>
      `
    )
    .join("");
}

if (experienceList) {
  experienceList.innerHTML = createTimelineItems(siteProfile.experienceTimeline || []);
}

if (educationList) {
  educationList.innerHTML = createTimelineItems(siteProfile.educationTimeline || []);
}

function createTechStackCards(groups) {
  return groups
    .map(
      (group) => `
        <article class="tech-stack-card">
          <div class="tech-stack-card-heading">
            <h3 class="h4">${group.category}</h3>
            <span>${group.level}</span>
          </div>
          <ul class="tech-stack-list">
            ${group.items.map((item) => `<li>${item}</li>`).join("")}
          </ul>
        </article>
      `
    )
    .join("");
}

if (techStackIntro) {
  techStackIntro.textContent = siteProfile.techStackIntro || "";
}

if (techStackGrid) {
  techStackGrid.innerHTML = createTechStackCards(siteProfile.techStack || []);
}

function createCertificationCards(items) {
  return items
    .map((item) => {
      const imagePath = resolveImagePath(item.image);
      const credential = item.credential ? encodeURI(item.credential) : "";
      return `
        <article class="certification-card">
          <h3 class="h4 certification-title">${item.title}</h3>
          <img src="${imagePath}" alt="${item.title} certification" loading="lazy" />
          ${
            credential
              ? `<div class="certification-actions">
                  <a class="button button-resource" href="${credential}" target="_blank" rel="noreferrer">Open Certificate PDF</a>
                </div>`
              : ""
          }
        </article>
      `;
    })
    .join("");
}

if (certificationGrid) {
  certificationGrid.innerHTML = createCertificationCards(siteProfile.certifications || []);
}

initRevealAnimations();
