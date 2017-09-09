function initialize() {
	translate();
	analytics();
	startListeners();
}

window.browser = (function () {
	return window.msBrowser ||
		window.browser ||
		window.chrome;
})();

function translate(){
	document.getElementById("strDonations").innerHTML = browser.i18n.getMessage("strDonations");
	document.getElementById("strDonationsTxt").innerHTML = browser.i18n.getMessage("strDonationsTxt");
	document.title = browser.i18n.getMessage("strDonations");
}

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

function startListeners() {
	document.getElementById("btcAdress").addEventListener("click", function() {
		copyAdressToClipboard(this.id);
	});
	document.getElementById("ethAdress").addEventListener("click", function() {
		copyAdressToClipboard(this.id);
	});
	document.getElementById("ltcAdress").addEventListener("click", function() {
		copyAdressToClipboard(this.id);
	});
}

function copyAdressToClipboard(adressID) {
	var element = document.getElementById(adressID);

	if((' ' + element.className + ' ').indexOf(' ' + "success" + ' ') > -1) {
		return;
	}

	var adress = element.innerHTML;
	var selection = window.getSelection();
	var range = document.createRange();
	range.selectNodeContents(element);
	selection.removeAllRanges();
	selection.addRange(range);

	try {
		var successful = document.execCommand('copy');
		if ( document.selection ) {
	        document.selection.empty();
	    } else if ( window.getSelection ) {
	        window.getSelection().removeAllRanges();
	    }
	    element.classList.add("success");
	    element.innerHTML = "Copied to clipboard";
	    setTimeout(function() {
	    	element.classList.remove("success");
	    	element.innerHTML = adress;
	    }, 1000);
	} catch (err) {
		console.log('Unable to copy');
	}
}

initialize();