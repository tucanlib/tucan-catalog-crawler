# Usage at your own risk!

## Yeah
1. npm install
2. Create a file called ```START_URL.txt``` and paste the START_URL (see bottom) into there
3. Create a file called ```COOKIE.txt``` and paste the COOKIE (see bottom) into there
4. Create a folder called ```output```
5. node main.js
6. ```output/5.json``` will hold all the information you need
7. Don't know... do something you really like instead of unnecessary stuff like this

## Get START_URL
Log into TuCan and go to: "Veranstaltungen" -> "Anmeldung"
Copy the the URL

## Get COOKIE
Log into TuCan, open the dev-tools - enter:
```
copy(document.cookie)
```
The cookie is now in your clipboard. Paste it in COOKIE.txt


Don't look in the source-code... you have been warned! It's terrible. No error handling at all and a lot of late night-code