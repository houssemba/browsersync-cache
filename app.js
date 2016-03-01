var express = require('express');
var app = express();
var counter = 0;

var counter2 = 0;

app.use(express.static('.'));
app.post('/api/counter', function(res, rep){
    counter++;
    rep.end('' + counter);
});

app.get('/api/counter', function(res, rep) {
    rep.end('' + counter);
});


app.post('/api/counter2', function(req, res) {
    counter2++;
    res.end('' + counter2);
});

app.get('/api/counter2', function(req, res) {
    res.end('' + counter2);
});

app.listen(8080, function() {
    console.log('Listening port 8080');
});
