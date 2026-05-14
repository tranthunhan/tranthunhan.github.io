const badgeLogos = [
  {
    title: "C++",
    src: "https://img.shields.io/badge/c++-%2300599C.svg?style=flat-square&logo=c%2B%2B&logoColor=white"
  },
  {
    title: "Bash Script",
    src: "https://img.shields.io/badge/bash_script-%23121011.svg?style=flat-square&logo=gnu-bash&logoColor=white"
  },
  {
    title: "Python",
    src: "https://img.shields.io/badge/python-3670A0?style=flat-square&logo=python&logoColor=ffdd54"
  },
  {
    title: "Markdown",
    src: "https://img.shields.io/badge/markdown-%23000000.svg?style=flat-square&logo=markdown&logoColor=white"
  },
  {
    title: "JavaScript",
    src: "https://img.shields.io/badge/javascript-%23323330.svg?style=flat-square&logo=javascript&logoColor=%23F7DF1E"
  },
  {
    title: "Blender",
    src: "https://img.shields.io/badge/blender-%23F5792A.svg?style=flat-square&logo=blender&logoColor=white"
  },
  {
    title: "Creo",
    src: "https://img.shields.io/badge/Creo-005386?style=flat-square&logo=ptc&logoColor=white"
  },
  {
    title: "AutoCAD",
    src: "https://img.shields.io/badge/AutoCAD-E51050?style=flat-square&logo=autodesk&logoColor=white"
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
    title: "3D Printing",
    src: "https://img.shields.io/badge/3D%20printing-2F855A?style=flat-square"
  },
  {
    title: "Additive Manufacturing",
    src: "https://img.shields.io/badge/additive%20manufacturing-4A5568?style=flat-square"
  },
  {
    title: "Mechanical Design",
    src: "https://img.shields.io/badge/mechanical%20design-1A365D?style=flat-square"
  },
  {
    title: "Prototyping",
    src: "https://img.shields.io/badge/prototyping-805AD5?style=flat-square"
  },
  {
    title: "Fabrication",
    src: "https://img.shields.io/badge/fabrication-744210?style=flat-square"
  },
  {
    title: "MATLAB",
    src: "https://img.shields.io/badge/MATLAB-0076A8?style=flat-square"
  },
  {
    title: "Excel",
    src: "https://img.shields.io/badge/Excel-217346?style=flat-square&logo=microsoftexcel&logoColor=white"
  },
  {
    title: "Power BI",
    src: "https://img.shields.io/badge/Power%20BI-F2C811?style=flat-square&logo=powerbi&logoColor=black"
  },
  {
    title: "Matplotlib",
    src: "https://img.shields.io/badge/Matplotlib-%23ffffff.svg?style=flat-square&logo=Matplotlib&logoColor=black"
  },
  {
    title: "NumPy",
    src: "https://img.shields.io/badge/numpy-%23013243.svg?style=flat-square&logo=numpy&logoColor=white"
  },
  {
    title: "PyTorch",
    src: "https://img.shields.io/badge/PyTorch-%23EE4C2C.svg?style=flat-square&logo=PyTorch&logoColor=white"
  },
  {
    title: "Arduino",
    src: "https://img.shields.io/badge/-Arduino-00979D?style=flat-square&logo=Arduino&logoColor=white"
  },
  {
    title: "Git",
    src: "https://img.shields.io/badge/git-%23F05033.svg?style=flat-square&logo=git&logoColor=white"
  },
  {
    title: "OpenCV",
    src: "https://img.shields.io/badge/opencv-%23white.svg?style=flat-square&logo=opencv&logoColor=white"
  },
  {
    title: "ROS",
    src: "https://img.shields.io/badge/ros-%230A0FF9.svg?style=flat-square&logo=ros&logoColor=white"
  },
  {
    title: "HTML5",
    src: "https://img.shields.io/badge/html5-%23E34F26.svg?style=flat-square&logo=html5&logoColor=white"
  },
  {
    title: "CSS3",
    src: "https://img.shields.io/badge/css3-%231572B6.svg?style=flat-square&logo=css3&logoColor=white"
  },
  {
    title: "C#",
    src: "https://img.shields.io/badge/c%23-%23239120.svg?style=flat-square&logo=csharp&logoColor=white"
  },
  {
    title: "C",
    src: "https://img.shields.io/badge/c-%2300599C.svg?style=flat-square&logo=c&logoColor=white"
  },
  {
    title: "Pandas",
    src: "https://img.shields.io/badge/pandas-%23150458.svg?style=flat-square&logo=pandas&logoColor=white"
  },
  {
    title: "Plotly",
    src: "https://img.shields.io/badge/Plotly-%233F4F75.svg?style=flat-square&logo=plotly&logoColor=white"
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
