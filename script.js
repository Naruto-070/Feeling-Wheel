const svg = document.getElementById("feeling-wheel");
const center = document.getElementById("center");
const radiusSteps = [50, 100, 150]; // Core, Primary, Secondary

function polarToCartesian(cx, cy, r, angle) {
  return [
    cx + r * Math.cos(angle),
    cy + r * Math.sin(angle)
  ];
}

function drawArc(cx, cy, r1, r2, startAngle, endAngle, color, label) {
  const [x1, y1] = polarToCartesian(cx, cy, r1, startAngle);
  const [x2, y2] = polarToCartesian(cx, cy, r2, startAngle);
  const [x3, y3] = polarToCartesian(cx, cy, r2, endAngle);
  const [x4, y4] = polarToCartesian(cx, cy, r1, endAngle);

  const largeArc = endAngle - startAngle > Math.PI ? 1 : 0;

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
  path.setAttribute("title", label);
  svg.appendChild(path);
}

function drawWheel(data) {
  const cx = 250, cy = 250;
  let totalCore = data.length;
  let startAngle = 0;

  data.forEach(section => {
    const coreAngle = (2 * Math.PI) / totalCore;
    const endCore = startAngle + coreAngle;

    // Draw Core
    drawArc(cx, cy, 0, radiusSteps[0], startAngle, endCore, section.color, section.core);

    const primaryTotal = section.children.length;
    let primaryStart = startAngle;

    section.children.forEach(primary => {
      const primaryAngle = coreAngle / primaryTotal;
      const primaryEnd = primaryStart + primaryAngle;

      // Draw Primary
      drawArc(cx, cy, radiusSteps[0], radiusSteps[1], primaryStart, primaryEnd, section.color, primary.primary);

      const secTotal = primary.children.length;
      let secStart = primaryStart;

      primary.children.forEach(sec => {
        const secAngle = primaryAngle / secTotal;
        const secEnd = secStart + secAngle;

        // Draw Secondary
        drawArc(cx, cy, radiusSteps[1], radiusSteps[2], secStart, secEnd, section.color, sec);

        secStart = secEnd;
      });

      primaryStart = primaryEnd;
    });

    startAngle = endCore;
  });
}

drawWheel(feelingWheelData);
