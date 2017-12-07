
// createBubble();

function generateColor(x) {
  var color = [];

    // color.push(256 -x);

    // if (x <= 255 ){
    // 	color.push(x);
    // } else {
    // 	color.push(x - 255);
    // }

    // value3 = x*2;
    // if (value3 <= 255){
    // 	color.push(value3)
    // } else {
    // 	color.push(value3-255)
    // };
  for (var i = 0; i < 3; i++) {
    color.push(Math.floor(Math.random() * 256));
  }
  return 'rgb(' + color.join(',') + ')';
}

function updateVPNInfo(vpn) {
      var info = "";
      if (vpn) {
      	var metahead = document.querySelector("#vpnname");
		metahead.innerHTML = vpn.Category;

		// var meta = document.querySelector("#vpn-info");
		// metadata.innerHTML = "";

		// for(var key in data) {
		//   	var value = data[key];
		//   	console.log(key + ": " +  value);
		//   	var para = document.createElement("P");                       // Create a <p> element
		// 	var t = document.createTextNode(key + ": " +  value);      // Create a text node
		// 	para.appendChild(t);                                          // Append the text to <p>
		// 	meta.appendChild(para);           // Append <p> to <div> with id="myDIV"
		// }

        info = ["Country", vpn.Country].join(": ");
      }
      d3.select("#metadata").html(info);
    }


function createBubble(err, datapoints) {
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

  // d3.queue()
  //    .defer(d3.csv, "../../data/vpnCompData_Nov22_test.csv")
  //    .await(ready);
  

  // d3.csv("vpnTest.csv", function(datapoints){
  // function ready (err, datapoints){
  	console.log(datapoints.length);

  	var countries = d3.map(datapoints, function(d){return d.Country;}).keys()
  	var colors = {};

  	countries.forEach(function (e, i) {
  		console.log(e);
  		colors[e] = generateColor(i);
	});

	console.log(colors);
	console.log(colors['Australia']);

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
	  		// .attr("fill", "lightblue")
	  		.attr("fill", function(d){
	  			return colors[d.Country];
	  		})

	  	.on("click", function(d){
	  		// updateVPNInfo(d);
	  		console.log(d["Category"])
	  	})
	  	// .on("mouseover", function(d) {
    //       updateVPNInfo(d);
    //     })
    //     .on("mouseout", function(d) {
    //       updateVPNInfo(d);
    //     });

	d3.select("#split").on("click", function(){
		//  need to find how many distinct datapoints there are
	  simultation
			.force("x", forceXSplit)
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
  // }

  // });

}