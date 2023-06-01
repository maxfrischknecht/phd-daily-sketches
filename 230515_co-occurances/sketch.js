const url = "../00_datasets/SGV_12N_keyword_cooccurrences.json"
 
let data;
let cnv;
let noff;

function preload() {
	loadJSON(url, (res) => {
		data = Object.values(res);
		data.sort((a, b) => b['Co-occurrences Count'] - a['Co-occurrences Count'] )
		console.log(data)
	})
}
function setup() {
	cnv = createCanvas(640, 640);
	background(0);
	textFont('Everett Mono');
	noff = createVector(random(600), random(600))
	frameRate(5);
}

function draw() {
	fill('rgba(0,0,0, 0.1)');
	rect(0, 0, width, height);

	let ranObj = data[int(random(0, data.length-1))];
	let posA = getNewPosition();
	let posB = getNewPosition();
	drawLine(posA, posB, ranObj["Co-occurrences Count"])
	drawLabel(ranObj['Keyword A'], posA)
	drawLabel(ranObj['Keyword B'], posB)
	
	// console.log(ranObj['Keyword A'])

}

function getNewPosition() {
	let x = map(noise(noff.x), 0, 1, 0, width);
	let y = map(noise(noff.y), 0, 1, 0, height);
	let location = createVector(x, y)
	noff.add(0.9, 0.9);
	return location

}

function drawLabel(tag, position) {

	let labelWidth = textWidth(tag)

	// draw the label background
	fill(0);
	// noStroke();
	stroke(255);
	strokeWeight(1);
	let rw = labelWidth + 20;
	let rh = 24;
	rect(position.x - rw / 2, position.y - 13, rw, rh, 0)

	// draw the label
	textSize(12);
	textAlign(CENTER, CENTER);
	fill(255);
	noStroke();
	text(tag, position.x, position.y)
}

function drawLine(prev, current, conWeight) {

	let w = int(map(conWeight, 0, 716, 2, 100))
	let c = int(map(conWeight, 0, 716, 0, 255))
	console.log(c)
	stroke(255, c, c);
	strokeWeight(w);
	strokeCap(ROUND);
	noFill();

	beginShape();
	curveVertex(int(prev.x) + random(-800, 800), int(prev.y) + random(-800, 800));
	curveVertex(int(prev.x), int(prev.y));
	curveVertex(int(current.x), int(current.y));
	curveVertex(int(current.x) + random(-800, 800), int(current.y) + random(-800, 800));
	endShape();

}


function keyPressed() {
	if (key == 's') {

		var today = new Date();
		var dd = String(today.getDate()).padStart(2, '0');
		var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
		var yyyy = today.getFullYear();
		var hh =  String(today.getHours())
		var min =  String(today.getMinutes())
		var sec =  String(today.getSeconds())
		
		today = mm + '/' + dd + '/' + yyyy;
		let filename = yyyy + '-' + mm + '-' + dd + '-' + hh + '-' + min + '-' + sec; 

		console.log(key)
		saveCanvas(cnv, filename, 'jpg');
	}
}