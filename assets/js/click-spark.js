function resolveEasing(easing) {
  if (easing === "linear") {
    return (t) => t;
  }

  if (easing === "ease-in") {
    return (t) => t * t;
  }

  if (easing === "ease-in-out") {
    return (t) => (t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t);
  }

  return (t) => t * (2 - t);
}

function getEventTargetElement(event) {
  if (event.target instanceof Element) {
    return event.target;
  }
  return null;
}

export function initClickSpark({
  targetSelector = null,
  sparkColor = "#d9eeff",
  sparkSize = 9,
  sparkRadius = 13,
  sparkCount = 8,
  duration = 380,
  easing = "ease-out",
  extraScale = 1
} = {}) {
  if (document.querySelector(".click-spark-canvas")) {
    return;
  }

  const canvas = document.createElement("canvas");
  canvas.className = "click-spark-canvas";
  canvas.setAttribute("aria-hidden", "true");
  document.body.appendChild(canvas);
  const ctx = canvas.getContext("2d");
  const sparks = [];
  const ease = resolveEasing(easing);
  const keyboardTargetSelector =
    targetSelector || "a[href], button, [role='button'], .dock-link, .brand, .logo-loop-link";
  let animationId = 0;

  const resizeCanvas = () => {
    const ratio = window.devicePixelRatio || 1;
    const width = window.innerWidth;
    const height = window.innerHeight;
    canvas.width = Math.floor(width * ratio);
    canvas.height = Math.floor(height * ratio);
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
  };

  const draw = (now) => {
    ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

    for (let i = sparks.length - 1; i >= 0; i -= 1) {
      const spark = sparks[i];
      const elapsed = now - spark.startTime;
      if (elapsed >= duration) {
        sparks.splice(i, 1);
        continue;
      }

      const progress = elapsed / duration;
      const eased = ease(progress);
      const distance = eased * sparkRadius * extraScale;
      const lineLength = sparkSize * (1 - eased);

      const x1 = spark.x + distance * Math.cos(spark.angle);
      const y1 = spark.y + distance * Math.sin(spark.angle);
      const x2 = spark.x + (distance + lineLength) * Math.cos(spark.angle);
      const y2 = spark.y + (distance + lineLength) * Math.sin(spark.angle);

      ctx.strokeStyle = sparkColor;
      ctx.lineWidth = 1.8;
      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.stroke();
    }

    animationId = requestAnimationFrame(draw);
  };

  const spawnSparks = (x, y) => {
    const now = performance.now();
    for (let i = 0; i < sparkCount; i += 1) {
      sparks.push({
        x,
        y,
        angle: (2 * Math.PI * i) / sparkCount,
        startTime: now
      });
    }
  };

  const handlePointerDown = (event) => {
    if (event.pointerType === "mouse" && event.button !== 0) {
      return;
    }

    if (targetSelector) {
      const target = getEventTargetElement(event);
      if (!target || !target.closest(targetSelector)) {
        return;
      }
    }

    spawnSparks(event.clientX, event.clientY);
  };

  const handleKeyDown = (event) => {
    if (event.key !== "Enter" && event.key !== " ") {
      return;
    }

    const active = document.activeElement;
    if (!(active instanceof Element) || !active.matches(keyboardTargetSelector)) {
      return;
    }

    const rect = active.getBoundingClientRect();
    const x = rect.left + rect.width / 2;
    const y = rect.top + rect.height / 2;
    spawnSparks(x, y);
  };

  resizeCanvas();
  animationId = requestAnimationFrame(draw);
  window.addEventListener("resize", resizeCanvas);
  document.addEventListener("pointerdown", handlePointerDown, { passive: true });
  document.addEventListener("keydown", handleKeyDown);

  window.addEventListener("beforeunload", () => {
    cancelAnimationFrame(animationId);
    window.removeEventListener("resize", resizeCanvas);
    document.removeEventListener("pointerdown", handlePointerDown);
    document.removeEventListener("keydown", handleKeyDown);
  });
}
