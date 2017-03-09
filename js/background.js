let default_config = {
    "sourceCurrency": "EUR",
    "targetCurrency": "ETH",
    "chartPeriod":"day",
    "updateDelay": 10,
    "panicValue" : 0,
    "alertValue" : 0
};

function initializeConfig(configuration){
    if (typeof localStorage.delay === "undefined") {
        localStorage.setItem("delay", configuration.updateDelay * 1000);
    }

    if (typeof localStorage.chartPeriod === "undefined") {
        localStorage.setItem("chartPeriod", configuration.chartPeriod);
    }

    if (typeof localStorage.alertValue === "undefined") {
        localStorage.setItem("alertValue", configuration.alertValue);
    }

    if (typeof localStorage.panicValue === "undefined") {
        localStorage.setItem("panicValue", configuration.panicValue);
    }

    if (typeof localStorage.sourceCurrency === "undefined") {
        localStorage.setItem("sourceCurrency", configuration.sourceCurrency);
    }

    if (typeof localStorage.targetCurrency === "undefined") {
        localStorage.setItem("targetCurrency", configuration.targetCurrency);
    }
}

function updateTicker() {

    jQuery.getJSON(
        "https://api.coinbase.com/v2/prices/"+ localStorage.targetCurrency +"-"+ localStorage.sourceCurrency +"/spot",
        function (data, txtStatus, xhr) {
            priceString = data.data.amount.toString();
            price = data.data.amount;
            chrome.browserAction.setBadgeText({text: priceString});
            if(parseFloat(price) > localStorage.alertValue && localStorage.alertValue > 0){
                createNotification(" is over ", localStorage.alertValue);
            }

            else if(parseFloat(price) < localStorage.panicValue && localStorage.panicValue > 0){
                createNotification(" is under ", localStorage.panicValue);
            }
    });

    setTimeout(updateTicker, localStorage.delay);
}

function createNotification(sentence, value){
    var myNotificationID = null;

    chrome.notifications.create("price", {
        type: "basic",
        title: localStorage.targetCurrency + "" + sentence + "" + value,
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

function startExtensionListeners(){
    chrome.extension.onMessage.addListener(
        function (request, sender, sendResponse) {
            if (request.msg == "resetTicker"){
                updateTicker();
            }
        }
    );

    chrome.notifications.onButtonClicked.addListener(function(notifId, btnIdx) {
        chrome.tabs.create({ url: "https://www.coinbase.com/dashboard" });
    });
}

//window.setInterval(updateTicker, localStorage.delay);

initializeConfig(default_config);
updateTicker();
startExtensionListeners();