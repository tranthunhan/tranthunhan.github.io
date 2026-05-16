# Website Update Summary

Updated: 2026-05-16

## What Changed

- Replaced the Vertical Axis Wind Turbine "View Demo / Video" button target with the YouTube demo link: `https://youtu.be/HkvrupotTRQ`.
- Fixed project resource-button path resolution so local document/drawing links on project pages resolve from `projects/` back to the site root correctly.
- Audited and simplified the top rotating header badge strip in `assets/js/logo-loop.js`.
- Replaced the old 12-badge strip with 11 concise identity badges: SolidWorks, Fusion 360, MATLAB, ANSYS, Arduino, Raspberry Pi, 3D Printing, Mechanical Design, Prototyping, Additive Manufacturing, and GitHub.
- Removed Python, C++, ROS, and Blender from the top strip so the header remains a compact identity marker; those skills remain in the Technical Toolkit where appropriate.
- Converted the top strip badges from outbound image links into non-clickable display badges, avoiding fake or low-value header links.
- Renamed the first Technical Toolkit group from "Core Engineering Tools" to "Core Engineering" and normalized "PCB Design" casing.
- Polished the Experience page certification cards with consistent certificate thumbnails, compact actions, and tighter card spacing.
- Rendered four PDF certificate first pages into web-ready JPG thumbnails under `assets/images/certifications/`.
- Simplified the Technical Stack into a compact Technical Toolkit style using grouped chips and clearer core/developing labels.
- Added the Homemade Power Supply YouTube demo link: `https://youtu.be/cSNLx7lfT18`.
- Added six certifications/recognitions to the Experience page certification section.
- Copied certification PDFs into `assets/docs/certifications/` and badge images into `assets/images/certifications/`.
- Checked the Homemade Power Supply demo video. It was not copied because no local conversion tool was available and the source is a 20 MB `.MOV`.
- Rebuilt the portfolio around 17 separate project pages.
- Regenerated project media into web-ready folders under `assets/images/projects/`, `assets/docs/projects/`, and `assets/videos/projects/`.
- Added richer galleries from direct images, converted HEIC photos, and extracted Word/PowerPoint media where practical.
- Kept Confined-Space Inspection Robot raw CAD out of the website repo while using CAD screenshots/renders/previews and new photos.
- Preserved the ACC article link for the Kinematic Puppet project.
- Kept the professional categorized tech stack in `data/site.js`.

## Project Structure

| Project | Images | Videos | Docs | Page |
| --- | --- | --- | --- | --- |
| Kinematic Puppet / Cobot Prototyping | 15 | 0 | 0 | projects/kinematic-puppet-cobotics.html |
| Confined-Space Inspection Robot | 36 | 0 | 1 | projects/confined-space-inspection-robot.html |
| UTS Motorsports Autonomous Hardware CAD | 2 | 0 | 0 | projects/uts-motorsports-autonomous.html |
| Warman Challenge Robot | 32 | 0 | 0 | projects/warman-challenge-robot.html |
| Reverse Engineering LEGO 4x2 Brick | 0 | 0 | 0 | projects/reverse-engineering-lego-brick.html |
| Additive Manufacturing Plier Project | 25 | 0 | 0 | projects/additive-manufacturing-plier-project.html |
| Collapsible Solar BBQ | 14 | 0 | 2 | projects/solar-bbq.html |
| PCM Helmet Cooling System | 19 | 0 | 1 | projects/pcm-helmet-cooling-system.html |
| Space Mission Louver System | 20 | 0 | 1 | projects/space-mission-louver-system.html |
| Heat Exchanger Design | 8 | 0 | 1 | projects/heat-exchanger-design.html |
| Vertical Axis Wind Turbine | 9 | 1 | 1 | projects/vertical-axis-wind-turbine.html |
| Wind-Powered Vehicle | 8 | 0 | 1 | projects/wind-powered-vehicle.html |
| MPR Rocket | 0 | 0 | 0 | projects/mpr-rocket.html |
| 3D Printed Pencil Case / Servo Storage Case | 4 | 0 | 0 | projects/printed-pencil-case-servo-storage.html |
| Homemade Power Supply | 2 | 0 | 0 | projects/homemade-power-supply.html |
| Audio Amplifier | 2 | 0 | 0 | projects/audio-amplifier.html |
| Interlocking Mechanism CAD Design | 0 | 0 | 0 | projects/interlocking-mechanism-cad-design.html |

## Media Totals

- Images copied/converted: 196
- PDFs copied: 10
- Videos copied: 1
- Skipped/manual-review records: 553

Certification media added:

- PDFs copied: 6
- Badge images copied: 2
- PDF certificate thumbnails rendered: 4
- Official verification links added: 3

Homemade Power Supply video:

- `homemade-power-supply-demo.mp4.MOV` was skipped and recorded for compression or YouTube upload later.
- The project now uses the YouTube demo link instead: `https://youtu.be/cSNLx7lfT18`.

Vertical Axis Wind Turbine video:

- The broken local demo/video button was replaced with `https://youtu.be/HkvrupotTRQ`.
- The local MP4 remains in the gallery where the file exists, but the public demo/resource button now uses YouTube.

## Notes

- Reverse Engineering LEGO, MPR Rocket, and Interlocking Mechanism are included as separate pages but need manual screenshot/render export from source files.
- Large videos were not copied; they are listed in `WEBSITE_MEDIA_SKIPPED_FOR_SIZE_OR_REVIEW.md`.
- Raw CAD is intended for future GitHub repos, not the website assets folder.

## Final Verification

- Homepage, portfolio page, experience page, contact page, and all 17 project pages loaded in local checks.
- Certification section rendered with 6 certification/recognition cards.
- Certification PDFs/images and copied website media loaded successfully.
- Official MATLAB, Simulink, Credly, Homemade Power Supply YouTube, Vertical Axis Wind Turbine YouTube, and ACC article links returned successful responses.
- No blank links, fake project buttons, raw CAD/source file extensions, or old external-profile references were found.

## Top Badge Strip Audit

Defined in `assets/js/logo-loop.js` and injected by `initLogoLoop()` into the shared header navigation on each page.

Old badge list and decision:

| Badge | Decision | Reason |
| --- | --- | --- |
| SolidWorks | Keep | Core CAD identity marker |
| MATLAB | Keep | Relevant engineering/software certificate and analysis tool |
| ANSYS | Keep | Relevant simulation/analysis tool |
| Fusion 360 | Keep | Relevant CAD/design tool |
| Arduino | Keep | Relevant prototyping/embedded marker |
| Raspberry Pi | Keep | Relevant mechatronics/robotics marker |
| 3D Printing | Keep but rename | Standardized capitalization to "3D Printing" |
| Python | Move to Technical Toolkit only | Useful but not central enough for the top identity strip |
| C++ | Move to Technical Toolkit only | Useful but better kept in Programming & Data |
| GitHub | Keep | Relevant publishing/version-control marker |
| ROS | Move to Technical Toolkit only | Developing skill, better shown in the developing category |
| Blender | Move to Technical Toolkit only | Useful documentation/design tool, not a top identity marker |

New badge list:

- SolidWorks
- Fusion 360
- MATLAB
- ANSYS
- Arduino
- Raspberry Pi
- 3D Printing
- Mechanical Design
- Prototyping
- Additive Manufacturing
- GitHub
