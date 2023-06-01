const url = "../00_datasets/sgv-12-objects-about-Frau.json"

let loaded = false;
let loadedData;
let testUrl = 'https://sipi.participatory-archives.ch/SGV_12/SGV_12N_00003.jp2/full/640,/0/default.jpg';
let img; 

function preload() {

  fetch(url)
    .then(res => res.json())
    .then(data => {
			console.log(data)
			loadedData = data;
			loaded = true;
		})
}

let stepSize; 

function setup() {
	createCanvas(640, 640);
	background(0);
	textFont('Everett');
	textAlign(CENTER);
	color(255);
	frameRate(2);
	stepSize = width/20;	
}

let imgIndx = 0;
let steps = 10;
let dim = 640;

function draw(){
	if(loaded){
		getImgUrl(imgIndx).then((imgObj) => {
			loadImage(imgObj.url, (result) => {
				let xPos = (width/2) - (dim/2);
				let yPos = (height/2) - (dim/2);
				const img = imgObj.url;
				image(result, xPos, yPos, dim, dim, 0, 0, result.width, result.height, COVER);
				// textSize(32);
				// text(imgObj.title, width/2, width/2);
				// imgObj.tags.forEach(element => {
				// 	text(element, random(0, width), random(0, height));
				// });
				imgIndx++;
				// console.log(imgIndx);
				dim = dim - stepSize;
				if(dim < stepSize){
					dim = 640;
				};
			});
		});
	}
}

function getImgUrl(imgIndx) {
	let imgUrl = loadedData[imgIndx]['schema:image'][0]['@id'] + '/full/640,/0/default.jpg';
	let imgTitle = loadedData[imgIndx]['o:title'];
	
	let imgTags = []
	loadedData[imgIndx]['schema:about'].forEach(element => {
		imgTags.push(element['display_title'])	
	});

	let imgData = {
		url: imgUrl,
		title: imgTitle,
		tags: imgTags
	}
	return Promise.resolve(imgData);

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