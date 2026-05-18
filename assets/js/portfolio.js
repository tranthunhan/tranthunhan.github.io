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
    "Low-cost cobot test platform with modular morphology, CAD iteration, and physical prototypes.",
  "confined-space-inspection-robot":
    "Compact mobile robot packaging around chassis layout, camera, controller, wiring, and service access.",
  "uts-motorsports-autonomous":
    "Sensor and electronics mounting shaped by fabrication-aware CAD, serviceability, and vehicle constraints.",
  "warman-challenge-robot":
    "Ball-retention and servo-release mechanism work with CAD iteration and prototype review.",
  "additive-manufacturing-plier-project":
    "DfAM plier design with topology optimisation, static-study visuals, and slicer setup.",
  "pcm-helmet-cooling-system":
    "PCM helmet cooling concept with CAD, mesh views, material packaging, and comfort constraints."
};

const priorityProjectLabels = {
  "kinematic-puppet-cobotics": "Cobot test platform",
  "confined-space-inspection-robot": "Compact mobile robot",
  "uts-motorsports-autonomous": "Autonomous hardware CAD",
  "warman-challenge-robot": "Robot mechanism design",
  "additive-manufacturing-plier-project": "DfAM tool design",
  "pcm-helmet-cooling-system": "PCM thermal concept"
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
  "Material Packaging": "Material packaging",
  "Mechanical Design": "Mechanical design",
  "Mesh Studies": "Mesh studies",
  "Mobile Robot": "Mobile robot",
  "OpenRocket": "OpenRocket",
  "PCM": "PCM",
  "Product Design": "Product design",
  "Prototype Review": "Prototype review",
  "Robot Hardware": "Robot hardware",
  "Solar Thermal": "Solar thermal",
  "Space Systems": "Space systems",
  "Static Study": "Static study",
  "Technical Drawing": "Technical drawing",
  "Thermal Control": "Thermal control",
  "User Comfort": "User comfort",
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

function materialSummary(project) {
  const linkLabels = {
    repo: "Repository",
    article: "Article",
    cad: "CAD",
    drawings: "Drawings",
    print: "Print",
    docs: "Docs",
    media: "Media"
  };

  const linkMaterial = Object.entries(project.links || {})
    .filter(([, href]) => Boolean(href))
    .map(([key]) => linkLabels[key] || key)
    .slice(0, 3);

  const hasVisualEvidence = Boolean(project.gallery?.length || project.thumbnail || project.heroImage);
  const material = [...linkMaterial];

  if (hasVisualEvidence && material.length < 3) {
    material.push("Project images");
  }

  if (material.length) {
    return material.slice(0, 3).join(", ");
  }

  if (hasVisualEvidence) {
    return "Project images";
  }

  return "Project notes";
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
    label: "Sensor integration",
    terms: ["sensing", "sensor", "camera", "raspberry", "controller", "autonomous"]
  },
  {
    label: "Prototype work",
    terms: ["prototype", "prototyping", "build evidence", "physical", "fabrication", "3d printing"]
  },
  {
    label: "Testing and serviceability",
    terms: ["testing", "test", "serviceability", "service access", "maintenance", "access"]
  },
  {
    label: "Mechanical subsystem",
    terms: ["subsystem", "manufacturability", "dfm", "user", "comfort"]
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
        ? `<img src="${escapeHtml(image)}" alt="${escapeHtml(project.title)} project image" loading="lazy" />`
        : `<div class="priority-project-image-empty" aria-hidden="true">No public image</div>`;

      return `
        <article class="priority-project-card" data-register-card data-register-groups="${escapeHtml(filterKeysForProject(project).join(" "))}">
          <a href="${projectHref}">
            <figure>
              ${imageMarkup}
              <figcaption>
                <span>${escapeHtml(`${projectCode(sourceIndex)} - ${priorityProjectLabels[project.slug] || summarizeList(project.tags, project.projectType || "Project", 2)}`)}</span>
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
          <td data-label="Material">${escapeHtml(materialSummary(project))}</td>
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
