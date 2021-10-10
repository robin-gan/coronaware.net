cases = cases.slice(0, indexOf3_26);
dateLabel = dateLabel.slice(0, indexOf3_26);

function adjustGraph() {
    trendLineChart.canvas.parentNode.style.height = '328px';
    trendLineChart.canvas.parentNode.style.width = '100%';
    aiPredictionLineChart.canvas.parentNode.style.height = '328px';
    aiPredictionLineChart.canvas.parentNode.style.width = '100%';
}

//trendLineChart.js setup
function generateSpan(numIn) {
    if(numIn > 0) {
        return '<span style="color:red">+' + numIn+'</span>';
    } else if (numIn == 0) {
        return '<span style="color:green">+' + numIn + '</span>';
    }

    return '<span style="color:green">' + numIn + '</span>';
}

function updateCaptain() {
    let totalActive = currentTable.cases.total_cases[0];
    let totalDeath = currentTable.cases.death[0];
    let totalActivePrev = currentTablePrev.cases.total_cases[0];
    let totalDeathPrev = currentTablePrev.cases.death[0];
    let date = currentTable.date + '/20';
    let difference = totalActive - totalActivePrev;

    document.getElementById('captainSection').innerHTML = '<h3 id="captainL">' + totalActive + '(' + generateSpan(difference) 
        + '*) total cases and ' + totalDeath + '(' + generateSpan(totalDeath - totalDeathPrev) +') deaths as of '+
        date +' (<a href="https://www.ochealthinfo.com/phs/about/epidasmt/epi/dip/prevention/novel_coronavirus">Orange County</a>).  &nbsp; </h1>' +
        '<p style="margin: 5px 0;">* ' + generateSpan(difference) + ' : means that ' + difference +' more cases compared to yesterday</p>' +
        '<p style="margin: 5px 0; margin-top:-3px">* the cases are categoried as <b>unknown</b> were not recorded in this website</p>' +
        '<span class="badge" style="float: left; background-color: rgb(218, 116, 78);color: black;">Scroll down for graphs &#8595;&#8595;</span>'
        ;

    let reverseDate = reverseArray(dateLabel);
    //let result = '<option value="' + (reverseDate.length - 1) +'" selected>Today</option>';
    let result = '';

    for (let ele in reverseDate) {
        result += '<option value="' + (reverseDate.length - ele - 1) + '">' + reverseDate[ele] +'</option>';
    }

    document.getElementById('changeDate').innerHTML = result;
}

function loadLineChart(labels, active, death) {
    trendLineChart.data.labels = labels;
    trendLineChart.data.datasets[0].data = active;
    trendLineChart.data.datasets[1].data = death;
    trendLineChart.update();
}

function resetSelecrBars() {
    document.getElementById('sortLine').value = 'total_cases';
    document.getElementById('filterLine').value = 'total';
    document.getElementById('pieL').value = 'spread_vectors';
}

function loadFromString(rowName, columnName) {
    let activeC = [];
    let deathC = [];
    let columnNum = column[columnName];

    for(let ele of cases) {
        activeC.push(ele.cases[rowName][columnNum]);
        deathC.push(ele.cases.death[columnNum]);
    }
    return loadLineChart(dateLabel, activeC, deathC);
}

function loadPieChart(labelsIn, dataIn) {
    pieChart.data.labels = labelsIn;
    pieChart.data.datasets[0].data = dataIn;
    pieChart.update();
}

function updateTable(todayTableIndex) {
    let result = '';
    todayTableIndex = parseInt(todayTableIndex);

    let todayCas = cases[todayTableIndex].cases;
    let prevCas = cases[todayTableIndex].cases;

    if (todayTableIndex != 0) {
        prevCas = cases[todayTableIndex - 1].cases;
    }

    for (let [key, value] of Object.entries(todayCas)) {
        let row = '<tr><td>' + tableFullColName[key] + '</td>';

        for (let ele in value) {
            let todayNum = value[ele];
            let prevNum = prevCas[key][ele];
            row += '<td>' + todayNum + '<span style="margin-left: 8px;"><span>'
                + generateSpan(todayNum - prevNum) + '</td>';
        }

        row += '</tr>';
        result += row;
    }

    document.getElementById('currentT').innerHTML = result;
}

function changeSelectBar() {
    if (!isMobile()) {
        document.getElementById('sortLine').className = 'browser-default';
        document.getElementById('filterLine').className = 'browser-default';
        document.getElementById('pieL').className = 'browser-default';
    }
}

function updateLineChart() {
    let sort_query = document.getElementById('sortLine').value;
    let filter_query = document.getElementById('filterLine').value;
    
    loadFromString(sort_query, filter_query);
}

function updatePieChart() {
    let pie_query = document.getElementById('pieL').value;
    let casess = currentTable.cases;

    switch(pie_query) {
        case 'spread_vectors':
            loadPieChart(['Travel', 'Person to Person (known)', 'Community Acquired', 'Under Investigation'], 
            [casess.travel_related[0], casess.person_to_person_spread[0], casess.community_acquired[0], casess.under_investigation[0]]);
            break;

        case 'gender':
            loadPieChart(['Male', 'Female'], 
            [casess.total_cases[1], casess.total_cases[2]]);
            break;

        case 'age':
            loadPieChart(['< 18', '18 - 49', '50 - 64', '≥ 65'], 
            [casess.total_cases[3], casess.total_cases[4], casess.total_cases[5], casess.total_cases[6]]);  
            break;

    }
}

var ctx = document.getElementById('myChart3').getContext('2d');
var aiPredictionLineChart = new Chart(ctx, {
    type: 'line',
    data: {
        labels: dateLabelPrediction,
        datasets: [
            {
                label: 'Actual Total Cases',
                backgroundColor: 'transparent',
                borderColor: '#ee6e73',
                pointBackgroundColor: '#ee6e73',
                pointRadius: 3,
                pointHoverRadius: 4,
                data: dateLabelActual,
                order: 0
            },
            {
                label: 'AI Prediction',
                backgroundColor: 'transparent',
                borderColor: '#00BFFF',
                pointBackgroundColor: '#00BFFF',
                pointRadius: 5,
                pointHoverRadius: 6,
                data: predictions,
                order: 1
            }
        ]
    },
    options: {
        scales: {
            yAxes: [{
                ticks: {
                    suggestedMin: 100,
                    suggestedMax: 500
                }
            }]
        },
        maintainAspectRatio: false,
        aspectRatio: 1.7
    }
});

var ctx = document.getElementById('myChart').getContext('2d');
var trendLineChart = new Chart(ctx, {
    type: 'line',
    data: {
        labels: [],
        datasets: [
            {
                label: 'Total Cases',
                backgroundColor: 'transparent',
                borderColor: '#ee6e73',
                pointBackgroundColor: '#ee6e73',
                pointRadius: 3,
                pointHoverRadius: 4,
                data: [],
                order: 0
            },
            {
                label: 'Death',
                backgroundColor: 'transparent',
                borderColor: '#aaa',
                pointBackgroundColor: '#aaa',
                data: [],
                order: 1
            }
        ]
    },
    options: {
        scales: {
            yAxes: [{
                ticks: {
                    min: 0,
                    max: maxFifty(Math.floor(currentTable.cases.total_cases[0]) + 1)
                }
            }]
        },
        maintainAspectRatio: false,
        aspectRatio: 1.7
    }
});

var ctx2 = document.getElementById('myChart2').getContext('2d');
var options = {
    segmentShowStroke: false
};
var pieChart = new Chart(ctx2, {
    type: 'pie',
    data: {
        labels: [],
        datasets: [{
            label: 'Pie Chart',
            backgroundColor: ["#1f1231", "#c51162", "#aa00ff", "#90caf9"],
            borderColor: "#111111",
            borderWidth: 0,
            data: []
        }]
    },
    options: {}
});

//changeSelectBar();
loadFromString('total_cases', 'total');
updatePieChart();
updateTable(cases.length - 1);
resetSelecrBars();
updateCaptain();
adjustGraph();

/* use once every Sunday to print JSON prediction result */
function printAIResult() {
    /*
    var net1 = new brain.recurrent.RNNTimeStep();
    var net2 = new brain.recurrent.LSTMTimeStep();
    var net3 = new brain.recurrent.GRUTimeStep();
    */
    const net = new brain.recurrent.GRUTimeStep()
    let training = [];

    for(let ele of cases) {
        training.push(ele.cases.total_cases[0]);
    }
    net.train([training]);

    console.log(net.forecast(training, 7));
}

//printAIResult();