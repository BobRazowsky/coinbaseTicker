document.addEventListener('DOMContentLoaded', function () {
    populateCurrencies();
    startListeners();
});

function updateValues(){
    document.querySelector('input[name="alertValue"]').value = localStorage.alertValue;
    document.querySelector('input[name="panicValue"]').value = localStorage.panicValue;
    document.querySelector('input[name="refreshDelay"]').value = localStorage.delay / 1000;
    document.querySelector('select[name="currency"]').value = localStorage.sourceCurrency;
    document.querySelector('select[name="crypto"]').value = localStorage.targetCurrency;
    document.querySelector('input[name="soundToggle"]').checked = (localStorage.soundNotification == 1) ? true : false;
    document.querySelector('select[name="soundSample"]').value = localStorage.soundSample;
}

function startListeners(){
    document.querySelector('select[name="currency"]').onchange = updateCurrency;
    document.querySelector('select[name="crypto"]').onchange = updateCrypto;
    document.querySelector('select[name="soundSample"]').onchange = updateSoundSample;
    document.querySelector('input[name="refreshDelay"]').onchange = updateDelay;
    document.querySelector('input[name="alertValue"]').onchange = updateAlertValue;
    document.querySelector('input[name="panicValue"]').onchange = updatePanicValue;
    document.querySelector('input[name="soundToggle"]').onclick = toggleNotificationSound;
    document.getElementById("save").addEventListener("click", saveAndApply);
}

function populateCurrencies(){
    jQuery.getJSON(
        "https://api.coinbase.com/v2/currencies",
        function (data, txtStatus, xhr) {
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

function toggleNotificationSound(event){
    if(event.target.checked === true){
        localStorage.soundNotification = 1;
        var notif = new Audio("sounds/"+ localStorage.soundSample +".mp3");
        notif.play();
    } else{
        localStorage.soundNotification = 0;
    }
}

function updateSoundSample(event){
    localStorage.soundSample = event.target.value;
    var sound = new Audio("sounds/"+ event.target.value +".mp3");
    sound.play();
}

function saveAndApply(){
    chrome.extension.sendMessage({msg: "resetTicker"});
}
