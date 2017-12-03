

// Function to add the dropdown for samples
function addDropdown() {
  console.log("inside addDropdown()");
  
  // Get the list of sample names and put into an array
  sampleNames = [];
  queryURL = 'http://localhost:5000/vpnNames';

  
  // Take url response and assign it to the sampleNames array
  d3.json(queryURL, function (error, response) {
    if (error) {
      console.log(error);
    }
    else {
      sampleNames = response;

      // Add each item from sampleNames as an option to dropdown  
      for (var i = 0; i < sampleNames.length; i++) {
        d3.select("#samplesDropdown").append("option")
          .attr("value", sampleNames[i]["name"])
          .text(sampleNames[i]);
      }

      // Call optionChanged with the 1st element as the default option selected
      optionChanged(sampleNames[0]);

    }
  });
  
}








// Function to update the page when dropdown selection is changed
function optionChanged(selectedOption) {

    console.log("inside optionChanged()");

    // Get metadata information for the specific sample from the metadata url/endpoint
    queryURL1 = 'http://localhost:5000/metadata/' + selectedOption;
    metaDataInfo = "";
  
    d3.json(queryURL1, function (error, response) {
      if (error) {
        console.log(error);
      }
      else {
        metaDataInfo = response;
  
        // Remove old metadata from html id #table
        d3.select("#table").selectAll("p").remove();
    
        // Add new metadata for this sample into html id #table
        for (var key in metaDataInfo) {
          if (metaDataInfo.hasOwnProperty(key)) {
            d3.select("#table").append("p")
              .text(key + " : " + metaDataInfo[key]);
          }
        }
      }
    });
  



}

// Calling init to create default Pie Chart and Scatter Plot
// init();

// Calling addDropdown to crate dropdown list of samples
addDropdown();

