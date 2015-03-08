exports.login = function(username, password) {
    return function(nightmare) {
        nightmare.goto('http://proxer.me')
            .type('#mod_login_username', username)
            .type('#mod_login_password', password)
            .evaluate(function(user, pass) {
                $('input[name=username]').val(user);
                $('input[name=password]').val(pass);
                $('form#login-form').submit();
            }, function() {}, username, password).wait();
    };
};

exports.extractWatchlist = function(callback) {
    return function(nightmare) {
        nightmare.evaluate(function() {
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
        }, callback);
    };
};
