document.addEventListener('DOMContentLoaded', function () {

	var baseURL = "https://api.coinbase.com/v2/prices/"+ localStorage.targetCurrency +"-"+ localStorage.sourceCurrency +"/"

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

});

$(function(){
    $("#closeBtn").click(function(){window.close();})
});

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

