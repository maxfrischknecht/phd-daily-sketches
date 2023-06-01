// inspiration
// https://medium.com/@alptuan/trigonometric-graphics-f8a41fb7fba0
const url = "../00_datasets/sgv-12-objects-about-Frau.json"
let graphs = [];
let finishedDrawing = false;

function preload() {
	fetch(url)
		.then(res => res.json())
		.then(data => {
			let countedData = countUniqueValues(data);
			let sortedData = sortDescending(countedData);
			console.log(data.length);
			drawData(sortedData);
		})
}

let cnv;
function setup() {
	cnv = createCanvas(640, 640);
	background(0);
	textFont('Everett');
	frameRate(8);
	// colorMode(HSB, 255)

	angleMode(DEGREES); // enable the Degree mode not to make calculations easier.
	//noLoop(); // Since we don't create and animation, we can disable the loop function
	stroke(255);
	strokeWeight(1);
	textAlign(CENTER);

}

let temp = 0;

function draw() {

	if (finishedDrawing) {
		temp = frameCount % 255;
		graphs[temp].display();
		graphs[temp].infos();
	}
}

function drawData(data) {

	// create the graphs based on data
	let typePos = 0; // a variable to place the type in a circle
	for (let key in data) {
		let size = map(data[key], 1, 110, 10, width - 30);
		let newGraph = new Graph(width / 2, height / 2, size, key, typePos);
		graphs.push(newGraph);

		if (typePos < 9) {
			typePos++
		} else {
			typePos = 0;
		}
	}
	finishedDrawing = true;
}

class Graph {
	constructor(x, y, rad, label, typePos) {

		this.x = x;
		this.y = y;
		this.rad = rad;
		this.label = label;
		this.typePos = typePos;

		this.szDelta = this.rad * 0.1; // Set the displace amount 35% of the radius
		this.graphObj = [];

		// constants
		this.res = 10; // the number of points 
		this.angle = 360 / this.res; // angular distance between each point
	}

	display() {
		push();
		fill(0);
		stroke(255);
		// translate the screen coordinate from top-left to middle of the canvas
		translate(this.x, this.y);

		// start to draw custom shape
		beginShape();
		for (var i = 0;i < this.res;i++) {
			// var randRad = min(this.rad, this.rad + random(-this.szDelta, this.szDelta));
			this.graphObj.push({
				"rad": this.rad,
				"x": this.rad * cos(this.angle * i),
				"y": this.rad * sin(this.angle * i)
			});
			// add points to the custom shape
			vertex(this.graphObj[i].x, this.graphObj[i].y);

		}
		vertex(this.graphObj[0].x, this.graphObj[0].y);
		vertex(this.graphObj[1].x, this.graphObj[1].y);
		vertex(this.graphObj[2].x, this.graphObj[2].y);

		endShape(); // we finish adding points
		pop();
	}

	infos() {
		for (let graph = 0;graph < this.graphObj.length;graph++) {
			const typeX = this.graphObj[graph]['x'];
			const typeY = this.graphObj[graph]['y'];

			push();
			// translate the screen coordinate from top-left to middle of the canvas
			translate(this.x, this.y);

			fill(255);
			noStroke();
			let rw = textWidth(this.label) + 20;
			let rh = 20;
			rect(typeX - rw/2.22, typeY - 17, rw, rh)

			noStroke();
			fill(0);
			text(this.label, typeX + 3, typeY - 3);
			pop();
		}
	}

}

// ---------------------------------------------------------------------------------------------------------

function keyPressed() {
	if (key == 'S') {

		var today = new Date();
		var dd = String(today.getDate()).padStart(2, '0');
		var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
		var yyyy = today.getFullYear();
		var hh = String(today.getHours())
		var min = String(today.getMinutes())
		var sec = String(today.getSeconds())

		today = mm + '/' + dd + '/' + yyyy;
		let filename = yyyy + '-' + mm + '-' + dd + '-' + hh + '-' + min + '-' + sec;

		console.log(key)
		saveCanvas(cnv, filename, 'jpg');
	}
}


// function to count all unique values in an array of objects 
function countUniqueValues(arr) {
	let uniqueValues = {};
	for (let i = 0;i < arr.length;i++) {
		let concepts = arr[i];

		concepts['schema:about'].forEach(element => {
			let concept = element['display_title'];
			if (!uniqueValues[concept]) {
				uniqueValues[concept] = 1;
			} else {
				uniqueValues[concept]++;
			}
		});
	}
	delete uniqueValues['Frau'];
	return uniqueValues;
}

function sortDescending(obj) {
	return Object.keys(obj).sort((a, b) => obj[b] - obj[a]).reduce((acc, key) => {
		acc[key] = obj[key];
		return acc;
	}, {});
}

function sortAscending(obj) {
	return Object.keys(obj).sort((a, b) => obj[a] - obj[b]).reduce((acc, key) => {
		acc[key] = obj[key];
		return acc;
	}, {});
}
