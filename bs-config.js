var proxy = require('./proxy');

module.exports = {
    "proxy": {
        "target": "http://localhost:8080",
        middleware: function (req, res, next) {
            proxy('/api', req, res, next);
        }
    }
};