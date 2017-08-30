function translate(){

    document.getElementById("strDonations").innerHTML = chrome.i18n.getMessage("strDonations");
    document.getElementById("strDonationsTxt").innerHTML = chrome.i18n.getMessage("strDonationsTxt");

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

translate();
analytics();