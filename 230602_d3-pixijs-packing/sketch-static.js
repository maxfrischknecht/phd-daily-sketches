import * as PIXI from 'pixi.js';
import * as d3 from 'd3'

const url = "230508_AtlasFragekatalog_Prototyp.json"
// Set up the width, height, and color scheme of the visualization
const width = 760; // outer width, in pixels
const	height = 760; // outer height, in pixels

d3.json(url).then(function (data) {
	console.log(data)

	const groupData = d3.group(data, d => d["Kartograph_in"])
	console.log("groupData", groupData)

	const root = d3.hierarchy(groupData)
		.sum((d) => {
			// calculate the 'value' propterty that is needed to calculate the size and position of the circles
			// since there is no "real" value, we take the size of the array of children
			// it's a bit nested and weird, but this works. 
			if (Array.isArray(d)) {
				// console.log(d[1].length)
				return d[1].length;
			} else {
				return 1
			}
		})
		.sort(function (a, b) { return b.value - a.value; });
	console.log("root", root)

	// // Create the pack layout
	const pack = d3.pack()
		.size([width, height])
		.padding(10);

	// // // Apply the pack layout to the data
	pack(root);

	const nodes = root.descendants();
	console.log("nodes", nodes)
	renderCircles(root)

});

// Create a PixiJS application and set up the renderer
const app = new PIXI.Application({
  width: window.innerWidth,
  height: window.innerHeight,
  backgroundColor: 0x000000,
});
document.body.appendChild(app.view);

// Create a container to hold the circles
const circlesContainer = new PIXI.Container();
app.stage.addChild(circlesContainer);

// Create a function to render the circles based on the packed data
function renderCircles(data) {
  circlesContainer.removeChildren();

  data.descendants().forEach(node => {
    const circle = new PIXI.Graphics();
    circle.beginFill(Math.random() * 0xffffff);
    circle.drawCircle(node.x, node.y, node.r);
    circle.endFill();

    circlesContainer.addChild(circle);
  });
}

// Handle zooming functionality
const initialScale = 1;
let currentScale = initialScale;
app.stage.scale.set(currentScale);

window.addEventListener('wheel', event => {
  event.preventDefault();

  const delta = event.deltaY;
  const zoomFactor = 0.01;

  currentScale += delta * zoomFactor;
  currentScale = Math.max(0.5, Math.min(2, currentScale));

  app.stage.scale.set(currentScale);
});