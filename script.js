const svg = document.getElementById("feeling-wheel");
const centerLabel = document.getElementById("center-label");
const radiusSteps = [60, 130, 200];
const cx = 300, cy = 300;

function polarToCartesian(cx, cy, r, angle) {
  return [
    cx + r * Math.cos(angle),
    cy + r * Math.sin(angle)
  ];
}

function drawArc(cx, cy, r1, r2, startAngle, endAngle, color, label, isFinal = false) {
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
  path.setAttribute("stroke-width", "1");
  path.style.cursor = "pointer";
  path.style.transition = "transform 0.3s, opacity 0.3s";

  path.addEventListener("click", () => {
    if (isFinal) {
      // Show final emotion selected with a button and a back option
      centerLabel.innerHTML = `
        <div style="text-align: center;">
          <button onclick='sendEmail(${JSON.stringify(label)})'>Send "${label}" Feeling</button>
          <br/><br/>
          <button onclick='drawWheel(feelingWheelData)'>⬅️ Go Back</button>
        </div>
      `;
      centerLabel.style.backgroundColor = color;
    } else {
      // Core or primary emotion selected
      centerLabel.innerText = "Heyo Love, choose further Mwaah <3";
      centerLabel.style.backgroundColor = color;
    }
  });

  path.addEventListener("mouseover", () => {
    path.style.transform = "scale(1.05)";
    path.style.opacity = "0.85";
  });

  path.addEventListener("mouseout", () => {
    path.style.transform = "scale(1)";
    path.style.opacity = "1";
  });

  svg.appendChild(path);

  const midAngle = (startAngle + endAngle) / 2;
  const [tx, ty] = polarToCartesian(cx, cy, (r1 + r2) / 2, midAngle);
  const text = document.createElementNS("http://www.w3.org/2000/svg", "text");
  text.setAttribute("x", tx);
  text.setAttribute("y", ty);
  text.setAttribute("text-anchor", "middle");
  text.setAttribute("alignment-baseline", "middle");
  text.setAttribute("font-size", "10");
  text.setAttribute("fill", "#333");
  text.style.userSelect = "none";
  text.style.pointerEvents = "none";
  text.textContent = label;
  svg.appendChild(text);
}

function drawWheel(data) {
  svg.innerHTML = "";
  centerLabel.innerText = "Feelings";
  centerLabel.style.backgroundColor = "white";

  let totalCore = data.length;
  let startAngle = 0;

  data.forEach(section => {
    const coreAngle = (2 * Math.PI) / totalCore;
    const endCore = startAngle + coreAngle;

    drawArc(cx, cy, 0, radiusSteps[0], startAngle, endCore, section.color, section.core);

    let primaryStart = startAngle;
    section.children.forEach(primary => {
      const primaryAngle = coreAngle / section.children.length;
      const primaryEnd = primaryStart + primaryAngle;

      drawArc(cx, cy, radiusSteps[0], radiusSteps[1], primaryStart, primaryEnd, section.color, primary.primary);

      let secStart = primaryStart;
      primary.children.forEach(sec => {
        const secAngle = primaryAngle / primary.children.length;
        const secEnd = secStart + secAngle;

        drawArc(cx, cy, radiusSteps[1], radiusSteps[2], secStart, secEnd, section.color, sec, true);

        secStart = secEnd;
      });

      primaryStart = primaryEnd;
    });

    startAngle = endCore;
  });
}

function sendEmail(feeling) {
  const emailBody = `Kitty Divi is feeling ${feeling}`;
  window.location.href = `mailto:shourya3123@gmail.com?subject=Feeling Wheel&body=${encodeURIComponent(emailBody)}`;
}

drawWheel(feelingWheelData);
