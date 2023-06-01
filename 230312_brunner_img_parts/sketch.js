const url = "../00_datasets/sgv-12-objects-about-Frau.json"

let womenObj;
let womenData;
let menObj;
let menData;

let menImgs = [];
let womenImgs = [];

function preload() {
	// https://www.freecodecamp.org/news/how-to-iterate-over-objects-in-javascript/
	womenObj = loadJSON('../00_datasets/sgv-12-objects-Frau-ArbeiterIn.json', (res) => {
		womenData = Object.values(res);
		console.log("women json: ", womenData)
		womenData.forEach(element => {
			let id = element['schema:identifier'][0]['@value'];
			let tags = element['schema:about']
			let img = loadImage('../00_datasets/images-women/' + id + '.jpg')
			let obj = {img: img, tags: tags};
			womenImgs.push(obj);
		});
	});
	menObj = loadJSON('../00_datasets/sgv-12-objects-Mann-ArbeiterIn.json', (res) => {
		menData = Object.values(res);
		console.log("men json: ", menData)
		menData.forEach(element => {
			let id = element['schema:identifier'][0]['@value'];
			let tags = element['schema:about']
			let img = loadImage('../00_datasets/images-men/' + id + '.jpg')
			let obj = {img: img, tags: tags};
			menImgs.push(obj);
		});
	});
}

let imgPos = [];
let res = 6;
let step;

function setup() {
	createCanvas(640, 640);
	background(0);
	textFont('Everett');
	frameRate(2);
	noStroke();
	textAlign(CENTER);

	step = width / (res / 2);
	for (let posX = 0;posX < width;posX += step) {
		for (let posY = 0;posY < height;posY += step) {
			let posXY = {x: posX, y: posY};
			imgPos.push(posXY);
		}
	}

}

let showWomen = true;
let selectImgArr;

function draw() {
	// url, drawPos X / Y, drawSize W / H, srcStart X / Y, srcSize W / H
	// image(menImgs[5], 0, 0, width, height);

	imgPos.forEach((p, i) => {

		if(showWomen) {
			selectImgArr = womenImgs;
		} else {
			selectImgArr = menImgs;
		}
		image(selectImgArr[i]['img'], p.x, p.y, step, step, 0, 0, 640, 640);
		showWomen = !showWomen;

		push();
		translate(step/2, step/2);

		// select a random tag
		let tagArr = selectImgArr[i]['tags']
		let ranTag = int(random(0, tagArr.length)) 
		let label = tagArr[ranTag]['display_title'];

		fill(255);
		stroke(0);
		let rw = textWidth(label) + 20;
		let rh = 20;
		rect(p.x - rw/2, p.y - 14, rw, rh, 20)

		fill(0);
		noStroke();
		// console.log(tagArr)
		text(label, p.x, p.y)
		pop();
	});
}


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