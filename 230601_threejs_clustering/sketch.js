import * as THREE from 'three';

/*__ B A S I C S _________________________________*/

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
// Move camera out so its not at the same pos as the cube
camera.position.z = 5;
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);


/*__ D R A W I N G _________________________________*/

// Create the cubes and groups
var cubeGeometry = new THREE.BoxGeometry(1, 1, 1);
var cubeMaterial1 = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
var cubeMaterial2 = new THREE.MeshBasicMaterial({ color: 0x00ffff });
var group1 = new THREE.Group();
var group2 = new THREE.Group();
for (var i = 0;i < 5;i++) {
  var cube1 = new THREE.Mesh(cubeGeometry, cubeMaterial1);
  cube1.position.x = i * 2;
  group1.add(cube1);
  var cube2 = new THREE.Mesh(cubeGeometry, cubeMaterial2);
  cube2.position.x = i * -2;
  group2.add(cube2);
}

// Add the groups to the scene
scene.add(group1);
scene.add(group2);

/*__ R E N D E R I N G _________________________________*/

function animate() {
  requestAnimationFrame(animate);
  group1.rotation.x += 0.01;
  group1.rotation.y += 0.01;
  group2.rotation.x -= 0.01;
  group2.rotation.y -= 0.01;
  renderer.render(scene, camera);
}
animate();