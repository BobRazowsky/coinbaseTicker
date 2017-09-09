document.addEventListener('DOMContentLoaded', function () {
	populateCurrencies();
	startListeners();
	translate();
	analytics();

	var isChrome = !!window.chrome && !!window.chrome.webstore;
	var isOpera = (!!window.opr && !!opr.addons) || !!window.opera || navigator.userAgent.indexOf(' OPR/') >= 0;
	var isFirefox = typeof InstallTrigger !== 'undefined';
	var isIE = /*@cc_on!@*/false || !!document.documentMode;
	var isEdge = !isIE && !!window.StyleMedia;

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
}

function updateValues(){
	document.querySelector('input[name="alertValue"]').value = localStorage.alertValue;
	document.querySelector('input[name="panicValue"]').value = localStorage.panicValue;
	document.querySelector('input[name="refreshDelay"]').value = localStorage.delay / 1000;
	document.querySelector('select[name="currency"]').value = localStorage.sourceCurrency;
	document.querySelector('select[name="crypto"]').value = localStorage.targetCurrency;
	document.querySelector('input[name="colorChange"]').checked = (localStorage.colorChange == 1) ? true : false;
	document.querySelector('select[name="soundSample"]').value = localStorage.soundSample;
	document.querySelector('input[name="roundBadge"]').checked = (localStorage.roundBadge == 1) ? true : false;
}

function startListeners(){
	document.querySelector('select[name="currency"]').onchange = updateCurrency;
	document.querySelector('select[name="crypto"]').onchange = updateCrypto;
	document.querySelector('select[name="soundSample"]').onchange = updateSoundSample;
	document.querySelector('input[name="refreshDelay"]').onchange = updateDelay;
	document.querySelector('input[name="alertValue"]').onchange = updateAlertValue;
	document.querySelector('input[name="panicValue"]').onchange = updatePanicValue;
	document.querySelector('input[name="colorChange"]').onclick = toggleColorChange;
	document.querySelector('input[name="roundBadge"]').onclick = toggleRoundBadge;
	document.getElementById("save").addEventListener("click", saveAndApply);
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
	request.onerror = function() {};
	request.send();
}

function populateCurrencies(){
	getJSON(
		"https://api.coinbase.com/v2/currencies",
		function (data, request) {
			select = document.querySelector('select[name="currency"]');
			for(var i = 0; i < data.data.length; i++){
				var opt = document.createElement('option');
				opt.value = data.data[i].id;
				opt.innerHTML = data.data[i].name;
				select.appendChild(opt);
			}
			updateValues();
		}
	);
}

function updateCurrency(event){
	localStorage.sourceCurrency = event.target.value;
}

function updateCrypto(event){
	localStorage.targetCurrency = event.target.value;
}

function updateDelay(event){
	var value = (event.target.value < 1) ? 1 : event.target.value;
	localStorage.delay = value * 1000;
}

function updateAlertValue(event){
	localStorage.alertValue = event.target.value;
}

function updatePanicValue(event){
	localStorage.panicValue = event.target.value;
}

function translate(){
	//document.getElementById("strOptions").innerHTML = browser.i18n.getMessage("strOptions"); 
	document.getElementById("strCurrency").innerHTML = browser.i18n.getMessage("strCurrency");
	document.getElementById("strCrypto").innerHTML = browser.i18n.getMessage("strCrypto");
	document.getElementById("strDelay").innerHTML = browser.i18n.getMessage("strDelay");
	document.getElementById("strTargetPrice").innerHTML = browser.i18n.getMessage("strTargetPrice");
	document.getElementById("strPanicPrice").innerHTML = browser.i18n.getMessage("strPanicPrice");
	document.getElementById("strColorChange").innerHTML = browser.i18n.getMessage("strColorChange");
	document.getElementById("strSound").innerHTML = browser.i18n.getMessage("strSound");
	document.getElementById("strRound").innerHTML = browser.i18n.getMessage("strRound");
	document.getElementById("save").innerHTML = browser.i18n.getMessage("strSave");
	document.getElementById("strSeconds").innerHTML = browser.i18n.getMessage("strSeconds");
	document.getElementById("strNotifications").innerHTML = browser.i18n.getMessage("strNotifications");
	document.title = browser.i18n.getMessage("settingsBtn");
}

function toggleColorChange(event){
	localStorage.colorChange = (event.target.checked === true) ? 1 : 0;
}

function updateSoundSample(event){
	if(event.target.value == "mute"){
		localStorage.soundNotification = 0;
	} else{
		localStorage.soundNotification = 1;
		localStorage.soundSample = event.target.value;
		var sound = new Audio("sounds/"+ event.target.value +".mp3");
		sound.play();
	}
}

function toggleRoundBadge(event){
	localStorage.roundBadge = (event.target.checked === true) ? 1 : 0;
	browser.extension.sendMessage({msg: "resetTicker"});
}

function saveAndApply(){
	//browser.extension.sendMessage({msg: "resetTicker"});
}

function hideUselessFields() {
	document.querySelector('div[id="alertOptn"]').style.visibility = "hidden";
	document.querySelector('div[id="panicOptn"]').style.visibility = "hidden";
	document.querySelector('div[id="soundOptn"]').style.visibility = "hidden";
}

