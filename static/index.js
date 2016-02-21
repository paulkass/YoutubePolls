var host = location.origin.replace(/^http/, 'ws')
var ws = new WebSocket(host);
$(document).ready(function() {
	load();
	
	$("button#search").click(submitQuery);
	$("button#search").keypress(function(e){
		if(e.which === 13)
			submitQuery();
	});
 	ws.onmessage = function(event){
 		console.log(event);
 		if(event.data !== "")
	 		loadBoard(JSON.parse(event.data));
 	};

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

function loadBoard(result) {
	if(result === null || result === undefined)
	{
		$("section#resultsHead").html('<p class="col-sm-12">No Results</p>');
	}
	else
	{
		$("section#resultsHead").html("<p class='col-sm-12'>Results Found</p>");
		$("section#pollresults").html(
			'<table class="col-sm-12"><thead><tr><th>Search QUery</th><th>Postive Comments</th><th>Negative Comments</th></tr></thead><tbody id="results"></tbody></table>'
		);
		var tabledata = "";
		result.forEach(function(data){
			tabledata += "<tr><td>" + data.query + "</td><td>" + data.positive_count + "</td><td>" + data.negative_count + "</td></tr>";
		});
			
		$("tbody#results").append(tableappend);
	}
}