var phantom = require('phantom');
var helpers = require('./proxer-helpers');
var config = require('./config');
var PushBullet = require('pushbullet');
var pusher = new PushBullet(config.pushbullet_key);
var schedule = require('node-schedule');
var fs = require('fs');
var _ = require('lodash');

phantom.create(['--cookies-file=cookies.txt', '--load-images=no']).then(function (ph) {
    return ph.createPage();
}).then(function(page) {
    start(page);
    runJob(page);
});


function run(page, username, password) {
    return helpers.login(page, username, password).then(function() {
        return page.open('http://proxer.me/ucp?s=reminder');
    }).then(function() {
        return helpers.waitFor(function() {
            return page.evaluate(function() {
                return document.querySelector('table#box-table-a') != null;
            });
        }, 4);
    }).then(function() {
        return helpers.extract(page);
    });
}

function sendPush(item) {
    pusher.link('', 'New EP of ' + item.name + ' is up!', item.link);
}

function runJob(page) {
    console.log('Running job');
    var read = JSON.parse(fs.readFileSync('lastResult.json'));
    run(page, config.username, config.password).then(function(result) {
        console.log('Got result for ' + result.length + ' entries.');
        result.forEach(function(item) {
            var last = _.find(read, function(old) { return old.id == item.id; });
            if((!last || last.status == false) && item.status == true) {
                sendPush(item);
            }
        });

        console.log('Finished');
        fs.writeFileSync('lastResult.json', JSON.stringify(result, null, 4));
    });
}

function start(page) {
    var jobs = [];

    _.each(config.minutes, function(minute) {
        var rule = new schedule.RecurrenceRule();
        rule.minute = minute;
        jobs.push(schedule.scheduleJob(rule, function() {
            runJob(page);
        }));
    });

    console.log('Everything scheduled');
}
