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

camera.position.set(
  0,
  2,
  12
);

camera.lookAt(
  0,
  0,
  0
);

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
  0.25,
  0.05,
  0.85
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
const rand = mulberry32(1857823);
const petals = 9;

for (let i = 0; i < COUNT; i++) {

  const i3 = i * 3;

  const petal = Math.floor(rand() * petals);

  const u = rand();
  const v = rand() * 2 - 1;

  const rLayer = rand();

  let layer;
  let layerRot;

let yOffset = 0;

if (rLayer < 0.25) {

  // huge back petals
  layer = 1.8;
  layerRot = Math.PI / petals * 0.5;
  yOffset = -0.02;

} else if (rLayer < 0.5) {

  // outer petals
  layer = 1.4;
  layerRot = 0;
  yOffset = 0;

} else if (rLayer < 0.75) {

  // upper petals
  layer = 1.0;
  layerRot = Math.PI / petals;
  yOffset = 0.05;

} else {

  // inner petals
  layer = 0.6;
  layerRot = Math.PI / petals * 0.5;
  yOffset = 0.10;

}

const baseAngle =
  petal / petals * Math.PI * 2 +
  layerRot +
  (rand() - 0.5) * 0.03;
const tilt =yOffset > 0 ? -0.4 : 0;
const width =
(
  Math.sin(u * Math.PI) *
  (1.0 - u * 0.20)
) *
(
  0.8 +
  0.25 *
  Math.sin(u * Math.PI)
) *
(
  layer > 1.6
    ? 1.3
    : 0.8
) *
layer;

  const length =
  Math.pow(u, 0.85) *
  (
    layer < 0.5
      ? 1.2
      : 3.5
  ) *
  layer;
  const curve =
    Math.sin(u * Math.PI) * 0.25 +
    Math.pow(u, 2.2) * 0.9;

  const x = v * width * (1.0 - u * 0.25);
  const petalLift =
  layer > 1.0
    ? curve * 0.5        // outer petals
    : curve * 1.6;       // inner petals

  const y = petalLift + pageYOffset;
  const z =length +tilt * u;

  const c = Math.cos(baseAngle);
  const s = Math.sin(baseAngle);

  positions[i3] =
    c * z - s * x;

  positions[i3 + 1] =
    y;

  positions[i3 + 2] =
    s * z + c * x;

  const mix = Math.pow(u, 1.8);

  colors[i3] =
  0.05 * (1 - mix) + 0.75 * mix;

colors[i3 + 1] =
  0.90 * (1 - mix) + 0.25 * mix;

colors[i3 + 2] =
  1.0;

  // Petal vein
  const vein =
  Math.abs(v) < 0.03 ||

  (u > 0.25 &&
   Math.abs(
     v - 0.12 * Math.sin(u * 10.0)
   ) < 0.01) ||

  (u > 0.35 &&
   Math.abs(
     v + 0.12 * Math.sin(u * 8.0)
   ) < 0.01);

if (vein) {

  colors[i3] = 0.85;
  colors[i3 + 1] = 0.95;
  colors[i3 + 2] = 1.0;

}
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
const sparks: THREE.Mesh[] = [];

for (let i = 0; i < 2000; i++) {
  const spark = new THREE.Mesh(
    new THREE.SphereGeometry(0.008),
    new THREE.MeshBasicMaterial({
      color:
  Math.random() > 0.5
    ? 0xff88ff
    : 0x8fffff
    })
  );

  spark.position.set(
    (Math.random() - 0.5) * 20,
    (Math.random() - 0.5) * 8,
    (Math.random() - 0.5) * 20
  );

  sparks.push(spark);
  scene.add(spark);
}
const core = new THREE.PointLight(
  0x8fffff,
  22,
  35
);

core.position.set(0, 0, 0);

scene.add(core);
const coreSphere = new THREE.Mesh(
  new THREE.SphereGeometry(0.12, 24, 24),
  new THREE.MeshBasicMaterial({
    color: 0x8fffff
  })
);

scene.add(coreSphere);
const coreGlow = new THREE.PointLight(
  0xffffff,
  5,
  8
);
coreGlow.position.set(
  0,
  0,
  0
);

scene.add(coreGlow);
const aura = new THREE.PointLight(
  0xaaffff,
  2,
  50
);

aura.position.set(
  0,
  0,
  0
);

scene.add(aura);
coreGlow.position.set(0, 0, 0);

scene.add(coreGlow);
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
  particles.rotation.y += 0.0005;
  for (let i = 0; i < sparks.length; i++) {

  const spark = sparks[i];

  spark.position.y +=
  Math.sin(
    performance.now() * 0.001 +
    i
  ) * 0.003;

spark.position.x +=
  Math.cos(
    performance.now() * 0.0005 +
    i
  ) * 0.0005;
  spark.position.x +=
  Math.cos(
    performance.now() * 0.0003 + i
  ) * 0.0004;

spark.position.z +=
  Math.sin(
    performance.now() * 0.0003 + i
  ) * 0.0004;
  }
  const pulse =
  1.0 +
  Math.sin(
    performance.now() * 0.001
  ) * 0.03;
particles.scale.set(
  pulse,
  pulse,
  pulse
);
  const corePulse =
  1 +
  Math.sin(
    performance.now() * 0.003
  ) * 0.25;

coreSphere.scale.set(
  corePulse,
  corePulse,
  corePulse
);
const glowPulse =
  1.0 +
  Math.sin(
    performance.now() * 0.002
  ) * 0.2;

coreSphere.scale.set(
  glowPulse,
  glowPulse,
  glowPulse
);
  controls.update();

  composer.render();
}
animate();