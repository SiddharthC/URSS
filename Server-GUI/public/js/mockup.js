var query_group = [];
var result_group = [];
var plot_group = [];

//Grapher variables
var graph_no = 0;
var x_exptID, x_exptITR, x_nodeID, x_resName, x_colName, x_upper, x_lower;
var chart = []; // globally available
//

function addAll(select) {
	//Add the option "All" back in
	$('<option/>').attr('value', 'all')
		.attr('selected', 'selected')
		.html('All')
		.appendTo(select);
}

function page_load() {
	$(function() {
		$('#tab-nav a:first').tab('show');

		jQuery(function($) {
			$.getJSON('/classload', function(data) {
				var select = $('#rna_class');
				var tryme = JSON.parse(data);
				addAll(select);
				$.each(tryme, function(key, val) {
					$('<option/>').attr('value', val.rna_class)
						.html(val.rna_class)
						.appendTo(select);
				});
			});
		});

		jQuery(function($) {
			$.getJSON('/biodomainload', function(data) {
				var select = $('#biological_domain');
				var tryme = JSON.parse(data);
				addAll(select);
				$.each(tryme, function(key, val) {
					$('<option/>').attr('value', val.org_type)
						.html(val.org_type)
						.appendTo(select);
				});
			});
		});

		jQuery(function($) {
			$.getJSON('/orgload', function(data) {
				var select = $('#organism');
				var tryme = JSON.parse(data);
				addAll(select);
				$.each(tryme, function(key, val) {
					$('<option/>').attr('value', val.org)
						.html(val.org)
						.appendTo(select);
				});
			});
		});

		jQuery(function($) {
			$.getJSON('/nameload', function(data) {
				var select = $('#rna_name');
				var tryme = JSON.parse(data);
				addAll(select);
				$.each(tryme, function(key, val) {
					$('<option/>').attr('value', val.name)
						.html(val.name)
						.appendTo(select);
				});
			});
		});

		jQuery(function($) {
			$.getJSON('/ornaidload', function(data) {
				var select = $('#rna_id');
				var tryme = JSON.parse(data);
				addAll(select);
				$.each(tryme, function(key, val) {
					$('<option/>').attr('value', val.orna_id)
						.html(val.orna_id)
						.appendTo(select);
				});
			});
		});
	})
}

page_load();

$('#tab-nav a').click(function(e) {
	e.preventDefault()
	$(this).tab('show')
})

function getWhereClause(box, columnName) {
	var selectedValues = $(box + ' :selected');
	whereClause = '(';
	if (selectedValues.val() == 'all') {
		$(box + '>option').each(function(i, d) {
			if (d.value != "all") {
				whereClause += columnName + ' = \'' + d.value + '\' or ';
			}
		});
	} else {
		$(box + ' :selected').each(function() {
			whereClause += columnName + ' = \'' + $(this).val() + '\' or ';
		});
	}
	whereClause = whereClause.substring(0, whereClause.length - 3);
	whereClause = whereClause + ')';
	return whereClause;
}

function updateBioDomainBox(whereClause) {

	//get ones that were selected
	var selectedValues = $('#biological_domain :selected');

	var term = "select distinct org_type from orna where " + whereClause;
	$('#biological_domain').empty();
	var posting = $.post(
		'/page1', {
			userquery: term
		},
		function(data) {
			var select = $('#biological_domain');
			var results = jQuery.parseJSON(JSON.parse(data));
			addAll(select);

			$.each(results, function(key, val) {

				$('<option/>').attr('value', val.org_type)
					.html(val.org_type)
					.appendTo(select);
			});
			$.each(selectedValues, function(i) {
				if ($(this).val() != 'all') {
					$('#biological_domain option[value="all"]').prop('selected', false);
					$('#biological_domain option[value=\"' + $(this).val() + '\"]').prop('selected', true);
				}
			});
			if ($('#biological_domain :selected').val() == null) {
				$('#biological_domain option[value="all"]').prop('selected', true);
			}
			clause2 = getWhereClause('#biological_domain', 'org_type');
			updateOrganismBox(whereClause + ' and ' + clause2);
		},
		'text'
	);
}

function updateOrganismBox(whereClause) {

	//get ones that were selected
	var selectedValues = $('#organism :selected');

	var term = "select distinct org from orna where " + whereClause;
	$('#organism').empty();
	var posting = $.post(
		'/page1', {
			userquery: term
		},
		function(data) {
			var select = $('#organism');
			var results = jQuery.parseJSON(JSON.parse(data));
			addAll(select);

			$.each(results, function(key, val) {

				$('<option/>').attr('value', val.org)
					.html(val.org)
					.appendTo(select);
			});
			$.each(selectedValues, function(i) {
				if ($(this).val() != 'all') {
					$('#organism option[value="all"]').prop('selected', false);
					$('#organism option[value=\"' + $(this).val() + '\"]').prop('selected', true);
				}
			});
			if ($('#organism :selected').val() == null) {
				$('#organism option[value="all"]').prop('selected', true);
			}
			clause2 = getWhereClause('#organism', 'org');
			updateNameBox(whereClause + ' and ' + clause2);
		},
		'text'
	);
}

function updateNameBox(whereClause) {

	//get ones that were selected
	var selectedValues = $('#rna_name :selected');

	var term = "select distinct name from orna where " + whereClause;


	$('#rna_name').empty();
	var posting = $.post(
		'/page1', {
			userquery: term
		},
		function(data) {
			var select = $('#rna_name');
			var results = jQuery.parseJSON(JSON.parse(data));
			addAll(select);

			$.each(results, function(key, val) {

				$('<option/>').attr('value', val.name)
					.html(val.name)
					.appendTo(select);
			});
			$.each(selectedValues, function(i) {
				if ($(this).val() != 'all') {
					$('#rna_name option[value="all"]').prop('selected', false);
					$('#rna_name option[value=\"' + $(this).val() + '\"]').prop('selected', true);
				}
			});
			if ($('#rna_name :selected').val() == null) {
				$('#rna_name option[value="all"]').prop('selected', true);
			}
			clause2 = getWhereClause('#rna_name', 'name');
			updateIdBox(whereClause + ' and ' + clause2);
		},
		'text'
	);
}

function updateIdBox(whereClause) {

	//get ones that were selected
	var selectedValues = $('#rna_id :selected');

	var term = "select distinct orna_id from orna where " + whereClause;

	$('#rna_id').empty();
	var posting = $.post(
		'/page1', {
			userquery: term
		},
		function(data) {
			var select = $('#rna_id');
			var results = jQuery.parseJSON(JSON.parse(data));
			addAll(select);

			$.each(results, function(key, val) {

				$('<option/>').attr('value', val.orna_id)
					.html(val.orna_id)
					.appendTo(select);
			});
			$.each(selectedValues, function(i) {
				if ($(this).val() != 'all') {
					$('#rna_id option[value="all"]').prop('selected', false);
					$('#rna_id option[value=\"' + $(this).val() + '\"]').prop('selected', true);
				}
			});
			if ($('#rna_id :selected').val() == null) {
				$('#rna_id option[value="all"]').prop('selected', true);
			}
		},
		'text'
	);
}

//Grapher functions

var addGraphFunc = function() {
	if ($('#percentValue').val() == 'Value') {
		alert("Please select all the fields");
		return;
	}

	var params = {

		rnaType: jQuery('#rnaType option:selected').val(),

		propertyType: jQuery('#propertyType option:selected').val(),
		propertyName: jQuery('#propertyName option:selected').val(),

		selnuc: jQuery('#selnuc').val(),
		nuc: jQuery('#nuc').val(),
		operation: jQuery('#operation option:selected').val(),
		percentValue: jQuery('#percentValue').val(),

		func: jQuery('#func').val(),

		serieid: 1,
	};

	disp(vars);

	ctn = $('#container' + (graph_no));
	ctn.clone().attr('id', 'container' + (graph_no + 1)).insertBefore(ctn);

	var options = {
		chart: {
			renderTo: ctn.attr('id'),
			type: $('#graph_type option:selected').val(),
			zoomType: 'x'
		},
		title: {
			text: $('#graph_title').val()
		},
		subtitle: {
			text: "Graph - " + (graph_no + 1)
		},
		xAxis: {

			title: {
				text: $('#x_label').val()
			}
		},
		yAxis: {
			title: {
				text: $('#y_label').val()
			}
		},
		plotOptions: {
			spline: {
				lineWidth: 1,
				marker: {
					enabled: false,
					states: {
						hover: {
							enabled: true,
							radius: 5
						}
					}
				},
				shadow: false,
				states: {
					hover: {
						lineWidth: 1
					}
				}
			},
			line: {
				lineWidth: 1,
				marker: {
					enabled: false,
					states: {
						hover: {
							enabled: true,
							radius: 5
						}
					}
				},
				shadow: false,
				states: {
					hover: {
						lineWidth: 1
					}
				}
			},
			scatter: {
				marker: {
					radius: 2,
					states: {
						hover: {
							enabled: true,
							radius: 5
						}
					}
				}
			},
			column: {
				lineWidth: 1,
				marker: {
					enabled: false,
					states: {
						hover: {
							enabled: true,
							radius: 5
						}
					}
				},
				shadow: false,
				states: {
					hover: {
						lineWidth: 1
					}
				}
			},
			bar: {
				lineWidth: 1,
				marker: {
					enabled: false,
					states: {
						hover: {
							enabled: true,
							radius: 5
						}
					}
				},
				shadow: false,
				states: {
					hover: {
						lineWidth: 1
					}
				}
			},
			area: {
				fillColor: {
					linearGradient: {
						x1: 0,
						y1: 0,
						x2: 0,
						y2: 1
					},
					stops: [
						[0, Highcharts.getOptions().colors[0]],
						[1, 'rgba(2,0,0,0)']
					]
				},
				lineWidth: 1,
				marker: {
					enabled: false,
					states: {
						hover: {
							enabled: true,
							radius: 5
						}
					}
				},
				shadow: false,
				states: {
					hover: {
						lineWidth: 1
					}
				}
			},
			areaspline: {
				fillColor: {
					linearGradient: {
						x1: 0,
						y1: 0,
						x2: 0,
						y2: 1
					},
					stops: [
						[0, Highcharts.getOptions().colors[0]],
						[1, 'rgba(2,0,0,0)']
					]
				},
				lineWidth: 1,
				marker: {
					enabled: false,
					states: {
						hover: {
							enabled: true,
							radius: 5
						}
					}
				},
				shadow: false,
				states: {
					hover: {
						lineWidth: 1
					}
				}
			}
		},
		credits: {
			enabled: false
		},
		series: []
	};

	// To record all y values
	var yValues = new Array();

	$.getJSON("/getColumnData", params, function(result) {
		options.series.push(result);
		chart[graph_no] = new Highcharts.Chart(options);

	});

	$('#graph_name').append($('<option></option>').val(graph_no + 1).html("Graph - " + (graph_no + 1)).attr('selected', true));
	$('#graph_name_series').empty();
	$('#graph_name_series').append($('<option></option>').val(1).html("Series - " + 1).attr('selected', true));
	graph_no++;
	ctn.attr('style', 'box-shadow: 10px 10px 5px #888888; margin:10px');
}

var addStepFreqFunc = function() {
	if (($('#percentValue').val() == 'Value') || ($('#stepSize').val() == "Value")) {
		alert("Please select all the fields");
		return;
	}

	var params = {

		rnaType: jQuery('#rnaType option:selected').val(),

		propertyType: jQuery('#propertyType option:selected').val(),
		propertyName: jQuery('#propertyName option:selected').val(),

		selnuc: jQuery('#selnuc').val(),
		nuc: jQuery('#nuc').val(),
		operation: jQuery('#operation option:selected').val(),
		percentValue: jQuery('#percentValue').val(),

		stepSize: jQuery('#stepSize').val(),

		func: jQuery('#func').val(),

		serieid: 1,
	};

	ctn = $('#container' + (graph_no));
	ctn.clone().attr('id', 'container' + (graph_no + 1)).insertBefore(ctn);

	var graph_type;

	if ($('#graph_type option:selected').val() == "") {
		graph_type = "column";
	} else {
		graph_type = $('#graph_type option:selected').val();
	}

	$.getJSON("/getXdisplay", params, function(result) {

		Xdisplay = result;
		sync();
	});

	function sync() {
		var options = {
			chart: {
				renderTo: ctn.attr('id'),
				type: graph_type,
				zoomType: 'x'
			},
			title: {
				text: $('#graph_title').val()
			},
			subtitle: {
				text: "Graph - " + (graph_no + 1)
			},
			xAxis: {
				title: {
					text: $('#x_label').val()
				},
				categories: Xdisplay
			},
			yAxis: {
				title: {
					text: $('#y_label').val()
				}
			},
			plotOptions: {
				spline: {
					lineWidth: 1,
					marker: {
						enabled: false,
						states: {
							hover: {
								enabled: true,
								radius: 5
							}
						}
					},
					shadow: false,
					states: {
						hover: {
							lineWidth: 1
						}
					}
				},
				line: {
					lineWidth: 1,
					marker: {
						enabled: false,
						states: {
							hover: {
								enabled: true,
								radius: 5
							}
						}
					},
					shadow: false,
					states: {
						hover: {
							lineWidth: 1
						}
					}
				},
				scatter: {
					marker: {
						radius: 2,
						states: {
							hover: {
								enabled: true,
								radius: 5
							}
						}
					}
				},
				column: {
					lineWidth: 1,
					marker: {
						enabled: false,
						states: {
							hover: {
								enabled: true,
								radius: 5
							}
						}
					},
					shadow: false,
					states: {
						hover: {
							lineWidth: 1
						}
					}
				},
				bar: {
					lineWidth: 1,
					marker: {
						enabled: false,
						states: {
							hover: {
								enabled: true,
								radius: 5
							}
						}
					},
					shadow: false,
					states: {
						hover: {
							lineWidth: 1
						}
					}
				},
				area: {
					fillColor: {
						linearGradient: {
							x1: 0,
							y1: 0,
							x2: 0,
							y2: 1
						},
						stops: [
							[0, Highcharts.getOptions().colors[0]],
							[1, 'rgba(2,0,0,0)']
						]
					},
					lineWidth: 1,
					marker: {
						enabled: false,
						states: {
							hover: {
								enabled: true,
								radius: 5
							}
						}
					},
					shadow: false,
					states: {
						hover: {
							lineWidth: 1
						}
					}
				},
				areaspline: {
					fillColor: {
						linearGradient: {
							x1: 0,
							y1: 0,
							x2: 0,
							y2: 1
						},
						stops: [
							[0, Highcharts.getOptions().colors[0]],
							[1, 'rgba(2,0,0,0)']
						]
					},
					lineWidth: 1,
					marker: {
						enabled: false,
						states: {
							hover: {
								enabled: true,
								radius: 5
							}
						}
					},
					shadow: false,
					states: {
						hover: {
							lineWidth: 1
						}
					}
				}
			},
			credits: {
				enabled: false
			},
			series: []
		};

		// To record all y values
		var yValues = new Array();

		$.getJSON("/getStepFreq", params, function(result) {
			options.series.push(result);
			chart[graph_no] = new Highcharts.Chart(options);

		});

		$('#graph_name').append($('<option></option>').val(graph_no + 1).html("Graph - " + (graph_no + 1)).attr('selected', true));
		$('#graph_name_series').empty();
		$('#graph_name_series').append($('<option></option>').val(1).html("Series - " + 1).attr('selected', true));
		graph_no++;
		ctn.attr('style', 'box-shadow: 10px 10px 5px #888888; margin:10px');
	}
}

var modifyFunc = function() {

	if ($('#percentValue').val() == 'Value' || $('graph_name option:selected').val() == '' || $('#graph_name_series option:selected').val() == '') {
		alert("Please select all the fields");
		return;
	}

	var serieid = $('#graph_name_series option:selected').val();
	var no = $('#graph_name option:selected').val();

	var params = {

		rnaType: jQuery('#rnaType option:selected').val(),

		propertyType: jQuery('#propertyType option:selected').val(),
		propertyName: jQuery('#propertyName option:selected').val(),

		selnuc: jQuery('#selnuc').val(),
		nuc: jQuery('#nuc').val(),
		operation: jQuery('#operation option:selected').val(),
		percentValue: jQuery('#percentValue').val(),

		func: jQuery('#func').val(),

		serieid: serieid,
	};

	$.getJSON("/getColumnData", params, function(result) {

		chart[no].get(serieid).remove();
		chart[no].addSeries(result);
	});
}

var addSeriesFunc = function() {
	if ($('#percentValue').val() == 'Value') {
		alert("Please select all the fields");
		return;
	}

	var serieno = 0;

	var no = $('#graph_name option:selected').val();

	$(chart[no].series).each(function(i, serie) {

		serieno = serie.options.id;

	});

	//       alert("value of flag " + chart[no].get(serieid).options.histogramFlag);

	// if(chart[no].series[serieno].options.histogramFlag){
	//     alert("Please use histogram series edition in place of this");
	//     return;
	// }

	serieno++;

	var params = {

		rnaType: jQuery('#rnaType option:selected').val(),

		propertyType: jQuery('#propertyType option:selected').val(),
		propertyName: jQuery('#propertyName option:selected').val(),

		selnuc: jQuery('#selnuc').val(),
		nuc: jQuery('#nuc').val(),
		operation: jQuery('#operation option:selected').val(),
		percentValue: jQuery('#percentValue').val(),

		func: jQuery('#func').val(),

		serieid: serieno,
	};

	$.getJSON("/getColumnData", params, function(result) {

		$('#graph_name_series').append($('<option></option>').val(serieno).html("Series - " + serieno).attr('selected', true));

		chart[no].addSeries(result);
	});
}

// var addHistogramSeries = function() {
// 	if (($('#percentValue').val() == 'Value') || ($('#stepSize').val() == "Value")) {
// 		alert("Please select all the fields");
// 		return;
// 	}

// 	var no = $('#graph_name option:selected').val();

// 	var best_max = 0,
// 		best_min = 0,
// 		best_step = jQuery('#stepSize').val();

// 	var currentSeriesCount = 0;

// 	var temp = jQuery.extend(true, {}, chart[no]);

// 	$(chart[no].series).each(function(i, serie) {

// 		if (best_max < serie.options.max) {
// 			best_max = serie.options.max;
// 		}

// 		if (1 == 0) {
// 			best_min = serie.options.min;
// 		}

// 		if (best_step > serie.options.step) {
// 			best_step = serie.options.step;
// 		}

// 		if (i != 0 && best_min > serie.options.min) {
// 			best_min = serie.options.min;
// 		}

// 		currentSeriesCount++;

// 		serie.remove();

// 	});

// 	currentSeriesCount++;

// 	var xstring = [];

// 	for (var i = best_min; i < (best_max + best_step); i += best_step) {
// 		xstring.push(parseFloat(i.toFixed(2)) + '-' + parseFloat((i + best_step).toFixed(2)));
// 	}

// 	chart[no].xAxis[0].setCategories();

// 	$('#graph_name_series').empty();


// 	$(temp.series).each(function(i, serie) {

// 		var params = {

// 			rnaType: serie.options.rnaType,

// 			propertyType: serie.options.propertyType,
// 			propertyName: serie.options.propertyName,

// 			selnuc: serie.options.selnuc,
// 			nuc: serie.options.nuc,
// 			operation: serie.options.operation,
// 			percentValue: serie.options.percentValue,

// 			stepSize: best_step,

// 			bestMax: best_max,
// 			bestMin: best_min,

// 			bestFlag: 1,

// 			func: serie.options.func,

// 			serieid: i,
// 		};


// 		$.getJSON("/getStepFreq", params, function(result) {
// 			chart[no].addSeries(result);
// 		});

// 		$('#graph_name_series').append($('<option></option>').val(i).html("Series - " + i).attr('selected', false));
// 	}):

// 	var params = {

// 		rnaType: jQuery('#rnaType option:selected').val(),

// 		propertyType: jQuery('#propertyType option:selected').val(),
// 		propertyName: jQuery('#propertyName option:selected').val(),

// 		selnuc: jQuery('#selnuc').val(),
// 		nuc: jQuery('#nuc').val(),
// 		operation: jQuery('#operation option:selected').val(),
// 		percentValue: jQuery('#percentValue').val(),

// 		stepSize: best_step,

// 		bestMax: best_max,
// 		bestMin: best_min,

// 		bestFlag: 1,

// 		func: jQuery('#func').val(),

// 		serieid: currentSeriesCount,
// 	};

// 	$.getJSON("/getStepFreq", params, function(result) {
// 		chart[no].addSeries(result);
// 	});

// 	$('#graph_name_series').append($('<option></option>').val(currentSeriesCount).html("Series - " + currentSeriesCount).attr('selected', true));
// }

// Add function to remove selected series from selected grah
var removeSeriesFunc = function() {
	if ($('graph_name option:selected').val() == '' || $('#graph_name_series option:selected').val() == '') {
		alert("Please select both graph and series for removal");
		return;
	}

	var serieid = $('#graph_name_series option:selected').val();
	var no = $('#graph_name option:selected').val();

	chart[no].get(serieid).remove();

	$('#graph_name_series option[value=' + serieid + ']').remove();

	var serieno = 0;

	$(chart[no].series).each(function(i, serie) {

		serieno = serie.options.id;

	});

	if (serieno == 0) {

		//There are no series on the graph so remove the graph

		ctn = $('#container' + (no - 1));
		ctn.remove();

		$('#graph_name option[value=' + no + ']').remove();

	}

} // end of remove series

var deleteFunc = function() {

	var no = $('#graph_name option:selected').val();

	ctn = $('#container' + (no - 1));
	ctn.remove();

	$('#graph_name option[value=' + no + ']').remove();

}

// Grapher function end...

$('#rna_class').click(function() {
	var clause = getWhereClause('#rna_class', 'rna_class');
	updateBioDomainBox(clause);
});

$('#biological_domain').click(function() {
	var clause = getWhereClause('#rna_class', 'rna_class');
	clause += ' and ' + getWhereClause('#biological_domain', 'org_type');
	updateOrganismBox(clause);
});

$('#organism').click(function() {
	var clause = getWhereClause('#rna_class', 'rna_class');
	clause += ' and ' + getWhereClause('#biological_domain', 'org_type');
	clause += ' and ' + getWhereClause('#organism', 'org');
	updateNameBox(clause);
});

$('#rna_name').click(function() {
	var clause = getWhereClause('#rna_class', 'rna_class');
	clause += ' and ' + getWhereClause('#biological_domain', 'org_type');
	clause += ' and ' + getWhereClause('#organism', 'org');
	clause += ' and ' + getWhereClause('#rna_name', 'name');
	updateIdBox(clause);
});

//Clear all selection criteria (essentially a refresh of the page, but keep the results
$('#clear_criteria_button').click(function() {
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
$('#search_button').click(function() {

	//pop up loading dialog
	$("#loading_dialog").dialog({
		dialogClass: "no-titlebar",
		modal: true
	});
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

	var columns = 'rnaseq.len, temp.name, temp.orna_id, rnastr.energy, rnastr.mld, rnastr.str_id',
		join_statement = '',
		random_select = '';

	if (selectedRNAType.val() == "all" || selectedRNAType.val() == undefined) {
		alert("please select either orna, srna, or rrna.");
		return;
	} else {
		selectedRNAType.each(function() {
			if ($(this).val() == 'orna') {
				//columns stay as they already are
				join_statement = 'JOIN rnaseq ON orna_seq_id = rnaseq.seq_id' +
					' JOIN rnastr ON rnastr.seq_id = temp.orna_seq_id';
			} else if ($(this).val() == 'srna') {
				//tableString += $(this).val() + ' join orna on (srna_orna_id = orna_id)';
				columns += ', srna_id';
				join_statement = 'JOIN srna on srna_orna_id = temp.orna_id' +
					' JOIN rnaseq ON rnaseq.seq_id = srna.srna_seq_id' +
					' JOIN rnastr ON rnastr.seq_id = srna.srna_seq_id';
			} else if ($(this).val() == 'rrna') {
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
	if (selectedOrg.val() == "all") {
		$("#organism>option").each(function(i, d) {
			if (d.value != "all") {
				selectedOrgValues = selectedOrgValues + ' org = \'' + d.value + '\' or';
			}
		});
	} else {
		selectedOrg.each(function() {
			selectedOrgValues = selectedOrgValues + ' org = \'' + $(this).val() + '\' or';
		});
	}
	selectedOrgValues = selectedOrgValues.substring(0, selectedOrgValues.length - 3);
	selectedOrgValues = selectedOrgValues + ')';

	/*
	var selectedBDValues = [];
    selectedBD.each(function(){
        selectedBDValues.push($(this).val()); 
    });
	*/

	var selectedRNAClassValues = '(';
	if (selectedRNAClass.val() == "all") {
		$("#rna_class>option").each(function(i, d) {
			if (d.value != "all") {
				selectedRNAClassValues = selectedRNAClassValues + ' rna_class = \'' + d.value + '\' or ';
			}
		});
	} else {
		selectedRNAClass.each(function() {
			selectedRNAClassValues = selectedRNAClassValues + ' rna_class = \'' + $(this).val() + '\' or ';
		});
	}
	selectedRNAClassValues = selectedRNAClassValues.substring(0, selectedRNAClassValues.length - 4);
	selectedRNAClassValues = selectedRNAClassValues + ')';


	var selectedRNANameValues = '(';
	if (selectedRNAName.val() == "all") {
		$("#rna_name>option").each(function(i, d) {
			if (d.value != "all") {
				selectedRNANameValues = selectedRNANameValues + ' name = \'' + d.value + '\' or ';
			}
		});
	} else {
		selectedRNAName.each(function() {
			selectedRNANameValues = selectedRNANameValues + ' name = \'' + $(this).val() + '\' or ';
		});
	}
	selectedRNANameValues = selectedRNANameValues.substring(0, selectedRNANameValues.length - 4);
	selectedRNANameValues = selectedRNANameValues + ')';


	var selectedRNAIdValues = '(';
	if (selectedRNAId.val() == "all") {
		$("#rna_id>option").each(function(i, d) {
			if (d.value != "all") {
				selectedRNAIdValues = selectedRNAIdValues + ' orna_id = \'' + d.value + '\' or ';
			}
		});
	} else {
		selectedRNAId.each(function() {
			selectedRNAIdValues = selectedRNAIdValues + ' orna_id = \'' + $(this).val() + '\' or ';
		});
	}
	selectedRNAIdValues = selectedRNAIdValues.substring(0, selectedRNAIdValues.length - 4);
	selectedRNAIdValues = selectedRNAIdValues + ')';

	// ' + columns + '
	var statement = 'SELECT * FROM ' + random_select + ' (SELECT * FROM orna JOIN rnaseq on rnaseq.seq_id = orna_seq_id WHERE 1=1 ';

	if (selectedOrg.val() != undefined) {
		statement = statement + ' AND ' + selectedOrgValues;
	}
	if (selectedRNAClass.val() != undefined) {
		statement = statement + ' AND ' + selectedRNAClassValues;
	}
	if (selectedRNAName.val() != undefined && selectedRNANameValues != ")") {
		statement = statement + ' AND ' + selectedRNANameValues;
	}
	if (selectedRNAId.val() != undefined && selectedRNAIdValues != ")") {
		statement = statement + ' AND ' + selectedRNAIdValues;
	}
	/*statement += ') AS temp JOIN rnaseq ON ' + sequenceString + ' = seq_id' + ' JOIN rnastr'
				+ ' ON rnastr.seq_id = temp.' + sequenceString;*/
	statement += ') AS temp ' + join_statement;



	//Prints each value out from a cell in blocks;
	var totalGroups = $(".adv_group").length;
	var advGroupData = "(";
	$(".adv_group").each(function(indexgroup, d) {
		var advList = [];
		var stringInput = "";
		$(d).children().children().children().each(function(i, d) {
			var addMe = true;
			var value = d.value;
			var part = i % 4;

			stringInput = stringInput + " " + value;
			if (part == 3) {
				if (value == "") {
					addMe = false;
				}
				if (addMe) {
					advList.push(stringInput);
				}
				stringInput = "";
			}
		});
		stringInput = "(";
		$.each(advList, function(i, d) {
			stringInput = stringInput + d;
		});
		stringInput = stringInput + ")";
		//stringInput now contains all the data for this group
		var empty = true;
		if (stringInput != "()") {
			advGroupData += stringInput;
			empty = false;
		}
		if ((indexgroup + 1) != totalGroups) {
			advGroupData += " OR ";
		}
		//if empty remove previous or
		if (empty) {
			advGroupData = advGroupData.substring(0, advGroupData.length - 4);
		}
	});
	advGroupData += ")";

	if ((advGroupData != "(())") && (advGroupData.length > 2)) {
		statement += " AND " + advGroupData;
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
	//console.log(statement);
	//get results!
	var url = '/page1';
	var posting = $.post(
		url, {
			userquery: statement
		},
		function(data) {
			//close loading dialog opened at top of function
			NProgress.done();
			$("#loading_dialog").dialog('close');

			var jsonData = jQuery.parseJSON(JSON.parse(data));
			var table = "<div class=\"row result-table\"><h4><input class=\"result-checkbox\" type=\"checkbox\" id=\"result-checkbox-" + selectNumber + "\" value=" + selectNumber + "><i class=\"chevron-down arrow\" value=\"" + selectNumber + "\"></i>Select Result " + selectNumber + " - " + jsonData.length + " Rows <i class=\"pull-right remove-icon\"  value=\"" + selectNumber + "\"></h4><div id=\"tableFrame" + selectNumber + "\" class=\"resultbox\" ><div id=\"result-" + selectNumber + "\"><table class=\"table table-hover\"><thead><tr>";
			// table+="<th></th>";
			$('input:checkbox:checked').each(function(i, input) {
				table += "<th>" + input.value + "</th>";
			})
			table += "</tr></thead><tbody>";
			//add data into select result
			//var jsonData = jQuery.parseJSON(JSON.parse(data));
			$.each(jsonData, function(key, val) {
				dataToAppend = "<tr value='" + val["str_id"] + "'>" //"<td><input type=\"checkbox\" value='"+val["str_id"]+"'></td>"
				$('input:checkbox:checked').each(function(i, input) {
					var tmp = input.value;
					dataToAppend += "<td>" + val[tmp] + "</td>";
				})
				dataToAppend += "</tr>";
				table += dataToAppend;
			});
			table += "</tbody></table><table class=\"header-fixed\" id=\"header-fixed" + selectNumber + "\"></table></div></div></div>";

			// console.log(table);
			$(table).appendTo('#search-result');
			//console.log(table);
			// var tableId = '#tableFrame'+selectNumber;
			// tableOffset.push($(tableId).offset().top); //push offset top to array
			// var header = $(tableId+" thead").clone().attr("id",function(){return "thead"+selectNumber});
			// $('#header-fixed'+selectNumber).append(header);

			$("body").animate({
				scrollTop: $('#result-' + selectNumber).offset().top
			}, {
				queue: false,
				duration: 800,
				easing: 'swing'
			});
			query_group.push({
				"index": selectNumber,
				"query": statement
			});
			result_group.push({
				"index": selectNumber,
				"data": jsonData
			});
			selectNumber += 1;
		},
		'text'
	);

	return;
});

$('#rna_type').click(function() {
	$("#rrna_properties").prop("checked", false);
	$("#srna_properties").prop("checked", false);
	if ($('#rna_type').val() == "rrna") {
		$("#rrna_properties").prop("checked", true);
	} else if ($('#rna_type').val() == "srna") {
		$("#srna_properties").prop("checked", true);
	}
});

$('#search-result').on('click', 'tr', function() {
	var structureid = $(this).attr("value");
	window.open("/detail?" + structureid, "_blank");
});

// Select properties
$('#select-properties').hide();

$('#select-properties-button').click(function() {
	var display = $('#select-properties').css('display');
	if (display == "none" || display == "hidden") {
		$('#select-properties').show();
	} else {
		$('#select-properties').hide();
	}
});

// Delete Result Table
$(document).on('click', 'i.remove-icon', function() {
	//console.log();
	var index = $(this).attr("value") - 1;
	result_group[index] = 0;
	var parent = $(this).parent().parent();
	parent.animate({
		left: '-1500px'
	}, 700, function() {
		parent.remove();
	})
});

// Show Hide results
$(document).on('click', 'i.arrow', function() {
	$(this).toggleClass('chevron-down chevron-right');
	var table = $(this).parent().parent().children().last();
	table.slideToggle(400, function() {})
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
$(document).on('keypress', '.adv_group .userinput', function() {
	var keypressInput = $(this);
	var lastInputs = []
	$('.adv_group').each(function() {
		lastInputs.push($(this).find('.userinput:last').attr('id'));
	});
	if (lastInputs.indexOf(keypressInput.attr('id')) != -1) {
		$(this).parent().parent().after(advHtml1 + advSearchCount + advHtml2);
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
$(document).on('click', '.or_button', function() {
	$(this).parent().parent().after(orHtml1 + advSearchCount + orHtml2);
	advSearchCount++;
	$(this).replaceWith("<p class='or_text'> OR</p>");
})

// hide result table
$("#plot-tab,#history-tab").click(function() {
	$("#search-result").hide();
});

$("#select-tab").click(function() {
	$("#search-result").show();
});

// top button
$(window).scroll(function() {
	var offsetY = $(window).scrollTop();
	if (offsetY >= 300) {
		$('#top-button').fadeIn(300);
	} else {
		$('#top-button').fadeOut(300);
	}
});

$('#top-button').click(function(event) {
	event.preventDefault();
	$('body').animate({
		scrollTop: 0
	}, {
		duration: 500,
		easing: 'swing'
	});
	return false;
});

$('#plot-button').click(function(event) {
	event.preventDefault();
	plot_group = [];
	$(".result-checkbox").each(function(i, d) {
		if (d.checked) {
			plot_group.push(result_group[d.value - 1]);
		}
	});
	return false;
});

//Grapher actions and functions

$('#operations').live("change", function(e) {
	if ($('#operations option:selected').val() == '1') {
		// "Add Graph" is selected
		addGraphFunc();
		$('#operations').val('0').prop('selected', true);
	} else if ($('#operations option:selected').val() == '2') {
		// "Add Histogram" is selected
		addStepFreqFunc();
		$('#operations').val('0').prop('selected', true);
	} else if ($('#operations option:selected').val() == '3') {
		// "Delete" is selected
		deleteFunc();
		$('#operations').val('0').prop('selected', true);
	} else if ($('#operations option:selected').val() == '4') {
		// "Modify" is selected
		modifyFunc();
		$('#operations').val('0').prop('selected', true);
	} else if ($('#operations option:selected').val() == '5') {
		// "Add Series" is selected
		addSeriesFunc();
		$('#operations').val('0').prop('selected', true);
	} else if ($('#operations option:selected').val() == '6') {
		// "Remove Series" is selected
		removeSeriesFunc();
		$('#operations').val('0').prop('selected', true);
	} else if ($('#operations option:selected').val() == '7') {
		// "Node Average" is selected
		//nodeAverageFunc();
		addHistogramSeries();
		$('#operations').val('0').prop('selected', true);
	} else if ($('#operations option:selected').val() == '8') {
		// "Step Frequency" is selected
		stepFreencyFunc();
		$('#operations').val('0').prop('selected', true);
	} else if ($('#operations option:selected').val() == '9') {
		// "Stepwise plot" is selected
		stepwiseFunc();
		$('#operations').val('0').prop('selected', true);
	}
});

$('#graph_name').live("change", function(e) {

	$('#graph_name_series').empty();

	var graph_no_selected = jQuery('#graph_name option:selected').val();

	$(chart[graph_no_selected].series).each(function(i, serie) {

		$('#graph_name_series').append($('<option></option>').val(serie.options.id).html("Series - " + serie.options.id));

	});
});

$('#propertyType').live("change", function(e) {

	$('#propertyName').empty();

	var params = {
		propertyType: jQuery('#propertyType option:selected').val()
	};

	$.getJSON("/getPropertyName", params, function(result) {
		$.each(result, function(i, obj) {
			$('#propertyName').append($('<option></option>').val(obj).html(obj));
		});
	});

}); // New function to get property name for a property type

function isNumberKeyorDec(evt) {
	var charCode = (evt.which) ? evt.which : event.keyCode
	if (charCode > 31 && charCode != 46 && (charCode < 48 || charCode > 57)) return false;

	return true;
}

//