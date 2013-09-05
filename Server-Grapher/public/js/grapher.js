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
            nodeAverageFunc();
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
            graph_no++;
            ctn.attr('style', 'box-shadow: 10px 10px 5px #888888; margin:10px');
        }
    }

    var modifyFunc = function() {
        if ($('#lower').val() == 'Lower' || $('#upper').val() == 'Upper' || $('exptID option:selected').val() == '' || $('#exptITR option:selected').val() == '' || $('#nodeID option:selected').val() == '' || $('#resName option:selected').val() == '' || $('#colName option:selected').val() == '') {
            alert("Please select all the fields");
            return;
        }

        var cumm = 0;

        if ($('#advanced_graph option:selected').val() == '2') {
            cumm = 1;
        }

        var params = {
            exptID: jQuery('#exptID option:selected').val(),
            exptITR: jQuery('#exptITR option:selected').val(),
            nodeID: jQuery('#nodeID option:selected').val(),
            resourceName: jQuery('#resName option:selected').val(),
            columnName: jQuery('#colName option:selected').val(),
            lower: jQuery('#lower').val(),
            upper: jQuery('#upper').val(),
            func: jQuery('#func').val(),

            cumm: cumm
        };

        var no = $('#graph_name option:selected').val();

        ctn = $('#container' + (no - 1));

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
                text: "Graph - " + no
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
                    pointStart: parseInt($('#lower').val()),
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
                    pointStart: parseInt($('#lower').val()),
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
                    pointStart: parseInt($('#lower').val()),
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
                    pointStart: parseInt($('#lower').val()),
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
                    pointStart: parseInt($('#lower').val()),
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
                    pointStart: parseInt($('#lower').val()),
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
                    pointStart: parseInt($('#lower').val()),
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

        $.getJSON("getColumnData", params, function(result) {
            options.series.push(result);

            var no = $('#graph_name option:selected').val();
            chart[no] = new Highcharts.Chart(options);
            ctn.attr('style', 'box-shadow: 10px 10px 5px #888888; margin: 10px');
        });
    }

    var addSeriesFunc = function() {
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
        };

            $.getJSON("getColumnData", params, function(result) {
            var no = $('#graph_name option:selected').val();
            chart[no].addSeries(result);
        });
    }

    // Add function to remove selected series from selected grah
    var removeSeriesFunc = function() {
        if ($('exptID option:selected').val() == '' || $('#exptITR option:selected').val() == '' || $('#nodeID option:selected').val() == '' || $('#resName option:selected').val() == '' || $('#colName option:selected').val() == '') {
            alert("Please select all the fields");
            return;
        }

        var exptID = jQuery('#exptID option:selected').val();
        var exptITR = jQuery('#exptITR option:selected').val();
        var nodeID = jQuery('#nodeID option:selected').val();
        var resourceName = jQuery('#resName option:selected').val();
        var columnName = jQuery('#colName option:selected').val();
        var serieid = exptID + '.' + exptITR + '.' + nodeID + '.' + resourceName + '.' + columnName;
        var no = $('#graph_name option:selected').val();

        chart[no].get(serieid).remove();

    } // end of remove series
    var deleteFunc = function() {

        var no = $('#graph_name option:selected').val();

        ctn = $('#container' + (no - 1));
        ctn.remove();

        $('#graph_name option[value=' + no + ']').remove()

    }

}); // end of document.ready

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