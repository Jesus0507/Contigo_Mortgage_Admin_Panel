var ctxBar = document.getElementById("myBarChart");
// Parseamos la data que viene de tu PHP
var chart_info = JSON.parse(document.getElementById("barchart_data").innerHTML);

var myBarChart = new Chart(ctxBar, {
  type: 'bar',
  data: chart_info,
  options: {
    maintainAspectRatio: false, // Importante para usar la altura del div
    legend: {
      display: false // Ocultamos la leyenda para ganar espacio
    },
    scales: {
      xAxes: [{
        gridLines: {
          display: false
        },
        ticks: {
          maxTicksLimit: 6
        }
      }],
      yAxes: [{
        ticks: {
          min: 0,
          beginAtZero: true,
          // Forzamos a que solo muestre números enteros (1, 2, 3...)
          stepSize: 1, 
          // Si tienes muy poca data, esto le da un margen arriba para que no se pegue al techo
          suggestedMax: 5,
          maxTicksLimit: 5
        },
        gridLines: {
          display: true,
          color: "rgba(0, 0, 0, .125)"
        }
      }],
    }
  }
});