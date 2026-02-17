var ctx = document.getElementById("myPieChart");
var dataLimbo = JSON.parse(document.getElementById("cakechart_info").innerHTML);

var myPieChart = new Chart(ctx, {
    type: 'doughnut',
    data: dataLimbo,
    options: {
        responsive: true,
        maintainAspectRatio: false, // Permite que use la altura del div
        cutoutPercentage: 60,       // Un poco más grueso se ve mejor
        legend: {
            display: true,
            position: 'bottom'
        }
    }
});