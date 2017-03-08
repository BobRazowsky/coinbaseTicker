document.addEventListener('DOMContentLoaded', function () {

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

    var ctx = document.getElementById("hourChart");

    

    var chartsData = [];

    jQuery.getJSON(
        "https://min-api.cryptocompare.com/data/histominute?fsym=ETH&tsym=EUR&limit=60&aggregate=3&e=CCCAGG",
        function (data, txtStatus, xhr) {

          var sum = 0;


          for(var i = 0; i < data.Data.length; i++){
            chartsData.push({x: i ,y: (data.Data[i].high + data.Data[i].low) / 2});
            //sum += data.Data[i].low;
          }

          //alert(chartsData);

          var hourChart = new Chart(ctx, {
              type: 'line',
              data: {
                datasets:[
                  {
                    label: "Eth price",
                    fill: false,
                    data: chartsData,
                    pointBorderWidth: 0
                  }
                ]
              },
              options: {
                  legend: {
                    display: false
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



});

$(function(){
    $("#closeBtn").click(function(){window.close();})
});

function updateAlertValue(event){
    localStorage.alertValue = event.target.value;
}

function updatePanicValue(event){
    localStorage.panicValue = event.target.value;
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

