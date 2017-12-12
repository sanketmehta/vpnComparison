
d3.queue()
	.defer(d3.json, "/getColumnsByVPN")
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
	  	metahead.innerHTML = vpn["VPN_SERVICE"];
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
	console.log(datapoints);

	var allSelections;
	var summaryData = {};

	var svgArea = d3.select("body").select("svg");

	if (!svgArea.empty()) {
		svgArea.remove();
	}

	var svgWidth = window.innerWidth *4/5;
	var svgHeight = window.innerHeight *4/5;
	// console.log(svgWidth);

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
	      	var vpnName = d['VPN_SERVICE'];
	      	var country = d['Based_in_(Country)'];
		    var monthlyprice = d['$_/_Month_-_(Annual_Pricing)'];
		    var connectionprice = d['$_/_Connection_/_Month'];
		    var activism = +d['Activism']
		    return "<h3 id='tooltip-header'>" + vpnName +
		        "</h3><hr>" +
		        country + "<br>" +
		        ["$/Month (Annual Pricing)", monthlyprice].join(": ") +
		        "<br>" +		        
		        ["$ / Connection / Month", connectionprice].join(": ") +
		        "<br>" +		        
		        ["Activism", activism].join(": ");
	    });

	svg.call(toolTip);

	var forceXCombine = d3.forceX(function (d) {
		return svgWidth/2
	}).strength(0.05)

	var forceYCombine = d3.forceY(function (d) {
		return svgHeight / 2
	}).strength(0.5)

	var forceCollide = d3.forceCollide(function (d) {
		return radiusScale(d['Jurisdiction']) + 5
	})

	var simultation = d3.forceSimulation()
		.force("x", forceXCombine)
		.force("y", forceYCombine)
		.force("collide", forceCollide)

	var forceSplit = d3.forceCollide(function (d) {
		return radiusScale(d['Jurisdiction']) + 15
	})

	var forceXSplit = d3.forceX(function (d) {
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
		} else {
			return 4000;
		}

	}).strength(0.008)

	var forceYSplit = d3.forceY(function (d) {
		return svgHeight / 2
	}).strength(0.02)

	console.log(datapoints.length);

	setfilterArrays();
	
	function sorter(a, b) {
		return a - b;
	}

	function setfilterArrays() {
		var filtersArr = ["Jurisdiction", "Logging", "Activism", "Service_Config", "Security", "Availability", "Website", "Pricing", "Ethics"]

		d3.selectAll(".option")
			.remove();
	
		for (var j = 0; j < filtersArr.length; j++) {
            var filtername = filtersArr[j];
			var dropDwnNameVal = filtersArr[j];

			if (filtersArr[j] == "Service_Config") {
				filtername = "ServiceConfig";
				dropDwnNameVal = "Service Config";
			}

			dropDwnName = [filtername, "Dropdown"].join("");

			// to sort alphanumeric numbers correctly
			if (filtername == "Website"){				
				optvalues = d3.map(datapoints, function(d){return parseFloat(d[dropDwnNameVal]);}).keys().sort(sorter); 
			} else {				
				optvalues = d3.map(datapoints, function(d){return parseFloat(d[dropDwnNameVal]);}).keys().sort(); 
			}
			
			console.log(dropDwnName);
			d3.select("#" + dropDwnName).append("option")
				.attr("class", "option")
				.attr("value", "99")
				.text("All");

			for (var i = 0; i < optvalues.length; i++) {
				d3.select("#" + dropDwnName).append("option")
					.attr("class", "option")
					.attr("value", dropDwnNameVal + "-" + optvalues[i])
					.text(optvalues[i]);
			}
		}
	}
	
  	var countries = d3.map(datapoints, function(d){return d['Based_in_(Country)'];}).keys().sort();

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
				radVal = d['Jurisdiction'];
				if (parseInt(radVal) == 0) {
					radVal = 0.1;
				}
				else {
					radVal = radVal / 10 + 0.1;
				}
				return radiusScale(radVal)
			})
			.attr("id", function (d) {
				return d["VPN_SERVICE"].toLowerCase().replace(/ /g, "_")
			})
			.attr("fill", function(d){
				return colors[d['Based_in_(Country)']];
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

			console.log(allSelections);
	
			categoryArr = [];
			subCategoryArr = [];
	
			remainingSelections1 = allSelections;
	
			for (i = 0; i < (allSelections.match(/;/g) || []).length; i++) {
	
				currentSelection1 = remainingSelections1.substring(0, remainingSelections1.indexOf(";"));
				remainingSelections1 = remainingSelections1.substring(remainingSelections1.indexOf(";") + 1, remainingSelections1.length);
				categoryArr.push(currentSelection1.substring(0, currentSelection1.indexOf("-")));
				subCategoryArr.push(currentSelection1.substring(currentSelection1.indexOf("-") + 1, currentSelection1.length));
	
			}
	
			if ((parseFloat(subCategoryArr[0]) == 99) && (parseFloat(subCategoryArr[1]) == 99) &&
				(parseFloat(subCategoryArr[2]) == 99) && (parseFloat(subCategoryArr[3]) == 99) &&
				(parseFloat(subCategoryArr[4]) == 99) && (parseFloat(subCategoryArr[5]) == 99) &&
				(parseFloat(subCategoryArr[6]) == 99) && (parseFloat(subCategoryArr[7]) == 99) &&
				(parseFloat(subCategoryArr[8]) == 99)
			) {
				simultation
					.force("x", forceXCombine)
					.force("y", forceYCombine)
					.force("collide", forceCollide)
					.alphaTarget(0.008)
					.restart()
			}
			else {
				simultation
					.force("x", forceXSplit)
					.force("y", forceYSplit)
					.force("collide", forceSplit)
					.alphaTarget(0.7)
					.restart()
			}
	

		})


	d3.select("#allvpn").on("click", function () {
		setfilterArrays();
		simultation
			.force("x", forceXCombine)
			.force("y", forceYCombine)
			.force("collide", forceCollide)
			.alphaTarget(0.008)
			.restart()
	})


}

