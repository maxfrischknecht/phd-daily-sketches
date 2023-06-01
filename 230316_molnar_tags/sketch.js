const url = "../00_datasets/sgv-12-objects-about-Mann-Frau-counted-prunned.json"

let data;
let cnv;

let res;
let margin;
let thickness;
let step;
let bars = [];
let positions = [];
let maxVal;

function preload() {
	loadJSON(url, (res) => {
		data = Object.values(res);
		let maxMen = findHighestValue(data, 'men')
		let maxWomen = findHighestValue(data, 'women')
		if (maxMen < maxWomen) {
			maxVal = maxWomen;
		} else {
			maxVal = maxMen;
		}
		console.log(maxVal)
	})
}
function setup() {
	cnv = createCanvas(640, 640);
	background(0);
	textFont('Everett Mono');
	angleMode(DEGREES);
	noStroke();

	res = 10;
	step = width / res;
	margin = 10
	thickness = 20;

	// create all positions
	for (let posX = 0; posX < width; posX += step) {
		for (let posY = 0; posY < height; posY += step) {
			const pos = { 'x': posX, 'y': posY }
			positions.push(pos);
		}
	}

	// create all bars, add the positions + rotate from data
	positions.forEach( (pos, indx) => {
		const item = data[indx];
		const angMen = map(item.men, 0, maxVal, 0, -90);
		const angWomen = map(item.women, 0, maxVal, 0, -90);
		const label = data[indx].label;

		const obj = new Bar(pos.x, pos.y, angMen, angWomen, step-margin, thickness, label);
		bars.push(obj);
	});

	// display all
	bars.forEach(bar => {
		bar.display();
	})

}


class Bar {
	constructor(x, y, ang1, ang2, w, h, label) {
		this.x = x;
		this.y = y;
		this.ang1 = ang1;
		this.ang2 = ang2;
		this.w = w;
		this.h = h;
		this.label = label;
	}

	display() {
		// men
		push();
		fill(255,113,206);
		translate(this.x + step/2, this.y + step/2)
		angleMode(DEGREES)
		rectMode(CENTER);
		rotate(this.ang1);
		rect(0, 0, this.w, this.h);
		pop();

		// women
		push();
		translate(this.x + step/2, this.y + step/2)
		angleMode(DEGREES)
		rectMode(CENTER);
		textAlign(CENTER);
		rotate(this.ang2);
		fill(5,255,161)
		rect(0, 0, this.w, this.h);
		fill(10);
		textSize(6);
		text(this.label, 0, 0 + 2);
		pop();
	}
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