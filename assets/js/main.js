import { siteProfile } from "../../data/site.js";
import { projects } from "../../data/projects.js";
import {
  mountSiteChrome,
  runRevealPass
} from "./shared.js";

const buildIndexEntries = [
  { code: "FN-01", slug: "kinematic-puppet-cobotics" },
  { code: "FN-02", slug: "confined-space-inspection-robot" },
  { code: "FN-03", slug: "uts-motorsports-autonomous" },
  { code: "FN-04", slug: "additive-manufacturing-plier-project" }
];

const evidenceStripSlugs = [
  "kinematic-puppet-cobotics",
  "confined-space-inspection-robot",
  "warman-challenge-robot",
  "pcm-helmet-cooling-system"
];

mountSiteChrome(siteProfile);

const projectCount = document.getElementById("project-count");
const buildIndexBody = document.getElementById("build-index-body");
const evidenceStrip = document.getElementById("home-evidence-strip");

function escapeHtml(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function renderProjectCount() {
  if (!projectCount) {
    return;
  }

  projectCount.textContent = String(projects.length).padStart(2, "0");
}

function formatDomain(project) {
  return project.tags.slice(0, 3).join(" / ");
}

function formatEvidence(project) {
  const evidence = [];

  if (project.links?.repo) {
    evidence.push("public repo");
  }
  if (project.links?.docs) {
    evidence.push("documentation");
  }
  if (project.gallery?.length || project.thumbnail || project.heroImage) {
    evidence.push("visual build record");
  }

  return evidence.length ? evidence.join(" + ") : "project memo";
}

function renderBuildIndex() {
  if (!buildIndexBody) {
    return;
  }

  const rows = buildIndexEntries
    .map((entry) => {
      const project = projects.find((item) => item.slug === entry.slug);
      return project ? { ...entry, project } : null;
    })
    .filter(Boolean);

  if (!rows.length) {
    return;
  }

  buildIndexBody.innerHTML = rows
    .map(
      ({ code, project }) => `
        <tr>
          <td>${code}</td>
          <td>${project.title}</td>
          <td>${formatDomain(project)}</td>
          <td>${formatEvidence(project)}</td>
          <td><a href="projects/${project.slug}.html">Open note</a></td>
        </tr>
      `
    )
    .join("");
}

function projectImage(project) {
  return project.thumbnail || project.heroImage || project.gallery?.find((item) => item.src)?.src || "";
}

function renderEvidenceStrip() {
  if (!evidenceStrip) {
    return;
  }

  const evidenceItems = evidenceStripSlugs
    .map((slug) => projects.find((project) => project.slug === slug))
    .filter(Boolean)
    .map((project) => ({
      project,
      image: projectImage(project)
    }))
    .filter((entry) => entry.image);

  evidenceStrip.innerHTML = evidenceItems
    .map(
      ({ project, image }) => `
        <a class="home-evidence-item" href="projects/${encodeURIComponent(project.slug)}.html">
          <figure>
            <img src="${escapeHtml(image)}" alt="${escapeHtml(project.title)} project evidence" loading="lazy" />
            <figcaption>
              <span>${escapeHtml(project.year || "Project")}</span>
              <strong>${escapeHtml(project.title)}</strong>
              <em>${escapeHtml(formatDomain(project))}</em>
            </figcaption>
          </figure>
        </a>
      `
    )
    .join("");
}

renderProjectCount();
renderBuildIndex();
renderEvidenceStrip();
runRevealPass();
