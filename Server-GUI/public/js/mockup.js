var query_group = [];
var result_group = [];

function addAll(select){
	//Add the option "All" back in
	$('<option/>').attr('value', 'all')
		.attr('selected', 'selected')
		.html('All')
		.appendTo(select);
}

function page_load() {
	$(function (){
    $('#tab-nav a:first').tab('show');
    
    jQuery(function($){
		$.getJSON('/classload', function(data) {
			var select = $('#rna_class');
			var tryme = JSON.parse(data);
			addAll(select);
			$.each(tryme, function(key, val){
				$('<option/>').attr('value', val.rna_class)
					  .html(val.rna_class)
					  .appendTo(select);
			});
		});
	});

	jQuery(function($){
		$.getJSON('/biodomainload', function(data) {
			var select = $('#biological_domain');
			var tryme = JSON.parse(data);
			addAll(select);
			$.each(tryme, function(key, val){
				$('<option/>').attr('value', val.org_type)
					  .html(val.org_type)
					  .appendTo(select);
			});
		});
	});

	jQuery(function($){
		$.getJSON('/orgload', function(data) {
			var select = $('#organism');
			var tryme = JSON.parse(data);
			addAll(select);
			$.each(tryme, function(key, val){
				$('<option/>').attr('value', val.org)
					  .html(val.org)
					  .appendTo(select);
			});
		});
	});
	
		jQuery(function($){
		$.getJSON('/nameload', function(data) {
			var select = $('#rna_name');
			var tryme = JSON.parse(data);
			addAll(select);
			$.each(tryme, function(key, val){
				$('<option/>').attr('value', val.name)
					  .html(val.name)
					  .appendTo(select);
			});
		});
	});
	
		jQuery(function($){
		$.getJSON('/ornaidload', function(data) {
			var select = $('#rna_id');
			var tryme = JSON.parse(data);
			addAll(select);
			$.each(tryme, function(key, val){
				$('<option/>').attr('value', val.orna_id)
					  .html(val.orna_id)
					  .appendTo(select);
			});
		});
	});
})
}

page_load();

$('#tab-nav a').click(function (e) {
  e.preventDefault()
  $(this).tab('show')
})

function getWhereClause(box, columnName){
	var selectedValues = $(box + ' :selected');
	whereClause = '(';
	if(selectedValues.val() == 'all') {
		$(box + '>option').each(function(i,d){ 
			if(d.value!="all"){
				whereClause += columnName + ' = \''+ d.value + '\' or ';
			}
		});
	}
	else {
		$(box + ' :selected').each(function(){
			whereClause += columnName + ' = \''+ $(this).val() + '\' or ';
		});
	}
	whereClause = whereClause.substring(0, whereClause.length - 3);
	whereClause = whereClause + ')';
	return whereClause;
}

function updateBioDomainBox(whereClause){

	//get ones that were selected
	var selectedValues = $('#biological_domain :selected');
	
    var term = "select distinct org_type from orna where " + whereClause;
    $('#biological_domain').empty();
    var posting = $.post(
					'/page1',
					{ userquery: term },
					function(data){
						var select = $('#biological_domain');
						var results = jQuery.parseJSON(JSON.parse(data));
						addAll(select);

						$.each(results, function(key, val){
							
					  		$('<option/>').attr('value', val.org_type)
					  			.html(val.org_type)
					  			.appendTo(select);
						});
						$.each(selectedValues, function(i){
							if ($(this).val()!='all'){
								$('#biological_domain option[value="all"]').prop('selected', false);
								$('#biological_domain option[value=\"'+$(this).val()+'\"]').prop('selected', true);
							}
						});
						if ($('#biological_domain :selected').val()==null){
							$('#biological_domain option[value="all"]').prop('selected', true);
						}
						clause2 = getWhereClause('#biological_domain', 'org_type');
						updateOrganismBox(whereClause+' and '+clause2);
					},
					'text'
				);
}

function updateOrganismBox(whereClause){

	//get ones that were selected
	var selectedValues = $('#organism :selected');
	
    var term = "select distinct org from orna where " + whereClause;
    $('#organism').empty();
    var posting = $.post(
					'/page1',
					{ userquery: term },
					function(data){
						var select = $('#organism');
						var results = jQuery.parseJSON(JSON.parse(data));
						addAll(select);

						$.each(results, function(key, val){
							
					  		$('<option/>').attr('value', val.org)
					  			.html(val.org)
					  			.appendTo(select);
						});
						$.each(selectedValues, function(i){
							if ($(this).val()!='all'){
								$('#organism option[value="all"]').prop('selected', false);
								$('#organism option[value=\"'+$(this).val()+'\"]').prop('selected', true);
							}
						});
						if ($('#organism :selected').val()==null){
							$('#organism option[value="all"]').prop('selected', true);
						}
						clause2 = getWhereClause('#organism', 'org');
						updateNameBox(whereClause+' and '+clause2);
					},
					'text'
				);
}

function updateNameBox(whereClause){

	//get ones that were selected
	var selectedValues = $('#rna_name :selected');
	
    var term = "select distinct name from orna where " + whereClause;
    	
    	
    $('#rna_name').empty();
    var posting = $.post(
					'/page1',
					{ userquery: term },
					function(data){
						var select = $('#rna_name');
						var results = jQuery.parseJSON(JSON.parse(data));
						addAll(select);

						$.each(results, function(key, val){
							
					  		$('<option/>').attr('value', val.name)
					  			.html(val.name)
					  			.appendTo(select);
						});
						$.each(selectedValues, function(i){
							if ($(this).val()!='all'){
								$('#rna_name option[value="all"]').prop('selected', false);
								$('#rna_name option[value=\"'+$(this).val()+'\"]').prop('selected', true);
							}
						});
						if ($('#rna_name :selected').val()==null){
							$('#rna_name option[value="all"]').prop('selected', true);
						}
						clause2 = getWhereClause('#rna_name', 'name');
						updateIdBox(whereClause+' and '+clause2);
					},
					'text'
				);
}

function updateIdBox(whereClause){

	//get ones that were selected
	var selectedValues = $('#rna_id :selected');

    var term = "select distinct orna_id from orna where " + whereClause;
    	
    $('#rna_id').empty();
    var posting = $.post(
					'/page1',
					{ userquery: term },
					function(data){
						var select = $('#rna_id');
						var results = jQuery.parseJSON(JSON.parse(data));
						addAll(select);

						$.each(results, function(key, val){
							
					  		$('<option/>').attr('value', val.orna_id)
					  			.html(val.orna_id)
					  			.appendTo(select);
						});
						$.each(selectedValues, function(i){
							if ($(this).val()!='all'){
								$('#rna_id option[value="all"]').prop('selected', false);
								$('#rna_id option[value=\"'+$(this).val()+'\"]').prop('selected', true);
							}
						});
						if ($('#rna_id :selected').val()==null){
							$('#rna_id option[value="all"]').prop('selected', true);
						}
					},
					'text'
				);
}

$('#rna_class').click(function(){
	var clause = getWhereClause('#rna_class', 'rna_class');
	updateBioDomainBox(clause);
});

$('#biological_domain').click(function(){
	var clause = getWhereClause('#rna_class', 'rna_class');
	clause += ' and ' + getWhereClause('#biological_domain', 'org_type');
	updateOrganismBox(clause);
});

$('#organism').click(function(){
	var clause = getWhereClause('#rna_class', 'rna_class');
	clause += ' and ' + getWhereClause('#biological_domain', 'org_type');
	clause += ' and ' + getWhereClause('#organism', 'org');
	updateNameBox(clause);
});

$('#rna_name').click(function(){
	var clause = getWhereClause('#rna_class', 'rna_class');
	clause += ' and ' + getWhereClause('#biological_domain', 'org_type');
	clause += ' and ' + getWhereClause('#organism', 'org');
	clause += ' and ' + getWhereClause('#rna_name', 'name');
	updateIdBox(clause);
});

//Clear all selection criteria (essentially a refresh of the page, but keep the results
$('#clear_criteria_button').click(function(){
	//empty all boxes
	$('#rna_class').empty();
	$('#biological_domain').empty();
	$('#organism').empty();
	$('#rna_name').empty();
	$('#rna_id').empty();
	//set select boxes to all non-filtered values
	page_load();
	
	//set selected RNA type to original
	$('#rna_type option[value="orna"]').prop('selected', true);


	//reset the 'advanced' select part
	$('#advance').empty();
	var html = '<div class="adv_group">\
                            <form class="row adv">\
                                <div class="col-md-2">\
                                    <select class="form-control" placeholder=".col-md-2">\
                                        <option></option>\
                                        <option>NOT</option>\
                                    </select>\
                                </div>\
                                <div class="col-md-3">\
                                    <select class="form-control" placeholder=".col-md-3">\
                                        <option></option>\
                                        <option value="rnaseq.len">Length of Sequence</option>\
                                        <option value="rnastr.mld">Max ladder distance</option>\
                                        <option value="rnastr.energy">Energy</option>\
                                    </select>\
                                </div>\
                                <div class="col-md-1">\
                                    <select class="form-control" placeholder=".col-md-1">\
                                        <option></option>\
                                        <option>=</option>\
                                        <option>&gt;</option>\
                                        <option>&lt;</option>\
                                    </select>\
                                </div>\
                                <div class="col-md-6">\
                                    <input type="text" class="form-control userinput" placeholder="Search Properties" id="advSearch0">\
                                </div>\
                            </form>\
                        </div>\
                        <div class="row">\
                            <div class="col-md-1">\
                                <button type="button" class="btn btn-default or_button">OR</button>\
                            </div>\
                        </div>';
                        
	$('#advance').append(html);

	//currently does not affect the checked properties
	
});

// Select/Search Button
var selectNumber = 1;
var tableOffset = [];
$('#search_button').click(function(){

	//pop up loading dialog
	$("#loading_dialog").dialog({dialogClass: "no-titlebar", modal: true});
	NProgress.start();
	/*
	var selectedTypeValues = []; 
	$( ".multiselect" ).each(function(i, selectBox){
		//console.log(i);
		//console.log(selectBox);
		//console.log(selectBox.id);
		var test = $('#'+selectBox.id+' :selected').val();
		console.log(test);
		
		   
		$('#'+selectBox.id+' :selected').each(function(){
			selectedTypeValues.push($(this).val()); 
		});
		
	});
	*/
  // James Code above
	var selectedRNAType = $("#rna_type :selected");
	var selectedOrg = $("#organism :selected");
	var selectedBD = $("#biological_domain :selected");
	var selectedRNAClass = $("#rna_class :selected");
	var selectedRNAName = $("#rna_name :selected");
	var selectedRNAId = $("#rna_id :selected");

	//grab every value for all
	//$("#rna_type>option").each(function(i,d){ console.log(i); console.log(d);})
	
	var	columns = 'rnaseq.len, temp.name, temp.orna_id, rnastr.energy, rnastr.mld, rnastr.str_id',
		join_statement = '',
		random_select = '';
		
	if(selectedRNAType.val() == "all" || selectedRNAType.val()== undefined){
		alert("please select either orna, srna, or rrna.");
		return;
	}
	else{
		selectedRNAType.each(function(){
			if ($(this).val()=='orna'){	
				//columns stay as they already are
				join_statement = 'JOIN rnaseq ON orna_seq_id = rnaseq.seq_id' + 
									' JOIN rnastr ON rnastr.seq_id = temp.orna_seq_id';
			}
			else if ($(this).val()=='srna'){
				//tableString += $(this).val() + ' join orna on (srna_orna_id = orna_id)';
				columns += ', srna_id';
				join_statement = 'JOIN srna on srna_orna_id = temp.orna_id' +
									' JOIN rnaseq ON rnaseq.seq_id = srna.srna_seq_id' +
									' JOIN rnastr ON rnastr.seq_id = srna.srna_seq_id';
			}
			else if ($(this).val()=='rrna'){
			//Get the length of the orna specified by the filters. Then get the randoms 
			//with that length.
				columns = 'rnaseq.len, temp2.name, temp2.orna_id, rnastr.energy, rnastr.mld, rnastr.str_id, rrna_id';
				random_select = '(SELECT rnaseq.len as orna_len, orna_id, orna_seq_id, name FROM';
				join_statement = 'JOIN rnaseq ON orna_seq_id = rnaseq.seq_id) AS temp2' +  
									' JOIN rrna ON rrna.len=temp2.orna_len' +
									' JOIN rnaseq ON temp2.orna_seq_id = rnaseq.seq_id' +
									' JOIN rnastr ON rnastr.seq_id = temp2.orna_seq_id';
			}
		});
	}
	
	var selectedOrgValues = '(';
	if(selectedOrg.val() == "all"){
		$("#organism>option").each(function(i,d){ 
			if(d.value!="all"){
				selectedOrgValues = selectedOrgValues + ' org = \''+ d.value + '\' or';
			}
		});
	}else{
		selectedOrg.each(function(){
			selectedOrgValues = selectedOrgValues + ' org = \''+ $(this).val() + '\' or';
		});
	}
	selectedOrgValues = selectedOrgValues.substring(0,selectedOrgValues.length - 3);
	selectedOrgValues = selectedOrgValues + ')';
	
	/*
	var selectedBDValues = [];
    selectedBD.each(function(){
        selectedBDValues.push($(this).val()); 
    });
	*/
	
	var selectedRNAClassValues = '(';
	if(selectedRNAClass.val() == "all"){
		$("#rna_class>option").each(function(i,d){ 
			if(d.value!="all"){
				selectedRNAClassValues = selectedRNAClassValues + ' rna_class = \'' + d.value + '\' or ';
			}
		});
	}else{
		selectedRNAClass.each(function(){
			selectedRNAClassValues = selectedRNAClassValues + ' rna_class = \'' + $(this).val() + '\' or ';
		});
	}
	selectedRNAClassValues = selectedRNAClassValues.substring(0,selectedRNAClassValues.length-4);
	selectedRNAClassValues = selectedRNAClassValues+')';
	
	
	var selectedRNANameValues = '(';
	if(selectedRNAName.val() == "all"){
		$("#rna_name>option").each(function(i,d){ 
			if(d.value!="all"){
				selectedRNANameValues = selectedRNANameValues + ' name = \'' + d.value + '\' or ';
			}
		});
	}else{
		selectedRNAName.each(function(){
			selectedRNANameValues = selectedRNANameValues + ' name = \'' + $(this).val() + '\' or ';
		});
	}
	selectedRNANameValues = selectedRNANameValues.substring(0,selectedRNANameValues.length-4);
	selectedRNANameValues = selectedRNANameValues+')';
	
	
	var selectedRNAIdValues = '(';
	if(selectedRNAId.val() == "all"){
		$("#rna_id>option").each(function(i,d){ 
			if(d.value!="all"){
				selectedRNAIdValues = selectedRNAIdValues + ' orna_id = \'' + d.value + '\' or ';
			}
		});
	}else{
		selectedRNAId.each(function(){
			selectedRNAIdValues = selectedRNAIdValues + ' orna_id = \'' + $(this).val() + '\' or ';
		});
	}
	selectedRNAIdValues = selectedRNAIdValues.substring(0,selectedRNAIdValues.length-4);
	selectedRNAIdValues = selectedRNAIdValues+')';
	
	// ' + columns + '
	var statement = 'SELECT * FROM ' + random_select + ' (SELECT * FROM orna JOIN rnaseq on rnaseq.seq_id = orna_seq_id WHERE 1=1 ';
	
	if(selectedOrg.val()!= undefined){
		statement = statement +' AND ' + selectedOrgValues;
	}
	if(selectedRNAClass.val()!= undefined){
		statement = statement + ' AND ' + selectedRNAClassValues;
	}
	if(selectedRNAName.val()!= undefined && selectedRNANameValues != ")"){
		statement = statement +' AND ' + selectedRNANameValues;
	}
	if(selectedRNAId.val()!= undefined && selectedRNAIdValues != ")"){
		statement = statement + ' AND ' + selectedRNAIdValues;
	}
	/*statement += ') AS temp JOIN rnaseq ON ' + sequenceString + ' = seq_id' + ' JOIN rnastr'
				+ ' ON rnastr.seq_id = temp.' + sequenceString;*/
	statement += ') AS temp ' + join_statement;
	
	
	
	
	//Prints each value out from a cell in blocks;
	var totalGroups = $(".adv_group").length;
	var advGroupData = "(";
	$(".adv_group").each(function(indexgroup,d){ 
		var advList = [];
		var stringInput = "";
		$(d).children().children().children().each(function(i,d){ 
			var addMe = true;
			var value = d.value;
			var part = i%4;
			
			stringInput=stringInput+ " " +value;
			if(part==3){
				if(value==""){
					addMe = false;
				}
				if(addMe){
					advList.push(stringInput);
				}
				stringInput = "";
			}
		}); 
		stringInput = "(";
		$.each(advList, function(i,d){
			stringInput=stringInput + d;
		});
		stringInput=stringInput+")";
		//stringInput now contains all the data for this group
		var empty = true;
		if(stringInput != "()"){
			advGroupData+=stringInput;
			empty = false;
		}
		if((indexgroup + 1)!=totalGroups){
				advGroupData+= " OR ";
		}
		//if empty remove previous or
		if(empty){
			advGroupData = advGroupData.substring(0,advGroupData.length-4);
		}
	});
	advGroupData+=")";
	
	if((advGroupData != "(())") && (advGroupData.length > 2)){
		statement+= " AND " + advGroupData;
	}
	
	// Code for adding on advanced
	// $(".adv > div").each( function(i,d){ console.log(i); console.log($(d).children().val()); })
	/*
	var advList = [];
	var stringInput = "";
	
	$(".adv > div").each( 
		function(i,d){ 
			var addMe = true;
			var value = $(d).children().val();
			var part = i%4;
			
			stringInput=stringInput+ " " +value;
			if(part==3){
				console.log(stringInput);
				if(value==""){
					addMe = false;
				}
				if(addMe){
					advList.push(stringInput);
				}
				stringInput = "";
			}
	});
	stringInput = "(";
	console.log("This is what Advanced shows me");
	console.log(advList);
	
	
	$.each(advList, function(i,d){
		stringInput=stringInput + d;
	});
	stringInput=stringInput+")";
	
	
	
	console.log("Final to be added");
	console.log(stringInput);
	if(stringInput != "()"){
		statement+= " AND " + stringInput;
	}
	*/
	
	
	//statement += ' LIMIT 5;';  //limiting for testing purposes	
	console.log(statement);
	//get results!
	var url = '/page1';
    var posting = $.post(
					url,
					{ userquery: statement },
					function(data){
						//close loading dialog opened at top of function
						NProgress.done();
						$("#loading_dialog").dialog('close');
						
						var jsonData = jQuery.parseJSON(JSON.parse(data));
						var table = "<div class=\"row result-table\"><h4><input class=\"result-checkbox\" type=\"checkbox\" id=\"result-checkbox-"+selectNumber+"\"><i class=\"chevron-down arrow\" value=\""+selectNumber+"\"></i>Select Result "+selectNumber+" - " + jsonData.length + " Rows <i class=\"pull-right remove-icon\"  value=\""+selectNumber+"\"></h4><div id=\"tableFrame"+selectNumber+"\" class=\"resultbox\" ><div id=\"result-"+selectNumber+"\"><table class=\"table table-hover\"><thead><tr>";
					 	$('input:checkbox:checked').each(function(i,input){
					 		table += "<th>" + input.value + "</th>";
					 	})
					 	table+="</tr></thead><tbody>";
					 	//add data into select result
						//var jsonData = jQuery.parseJSON(JSON.parse(data));
						$.each(jsonData, function(key, val){
							dataToAppend = "<tr value='"+val["str_id"]+"'>"
							$('input:checkbox:checked').each(function(i,input){
						 		var tmp =  input.value;
						 		// if(tmp=='name'){
						 		// 	table += "<td><a href='/detail?"+ val["str_id"] +"' target='_blank'>" + val[tmp] + "</a></td>"
						 		// }
						 		// else{
							 		dataToAppend += "<td>" + val[tmp] + "</td>";						 			
						 		// }
						 	})
							dataToAppend += "</tr>";
							table+=dataToAppend;
						});
						table+="</tbody></table><table class=\"header-fixed\" id=\"header-fixed"+selectNumber+"\"></table></div></div></div>";
						
						// console.log(table);
					 	$(table).appendTo('#search-result');
						//console.log(table);
					 	// var tableId = '#tableFrame'+selectNumber;
					 	// tableOffset.push($(tableId).offset().top); //push offset top to array
					 	// var header = $(tableId+" thead").clone().attr("id",function(){return "thead"+selectNumber});
					 	// $('#header-fixed'+selectNumber).append(header);

					 	$("body").animate({scrollTop:$('#result-'+selectNumber).offset().top},{queue:false, duration:800, easing: 'swing'});
					 	query_group.push({"index":selectNumber, "query":statement});
                        result_group.push({"index":selectNumber, "data":jsonData});
						selectNumber+=1;
					},
					'text'
				);
	
    return;
});

// $(document).on('scroll', 'table', function(){
// 	alert('bitch');
// })

$('#search-result').on('click','tr',function(){
	var structureid = $(this).attr("value");
	window.open("/detail?"+structureid, "_blank");
});

// Select properties
$('#select-properties').hide();

$('#select-properties-button').click(function(){
	var display = $('#select-properties').css('display');
	if (display == "none" || display == "hidden"){
		$('#select-properties').show();
	}else{
		$('#select-properties').hide();
	}
});

// Delete Result Table
$(document).on('click','i.remove-icon',function(){
	//console.log();
	var index = $(this).attr("value") - 1;
	result_group[index] = 0;
	var parent = $(this).parent().parent();
	parent.animate({left:'-1500px'},700,function(){
		parent.remove();
	})
});

// Show Hide results
$(document).on('click','i.arrow',function(){
	$(this).toggleClass('chevron-down chevron-right');
	var table = $(this).parent().parent().children().last();
	table.slideToggle(400,function(){})
});

// Advanced Generator
var advHtml1 = '<div class="row adv">\
<div class="col-md-2">\
    <select class="form-control" placeholder=".col-md-2">\
        <option>AND</option>\
        <option>NOT</option>\
    </select>\
</div>\
<div class="col-md-3">\
    <select class="form-control" placeholder=".col-md-3">\
        <option></option>\
        <option value="rnaseq.len">Length of Sequence</option>\
        <option value="rnastr.mld">Max ladder distance</option>\
        <option value="rnastr.energy">Energy</option>\
    </select>\
</div>\
<div class="col-md-1">\
    <select class="form-control" placeholder=".col-md-1">\
        <option></option>\
        <option>=</option>\
        <option>&gt;</option>\
        <option>&lt;</option>\
    </select>\
</div>\
<div class="col-md-6">\
    <input type="text" class="form-control userinput" placeholder="Search Properties" id="advSearch';
var advHtml2 = '">\
</div>\
</div>';
var advSearchCount = 1;
$(document).on('keypress', '.adv_group .userinput', function(){
	var keypressInput = $(this);
	var lastInputs = []
	$('.adv_group').each(function(){
		lastInputs.push($(this).find('.userinput:last').attr('id'));
	});
	if (lastInputs.indexOf(keypressInput.attr('id')) != -1){
		$(this).parent().parent().after(advHtml1+advSearchCount+advHtml2);
		advSearchCount++;
	}
});

var orHtml1 = '<div class="adv_group">\
    <form class="row adv">\
        <div class="col-md-2">\
            <select class="form-control" placeholder=".col-md-2">\
                <option></option>\
                <option>NOT</option>\
            </select>\
        </div>\
        <div class="col-md-3">\
            <select class="form-control" placeholder=".col-md-3">\
                <option></option>\
                <option value="rnaseq.len">Length of Sequence</option>\
                <option value="rnastr.mld">Max ladder distance</option>\
                <option value="rnastr.energy">Energy</option>\
            </select>\
        </div>\
        <div class="col-md-1">\
            <select class="form-control" placeholder=".col-md-1">\
                <option></option>\
                <option>=</option>\
                <option>&gt;</option>\
                <option>&lt;</option>\
            </select>\
        </div>\
        <div class="col-md-6">\
            <input type="text" class="form-control userinput" placeholder="Search Properties" id="advSearch'
var orHtml2 = '">\
        </div>\
    </form>\
</div>\
<div class="row">\
    <div class="col-md-1">\
        <button type="button" class="btn btn-default or_button">OR</button>\
    </div>\
</div>'
$(document).on('click','.or_button',function(){
	$(this).parent().parent().after(orHtml1+advSearchCount+orHtml2);
	advSearchCount++;
})

// hide result table
$("#popular-tab,#history-tab").click(function(){
	$("#search-result").hide();
});
$("#select-tab").click(function(){
	$("#search-result").show();
});

// top button
$(window).scroll(function(){
	var offsetY = $(window).scrollTop();
	if(offsetY >= 300 ){
       $('#top-button').fadeIn(300);
    }
    else {
      $('#top-button').fadeOut(300);
    }
});

$('#top-button').click(function(event) {
    event.preventDefault();
    $('body').animate({scrollTop: 0}, {duration:500,easing:'swing'});
    return false;
})