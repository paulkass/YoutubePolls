$(document).ready(function() {
	load();
	socket = io('wss://youtubepolls.herokuapp.com/');
	$("#search").click(submitQuery);
	socket.onmessage = function(result){
		loadBoard(result);
	};
});

function load() {
	$("section#intro").append("<p>Welcome to YoutubePolls!</p>");
}

function submitQuery() {
  var query = $("#inputtopic").serializeArray();
  socket.emit('query', query[0].value);
  $("section#resultsHead").html("Obtaining Results...");
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