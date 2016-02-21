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

var WebSocket = require("ws")
var ws = new WebSocket('ws://youtubepolls0.herokuapp.com/')
var WebSocketServer = require("ws").Server
var wss = new WebSocketServer({server: server})
console.log("websocket server created")

var retdata

//var oauth2Client = new OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URL)

//app.set('port', port);
wss.on("connection", function(ws){
	console.log("websocket server open")
	ws.on("open", function() {
		console.log("websocket connection open")
	})
	ws.on("message", function(data, flags) {
		console.log("begin")
		var stuff = data.split("::")
		var id = stuff[0]
		var data = stuff[1]
		switch (id) {
			case "query":
				retdata = callQuery(data)
				console.log("retdata: " +JSON.stringify(retdata))
				break
			default:
				break
		}
	})
	if(retdata !== undefined)
	{
		ws.send("object::"+JSON.stringify(retdata))
		console.log("sent")
	}
	ws.on("close", function() {
		console.log("websocket connection close")
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
    		console.log(JSON.stringify(err))
    		return
    	} else {
    		var id_array = []
			for(var i=0; i<response.items.length; i++) {
				id_array.push(response.items[i].id.videoId);
			}
			var commentTexts = []
			for (var i=0; i<id_array.length; i++) {
				console.log(i + " "+id_array[i])
				youtube.commentThreads.list({
					videoId: id_array[i],
					part: 'snippet',
					textFormat: "plainText",
					maxResults: 10,
					key: API_KEY
				}, function(err, response) {
					if (err) {
						console.log("2"+JSON.stringify(err))
						return
					} else {
						for (var x=0; x<response.items.length; x++) {
							var text = response.items[x].snippet.topLevelComment.snippet.textDisplay;
							//console.log(text)
							commentTexts.push(text)
						}
					}
				})
			}
			console.log("pushing")
			return doAnalytics(commentTexts)
		}
	})
}

function doAnalytics(arr) {
	var positive_words = ["good", "great", "awesome", "amazing", "fantastic", "best", "love"]
	var negative_words = ["suck", "boring", "idiot", "stupid", "appalling", "messed up", "hate"]
	var countObject = {}
	//console.log(JSON.stringify(arr))
	for (var i=0; i<positive_words.length; i++) {
		countObject[positive_words[i]]=0
	}
	for (var i=0; i<negative_words.length; i++) {
		countObject[negative_words[i]]=0
	}
	var positive_count = 0
	var negative_count = 0
	for (var i=0; i<arr.length; i++) {
		for (var x=0; x<positive_words.length; x++) {
			if (arr[i].includes(positive_words[x]))
				countObject[positive_words[x]] = countObject[positive_words[x]]+1
				positive_count++
		}
		for (var x=0; x<negative_words.length; x++) {
			if (arr[i].includes(negative_words[x]))
				countObject[negative_words[x]] = countObject[negative_words[x]]+1
				negative_count++
		}
	}
	countObject.positive_count = positive_count
	countObject.negative_count = negative_count
	console.log("countObject: " + JSON.stringify(countObject))
	return countObject
}