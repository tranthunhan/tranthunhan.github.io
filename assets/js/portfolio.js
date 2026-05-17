import { projects } from "../../data/projects.js";
import { siteProfile } from "../../data/site.js";
import { mountSiteChrome, runRevealPass } from "./shared.js";

mountSiteChrome(siteProfile);

const filterList = document.getElementById("register-filter-list");
const filterSelect = document.getElementById("register-filter-select");
const registerBody = document.getElementById("build-register-body");
const registerEmpty = document.getElementById("register-empty");
const visibleCount = document.getElementById("visible-count");
const totalCount = document.getElementById("total-count");

const filters = [
  {
    key: "all",
    label: "All",
    terms: []
  },
  {
    key: "robotics",
    label: "Robotics",
    terms: ["robot", "robotics", "cobot", "cobotics", "hri", "autonomous", "mobile robot"]
  },
  {
    key: "cad",
    label: "CAD",
    terms: ["cad", "solidworks", "mechanism", "mechanical design", "technical drawings"]
  },
  {
    key: "manufacturing",
    label: "Manufacturing",
    terms: ["manufacturing", "fabrication", "additive", "3d printing", "bambu", "dxf", "prototype"]
  },
  {
    key: "thermal",
    label: "Thermal",
    terms: ["thermal", "thermofluids", "heat exchanger", "pcm", "solar"]
  },
  {
    key: "personal",
    label: "Personal",
    terms: ["personal"]
  }
];

let activeFilter = "all";

function escapeHtml(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function projectSearchText(project) {
  return [
    project.title,
    project.subtitle,
    project.year,
    project.status,
    project.projectType,
    ...(project.tags || []),
    ...(project.tools || [])
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();
}

function matchesFilter(project, filterKey) {
  const filter = filters.find((entry) => entry.key === filterKey) || filters[0];

  if (filter.key === "all") {
    return true;
  }

  if (filter.key === "personal" && project.year === "Personal") {
    return true;
  }

  const haystack = projectSearchText(project);
  return filter.terms.some((term) => haystack.includes(term));
}

function filterKeysForProject(project) {
  return filters
    .filter((filter) => matchesFilter(project, filter.key))
    .map((filter) => filter.key);
}

function projectCode(index) {
  return `BR-${String(index + 1).padStart(2, "0")}`;
}

function summarizeList(items, fallback, maxItems = 3) {
  const values = (items || []).filter(Boolean).slice(0, maxItems);
  return values.length ? values.join(" / ") : fallback;
}

function evidenceSummary(project) {
  const linkLabels = {
    repo: "Repo",
    article: "Article",
    cad: "CAD",
    drawings: "Drawings",
    print: "Print",
    docs: "Docs",
    media: "Media"
  };

  const linkEvidence = Object.entries(project.links || {})
    .filter(([, href]) => Boolean(href))
    .map(([key]) => linkLabels[key] || key)
    .slice(0, 3);

  if (linkEvidence.length) {
    return linkEvidence.join(" / ");
  }

  if (project.gallery?.length || project.thumbnail || project.heroImage) {
    return "Visual record";
  }

  return "Project page";
}

function renderFilters() {
  if (filterList) {
    filterList.innerHTML = filters
      .map(
        (filter) => `
          <li>
            <button
              class="${filter.key === activeFilter ? "is-active" : ""}"
              type="button"
              data-register-filter="${escapeHtml(filter.key)}"
              aria-pressed="${filter.key === activeFilter ? "true" : "false"}"
            >
              ${escapeHtml(filter.label)}
            </button>
          </li>
        `
      )
      .join("");
  }

  if (filterSelect) {
    filterSelect.innerHTML = filters
      .map(
        (filter) => `
          <option value="${escapeHtml(filter.key)}" ${filter.key === activeFilter ? "selected" : ""}>
            ${escapeHtml(filter.label)}
          </option>
        `
      )
      .join("");
  }
}

function renderRegister() {
  if (!registerBody) {
    return;
  }

  const filteredProjects = projects.filter((project) => matchesFilter(project, activeFilter));

  registerBody.innerHTML = filteredProjects
    .map((project) => {
      const sourceIndex = projects.findIndex((entry) => entry.slug === project.slug);
      const projectHref = `projects/${encodeURIComponent(project.slug)}.html`;
      const registerGroups = filterKeysForProject(project).join(" ");

      return `
        <tr data-register-row data-register-groups="${escapeHtml(registerGroups)}">
          <td data-label="Code">${escapeHtml(projectCode(sourceIndex))}</td>
          <td data-label="Year">${escapeHtml(project.year || "Current")}</td>
          <td data-label="Project">
            <a class="register-project-link" href="${projectHref}">
              ${escapeHtml(project.title)}
            </a>
            <span>${escapeHtml(project.subtitle || project.status || "")}</span>
          </td>
          <td data-label="Domain">${escapeHtml(summarizeList(project.tags, project.projectType || "Project"))}</td>
          <td data-label="Tools">${escapeHtml(summarizeList(project.tools, "Project tools"))}</td>
          <td data-label="Evidence">${escapeHtml(evidenceSummary(project))}</td>
          <td data-label="Open">
            <a class="register-open-link" href="${projectHref}" aria-label="Open ${escapeHtml(project.title)}">
              Open
            </a>
          </td>
        </tr>
      `;
    })
    .join("");

  if (visibleCount) {
    visibleCount.textContent = String(filteredProjects.length);
  }

  if (totalCount) {
    totalCount.textContent = String(projects.length);
  }

  if (registerEmpty) {
    registerEmpty.hidden = filteredProjects.length > 0;
  }

  runRevealPass();
}

function setActiveFilter(filterKey) {
  activeFilter = filters.some((filter) => filter.key === filterKey) ? filterKey : "all";
  renderFilters();
  renderRegister();
}

document.addEventListener("click", (event) => {
  const filterButton = event.target.closest("[data-register-filter]");

  if (filterButton) {
    setActiveFilter(filterButton.dataset.registerFilter);
  }
});

if (filterSelect) {
  filterSelect.addEventListener("change", (event) => {
    setActiveFilter(event.target.value);
  });
}

renderFilters();
renderRegister();
