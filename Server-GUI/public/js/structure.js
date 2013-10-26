$('.toggle-table').hide();
$('.toggle-table:first').show();

$(document).on('click','.panel-heading',function(){
	$(this).children().children().toggleClass('plus-sign minus-sign');
	var table = $(this).parent().children().last();
	table.slideToggle(400,function(){})
});


function page_load(){
	var url = "/page1";
	var homeurl = window.location.href;
	var qparts = homeurl.split("?");
	if(qparts.length < 1){
		//error out here
	}
	var strname = qparts[1];
	console.log("Struct Name: "+ strname);
	
	var statement = "select * from rnastr JOIN orna ON orna_seq_id=rnastr.seq_id where str_id='"+strname+"'";
	
	console.log(statement);
	var posting = $.post(
		url,
		{ userquery: statement },
		function(data){
			var jsonData = jQuery.parseJSON(JSON.parse(data));
			console.log("Showing the data");
			console.log(jsonData);
			
			var p = jsonData[0];
			
			for (var key in p) {
			  if (p.hasOwnProperty(key)) {
				console.log(key.toLowerCase() + " -> " + p[key]);
				if($("#"+key.toLowerCase()).size() == 1){
					$("#"+key.toLowerCase()).text(p[key]);
				}
			  }
			}
		},
		'text'
	);
};
page_load();