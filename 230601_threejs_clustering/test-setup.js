import * as THREE from 'three';

// create 2d HTML elements
// https://threejs.org/docs/#examples/en/renderers/CSS2DRenderer
import { CSS2DRenderer, CSS2DObject } from 'three/addons/renderers/CSS2DRenderer.js';

/*__ B A S I C S _________________________________*/

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
// Move camera out so its not at the same pos as the cube
camera.position.z = 5;

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

/*__ D R A W I N G _________________________________*/

// 1. An object that contains all the points (vertices) and fill (faces) of the cube
const geometry = new THREE.BoxGeometry(1, 1, 1);
// 2. A material to color the object
const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
// 3. A mesh is an object that takes a geometry, and applies a material to it, which we then can insert to our scene, and move freely around.
const cube = new THREE.Mesh(geometry, material);

scene.add(cube);


/*__ R E N D E R I N G _________________________________*/

function animate() {
  requestAnimationFrame(animate);
  cube.rotation.x += 0.01;
  cube.rotation.y += 0.01;
  renderer.render(scene, camera);
}
animate();