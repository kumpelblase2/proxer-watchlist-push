var Promise = require('bluebird');

module.exports = {
    login: function(page, username, password) {
        return new Promise(function(resolve) {
            page.open('http://proxer.me', resolve);
        }).then(function() {
            return new Promise(function(resolve) {
                page.evaluate(function(user, pass) {
                    if($('#uname').length == 0) {
                        $('input[name=username]').val(user);
                        $('input[name=password]').val(pass);
                        $('input[name=remember]').prop('checked', true);
                        $('form#login-form').submit();
                        return 'login';
                    } else {
                        return 'loggedIn';
                    }
                }, function(result) {
                    if(result == 'loggedIn') {
                        console.log('was already logged in.');
                    } else {
                        console.log('logged back in.');
                    }
                    setTimeout(function() {
                        resolve(result);
                    }, 3000);
                }, username, password);
            });
        });
    },
    extract: function(page) {
        return new Promise(function(resolve) {
            page.evaluate(function() {
                var temp = [];
                var content = document.querySelector('table#box-table-a');
                Array.prototype.forEach.call(content.rows, function(row) {
                    if(/entry.+/.test(row.id)) {
                        var title = {};
                        title.name = row.cells[1].children[0].innerHTML;
                        title.status = /online/.test(row.cells[5].children[0].src);
                        title.id = /Cover:(.+)/.exec(row.cells[1].children[0].title)[1];
                        title.link = row.cells[1].children[0].href;
                        temp.push(title);
                    }
                });

                return temp;
            }, resolve);
        });
    },
    waitFor: function(cond, maxAcc) {
        var self = this;
        var promisify = function(resolve, reject) {
            cond(function(result) {
                if(result) {
                    resolve();
                } else {
                    reject();
                }
            });
        };
        return new Promise(function(resolve, reject) {
            return self._retry(promisify, maxAcc, resolve, reject);
        });
    },
    _retry: function(promise, max, resolve, reject) {
        var self = this;
        return new Promise(promise).then(resolve).catch(function() {
            if(max > 0) {
                return Promise.resolve().delay(250).then(function() {
                    return self._retry(promise, max - 1, resolve, reject)
                });
            } else {
                reject();
            }
        });
    }
};
