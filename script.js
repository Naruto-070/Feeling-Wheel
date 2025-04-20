const svg = document.getElementById("feeling-wheel");
const center = document.getElementById("center");
const radiusSteps = [60, 120, 180]; // Inner to outer rings

function polarToCartesian(cx, cy, r, angle) {
  return [cx + r * Math.cos(angle), cy + r * Math.sin(angle)];
}

function drawArc(cx, cy, r1, r2, start, end, color, label) {
  const [x1, y1] = polarToCartesian(cx, cy, r1, start);
  const [x2, y2] = polarToCartesian(cx, cy, r2, start);
  const [x3, y3] = polarToCartesian(cx, cy, r2, end);
  const [x4, y4] = polarToCartesian(cx, cy, r1, end);

  const largeArc = end - start > Math.PI ? 1 : 0;

  const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
  path.setAttribute("d", `
    M ${x1} ${y1}
    L ${x2} ${y2}
    A ${r2} ${r2} 0 ${largeArc} 1 ${x3} ${y3}
    L ${x4} ${y4}
    A ${r1} ${r1} 0 ${largeArc} 0 ${x1} ${y1}
    Z
  `);
  path.setAttribute("fill", color);
  path.setAttribute("stroke", "#fff");
  path.setAttribute("stroke-width", 1);
  path.style.cursor = "pointer";
  path.addEventListener("click", () => {
    center.textContent = label;
  });
  svg.appendChild(path);
}

function drawWheel(data) {
  const cx = 250, cy = 250;
  let angleOffset = 0;

  data.forEach(section => {
    const coreAngle = (2 * Math.PI) / data.length;
    const endCore = angleOffset + coreAngle;

    drawArc(cx, cy, 0, radiusSteps[0], angleOffset, endCore, section.color, section.core);

    const primaryCount = section.children.length;
    let primaryStart = angleOffset;

    section.children.forEach(primary => {
      const primaryAngle = coreAngle / primaryCount;
      const primaryEnd = primaryStart + primaryAngle;

      drawArc(cx, cy, radiusSteps[0], radiusSteps[1], primaryStart, primaryEnd, section.color, primary.primary);

      const secondaryCount = primary.children.length;
      let secStart = primaryStart;

      primary.children.forEach(secondary => {
        const secAngle = primaryAngle / secondaryCount;
        const secEnd = secStart + secAngle;

        drawArc(cx, cy, radiusSteps[1], radiusSteps[2], secStart, secEnd, section.color, secondary);
        secStart = secEnd;
      });

      primaryStart = primaryEnd;
    });

    angleOffset = endCore;
  });
}

center.onclick = () => {
  center.textContent = "Emotion";
};

drawWheel(feelingWheelData);
