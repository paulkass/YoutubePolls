console.log("app started")

var CLIENT_ID = '974118819904-j47m556oudl4ao3q716ib8ktq4e0uohn.apps.googleusercontent.com'
var CLIENT_SECRET = 'y5qJVqIbihHKntf6NbV6yzon'
var REDIRECT_URL = 'http://youtubepolls.herokuapp.com/oauth2callback'
var API_KEY = 'AIzaSyB_7jlnUHlve5_SDeefIDspy2eCjoptF7Q'

var express = require('express')
var google = require('googleapis')
var http = require('http')
var OAuth2 = google.auth.OAuth2;
var youtube = google.youtube({version: 'v3'})

var app = express()

app.use('/', express.static(__dirname+"/static"))

var port = (process.env.PORT || 5000);
var server = http.createServer(app)
server.listen(port)

var WebSocketServer = require("ws").Server
var wss = new WebSocketServer({server: server})
console.log("websocket server created")

//var oauth2Client = new OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URL)

//app.set('port', port);
console.log("Port: "+app.get('port'))

wss.on("connection", function(ws) {
  
  ws.on("message", function(data, flags) {
  		var stuff = data.split("::")
  		var id = stuff[0]
  		var data = stuff[1]
  		
  		switch (id) {
  			case "query":
  				callQuery(data)
  				break
  			default:
  			
  		}
  });

  console.log("websocket connection open")

  ws.on("close", function() {
    console.log("websocket connection close")
    clearInterval(id)
  })
})

// app.get('/', function(req, res) {
// 	console.log("Got Request")
// 	//res.sendfile("index.html")
// 	// var scopes = ['https://www.googleapis.com/auth/youtube']
// // 	
// // 	var url = oauth2Client.generateAuthUrl({
// // 		scope: scopes
// // 	})
// // 	
// // 	res.redirect(url);
// });

// app.get('/', function(req, res) {
// 	var code = req.query.code
// 	res.sendfile(__dirname+"/static/index.html")
// 	//res.sendfile("index.html")
// 	// oauth2Client.getToken(code, function(err, tokens) {
// //   		if(!err) {
// //   			
// //     		oauth2Client.setCredentials(tokens);
// //     		console.log("OAuth Authentication Finished.")
// //     		//console.log(JSON.stringify(youtube.videos))
// //     		//callQuery(res)
// //     		res.sendfile(__dirname+"/static/index.html")
// //   		} else {
// //   			console.log(JSON.stringify(err))
// //   		}
// // 	});
// });

function callQuery(query) {
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
    	q: query,
    	key: API_KEY,
    	maxResults:3
    }, function(err, response) {
    	if (err) {
    		console.log(JSON.stringify(err));
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
						console.log("2"+JSON.stringify(err));
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
		}
	})
}

function doAnalytics(arr) {
	var positive_words = ["good", "great", "awesome", "amazing", "fantastic", "best"]
	var negative_words = ["suck", "boring", "idiot", "stupid", "appalling", "messed up"]
	var countObject = {}
	console.log(JSON.stringify(arr))
// 	for (var i=0; i<arr.length; i++) {
// 		
// 	}
}

// app.listen(app.get('port'), function() {
// 
// });