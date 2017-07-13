document.addEventListener('DOMContentLoaded', function () {
  
    startListeners();
    updateInputValues();
    updatePrices();
    changeCurrencyIcon();
    getChartValues();

    translate();
});

function startListeners(){
    document.querySelector('select[name="chartPeriod"]').onchange = function(e){
        this.blur();
        updateChartPeriod(e);
    }

    document.querySelector('input[name="targetPrice"]').onchange=updateAlertValue;
    document.querySelector('input[name="panicValue"]').onchange=updatePanicValue;

    document.querySelector('th[name="ico"').onclick = rollCurrency;

    document.querySelector('input[name="targetPrice"]').onkeypress = function(e){
        if(!e) e = window.event;
        var keyCode = e.keyCode || e.which;
        if(keyCode == 13){
            this.blur();
            updateAlertValue(e);
            return false;
        }
    };

    document.querySelector('input[name="panicValue"]').onkeypress = function(e){
        if(!e) e = window.event;
        var keyCode = e.keyCode || e.which;
        if(keyCode == '13'){
            this.blur();
            updatePanicValue(e);
            return false;
        }
    };
}

function changeCurrencyIcon(){
    if(localStorage.targetCurrency === "ETH"){
        document.querySelector('img[name="currIco"]').src = "img/eth16.png";
    } else if(localStorage.targetCurrency === "BTC"){
        document.querySelector('img[name="currIco"]').src = "img/btc16.png";
    } else if(localStorage.targetCurrency === "LTC"){
        document.querySelector('img[name="currIco"]').src = "img/ltc.png";
    } else {
        document.querySelector('img[name="currIco"]').src = "img/etc16.png";
    }
}

function rollCurrency(){
    var currencies = ["BTC", "ETH", "LTC", "ETC"];
    var currentCurrIndex = currencies.indexOf(localStorage.targetCurrency);
    var nextIndex = currentCurrIndex + 1;
    if(nextIndex > 3){
        nextIndex = 0;
    }
    localStorage.targetCurrency = currencies[nextIndex];
    changeCurrencyIcon();
    updatePrices();
    getChartValues();
    updateInputValues();
}

function updateInputValues(){
    document.querySelector('select[name="chartPeriod"]').value = localStorage.chartPeriod;
    document.getElementById("tabletitle").innerHTML = localStorage.targetCurrency + " to " + localStorage.sourceCurrency;
    document.querySelector('input[name="targetPrice"]').value = localStorage.alertValue;
    document.querySelector('input[name="panicValue"]').value = localStorage.panicValue;

}

function getJSON(url, callback){
    var request = new XMLHttpRequest();
    request.open('GET', url, true);
    request.onload = function(){
        if(request.status >= 200 && request.status < 400){
            var data = JSON.parse(request.responseText);
            callback(data, request);
        }
    }
    request.onerror = function() {};
    request.send();
}

function updatePrices(){

    var priceString, price;

    var baseURL = "https://api.coinbase.com/v2/prices/"+ localStorage.targetCurrency +"-"+ localStorage.sourceCurrency +"/";
    getJSON(
        baseURL + "spot",
        function (data) {
            priceString = data.data.amount.toString();
            price = data.data.amount;
            var ethRate = document.getElementById("priceRate");
            ethRate.innerHTML = priceString.toString();
    });

    getJSON(
        baseURL + "buy",
        function (data) {
            priceString = data.data.amount.toString();
            price = data.data.amount;
            var ethBuy = document.getElementById("priceBuy");
            ethBuy.innerHTML = priceString.toString();
    });

    getJSON(
        baseURL + "sell",
        function (data) {
            priceString = data.data.amount.toString();
            price = data.data.amount;
            var ethSell = document.getElementById("priceSell");
            ethSell.innerHTML = priceString.toString();
    });
}

function getChartValues(){
    var limit = 0;
    var type = "";
    var aggregate = 0;

    switch(localStorage.chartPeriod){
        case "hour":
            limit = 60;
            type="minute";
            aggregate = 0;
            break;
        case "day":
            limit = 96;
            type = "minute";
            aggregate = 15;
            break;
        case "week":
            limit = 84;
            type = "hour";
            aggregate = 2;
            break;
        case "month":
            limit = 90;
            type = "hour";
            aggregate = 8;
            break;
        case "year":
            limit = 122;
            type = "day";
            aggregate = 3;
            break;
        default:
            limit = 60;
            type = "minute";
            aggregate = 0;
    }

    var chartsData = [];

    getJSON(
        "https://min-api.cryptocompare.com/data/histo"+ type +
        "?fsym="+ localStorage.targetCurrency +
        "&tsym="+ localStorage.sourceCurrency +
        "&limit="+ limit +
        "&aggregate="+ aggregate +
        "&useBTC=false",
        function (data, request) {
            if(request.Response == "Error"){
                console.log("No chart data for this currency");
                document.getElementById("chart").style.display = "none";
                return;
            }

            for(var i = 0; i < data.Data.length; i++){
                chartsData.push({x: i*(200/limit) ,y: (data.Data[i].close + data.Data[i].open) / 2});
            }

            buildChart(chartsData);

            var indexEnd = data.Data.length - 1;
            var start = (data.Data[0].close + data.Data[0].open) / 2;
            var end = (data.Data[indexEnd].close + data.Data[indexEnd].open) / 2;
            var change = ((100 * end) / start) - 100;

            var sign = (change > 0) ? "+" : "-";
            var color = (change > 0) ? "#2B8F28" : "#FF4143";

            document.querySelector('#changeValue').innerHTML = sign + change.toFixed(2) + "%";
            document.querySelector('#changeValue').style.color = color;

        }
    );
}

function buildChart(chartsData){
    var ctx = document.getElementById("chartCanvas");

    if(typeof priceChart !== "undefined"){
      priceChart.destroy();
    }

    priceChart = new Chart(ctx, {
        type: 'line',
        data: {
            datasets:[
                {
                    label: "price",
                    fill: false,
                    data: chartsData,
                    pointRadius: 0,
                    borderWidth: 2,
                    borderColor: "#2B71B1",
                    lineTension: 0.1
                }
            ]
        },
        options: {
            legend: {
                display: false
            },
            tooltips: {
                enabled: false
            },
            scales: {
                xAxes: [{
                    display: false,
                    type: 'linear',
                    position: 'bottom'
                }]
            },
            hover: {

            }
        }
    },
    {
      lineAtIndex: 2
    }
    );
}

function updateAlertValue(event){
    localStorage.alertValue = event.target.value;
}

function updatePanicValue(event){
    localStorage.panicValue = event.target.value;
}

function translate(){

    document.getElementById("strSpotrate").innerHTML = chrome.i18n.getMessage("strSpotrate");
    document.getElementById("strBuyPrice").innerHTML = chrome.i18n.getMessage("strBuyPrice");
    document.getElementById("strSellPrice").innerHTML = chrome.i18n.getMessage("strSellPrice");
    document.getElementById("strTargetPrice").innerHTML = chrome.i18n.getMessage("strTargetPrice");
    document.getElementById("strPanicPrice").innerHTML = chrome.i18n.getMessage("strPanicPrice");
    document.getElementById("strHour").innerHTML = chrome.i18n.getMessage("strHour");
    document.getElementById("strDay").innerHTML = chrome.i18n.getMessage("strDay");
    document.getElementById("strWeek").innerHTML = chrome.i18n.getMessage("strWeek");
    document.getElementById("strMonth").innerHTML = chrome.i18n.getMessage("strMonth");
    document.getElementById("strYear").innerHTML = chrome.i18n.getMessage("strYear");
    document.getElementById("coinbaseBtn").innerHTML = chrome.i18n.getMessage("coinbaseBtn");
    document.getElementById("settingsBtn").innerHTML = chrome.i18n.getMessage("settingsBtn");
    document.getElementById("strLast").innerHTML = chrome.i18n.getMessage("strLast");

}

function updateChartPeriod(event){
    localStorage.chartPeriod = event.target.value;
    getChartValues();
}
