console.log("app started")

var express = require('express')
var app = express()

app.set('port', (process.env.PORT || 5000));

app.get('/', function(req, res) {
  res.send('hello world');
});

app.listen(app.get('port'), function() {

});