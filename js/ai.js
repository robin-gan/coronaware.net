function adjustGraph() {
}

var ctx = document.getElementById('aiPrediction').getContext('2d');
var trendLineChart = new Chart(ctx, {
    type: 'line',
    data: {
        labels: thisWeekDates,
        datasets: [
            {
                label: 'Actual cases in OC',
                backgroundColor: 'transparent',
                borderColor: '#ee6e73',
                pointBackgroundColor: '#ee6e73',
                pointRadius: 3,
                pointHoverRadius: 4,
                data: [52945, 53190, 53382, 53471, 53560, 53707, 53811],
                order: 0
            },
            {
                label: 'CNN',
                backgroundColor: 'transparent',
                borderColor: '#5857E6',
                pointBackgroundColor: '#5857E6',
                pointRadius: 3,
                pointHoverRadius: 4,
                data: [52793, 52894, 52902, 53254, 53719, 54097, 54647],
                order: 0
            },
            {
                label: 'LMTQ',
                backgroundColor: 'transparent',
                borderColor: '#7DD1AB',
                pointBackgroundColor: '#7DD1AB',
                pointRadius: 3,
                pointHoverRadius: 4,
                data: [53152, 53175, 53493, 53525, 53544, 53620, 53750],
                order: 0
            },
            {
                label: 'GRU',
                backgroundColor: 'transparent',
                borderColor: '#E742B6',
                pointBackgroundColor: '#E742B6',
                pointRadius: 3,
                pointHoverRadius: 4,
                data: [53091, 53439, 53443, 53760, 54040, 54490, 54714],
                order: 0
            }
        ]
    },
    options: {
        scales: {
            yAxes: [{
                ticks: {
                    min: 52500,
                    max: 55000
                }
            }]
        },
        maintainAspectRatio: false,
        aspectRatio: 1.7
    }
});

function adjustGraph() {
    trendLineChart.canvas.parentNode.style.height = '328px';
    trendLineChart.canvas.parentNode.style.width = '100%';
}

function loadLineChart(labels, active, death) {
    trendLineChart.data.labels = labels;
    trendLineChart.data.datasets[0].data = active;
    trendLineChart.data.datasets[1].data = death;
    trendLineChart.update();
}


function loadFromString(rowName, columnName) {
    let activeC = [];
    let deathC = [];
    let columnNum = column[columnName];

    for (let ele of cases) {
        activeC.push(ele.cases[rowName][columnNum]);
        deathC.push(ele.cases.death[columnNum]);
    }
    return loadLineChart(dateLabel, activeC, deathC);
}

function updateLineChart() {
    let sort_query = document.getElementById('sortLine').value;
    let filter_query = document.getElementById('filterLine').value;

    loadFromString(sort_query, filter_query);
}

adjustGraph();

/* use once every Sunday to print JSON prediction result */
function printAIResult() {
    /*
    var net1 = new brain.recurrent.RNNTimeStep();
    var net2 = new brain.recurrent.LSTMTimeStep();
    var net3 = new brain.recurrent.GRUTimeStep();
    */
    const net = new brain.recurrent.GRUTimeStep();
    let training = [52945, 53190, 53382, 53471, 53560, 53707, 53811];

    for (let ele of cases) {
        training.push(ele.cases.total_cases[0]);
    }
    net.train([training]);

    console.log(net.forecast(training, 7));
}

//printAIResult();