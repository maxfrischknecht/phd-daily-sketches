const url = "../00_datasets/sgv-12-objects-about-Mann-Frau-combined-count-pruned.json"

let data;
let cnv;

/*
A 6” (15 cm) grid covering the walls. Lines from corners, sides, and center of the walls to random points on the grid.
1st wall: Red lines from the midpoints of four sides;
2nd wall: Blue lines from the four corners;
3rd wall: Yellow lines from the center;
4th wall: Red lines from the midpoints of four sides, blue lines from four corners;
5th wall: Red lines from the midpoints of four sides, yellow lines from the center;
6th wall: Blue lines from four corners, yellow lines from the center;
7th wall: Red lines from the midpoints of four sides, blue lines from four corners, yellow lines from the center.
Each wall has an equal number of lines. (The number of lines and their length are determined by the draftsman.)
*/

let res;
let step;
let gridPos = []
let lineNum;
let cBlue;
let cRed;
let cYellow;
let mdp;
let crn;
let cntr;
let num;

function preload() {
	loadJSON(url, (res) => {
		data = Object.values(res);
		console.log(data)
	})
}
function setup() {
	cnv = createCanvas(640, 640);
	background(255);
	textFont('Everett Mono');

	cBlue = color(0, 0, 255);
	cRed = color(255, 0, 0);
	cYellow = color(255, 255, 0);
	num = 5;
	strokeWeight(2);
	strokeCap(ROUND);

	// create the basic grid
	res = 10; // results in + 1, must be divideable by 2
	step = width / res;
	console.log(step)
	for (let posY = 0;posY < height + 1;posY += step) {
		for (let posX = 0;posX < width + 1;posX += step) {
			const pos = { 'x': posX, 'y': posY }
			gridPos.push(pos);
		}
	}

	// create midpoints
	mdp = {
		'tc': gridPos[int(res / 2)],
		'lc': gridPos[int(gridPos.length / 2) - int(res / 2)],
		'rc': gridPos[int(gridPos.length / 2) + int(res / 2)],
		'bc': gridPos[gridPos.length - int(res / 2) - 1]
	}

	// create corners
	crn = {
		'tl': gridPos[0],
		'tr': gridPos[res],
		'bl': gridPos[gridPos.length - (res + 1)],
		'br': gridPos[gridPos.length - 1]
	}

	// create center
	cntr = gridPos[int(gridPos.length / 2)]

	// drawControlGrid();
	// firstWall();
	// secondWall();
	// thirdWall();
	seventhWall();
}

// 1st wall: Red lines from the midpoints of four sides;
function firstWall() {
	stroke(cRed);

	for (let i = 0;i < num;i++) {
		let ranP1 = gridPos[int(random(0, gridPos.length - 1))];
		line(mdp.tc.x, mdp.tc.y, ranP1.x, ranP1.y);

		let ranP2 = gridPos[int(random(0, gridPos.length - 1))];
		line(mdp.lc.x, mdp.lc.y, ranP2.x, ranP2.y);

		let ranP3 = gridPos[int(random(0, gridPos.length - 1))];
		line(mdp.rc.x, mdp.rc.y, ranP3.x, ranP3.y);

		let ranP4 = gridPos[int(random(0, gridPos.length - 1))];
		line(mdp.bc.x, mdp.bc.y, ranP4.x, ranP4.y);
	}
}

// 2nd wall: Blue lines from the four corners;
function secondWall() {
	stroke(cBlue);

	for (let i = 0;i < num;i++) {
		let ranP1 = gridPos[int(random(0, gridPos.length - 1))];
		line(crn.tl.x, crn.tl.y, ranP1.x, ranP1.y);

		let ranP2 = gridPos[int(random(0, gridPos.length - 1))];
		line(crn.tr.x, crn.tr.y, ranP2.x, ranP2.y);

		let ranP3 = gridPos[int(random(0, gridPos.length - 1))];
		line(crn.bl.x, crn.bl.y, ranP3.x, ranP3.y);

		let ranP4 = gridPos[int(random(0, gridPos.length - 1))];
		line(crn.br.x, crn.br.y, ranP4.x, ranP4.y);
	}
}

function thirdWall() {
	stroke(cYellow);

	for (let i = 0;i < num;i++) {
		let ranP1 = gridPos[int(random(0, gridPos.length - 1))];
		line(cntr.x, cntr.y, ranP1.x, ranP1.y);
	}
}

// 7th wall: Red lines from the midpoints of four sides, blue lines from four corners, yellow lines from the center.
function seventhWall() {


	for (let i = 0;i < num;i++) {
		// top left corner
		stroke(cBlue);
		let ranCrn1 = gridPos[int(random(0, gridPos.length - 1))];
		line(crn.tl.x, crn.tl.y, ranCrn1.x, ranCrn1.y);

		// mid center
		stroke(cRed);
		let ranMid1 = gridPos[int(random(0, gridPos.length - 1))];
		line(mdp.tc.x, mdp.tc.y, ranMid1.x, ranMid1.y);

		// top right corner
		stroke(cBlue);
		let ranCrn2 = gridPos[int(random(0, gridPos.length - 1))];
		line(crn.tr.x, crn.tr.y, ranCrn2.x, ranCrn2.y);


		// right center
		stroke(cRed);
		let ranMid3 = gridPos[int(random(0, gridPos.length - 1))];
		line(mdp.rc.x, mdp.rc.y, ranMid3.x, ranMid3.y);

		// bottom right corner
		stroke(cBlue);
		let ranCrn4 = gridPos[int(random(0, gridPos.length - 1))];
		line(crn.br.x, crn.br.y, ranCrn4.x, ranCrn4.y);


		// bottom center
		stroke(cRed);
		let ranMid4 = gridPos[int(random(0, gridPos.length - 1))];
		line(mdp.bc.x, mdp.bc.y, ranMid4.x, ranMid4.y);

		// bottom left corner
		stroke(cBlue);
		let ranCrn3 = gridPos[int(random(0, gridPos.length - 1))];
		line(crn.bl.x, crn.bl.y, ranCrn3.x, ranCrn3.y);

		// left left
		stroke(cRed);
		let ranMid2 = gridPos[int(random(0, gridPos.length - 1))];
		line(mdp.lc.x, mdp.lc.y, ranMid2.x, ranMid2.y);

		// center
		stroke(cYellow);
		let ranCen1 = gridPos[int(random(0, gridPos.length - 1))];
		line(cntr.x, cntr.y, ranCen1.x, ranCen1.y);

	}
}

function drawControlGrid() {

	noStroke();

	gridPos.forEach(pos => {
		stroke(255, 0, 0)
		fill(255, 0, 0)
		ellipse(pos.x, pos.y, 5, 5)
	});

	noStroke();
	fill(255, 255, 0)

	// top left corner
	ellipse(crn.tl.x, crn.tl.y, 20, 20);

	// top right corner
	ellipse(crn.tr.x, crn.tr.y, 20, 20);

	// bottom left corner
	ellipse(crn.bl.x, crn.bl.y, 20, 20);

	// bottom right corner
	ellipse(crn.br.x, crn.br.y, 20, 20);

	noStroke();
	fill(255, 0, 255)

	// top center
	ellipse(mdp.tc.x, mdp.tc.y, 20, 20);

	// left center
	ellipse(mdp.lc.x, mdp.lc.y, 20, 20);

	// right center
	ellipse(mdp.rc.x, mdp.rc.y, 20, 20);

	// bottom center
	ellipse(mdp.bc.x, mdp.bc.y, 20, 20);

	fill(0, 0, 255)
	ellipse(cntr.x, cntr.y, 30, 30);

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
		let filename = yyyy + '-' + mm + '-' + dd + '-' + hh + '-' + min + '-' + sec + '-count-' + num;

		console.log(key)
		saveCanvas(cnv, filename, 'jpg');
	}
}