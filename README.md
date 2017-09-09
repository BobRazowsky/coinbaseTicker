# Coinbase Ticker (browser extension) - Track BTC, ETH and LTC prices from Coinbase

Available on the [Chrome Web Store]

Works with Google Chrome, Mozilla Firefox, Microsoft Edge, Opera, Vivaldi & Brave !

* Track BTC, ETH and LTC prices in all currencies supported by Coinbase
* Popup with spotrate, buy and sell prices.
* Price charts for last hour, day, week, month or year (not available for all currencies)
* Live update on icon with customizable delay and color changes
* Set "up" and "low" notifications with sound

![alt tag](https://raw.githubusercontent.com/BobRazowsky/coinbaseTicker/master/img/screenshot.png)

## APIs

* Ticker data by [Coinbase API]
* Charts data by [Cryptocompare API]

## Installation

### Google Chrome

* *Google Chrome* -> *More tools* -> *Extensions* -> *Activate Developer Mode* -> *Load Unpacked Extension* and select the *cbt_release* folder.

### Mozilla Firefox

* Navigate to *about:debugging*, click on *Load Temporary Add-on* and select the *manifest.json* file.

### Microsoft Edge

* Navigate to *about:flags* and check *Enable extension developer features*.
* Click on *…* in the Edge’s bar -> *Extensions* -> *Load extension* and select *cbt_release* folder.
* Click on this freshly loaded extension and enable the *Show button next to the address bar*

### Opera

* Navigate to *about://extensions* and click on the *Developer mode* button.
* Click on *Load unpacked extension…* and choose the *cbt_release* folder.

### Vivaldi

* Navigate to *vivaldi://extensions* and enable the *Developer mode*
* Click on *Load unpacked extension…* and choose the *cbt_release* folder.

### Brave

* You need to build your own version of Brave to be able to use extensions.
* Visit [Davrous website] for more infos on how building your own.

[Coinbase API]: https://developers.coinbase.com/api/v2
[Cryptocompare API]: https://www.cryptocompare.com/api/
[Chrome Web Store]: https://chrome.google.com/webstore/detail/coinbase-ticker/mfoihmgadcjlpehaenaclbcldkndjnll?hl=fr
[Davrous website]: https://www.davrous.com/2016/12/07/creating-an-extension-for-all-browsers-edge-chrome-firefox-opera-brave/