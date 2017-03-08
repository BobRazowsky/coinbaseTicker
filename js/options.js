document.addEventListener('DOMContentLoaded', function () {

    document.querySelector('input[name="alertValue"]').value = localStorage.alertValue;
    document.querySelector('input[name="panicValue"]').value = localStorage.panicValue;
    document.querySelector('input[name="refreshDelay"]').value = localStorage.delay / 1000;
    document.querySelector('select[name="currency"]').value = localStorage.sourceCurrency;
    document.querySelector('select[name="crypto"]').value = localStorage.targetCurrency;
    document.querySelector('select[name="currency"]').onchange=updateCurrency;
    document.querySelector('select[name="crypto"]').onchange=updateCrypto;
    document.querySelector('input[name="refreshDelay"]').onchange=updateDelay;
    document.querySelector('input[name="alertValue"]').onchange=updateAlertValue;
    document.querySelector('input[name="panicValue"]').onchange=updatePanicValue;
    document.getElementById("save").addEventListener("click", saveAndApply);
});

function updateCurrency(event){
    localStorage.sourceCurrency = event.target.value;
}

function updateCrypto(event){
    localStorage.targetCurrency = event.target.value;
}

function updateDelay(event){
    localStorage.delay = event.target.value * 1000;
}

function updateAlertValue(event){
    localStorage.alertValue = event.target.value;
}

function updatePanicValue(event){
    localStorage.panicValue = event.target.value;
}

function saveAndApply(){
    chrome.extension.sendMessage({msg: "resetTicker"});
}
