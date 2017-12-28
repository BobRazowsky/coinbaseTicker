document.addEventListener('DOMContentLoaded', function () {

	var isChrome = /Chrome/.test(navigator.userAgent) && /Google Inc/.test(navigator.vendor);
	var isOpera = (!!window.opr && !!opr.addons) || !!window.opera || navigator.userAgent.indexOf(' OPR/') >= 0;
	var isFirefox = typeof InstallTrigger !== 'undefined';
	var isIE = /*@cc_on!@*/false || !!document.documentMode;
	var isEdge = !isIE && !!window.StyleMedia;

	var displayPortfolio = localStorage.portfolio;
	var displayNotification = localStorage.notifications;
	startListeners();
	getChartValues();
	togglePortfolio(displayPortfolio.toString());
	toggleNotifications(displayNotification.toString());
	updateInputValues();
	updatePrices();
	updatePortfolio();
	changeCurrencyIcon();
	analytics();
	translate();

	if(isOpera || isFirefox || isIE || isEdge) {
		hideUselessFields();
	}
});

window.browser = (function () {
	return window.msBrowser ||
		window.browser ||
		window.chrome;
})();

function analytics() {
	_gaq = [];
	_gaq.push(['_setAccount', 'UA-105414043-1']);
	_gaq.push(['_trackPageview']);

	(function() {
		var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
		ga.src = 'https://ssl.google-analytics.com/ga.js';
		var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
	})();

	document.getElementById("coinbaseBtn").onclick = function() {
		_gaq.push(['_trackEvent', "coinbaseButton", 'clicked']);
	}.bind(this);

	document.getElementById("settingsBtn").onclick = function() {
		browser.tabs.create({url: "options.html"});
		_gaq.push(['_trackEvent', "settingsButton", 'clicked']);
	}.bind(this);

	document.getElementById("donateBtn").onclick = function() {
		browser.tabs.create({url: "donate.html"});
		_gaq.push(['_trackEvent', "donateButton", 'clicked']);
	}.bind(this);
}

function startListeners(){
	document.querySelector('select[name="chartPeriod"]').onchange = function(e){
		this.blur();
		updateChartPeriod(e);
	};

	document.querySelector('input[name="targetPrice"]').onchange = updateAlertValue;
	document.querySelector('input[name="panicValue"]').onchange = updatePanicValue;
	document.querySelector('input[name="portfolioSum"]').onchange = updatePortfolioValues;
	document.querySelector('th[name="ico"').onclick = rollCurrency;
	document.querySelector('input[name="targetPrice"]').onkeypress = function(e){
		if(!e) e = window.event;
		var keyCode = e.keyCode || e.which;
		if(keyCode == 13){
			this.blur();
			updateAlertValue(e);
			return false;
		}
	};

	document.querySelector('input[name="panicValue"]').onkeypress = function(e){
		if(!e) e = window.event;
		var keyCode = e.keyCode || e.which;
		if(keyCode == '13'){
			this.blur();
			updatePanicValue(e);
			return false;
		}
	};

	document.getElementById("settingsBtn").onclick = function() {
		browser.tabs.create({url: "options.html"});
	};
}

function changeCurrencyIcon(){
	if(localStorage.targetCurrency === "ETH"){
		document.querySelector('img[name="currIco"]').src = "img/eth16.png";
		document.querySelector('img[name="currIco2"]').src = "img/eth16.png";
	} else if(localStorage.targetCurrency === "BTC"){
		document.querySelector('img[name="currIco"]').src = "img/btc16.png";
		document.querySelector('img[name="currIco2"]').src = "img/btc16.png";
	} else if(localStorage.targetCurrency === "LTC"){
		document.querySelector('img[name="currIco"]').src = "img/ltc16.png";
		document.querySelector('img[name="currIco2"]').src = "img/ltc16.png";
	} else if(localStorage.targetCurrency === "BCH"){
		document.querySelector('img[name="currIco"]').src = "img/bch16.png";
		document.querySelector('img[name="currIco2"]').src = "img/bch16.png";
	}
}

function rollCurrency(){
	var currencies = ["BTC", "ETH", "LTC", "BCH"];
	var currentCurrIndex = currencies.indexOf(localStorage.targetCurrency);
	var nextIndex = currentCurrIndex + 1;
	if(nextIndex > 3){
		nextIndex = 0;
	}
	localStorage.targetCurrency = currencies[nextIndex];
	changeCurrencyIcon();
	updatePrices();
	getChartValues();
	updateInputValues();
}

function updateInputValues(){
	if(parseInt(localStorage.notifications) === 1) {
		var panicValues = JSON.parse(localStorage.panicValues);
		var alertValues = JSON.parse(localStorage.alertValues);
		document.querySelector('input[name="targetPrice"]').value = alertValues[localStorage.targetCurrency];
		document.querySelector('input[name="panicValue"]').value = panicValues[localStorage.targetCurrency];
		console.log("update");
	}
	
	var portfolioValues = JSON.parse(localStorage.portfolioValues);
	document.querySelector('select[name="chartPeriod"]').value = localStorage.chartPeriod;
	document.getElementById("tabletitle").innerHTML = localStorage.targetCurrency + " to " + localStorage.sourceCurrency;
	document.querySelector('input[name="portfolioSum"]').value = portfolioValues[localStorage.targetCurrency];
}

function getJSON(url, callback){
	var request = new XMLHttpRequest();
	request.open('GET', url, true);
	request.onload = function(){
		if(request.status >= 200 && request.status < 400){

			var data = JSON.parse(request.responseText);
			callback(data, request);
		}
	};
	request.onerror = function() {
		document.getElementById("priceNumbers").style.visibility = "hidden";
		document.getElementById("error").style.visibility = "visible";
	};
	request.send();
}

function updatePrices(){

	var priceString, price;

	var baseURL = "https://api.coinbase.com/v2/prices/"+ localStorage.targetCurrency +"-"+ localStorage.sourceCurrency +"/";
	getJSON(
		baseURL + "spot",
		function (data) {
			document.getElementById("priceNumbers").style.visibility = "visible";
			document.getElementById("error").style.visibility = "hidden";
			priceString = data.data.amount.toString();
			localStorage.lastSpot = data.data.amount;
			price = data.data.amount;
			var ethRate = document.getElementById("priceRate");
			ethRate.innerHTML = priceString.toString();
			updatePortfolio();
	});

	getJSON(
		baseURL + "buy",
		function (data) {
			priceString = data.data.amount.toString();
			price = data.data.amount;
			var ethBuy = document.getElementById("priceBuy");
			ethBuy.innerHTML = priceString.toString();
	});

	getJSON(
		baseURL + "sell",
		function (data) {
			priceString = data.data.amount.toString();
			price = data.data.amount;
			var ethSell = document.getElementById("priceSell");
			ethSell.innerHTML = priceString.toString();
	});
}

function getChartValues(){
	var limit = 0;
	var type = "";
	var aggregate = 0;

	switch(localStorage.chartPeriod){
		case "hour":
			limit = 60;
			type="minute";
			aggregate = 0;
			break;
		case "day":
			limit = 96;
			type = "minute";
			aggregate = 15;
			break;
		case "week":
			limit = 84;
			type = "hour";
			aggregate = 2;
			break;
		case "month":
			limit = 90;
			type = "hour";
			aggregate = 8;
			break;
		case "year":
			limit = 122;
			type = "day";
			aggregate = 3;
			break;
		default:
			limit = 60;
			type = "minute";
			aggregate = 0;
	}

	var chartsData = [];

	getJSON(
		"https://min-api.cryptocompare.com/data/histo"+ type +
		"?fsym="+ localStorage.targetCurrency +
		"&tsym="+ localStorage.sourceCurrency +
		"&limit="+ limit +
		"&aggregate="+ aggregate +
		"&useBTC=false",
		function (data, request) {
			if(request.Response == "Error"){
				console.log("No chart data for this currency");
				document.getElementById("chart").style.display = "none";
				return;
			}

			for(var i = 0; i < data.Data.length; i++){
				chartsData.push({x: i*(200/limit) ,y: (data.Data[i].close + data.Data[i].open) / 2});
			}

			buildChart(chartsData);

			var indexEnd = data.Data.length - 1;
			var start = (data.Data[0].close + data.Data[0].open) / 2;
			var end = (data.Data[indexEnd].close + data.Data[indexEnd].open) / 2;
			var change = ((100 * end) / start) - 100;

			var sign = (change > 0) ? "+" : "";
			var color = (change > 0) ? "#2B8F28" : "#FF4143";

			document.querySelector('#changeValue').innerHTML = sign + change.toFixed(2) + "%";
			document.querySelector('#changeValue').style.color = color;
		}
	);
}

function buildChart(chartsData){
	var ctx = document.getElementById("chartCanvas");

	if(typeof priceChart !== "undefined"){
		priceChart.destroy();
	}

	priceChart = new Chart(ctx, {
		type: 'line',
		data: {
			datasets:[
				{
					label: "price",
					fill: false,
					data: chartsData,
					pointRadius: 0,
					borderWidth: 2,
					borderColor: "#2B71B1",
					lineTension: 0.1
				}
			]
		},
		options: {
			legend: {
				display: false
			},
			tooltips: {
				enabled: false
			},
			scales: {
				xAxes: [{
					display: false,
					type: 'linear',
					position: 'bottom'
				}]
			},
			hover: {

			}
		}
	},
	{
		lineAtIndex: 2
	});
}

function updateAlertValue(event){
	var alertValues = JSON.parse(localStorage.alertValues);
	alertValues[localStorage.targetCurrency] = event.target.value;
	localStorage.alertValues = JSON.stringify(alertValues);
}

function updatePanicValue(event){
	var panicValues = JSON.parse(localStorage.panicValues);
	panicValues[localStorage.targetCurrency] = event.target.value;
	localStorage.panicValues = JSON.stringify(panicValues);
}

function updatePortfolio() {
	var portfolioValues = JSON.parse(localStorage.portfolioValues);
	var val = portfolioValues[localStorage.targetCurrency];
	document.getElementById("cryptoConversion").innerHTML = (val * localStorage.lastSpot).toFixed(2) + " " + localStorage.sourceCurrency;
}

function updatePortfolioValues(event) {
	var portfolioValues = JSON.parse(localStorage.portfolioValues);
	portfolioValues[localStorage.targetCurrency] = event.target.value;
	localStorage.portfolioValues = JSON.stringify(portfolioValues);
	updatePortfolio();
}

function togglePortfolio(state) {
	switch(state) {
		case "0":
			document.getElementById("portfolio").style.visibility = "hidden";
			document.getElementById("portfolio").style.height = "0px";
			document.getElementById("portfolio").style.marginTop = "0px";
			document.getElementById("portfolio").style.padding = "0px";
			document.getElementById("portfolio").style.display = "none";
			break;

		case "1":
			document.getElementById("portfolio").style.visibility = "visible";
			document.getElementById("portfolio").style.height = "auto";
			document.getElementById("portfolio").style.marginTop = "5px";
			break;

		default:
			console.log("error", state);
	}
}

function toggleNotifications(state) {
	switch(state) {
		case "0":
			document.getElementById("limitOptions").style.visibility = "hidden";
			document.getElementById("limitOptions").style.height = "0px";
			document.getElementById("limitOptions").style.marginTop = "0px";
			document.getElementById("limitOptions").style.padding = "0px";
			document.getElementById("limitOptions").style.display = "none";
			break;

		case "1":
			document.getElementById("limitOptions").style.visibility = "visible";
			document.getElementById("limitOptions").style.height = "auto";
			document.getElementById("limitOptions").style.marginTop = "5px";
			break;

		default:
			console.log("error", state);
	}
}

function translate(){
	document.getElementById("strSpotrate").innerHTML = browser.i18n.getMessage("strSpotrate");
	document.getElementById("strBuyPrice").innerHTML = browser.i18n.getMessage("strBuyPrice");
	document.getElementById("strSellPrice").innerHTML = browser.i18n.getMessage("strSellPrice");
	document.getElementById("strTargetPrice").innerHTML = browser.i18n.getMessage("strTargetPrice");
	document.getElementById("strPanicPrice").innerHTML = browser.i18n.getMessage("strPanicPrice");
	document.getElementById("strHour").innerHTML = browser.i18n.getMessage("strHour");
	document.getElementById("strDay").innerHTML = browser.i18n.getMessage("strDay");
	document.getElementById("strWeek").innerHTML = browser.i18n.getMessage("strWeek");
	document.getElementById("strMonth").innerHTML = browser.i18n.getMessage("strMonth");
	document.getElementById("strYear").innerHTML = browser.i18n.getMessage("strYear");
	document.getElementById("coinbaseBtn").innerHTML = browser.i18n.getMessage("coinbaseBtn");
	document.getElementById("settingsBtn").innerHTML = browser.i18n.getMessage("settingsBtn");
	document.getElementById("strLast").innerHTML = browser.i18n.getMessage("strLast");
}

function hideUselessFields() {
	document.querySelector('div[id="limitOptions"]').style.visibility = "hidden";
	document.querySelector('div[id="limitOptions"]').style.height = "0px";
}

function updateChartPeriod(event){
	localStorage.chartPeriod = event.target.value;
	getChartValues();
}
