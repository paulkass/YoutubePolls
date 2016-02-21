$(document).ready(function() {
	load();
	$("#search").click(loadBoard);
});

function load() {
	$("section#intro").append("<p>Welcome to YoutubePolls!</p>");
}

function loadBoard() {
	var fields = JSON.parse(localStorage.getItem('results'));
	if(fields === null)
	{
		$("section#resultsHead").html('<p class="col-sm-12">No Results</p>');
	}
	else
	{
		$("section#resultsHead").html('<p class="col-sm-12">' + fields.length + " Results</p>");
		$("section#pollresults").html(
			'<table class="col-sm-12"><thead><tr><th>Video Name</th><th>Video Rating</th><th>Comments</th></tr></thead><tbody id="results"></tbody></table>'
		);
		var tableappend = "";
		for(var j = 0; j < fields.length; j++)
			tableappend += "<tr><td>" + fields[j].name + "</td><td>" + fields[j].rating + "</td><td>" + "" + "</td></tr>";
		$("tbody#results").append(tableappend);
	}
}