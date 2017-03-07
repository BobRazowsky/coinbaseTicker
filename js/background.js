default_config = {
    "sourceCurrency": "EUR",
    "targetCurrency": "ETH",
    // "alertsActive": 1,
    // "alertsAmountChange": 0.0005,
    "updateDelay": 30,
};

if (typeof localStorage.delay === "undefined") {
    localStorage.setItem("delay", 10000);
}


if (typeof localStorage.sourceCurrency === "undefined") {
    localStorage.setItem("sourceCurrency", "EUR");
} 

if (typeof localStorage.targetCurrency === "undefined") {
    localStorage.setItem("targetCurrency", "ETH");
}

function updateTicker() {

jQuery.getJSON(
    "https://api.coinbase.com/v2/prices/"+ localStorage.targetCurrency +"-"+ localStorage.sourceCurrency +"/spot", 
    function (data, txtStatus, xhr) {
      priceString = data.data.amount.toString();
      price = data.data.amount;
      chrome.browserAction.setBadgeText({text: priceString});
      if(price > localStorage.alertValue && localStorage.alertValue > 0){
        chrome.notifications.create("price", {
          type: "basic",
          title: "Eth price is over " + localStorage.alertValue,
          message: "Eth rate price is" + priceString,
          iconUrl: "img/icon.png"
        }, function () {
        });
      }
    }); 
}

window.setInterval(updateTicker, localStorage.delay);

updateTicker();

chrome.extension.onMessage.addListener(
    function (request, sender, sendResponse) {
        if (request.msg == "resetTicker") updateTicker();
    }
);



/*var newURL = "https://coinbase.com/buys";
          chrome.tabs.create({ url: newURL });*/
