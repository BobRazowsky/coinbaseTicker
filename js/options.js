document.addEventListener('DOMContentLoaded', function () {

    document.querySelector('input[name="alertValue"]').value = localStorage.alertValue;
    document.querySelector('input[name="refreshDelay"]').value = localStorage.delay / 1000;
    document.querySelector('select[name="currency"]').value = localStorage.sourceCurrency;
    document.querySelector('select[name="crypto"]').value = localStorage.targetCurrency;

    document.querySelector('select[name="currency"]').onchange=updateCurrency;
    document.querySelector('select[name="crypto"]').onchange=updateCrypto;
    document.querySelector('input[name="refreshDelay"]').onchange=updateDelay;
    //document.querySelector('input[name="notificationToggle"]').onchange=toggleNotification;
    document.querySelector('input[name="alertValue"]').onchange=updateAlertValue;

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

// function toggleNotification(event){
//     localStorage.notification = event.target.value;
//     console.log(event.target.value);
// }

// function checkBoxClick(){
//     if(document.getElementById("notificationToggle").checked){
//         localStorage.notification = true;
//     } else{
//         localStorage.notification = false;
//     }
// }

function updateAlertValue(event){
    localStorage.alertValue = event.target.value;
}

function saveAndApply(){
    chrome.extension.sendMessage({msg: "resetTicker"});
}




