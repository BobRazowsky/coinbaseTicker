var base_config = {
	"sourceCurrency": "EUR",
	"targetCurrency": "ETH",
	"chartPeriod":"day",
	"updateDelay": 30,
	"alertValues" : {
		"ETH" : 0,
		"BTC" : 0,
		"LTC" : 0
	},
	"panicValues" : {
		"ETH" : 0,
		"BTC" : 0,
		"LTC" : 0
	},
	"curs": {
		0 : 'ETH',
		1 : 'BTC', 
		2 : 'LTC'
	},
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
var isEdge = !isIE && !!window.StyleMedia;
var isChrome = /Chrome/.test(navigator.userAgent) && /Google Inc/.test(navigator.vendor);

var _gaq = _gaq || [];
_gaq.push(['_setAccount', 'UA-105414043-1']);
_gaq.push(['_trackPageview']);

(function() {
	var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
	ga.src = 'https://ssl.google-analytics.com/ga.js';
	var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
})();

function initializeConfig(configuration){

	if (typeof localStorage.reallyBeenHereBefore === "undefined") {

		localStorage.setItem("delay", configuration.updateDelay * 1000);
		localStorage.setItem("chartPeriod", configuration.chartPeriod);
		localStorage.setItem("alertValues", JSON.stringify(configuration.alertValues));
		localStorage.setItem("panicValues", JSON.stringify(configuration.panicValues));
		localStorage.setItem("sourceCurrency", configuration.sourceCurrency);
		localStorage.setItem("targetCurrency", configuration.targetCurrency);
		localStorage.setItem("soundNotification", configuration.soundNotification);
		localStorage.setItem("colorChange", configuration.colorChange);
		localStorage.setItem("lastPrice", 0);
		localStorage.setItem("soundSample", "pop");
		localStorage.setItem("btcAmount", configuration.btcAmount);
		localStorage.setItem("ethAmount", configuration.ethAmount);
		localStorage.setItem("curs", JSON.stringify(configuration.curs));
		localStorage.setItem("reallyBeenHereBefore", "yes");
	}

	setInterval(updateTicker, localStorage.delay);
}

function getJSON(url, callback){
	var request = new XMLHttpRequest();
	request.open('GET', url, true);
	request.onload = function(){
		if(request.status >= 200 && request.status < 400){
			var data = JSON.parse(request.responseText).data;
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
		"https://api.coinbase.com/v2/prices/"+ localStorage.targetCurrency +"-"+ localStorage.sourceCurrency +"/spot",
		function (data) {
			var price = data.amount;
			var priceString = data.amount.toString();
			var badgeText = priceString;
			if(localStorage.colorChange === true){
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
			}
			if(localStorage.roundBadge == 1){
				if(price >= 100){
					badgeText = parseFloat(data.amount).toFixed(0).toString();
				} else if(price < 100) {
					badgeText = parseFloat(data.amount).toFixed(1).toString();
				}
			} else{
				badgeText = priceString;
			}
			if(isEdge) {
				badgeText = badgeText.substring(0, 4);
			}
			browser.browserAction.setBadgeText({text: badgeText});
			localStorage.lastPrice = price;
		}
	);
	if(isChrome) {
		notificationManager();
	}
}

function notificationManager() {
	var keysNb = Object.keys(JSON.parse(localStorage.curs)).length;
	for(var i = 0; i < keysNb; i++) {
		getJSON(
			"https://api.coinbase.com/v2/prices/"+ JSON.parse(localStorage.curs)[i] +"-"+ localStorage.sourceCurrency +"/spot",
			function (data) {
				var price = data.amount;
				var priceString = data.amount.toString();
				var panicValues = JSON.parse(localStorage.panicValues);
				var alertValues = JSON.parse(localStorage.alertValues);
				var cur = data.base;

				if(parseFloat(price) > alertValues[cur] && alertValues[cur] > 0){
					createNotification(browser.i18n.getMessage("strOver"), alertValues[cur]);
				}
				else if(parseFloat(price) < panicValues[cur] && panicValues[cur] > 0){
					createNotification(browser.i18n.getMessage("strUnder"), panicValues[cur]);
				}
			}
		);
	}
}

function setBadgeColor(color){
	browser.browserAction.setBadgeBackgroundColor({color: color});
}

function createNotification(sentence, value){
	var myNotificationID = null;

	browser.notifications.create("price", {
		type: "basic",
		title: localStorage.targetCurrency + "" + sentence + "" + value,
		message: localStorage.targetCurrency + browser.i18n.getMessage("notifTxt") + value,
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

	if(parseFloat(localStorage.soundNotification) !== 0){
		audioNotif();
	}
}

function audioNotif(){
	var notif = new Audio("sounds/"+ localStorage.soundSample +".mp3");
	notif.play();
}

function startExtensionListeners(){
	browser.extension.onMessage.addListener(
		function (request, sender, sendResponse) {
			if (request.msg == "resetTicker"){
				updateTicker();
			}
		}
	);

	browser.notifications.onButtonClicked.addListener(function(notifId, btnIdx) {
		browser.tabs.create({ url: "https://www.coinbase.com/dashboard" });
	});
}

initializeConfig(base_config);
updateTicker();
startExtensionListeners();