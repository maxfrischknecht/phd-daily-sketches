const url1 = "../00_datasets/sgv-12-objects-about-Mann.json"
const url2 = "../00_datasets/sgv-12-objects-about-Frau.json"

let allData;
let currentData;
let cnv;
let startLoc;
let noff;

let menData;
let womenData;


function preload() {
	loadJSON(url1, (res) => {
		menData = Object.values(res)
	})
	loadJSON(url2, (res) => {
		womenData = Object.values(res)
	})
}

function setup() {
	cnv = createCanvas(640, 640);
	background(0);
	textFont('Everett Mono');
	frameRate(1);
	allData = menData.concat(womenData)
	currentData = allData;
	startLoc = createVector(width / 2, height / 2);
	noff = createVector(random(600), random(600))
}


let indx = 0;
let pos = [];
let curPos;
let lastPos;
let lastTag = ''

function draw() {
	fill('rgba(0,0,0, 0.05)');
	rect(0, 0, width, height);

	// select a random tag from a data array
	let ranTag = ranTagFromData(currentData, lastTag);
	lastTag = ranTag;

	// get a new random position
	getNewPosition()

	// draw a line between the currrent & the last label
	if (pos.length > 1) {
		drawLine(pos[indx - 1], pos[indx]);
	}

	if (frameCount % 10 == 0) {
		clear();
		background(0);
	}

	// draw the label
	drawLabel(ranTag);

	// search for data that holds this tag as well
	let newData = findRelatedData(ranTag)

	// set the new input for the next loop
	currentData = newData;

	// keep track
	indx++

}

function getNewPosition() {

	// location.x = map(noise(noff.x), 0, 1, 0, width);
	// location.y = map(noise(noff.y), 0, 1, 0, height);

	// let xoff = 0.0;
	// xoff = xoff + 0.01;
	// let horiz = noise(xoff) * width;
	// let vert = noise(xoff) * height;

	location.x = random(50, width - 50);
	location.y = random(50, height-50)
	pos.push({ 'x': location.x, 'y': location.y })
	// noff.add(0.9, 0.9);
}

function drawLine(prev, current) {

	stroke(255);
	strokeWeight(1);
	strokeCap(ROUND);
	noFill();

	beginShape();
	curveVertex(int(prev.x) + random(-800, 800), int(prev.y) + random(-800, 800));
	curveVertex(int(prev.x), int(prev.y));
	curveVertex(int(current.x), int(current.y));
	curveVertex(int(current.x) + random(-800, 800), int(current.y) + random(-800, 800));
	endShape();

}

function drawLabel(tag) {

	let labelWidth = textWidth(tag)

	// draw the label background
	fill(0);
	// noStroke();
	stroke(255);
	strokeWeight(1);
	let rw = labelWidth + 18;
	let rh = 20;
	rect(pos[indx].x - rw / 2, pos[indx].y - 11, rw, rh, 0)

	// draw the label
	textSize(12);
	textAlign(CENTER, CENTER);
	fill(255);
	noStroke();
	text(tag, pos[indx].x, pos[indx].y)
}

// select a random tag from an input
function ranTagFromData(input, lastTag) {
	// select a random item from the available data
	let ranItemIndx = int(random(0, input.length))
	let tags = input[ranItemIndx]['schema:about']

	// currentImageID = input[ranItemIndx]['schema:identifier'][0]['@value'];

	// select a random tag from that data
	let possibleTags = [];
	tags.forEach(tag => {
		newTag = tag['display_title'];
		if (newTag != lastTag) {
			possibleTags.push(newTag);
			// console.log("new selection:", newTag, lastTag)
		}
	});

	let tagIndx = int(random(0, possibleTags.length));
	let selectedTag = possibleTags[tagIndx];
	// console.log("old selection", selectedTag, lastTag)
	return selectedTag;
}

// find a item with the same tag
function findRelatedData(input) {
	let foundItem = [];
	allData.forEach(item => {
		if (item['schema:about']) {
			item['schema:about'].forEach(tag => {
				if (input == tag['display_title']) {
					// console.log("found: ", input, tag['display_title'])
					foundItem.push(item);
				}
			});
		}
	});
	return foundItem;
}

function keyPressed() {
	if (key == 's') {

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