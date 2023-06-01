const url = "../00_datasets/asv-gmd-1941-data.json"
let cnv;

function preload() {
	fetch(url)
		.then(res => res.json())
		.then(data => {
			data.sort(function (a, b) {
				return a['pop-size'] - b['pop-size'];
				// return a['altitude-avg'] - b['altitude-avg'];
			});
			console.log(data.length);
			drawRectangles(data)
		})

}

function setup() {
	cnv = createCanvas(640, 640);
}

let minAlt = 271;
let maxAlt = 2329; // 2944
let minPop = 61;
let maxPop = 18000;

function drawRectangles(data) {
	
	background(255);
	stroke(255);
	strokeWeight(2);
	fill(0);

	let res = 19;
	let w = width / res;
	let h = height / res;
	let x = 0;
	let y = 0;
	let index = 0;

	for (let i = 0;i <= res;i++) {
		for (let j = 0;j <= res;j++) {
			let topVariable = int(map(data[index]['altitude-avg'], minAlt, maxAlt, 0, h / 2));
			let rightVar = 0;
			if (data[index]['pop-size'] != 'unknown') {
				rightVar = int(map(data[index]['pop-size'], minPop, maxPop, 0, w));
			} else {
				console.log("no pop")
				rightVar = 0;
			}
			// // vertex points, im uhrzeiger
			beginShape()
			vertex(x, y);
			// top side extra point
			vertex(x + w / 2, y + topVariable)
			vertex(x + w, y);
			// right side extra point
			// vertex(x + w - rightVar, y + h / 2);
			vertex(x + w, y + h);
			vertex(x, y + h);
			// left side extra point
			vertex(x - rightVar, y + h/2)
			vertex(x, y)
			endShape()

			// update top left vertex coordinated
			x = w * i;
			y = h * j;
			index++
		}
		x = 0;
	}
	noLoop();
}


function keyPressed() {
	if (key == 'S') {

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