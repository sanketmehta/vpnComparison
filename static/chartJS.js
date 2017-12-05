console.log("loaded chartJS.js");


function bar(allColumnsData) {

  var barChartData = [];
  var barChartColor = [];
  for (x = 0; x < allColumnsData['$_/_Connection_/_Month'].length; x++) {
    barChartData[x] = parseInt(allColumnsData['$_/_Connection_/_Month'][x].slice(1, 4))
    barChartColor[x] = parseInt(allColumnsData['$_/_Connection_/_Month'][x].slice(1, 4)) * 10

  }

  var myChart = new Chart(document.getElementById("my-chart"), {
    type: 'bar',
    data: {
      labels: allColumnsData['VPN_SERVICE'],
      datasets: [
        {
          label: "Dollar/Connection/Month",
          data: barChartData
        }
      ]
    },
    options: {
      legend: { display: false },
      title: {
        display: true,
        text: 'Cost per connection on a monthly subscription.'
      }
    }
  });
  return myChart;
}


function horizontal_bar(allColumnsData) {

  var barChartData = [];
  var barChartColor = [];
  for (x = 0; x < allColumnsData['$_/_Month_-_(Annual_Pricing)'].length; x++) {
    barChartData[x] = parseInt(allColumnsData['$_/_Month_-_(Annual_Pricing)'][x].slice(1, 4))
    barChartColor[x] = parseInt(allColumnsData['$_/_Month_-_(Annual_Pricing)'][x].slice(1, 4)) * 10

  }


  var myChart = new Chart(document.getElementById("my-chart"), {
    type: 'horizontalBar',
    data: {
      labels: allColumnsData['VPN_SERVICE'],
      datasets: [
        {
          label: "$ / Month (Annual Pricing)",
          data: barChartData
        }
      ]
    },
    options: {
      legend: { display: false },
      title: {
        display: true,
        text: 'Cost per month on a yearly subscription.'
      }
    }
  });
  return myChart;
}


function bubble(allColumnsData) {

  var dataDict1 = {};
  var dataDict2 = {};
  var barChartData = [];
  var barChartColor = [];
  for (i = 0; i < allColumnsData['VPN_SERVICE'].length; i++) {

    if (isNaN(parseInt(allColumnsData['#_of_Countries'][i])) || isNaN(parseInt(allColumnsData['#_of_Servers'][i])) || isNaN(parseInt(allColumnsData['#_of_Simultaneous_Connections'][i]))) {
    }
    else {
      dataDict1 = [{
        x: parseInt(allColumnsData['#_of_Countries'][i]),
        y: parseInt(allColumnsData['#_of_Simultaneous_Connections'][i]),
        r: parseInt(allColumnsData['#_of_Servers'][i]) / 100,
      }]
      dataDict2 = {
        label: allColumnsData['VPN_SERVICE'][i],
        data: dataDict1
      }
      barChartData.push(dataDict2);
    }
  }

  console.log(barChartData);

  var myChart = new Chart(document.getElementById("my-chart"), {
    type: 'bubble',
    data: {
      labels: "Test",
      datasets: barChartData
    },
    options: {
      legend: { display: false },
      title: {
        display: true,
        fontSize: 60,
        text: 'Servers and Simultaneous connections available'
      }, scales: {
        yAxes: [{
          ticks: {
            fontSize: 40,
            fontColor: 'red',
            min: 0,
            max: 7
          },
          scaleLabel: {
            display: true,
            fontSize: 40,
            labelString: "No Of Simultaneous Connections"
          }
        }],
        xAxes: [{
          ticks: {
            fontSize: 40,
            fontColor: 'green',
          },
          scaleLabel: {
            display: true,
            fontSize: 40,
            labelString: "No Of Countries"
          }
        }]
      }
    }
  });
  return myChart;
}


function bubble_2(allColumnsData) {

  var dataDict1 = {};
  var dataDict2 = {};
  var barChartData = [];
  var barChartColor = [];
  for (i = 0; i < allColumnsData['VPN_SERVICE'].length; i++) {

    if (isNaN(parseInt(allColumnsData['#_of_Countries'][i])) || isNaN(parseInt(allColumnsData['#_of_Servers'][i])) || isNaN(parseInt(allColumnsData['#_of_Simultaneous_Connections'][i]))) {
    }
    else {
      dataDict1 = [{
        x: parseFloat(allColumnsData['$_/_Connection_/_Month'][i].slice(1, 4)),
        y: parseInt(allColumnsData['#_of_Simultaneous_Connections'][i]),
        r: parseInt(allColumnsData['#_of_Servers'][i]) / 100,
      }]
      dataDict2 = {
        label: allColumnsData['VPN_SERVICE'][i],
        data: dataDict1
      }
      barChartData.push(dataDict2);
    }
  }

  console.log(barChartData);

  var myChart = new Chart(document.getElementById("my-chart"), {
    type: 'bubble',
    data: {
      labels: "Test",
      datasets: barChartData
    },
    options: {
      legend: { display: false },
      title: {
        display: true,
        fontSize: 60,
        text: 'Servers and Simultaneous connections available with Monthly Cost'
      }, scales: {
        yAxes: [{
          ticks: {
            fontSize: 40,
            fontColor: 'red',
            min: 0,
            max: 7
          },
          scaleLabel: {
            display: true,
            fontSize: 40,
            labelString: "No Of Simultaneous Connections"
          }
        }],
        xAxes: [{
          ticks: {
            fontSize: 40,
            fontColor: 'green',
            min: 0,
            max: 5
          },
          scaleLabel: {
            display: true,
            fontSize: 40,
            labelString: "Cost Per Month"
          }
        }]
      }
    }
  });
  return myChart;
}






queryURL = 'http://localhost:5000/getColumns';
console.log(queryURL);

d3.json(queryURL, function (error, response) {
  if (error) {
    console.log(error);
  }
  else {
    responseData = response;
  }
  var myChart = bar(responseData);


  $(document).ready(function () {
    $('#purpose').on('change', function () {
      console.log("within chartJS.js")

      if (this.value == '0') {
        myChart.destroy();
        myChart = bar(responseData);
      }
      if (this.value == '1') {
        myChart.destroy();
        myChart = horizontal_bar(responseData);
      }
      if (this.value == '2') {
        myChart.destroy();
        myChart = bubble(responseData);
      }
      if (this.value == '3') {
        myChart.destroy();
        myChart = bubble_2(responseData);
      }

    });
  });

});