import { siteProfile } from "../../data/site.js";
import {
  getProjectBySlug,
  projectLinkLabels,
  projects
} from "../../data/projects.js";
import { repoImages } from "../../data/repo-images.js";
import {
  mountSiteChrome,
  runRevealPass,
  sitePath
} from "./shared.js";

mountSiteChrome(siteProfile);

const slug = document.body.dataset.projectSlug;
const project = getProjectBySlug(slug);

const headerRoot = document.getElementById("project-header");
const galleryRoot = document.getElementById("project-gallery");
const contentRoot = document.getElementById("project-content");
const sidebarRoot = document.getElementById("project-sidebar");
const relatedRoot = document.getElementById("related-projects");

if (!project) {
  document.title = `Project Not Found | ${siteProfile.name}`;
  renderMissingProject();
} else {
  document.title = `${project.title} | ${siteProfile.name}`;
  renderProjectPage(project);
  mountSiteChrome(siteProfile);
  runRevealPass();
}

function asArray(value) {
  return Array.isArray(value) ? value.filter(Boolean) : [];
}

function escapeHtml(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function removeFileType(text) {
  return text.replace(/\.(png|jpe?g|gif|webp|bmp|tiff?|mp4|mov|webm)$/i, "");
}

function cleanupCaption(rawText, fallback) {
  if (!rawText) {
    return fallback;
  }

  const cleaned = rawText
    .replace(/^Imported from repository:\s*/i, "")
    .replace(/^[\w-]+\s+repo image:\s*/i, "")
    .replace(/[_-]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  const noType = removeFileType(cleaned);
  return noType ? noType.charAt(0).toUpperCase() + noType.slice(1) : fallback;
}

function resolveProjectAsset(path) {
  return sitePath(path, "../");
}

function uniqueBySource(items) {
  return items.filter(
    (item, index, allItems) =>
      item?.src &&
      index === allItems.findIndex((candidate) => candidate.src === item.src)
  );
}

function collectProjectGalleryItems(activeProject) {
  const customGallery = asArray(activeProject.gallery).filter((item) => item?.src);
  const importedGallery = asArray(repoImages[activeProject.slug]).filter((item) => item?.src);

  return uniqueBySource([...customGallery, ...importedGallery]);
}

function renderMissingProject() {
  if (!headerRoot) {
    return;
  }

  headerRoot.innerHTML = `
    <article class="empty-state">
      <h1>Project not found</h1>
      <p>This page is missing a matching entry in <code>data/projects.js</code>.</p>
      <a class="button" href="../portfolio.html">Back to Build Index</a>
    </article>
  `;
}

function renderProjectPage(activeProject) {
  const evidenceItems = collectProjectGalleryItems(activeProject);
  hideStandaloneGallerySlot();
  renderHeader(activeProject);
  renderContent(activeProject, evidenceItems);
  renderSidebar(activeProject);
  renderRelated(activeProject);
}

function hideStandaloneGallerySlot() {
  const galleryShell = galleryRoot?.closest(".project-gallery-shell");

  if (galleryShell) {
    galleryShell.hidden = true;
  }
}

function renderHeader(activeProject) {
  if (!headerRoot) {
    return;
  }

  const topLinks = createProjectLinks(activeProject.links, { compact: false });
  const tagList = createInlineList(asArray(activeProject.tags), "memo-tag-list");
  const toolSummary = asArray(activeProject.tools).slice(0, 4).join(" / ");

  headerRoot.innerHTML = `
    <article class="memo-title-block">
      <a class="breadcrumb-link" href="../portfolio.html">Back to Build Index</a>
      <div class="memo-title-grid">
        <div>
          <p class="field-label">Design Review Memo</p>
          <h1>${escapeHtml(activeProject.title)}</h1>
          <p class="memo-subtitle">${escapeHtml(activeProject.subtitle || "")}</p>
          <p class="memo-summary">${escapeHtml(activeProject.summary || "")}</p>
          ${tagList}
        </div>
        <aside class="memo-header-facts" aria-label="Project facts">
          <dl>
            <div>
              <dt>Year</dt>
              <dd>${escapeHtml(activeProject.year || "Current")}</dd>
            </div>
            <div>
              <dt>Status</dt>
              <dd>${escapeHtml(activeProject.status || "Project work")}</dd>
            </div>
            <div>
              <dt>Domain</dt>
              <dd>${escapeHtml(asArray(activeProject.tags).slice(0, 3).join(" / ") || activeProject.projectType || "Project")}</dd>
            </div>
            <div>
              <dt>Tools</dt>
              <dd>${escapeHtml(toolSummary || "Project tools")}</dd>
            </div>
          </dl>
        </aside>
      </div>
      ${topLinks}
    </article>
  `;
}

function renderContent(activeProject, evidenceItems) {
  if (!contentRoot) {
    return;
  }

  contentRoot.className = "memo-content";
  contentRoot.innerHTML = `
    ${renderMemoSection("01", "Brief", renderParagraphs(activeProject.overview, activeProject.summary))}
    ${renderMemoSection("02", "Engineering Problem", renderParagraphs(activeProject.problem))}
    ${renderMemoSection("03", "My Contribution", renderList(activeProject.role))}
    ${renderMemoSection("04", "Design Process", renderProcessList(activeProject.process))}
    ${renderMemoSection("05", "Technical Decisions", renderDecisionList(activeProject.technicalHighlights))}
    ${renderMemoSection("06", "Build / Prototype Evidence", renderEvidenceGrid(activeProject, evidenceItems))}
    ${renderMemoSection("07", "Outcome", renderParagraphs([activeProject.outcome, activeProject.relevance]))}
    ${renderMemoSection(
      "08",
      "Lessons / Next Development",
      `${renderList(activeProject.lessonsLearned)}${renderList(activeProject.futureWork, "Next development")}`
    )}
  `;
}

function renderMemoSection(number, title, bodyMarkup) {
  if (!bodyMarkup?.trim()) {
    return "";
  }

  return `
    <section class="memo-section">
      <div class="memo-section-heading">
        <span>${number}</span>
        <h2>${escapeHtml(title)}</h2>
      </div>
      <div class="memo-section-body">
        ${bodyMarkup}
      </div>
    </section>
  `;
}

function renderParagraphs(items, fallback = "") {
  const paragraphs = asArray(items).length ? asArray(items) : asArray([fallback]);

  return paragraphs
    .filter(Boolean)
    .map((paragraph) => `<p>${escapeHtml(paragraph)}</p>`)
    .join("");
}

function renderList(items, label = "") {
  const values = asArray(items);

  if (!values.length) {
    return "";
  }

  return `
    ${label ? `<p class="memo-list-label">${escapeHtml(label)}</p>` : ""}
    <ul class="memo-list">
      ${values.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}
    </ul>
  `;
}

function renderProcessList(items) {
  const steps = asArray(items);

  if (!steps.length) {
    return "";
  }

  return `
    <ol class="memo-process-list">
      ${steps
        .map(
          (step) => `
            <li>
              <div class="memo-process-step">
                <h3>${escapeHtml(step.title || "Process step")}</h3>
                <p>${escapeHtml(step.body || "")}</p>
              </div>
            </li>
          `
        )
        .join("")}
    </ol>
  `;
}

function renderDecisionList(items) {
  const decisions = asArray(items);

  if (!decisions.length) {
    return "";
  }

  return `
    <div class="memo-decision-grid">
      ${decisions
        .map(
          (decision) => `
            <article>
              <h3>${escapeHtml(decision.title || "Technical decision")}</h3>
              <p>${escapeHtml(decision.body || "")}</p>
            </article>
          `
        )
        .join("")}
    </div>
  `;
}

function renderEvidenceGrid(activeProject, evidenceItems) {
  if (!evidenceItems.length) {
    return "<p>Selected visual evidence is not currently published for this project.</p>";
  }

  const maxVisiblePlates = 12;
  const visibleEvidenceItems = evidenceItems.slice(0, maxVisiblePlates);
  const hiddenEvidenceCount = evidenceItems.length - visibleEvidenceItems.length;

  return `
    <p class="memo-evidence-note">
      Selected visual evidence from the public project record. Images are shown as figure plates so CAD screenshots, diagrams, drawings, and build photos remain inspectable.
    </p>
    <div class="evidence-plate-grid">
      ${visibleEvidenceItems
        .map((item, index) => renderEvidencePlate(activeProject, item, index))
        .join("")}
    </div>
    ${
      hiddenEvidenceCount > 0
        ? `<p class="memo-evidence-archive-note">Additional project media is retained in the source archive.</p>`
        : ""
    }
  `;
}

function renderEvidencePlate(activeProject, item, index) {
  const plateNumber = String(index + 1).padStart(2, "0");
  const fallbackCaption = `${activeProject.title} evidence ${plateNumber}`;
  const caption = cleanupCaption(item.caption || item.alt, fallbackCaption);
  const src = resolveProjectAsset(item.src);
  const media =
    item.type === "video"
      ? `<video controls preload="metadata"><source src="${src}" type="video/mp4" />Your browser does not support embedded video.</video>`
      : `<img src="${src}" alt="${escapeHtml(item.alt || caption)}" loading="lazy" />`;

  return `
    <figure class="evidence-plate">
      <div class="evidence-media">
        ${media}
      </div>
      <figcaption>
        <span>Fig. ${plateNumber}</span>
        ${escapeHtml(caption)}
      </figcaption>
    </figure>
  `;
}

function renderSidebar(activeProject) {
  if (!sidebarRoot) {
    return;
  }

  const tools = createInlineList(asArray(activeProject.tools), "memo-tool-list");
  const tags = createInlineList(asArray(activeProject.tags), "memo-tag-list compact");

  sidebarRoot.innerHTML = `
    <aside class="memo-sidebar">
      <section class="memo-spec-card">
        <p class="field-label">Project Facts</p>
        <dl class="memo-spec-table">
          <div>
            <dt>Year</dt>
            <dd>${escapeHtml(activeProject.year || "Current")}</dd>
          </div>
          <div>
            <dt>Status</dt>
            <dd>${escapeHtml(activeProject.status || "Project work")}</dd>
          </div>
          <div>
            <dt>Type</dt>
            <dd>${escapeHtml(activeProject.projectType || "Project")}</dd>
          </div>
        </dl>
      </section>

      ${
        tools
          ? `
            <section class="memo-spec-card">
              <p class="field-label">Tools</p>
              ${tools}
            </section>
          `
          : ""
      }

      ${
        tags
          ? `
            <section class="memo-spec-card">
              <p class="field-label">Tags</p>
              ${tags}
            </section>
          `
          : ""
      }

      <section class="memo-spec-card">
        <p class="field-label">Archive Navigation</p>
        <div class="memo-sidebar-links">
          <a href="../portfolio.html">Build Index</a>
          <a href="../experience.html">Experience</a>
          <a href="../contact.html">Contact</a>
        </div>
      </section>
    </aside>
  `;
}

function renderRelated(activeProject) {
  if (!relatedRoot) {
    return;
  }

  const relatedProjects = asArray(activeProject.relatedProjects)
    .map((relatedSlug) => projects.find((item) => item.slug === relatedSlug))
    .filter(Boolean);

  if (!relatedProjects.length) {
    relatedRoot.innerHTML = "";
    return;
  }

  relatedRoot.innerHTML = `
    <section class="memo-related-section">
      <div class="memo-section-heading">
        <span>REF</span>
        <h2>Related Field Notes</h2>
      </div>
      <ul class="memo-related-list">
        ${relatedProjects
          .map(
            (relatedProject) => `
              <li>
                <a href="../projects/${encodeURIComponent(relatedProject.slug)}.html">
                  <span>${escapeHtml(relatedProject.year || "Project")}</span>
                  <strong>${escapeHtml(relatedProject.title)}</strong>
                  <em>${escapeHtml(asArray(relatedProject.tags).slice(0, 2).join(" / ") || relatedProject.projectType || "Project")}</em>
                </a>
              </li>
            `
          )
          .join("")}
      </ul>
    </section>
  `;
}

function createProjectLinks(links, options = {}) {
  const { compact = true } = options;
  const linkEntries = Object.entries(projectLinkLabels)
    .map(([key, label]) => ({ key, label, href: links?.[key] }))
    .filter((entry) => Boolean(entry.href));

  if (!linkEntries.length) {
    return "";
  }

  return `
    <div class="${compact ? "memo-resource-links compact" : "memo-resource-links"}">
      ${linkEntries
        .map(
          (entry) => `
            <a href="${resolveProjectAsset(entry.href)}" target="_blank" rel="noreferrer">
              ${escapeHtml(entry.label)}
            </a>
          `
        )
        .join("")}
    </div>
  `;
}

function createInlineList(items, className) {
  const values = asArray(items);

  if (!values.length) {
    return "";
  }

  return `
    <ul class="${className}">
      ${values.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}
    </ul>
  `;
}
