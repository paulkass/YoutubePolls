var host = location.origin.replace(/^http/, 'wss')
var ws = new WebSocket(host);
$(document).ready(function() {
	load();
	
	$("button#search").click(submitQuery);
	$("button#search").keypress(function(e){
		if(e.which === 13)
			submitQuery();
	});
	
function websocketOpen() {
	ws = new WebSocket(host);
 	ws.onmessage = function(event){
		if(event.data === "")
			return;
		var data = event.data
		var stub = data.split("::")[0]
		var obj = JSON.parse(data.split("::")[1])
		$("section#resultsHead").html('')
		$("#chart").css({
			height: window.innerHeight*0.5
		})
		var ctx = document.getElementById("chart").getContext("2d");
		var chartData = [
			{
				value: obj.positive_count,
				color: "#46BFBD",
				highlight: "#5AD3D1",
				label: "Positive"
			},
			{
				value: obj.negative_count,
				color: "#F7464A",
				highlight: "#FF5A5E",
				label: "Negative"
			}
		]
		var chartOptions = {
   			 //Boolean - Whether we should show a stroke on each segment
    		segmentShowStroke : true,

    		//String - The colour of each segment stroke
    		segmentStrokeColor : "#fff",

    		//Number - The width of each segment stroke
    		segmentStrokeWidth : 2,

   		 	//Number - The percentage of the chart that we cut out of the middle
    		percentageInnerCutout : 50, // This is 0 for Pie charts

    		//Number - Amount of animation steps
    		animationSteps : 100,

    		//String - Animation easing effect
    		animationEasing : "easeOutBounce",

    		//Boolean - Whether we animate the rotation of the Doughnut
    		animateRotate : true,

    		//Boolean - Whether we animate scaling the Doughnut from the centre
    		animateScale : false
		}

		var chart = new Chart(ctx).Doughnut(chartData, chartOptions)
	};
	
	ws.on('close', function() {
		console.log("Reopening Socket")
		webSocketOpen()
	});
}
webSocketOpen();
});


function load() {
	$("section#intro").append("<p>Welcome to YoutubePolls!</p>");
}

function submitQuery() {
	var query = $("input").serializeArray();
	$("input#inputTopic").val("");
	ws.send("query::"+ query[0].value);
	console.log("emitted" + query[0].value);
	$("section#resultsHead").html('<p class="col-sm-12">Obtaining Results...</p>');
}