import * as THREE from 'three';

import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { CSS2DRenderer, CSS2DObject } from 'three/addons/renderers/CSS2DRenderer.js';

let camera, scene, renderer, labelRenderer;
let group;

dataLoad();
// init();
animate();



function dataLoad() {
  const loader = new THREE.FileLoader();

  //load a text file and output the result to the console
  loader.load(
    // resource URL
    'sampledata.json',

    // onLoad callback
    function (data) {
      // output the text to the console
      const jsonString = data;
      const json = JSON.parse(jsonString);
      console.log(json)
      init(json)
    },

    // onProgress callback
    function (xhr) {
      console.log((xhr.loaded / xhr.total * 100) + '% loaded');
    },

    // onError callback
    function (err) {
      console.error('An error happened');
    }
  );
}

function init(data) {
  console.log("init", data[0])

  camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 200);
  camera.position.set(10, 5, 20);

  scene = new THREE.Scene();
  scene.background = new THREE.Color( '#fff' );

  // const axesHelper = new THREE.AxesHelper(5);
  // axesHelper.layers.enableAll();
  // scene.add(axesHelper);

  // const boxGeometry = new THREE.BoxGeometry(1, 1, 1);
  // const boxMaterial = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
  // const boxObj = new THREE.Mesh(boxGeometry, boxMaterial);
  // scene.add(boxObj);
  group = new THREE.Group();

  data.forEach(el => {
    const xPos = Math.floor(Math.random() * 10) + 1;
    const yPos = Math.floor(Math.random() * 10) + 1;
    const zPos = Math.floor(Math.random() * 10) + 1;

    const elDiv = document.createElement('div');
    elDiv.className = "label";
    elDiv.textContent = el["asv-name"]
    elDiv.style.color = '#'+(0x1000000+Math.random()*0xffffff).toString(16).substr(1,6)
    //+ ", x:" + xPos + "/y:" + yPos;

    const elLabel = new CSS2DObject(elDiv);
    elLabel.position.set(xPos, yPos, zPos);
    elLabel.center.set(0, 0);

    group.add(elLabel);
  });

  scene.add(group);

  renderer = new THREE.WebGLRenderer();
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);

  labelRenderer = new CSS2DRenderer();
  labelRenderer.setSize(window.innerWidth, window.innerHeight);
  labelRenderer.domElement.style.position = 'absolute';
  labelRenderer.domElement.style.top = '0px';
  document.body.appendChild(labelRenderer.domElement);

  const controls = new OrbitControls(camera, labelRenderer.domElement);
  controls.minDistance = 5;
  controls.maxDistance = 100;

  window.addEventListener('resize', onWindowResize);

  // create me a group of 5 threejs spheres that are all positioned inside a certain radius without overlapping each other. Otherwise the position can be random
}

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
  labelRenderer.setSize(window.innerWidth, window.innerHeight);
}


function animate() {
  requestAnimationFrame(animate);
  group.rotation.x += 0.01;
  group.rotation.y += 0.01;
  group.rotation.z += 0.01;
  renderer.render(scene, camera);
  labelRenderer.render(scene, camera);
}

