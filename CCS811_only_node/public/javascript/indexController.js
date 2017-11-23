//connect socket to the server
let socket = io();

//chart settings
////////////////////////////////////////////////////
let ctx = document.getElementById("myChart");
let myChart = new Chart(ctx, {
    type: 'line',
    responsive:true,
    maintainAspectRatio:true,
    data: {
        labels: [],
        datasets: [
          {
            label: '# of eCO2 ppm',
            data: [],
            backgroundColor: [
                'rgba(255, 99, 132, 0.2)',
                'rgba(54, 162, 235, 0.2)',
                'rgba(255, 206, 86, 0.2)'

            ],
            borderColor: [
                'rgba(255,99,132,1)',
                'rgba(54, 162, 235, 1)',
                'rgba(255, 206, 86, 1)'
            ],

            borderWidth: 1
        },
        {
            label: '# of TVOC ppb',
            data: [],
            backgroundColor: [
                'rgba(11, 56, 193, 0.2)'

            ],
            borderColor: [
                'rgba(10, 56, 218, 1)'
            ],
            borderWidth: 1
        }
      ]
    },
    options: {
  				scales: {
  					xAxes: [{

  						scaleLabel: {
  							display: true,
  							labelString: 'Date'
  						}
  					}, ],
  					yAxes: [{
              ticks: {
                    beginAtZero:true
                },
  						scaleLabel: {
  							display: true,
  							labelString: 'value'
  						}
  					}]
  				},
  			}
  		});

// remove / add chart data
// ==============================================
function addData(chart, label, eCO2,TVOC) {
  chart.data.labels.push(label);

  chart.data.datasets[0].data.push(eCO2)
  chart.data.datasets[1].data.push(TVOC)

  chart.update();
}

function removeData(chart) {
    chart.data.labels.shift();
    chart.data.datasets.forEach((dataset) => {
        dataset.data.shift();
    });
    chart.update();
}


// get sensor data
// ==============================================
  socket.on('sensor_data',function(sensor_data){
    console.log('new data recived')
    console.log(sensor_data)
      addData(myChart,sensor_data.time,sensor_data.eCO2,sensor_data.TVOC)
      if(myChart.data.labels.length > 20){
        removeData(myChart)
      }
  })
