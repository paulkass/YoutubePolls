console.log("app started")

var CLIENT_ID = '974118819904-j47m556oudl4ao3q716ib8ktq4e0uohn.apps.googleusercontent.com'
var CLIENT_SECRET = 'y5qJVqIbihHKntf6NbV6yzon'
var REDIRECT_URL = 'http://youtubepolls.herokuapp.com/oauth2callback'
var API_KEY = 'AIzaSyB_7jlnUHlve5_SDeefIDspy2eCjoptF7Q'

var express = require('express')
var google = require('googleapis')
var OAuth2 = google.auth.OAuth2;
//var youtube = require("youtube")
var youtube = google.youtube({version: 'v3'})

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
	// res.send("from_debugger:"+JSON.stringify(youtube))
	// var params = { shortUrl: 'http://goo.gl/xKbRu3' };
// 	youtube.url.get(params, function (err, response) {
//   if (err) {
//     res.send('Encountered error'+JSON.stringify(err));
//   } else {
//     res.send('Long url is'+response.longUrl);
//   }
// });
	youtube.search.list({
    	part: 'snippet',
    	q: 'maroon 5 payphone',
    	key: API_KEY,
    	auth: oauth2Client,
    	maxResults:3
    }, function(err, response) {
    	if (err) {
    		res.send(JSON.stringify(err));
    	} else {
    		var id_array = [];
			for(var i=0; i<response.items.length; i++) {
				id_array.push(response.items[i].id.videoId);
			}
			var commentTexts = []
			for (var i=0; i<id_array.length; i++) {
				console.log(id_array[i])
				youtube.commentThreads.list({
					videoId: id_array[i],
					part: 'snippet',
					textFormat: "plainText",
					maxResults: 10,
					key: API_KEY
				}, function(err, response) {
					if (err) {
						res.send("2"+JSON.stringify(err));
					} else {
						for (var x=0; x<response.items.length; x++) {
							var text = response.items[x].snippet.topLevelComment.snippet.textDisplay;
							//console.log(text)
							commentTexts.push(text)
						}
						if (i==3) {
							doAnalytics(commentTexts)
						}
					}
				})
			}
			res.sendfile("index.html")
		}
	})
}

function doAnalytics(arr) {
	var positive_words = ["good", "great", "awesome", "amazing", "fantastic", "best"]
	var negative_words = ["suck", "boring", "idiot", "stupid", "appalling", "messed up"]
}

app.listen(app.get('port'), function() {

});