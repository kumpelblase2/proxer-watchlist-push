# Proxer Watchlist Push
Send a push notification via pushbullet once a new EP of an anime on your watchlist is available. The applicatino checks (by default) every 30min if a new one is available, so it is not instant.
You can, if you want to specifiy the time at which the application should check in the config (see below).

## Dependencies
Outside of the NPM dependecies, this application requires [PhantomJS](http://phantomjs.org/) to be installed on the system.

## Limitations
Since proxer.me does not provide an API, this applications uses PhantomJS to view the page and interact with it, hence the dependency. The application also requires you to specifiy the username and password
of the user you want to get notifications for. Again, proxer.me does not provide an API so this application has to it the same way a human would do.

Lastly, CloudFlare protection. I have yet to see if the application handles this properly in all cases, but so far, I have not encountered an issue with this.

## Configuration
The configuration can be found in the `config.js` file at the root directory.
Settings to change:
- pushbullet_key: the API key for your pushbullet account. This can be found at your account settings page at pushbullet.
- username: the proxer.me username
- password: the password for the proxer.me user
- minutes: An array of minutes this application should be run at. E.g. if you set it to `[10, 40]` it would run every hour at minute 10 and 40 (8:10, 8:40, 9:10, 9:40, etc.). You can specify every minute if you like, but I would suggest you make at least a 5 minute pause between.

## Installation
(If you haven't already, either clone this repository or download the [zip](https://github.com/kumpelblase2/proxer-watchlist-push/archive/master.zip) of this repository.)

First, install PhantomJS using one of their installation methods (see [here](http://phantomjs.org/download.html)).

Second run `npm install` to fetch the other dependencies.

Now, change the settings accordingly (see [the config section](#configuration) above).

Lastly, run `node index.js` to start the application and you're all set.

## License
The software is licensed under the MIT license. A copy can be found in the `LICENSE` file inside this repository.