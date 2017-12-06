// var base_url = "https://127.0.0.1:5000/"


function init() {
    loadzSelection();
    buildpage("Number_of_Countries");
  }

function loadzSelection(){
  d3.json("/getColumns", function(err, data) {     
    if (err){
      alert("Error loading getColumns. " + err.message);
    } else {
      console.log(data);
      var nameoptions = document.querySelector("#selZ");

      var first=true;
      for (d in data) {
         console.log(d);
         var opt = document.createElement("option");
       opt.text = d;
         opt.value = d;
         
         if (first){
            opt.setAttribute("selected", "selected");
            first=false;
         }
         nameoptions.appendChild(opt);
      }
    }
  });  
}


function optionChanged(zOption) {
  buildpage(zOption, "update");
}


function buildpage(zOption, type){
  
  // getSampleMetadata(sample);
  // drawpie(sample);
  // drawgauge(sample);
  drawbubble(zOption, type);
}

function drawbubble(zOption, type){
  // if the SVG area isn't empty when the browser loads, remove it and replace it with a resized version of the chart
  var svgArea = d3.select("body").select("svg");
  
    // initalize default label to be used to compare data
  currentXlabel = "VPN_SERVICE";
  currentYlabel = "Availability";
  currentZlabel = zOption;

  alert("Building " );

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
  
  // setup fill color
  // var cValue = function(d) { return d.state;},
  //   color = d3.scale.category20();

  // Create the graph canvas
  var chart = d3
    .select(".chart")
    .append("svg")
      .attr("height", svgHeight)
      .attr("width", svgWidth)    
    .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");


  // ***********************************
  // circle radius 
  // ***********************************
  var circRadius;
  function crGet() {
    if (chart_width <= 530) {
      circRadius = 5;
    }
    else {
      circRadius = 10;
    }
  }
  crGet();

  // ***********************************
  // Bottom axis
  // ***********************************
  // create a group place holder for x axis text 
  chart.append("g")
      .classed("xtext", true);
  var xtext = d3.select(".xtext")

  function xTextRefresh(){
     xtext
        .attr(
        "transform",
        "translate(" + ((chart_width) / 2 - margin.left) + " ," + 
              (chart_height + margin.bottom) + ")"
          );
  }

  xTextRefresh();

  // x-axis labels
  xtext.append("text")          
    .classed("xlabel active x", true)
    .attr("y", -70)
    .attr("data-axis-name", currentXlabel)
    .attr("data-axis", "x")
    .text(currentXlabel);

  // ***********************************
  // Left axis
  // ***********************************
  // create a group place holder for y axis text (left)
  chart.append("g")
      .classed("ytext", true);
  var ytext = d3.select(".ytext");

  var leftx = margin.left;
  var lefty = (chart_height/2);

  function yTextRefresh(){
     ytext
        .attr(
        "transform",
        "translate(" + leftx + " ," + 
              lefty + ")rotate(-90)"
          );
  }

  yTextRefresh();

  // y-axis labels
  ytext.append("text")
    .classed("label active y", true)
    .attr("data-axis-name", currentYlabel)    
    .attr("data-axis", "y")
    .attr("y", "-150")    
    .style("text-anchor", "middle")
    .text(currentYlabel);  

  // add the toolTip area to the webpage
  var toolTip = d3.select(".chart").append("div")
    .classed("toolTip", true)
    .style("opacity", 0);

  // load data
  d3.json("/getColumns", function(data) {
    // Create chart
    createBubbleChart(data);
  });

  function parseXYZ(chartData){
    console.log(chartData);

    var bubbleData = [];

    for (d in chartData) {
         console.log(d);
         switch(d) {
              case currentXlabel:
                  xdata = d[currentXlabel];
                  break;
              case currentYlabel:
                  ydata = d[currentYlabel];
                  break;
              case currentZlabel:
                  zdata = d[currentZlabel];
                  break;
              default:
                  break;
          }

         var dictData = {
            "xdata": xdata,
            "ydata": ydata,
            "zdata": zdata
          }
      }

    chartData.forEach(function(d) {
      d.id = +d.id;
      d.Number_of_Countries = +d.Number_of_Countries;
      d.Number_of_Servers = +d.Number_of_Servers;
      d.Availability = +d.Availability;

      

      return parseData;
    });

  }

  function createBubbleChart(data){
    var chartData = parseXYZ(data);
    console.log(charData);




    // chartData.forEach(function(d) {
    //   d.id = +d.id;
    //   d.Number_of_Countries = +d.Number_of_Countries;
    //   d.Number_of_Servers = +d.Number_of_Servers;
    //   d.Availability = +d.Availability;
    // });
    // console.log(chartData[0]);

    

    // set x/y minimums and maximums
    var xmin;
    var xmax;
    var ymin;
    var ymax;

    // create function to setup toolTip rules
    var toolTip = d3.tip()
      .attr("class","popup")
      .offset([40, -60])
      .html(function(d) {
        // x key
        var xkey;
        // Grab the state name.
        // var statekey = "<div>" + d.state + "</div>";
        // Snatch the y value's key and value.
        var ykey = "<div>" + currentYlabel + ": " + d[currentYlabel] + "%</div>";
        // If the x key is poverty
        if (currentXlabel === "poverty") {
          // Grab the x key and a version of the value formatted to show percentage
          xkey = "<div>" + currentXlabel + ": " + d[currentXlabel] + "%</div>";
        }
        else {
          // Otherwise
          // Grab the x key and a version of the value formatted to include commas after every third digit.
          xkey = "<div>" +
            currentXlabel +
            ": " +
            parseFloat(d[currentXlabel]).toLocaleString("en") +
            "</div>";
        }
        // Display what we capture.
        // return statekey + xkey + ykey;
        return xkey + ykey;
      });

    // Call the toolTip function.
    chart.call(toolTip);

    function xMinMax() {
      // min will grab the smallest datum from the selected column.
      xMin = d3.min(chartData, function(d) {
        return parseFloat(d[currentXlabel]) * 0.90;
      });

      // .max will grab the largest datum from the selected column.
      xMax = d3.max(chartData, function(d) {
          return parseFloat(d[currentXlabel]) * 1.10;
        });
    }

    function yMinMax() {
    // min will grab the smallest datum from the selected column.
    yMin = d3.min(chartData, function(d) {
      return parseFloat(d[currentYlabel]) * 0.90;
    });

    // .max will grab the largest datum from the selected column.
    yMax = d3.max(chartData, function(d) {
      return parseFloat(d[currentYlabel]) * 1.10;
    });
  }

  // c. change the classes (and appearance) of label text when clicked.
  function labelChange(axis, clickedText) {
    // Switch the currently active to inactive.
    d3
      .selectAll(".label")
      .filter("." + axis)
      .filter(".active")
      .classed("active", false)
      .classed("inactive", true);

    // Switch the text just clicked to active.
    clickedText
         .classed("inactive", false)
         .classed("active", true);
  }

  // Part 3: Instantiate the Scatter Plot
  // ====================================
  // This will add the first placement of our data and axes to the scatter plot.

  // First grab the min and max values of x and y.
  xMinMax();
  yMinMax();
    
    // setup x axis
    var xValue = function(d) { 
      return d.poverty;
    }; // data -> value

    var xScale = d3
      .scaleLinear()
      .range([0, chart_width * .9]); // value -> display
        
    var xMap = function(d) {
      return xScale(xValue(d) * .9);
    }; // data -> display

    // Create x axis function
    var bottomAxis = d3.axisBottom(xScale);

    // setup y axis
    var yValue = function(d) {
       return d.healthcare;
    }; // data -> value
        
    var yScale = d3.scaleLinear()
      .range([chart_height, 0]); // value -> display
        
    var yMap = function(d) {
      return yScale(yValue(d));
    }; // data -> display
        
    // Create y axis functions
    var leftAxis = d3.axisLeft(yScale);

    // don't want dots overlapping axis, so add in buffer to data domain
    xScale.domain([d3.min(chartData, xValue)-2, d3.max(chartData, xValue)]);
    yScale.domain([d3.min(chartData, yValue)-1, d3.max(chartData, yValue)+1]);

    // x-axis
    chart.append("g")
        .classed("x axis", true)
        .attr("transform", "translate(0," + chart_height + ")")
        .call(bottomAxis);    
    
    // y-axis
    chart.append("g")
        .classed("y axis", true)
        .call(leftAxis)    

    // draw dots
    // enter
    var dots = chart.selectAll(".dot")
        .data(chartData)
        .enter()

    // update
    dots.append("circle")
      .classed("dot", true)
      .attr("r", 10)
      .attr("cx", xMap)
      .attr("cy", yMap) 
      .style("fill", "#92b1e5")
      .on("mouseover", function(d) {
         // toolTip.transition()
         //     .duration(200)
         //     .style("opacity", .9);
             // .style("r", parseInt(d3.select(this).style("width"))*2)
         tootTip.show(d);
         d3.select("this").style("stroke", "#ffffff");
         
      })
      .on("mouseout", function(d) {
          // toolTip.transition()
          //      .duration(500)
          //      .style("opacity", 0);
          toolTip.hide(d);

          // Remove highlight
          d3.select(this).style("stroke", "#e3e3e3");
      });

    dots.append("text")     
      .attr("x", xMap)
      .attr("y", yMap)
      .attr('text-anchor', 'middle')
      .attr('alignment-baseline', 'middle')  
      .style("font-size", "12px")
      .attr('fill', 'white')
      .text(function(d) {
         return d.abbr;
      });
      // }
  };  
}
// function drawChart(){
//   d3.csv('../data.csv',function (data) {
// // CSV section
//   var body = d3.select('body')
//   var selectData = [ { "text" : "Annualized Return" },
//                      { "text" : "Annualized Standard Deviation" },
//                      { "text" : "Maximum Drawdown" },
//                    ]

//   // Select X-axis Variable
//   var span = body.append('span')
//     .text('Select X-Axis variable: ')
//   var yInput = body.append('select')
//       .attr('id','xSelect')
//       .on('change',xChange)
//     .selectAll('option')
//       .data(selectData)
//       .enter()
//     .append('option')
//       .attr('value', function (d) { return d.text })
//       .text(function (d) { return d.text ;})
//   body.append('br')

//   // Select Y-axis Variable
//   var span = body.append('span')
//       .text('Select Y-Axis variable: ')
//   var yInput = body.append('select')
//       .attr('id','ySelect')
//       .on('change',yChange)
//     .selectAll('option')
//       .data(selectData)
//       .enter()
//     .append('option')
//       .attr('value', function (d) { return d.text })
//       .text(function (d) { return d.text ;})
//   body.append('br')

//   // Variables
//   var body = d3.select('body')
//   var margin = { top: 50, right: 50, bottom: 50, left: 50 }
//   var h = 500 - margin.top - margin.bottom
//   var w = 500 - margin.left - margin.right
//   var formatPercent = d3.format('.2%')
//   // Scales
//   var colorScale = d3.scale.category20()
//   var xScale = d3.scale.linear()
//     .domain([
//       d3.min([0,d3.min(data,function (d) { return d['Annualized Return'] })]),
//       d3.max([0,d3.max(data,function (d) { return d['Annualized Return'] })])
//       ])
//     .range([0,w])
//   var yScale = d3.scale.linear()
//     .domain([
//       d3.min([0,d3.min(data,function (d) { return d['Annualized Return'] })]),
//       d3.max([0,d3.max(data,function (d) { return d['Annualized Return'] })])
//       ])
//     .range([h,0])
//   // SVG
//   var svg = body.append('svg')
//       .attr('height',h + margin.top + margin.bottom)
//       .attr('width',w + margin.left + margin.right)
//     .append('g')
//       .attr('transform','translate(' + margin.left + ',' + margin.top + ')')
//   // X-axis
//   var xAxis = d3.svg.axis()
//     .scale(xScale)
//     .tickFormat(formatPercent)
//     .ticks(5)
//     .orient('bottom')
//   // Y-axis
//   var yAxis = d3.svg.axis()
//     .scale(yScale)
//     .tickFormat(formatPercent)
//     .ticks(5)
//     .orient('left')
//   // Circles
//   var circles = svg.selectAll('circle')
//       .data(data)
//       .enter()
//     .append('circle')
//       .attr('cx',function (d) { return xScale(d['Annualized Return']) })
//       .attr('cy',function (d) { return yScale(d['Annualized Return']) })
//       .attr('r','10')
//       .attr('stroke','black')
//       .attr('stroke-width',1)
//       .attr('fill',function (d,i) { return colorScale(i) })
//       .on('mouseover', function () {
//         d3.select(this)
//           .transition()
//           .duration(500)
//           .attr('r',20)
//           .attr('stroke-width',3)
//       })
//       .on('mouseout', function () {
//         d3.select(this)
//           .transition()
//           .duration(500)
//           .attr('r',10)
//           .attr('stroke-width',1)
//       })
//     .append('title') // Tooltip
//       .text(function (d) { return d.variable +
//                            '\nReturn: ' + formatPercent(d['Annualized Return']) +
//                            '\nStd. Dev.: ' + formatPercent(d['Annualized Standard Deviation']) +
//                            '\nMax Drawdown: ' + formatPercent(d['Maximum Drawdown']) });
//   // X-axis
//   svg.append('g')
//       .attr('class','axis')
//       .attr('id','xAxis')
//       .attr('transform', 'translate(0,' + h + ')')
//       .call(xAxis)
//     .append('text') // X-axis Label
//       .attr('id','xAxisLabel')
//       .attr('y',-10)
//       .attr('x',w)
//       .attr('dy','.71em')
//       .style('text-anchor','end')
//       .text('Annualized Return')
//   // Y-axis
//   svg.append('g')
//       .attr('class','axis')
//       .attr('id','yAxis')
//       .call(yAxis)
//     .append('text') // y-axis Label
//       .attr('id', 'yAxisLabel')
//       .attr('transform','rotate(-90)')
//       .attr('x',0)
//       .attr('y',5)
//       .attr('dy','.71em')
//       .style('text-anchor','end')
//       .text('Annualized Return')

//   function yChange() {
//     var value = this.value // get the new y value
//     yScale // change the yScale
//       .domain([
//         d3.min([0,d3.min(data,function (d) { return d[value] })]),
//         d3.max([0,d3.max(data,function (d) { return d[value] })])
//         ])
//     yAxis.scale(yScale) // change the yScale
//     d3.select('#yAxis') // redraw the yAxis
//       .transition().duration(1000)
//       .call(yAxis)
//     d3.select('#yAxisLabel') // change the yAxisLabel
//       .text(value)    
//     d3.selectAll('circle') // move the circles
//       .transition().duration(1000)
//       .delay(function (d,i) { return i*100})
//         .attr('cy',function (d) { return yScale(d[value]) })
//   }

//   function xChange() {
//     var value = this.value // get the new x value
//     xScale // change the xScale
//       .domain([
//         d3.min([0,d3.min(data,function (d) { return d[value] })]),
//         d3.max([0,d3.max(data,function (d) { return d[value] })])
//         ])
//     xAxis.scale(xScale) // change the xScale
//     d3.select('#xAxis') // redraw the xAxis
//       .transition().duration(1000)
//       .call(xAxis)
//     d3.select('#xAxisLabel') // change the xAxisLabel
//       .transition().duration(1000)
//       .text(value)
//     d3.selectAll('circle') // move the circles
//       .transition().duration(1000)
//       .delay(function (d,i) { return i*100})
//         .attr('cx',function (d) { return xScale(d[value]) })
//   }
// }

init();