const { createCanvas } = require('canvas');
const fs = require('fs');
const path = require('path');

// Create 180x180 icon for iOS
const size = 180;
const canvas = createCanvas(size, size);
const ctx = canvas.getContext('2d');

// Purple gradient background
const gradient = ctx.createLinearGradient(0, 0, size, size);
gradient.addColorStop(0, '#7c3aed');
gradient.addColorStop(1, '#a855f7');

// Draw rounded rectangle
const radius = 40;
ctx.beginPath();
ctx.moveTo(radius, 0);
ctx.lineTo(size - radius, 0);
ctx.quadraticCurveTo(size, 0, size, radius);
ctx.lineTo(size, size - radius);
ctx.quadraticCurveTo(size, size, size - radius, size);
ctx.lineTo(radius, size);
ctx.quadraticCurveTo(0, size, 0, size - radius);
ctx.lineTo(0, radius);
ctx.quadraticCurveTo(0, 0, radius, 0);
ctx.closePath();
ctx.fillStyle = gradient;
ctx.fill();

// Draw bear emoji (as text won't render emoji, we'll draw a simple bear face)
ctx.fillStyle = '#fbbf24'; // Yellow/golden color

// Bear face (circle)
ctx.beginPath();
ctx.arc(90, 95, 50, 0, Math.PI * 2);
ctx.fill();

// Bear ears
ctx.beginPath();
ctx.arc(50, 55, 20, 0, Math.PI * 2);
ctx.fill();
ctx.beginPath();
ctx.arc(130, 55, 20, 0, Math.PI * 2);
ctx.fill();

// Inner ears
ctx.fillStyle = '#f59e0b';
ctx.beginPath();
ctx.arc(50, 55, 10, 0, Math.PI * 2);
ctx.fill();
ctx.beginPath();
ctx.arc(130, 55, 10, 0, Math.PI * 2);
ctx.fill();

// Eyes
ctx.fillStyle = '#1e293b';
ctx.beginPath();
ctx.arc(70, 90, 8, 0, Math.PI * 2);
ctx.fill();
ctx.beginPath();
ctx.arc(110, 90, 8, 0, Math.PI * 2);
ctx.fill();

// Eye shine
ctx.fillStyle = 'white';
ctx.beginPath();
ctx.arc(73, 87, 3, 0, Math.PI * 2);
ctx.fill();
ctx.beginPath();
ctx.arc(113, 87, 3, 0, Math.PI * 2);
ctx.fill();

// Nose
ctx.fillStyle = '#78350f';
ctx.beginPath();
ctx.ellipse(90, 110, 12, 8, 0, 0, Math.PI * 2);
ctx.fill();

// Nose shine
ctx.fillStyle = '#92400e';
ctx.beginPath();
ctx.ellipse(87, 108, 4, 3, 0, 0, Math.PI * 2);
ctx.fill();

// Mouth
ctx.strokeStyle = '#78350f';
ctx.lineWidth = 3;
ctx.beginPath();
ctx.arc(90, 115, 15, 0.2 * Math.PI, 0.8 * Math.PI);
ctx.stroke();

// Save as PNG
const buffer = canvas.toBuffer('image/png');
fs.writeFileSync(path.join(__dirname, 'public/icons/apple-touch-icon.png'), buffer);

console.log('Created apple-touch-icon.png (180x180)');

// Also create 192x192 and 512x512 for Android
[192, 512].forEach(s => {
  const c = createCanvas(s, s);
  const x = c.getContext('2d');
  
  // Scale everything
  const scale = s / 180;
  
  const grad = x.createLinearGradient(0, 0, s, s);
  grad.addColorStop(0, '#7c3aed');
  grad.addColorStop(1, '#a855f7');
  
  // Rounded rect
  const r = 40 * scale;
  x.beginPath();
  x.moveTo(r, 0);
  x.lineTo(s - r, 0);
  x.quadraticCurveTo(s, 0, s, r);
  x.lineTo(s, s - r);
  x.quadraticCurveTo(s, s, s - r, s);
  x.lineTo(r, s);
  x.quadraticCurveTo(0, s, 0, s - r);
  x.lineTo(0, r);
  x.quadraticCurveTo(0, 0, r, 0);
  x.closePath();
  x.fillStyle = grad;
  x.fill();
  
  // Bear face
  x.fillStyle = '#fbbf24';
  x.beginPath();
  x.arc(90 * scale, 95 * scale, 50 * scale, 0, Math.PI * 2);
  x.fill();
  
  // Ears
  x.beginPath();
  x.arc(50 * scale, 55 * scale, 20 * scale, 0, Math.PI * 2);
  x.fill();
  x.beginPath();
  x.arc(130 * scale, 55 * scale, 20 * scale, 0, Math.PI * 2);
  x.fill();
  
  // Inner ears
  x.fillStyle = '#f59e0b';
  x.beginPath();
  x.arc(50 * scale, 55 * scale, 10 * scale, 0, Math.PI * 2);
  x.fill();
  x.beginPath();
  x.arc(130 * scale, 55 * scale, 10 * scale, 0, Math.PI * 2);
  x.fill();
  
  // Eyes
  x.fillStyle = '#1e293b';
  x.beginPath();
  x.arc(70 * scale, 90 * scale, 8 * scale, 0, Math.PI * 2);
  x.fill();
  x.beginPath();
  x.arc(110 * scale, 90 * scale, 8 * scale, 0, Math.PI * 2);
  x.fill();
  
  // Eye shine
  x.fillStyle = 'white';
  x.beginPath();
  x.arc(73 * scale, 87 * scale, 3 * scale, 0, Math.PI * 2);
  x.fill();
  x.beginPath();
  x.arc(113 * scale, 87 * scale, 3 * scale, 0, Math.PI * 2);
  x.fill();
  
  // Nose
  x.fillStyle = '#78350f';
  x.beginPath();
  x.ellipse(90 * scale, 110 * scale, 12 * scale, 8 * scale, 0, 0, Math.PI * 2);
  x.fill();
  
  // Mouth
  x.strokeStyle = '#78350f';
  x.lineWidth = 3 * scale;
  x.beginPath();
  x.arc(90 * scale, 115 * scale, 15 * scale, 0.2 * Math.PI, 0.8 * Math.PI);
  x.stroke();
  
  const buf = c.toBuffer('image/png');
  fs.writeFileSync(path.join(__dirname, `public/icons/icon-${s}.png`), buf);
  console.log(`Created icon-${s}.png`);
});
