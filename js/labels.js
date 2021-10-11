function dateSort(a, b) {
    date1 = new Date('2020/' + a);
    date2 = new Date('2020/' + b);
    
    return date1.getTime() - date2.getTime();
}

const millSecondInADay = 86400000;

const startDate = new Date("March 9, 2020");
const startTime = startDate.getTime();
const currentTime = new Date().getTime();

var currentParse = startTime;
var dateLabel = [];
var dateLabelPrediction = [];
var dateLabelActual = [];

while(currentParse < currentTime) {
    let current = new Date(currentParse);

    dateLabel.push((current.getMonth() + 1) + '/' + current.getDate());
    currentParse += millSecondInADay;
}

let copyCurrentParse = currentParse - millSecondInADay;
for (let i = 0; i < 7; i++) {
    let current = new Date(copyCurrentParse);

    dateLabelPrediction.push((current.getMonth() + 1) + '/' + current.getDate());
    if (current.getDay() == 1) {
        break;
    }
    copyCurrentParse -= millSecondInADay;
}

for(let i = 0; i < 7; i++) {
    let current = new Date(currentParse);

    dateLabelPrediction.push((current.getMonth() + 1) + '/' + current.getDate());
    if(current.getDay() == 0) {
        break;
    }
    currentParse += millSecondInADay;
}

dateLabelPrediction = dateLabelPrediction.sort(dateSort);

// the site has stopp on the week of 2020/11/7
var thisWeekDates = ['11/1', '11/2', '11/3', '11/4', '11/5', '11/6', '11/7']

/*for(i = 7; i>0; i--) {
    thisWeekDates.push(dateLabelPrediction[dateLabelPrediction.length - i]);
}*/
//console.log(thisWeekDates);
//dateLabelPrediction.shift();

for (let ele of dateLabelPrediction) {
    var found = cases.find(function (element) {
        return element.date == ele;
    });

    if (found != undefined) {
        dateLabelActual.push(found.cases.total_cases[0]);
    }
}

dateLabelPrediction = ["3/24", "3/25", "3/26", "3/27", "3/28", "3/29"];
dateLabelActual = [152, 187, 250];

if(dateLabel.length > cases.length 
    && cases[cases.length-1].date != dateLabel[dateLabel.length-1]) {
    dateLabel.splice(-1,1);
}
const indexOf3_26 = 18;
const currentTable = cases[indexOf3_26 - 1];
const currentTablePrev = cases[indexOf3_26 - 2];