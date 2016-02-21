var host = location.origin.replace(/^http/, 'ws')
var ws = new WebSocket(host);
var current_charts = []

$(document).ready(function() {
	load();
	
	$("#pollresults").hide()
	$("#resultsHead").hide()
	$("#error_view").hide()
	
	$("button#search").click(submitQuery);
	$("#inputTopic").keypress(function(e){
		if(e.which == 13) {
			e.preventDefault()
			submitQuery()
		}
	});
	
	$( "#progressbar" ).progressbar({
  		value: false
	});
	
	ws = new WebSocket(host);
 	ws.onmessage = function(event){
 		$("#resultsHead").hide()
		if(event.data === "")
			return;
		var data = event.data
		var stub = data.split("::")[0]
		var obj = JSON.parse(data.split("::")[1])
		
		var ordered = []		
		var pos_words = []
		var neg_words = []
		var total_comments = obj.total_comments
		for (var i = 0; i < obj.positive_words.length; i++) {
			pos_words[i] = obj.positive_words[i]
		}
		for (var i = 0; i < obj.negative_words.length; i++) {
			neg_words[i] = obj.negative_words[i]
		}
		delete obj.positive_words
		delete obj.negative_words
		for(var prop in obj)
		{
			ordered.push({
			key: prop,
			value: obj[prop]
			})
		}
		ordered.sort(function(a, b){return b.value - a.value;});


		if (obj.error) {
			$("#error_view").show("fade")
			$("#pollresults").hide()
			$("#sample").html(JSON.stringify(obj.err_object))
		} else {
			$("#pollresults").show("fade")
			$("#error_view").hide()
			$("section#resultsHead").html('')
			$("canvas").css({
				height: window.innerHeight*0.5
			})
		}
		var ctx = document.getElementById("chart").getContext("2d");
		clearContext(ctx, document.getElementById("chart"))
		var chartData = [
			{
				value: findOrderedValue("positive_count", ordered),
				color: "#46BFBD",
				highlight: "#5AD3D1",
				label: "Positive"
			},
			{
				value: findOrderedValue("negative_count", ordered),
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
		ordered.splice(0,2);

		var chart = new Chart(ctx).Doughnut(chartData, chartOptions)
		current_charts.push(chart)
		$("#total_comments").html("<h4>Total Comments: "+total_comments+"</h4>")

		var posCtx = document.getElementById("chart2").getContext("2d")
		clearContext(posCtx, document.getElementById("chart2"))
		populateChart(posCtx, pos_words, ordered, "Positive Words")
		
		var negCtx = document.getElementById("chart3").getContext("2d")
		clearContext(negCtx, document.getElementById("chart3"))
		populateChart(negCtx, neg_words, ordered, "Negative Words")
		
		function clearContext(context, canvas) {
			context.clearRect(0, 0, canvas.width, canvas.height);
		}
		
		function populateChart(context, labels, object, title) {
			var curData = {
				labels: [],
				datasets: [
					{
						label: title,
            			fillColor: "#00CCFF",
            			strokeColor: "rgba(220,220,220,0.8)",
            			highlightFill: "rgba(220,220,220,0.75)",
            			highlightStroke: "rgba(220,220,220,1)",
            			data: []
					}
				]
			}
			var curOptions = {
			
			}
			
			for (var i = 0; i < ordered.length; i++)
			{
				for(var j = 0; j < labels.length; j++)
				{
					if(ordered[i].key == labels[j])
					{
						curData.datasets[0].data.push(ordered[i].value)
						curData.labels.push(ordered[i].key)
					}
				}
			}
			
			var curChart = new Chart(context).Bar(curData, curOptions);
			current_charts.push(curChart)
		}
	};
});
function findOrderedValue(key, arr){
	for (var i = 0; i < arr.length; i++)
		if(arr[i].key == key)
			return arr[i].value;
}

function load() {
	$("section#intro").append("<p>Welcome to YoutubePolls!</p>");
}

function submitQuery() {
	var query = $("input").serializeArray();
	$("input#inputTopic").val("");
	ws.send("query::"+ query[0].value);
	console.log("emitted" + query[0].value);
	//$("section#resultsHead").html('<p class="col-sm-12">Obtaining Results...</p>');
	for (var i=0; i<current_charts.length; i++) {
		current_charts[i].destroy()
	}
	current_charts = []
	
}