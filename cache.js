module.exports = function () {
    var responses = [];
    var newCache = function (req) {
        return {
            method: req.method,
            url: req.url,
            response: undefined,
            callbacks: [],
            isResponseReady: function () {
                return this.response !== undefined;
            },
            addCallback: function (callback) {
                this.callbacks.push(callback);
                return this;
            },
            equals: function (method, url) {
                return this.method === method && this.url === url;
            },
            setResponse: function(response) {
                this.response = response;
                for (var i=this.callbacks.length-1; i >= 0; i-=1) {
                    this.callbacks[i](this.response);
                    this.callbacks.splice(i, 1);
                }
            }
        };
    };

    return {
        cache: function(req, callback) {
            var cache = this.get(req);
            if (cache) {
                if (cache.isResponseReady()) {
                    callback(cache.response);
                }else {
                    cache.addCallback(callback);
                }
            }
        },

        get: function (req) {
            for (var i = 0; i < responses.length; i++) {
                if (responses[i].equals(req.method, req.url)) {
                    return responses[i];
                }
            }
            return null;
        },

        addCache: function (req, callback) {
            var cache = newCache(req).addCallback(callback);
            responses.push(cache);
        },

        setResponse: function (req, response) {
            var cache = this.get(req);
            cache.setResponse(response);
            setTimeout(function() {
                for (var i=responses.length-1; i >= 0; i-=1) {
                    if (responses[i].equals(req.method, req.url)){
                        responses.splice(i, 1);
                    }
                }
            }, 1000);
        }
    };
};