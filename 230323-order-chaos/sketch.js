const url = "../00_datasets/sgv-12-objects-about-Mann-Frau-counted-prunned.json"

let data;
let cnv;
let count = 10;

function preload() {
	loadJSON(url, (res) => {
		data = Object.values(res);
		console.log(data)
	})
}
function setup() {
	cnv = createCanvas(640, 640);
	background(200);
	textFont('Everett Mono');
	// orderRect();
	// randomRect();
	noiseRect();
}


function noiseRect() {
	let res = 5; // 25
	let step = width / res;
	let size = 50;
	rectMode(CENTER);
	let xoff = 0.0;

	for (let posY = 0;posY < height;posY += step) {
		for (let posX = 0;posX < width;posX += step) {


			fill(0);
			// noStroke();
			push();
			// translate(step / 2, step / 2)
			xoff = xoff + 0.3;
			let horiz = noise(xoff) * 300;
			let vert = noise(xoff) * 300;
			console.log("vert:", vert, "horiz: ", horiz)
			rect(posX + horiz, posY + vert, size, size);
			pop();
		}
	}
}

function randomRect() {
	let size = 50;

	for (let i = 0;i < 25;i++) {
		fill(0);
		noStroke();
		rect(random(width - size), random(height - size), size, size);
	}
}


function orderRect() {
	let res = 5; // 25
	let step = width / res;
	let size = 50;
	rectMode(CENTER);

	for (let posY = 0;posY < height;posY += step) {
		for (let posX = 0;posX < width;posX += step) {
			fill(0);
			noStroke();
			push();
			translate(step / 2, step / 2)
			rect(posX, posY, size, size);
			pop();
		}
	}
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