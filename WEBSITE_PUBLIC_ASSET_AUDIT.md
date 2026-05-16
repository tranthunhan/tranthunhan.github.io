# Website Public Asset Audit

Audit date: 2026-05-16

Scope:
- Website repo: `C:\Users\Nhan\Documents\nhan-portfolio\tranthunhan.github.io`
- Organised archive was used for context only. No archive files were moved, deleted, renamed, or modified.

## Summary

The website repo currently contains web-ready display assets only for project media and profile media. No raw CAD, source engineering files, reports, assessment submissions, handover documents, meeting notes, specifications, ZIP archives, Office documents, PDFs, HEIC files, or intentionally published video files were found in the website repo.

## Files Kept

Project display assets kept in `assets/images/projects/`:

### Kinematic Puppet / Cobot Prototyping

- `assets/images/projects/kinematic-puppet/system-diagram.png`
- `assets/images/projects/kinematic-puppet/two-finger-gripper.png`
- `assets/images/projects/kinematic-puppet/claw-end-effector.jpg`
- `assets/images/projects/kinematic-puppet/hook-end-effector.jpg`
- `assets/images/projects/kinematic-puppet/magnet-end-effector.jpg`
- `assets/images/projects/kinematic-puppet/hex-base-concept.png`
- `assets/images/projects/kinematic-puppet/revolving-gear-concept.png`

### Confined-Space Inspection Robot

- `assets/images/projects/confined-space-robot/wheel-cad-screenshot.png`
- `assets/images/projects/confined-space-robot/controller-packaging-screenshot.png`
- `assets/images/projects/confined-space-robot/motor-bracket-screenshot-01.png`
- `assets/images/projects/confined-space-robot/motor-bracket-screenshot-02.png`
- `assets/images/projects/confined-space-robot/motor-driver-lower.png`
- `assets/images/projects/confined-space-robot/motor-driver-upper.png`
- `assets/images/projects/confined-space-robot/raspberry-pi-render.png`

### UTS Motorsports Autonomous

- `assets/images/projects/uts-motorsports-autonomous/percy-template-01.png`
- `assets/images/projects/uts-motorsports-autonomous/percy-template-02.png`

### Warman Challenge Robot

- `assets/images/projects/warman-challenge/ball-retainer-right-isometric.png`
- `assets/images/projects/warman-challenge/ball-retainer-left-assembly.png`
- `assets/images/projects/warman-challenge/ball-retainer-sheetmetal.png`
- `assets/images/projects/warman-challenge/track-assembly-exploded.png`
- `assets/images/projects/warman-challenge/deposit-mechanism-assembly.png`
- `assets/images/projects/warman-challenge/prototype-test-photo-01.jpg`

### Additive Manufacturing LEGO / Pliers

- `assets/images/projects/additive-manufacturing/plier-concept-sketch-01.jpg`
- `assets/images/projects/additive-manufacturing/plier-mesh-before-topology.png`
- `assets/images/projects/additive-manufacturing/plier-mesh-after-topology.png`
- `assets/images/projects/additive-manufacturing/plier-final-cad-isometric.png`
- `assets/images/projects/additive-manufacturing/plier-slicer-result.png`

Profile, favicon, and social preview images kept:

- `assets/images/profile/nhan-profile.png`
- `assets/images/profile/thumbnail.png`

## Files Removed From Website Repo

None. The repo scan did not find any raw/source/private files requiring removal.

## Files Needing Manual Review

No current website files require manual review before publishing based on file type or filename.

Recommended content review before publishing:
- Read the project summaries once for tone and accuracy.
- Confirm the visible prototype photo in `assets/images/projects/warman-challenge/prototype-test-photo-01.jpg` is acceptable for public portfolio use.
- Confirm the two UTS Motorsports Percy template visuals are the intended public-facing assets.

## Broken Or Missing Images

None found during verification. All project images referenced by `data/projects.js` are present in the repo and load through the local preview server.

## Project Pages Needing Better Screenshots/Renders Later

- `portable-solar-bbq`: currently text-first because no clean public-safe renders/photos were copied.
- `personal-engineering-projects`: currently text-first because raw CAD/docs were not copied; needs clean exported renders/photos.
- `uts-motorsports-autonomous-vehicle-components`: usable now, but would benefit from more clean CAD renders or fabrication visuals from approved files.
- `additive-manufacturing-lego-puzzle`: plier visuals are strong; the LEGO reverse-engineering side would benefit from clean public-safe images if available.

## Public Sharing Notes

- Kinematic Puppet: website uses visual assets and the public ACC article link only.
- Confined-Space Inspection Robot: raw CAD is not published.
- UTS Motorsports Autonomous: only web display images are in the website assets folder; raw CAD/DXF should be handled in future project repos instead.
- Warman Challenge Robot: no reports, rubrics, feedback, assessment submissions, or student-detail files are in the website repo.
