function loadBoard() {
	//replace with server technology
	var fields = JSON.parse(localStorage.getItem('results'));
	//end replace
	var tableappend = "";
	for(var j = 0; j < fields.length; j++)
		tableappend += "<tr><td>" + fields[j].name + "</td><td>" + fields[j].rating + "</td><td>" + "" + "</td></tr>";
	$("tbody#results").append(tableappend);
}

function load() {
	$("section#intro").append("<p>Welcome to YoutubePolls!</p>");
}
$(document).ready(function() {
	load();
});
$("tbody#results").ready(loadBoard);