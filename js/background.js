var base_config = {
	"sourceCurrency": "EUR",
	"targetCurrency": "ETH",
	"chartPeriod":"day",
	"updateDelay": 10,
	"panicValue" : 0,
	"alertValue" : 0,
	"soundNotification" : 1,
	"soundSample" : "pop",
	"colorChange" : 1,
	"roundBadge" : 0,
	"btcAmount" : 0,
	"ethAmount" : 0
};

window.browser = (function () {
    return window.msBrowser ||
        window.browser ||
        window.chrome;
})();

var isIE = /*@cc_on!@*/false || !!document.documentMode;

// Edge 20+
var isEdge = !isIE && !!window.StyleMedia;

var storage = window.localStorage;

var _gaq = _gaq || [];
_gaq.push(['_setAccount', 'UA-105414043-1']);
_gaq.push(['_trackPageview']);

(function() {
	var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
	ga.src = 'https://ssl.google-analytics.com/ga.js';
	var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
})();

function initializeConfig(configuration){

	if (typeof storage.beenHereBefore === "undefined") {

		storage.setItem("delay", configuration.updateDelay * 1000);
		storage.setItem("chartPeriod", configuration.chartPeriod);
		storage.setItem("alertValue", configuration.alertValue);
		storage.setItem("panicValue", configuration.panicValue);
		storage.setItem("sourceCurrency", configuration.sourceCurrency);
		storage.setItem("targetCurrency", configuration.targetCurrency);
		storage.setItem("soundNotification", configuration.soundNotification);
		storage.setItem("colorChange", configuration.colorChange);
		storage.setItem("lastPrice", 0);
		storage.setItem("soundSample", "pop");
		storage.setItem("beenHereBefore", "yes");
		storage.setItem("btcAmount", configuration.btcAmount);
		storage.setItem("ethAmount", configuration.ethAmount);
	}

	setInterval(updateTicker, storage.delay);
}

function getJSON(url, callback){
	var request = new XMLHttpRequest();
	request.open('GET', url, true);
	request.onload = function(){
		if(request.status >= 200 && request.status < 400){
			var data = JSON.parse(request.responseText);
			callback(data);
		}
	};
	request.onerror = function(error) {
		console.log("Coinbase does not respond.");
	};
	request.send();
}

function updateTicker() {
	getJSON(
		"https://api.coinbase.com/v2/prices/"+ storage.targetCurrency +"-"+ storage.sourceCurrency +"/spot",
		function (data) {
			var price = data.data.amount;
			var priceString = data.data.amount.toString();
			var badgeText = priceString;
			if(storage.colorChange === true){
				if(parseFloat(price) > storage.lastPrice){
					setBadgeColor("#2B8F28");
					setTimeout(function(){
						setBadgeColor("#2E7BC4");
					}, 4000);
				} else if(parseFloat(price) < storage.lastPrice){
					setBadgeColor("#FF4143");
					setTimeout(function(){
						setBadgeColor("#2E7BC4");
					}, 4000);
				}
			}
			/*if(storage.hideDecimal == 1) {
				badgeText = Math.abs(parseFloat(data.data.amount)).toString();
			}
			if(storage.roundBadge == 1){
				if(price >= 100){
					badgeText = parseFloat(data.data.amount).toFixed(0).toString();
				} else if(price < 100) {
					badgeText = parseFloat(data.data.amount).toFixed(1).toString();
				}
			} else{
				badgeText = priceString;
			}*/
			if(isEdge || storage.roundBadge == 1) {
				badgeText = badgeText.substring(0, 4);
			}
			browser.browserAction.setBadgeText({text: badgeText});
			if(parseFloat(price) > storage.alertValue && storage.alertValue > 0){
				createNotification(browser.i18n.getMessage("strOver"), storage.alertValue);
			}
			else if(parseFloat(price) < storage.panicValue && storage.panicValue > 0){
				createNotification(browser.i18n.getMessage("strUnder"), storage.panicValue);
			}
			storage.lastPrice = price;
		}
	);
}

function setBadgeColor(color){
	browser.browserAction.setBadgeBackgroundColor({color: color});
}

function createNotification(sentence, value){
	var myNotificationID = null;

	browser.notifications.create("price", {
		type: "basic",
		title: storage.targetCurrency + "" + sentence + "" + value,
		message: storage.targetCurrency + browser.i18n.getMessage("notifTxt") + value,
		iconUrl: "img/icon80.png",
		buttons: [
			{
				title: browser.i18n.getMessage("coinbaseBtn"),
				iconUrl: "img/icon.png"
			}
		]
		}, function (id) {
			myNotificationID = id;
	});

	if(parseFloat(storage.soundNotification) !== 0){
		audioNotif();
	}
}

function audioNotif(){
	var notif = new Audio("sounds/"+ storage.soundSample +".mp3");
	notif.play();
}

function startExtensionListeners(){
	/*browser.extension.onMessage.addListener(
		function (request, sender, sendResponse) {
			if (request.msg == "resetTicker"){
				updateTicker();
			}
		}
	);*/

	browser.notifications.onButtonClicked.addListener(function(notifId, btnIdx) {
		browser.tabs.create({ url: "https://www.coinbase.com/dashboard" });
	});
}

initializeConfig(base_config);
updateTicker();
startExtensionListeners();