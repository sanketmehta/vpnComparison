drawbubble();

function drawbubble() {
  // if the SVG area isn't empty when the browser loads, remove it and replace it with a resized version of the chart
  var svgArea = d3.select("body").select("svg");
  
  if (!svgArea.empty()) {
    svgArea.remove();
  }

  // SVG wrapper dimensions are determined by the current width and height of the browser window.
  // var svgWidth = parseInt(d3.select(".chart").style("width"));
  // var svgHeight = svgWidth - (svgWidth / 4);

  var svgWidth = window.innerWidth;
  var svgHeight = window.innerHeight;

  // set up margin and chart dimensions
  var margin = {top: 20, right: 20, bottom: 80, left: 80};
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

  var currentlabel = "Jusrisdiction";
  var radiusScale = d3.scaleSqrt()
	  .domain([0, 5])
	  .range([10, 80]);
  
  var forceXCombine = d3.forceX(function(d){
  		return svgWidth / 2 
    }).strength(0.05)

  var forceXSplit = d3.forceX(function(d){
  	if (d.Security < 1){
		return 300;
	// } else if (d.Security < 2) {
	// 	return 600;
	// } else if (d.Security < 3.5) {
	// 	return 800;
	} else {
		return 1200;
	}
  }).strength(0.05)

 //  var forceYSplit = d3.forceY(function(d){
 //  	if (d.Security < 1){
	// 	return 300;
	// } else if (d.Security < 2) {
	// 	return 500;
	// } else if (d.Security < 3.5) {
	// 	return 500;
	// } else {
	// 	return 1500;
	// }
 //  }).strength(0.05)

  var forceYCombine = d3.forceY(function(d){
	  	return svgHeight / 2
	 }).strength(0.05)

  var forceCollide = d3.forceCollide(function(d){
		return radiusScale(d.Jurisdiction) + 5
	})

  var simultation = d3.forceSimulation()
  	.force("x",forceXCombine)
  	.force("y", forceYCombine)
  	.force("collide", forceCollide)

  d3.queue()
     .defer(d3.csv, "../../data/vpnCompData_Nov22_test.csv")
     .await(ready);
  

  // d3.csv("vpnTest.csv", function(datapoints){
  function ready (err, datapoints){
  	// console.log(datapoints[0]);
  	var rmin = d3.min(datapoints, function(d) {
	  return parseFloat(d["Jurisdiction"]);
		});
  	console.log(rmin);

	var rmax = d3.max(datapoints, function(d) {
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
	  		.attr("r", function(d){
	  			return radiusScale(d.Jurisdiction)
	  		})
	  		.attr("id", function(d){
	  			return d.Category.toLowerCase().replace(/ /g, "_")
	  		})
	  		.attr("fill", "lightblue")
	  	.on("click", function(d){
	  		console.log(d["Category"])
	  	});

	d3.select("#split").on("click", function(){
		//  need to find how many distinct datapoints there are
	  simultation
			.force("x", forceXSplit)
			// .force("y", forceYSplit)
			.alphaTarget(0.25)
			.restart()

	})
		

	d3.select("#allvpn").on("click", function(){
		simultation
			.force("x", forceXCombine)
			.force("y", forceYCombine)
			.alphaTarget(0.25)
			.restart()
	})

  	simultation.nodes(datapoints)
  		.on("tick", ticked);

  	function ticked () {
  		circles
  		   .attr("cx", function(d){
  		   	 return d.x;
  		   })
  		   .attr("cy", function(d){
  		   	 return d.y;
  		   })
  	}
  }

  // });

}