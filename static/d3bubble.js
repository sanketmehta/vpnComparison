
d3.queue()
	.defer(d3.csv, "../../data/vpnCompData_Nov22_test.csv")
	.await(drawbubble);

function generateColor(x) {
	var color = [];
  
	for (var i = 0; i < 3; i++) {
	  color.push(Math.floor(Math.random() * 256));
	}
	return 'rgb(' + color.join(',') + ')';
  }
  
function updateVPNInfo(vpn, type) {
	var metahead = document.querySelector("#metahead");	
	var metadata = document.querySelector("#metadata");
	metadata.innerHTML = "";

	if (vpn) {	
	  if (type === "detail"){
	  	metahead.innerHTML = vpn["VPN SERVICE"];
	  } else {
	  	metahead.innerHTML = "VPN Summary"; 
	  }

	  for(var key in vpn) {
	  	switch (key){
	  		case "VPN SERVICE":
	  		case "index":
	  		case "vx":
	  		case "vy":
	  		case "x":
	  		case "y":
	  			break;
	  		default:
		    	var value = vpn[key];
			    addTextToMetadata(key, value, metadata);
	  			break;
	  	}
	  }
	} 
}

function addTextToMetadata(label, text, metadata){
	console.log(label + ": " +  text);
	var para = document.createElement("p");                // Create a <p> element
  	var t = document.createTextNode(label + ": " +  text);  // Create a text node
  	para.appendChild(t);                                   // Append the text to <p>
  	metadata.appendChild(para);  
}
  
function drawbubble(err, datapoints) {
	// if the SVG area isn't empty when the browser loads, remove it and replace it with a resized version of the chart

	var allSelections;
	var summaryData = {};

	var svgArea = d3.select("body").select("svg");

	if (!svgArea.empty()) {
		svgArea.remove();
	}

	var svgWidth = window.innerWidth;
	var svgHeight = window.innerHeight;

	// set up margin and chart dimensions
	var margin = { top: 100, right: 20, bottom: 100, left: 80 };
	var chart_width = svgWidth - margin.left - margin.right,
		chart_height = svgHeight - margin.top - margin.bottom;


	// Create the graph canvas
	var svg = d3
		.select(".chart")
		.append("svg")
		.attr("height", svgHeight)
		.attr("width", svgWidth)
		.append("g")
		.attr("transform", "translate(0,0)");

	// Initialize tooltip
	  var toolTip = d3
	    .tip()
	    .attr("class", "d3-tip")
	    // Define position
	    .offset([20, -20])
	    // The html() method allows us to mix JavaScript with HTML in the callback function
	    .html(function(d) {
	      	var vpnName = d['VPN SERVICE'];
	      	var country = d['Country'];
		    var jurisdiction = +d['Jurisdiction'];
		    var logging = +d['Logging'];
		    var activism = +d['Activism']
		    return "<h3 id='tooltip-header'>" + vpnName +
		        "</h3><hr>" +
		        country + "<br>" +
		        ["Jurisdiction", jurisdiction].join(": ") +
		        "<br>" +		        
		        ["Logging", logging].join(": ") +
		        "<br>" +		        
		        ["Activism", activism].join(": ");
	    });

	svg.call(toolTip);

	var forceXCombine = d3.forceX(function (d) {
		return ((svgWidth/6)*5)/ 2
	}).strength(0.05)

	var forceYCombine = d3.forceY(function (d) {
		return svgHeight / 2
	}).strength(0.5)

	var forceCollide = d3.forceCollide(function (d) {
		return radiusScale(d.Jurisdiction) + 5
	})

	var simultation = d3.forceSimulation()
		.force("x", forceXCombine)
		.force("y", forceYCombine)
		.force("collide", forceCollide)

	var forceSplit = d3.forceCollide(function (d) {
		return radiusScale(d.Jurisdiction) + 15
	})

	var forceXSplit = d3.forceX(function (d) {

		categoryArr = [];
		subCategoryArr = [];

		remainingSelections = allSelections;

		for (i = 0; i < (allSelections.match(/;/g) || []).length; i++) {

			currentSelection = remainingSelections.substring(0, remainingSelections.indexOf(";"));
			remainingSelections = remainingSelections.substring(remainingSelections.indexOf(";") + 1, remainingSelections.length);
			categoryArr.push(currentSelection.substring(0, currentSelection.indexOf("-")));
			subCategoryArr.push(currentSelection.substring(currentSelection.indexOf("-") + 1, currentSelection.length));

		}

		if (((((d[categoryArr[0]] >= (parseFloat(subCategoryArr[0]))) && (d[categoryArr[0]] < (parseFloat(subCategoryArr[0]) + 0.5)))) || parseFloat(subCategoryArr[0]) == 99) &&
			((((d[categoryArr[1]] >= (parseFloat(subCategoryArr[1]))) && (d[categoryArr[1]] < (parseFloat(subCategoryArr[1]) + 0.5)))) || parseFloat(subCategoryArr[1]) == 99) &&
			((((d[categoryArr[2]] >= (parseFloat(subCategoryArr[2]))) && (d[categoryArr[2]] < (parseFloat(subCategoryArr[2]) + 0.5)))) || parseFloat(subCategoryArr[2]) == 99) &&
			((((d[categoryArr[3]] >= (parseFloat(subCategoryArr[3]))) && (d[categoryArr[3]] < (parseFloat(subCategoryArr[3]) + 0.5)))) || parseFloat(subCategoryArr[3]) == 99) &&
			((((d[categoryArr[4]] >= (parseFloat(subCategoryArr[4]))) && (d[categoryArr[4]] < (parseFloat(subCategoryArr[4]) + 0.5)))) || parseFloat(subCategoryArr[4]) == 99) &&
			((((d[categoryArr[5]] >= (parseFloat(subCategoryArr[5]))) && (d[categoryArr[5]] < (parseFloat(subCategoryArr[5]) + 0.5)))) || parseFloat(subCategoryArr[5]) == 99) &&
			((((d[categoryArr[6]] >= (parseFloat(subCategoryArr[6]))) && (d[categoryArr[6]] < (parseFloat(subCategoryArr[6]) + 0.5)))) || parseFloat(subCategoryArr[6]) == 99) &&
			((((d[categoryArr[7]] >= (parseFloat(subCategoryArr[7]))) && (d[categoryArr[7]] < (parseFloat(subCategoryArr[7]) + 0.5)))) || parseFloat(subCategoryArr[7]) == 99) &&
			((((d[categoryArr[8]] >= (parseFloat(subCategoryArr[8]))) && (d[categoryArr[8]] < (parseFloat(subCategoryArr[8]) + 0.5)))) || parseFloat(subCategoryArr[8]) == 99)
		) {
			return svgWidth / 2;
			// return 300;
		} else {
			return 3000;
		}

	}).strength(0.04)

	var forceYSplit = d3.forceY(function (d) {
		return svgHeight / 2
	}).strength(0.05)

	console.log(datapoints.length);

  	var countries = d3.map(datapoints, function(d){return d.Country;}).keys()

  	summarydata = {
  		"Total Countries": countries.length,
  		"Total VPNs": datapoints.length 
  	}

  	// pass summary information
  	updateVPNInfo(summarydata,"summary");

  	var colors = {};

  	countries.forEach(function (e, i) {
  		colors[e] = generateColor(i);
	});

	
		var rmin = d3.min(datapoints, function (d) {
			return parseFloat(d["Jurisdiction"]);
		});
		console.log(rmin);

		var rmax = d3.max(datapoints, function (d) {
			return parseFloat(d["Jurisdiction"]);
		});
		console.log(rmax);

		radiusScale = d3.scaleSqrt()
			.domain([rmin, rmax])
			.range([5, 40]);

		var circles = svg.selectAll(".vpn")
			.data(datapoints)
			.enter()
			.append("circle")
			.classed("vpn", true)
			.attr("r", function (d) {
				radVal = d.Jurisdiction;
				if (parseInt(radVal) == 0) {
					radVal = 0.1;
				}
				else {
					radVal = radVal / 10 + 0.1;
				}
				return radiusScale(radVal)
			})
			.attr("id", function (d) {
				return d["VPN SERVICE"].toLowerCase().replace(/ /g, "_")
			})
			.attr("fill", function(d){
				return colors[d.Country];
			})
			.on("click", function (d) {
		  		// updateVPNInfo(d);
			  toolTip.show(d);
			})
			.on("mouseover", function (d) {
		      // show vpn details
		  	  updateVPNInfo(d, "detail");
			})		
			.on("mouseout", function (d) {
		  	  
			  // pass summary information
			  updateVPNInfo(summarydata,"summary");
			  toolTip.hide(d);
			});


		simultation.nodes(datapoints)
			.on("tick", ticked);

		function ticked() {
			circles
				.attr("cx", function (d) {
					return d.x;
				})
				.attr("cy", function (d) {
					return d.y;
				})
		}


		d3.selectAll(".dropdown").on("change", function () {

			allSelections = "";
			d3.selectAll(".dropdown")
				.filter(function (d, i) {
					allSelections = allSelections + this.value + ";";

				});
			simultation
				.force("x", forceXSplit)
				.force("y", forceYSplit)
				.force("collide", forceSplit)
				.alphaTarget(0.5)
				.restart()
		})


		d3.select("#allvpn").on("click", function () {
			simultation
				.force("x", forceXCombine)
				.force("y", forceYCombine)
				.force("collide", forceCollide)
				.alphaTarget(0.01)
				.restart()
		})


}

