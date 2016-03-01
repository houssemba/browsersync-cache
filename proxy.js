var http = require('http');
var cacheService = require('./cache')();

var proxy = function (path, req, res, next) {
    var regex = new RegExp(path);
    if (!req.url.match(regex) || req.method === 'GET') {
        next();
        return;
    }

    var proxyRequest = function (req, res, next) {
        var options = {
            path: req.url,
            headers: req.headers,
            method: req.method,
            port: '8080',
            rejectUnauthorized: false
        };
        callback = function (proxyRes) {
            var body = '';
            proxyRes.on('data', function (chunk) {
                body += chunk;
            });
            proxyRes.on('end', function () {
                cacheService.setResponse(req, body);
            });
        };

        var proxyReq = http.request(options, callback);
        req.on('data', function (chunk) {
            proxyReq.write(chunk);
        });

        req.on('end', function () {
            proxyReq.end();
        });
    };


    var cache = cacheService.get(req);
    if (cache) {
        cacheService.cache(req, function (cachedResponse) {
            res.write(cachedResponse);
            res.end();
        });
    } else {
        cacheService.addCache(req, function(cachedResponse) {
            res.write(cachedResponse);
            res.end();
        });
        proxyRequest(req, res, next);
    }
};

module.exports = proxy;