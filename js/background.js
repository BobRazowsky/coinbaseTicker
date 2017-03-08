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

            else if(price < localStorage.panicValue && localStorage.panicValue > 0){

                chrome.notifications.create("price", {
                    type: "basic",
                    title: localStorage.targetCurrency + " price is under " + localStorage.panicValue,
                    message: localStorage.targetCurrency + " rate price is" + priceString,
                    iconUrl: "img/icon.png"
                    }, function () {
                });
            }

    });

    var dateObj = new Date();
    var month = dateObj.getUTCMonth() + 1; //months from 1-12
    var day = dateObj.getUTCDate();
    var year = dateObj.getUTCFullYear();
    var monthString, dayString;

    //alert(year +""+ month+"" + day);

    if(month < 10){
      monthString = "0" + month;
    } else{
      monthString = month.toString();
    }

    if(day < 10){
      dayString = "0" + (day - 1);
    } else{
      dayString = day.toString();
    }

    var dateString = year + "-" + monthString + "-" + dayString;
    //alert(dateString);

    jQuery.getJSON(
        "https://min-api.cryptocompare.com/data/histominute?fsym=ETH&tsym=EUR&limit=60&aggregate=3&e=CCCAGG",
        //"https://api.coinbase.com/v2/prices/"+ localStorage.targetCurrency +"-"+ localStorage.sourceCurrency +"/spot?date=" + dateString,
        function (data, txtStatus, xhr) {

          var sum = 0;

          for(var i = 0; i < data.Data.length; i++){
            sum += data.Data[i].low;
          }

          //alert(sum / 60);

            /*priceString = data.data.amount.toString();
            price = data.data.amount;*/
            //alert(data.Data[0].low);

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
