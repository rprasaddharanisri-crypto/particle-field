import * as THREE from "three";

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
  antialias: true,
});

renderer.setSize(
  window.innerWidth,
  window.innerHeight
);

document.body.style.margin = "0";
document.body.appendChild(renderer.domElement);

const COUNT = 10000;

const positions = new Float32Array(COUNT * 3);

for (let i = 0; i < COUNT; i++) {
  const i3 = i * 3;

  positions[i3] = (Math.random() - 0.5) * 4;
  positions[i3 + 1] = (Math.random() - 0.5) * 4;
  positions[i3 + 2] = (Math.random() - 0.5) * 4;
}

const geometry = new THREE.BufferGeometry();

geometry.setAttribute(
  "position",
  new THREE.BufferAttribute(positions, 3)
);

const material = new THREE.PointsMaterial({
  color: 0x25b8ff,
  size: 0.03,
});

const particles = new THREE.Points(
  geometry,
  material
);

scene.add(particles);

window.addEventListener("resize", () => {
  camera.aspect =
    window.innerWidth / window.innerHeight;

  camera.updateProjectionMatrix();

  renderer.setSize(
    window.innerWidth,
    window.innerHeight
  );
});

function animate() {
  requestAnimationFrame(animate);

  particles.rotation.y += 0.001;

  renderer.render(scene, camera);
}

animate();