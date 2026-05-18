# Nhan Dang Mechanical Engineering Portfolio

Static GitHub Pages site for Nhan Dang's mechanical engineering portfolio: CAD-led design, robot hardware, prototyping, fabrication, sensing integration, testing, additive manufacturing, and product-style mechanical systems.

The site is structured as a public mechanical engineering portfolio. Project content, contact surfaces, and linked documents are kept privacy-reviewed for public viewing.

## Tech Stack

- Static `HTML`, `CSS`, and `JavaScript`
- Data-driven project and profile content
- No backend
- No build step
- GitHub Pages compatible

## Site Structure

- `index.html` - Homepage
- `portfolio.html` - Projects
- `experience.html` - Experience
- `contact.html` - Contact
- `projects/*.html` - Static project page shells
- `assets/css/styles.css` - Global portfolio visual system
- `assets/js/*.js` - Page rendering and shared site chrome
- `data/site.js` - Profile, contact, education, experience, and focus-area content
- `data/projects.js` - Public project records and page content
- `data/repo-images.js` - Optional imported project image catalog

## Current Public Project Count

The public project register is data-driven from `data/projects.js` and currently contains 15 projects.

Priority project records include:

- Cobot Prototyping Platform
- Confined-Space Inspection Robot
- UTS Motorsports Autonomous Hardware
- Additive Manufacturing Plier Project
- Warman Challenge Robot
- PCM Helmet Cooling System

## Editing Profile And Contact

Edit `data/site.js` for:

- name, initials, role, degree, and tagline
- profile image paths
- focus areas and technical toolkit descriptions
- education and applied experience entries
- public email, if one should be shown
- GitHub and LinkedIn links
- thumbnail/brand image paths

Leave unavailable or private URLs blank. The site scripts hide missing contact routes instead of showing placeholder links.

## Editing Projects

1. Update project records in `data/projects.js`.
2. Keep each `slug` aligned with `projects/<slug>.html`.
3. Only add public-safe URLs in project `links`.
4. Add image paths in `thumbnail`, `heroImage`, and/or `gallery` when project images are approved for public use.
5. Keep private reports, transcripts, referee details, recommendation letters, and raw sensitive files out of public links.

## Project Images

Project images are selected at runtime from:

1. `thumbnail`
2. `heroImage`
3. `gallery[].src`
4. `data/repo-images.js` entries for that project slug

If no image is configured, the page shows the existing empty media state.

## GitHub Pages Deploy

1. Push to `main`.
2. Open repository Settings -> Pages.
3. Source: `Deploy from branch`.
4. Branch: `main`, folder: `/ (root)`.

No extra tooling is required.

## Copyright

Copyright © 2026 Nhan Dang. All rights reserved.

Portfolio source and content are not licensed for reuse.
