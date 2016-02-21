console.log("app started")

var CLIENT_ID = '974118819904-j47m556oudl4ao3q716ib8ktq4e0uohn.apps.googleusercontent.com'
var CLIENT_SECRET = 'y5qJVqIbihHKntf6NbV6yzon'
var REDIRECT_URL = 'http://youtubepolls.herokuapp.com/oauth2callback'
var API_KEY = 'AIzaSyB_7jlnUHlve5_SDeefIDspy2eCjoptF7Q'

var express = require('express')
var google = require('googleapis')
var OAuth2 = google.auth.OAuth2;
var youtube = google.youtube('v3')

var app = express()

var oauth2Client = new OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URL)

app.set('port', (process.env.PORT || 5000));

app.get('/', function(req, res) {
	console.log("Got Request")
	//res.sendfile("index.html")
	var scopes = ['https://www.googleapis.com/auth/youtube']
	
	var url = oauth2Client.generateAuthUrl({
		scope: scopes
	})
	
	res.redirect(url);
});

app.get('/oauth2callback', function(req, res) {
	var code = req.query.code
	//res.sendfile("index.html")
	oauth2Client.getToken(code, function(err, tokens) {
  		if(!err) {
  			
    		oauth2Client.setCredentials(tokens);
    		console.log("OAuth Authentication Finished.")
    		//console.log(JSON.stringify(youtube.videos))
    		callQuery(res)
  		} else {
  			console.log(JSON.stringify(err))
  		}
	});
});

function callQuery(res) {
	res.send(JSON.stringify(youtube.videos))
	// youtube.videos.getRating({
//     			id: 'KRaWnd3LJfs',
//     			auth: oauth2Client
//     		}, function(response) {
// 				res.send(JSON.stringify("hi::::::"+response))
// 			})
}

app.listen(app.get('port'), function() {

});