const url = "../00_datasets/sgv-12-objects-about-Mann-Frau-combined-count-pruned.json"

let data;
let cnv;
let womenData = [];
let classifier;

function preload() {
	loadJSON('../00_datasets/sgv-12-objects-about-Frau.json', (res) => {
		let arr = Object.values(res);

		// for (let index = 0;index < 5;index++) {
		// 	const element = arr[index];
		// 	let id = element['schema:identifier'][0]['@value'];
		// 	let tags = element['schema:about']
		// 	let img = loadImage('../00_datasets/images-women/' + id + '.jpg')
		// 	let obj = { img: img, tags: tags };
		// 	womenData.push(obj);
		// }

		arr.forEach(element => {
			let id = element['schema:identifier'][0]['@value'];
			let tags = element['schema:about']
			let img = loadImage('../00_datasets/images-women/' + id + '.jpg')
			let obj = { img: img, tags: tags };
			womenData.push(obj);
		});
	});
}
function setup() {
	cnv = createCanvas(640, 640);
	background(0);
	textFont('Everett Medium');
	console.log("women json: ", womenData);

	// load the model
	classifier = ml5.imageClassifier('MobileNet', makePrediction);

	// image(womenData[2].img, 0, 0, 640, 640);
	// drawLabels();

}


function makePrediction() {
	// select a random image
	const ranIndx = int(random(0, womenData.length - 1));
	const randomImg = womenData[ranIndx].img;
	const ranTag = womenData[ranIndx].tags;

	// make a prediction
	classifier.classify(randomImg, (err, result) => {
		// draw the image
		image(randomImg, 0, 0, 640, 640)

		console.log(result)

		// draw the labels
		if (result === undefined) {
			console.log("no result")
		} else {
			drawLabels(result, ranTag);
		}
		// repeat
		setTimeout(() => {
			makePrediction();
		}, 5000);

	})
}

function drawLabels(aiLabels, sgvLabels) {
	textSize(64);
	textLeading(64);
	textAlign(LEFT, TOP);
	textAlign(CENTER);
	noStroke();


	// draw 3 AI labels
	let posY = 10;
	let posX = width / 2;
	let step = 64;
	fill(255, 255, 0);

	aiLabels.forEach(element => {
		let firstLabel = element.label.split(',')[0];
		let label = firstLabel.charAt(0).toUpperCase() + firstLabel.slice(1);

		let subs = element.confidence.toString().substring(2, 4);
		let conf = subs + '%'
		let str = conf + ' ' + label;

		text(str, posX, posY);
		posY += step;
	});

	// draw 3 human labels

	let posY2 = height / 2 + 125;
	let posX2 = width / 2;
	let step2 = 64;
	fill(255, 255, 0);
	for (let index = 0;index < 3;index++) {
		const element = sgvLabels[index];
		let label2 = element.display_title;
		text(label2, posX2, posY2);
		posY2 += step2;

	}

}

// function drawLabels2(sgvLabels) {
// 	let posY2 = height / 2;
// 	let posX2 = width / 2;
// 	let step2 = 64;
// 	fill(255, 255, 0);
// 	noStroke();
// 	// draw human labels
// 	sgvLabels.forEach(element => {
// 		let label2 = element.display_title;
// 		text(label2, posX2, posY2);
// 		posY2 += step2;
// 	})
// }



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