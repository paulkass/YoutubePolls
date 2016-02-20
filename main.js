console.log("app started")

var CLIENT_ID = '974118819904-j47m556oudl4ao3q716ib8ktq4e0uohn.apps.googleusercontent.com'
var CLIENT_SECRET = 'y5qJVqIbihHKntf6NbV6yzon'
var REDIRECT_URL = 'http://youtubepolls.herokuapp.com/authorized'

var express = require('express')
var google = require('googleapis')
var OAuth2 = google.auth.OAuth2;
var youtube = google.youtube('v3')

var app = express()

var oauth2Client = {}

app.set('port', (process.env.PORT || 5000));

app.get('/', function(req, res) {
	console.log("Got Request")
	//res.sendfile("index.html")
	
	oauth2Client = new OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URL)
	var scopes = ['https://www.googleapis.com/auth/youtube']
	
	var url = oauth2Client.generateAuthUrl({
		scope: scopes
	})
	
	res.redirect(url);
	
	// youtube.comments.list({
// 		"part": "snippet",
// 		"parentId": "9bZkp7q19f0",
// 		"textFormat": "plainText"
// 	}, function(res) {
// 		console.log(JSON.stringify(res))
// 	})
});

app.listen(app.get('port'), function() {

});