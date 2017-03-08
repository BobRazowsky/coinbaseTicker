default_config = {
    "sourceCurrency": "EUR",
    "targetCurrency": "ETH",
    // "alertsActive": 1,
    // "alertsAmountChange": 0.0005,
    "updateDelay": 30,
    "panicValue" : 0
};

if (typeof localStorage.delay === "undefined") {
    localStorage.setItem("delay", 10000);
}

if (typeof localStorage.delay === "undefined") {
    localStorage.setItem("alertValue", 0);
}

if (typeof localStorage.panicValue === "undefined") {
    localStorage.setItem("panicValue", 0);
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
        if(price > localStorage.alertValue && localStorage.alertValue > 0){

            chrome.notifications.create("price", {
                type: "basic",
                title: localStorage.targetCurrency + " price is over " + localStorage.alertValue,
                message: localStorage.targetCurrency + " rate price is" + priceString,
                iconUrl: "img/icon.png"
                }, function () {
            });
        }

        if(price < localStorage.panicValue && localStorage.panicValue > 0){

            chrome.notifications.create("price", {
                type: "basic",
                title: localStorage.targetCurrency + " price is lower " + localStorage.panicValue,
                message: localStorage.targetCurrency + " rate price is" + priceString,
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
