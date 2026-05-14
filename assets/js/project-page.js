import { siteProfile } from "../../data/site.js";
import {
  getProjectBySlug,
  projectLinkLabels,
  projects
} from "../../data/projects.js";
import { repoImages } from "../../data/repo-images.js";
import { initClickSpark } from "./click-spark.js";
import { initSiteDock } from "./dock.js";
import { initLogoLoop } from "./logo-loop.js";
import {
  createProjectCard,
  createResourceButtons,
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

const slug = document.body.dataset.projectSlug;
const project = getProjectBySlug(slug);

const headerRoot = document.getElementById("project-header");
const galleryRoot = document.getElementById("project-gallery");
const contentRoot = document.getElementById("project-content");
const sidebarRoot = document.getElementById("project-sidebar");
const relatedRoot = document.getElementById("related-projects");

if (!project) {
  document.title = `Project Not Found | ${siteProfile.name}`;
  headerRoot.innerHTML = `
    <article class="empty-state">
      <h1>Project not found</h1>
      <p>This page is missing a matching entry in <code>data/projects.js</code>.</p>
      <a class="button" href="../portfolio.html">Back to project archive</a>
    </article>
  `;
} else {
  document.title = `${project.title} | ${siteProfile.name}`;
  renderProjectPage(project);
  populateSharedProfile(siteProfile);
  initRevealAnimations();
}

function removeFileType(text) {
  return text.replace(/\.(png|jpe?g|gif|webp|bmp|tiff?)$/i, "");
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
  if (!noType) {
    return fallback;
  }

  return noType.charAt(0).toUpperCase() + noType.slice(1);
}

function resolveProjectAsset(path) {
  const resolved = resolveImagePath(path, "../");
  return resolved;
}

function buildCaseStudyUrl(slug) {
  const configuredBase = siteProfile.links?.website || "";
  const liveOrigin =
    window.location.origin && window.location.origin !== "null"
      ? window.location.origin
      : "";
  const base = configuredBase || liveOrigin;
  if (!base) {
    return `projects/${slug}.html`;
  }
  return `${base.replace(/\/+$/, "")}/projects/${slug}.html`;
}

function uniqueBySource(items) {
  return items.filter(
    (item, index, allItems) =>
      index === allItems.findIndex((candidate) => candidate.src === item.src)
  );
}

function collectProjectGalleryItems(activeProject) {
  const seedItems = [];

  if (activeProject.heroImage) {
    seedItems.push({
      src: activeProject.heroImage,
      alt: `${activeProject.title} hero image`,
      caption: `${activeProject.title} hero image`
    });
  }

  if (activeProject.thumbnail) {
    seedItems.push({
      src: activeProject.thumbnail,
      alt: `${activeProject.title} thumbnail`,
      caption: `${activeProject.title} thumbnail`
    });
  }

  const customGallery = (activeProject.gallery || []).filter((item) => item?.src);
  const importedGallery = (repoImages[activeProject.slug] || []).filter(
    (item) => item?.src
  );

  return uniqueBySource([...seedItems, ...customGallery, ...importedGallery]);
}

function renderProjectPage(activeProject) {
  const galleryItems = collectProjectGalleryItems(activeProject);
  const heroItem = galleryItems[0] || null;

  headerRoot.innerHTML = "";

  const intro = document.createElement("article");
  intro.className = "project-hero reveal";

  const repoButton = activeProject.links?.repo
    ? `<a class="button button-repo-primary" href="${activeProject.links.repo}" target="_blank" rel="noreferrer">Open GitHub Repository</a>`
    : "";

  intro.innerHTML = `
    <a class="breadcrumb-link" href="../portfolio.html">Back to Project Archive</a>
    <div class="project-hero-grid">
      <div class="project-hero-copy">
        <p class="eyebrow">${activeProject.year} / ${activeProject.status}</p>
        <h1>${activeProject.title}</h1>
        <p class="project-subtitle">${activeProject.subtitle}</p>
        <p class="project-summary">${activeProject.summary}</p>
        <ul class="tag-list">${activeProject.tags.map((tag) => `<li>${tag}</li>`).join("")}</ul>
        <div class="project-priority-row">${repoButton}</div>
        <div class="project-action-row"></div>
      </div>
      ${
        heroItem
          ? `<figure class="project-hero-media"><img src="${resolveProjectAsset(
              heroItem.src
            )}" alt="${heroItem.alt || `${activeProject.title} image`}" /></figure>`
          : `<figure class="project-hero-media is-empty" aria-hidden="true"></figure>`
      }
    </div>
  `;

  const nonRepoLabels = Object.fromEntries(
    Object.entries(projectLinkLabels).filter(([key]) => key !== "repo")
  );
  if (!activeProject.links?.repo) {
    intro.querySelector(".project-priority-row")?.remove();
  }
  const actionRow = intro.querySelector(".project-action-row");
  const topResourceButtons = createResourceButtons(activeProject.links, nonRepoLabels);
  if (topResourceButtons.childElementCount > 0) {
    actionRow.appendChild(topResourceButtons);
  } else {
    actionRow.remove();
  }
  headerRoot.appendChild(intro);

  renderGallery(activeProject, galleryItems);
  renderContent(activeProject);
  renderSidebar(activeProject);
  renderRelated(activeProject);
}

function renderGallery(activeProject, galleryItems) {
  if (!galleryItems.length) {
    galleryRoot.innerHTML = "";
    return;
  }

  galleryRoot.innerHTML = `
    <div class="section-heading reveal">
      <p class="eyebrow">Gallery</p>
      <h2>Visual record of the design, analysis, and iteration process.</h2>
    </div>
    <article class="gallery-carousel reveal" aria-label="Project image carousel">
      <button class="gallery-nav-btn prev" type="button" aria-label="Previous image">
        &#8249;
      </button>
      <figure class="gallery-stage">
        <img id="gallery-active-image" src="" alt="" />
        <figcaption id="gallery-active-caption"></figcaption>
      </figure>
      <button class="gallery-nav-btn next" type="button" aria-label="Next image">
        &#8250;
      </button>
    </article>
    <div class="gallery-meta-row reveal">
      <p class="gallery-counter" id="gallery-counter"></p>
      <div class="gallery-dot-row" id="gallery-dot-row"></div>
    </div>
  `;

  const imageEl = document.getElementById("gallery-active-image");
  const captionEl = document.getElementById("gallery-active-caption");
  const counterEl = document.getElementById("gallery-counter");
  const dotRow = document.getElementById("gallery-dot-row");
  const prevButton = galleryRoot.querySelector(".gallery-nav-btn.prev");
  const nextButton = galleryRoot.querySelector(".gallery-nav-btn.next");

  let currentIndex = 0;

  const dotButtons = galleryItems.map((item, index) => {
    const dot = document.createElement("button");
    dot.type = "button";
    dot.className = "gallery-dot";
    dot.setAttribute("aria-label", `Go to image ${index + 1}`);
    dot.addEventListener("click", () => {
      currentIndex = index;
      syncActiveImage();
    });
    dotRow.appendChild(dot);
    return dot;
  });

  const syncActiveImage = () => {
    const activeItem = galleryItems[currentIndex];
    const fallbackCaption = `${activeProject.title} image ${currentIndex + 1}`;
    imageEl.src = resolveProjectAsset(activeItem.src);
    imageEl.alt = activeItem.alt || fallbackCaption;
    captionEl.textContent = cleanupCaption(
      activeItem.caption || activeItem.alt,
      fallbackCaption
    );
    counterEl.textContent = `${currentIndex + 1} / ${galleryItems.length}`;

    dotButtons.forEach((dot, dotIndex) => {
      const active = dotIndex === currentIndex;
      dot.classList.toggle("is-active", active);
      dot.setAttribute("aria-pressed", String(active));
    });
  };

  const stepImage = (direction) => {
    currentIndex =
      (currentIndex + direction + galleryItems.length) % galleryItems.length;
    syncActiveImage();
  };

  prevButton.addEventListener("click", () => stepImage(-1));
  nextButton.addEventListener("click", () => stepImage(1));

  if (galleryItems.length <= 1) {
    prevButton.hidden = true;
    nextButton.hidden = true;
  }

  document.addEventListener("keydown", (event) => {
    const tag = document.activeElement?.tagName?.toLowerCase();
    if (tag === "input" || tag === "textarea") {
      return;
    }

    if (event.key === "ArrowLeft") {
      stepImage(-1);
    }
    if (event.key === "ArrowRight") {
      stepImage(1);
    }
  });

  syncActiveImage();
}

function renderContent(activeProject) {
  const resourceButtons = createResourceButtons(activeProject.links, projectLinkLabels);
  const resourceSection =
    resourceButtons.childElementCount > 0
      ? `
    <section class="content-section reveal">
      <p class="eyebrow">Files And Resources</p>
      <h2>Direct links back to the source material</h2>
      <p>Use these links to move from the polished case study back into available repositories, CAD folders, documentation, fabrication files, and media.</p>
      <div id="main-resource-buttons"></div>
    </section>
  `
      : "";

  contentRoot.innerHTML = `
    <section class="content-section reveal">
      <p class="eyebrow">Overview</p>
      <h2>Project overview</h2>
      ${activeProject.overview.map((paragraph) => `<p>${paragraph}</p>`).join("")}
    </section>

    <section class="content-section reveal">
      <p class="eyebrow">Motivation / Problem</p>
      <h2>What problem this project was trying to solve</h2>
      ${activeProject.problem.map((paragraph) => `<p>${paragraph}</p>`).join("")}
    </section>

    <section class="content-section reveal">
      <p class="eyebrow">Role And Contributions</p>
      <h2>My role in the work</h2>
      <ul class="content-list">
        ${activeProject.role.map((item) => `<li>${item}</li>`).join("")}
      </ul>
    </section>

    <section class="content-section reveal">
      <p class="eyebrow">Engineering Process</p>
      <h2>How the design evolved</h2>
      <div class="process-grid">
        ${activeProject.process
          .map(
            (step) => `
              <article class="process-card">
                <h3>${step.title}</h3>
                <p>${step.body}</p>
              </article>
            `
          )
          .join("")}
      </div>
    </section>

    <section class="content-section reveal">
      <p class="eyebrow">Technical Highlights</p>
      <h2>Key technical challenges</h2>
      <div class="highlight-grid">
        ${activeProject.technicalHighlights
          .map(
            (highlight) => `
              <article class="highlight-card">
                <h3>${highlight.title}</h3>
                <p>${highlight.body}</p>
              </article>
            `
          )
          .join("")}
      </div>
    </section>

    ${resourceSection}

    ${
      activeProject.outcome
        ? `
    <section class="content-section reveal">
      <p class="eyebrow">Outcome / Current Status</p>
      <h2>What this work produced</h2>
      <p>${activeProject.outcome}</p>
    </section>
  `
        : ""
    }

    ${
      activeProject.relevance
        ? `
    <section class="content-section reveal">
      <p class="eyebrow">Robotics Relevance</p>
      <h2>Why it matters for my research direction</h2>
      <p>${activeProject.relevance}</p>
    </section>
  `
        : ""
    }

    <section class="content-section reveal">
      <p class="eyebrow">Lessons Learned</p>
      <h2>What changed after iteration and review</h2>
      <ul class="content-list">
        ${activeProject.lessonsLearned.map((item) => `<li>${item}</li>`).join("")}
      </ul>
    </section>

    <section class="content-section reveal">
      <p class="eyebrow">Future Work</p>
      <h2>Next directions</h2>
      <ul class="content-list">
        ${activeProject.futureWork.map((item) => `<li>${item}</li>`).join("")}
      </ul>
    </section>
  `;

  const mainResourceButtons = document.getElementById("main-resource-buttons");
  if (mainResourceButtons) {
    mainResourceButtons.appendChild(resourceButtons);
  }
}

function renderSidebar(activeProject) {
  const caseStudyUrl = buildCaseStudyUrl(activeProject.slug);
  const tools = activeProject.tools
    .map((tool) => `<li class="tool-chip">${tool}</li>`)
    .join("");
  const githubProfileLink = siteProfile.links?.github
    ? `<a class="text-link" data-profile-link="github" href="${siteProfile.links.github}">Open GitHub profile</a>`
    : "";

  sidebarRoot.innerHTML = `
    <div class="sidebar-stack reveal">
      <section class="sidebar-card">
        <p class="mono-label">Project Snapshot</p>
        <dl class="meta-list">
          <div>
            <dt>Year</dt>
            <dd>${activeProject.year}</dd>
          </div>
          <div>
            <dt>Status</dt>
            <dd>${activeProject.status}</dd>
          </div>
          <div>
            <dt>Case study URL</dt>
            <dd>
              <a class="text-link case-study-link" href="${caseStudyUrl}" target="_blank" rel="noreferrer">
                ${caseStudyUrl}
              </a>
            </dd>
          </div>
        </dl>
      </section>

      <section class="sidebar-card">
        <p class="mono-label">Tools And Software</p>
        <ul class="tool-list">${tools}</ul>
      </section>

      <section class="sidebar-card">
        <p class="mono-label">Archive Navigation</p>
        <div class="sidebar-links">
          <a class="text-link" href="../portfolio.html">Back to all projects</a>
          ${githubProfileLink}
          <a class="text-link" href="../experience.html">Open experience page</a>
        </div>
      </section>
    </div>
  `;
}

function renderRelated(activeProject) {
  const relatedProjects = activeProject.relatedProjects
    .map((relatedSlug) => projects.find((item) => item.slug === relatedSlug))
    .filter(Boolean);

  relatedRoot.innerHTML = `
    <div class="section-heading reveal">
      <p class="eyebrow">Related Projects</p>
      <h2>Other projects connected by mechanisms, testing, or robotics workflow.</h2>
    </div>
  `;

  const grid = document.createElement("div");
  grid.className = "related-grid";

  relatedProjects.forEach((relatedProject) => {
    grid.appendChild(
      createProjectCard(relatedProject, {
        compact: true,
        hrefPrefix: "../",
        showSummary: false
      })
    );
  });

  relatedRoot.appendChild(grid);
}
