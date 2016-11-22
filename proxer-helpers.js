var Promise = require('bluebird');

module.exports = {
    login: function(page, username, password) {
        return page.open('http://proxer.me').then(function() {
            return page.evaluate(function(user, pass) {
                if($('#uname').length == 0) {
                    $('input[name=username]').val(user);
                    $('input[name=password]').val(pass);
                    $('input[name=remember]').prop('checked', true);
                    $('form#login-form').submit();
                    return 'login';
                } else {
                    return 'loggedIn';
                }
            }, username, password);
        }).then(function(result) {
            if(result == 'loggedIn') {
                console.log('was already logged in.');
            } else {
                console.log('logged back in.');
            }

            return Promise.delay(3000, result);
        });
    },
    extract: function(page) {
        return page.evaluate(function() {
            var temp = [];
            var tables = document.querySelectorAll('table#box-table-a');
            for(var i = 0; i < tables.length; i++) {
                var content = tables[i];
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
            }

            return temp;
        });
    },
    waitFor: function(cond, maxAcc) {
        return this._retry(cond, maxAcc);
    },
    _retry: function(cond, max) {
        if(max == 0) {
            throw new Error();
        }

        var self = this;
        return cond().then(function(result) {
            if(result) {
                return true;
            } else {
                return Promise.delay(250).then(function() {
                    return self._retry(cond, max - 1);
                });
            }
        });
    }
};
