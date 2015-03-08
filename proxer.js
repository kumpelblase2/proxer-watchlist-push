var Nightmare = require('nightmare');
var nightmare = new Nightmare();
var proxerHelpers = require('./proxer_helpers');

module.exports = function(user, pass, callback) {
    var results = [];
    nightmare.use(proxerHelpers.login(user, pass))
        .goto('http://proxer.me/ucp?s=reminder')
        .wait(function() {
            return $('#bot-table-a').length > 0;
        }, true)
        .use(proxerHelpers.extractWatchlist(function(result) {
            results = result;
        }))
        .run(function(err, nightmare) {
            callback(results);
        });
};
