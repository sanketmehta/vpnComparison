
var $tbody = document.querySelector("tbody");
var $thead = document.querySelector("thead");
var $tfoot = document.querySelector("tfoot");

var filteredData = [];

queryURL = 'http://localhost:5000/simpleCompareData';

d3.json(queryURL, function (error, response) {
  if (error) {
    console.log(error);
  }
  else {
    filteredData = response;

    for (var i = 0; i < 1; i++) {
      var address = filteredData[i];
      var fields = Object.keys(address);
      console.log(fields);
      var $row = $thead.insertRow(i);
      var $rowF = $tfoot.insertRow(i);

      for (var j = 0; j < fields.length; j++) {

        var field = fields[j];
        var $cell = $row.insertCell(j);
        $cell.innerText = field;
        var $cellF = $rowF.insertCell(j);
        $cellF.innerText = field;
      }

    }

    for (var i = 0; i < filteredData.length; i++) {

      var address = filteredData[i];
      var fields = Object.keys(address);
      var $row = $tbody.insertRow(i);

      for (var j = 0; j < fields.length; j++) {
        var field = fields[j];
        var $cell = $row.insertCell(j);
        $cell.innerText = address[field];
      }
    }


    colOrderList = ['VPN_SERVICE', 'Jurisdiction', 'Logging', 'Activism', 'Service_Config', 'Security', 'Availability', 'Website', 'Pricing', 'Ethics'];
    $(document).ready(function () {

      // DataTable
      var table = $('#example').DataTable(
        {
          'rowCallback': function (row, data, index) {
              for (a = 0; a < 10; a++) {
              // $('td:eq(' + a + ')', row).html('<b>' + data[a] + '</b>');
              // $('td:eq(' + a + ')', row).html('<b>' + data[a] + '</b>');
              
              // $('td:eq(' + a + ')', row).style.fontWeight="bold";
              if (data[a] <= 1) {
                $(row).find('td:eq(' + a + ')').css('color', 'green');
              }
              else if (data[a] < 3) {
                $(row).find('td:eq(' + a + ')').css('color', 'orange');
              }
              else if (data[a] < 10) {
                $(row).find('td:eq(' + a + ')').css('color', 'red');
              }
              else {
                $(row).find('td:eq(' + a + ')').css('color', 'black');
              }
            }
          },
          initComplete: function () {
            this.api().columns().every( function () {
                var column = this;
                if($(this.header()).text() == "VPN_SERVICE"){}
                else{
                var select = $('<select><option value="">All</option></select>')
                    .appendTo( $(column.footer()).empty() )
                    .on( 'change', function () {
                        var val = $.fn.dataTable.util.escapeRegex(
                            $(this).val()
                        );
 
                        column
                            .search( val ? '^'+val+'$' : '', true, false )
                            .draw();
                    } );
 
                column.data().unique().sort().each( function ( d, j ) {
                    // console.log('start'+d+'end');
                    select.append( '<option value="'+d+'">'+d+'</option>' )
                } );

              }
            } );
        },
          colReorder: {
            order: [8, 3, 4, 2, 5, 6, 9, 1, 0, 7]
          }
        }
      );

      // Setup - add a text input to each footer cell
      $('#example tfoot tr td').each(function () {
        var title = $(this).text();
        if(title == "VPN_SERVICE"){
        $(this).html('<input type="text" placeholder="Search ' + title + '" />');
        }
      });



      // Apply the search
      table.columns().every(function () {
        var that = this;
        $('input', this.footer()).on('keyup change', function () {
          if (that.search() !== this.value) {
            // console.log("---",this.placeholder,"---");

            //Performing smart search for VPN_SERVICE column only and regex search for rest columns
            if (this.placeholder == "Search VPN_SERVICE") {
              that
                .search(this.value)
                // .search( searchTerm, true, false )
                .draw();
            }
            // else {
            //   searchTerm = '^' + this.value + '$';
            //   if (searchTerm == "^$") {
            //     searchTerm = '.*'
            //   }
            //   that
            //     // .search( this.value )
            //     .search(searchTerm, true, false)
            //     .draw();
            // }
          }


          $('td').each(function (cell) {
            if (this.innerText <= 1) {
              this.style.color="green";
            }
            else if (this.innerText < 3) {
              this.style.color="orange";
            }
            else if (this.innerText < 10) {
              this.style.color="red";
            }
            else {
              this.style.color="black";
            }
            // this.style.fontWeight="bold";
            
          });
  



        });

        $('tbody').each(function () {
          this.style.fontWeight="bold";
        });

      });



    });
  }



});




