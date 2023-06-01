const url = "../00_datasets/sgv-12-objects-about-Mann-Frau-counted-prunned.json"

let data;
let cnv;

let resX;
let resY;
let stepX;
let stepY;
let arks = [];
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
	// angleMode(DEGREES);
	noStroke();
	// DIFFERENCE; EXCLUSION; SCREEN; REPLACE

	resX = 10;
	resY = 40;
	stepX = width / resX;
	stepY = height / resY;

	// create all positions
	for (let posX = 0; posX < width; posX += stepX) {
		for (let posY = 0; posY < height; posY += stepY) {
			const pos = { 'x': posX, 'y': posY }
			positions.push(pos);
		}
	}

	// create all arks, add the positions + rotate from data
	positions.forEach( (pos, indx) => {
		const item = data[indx];
		const widthMen = map(item.men, 0, maxVal, 2, width)
		const widthWomen = map(item.women, 0, maxVal, 2, width);
		const label = data[indx].label;

		const obj = new Ark(pos.x, pos.y, widthMen, widthWomen, stepY * 2, label);
		arks.push(obj);
	});

	// display all
	arks.forEach(ark => {
		ark.display();
	})

}


class Ark {
	constructor(x, y, wMen, wWomen, h, label) {
		this.x = x;
		this.y = y;
		this.wMen = wMen;
		this.wWomen = wWomen;
		this.h = h;
		this.label = label;
	}

	display() {
		// men
		// arc(300, 300, 100, 300, PI, TWO_PI)
		// fill(255,113,206);
		// stroke(255, 255, 0)
		// rect(this.x, this.y, this.h, this.h);

		push();
		blendMode(EXCLUSION)
		translate(this.x + this.wMen/2, this.y + stepY)
		fill(255,113,206);
		arc(0, 0, this.wMen, this.h, PI, TWO_PI)
		pop();

		// women
		push();
		blendMode(EXCLUSION)
		translate(this.x + this.wWomen/2, this.y + stepY)
		fill(5,255,161)
		arc(0, 0, this.wWomen, this.h, PI, TWO_PI)
		pop();


		// label
		// blendMode(REMOVE)
		push();
		translate(this.x, this.y)
		fill(255);
		textSize(7);
		text(this.label, 0, 0);
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