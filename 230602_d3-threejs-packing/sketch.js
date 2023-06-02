import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";

import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

// import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

const url = "230508_AtlasFragekatalog_Prototyp.json"

// Set up the width, height, and color scheme of the visualization
const width = 760, // outer width, in pixels
	height = 760, // outer height, in pixels
	margin = 10, // shorthand for margins
	marginTop = margin, // top margin, in pixels
	marginRight = margin, // right margin, in pixels
	marginBottom = margin, // bottom margin, in pixels
	marginLeft = margin; // left margin, in pixels

d3.json(url).then(function (data) {
	console.log(data)

	const groupData = d3.group(data, d => d["Kartograph_in"])
	console.log("groupData", groupData)

	const root = d3.hierarchy(groupData)
		.sum((d) => {
			// calculate the 'value' propterty that is needed to calculate the size and position of the circles
			// since there is no "real" value, we take the size of the array of children
			// it's a bit nested and weird, but this works. 
			if (Array.isArray(d)) {
				// console.log(d[1].length)
				return d[1].length;
			} else {
				return 1
			}
		})
		.sort(function (a, b) { return b.value - a.value; });
	console.log("root", root)

	// // Create the pack layout
	const pack = d3.pack()
		.size([width - marginLeft - marginRight, height - marginTop - marginBottom])
		.padding(15);

	// // // Apply the pack layout to the data
	pack(root);

	const nodes = root.descendants();
	console.log("nodes", nodes)

	const scene = new THREE.Scene();
	const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
	camera.position.z = 5;
	const renderer = new THREE.WebGLRenderer();
	renderer.setSize(width, height);
	document.getElementById("d3-container").appendChild(renderer.domElement);

	// const axesHelper = new THREE.AxesHelper(5);
	// axesHelper.layers.enableAll();
	// scene.add(axesHelper);

	nodes.forEach(node => {
		if (node.depth === 0) return; // Skip the root node

		const geometry = new THREE.CircleGeometry(node.r, 32);
		const material = new THREE.MeshBasicMaterial({ color: Math.random() * 0xffffff });
		const circle = new THREE.Mesh(geometry, material);
		circle.position.set(node.x - width / 10, node.y - height / 10, 0);

		scene.add(circle);
	});

	const controls = new OrbitControls(camera, renderer.domElement);
  controls.minDistance = 5;
  controls.maxDistance = 5000;

	function animate() {
		requestAnimationFrame(animate);
		renderer.render(scene, camera);
	}
	animate();

});