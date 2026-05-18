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
const priorityRegisterGrid = document.getElementById("priority-register-grid");

const priorityProjectSlugs = [
  "kinematic-puppet-cobotics",
  "confined-space-inspection-robot",
  "uts-motorsports-autonomous",
  "warman-challenge-robot",
  "additive-manufacturing-plier-project",
  "pcm-helmet-cooling-system"
];

const priorityProjectNotes = {
  "kinematic-puppet-cobotics":
    "Modular cobot platform with CAD iteration, end-effector options, and public evidence.",
  "confined-space-inspection-robot":
    "Compact robot packaging around power, camera, controller, wiring, and service access.",
  "uts-motorsports-autonomous":
    "Sensor and electronics packaging with fabrication-aware CAD records and serviceability constraints.",
  "warman-challenge-robot":
    "Mechanism and release-system prototype records with CAD and test-facing build notes.",
  "additive-manufacturing-plier-project":
    "Topology and print-preparation record for a mechanical tool shaped by manufacturability.",
  "pcm-helmet-cooling-system":
    "Thermal subsystem evidence with CAD, mesh views, material notes, and user-comfort constraints."
};

const priorityProjectLabels = {
  "kinematic-puppet-cobotics": "Cobotics and HRI",
  "confined-space-inspection-robot": "Mobile robotics",
  "uts-motorsports-autonomous": "Autonomous hardware CAD",
  "warman-challenge-robot": "Prototype mechanisms",
  "additive-manufacturing-plier-project": "Additive manufacturing",
  "pcm-helmet-cooling-system": "Thermal subsystem"
};

const labelCaseOverrides = {
  "3D Printing": "3D printing",
  "Additive Manufacturing": "Additive manufacturing",
  "Autonomous Systems": "Autonomous systems",
  "CAD": "CAD",
  "DFM": "DFM",
  "Heat Exchanger": "Heat exchanger",
  "HRI": "HRI",
  "Human-Centred": "Human-centred",
  "Mechanical Design": "Mechanical design",
  "Mobile Robot": "Mobile robot",
  "OpenRocket": "OpenRocket",
  "PCM": "PCM",
  "Product Design": "Product design",
  "Robot Hardware": "Robot hardware",
  "Solar Thermal": "Solar thermal",
  "Space Systems": "Space systems",
  "Technical Drawing": "Technical drawing",
  "Thermal Control": "Thermal control",
  "UTS": "UTS",
  "Wind Power": "Wind power",
  "Wind Turbine": "Wind turbine"
};

const filters = [
  {
    key: "all",
    label: "All",
    terms: []
  },
  {
    key: "robotics",
    label: "Robotics",
    terms: [
      "robot",
      "robotics",
      "cobot",
      "cobotics",
      "hri",
      "autonomous",
      "mobile robot",
      "robot hardware",
      "sensing",
      "mechatronic"
    ]
  },
  {
    key: "cad",
    label: "CAD",
    terms: [
      "solidworks",
      "mechanism",
      "technical drawings",
      "packaging",
      "tolerancing",
      "serviceability",
      "dfm",
      "topology",
      "dxf",
      "openrocket",
      "reverse engineering",
      "cad-led"
    ]
  },
  {
    key: "manufacturing",
    label: "Manufacturing",
    terms: [
      "manufacturing",
      "manufacturability",
      "fabrication",
      "additive",
      "3d printing",
      "bambu",
      "dxf",
      "prototype",
      "prototyping",
      "dfm",
      "slicing"
    ]
  },
  {
    key: "thermal",
    label: "Thermal",
    terms: ["thermal", "thermofluids", "heat exchanger", "pcm", "solar", "ansys", "mesh"]
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
    project.summary,
    project.outcome,
    project.relevance,
    ...(project.tags || []),
    ...(project.tools || []),
    ...(project.role || []),
    ...(project.process || []).map((step) => `${step.title || ""} ${step.body || ""}`),
    ...(project.technicalHighlights || []).map((item) => `${item.title || ""} ${item.body || ""}`)
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
  return values.length ? values.map((item) => labelCaseOverrides[item] || item).join(", ") : fallback;
}

function evidenceSummary(project) {
  const linkLabels = {
    repo: "Public repo",
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

  const hasVisualEvidence = Boolean(project.gallery?.length || project.thumbnail || project.heroImage);
  const evidence = [...linkEvidence];

  if (hasVisualEvidence && evidence.length < 3) {
    evidence.push("Visual evidence");
  }

  if (evidence.length) {
    return evidence.slice(0, 3).join(", ");
  }

  if (hasVisualEvidence) {
    return "Visual evidence";
  }

  return "Project memo";
}

function projectImage(project) {
  return (
    project.gallery?.find((item) => item?.src)?.src ||
    project.thumbnail ||
    project.heroImage ||
    ""
  );
}

const reviewLensRules = [
  {
    label: "Robot hardware",
    terms: ["robot", "cobot", "cobotics", "hri", "mobile robot", "mechatronic"]
  },
  {
    label: "CAD packaging",
    terms: ["cad", "solidworks", "packaging", "mechanism", "dxf", "openrocket"]
  },
  {
    label: "Sensing integration",
    terms: ["sensing", "sensor", "camera", "raspberry", "controller", "autonomous"]
  },
  {
    label: "Prototype evidence",
    terms: ["prototype", "prototyping", "build evidence", "physical", "fabrication", "3d printing"]
  },
  {
    label: "Testing and serviceability",
    terms: ["testing", "test", "serviceability", "service access", "maintenance", "access"]
  },
  {
    label: "Product-style subsystem",
    terms: ["product-style", "subsystem", "manufacturability", "dfm", "user", "comfort"]
  }
];

function reviewLensLabels(project) {
  const haystack = projectSearchText(project);
  return reviewLensRules
    .filter((rule) => rule.terms.some((term) => haystack.includes(term)))
    .map((rule) => rule.label)
    .slice(0, 3);
}

function renderReviewLensChips(project) {
  const labels = reviewLensLabels(project);

  if (!labels.length) {
    return "";
  }

  return `
    <ul class="project-review-chip-list" aria-label="Project focus">
      ${labels.map((label) => `<li>${escapeHtml(label)}</li>`).join("")}
    </ul>
  `;
}

function renderPriorityRegister() {
  if (!priorityRegisterGrid) {
    return;
  }

  const priorityProjects = priorityProjectSlugs
    .map((slug) => projects.find((project) => project.slug === slug))
    .filter(Boolean)
    .filter((project) => matchesFilter(project, activeFilter));

  priorityRegisterGrid.innerHTML = priorityProjects
    .map((project) => {
      const sourceIndex = projects.findIndex((entry) => entry.slug === project.slug);
      const projectHref = `projects/${encodeURIComponent(project.slug)}.html`;
      const image = projectImage(project);
      const imageMarkup = image
        ? `<img src="${escapeHtml(image)}" alt="${escapeHtml(project.title)} project evidence" loading="lazy" />`
        : `<div class="priority-project-image-empty" aria-hidden="true">No public image</div>`;

      return `
        <article class="priority-project-card" data-register-card data-register-groups="${escapeHtml(filterKeysForProject(project).join(" "))}">
          <a href="${projectHref}">
            <figure>
              ${imageMarkup}
              <figcaption>
                <span>${escapeHtml(`${projectCode(sourceIndex)} · ${priorityProjectLabels[project.slug] || summarizeList(project.tags, project.projectType || "Project", 2)}`)}</span>
                <strong>${escapeHtml(project.title)}</strong>
                <em>${escapeHtml(priorityProjectNotes[project.slug] || project.summary || project.subtitle || "")}</em>
                ${renderReviewLensChips(project)}
              </figcaption>
            </figure>
            <small>Open project</small>
          </a>
        </article>
      `;
    })
    .join("");
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
  renderPriorityRegister();
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
renderPriorityRegister();
renderRegister();
