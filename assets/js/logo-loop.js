const badgeLogos = [
  {
    title: "SolidWorks",
    src: "https://img.shields.io/badge/SolidWorks-CAD-E2231A?style=flat-square"
  },
  {
    title: "Fusion 360",
    src: "https://img.shields.io/badge/Fusion%20360-F58220?style=flat-square&logo=autodesk&logoColor=white"
  },
  {
    title: "MATLAB",
    src: "https://img.shields.io/badge/MATLAB-0076A8?style=flat-square"
  },
  {
    title: "ANSYS",
    src: "https://img.shields.io/badge/ANSYS-FFB71B?style=flat-square&logo=ansys&logoColor=black"
  },
  {
    title: "Arduino",
    src: "https://img.shields.io/badge/Arduino-00979D?style=flat-square&logo=Arduino&logoColor=white"
  },
  {
    title: "Raspberry Pi",
    src: "https://img.shields.io/badge/Raspberry%20Pi-A22846?style=flat-square&logo=raspberrypi&logoColor=white"
  },
  {
    title: "3D Printing",
    src: "https://img.shields.io/badge/3D%20Printing-2F855A?style=flat-square"
  },
  {
    title: "Mechanical Design",
    src: "https://img.shields.io/badge/Mechanical%20Design-4B6B88?style=flat-square"
  },
  {
    title: "Prototyping",
    src: "https://img.shields.io/badge/Prototyping-6B7280?style=flat-square"
  },
  {
    title: "Additive Manufacturing",
    src: "https://img.shields.io/badge/Additive%20Manufacturing-2F855A?style=flat-square"
  },
  {
    title: "GitHub",
    src: "https://img.shields.io/badge/GitHub-181717?style=flat-square&logo=github&logoColor=white"
  }
];

function createBadge(item) {
  const badge = document.createElement("span");
  badge.className = "logo-loop-badge";
  badge.title = item.title;

  const image = document.createElement("img");
  image.src = item.src;
  image.alt = item.title;
  image.loading = "lazy";
  image.decoding = "async";
  image.draggable = false;
  image.height = 20;

  badge.appendChild(image);
  return badge;
}

export function initLogoLoop() {
  const nav = document.querySelector(".site-header .nav");
  if (!nav || nav.querySelector(".header-logo-loop")) {
    return;
  }

  const brand = nav.querySelector(".brand");
  const randomButton = nav.querySelector(".random-project-link");
  if (!brand || !randomButton) {
    return;
  }

  const root = document.createElement("div");
  root.className = "header-logo-loop";
  root.setAttribute("aria-label", "Engineering toolkit badges");

  const viewport = document.createElement("div");
  viewport.className = "logo-loop-viewport";
  const track = document.createElement("div");
  track.className = "logo-loop-track";

  const primaryList = document.createElement("div");
  primaryList.className = "logo-loop-list";
  badgeLogos.forEach((item) => {
    primaryList.appendChild(createBadge(item));
  });

  const mirrorList = primaryList.cloneNode(true);
  mirrorList.setAttribute("aria-hidden", "true");

  track.appendChild(primaryList);
  track.appendChild(mirrorList);
  viewport.appendChild(track);
  root.appendChild(viewport);

  nav.insertBefore(root, randomButton);
}
