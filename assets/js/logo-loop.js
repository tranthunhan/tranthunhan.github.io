const badgeLogos = [
  {
    title: "SolidWorks",
    src: "https://img.shields.io/badge/SolidWorks-CAD-E2231A?style=flat-square"
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
    title: "Fusion 360",
    src: "https://img.shields.io/badge/Fusion%20360-F58220?style=flat-square&logo=autodesk&logoColor=white"
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
    src: "https://img.shields.io/badge/3D%20printing-2F855A?style=flat-square"
  },
  {
    title: "Python",
    src: "https://img.shields.io/badge/Python-3670A0?style=flat-square&logo=python&logoColor=ffdd54"
  },
  {
    title: "C++",
    src: "https://img.shields.io/badge/C++-00599C?style=flat-square&logo=c%2B%2B&logoColor=white"
  },
  {
    title: "GitHub",
    src: "https://img.shields.io/badge/GitHub-181717?style=flat-square&logo=github&logoColor=white"
  },
  {
    title: "ROS",
    src: "https://img.shields.io/badge/ROS-developing-22314E?style=flat-square&logo=ros&logoColor=white"
  },
  {
    title: "Blender",
    src: "https://img.shields.io/badge/Blender-F5792A?style=flat-square&logo=blender&logoColor=white"
  }
];

function createBadgeLink(item) {
  const anchor = document.createElement("a");
  anchor.className = "logo-loop-link";
  anchor.href = item.src;
  anchor.target = "_blank";
  anchor.rel = "noreferrer";
  anchor.setAttribute("aria-label", `${item.title} badge`);
  anchor.title = item.title;

  const image = document.createElement("img");
  image.src = item.src;
  image.alt = item.title;
  image.loading = "lazy";
  image.decoding = "async";
  image.draggable = false;
  image.height = 20;

  anchor.appendChild(image);
  return anchor;
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
  root.setAttribute("aria-label", "Tech stack logos");

  const viewport = document.createElement("div");
  viewport.className = "logo-loop-viewport";
  const track = document.createElement("div");
  track.className = "logo-loop-track";

  const primaryList = document.createElement("div");
  primaryList.className = "logo-loop-list";
  badgeLogos.forEach((item) => {
    primaryList.appendChild(createBadgeLink(item));
  });

  const mirrorList = primaryList.cloneNode(true);
  mirrorList.setAttribute("aria-hidden", "true");

  track.appendChild(primaryList);
  track.appendChild(mirrorList);
  viewport.appendChild(track);
  root.appendChild(viewport);

  nav.insertBefore(root, randomButton);
}
