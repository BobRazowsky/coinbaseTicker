let default_config = {
    "sourceCurrency": "EUR",
    "targetCurrency": "ETH",
    "chartPeriod":"day",
    "updateDelay": 10,
    "panicValue" : 0,
    "alertValue" : 0,
    "soundNotification" : 1,
    "soundSample" : "pop"
};

function initializeConfig(configuration){

    if (typeof localStorage.beenHereBefore === "undefined") {

        localStorage.setItem("delay", configuration.updateDelay * 1000);
        localStorage.setItem("chartPeriod", configuration.chartPeriod);
        localStorage.setItem("alertValue", configuration.alertValue);
        localStorage.setItem("panicValue", configuration.panicValue);
        localStorage.setItem("sourceCurrency", configuration.sourceCurrency);
        localStorage.setItem("targetCurrency", configuration.targetCurrency);
        localStorage.setItem("soundNotification", configuration.soundNotification);
        localStorage.setItem("lastPrice", 0);
        localStorage.setItem("soundSample", "pop");
        localStorage.setItem("beenHereBefore", "yes");
    }
}

function updateTicker() {
    jQuery.getJSON(
        "https://api.coinbase.com/v2/prices/"+ localStorage.targetCurrency +"-"+ localStorage.sourceCurrency +"/spot",
        function (data, txtStatus, xhr) {
            priceString = data.data.amount.toString();
            price = data.data.amount;

            if(parseFloat(price) > localStorage.lastPrice){
                setBadgeColor("#2B8F28");
                setTimeout(function(){
                    setBadgeColor("#2E7BC4");
                }, 4000);
            } else if(parseFloat(price) < localStorage.lastPrice){
                setBadgeColor("#FF4143");
                setTimeout(function(){
                    setBadgeColor("#2E7BC4");
                }, 4000);
            }

            chrome.browserAction.setBadgeText({text: priceString});
            if(parseFloat(price) > localStorage.alertValue && localStorage.alertValue > 0){
                createNotification(" is over ", localStorage.alertValue);
            }
            else if(parseFloat(price) < localStorage.panicValue && localStorage.panicValue > 0){
                createNotification(" is under ", localStorage.panicValue);
            }
            localStorage.lastPrice = price;
    });

    setTimeout(updateTicker, localStorage.delay);
}

function setBadgeColor(color){
    chrome.browserAction.setBadgeBackgroundColor({color: color});
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
    });

    if(parseFloat(localStorage.soundNotification) !== 0){
        audioNotif();
    }
}

function audioNotif(){
    var notif = new Audio("sounds/"+ localStorage.soundSample +".mp3");
    notif.play();
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

initializeConfig(default_config);
updateTicker();
startExtensionListeners();