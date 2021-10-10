$(document).ready(function () {
    $('select').formSelect();
    $('.sidenav').sidenav();
    chartsize();
    window.onresize = function (event) {
        $('.sidenav').sidenav();
        chartsize();
        adjustGraph();
    }
    $('.tabs').tabs();
    $('.modal').modal();
});

//menu setup
function chartsize() {
    width = document.documentElement.clientWidth;
    if (width < 1300) {
        $('.resize').removeClass('s6');
        $('.resize').addClass('s12');
    }
    else {
        $('.resize').removeClass('s12');
        $('.resize').addClass('s6');
    }
}

/**
 * check if the user is on mobile or ipad
 */
function isMobile() {
    if (/iPhone|iPad|iPodMobi|Android/i.test(navigator.userAgent)) {
        return true;
    }
    return false;
}

function maxFifty(numIn) {
    return (Math.floor((parseInt(numIn) / 50)) + 1) * 50;
}

function reverseArray(arr) {
    var newArray = [];
    for (var i = arr.length - 1; i >= 0; i--) {
        newArray.push(arr[i]);
    }
    return newArray;
}