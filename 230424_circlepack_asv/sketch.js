const url = "../00_datasets/asv-fragen.json"

let data;
let cnv;

// a d3js circle packing visualisation that is based on a local json file and creates circles based on a property of that json, including text labels

// Set up the width, height, and color scheme of the visualization
const width = 760, // outer width, in pixels
	height = 760, // outer height, in pixels
	margin = 10, // shorthand for margins
	marginTop = margin, // top margin, in pixels
	marginRight = margin, // right margin, in pixels
	marginBottom = margin, // bottom margin, in pixels
	marginLeft = margin; // left margin, in pixels
const color = d3.scaleOrdinal(d3.schemeCategory10);

// Load the data from the local JSON file
d3.json(url).then(function (data) {
	console.log(data)

	// group the data based on a json key
	// const groupData = d3.group(data, d => d["Schlagworte-BIH"])
	const groupData = d3.group(data, d => d["Themen-Weiss-60"])
	// const groupData = d3.group(data, d => d["Kartograph_in"])
	// const groupData = d3.group(data, d => d["Karten-anzahl"])
	// const groupData = d3.group(data, d => d["Enquete-Fragen-kurzform"])
	// const groupData = d3.group(data, d => d["Karten-Lieferung"])
	console.log("groupData", groupData)

	// Create a hierarchy based on the group data 
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
		.size([width - marginLeft - marginRight, height - marginTop - marginBottom])
		.padding(15);

	// // // Apply the pack layout to the data
	pack(root);

	// // Create the SVG element for the visualization
	const svg = d3.select("body")
		.append("svg")
		.attr("viewBox", [-marginLeft, -marginTop, width, height])
		.attr("width", width)
		.attr("height", height)
		.attr("style", "max-width: 100%; height: auto; height: intrinsic;")
		.attr("font-family", "Everett Mono")
		.attr("font-size", 12)
		.attr("text-anchor", "middle")
		.style("background-color", "black");

	console.log("root children:", root.children)

	// Create the groups within the sgv element
	const node = svg.selectAll("circle")
		.data(root.children)
		.enter()
		.append("circle")
		.attr("class", function (d) { return d.parent ? d.children ? "node" : "node node--leaf" : "node node--root"; })
		.attr("transform", d => `translate(${d.x},${d.y})`)
		.attr("r", d => d.r)
		.attr("stroke", "#c1c1c1")
		.attr("stroke-width", "1")
		// .style('fill', function (d) { return color(d.depth); })
		.style('fill', 'black')

	// create the questions inside the groups
	const leaves = svg.selectAll("circle")
		.data(root)
		.enter()
		.append("circle")
		.attr("class", function (d) { return d.parent ? d.children ? "node" : "node node--leaf" : "node node--root"; })
		.attr("transform", d => `translate(${d.x},${d.y})`)
		.attr("r", d => d.r)
		.attr("stroke-width", "0")
		.attr("text-anchor", "middle")
		.style('fill', '#2b3ea0')

	// create a foreignObject with a <div><p>text</p></div> to center vertically
	svg.selectAll("foreignObject")
		.data(root.children)
		.enter().append("foreignObject")
		.attr("class", "label")
		// the center of the labels for position, x needs to be half of 
		// text box width & p width
		.attr("transform", (d) => {
			const x = d.x - (d.r * 1);
			const y = d.y - d.r;
			return "translate(" + x + "," + y + ")";
		})
			// the width of the text-box
		.attr("width", (d) => d.r * 2)
		.attr("height", (d) => d.r * 2)
		.append("xhtml:div")
		// the height of the div to use flexbox
		.style("height", (d) => d.r * 2 + "px")
		// the width of the p tag
		.html((d) => { return "<p style='width: " + (d.r * 2 - 13) + "px'>" + d.data[0] + "</p>" });



});
