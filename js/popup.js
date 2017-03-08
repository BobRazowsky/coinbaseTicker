document.addEventListener('DOMContentLoaded', function () {

  if (typeof localStorage.chartPeriod === "undefined") {
      localStorage.setItem("chartPeriod", "hour");
  }

  document.querySelector('select[name="chartPeriod"]').value = localStorage.chartPeriod;

  document.querySelector('select[name="chartPeriod"]').onchange=updateChartPeriod;

	var baseURL = "https://api.coinbase.com/v2/prices/"+ localStorage.targetCurrency +"-"+ localStorage.sourceCurrency +"/";

  if(localStorage.targetCurrency === "ETH"){
    document.querySelector('img[name="currIco"]').src = "img/eth16.png";
    
  } else{
    document.querySelector('img[name="currIco"]').src = "img/btc16.png";
    //document.getElementById("tabletitle").innerHTML = "Bitcoin";
  }

  document.getElementById("tabletitle").innerHTML = localStorage.targetCurrency + " to " + localStorage.sourceCurrency;
  /*document.getElementById("targetPrice").innerHTML = "Target price is " + localStorage.alertValue;
  document.getElementById("panicValue").innerHTML = "Target price is " + localStorage.panicValue;*/

  document.querySelector('input[name="targetPrice"]').value = localStorage.alertValue;
  document.querySelector('input[name="targetPrice"]').onchange=updateAlertValue;

  document.querySelector('input[name="panicValue"]').value = localStorage.panicValue;
  document.querySelector('input[name="panicValue"]').onchange=updatePanicValue;

	jQuery.getJSON(
      baseURL + "spot", 
      function (data, txtStatus, xhr) {
        priceString = data.data.amount.toString();
        price = data.data.amount;
        chrome.browserAction.setBadgeText({text: priceString});

        var ethRate = document.getElementById("ethereumRate");
		ethRate.innerHTML = priceString.toString();

    });

    jQuery.getJSON(
      baseURL + "buy",
      function (data, txtStatus, xhr) {
        priceString = data.data.amount.toString();
        price = data.data.amount;
        chrome.browserAction.setBadgeText({text: priceString});

		var ethBuy = document.getElementById("ethereumBuy");
		ethBuy.innerHTML = priceString.toString();
    });

    jQuery.getJSON(
      baseURL + "sell", 
      function (data, txtStatus, xhr) {
        priceString = data.data.amount.toString();
        price = data.data.amount;
        chrome.browserAction.setBadgeText({text: priceString});

		var ethSell = document.getElementById("ethereumSell");
		ethSell.innerHTML = priceString.toString();
    });

    // CHART

    createChart();

});

$(function(){
    $("#closeBtn").click(function(){window.close();})
});

function createChart(){

    var ctx = document.getElementById("hourChart");

    var limit = 0;
    var type = "";

    switch(localStorage.chartPeriod){
      case "hour":
        limit = 60;
        type="minute";
        break;
      case "day":
        limit = 24;
        type = "hour";
        break;
      case "month":
        limit = 30;
        type = "day";
        break;
      case "year":
        limit = 365;
        type = "day";
        break;
      default:
        limit =60;
        type = "minute";
    }
    

    var chartsData = [];

    jQuery.getJSON(
        "https://min-api.cryptocompare.com/data/histo"+ type +"?fsym="+ localStorage.targetCurrency +"&tsym="+ localStorage.sourceCurrency +"&limit="+ limit +"&aggregate=3&e=CCCAGG&useBTC=false",
        function (data, txtStatus, xhr) {

          var sum = 0;


          for(var i = 0; i < data.Data.length; i++){
            console.log(data.Data[i]);
            chartsData.push({x: i*(200/limit) ,y: (data.Data[i].close + data.Data[i].open) / 2});
          }

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
                    borderColor: "#2B71B1"
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
    createChart();
}

// function updatePopup(){

// 	jQuery.getJSON(
//       "https://api.coinbase.com/v2/prices/ETH-EUR/spot", 
//       function (data, txtStatus, xhr) {
//         priceString = data.data.amount.toString();
//         price = data.data.amount;
//         chrome.browserAction.setBadgeText({text: priceString});

//         alert(priceString);
        
//         // if(price > 18.5){
//         //   chrome.notifications.create("price", {
//         //     type: "basic",
//         //     title: "Eth price is over your fixed limit",
//         //     message: "Eth sell price is",
//         //     iconUrl: "img/icon.png"
//         //   }, function (notifId) {
//         //   });
//         // }
//      });

// 	$("#ethereumRate").html().text(priceString);


// }

// updatePopup();

