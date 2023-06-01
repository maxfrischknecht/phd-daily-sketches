const url = "../00_datasets/sgv-12-objects-about-Mann-Frau-combined-count-pruned.json"
 
let data;
let maxVal;
let cnv;

function preload() {
	loadJSON(url, (res) => {
		let arr = Object.values(res);
		data = sortDescending(arr, 'count');
		maxVal = findHighestValue(arr, 'count')
		console.log(maxVal)
	})
}

function setup() {
	// createCanvas(windowWidth, windowHeight);
	cnv=createCanvas(800, 800);
	background(0);
	textFont('Everett Mono');
	noStroke();
	drawBars();
	// colorMode(HSB, 255);
}

function drawBars() {

	colorMode(HSB, 255);
	textAlign(CENTER, CENTER);
	textSize(12); // 12, 18
	// rectMode(CENTER);

	let posX = width / 2;

	let maxItems = 40; // 40, 20
	let step = height / maxItems;

	let rw = 180; // 180, 250
	let rh = step;

	let indx = 0;

	for (let posY = 0;posY < width;posY += step) {
		let item = data[indx];

		rectMode(CENTER);
		// draw center bar
		let colValW = map(item.count, 1, maxVal, 0, 255);
		fill(250, colValW, 255)
		// fill(255)
		stroke(0);
		let rSize = map(item.count, 1, maxVal, rw, width)
		console.log(item.count, maxVal)
		rect(posX, posY + rh/2, rSize, rh, 20);

		// draw left bar
		// let colValM = map(item.men, 1, maxVal, 0, 255);
		// fill(250, colValM, 255)
		// stroke(0);
		// let lSize = map(item.men, 1, maxVal, 0, (width / 2) - rw / 2)
		// let rPosX = posX - rw / 2 - lSize;
		// rect(rPosX, posY, lSize, rh, 20)

		rectMode(CORNER);

		// draw the label box
		fill(0);
		stroke(255);
		rect(posX - rw / 2, posY, rw, rh, 0)

		// draw the label
		fill(255);
		noStroke();
		text(item.label, posX, posY + rh / 2 + 1);

		// progress with items
		indx++;

	}

	// data.forEach((item, index) => {
	// 	// draw the labels
	// 	fill(255);
	// 	stroke(0);
	// 	let rw = 100;
	// 	let rh = 20;
	// 	rect(posX - rw / 2, posY, rw, rh, 0)
	// 	fill(0);
	// 	noStroke();
	// 	text(item.label, posX, posY - 7);

	// 	// draw right bar
	// 	fill(0, 0, 255)
	// 	let rSize = map(item.women, 1, maxVal, 10, width/2)
	// 	rect(posX + rw/2, posY, rSize, rh, 20);

	// 	// draw left bar
	// 	fill(255, 0, 0)
	// 	let lSize = map(item.men, 1, maxVal, 10, width/2)
	// 	let rPosX = posX - rw/2 - lSize;
	// 	rect(rPosX, posY, lSize, rh, 20)

	// 	posY += labelHeight



	// });
}

function sortDescending(arr, key) {
	return arr.sort((a, b) => (a[key] < b[key]) ? 1 : -1);
}

function findHighestValue(arr, key) {
	let highestValue = 0;
	for (let i = 0;i < arr.length;i++) {
		if (arr[i][key] > highestValue) {
			highestValue = arr[i][key];
		}
	}

	return highestValue;
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