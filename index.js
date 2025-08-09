import { facePoints } from './polkadot_art.js';

// BOOK A CALL button handlers
const openCalendly = () => window.open('https://calendly.com/jeetujayson/60min', '_blank');
document.getElementById('bookCallBtn').onclick = openCalendly;
document.getElementById('bookCallBtnFooter').onclick = openCalendly;


/**
 * Taurus polka dot art canvas using imported points with interactive distortion
 */
(function setupTaurusCanvas() {
  const canvas = document.getElementById('taurusCanvas');
  const ctx = canvas.getContext('2d');

  const width = canvas.width;
  const height = canvas.height;

  // Prepare points from imported facePoints
  const points = facePoints.map(p => ({
    x: p.x,
    y: p.y,
    originalX: p.x,
    originalY: p.y,
    radius: 6 + Math.random() * 3,
  }));

  // Draw polka dots with green glowing style and dark green background
  function drawDots() {
    ctx.fillStyle = '#000'; // Black background
    ctx.fillRect(0, 0, width, height);

    points.forEach(point => {
      ctx.beginPath();
      ctx.fillStyle = '#34d399'; // Emerald green glowing dots
      ctx.shadowColor = 'rgba(52, 211, 153, 0.8)';
      ctx.shadowBlur = 15;
      ctx.arc(point.x, point.y, point.radius, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;
    });
  }

  // Distance helper
  function dist(x1, y1, x2, y2) {
    return Math.hypot(x2 - x1, y2 - y1);
  }

  // Mousemove interactive distortion
  canvas.addEventListener('mousemove', e => {
    const rect = canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    points.forEach(point => {
      const d = dist(mouseX, mouseY, point.originalX, point.originalY);
      const maxDist = 100;

      if (d < maxDist) {
        const angle = Math.atan2(point.originalY - mouseY, point.originalX - mouseX);
        const offset = (maxDist - d) * 0.5;
        point.x = point.originalX + Math.cos(angle) * offset;
        point.y = point.originalY + Math.sin(angle) * offset;
      } else {
        point.x += (point.originalX - point.x) * 0.1;
        point.y += (point.originalY - point.y) * 0.1;
      }
    });
  });

  // Reset on mouse leave
  canvas.addEventListener('mouseleave', () => {
    points.forEach(point => {
      point.x = point.originalX;
      point.y = point.originalY;
    });
  });

  // Animate loop
  function animate() {
    drawDots();
    requestAnimationFrame(animate);
  }

  animate();
})();
