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

mountSiteChrome(siteProfile);

const projectCount = document.getElementById("project-count");
const buildIndexBody = document.getElementById("build-index-body");

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

renderProjectCount();
renderBuildIndex();
runRevealPass();
