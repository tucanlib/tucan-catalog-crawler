# Yeah
1. `npm install`
1. Paste `START_URL` to `START_URL.txt` (see bottom)
1. Paste `COOKIE` to `COOKIE.txt` (see bottom)
1. `node main.js`
1. `output/6.json` will hold all the information you need
1. Don't know... do something you really like instead of unnecessary stuff like this

### START_URL
Log into TuCan and go to *Veranstaltungen => Anmeldung*, open devtools and enter:
```
copy(location.href)
```
The START_URL is now in your clipboard.

### COOKIE
Log into TuCan, open the devtools - enter:
```
copy(document.cookie)
```
The cookie is now in your clipboard. Paste it in COOKIE.txt


### Optional: Display the data with [tucan-catalog](https://github.com/davidgengenbach/tucan-catalog)
_See repo README for that_

# Usage at your own risk!
Don't look in the source-code... you have been warned! It's terrible. No error handling at all and a lot of late night-code