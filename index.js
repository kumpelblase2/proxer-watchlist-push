var PushBullet = require('pushbullet');
var config = require('./config');
var pusher = new PushBullet(config.pushbullet_key);
var proxer = require('./proxer');
var schedule = require('node-schedule');
var fs = require('fs');
var _ = require('lodash');

var job = function() {
    console.log('Running job');
    var read = JSON.parse(fs.readFileSync('lastResult.json'));
    proxer(config.username, config.password, function(result) {
        console.log('Got result for ' + result.length + ' entries.');
        result.forEach(function(item) {
            var last = _.find(read, function(old) { return old.id == item.id; });
            if((!last || last.status == false) && item.status == true) {
                sendPush(item);
            }
        });

        console.log('Finished');
        fs.writeFile('lastResult.json', JSON.stringify(result));
    });
}

function sendPush(item) {
    pusher.link('', 'New EP of ' + item.name + ' is up!', item.link);
}

var jobs = [];

_.each(config.minutes, function(minute) {
    var rule = new schedule.RecurrenceRule();
    rule.minute = minute;
    jobs.push(schedule.scheduleJob(rule, job));
});
