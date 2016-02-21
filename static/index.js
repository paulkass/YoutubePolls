$(document).ready(function() {
	load();
	
	$("button#search").click(submitQuery);
	$("button#search").keypress(function(e){
		if(e.which === 13)
			submitQuery();
	});
// 	socket.onmessage = function(result){
// 		loadBoard(result);
// 	};

});

var host = location.origin.replace(/^http/, 'ws')
var ws = new WebSocket(host);
ws.onmessage = function(event){
	//loadBoard(event.data);
	var data = event.data
	var stub = data.split("::")[0]
	var obj = JSON.parse(data.split("::")[1])
	$("section#resultsHead").html('')
	$("#chart").css({
		height: window.innerHeight*0.3,
		width: window.innerWidth*0.5
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
	
	}
	var chart = new Chart(ctx).Doughnut(chartData, chartOptions)
};
	

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


function loadBoard(result) {
	if(result === null)
	{
		$("section#resultsHead").html('<p class="col-sm-12">No Results</p>');
	}
	else
	{
		$("section#resultsHead").html('<p class="col-sm-12">' + result.length + " results found</p>");
		$("section#pollresults").html(
			'<table class="col-sm-12"><thead><tr><th>Video Name</th><th>Postive Comments</th><th>Negative Comments</th></tr></thead><tbody id="results"></tbody></table>'
		);
		var tabledata = "";
		result.forEach(function(data){
			tabledata += "<tr><td>" + data.name + "</td><td>" + data.positive + "</td><td>" + data.negative + "</td></tr>";
		});
			
		$("tbody#results").append(tableappend);
	}
}