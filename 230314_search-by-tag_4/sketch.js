// const url1 = "../00_datasets/sgv-12-objects-about-Mann.json"
// const url2 = "../00_datasets/sgv-12-objects-about-Frau.json"

let currentData;
let cnv;
let startLoc;
let noff;

let menData;
let womenData = [];

function preload() {

	loadJSON('../00_datasets/sgv-12-objects-about-Frau.json', (res) => {
		let arr = Object.values(res);
		console.log("women json: ", arr)
		arr.forEach(element => {
			let id = element['schema:identifier'][0]['@value'];
			let tags = element['schema:about']
			let img = loadImage('../00_datasets/images-women/' + id + '.jpg')
			let obj = { img: img, tags: tags };
			womenData.push(obj);
		});
	});
}

let labGr;
let lineGr;

function setup() {
	cnv = createCanvas(640, 640);
	background(0);
	frameRate(1);
	labGr = createGraphics(640, 640);
	lineGr = createGraphics(640, 640);

	currentData = womenData;

	startLoc = createVector(width / 2, height / 2);
	noff = createVector(random(600), random(600))
}


let indx = 0;
let pos = [];
let curPos;
let lastPos;
let lastObj = ''

function draw() {
	// select a random tag from a data array
	let ranItem = randomItemFromData(currentData, lastObj);
	lastObj = ranItem;

	image(ranItem.img, 0, 0);

	// // get a new random position
	getNewPosition()

	// // draw a line between the currrent & the last label
	if (pos.length > 1) {
		drawLine(pos[indx - 1], pos[indx]);
	}

	if (frameCount % 50 == 0) {
		clear();
		labGr.clear();
		lineGr.clear();
		background(0);
	}

	// // draw the label
	drawLabel(ranItem);
	// // search for data that holds this tag as well
	let newData = findRelatedData(ranItem)

	// // set the new input for the next loop
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
	location.y = random(50, height - 50)
	pos.push({ 'x': location.x, 'y': location.y })
	// noff.add(0.9, 0.9);
}

function drawLine(prev, current) {

	lineGr.stroke(255, 0, 0);
	lineGr.strokeWeight(1);
	lineGr.strokeCap(ROUND);
	lineGr.noFill();
	// line(prev.x, prev.y, current.x, current.y);

	lineGr.beginShape();
	lineGr.curveVertex(int(prev.x) + random(-800, 800), int(prev.y) + random(-800, 800));
	lineGr.curveVertex(int(prev.x), int(prev.y));
	lineGr.curveVertex(int(current.x), int(current.y));
	lineGr.curveVertex(int(current.x) + random(-800, 800), int(current.y) + random(-800, 800));
	lineGr.endShape();

	image(lineGr, 0, 0);

}

function drawLabel(obj) {
	let tag = obj.tag

	let labelWidth = labGr.textWidth(tag)

	// draw the label background
	labGr.textFont('Everett Mono');
	labGr.fill(0);
	// noStroke();
	labGr.stroke(255);
	labGr.strokeWeight(1);
	let rw = labelWidth + 20;
	let rh = 20;
	labGr.rect(pos[indx].x - rw / 2, pos[indx].y - 11, rw, rh, 0)

	// draw the label
	labGr.textSize(12);
	labGr.textAlign(CENTER, CENTER);
	labGr.fill(255);
	labGr.noStroke();
	labGr.text(tag, pos[indx].x, pos[indx].y)
	image(labGr, 0, 0);
}

// select a random tag from an input
function randomItemFromData(input, lastObj) {
	console.log(input)
	// select a random item
	let ranItemIndx = int(random(0, input.length))
	let randomItem = input[ranItemIndx];

	// select all unused tag (no duplicates)
	let possibleTags = [];
	randomItem.tags.forEach(tag => {
		newTag = tag['display_title'];
		if (newTag != lastObj.tag) {
			possibleTags.push(newTag);
		}
	});

	// select a random tag
	let tagIndx = int(random(0, possibleTags.length));
	let selectedTag = possibleTags[tagIndx];

	// construct the item to be returned
	let obj = { 'img': randomItem.img, 'tag': selectedTag }

	// // console.log("old selection", selectedTag, lastTag)
	return obj;
}

// find a item with the same tag
function findRelatedData(currentItem) {
	let foundItem = [];
	womenData.forEach(item => {
			item['tags'].forEach(tag => {
				if (currentItem.tag == tag['display_title']) {
					foundItem.push(item);
				}
			});
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