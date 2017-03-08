default_config = {
    "sourceCurrency": "EUR",
    "targetCurrency": "ETH",
    "chartPeriod":"hour",
    "updateDelay": 10,
    "panicValue" : 0,
    "alertValue" : 0
};

if (typeof localStorage.delay === "undefined") {
    localStorage.setItem("delay", default_config.updateDelay);
}

if (typeof localStorage.chartPeriod === "undefined") {
    localStorage.setItem("chartPeriod", default_config.chartPeriod);
}

if (typeof localStorage.delay === "undefined") {
    localStorage.setItem("alertValue", default_config.alertValue);
}

if (typeof localStorage.panicValue === "undefined") {
    localStorage.setItem("panicValue", default_config.panicValue);
}

if (typeof localStorage.sourceCurrency === "undefined") {
    localStorage.setItem("sourceCurrency", default_config.sourceCurrency);
}

if (typeof localStorage.targetCurrency === "undefined") {
    localStorage.setItem("targetCurrency", default_config.targetCurrency);
}

function updateTicker() {

    jQuery.getJSON(
        "https://api.coinbase.com/v2/prices/"+ localStorage.targetCurrency +"-"+ localStorage.sourceCurrency +"/spot",
        function (data, txtStatus, xhr) {
            priceString = data.data.amount.toString();
            price = data.data.amount;
            chrome.browserAction.setBadgeText({text: priceString});
            if(parseFloat(price) > localStorage.alertValue && localStorage.alertValue > 0){
              createNotification(" is over ");
            }

            else if(parseFloat(price) < localStorage.panicValue && localStorage.panicValue > 0){
              createNotification(" is under ");
            }
    });
}

function createNotification(sentence){
    var myNotificationID = null;

    chrome.notifications.create("price", {
      type: "basic",
      title: localStorage.targetCurrency + "" + sentence + "" + localStorage.alertValue,
      message: localStorage.targetCurrency + " rate price is " + priceString,
      iconUrl: "img/icon80.png",
      buttons: [
        {
          title: "Go to Coinbase",
          iconUrl: "img/icon.png"
        }
      ]
      }, function (id) {
        myNotificationID = id;
      }
  );
}

window.setInterval(updateTicker, localStorage.delay);

updateTicker();

chrome.extension.onMessage.addListener(
    function (request, sender, sendResponse) {
        if (request.msg == "resetTicker") updateTicker();
    }
);

chrome.notifications.onButtonClicked.addListener(function(notifId, btnIdx) {
  chrome.tabs.create({ url: "https://www.coinbase.com/dashboard" });
});
