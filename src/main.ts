import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass.js";
import { OutputPass } from "three/examples/jsm/postprocessing/OutputPass.js";



const scene = new THREE.Scene();
scene.background = new THREE.Color(0x000000);

const camera = new THREE.PerspectiveCamera(
  40,
  window.innerWidth / window.innerHeight,
  0.1,
  100
);

camera.position.z = 8;

const renderer = new THREE.WebGLRenderer({
  antialias: true
});
const controls = new OrbitControls(
  camera,
  renderer.domElement
);

controls.enableDamping = true;
const composer = new EffectComposer(renderer);

composer.addPass(
  new RenderPass(scene, camera)
);

const bloom = new UnrealBloomPass(
  new THREE.Vector2(
    window.innerWidth,
    window.innerHeight
  ),
  1.0,
  0.4,
  0.15
);

composer.addPass(bloom);
composer.addPass(new OutputPass());
renderer.setSize(
  window.innerWidth,
  window.innerHeight
);
composer.setSize(
  window.innerWidth,
  window.innerHeight
);
document.body.style.margin = "0";
document.body.appendChild(renderer.domElement);

const COUNT = 250000;

const positions = new Float32Array(COUNT * 3);
const colors = new Float32Array(COUNT * 3);

for (let i = 0; i < COUNT; i++) {
  const i3 = i * 3;

  const t = Math.random() * Math.PI * 12;
  const r = 0.3 + Math.random() * 1.5;

  positions[i3] = Math.cos(t) * r;
  positions[i3 + 1] = (Math.random() - 0.5) * 2.5;
  positions[i3 + 2] = Math.sin(t) * r;

  const mix = Math.random();

  // Blue (#25b8ff) -> Purple (#b04dff)

  colors[i3] =
    0.15 * (1 - mix) + 0.69 * mix;

  colors[i3 + 1] =
    0.72 * (1 - mix) + 0.30 * mix;

  colors[i3 + 2] = 1.0;
}

const geometry = new THREE.BufferGeometry();

geometry.setAttribute(
  "position",
  new THREE.BufferAttribute(positions, 3)
);

geometry.setAttribute(
  "color",
  new THREE.BufferAttribute(colors, 3)
);

const material = new THREE.PointsMaterial({
  size: 0.02,
  vertexColors: true,
  transparent: true,
  opacity: 0.8,
  blending: THREE.AdditiveBlending,
  depthWrite: false
});

const particles = new THREE.Points(
  geometry,
  material
);

scene.add(particles);

function animate() {
  requestAnimationFrame(animate);

  particles.rotation.y += 0.001;
  composer.render();
  controls.update();
}

animate();