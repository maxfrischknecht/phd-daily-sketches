import * as PIXI from 'pixi.js';
import * as d3 from 'd3'
import * as TWEEN from '@tweenjs/tween.js'

// Set up the width, height, and color scheme of the visualization
const width = 760; // outer width, in pixels
const height = 760; // outer height, in pixels

// set the property to circle back upon
let selectedPackingProp = 'Kartograph_in';

// old circle positions for animation
let oldCirclePos = []

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

/* D A T A
---------------------------------------------------------- */
let data;
d3.json("230508_AtlasFragekatalog_Prototyp.json").then((res) => {
  console.log(res.length);
  data = res;
  init();
});

/* I N I T
---------------------------------------------------------- */
function init() {
  // create the dircle packing data / layout
  let packedData = createPackData()

  // render the packing layout with pixi the first time
  animateCircles(packedData);

  // create the GUI
  createGUI();
}

/* P A C K I N G 
---------------------------------------------------------- */

// create circle packing layout
function createPackData() {
  const groupData = d3.group(data, d => d[selectedPackingProp])
  // console.log("groupData", groupData)
  const hierarchyData = d3.hierarchy(groupData)
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
  // console.log("root", root)

  // Create the pack layout
  const pack = d3.pack().size([width, height]).padding(10);

  // Apply the pack layout to the data
  let packedData = pack(hierarchyData);

  // console.log(packedData)

  return packedData;
}

/* R E N D E R I N G 
---------------------------------------------------------- */
// Create a function to render the circles based on the packed data
function renderCircles(packedData) {
  circlesContainer.removeChildren();

  // get the leaf positions from the current packed data
  let currentCirclePos = getLeafNodePositions(packedData);

  // draw the circles
  currentCirclePos.forEach(pos => {
    const circle = new PIXI.Graphics();
    circle.beginFill(Math.random() * 0xffffff);
    circle.drawCircle(pos.x, pos.y, pos.r);
    circle.endFill();
    circlesContainer.addChild(circle);
  })
  console.log(oldCirclePos, currentCirclePos)
  // its done, so save the position in the old circle pos
  oldCirclePos = currentCirclePos

}

function getAllNodePositions(packedData) {
  console.log(packedData)
  const positions = packedData.descendants().map(node => ({
    x: node.x,
    y: node.y,
    r: node.r,
  }));
  return positions;
}

function getLeafNodePositions(packedData) {
  const leafNodes = packedData.leaves();
  const positions = leafNodes.map(node => ({
    x: node.x,
    y: node.y,
    r: node.r,
  }));
  return positions;
}


function animateCircles(packedData) {
  const transitionDuration = 1000; // Transition duration in milliseconds

  // get all positions
  let currentCirclePos = getLeafNodePositions(packedData);
  console.log("old", oldCirclePos, "new: ", currentCirclePos)

  if(oldCirclePos.length == 0) {
    oldCirclePos = currentCirclePos;
  }

  // loop over positions to create circles
  let allCircles = []
  currentCirclePos.forEach((pos, i) => {
    const circle = new PIXI.Graphics();
    circle.beginFill(Math.random() * 0xffffff);
    circle.drawCircle(pos.x / 100, pos.y / 100, pos.r);
    circle.endFill();

    circle.position.set(oldCirclePos[i].x, oldCirclePos[i].y)
    circle.targetPosition = { x: pos.x, y: pos.y };

    allCircles.push(circle)
  })


  // Add the circles to the container
  circlesContainer.removeChildren();
  circlesContainer.addChild(...allCircles);

  // Apply transition
  allCircles.forEach(circle => {
    new TWEEN.Tween(circle.position)
      .to(circle.targetPosition, transitionDuration)
      .easing(TWEEN.Easing.Quadratic.Out)
      .start();
  });

  // Update the stage in each frame during the transition
  const animate = () => {
    if (TWEEN.update()) {
      requestAnimationFrame(animate);
    }
  };

  animate();
  oldCirclePos = currentCirclePos;
  
}


// function updateCirclePackingLayout(packedData){
  
//   const transition = app.ticker.add(delta => {
//     const progress = Math.min(delta / 1000, 1); // Transition duration: 500ms

//     packedData.descendants().forEach(node => {
//       const circle = circlesContainer.children.find(c => c._data === node);

//       if (circle) {
//         circle.scale.set(progress);
//       } else {
//         const newCircle = new PIXI.Graphics();
//         newCircle._data = node;
//         newCircle.beginFill(Math.random() * 0xffffff);
//         newCircle.drawCircle(node.x, node.y, node.r);
//         newCircle.endFill();
//         newCircle.scale.set(progress);
//         circlesContainer.addChild(newCircle);
//       }
//     });

//     // Remove circles that are no longer present in the packed data
//     circlesContainer.children.forEach(circle => {
//       const node = circle._data;
//       if (!node || !node.ancestors().includes(packedData)) {
//         circlesContainer.removeChild(circle);
//       }
//     });

//     // End transition when progress reaches 1
//     if (progress === 1) {
//       app.ticker.remove(transition);
//     }
//   });

// }

/* G U I 
---------------------------------------------------------- */

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

// Create a UI to handle property selection
function createGUI(){
  const groupBySelect = document.createElement('select');
  const availableProperties = Object.keys(data[0]);

  availableProperties.forEach(property => {
    const groupByOption = document.createElement('option');
    groupByOption.value = property;
    groupByOption.text = property;
    groupBySelect.appendChild(groupByOption);

  });

  groupBySelect.addEventListener('change', () => {
    selectedPackingProp = groupBySelect.value;

    let newPackedData = createPackData();
    animateCircles(newPackedData);
    // renderCircles(newPackedData);
  });

  document.body.appendChild(groupBySelect);
}

