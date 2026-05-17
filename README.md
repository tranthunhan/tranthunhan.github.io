# Nhan Dang Portfolio

Static GitHub Pages portfolio for Nhan Dang's mechanical engineering project work across CAD-led design, robot hardware, prototyping, sensing integration, testing, additive manufacturing, and product-style mechanical systems.

The site is being rebuilt as a public mechanical engineering portfolio for Nhan Dang, with project content, contact surfaces, and documentation reviewed for ownership and privacy.

## Tech Stack

- Static `HTML`, `CSS`, `JavaScript`
- No backend
- No build step
- GitHub Pages compatible

## Site Structure

- `index.html` - Home
- `portfolio.html` - Project archive
- `experience.html` - Experience page
- `contact.html` - Contact page
- `projects/*.html` - Project case-study page shells
- `assets/css/styles.css` - Global styles
- `assets/js/*.js` - Page scripts and shared UI logic
- `data/site.js` - Profile, contact, education, experience, and focus-area content
- `data/projects.js` - Project case-study content and optional links
- `data/repo-images.js` - Optional imported project image catalog

## Current Content

The portfolio currently prioritises case-study entries for:

- Kinematic Puppet / Cobot Prototyping End Effector
- Confined-Space Inspection Robot
- UTS Motorsports Autonomous Vehicle Components
- Additive Manufacturing Plier Project
- Warman Challenge Robot
- PCM Helmet Cooling System

## Editing Profile And Contact

Edit `data/site.js` for:

- name, initials, role, degree, and tagline
- profile image paths
- focus areas and skill descriptions
- education and experience timeline entries
- contact email, map embed URL, and social/profile links
- GitHub and LinkedIn links
- profile image and thumbnail/brand image paths

If GitHub, LinkedIn, CV, email, or other public URLs are not available yet, leave those values blank. The site scripts hide those buttons or sections cleanly instead of showing placeholder links.

## Editing Projects

1. Update or create a project in `data/projects.js`.
2. Keep `slug` aligned with `projects/<slug>.html`.
3. Only add real URLs in `links` (`repo`, `cad`, `drawings`, `print`, `docs`, `media`).
4. Use `projectType` as `Solo` or `Project` so the archive filter works.
5. Add image paths in `thumbnail`, `heroImage`, and/or `gallery` when project images are available.

## Project Images

Project card thumbnails are selected at runtime from:

1. `thumbnail`
2. `heroImage`
3. `gallery[].src`
4. `data/repo-images.js` entries for that project slug

If no image is configured, the card and case-study page show the existing empty media state.

## GitHub Pages Deploy

1. Push to `main`.
2. Open repository Settings -> Pages.
3. Source: `Deploy from branch`.
4. Branch: `main`, folder: `/ (root)`.

No extra tooling is required.
