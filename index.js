$(document).ready(load);

function load() {
	$("section#intro").append("<p>Welcome to YoutubePolls!</p>");
}


$("section#pollresults").ready(loadBoard);

function loadBoard() {
	var fields = JSON.parse(localStorage.getItem('results'));
	if(fields === null)
	{
		$("section#resultsHead").append("<p>No Results</p>");
	}
	else
	{
		$("section#resultsHead").append("<p>" + fields.length + " Results</p>");
		$("section#pollresults").append(
			'<table class="col-sm-12"><thead><tr><th>Video Name</th><th>Video Rating</th><th>Comments</th></tr></thead><tbody id="results"></tbody></table>'
		);
		var tableappend = "";
		for(var j = 0; j < fields.length; j++)
			tableappend += "<tr><td>" + fields[j].name + "</td><td>" + fields[j].rating + "</td><td>" + "" + "</td></tr>";
		$("tbody#results").append(tableappend);
	}
}