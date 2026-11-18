import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass.js";
import { OutputPass } from "three/examples/jsm/postprocessing/OutputPass.js";
import { vertexShader, fragmentShader } from "./shaders";
import { mulberry32 } from "./random";
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

const COUNT = 100000;

const positions = new Float32Array(COUNT * 3);
const colors = new Float32Array(COUNT * 3);
const rand = mulberry32(1857823);
const petals = 12;

for (let i = 0; i < COUNT; i++) {
  const i3 = i * 3;

  const angle = rand() * Math.PI * 2;
  const u = rand();

  const petal =
    Math.pow(
      Math.abs(Math.sin(petals * angle)),
      0.7
    );

  const radius =
    petal * (0.5 + u * 3.0);

  positions[i3] =
    Math.cos(angle) * radius;

  positions[i3 + 2] =
    Math.sin(angle) * radius;

  positions[i3 + 1] =
    (1.0 - u) *
    petal *
    1.2 *
    (rand() - 0.5);

  const mix = radius / 3.5;

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

const material = new THREE.ShaderMaterial({
  vertexShader,
  fragmentShader,

  uniforms: {
    uTime: { value: 0 }
  },

  transparent: true,
  depthWrite: false,
  blending: THREE.AdditiveBlending,
  vertexColors: true
});
const particles = new THREE.Points(
  geometry,
  material
);

scene.add(particles);
window.addEventListener("resize", () => {

  camera.aspect =
    window.innerWidth /
    window.innerHeight;

  camera.updateProjectionMatrix();

  renderer.setSize(
    window.innerWidth,
    window.innerHeight
  );

  composer.setSize(
    window.innerWidth,
    window.innerHeight
  );

});
function animate() {
  requestAnimationFrame(animate);
  material.uniforms.uTime.value =
  performance.now() * 0.001;
  particles.rotation.y += 0.001;

  controls.update();

  composer.render();
}
animate();