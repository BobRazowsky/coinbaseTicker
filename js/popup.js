document.addEventListener('DOMContentLoaded', function () {
  
    startListeners();
    updateInputValues();
    updatePrices();
    changeCurrencyIcon();
    getChartValues();

});

function startListeners(){
    document.querySelector('select[name="chartPeriod"]').onchange = function(e){
        this.blur();
        updateChartPeriod(e);
    }

    document.querySelector('input[name="targetPrice"]').onchange=updateAlertValue;
    document.querySelector('input[name="panicValue"]').onchange=updatePanicValue;

    document.querySelector('input[name="targetPrice"]').onkeypress = function(e){
        if(!e) e = window.event;
        var keyCode = e.keyCode || e.which;
        if(keyCode == 13){
            this.blur();
            updateAlertValue(e);
            return false;
        }
    }

    document.querySelector('input[name="panicValue"]').onkeypress = function(e){
        if(!e) e = window.event;
        var keyCode = e.keyCode || e.which;
        if(keyCode == '13'){
            this.blur();
            updatePanicValue(e);
            return false;
        }
    }
}

function changeCurrencyIcon(){
    if(localStorage.targetCurrency === "ETH"){
        document.querySelector('img[name="currIco"]').src = "img/eth16.png";
    } else{
        document.querySelector('img[name="currIco"]').src = "img/btc16.png";
    }
}

function updateInputValues(){
    document.querySelector('select[name="chartPeriod"]').value = localStorage.chartPeriod;
    document.getElementById("tabletitle").innerHTML = localStorage.targetCurrency + " to " + localStorage.sourceCurrency;
    document.querySelector('input[name="targetPrice"]').value = localStorage.alertValue;
    document.querySelector('input[name="panicValue"]').value = localStorage.panicValue;
}

function updatePrices(){

    var baseURL = "https://api.coinbase.com/v2/prices/"+ localStorage.targetCurrency +"-"+ localStorage.sourceCurrency +"/";
    jQuery.getJSON(
        baseURL + "spot",
        function (data, txtStatus, xhr) {
            priceString = data.data.amount.toString();
            price = data.data.amount;
            var ethRate = document.getElementById("priceRate");
            ethRate.innerHTML = priceString.toString();
    });

    jQuery.getJSON(
        baseURL + "buy",
        function (data, txtStatus, xhr) {
            priceString = data.data.amount.toString();
            price = data.data.amount;
            var ethBuy = document.getElementById("priceBuy");
            ethBuy.innerHTML = priceString.toString();
    });

    jQuery.getJSON(
        baseURL + "sell",
        function (data, txtStatus, xhr) {
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
            limit = 24;
            type = "hour";
            aggregate = 0;
            break;
        case "week":
            limit = 84;
            type = "hour";
            aggregate = 2;
            break;
        case "month":
            limit = 30;
            type = "day";
            aggregate = 0;
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


    jQuery.getJSON(
        "https://min-api.cryptocompare.com/data/histo"+ type +"?fsym="+ localStorage.targetCurrency +"&tsym="+ localStorage.sourceCurrency +"&limit="+ limit +"&aggregate="+ aggregate +"&e=CCCAGG&useBTC=false",
        function (data, txtStatus, xhr) {
            if(data.Response == "Error"){
                console.log("No chart data for this currency");
                document.getElementById("chart").style.display = "none";
                return;
            }

            for(var i = 0; i < data.Data.length; i++){
                chartsData.push({x: i*(200/limit) ,y: (data.Data[i].close + data.Data[i].open) / 2});
            }

            buildChart(chartsData);
        }
    );
}

function buildChart(chartsData){
    var ctx = document.getElementById("hourChart");

    var hourChart = new Chart(ctx, {
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
            }
        }
    });
}

function updateAlertValue(event){
    localStorage.alertValue = event.target.value;
}

function updatePanicValue(event){
    localStorage.panicValue = event.target.value;
}

function updateChartPeriod(event){
    localStorage.chartPeriod = event.target.value;
    getChartValues();
}

window.setInterval(updatePrices, localStorage.delay);
