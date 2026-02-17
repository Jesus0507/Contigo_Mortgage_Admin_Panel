var ctxArea = document.getElementById("myAreaChart");
var dataSpeed = JSON.parse(document.getElementById("areachart_data").innerHTML);

var myLineChart = new Chart(ctxArea, {
  type: 'line',
  data: dataSpeed,
  options: {
    maintainAspectRatio: false, // Obligatorio para que use los 300px del div
    scales: {
      xAxes: [{
        gridLines: { display: false },
        ticks: {
          maxTicksLimit: 7 // Evita que las fechas se amontonen abajo
        }
      }],
      yAxes: [{
        ticks: {
          min: 0,
          beginAtZero: true,
          // Si tienes poca data, esto evita que salgan decimales como 0.5, 1.5
          callback: function(value) { if (value % 1 === 0) { return value + ' días'; } },
          maxTicksLimit: 5 // Limita la cantidad de números en el eje vertical
        },
        gridLines: { color: "rgba(0, 0, 0, .125)" }
      }],
    },
    legend: { display: false }
  }
});