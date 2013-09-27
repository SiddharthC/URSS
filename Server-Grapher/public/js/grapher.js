/**************************************************************************/

var graph_no = 0;

var x_exptID, x_exptITR, x_nodeID, x_resName, x_colName, x_upper, x_lower;

var chart = []; // globally available
// gets called when the complete document loads
$(document).ready(function() {

    //for help window
    $('.fancybox').fancybox();

    $(".fancybox-effects-d").fancybox({
        padding: 0,

        wrapCSS: 'fancybox-custom',
        closeClick: true,

        openEffect: 'elastic',
        openSpeed: 150,

        closeEffect: 'elastic',
        closeSpeed: 150,

        helpers: {
            overlay: {
                css: {
                    'background': 'rgba(238,238,238,0.85)'
                }
            }

        }
    });

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

        $.getJSON("getColumnData", params, function(result) {
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

        $.getJSON("getXdisplay", params, function(result) {

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

            $.getJSON("getStepFreq", params, function(result) {
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

        $.getJSON("getColumnData", params, function(result) {

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

        $.getJSON("getColumnData", params, function(result) {

            $('#graph_name_series').append($('<option></option>').val(serieno).html("Series - " + serieno).attr('selected', true));

            chart[no].addSeries(result);
        });
    }

    var addHistogramSeries = function() {
        if (($('#percentValue').val() == 'Value') || ($('#stepSize').val() == "Value")) {
            alert("Please select all the fields");
            return;
        }

        var no = $('#graph_name option:selected').val();

        var best_max = 0,
            best_min = 0,
            best_step = jQuery('#stepSize').val();

        var currentSeriesCount = 0;

        var temp = jQuery.extend(true, {}, chart[no]);

        $(chart[no].series).each(function(i, serie) {

            if (best_max < serie.options.max) {
                best_max = serie.options.max;
            }

            if (1 == 0) {
                best_min = serie.options.min;
            }

            if (best_step > serie.options.step) {
                best_step = serie.options.step;
            }

            if (i != 0 && best_min > serie.options.min) {
                best_min = serie.options.min;
            }

            currentSeriesCount++;

            serie.remove();

        });

        currentSeriesCount++;

        var xstring = [];

        for (var i = best_min; i < (best_max + best_step); i += best_step) {
            xstring.push(parseFloat(i.toFixed(2)) + '-' + parseFloat((i + best_step).toFixed(2)));
        }

        chart[no].xAxis[0].setCategories();

        $('#graph_name_series').empty();


        $(temp.series).each(function(i, serie) {

            var params = {

                rnaType: serie.options.rnaType,

                propertyType: serie.options.propertyType,
                propertyName: serie.options.propertyName,

                selnuc: serie.options.selnuc,
                nuc: serie.options.nuc,
                operation: serie.options.operation,
                percentValue: serie.options.percentValue,

                stepSize: best_step,

                bestMax: best_max,
                bestMin: best_min,

                bestFlag: 1,

                func: serie.options.func,

                serieid: i,
            };


            $.getJSON("getStepFreq", params, function(result) {
                chart[no].addSeries(result);
            });

            $('#graph_name_series').append($('<option></option>').val(i).html("Series - " + i).attr('selected', false));
        }):

        var params = {

            rnaType: jQuery('#rnaType option:selected').val(),

            propertyType: jQuery('#propertyType option:selected').val(),
            propertyName: jQuery('#propertyName option:selected').val(),

            selnuc: jQuery('#selnuc').val(),
            nuc: jQuery('#nuc').val(),
            operation: jQuery('#operation option:selected').val(),
            percentValue: jQuery('#percentValue').val(),

            stepSize: best_step,

            bestMax: best_max,
            bestMin: best_min,

            bestFlag: 1,

            func: jQuery('#func').val(),

            serieid: currentSeriesCount,
        };

        $.getJSON("getStepFreq", params, function(result) {
            chart[no].addSeries(result);
        });

        $('#graph_name_series').append($('<option></option>').val(currentSeriesCount).html("Series - " + currentSeriesCount).attr('selected', true));
    }

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

}); // end of document.ready

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

    $.getJSON("getPropertyName", params, function(result) {
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