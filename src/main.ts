import { ParticleStudio } from "./engine";

const canvas = document.createElement("canvas");

canvas.style.position = "fixed";
canvas.style.inset = "0";

document.body.style.margin = "0";
document.body.appendChild(canvas);

const studio = new ParticleStudio(canvas, {
  count: 250000,
  size: 1.95,
  speed: 0.45,
  opacity: 0.7,

  bloomStrength: 0.75,
  bloomRadius: 0.08,
  bloomThreshold: 0.21,

  colorA: "#25b8ff",
  colorB: "#b04dff",

  autorotate: false,
});

function resize() {
  studio.resize(
    window.innerWidth,
    window.innerHeight,
    Math.min(window.devicePixelRatio, 2)
  );
}

resize();

window.addEventListener("resize", resize);

studio.showForm(
  "lotus",
  1332979860,
  "gather"
);

let last = performance.now();

function tick(now: number) {
  const dt = Math.min(
    0.05,
    (now - last) / 1000
  );

  last = now;

  studio.renderFrame(dt);

  requestAnimationFrame(tick);
}

requestAnimationFrame(tick);