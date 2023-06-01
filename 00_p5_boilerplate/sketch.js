const url = "../00_datasets/sgv-12-objects-about-Mann-Frau-combined-count-pruned.json"
 
let data;
let cnv;

function preload() {
	loadJSON(url, (res) => {
		data = Object.values(res);
		console.log(data)
	})
}
function setup() {
	cnv = createCanvas(640, 640);
	background(0);
	textFont('Everett Mono');
}

function draw() {

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