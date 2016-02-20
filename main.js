console.log("app started")

var express = require('express')
var app = express()

app.set('port', (process.env.PORT || 5000));

app.get('/', function(req, res) {
	console.log("Got Request")
	res.sendfile("index.html")
});

app.listen(app.get('port'), function() {

});