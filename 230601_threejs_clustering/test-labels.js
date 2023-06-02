import * as THREE from 'three';

import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { CSS2DRenderer, CSS2DObject } from 'three/addons/renderers/CSS2DRenderer.js';

import { GUI } from 'three/addons/libs/lil-gui.module.min.js';

let gui;

let camera, scene, renderer, labelRenderer;

const layers = {
  'Toggle Name': function () {
    camera.layers.toggle(0);
  },
  'Toggle Mass': function () {
    camera.layers.toggle(1);
  },
  'Enable All': function () {
    camera.layers.enableAll();
  },
  'Disable All': function () {
    camera.layers.disableAll();
  }
};

init();
animate();

function init() {

  camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 200);
  camera.position.set(10, 5, 20);
  camera.layers.enableAll();

  scene = new THREE.Scene();

  const boxGeometry = new THREE.BoxGeometry(1, 1, 1);
  const boxMaterial = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
  const boxObj = new THREE.Mesh(boxGeometry, boxMaterial);
  scene.add(boxObj);

  boxObj.layers.enableAll();

  const earthDiv = document.createElement('div');
  earthDiv.className = 'label';
  earthDiv.textContent = 'Earth';
  earthDiv.style.backgroundColor = 'transparent';

  const earthLabel = new CSS2DObject(earthDiv);
  earthLabel.position.set(1.5, 0, 0);
  earthLabel.center.set(0, 1);
  boxObj.add(earthLabel);
  // earthLabel.layers.set(0);

  const earthMassDiv = document.createElement('div');
  earthMassDiv.className = 'label';
  earthMassDiv.textContent = '5.97237e24 kg';
  earthMassDiv.style.backgroundColor = 'transparent';

  const earthMassLabel = new CSS2DObject(earthMassDiv);
  earthMassLabel.position.set(1.5, 0, 0);
  earthMassLabel.center.set(0, 0);
  boxObj.add(earthMassLabel);
  // earthMassLabel.layers.set(1);

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

  // initGui();

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
  renderer.render(scene, camera);
  labelRenderer.render(scene, camera);
}

function initGui() {

  gui = new GUI();
  gui.title('Camera Layers');
  gui.add(layers, 'Toggle Name');
  gui.add(layers, 'Toggle Mass');
  gui.add(layers, 'Enable All');
  gui.add(layers, 'Disable All');
  gui.open();
}