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

camera.position.z = 10;

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

const COUNT = 50000;

const positions = new Float32Array(COUNT * 3);
const colors = new Float32Array(COUNT * 3);
const rand = mulberry32(1857823);
const petals = 7;

for (let i = 0; i < COUNT; i++) {

  const i3 = i * 3;

  const petal = Math.floor(rand() * petals);

  const u = rand();
  const v = rand() * 2 - 1;

  const rLayer = rand();

  let layer;
  let layerRot;
  let yOffset = 0;

  if (rLayer < 0.20) {

    // giant back petals
    layer = 1.5;
    layerRot = Math.PI / petals * 0.5;
    yOffset = 0;

  } else if (rLayer < 0.50) {

    // outer petals
    layer = 1.4;
    layerRot = 0;
    yOffset = 0.05;

  } else if (rLayer < 0.80) {

    // upper petals
    layer = 1.0;
    layerRot = Math.PI / petals;
    yOffset = 0.10;

  } else {

    // inner petals
    layer = 0.6;
    layerRot = Math.PI / petals * 0.5;
    yOffset = 0.15;

  }

  const baseAngle =
    petal / petals * Math.PI * 2 +
    layerRot +
    (rand() - 0.5) * 0.15;

  const petalWidth = 0.8;

  const width =
  Math.pow(
    Math.sin(u * Math.PI),
    0.35
  ) *
  (1.0 - u * 0.15);
  petalWidth *
  layer;

  const petalLength = 3.5;
  

  const length =
    Math.pow(u, 0.85) *
    petalLength *
    layer;

  //const petalBend =
    0.8 + rand() * 0.5;

  const curve =
  Math.sin(u * Math.PI) * 0.4 +
  Math.pow(u, 1.8) * 0.6;

  const petalLift =
    layer > 1.0
      ? curve * 0.5
      : curve * 1.6;
  const x =
  v *
  width *
  (1.0 - u * 0.4);
  const y =
  (petalLift * 0.4) +
  yOffset;

const z =
  length *
  (0.8 + 0.2 * Math.sin(u * Math.PI));

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
    0.15 * (1 - mix) + 0.69 * mix;

  colors[i3 + 1] =
    0.72 * (1 - mix) + 0.30 * mix;

  colors[i3 + 2] =
    1.0;

  // center + branch veins
  const vein =
    Math.abs(v) < 0.05 ||
    (u > 0.3 &&
      Math.abs(
        v - 0.15 * Math.sin(u * 12.0)
      ) < 0.01) ||
    (u > 0.4 &&
      Math.abs(
        v + 0.15 * Math.sin(u * 10.0)
      ) < 0.01);

  if (vein) {

    colors[i3] = 1.0;
    colors[i3 + 1] = 1.0;
    colors[i3 + 2] = 1.0;

  }

  // glowing petal edges
  const edge =
    Math.abs(v) >
    width * 0.92;

  if (edge) {

    colors[i3] = 1.0;
    colors[i3 + 1] = 0.5;
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
      color: 0xff88ff
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
  10,
  20
);

core.position.set(0, 0, 0);

scene.add(core);
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
  particles.rotation.y += 0.003;
  for (let i = 0; i < sparks.length; i++) {

  const spark = sparks[i];

  spark.position.y +=
    Math.sin(
      performance.now() * 0.001 +
      i
    ) * 0.002;
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
  controls.update();

  composer.render();
}
animate();