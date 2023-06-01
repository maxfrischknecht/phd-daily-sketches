const url = "../00_datasets/sgv-12-objects-about-Mann-Frau-counted-prunned.json"

let data;
let cnv;
let maxVal;

function preload() {
	loadJSON(url, (res) => {
		data = Object.values(res);
		let maxF = findHighestValue(data, 'women')
		let maxM = findHighestValue(data, 'men')
		if (maxF > maxM) {
			maxVal = maxF;
		} else {
			maxVal = maxM
		}
	})
}
function setup() {
	cnv = createCanvas(640, 640);
	background(0);
	textFont('Everett Mono');
	frameRate(15);
}


let indx = 0;
let item;
let startPos = 18;
let posY = startPos;
let step = 18;
function draw() {
	textSize(12);
	rectMode(CENTER);
	textAlign(CENTER);

	item = data[indx];
	data[indx]

	let posX = width / 2;
	let rw = textWidth(item.label) + 12;

	// difference between the vals
	let diff = difference(item.men, item.women)
	let offset = map(diff, 1, maxVal, 0, width)

	// left label
	stroke(0);
	fill(255)
	let leftX = (posX - rw) - offset / 2
	rect(leftX, posY - 4, rw, step);
	fill(0)
	noStroke();
	text(item.label, leftX, posY)

	// right
	stroke(0);
	fill(255)
	let rightX = (posX + rw) + offset / 2
	rect(rightX, posY - 4, rw, step);
	fill(0)
	noStroke();
	text(item.label, rightX, posY)

	// connection
	// stroke(255);
	// line(leftX + rw/2, posY - 4, rightX - rw/2, posY - 4);



	// Resetting stuff
	if (indx < data.length - 1) {
		indx++
	} else {
		console.log("reset!")
		indx = 0;
	}

	if (posY <= height) {
		posY += step
	} else {
		// saveImage();
		background(0);
		posY = startPos;
	}
}

function difference(a, b) { return Math.abs(a - b); }

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

function saveImage(){
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