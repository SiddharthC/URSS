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

   $('#advanced_graph').live("change", function(e) {
        if($('#advanced_graph option:selected').val() == '1'){
            // Correlate is selected
            if ($('#lower').val() == 'Lower' || $('#upper').val() == 'Upper' || $('#exptID option:selected').val() == '' || $('#exptITR option:selected').val() == '' || $('#nodeID option:selected').val() == '' || $('#resName option:selected').val() == '' || $('#colName option:selected').val() == '') {
                alert("Please select all the fields");
                $('#advanced_graph').val('0').prop('selected', true);
                return;
            }

            x_exptID = $('#exptID option:selected').val();
            x_exptITR = $('#exptITR option:selected').val();
            x_nodeID = $('#nodeID option:selected').val();
            x_resName = $('#resName option:selected').val();
            x_colName = $('#colName option:selected').val();
            x_lower = $('#lower').val();
            x_upper = $('#upper').val();

            alert("Your selected values for x are saved. Please selected values for y and then click 'Add Graph'");

            $('#exptID').empty();
            $('#exptITR').empty();
            $('#nodeID').empty();
            $('#resName').empty();
            $('#colName').empty();
            $('#exptID').append($('<option></option>').html('--Select--').val(''));
            $('#exptITR').append($('<option></option>').html('--Select--').val(''));
            $('#nodeID').append($('<option></option>').html('--Select--').val(''));
            $('#resName').append($('<option></option>').html('--Select--').val(''));
            $('#colName').append($('<option></option>').html('--Select--').val(''));

            jQuery(function() {
                $.getJSON("getExptId", function(result) {
                    var tables = result;
                    var out = "";
                    $.each(result, function(i, obj) {
                        $('#exptID').append($('<option></option>').val(obj.experimentid).html(obj.name));
                    });
                });
            });

            if ($('#func').val() == 'x') {
                $('#func').val('x / y');
            }
        }else{
            $('#func').val('x');
            x_exptID = '';
            x_exptITR = '';
            x_nodeID = '';
            x_resName = '';
            x_colName = '';
            x_lower = '';
            x_upper = '';
        }
    });


   $('#operations').live("change", function(e) {
        if($('#operations option:selected').val() == '1'){
            // "Add Graph" is selected
            addGraphFunc();
            $('#operations').val('0').prop('selected', true);
        }else if($('#operations option:selected').val() == '2'){
            // "Add Dynamic" is selected
            addDynamicFunc();
            $('#operations').val('0').prop('selected', true);
        }else if($('#operations option:selected').val() == '3'){
            // "Delete" is selected
            deleteFunc();
            $('#operations').val('0').prop('selected', true);
        }else if($('#operations option:selected').val() == '4'){
            // "Modify" is selected
            modifyFunc();
            $('#operations').val('0').prop('selected', true);
        }else if($('#operations option:selected').val() == '5'){
            // "Add Series" is selected
            addSeriesFunc();
            $('#operations').val('0').prop('selected', true);
        }else if($('#operations option:selected').val() == '6'){
            // "Remove Series" is selected
            removeSeriesFunc();
            $('#operations').val('0').prop('selected', true);
        }else if($('#operations option:selected').val() == '7'){
            // "Node Average" is selected
            nodeAverageFunc();
            $('#operations').val('0').prop('selected', true);
        }else if($('#operations option:selected').val() == '8'){
            // "Step Frequency" is selected
            stepFreencyFunc();
            $('#operations').val('0').prop('selected', true);
        }
        else if($('#operations option:selected').val() == '9'){
            // "Stepwise plot" is selected
            stepwiseFunc();
            $('#operations').val('0').prop('selected', true);
        }
    });
    var addGraphFunc = function() {
        if ($('#lower').val() == 'Lower' || $('#upper').val() == 'Upper' || $('exptID option:selected').val() == '' || $('#exptITR option:selected').val() == '' || $('#nodeID option:selected').val() == '' || $('#resName option:selected').val() == '' || $('#colName option:selected').val() == '') {
            alert("Please select all the fields");
            return;
        }

        var cumm = 0;

        if($('#advanced_graph option:selected').val() == '2'){
            // Cumulative is selected
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

            x_exptID: x_exptID,
            x_exptITR: x_exptITR,
            x_nodeID: x_nodeID,
            x_resName: x_resName,
            x_colName: x_colName,
            x_lower: x_lower,
            x_upper: x_upper,

            cumm: cumm

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
        
        // To record all y values
        var yValues = new Array();

        if($('#advanced_graph option:selected').val() == '1') {
            // Correlate is selected

            $.getJSON("getColumnDataCorr", params, function(result) {
                options.series.push(result);
                chart[graph_no] = new Highcharts.Chart(options);
            });
        } else {
        	 $.getJSON("getColumnData", params, function(result) {
                options.series.push(result);
                chart[graph_no] = new Highcharts.Chart(options);
                
                /* Draw 3d graph starts*/
                if($('#advanced_graph option:selected').val() == '3'){
                    // 3d option is selected
                    // Insert three-d graph div to the new added two-d graph div first
                    var three_d_id = "Graph-" + graph_no+ "_3d_surfacePlotDiv";
                    ctn = $('#container' + graph_no);
                    ctn.clone().attr('id', three_d_id).insertAfter(ctn);
                    
                    // Start drawing the 3d graph
                    var surfacePlot;
                    // Get max x value as number of rows
                    var numRows =  $('#upper').val();
                    // Get max y value as number of columns. Shrink all y values to be less than 10
                    var numCols =Math.max.apply(Math, result.data);
                    var maxZ = numCols;
                    var yShrink = 1;
                    var temp = numCols;
                    while(temp > 10){
                        temp = temp / 10;
                        yShrink *= 10;
                    }
                    numCols = Math.ceil(numCols / yShrink);
            
                 
                    var tooltipStrings = new Array();
                    var values = new Array();
                    var data = {nRows: numRows, nCols: numCols, formattedValues: values};
                
                    var max = 0;
                    for (var i = 0; i < numRows; i++ ) 
                    {
                        values[i] = new Array(); 
                        var zValue = result.data[i];
                        
                        for (var j = 0; j < numCols; j++)
                        {
                            // Execute the 3d plot function here(current function is f(x,y) = y)
                            // Z value should be transformed to the range from 0 to 1
                            values[i][j] = zValue / (maxZ - 1);
                        }
                    }
                    // Need to update the max Z value if function is changed. 
                    max = i;
                
                    surfacePlot = new SurfacePlot(document.getElementById(three_d_id));
                    
                    // Don't fill polygons in IE. It's too slow.
                    var fillPly = true;
                    
                    // Define a colour gradient.
                    var colour1 = {red:0, green:0, blue:255};
                    var colour2 = {red:0, green:255, blue:255};
                    var colour3 = {red:0, green:255, blue:0};
                    var colour4 = {red:255, green:255, blue:0};
                    var colour5 = {red:255, green:0, blue:0};
                    var colours = [colour1, colour2, colour3, colour4, colour5];
                    
                    // Axis labels.
                    var xAxisHeader = $('#x_label').attr('value');
                    var yAxisHeader = $('#y_label').attr('value');
                    var zAxisHeader = $('#z_label').attr('value');
                    
                    var renderDataPoints = false;
                    var background = '#ffffff';
                    var axisForeColour = '#000000';
                    var hideFloorPolygons = true;
                    var chartOrigin = {x: 150, y:150};
                    
                    // Options for the basic canvas pliot.
                    var basicPlotOptions = {fillPolygons: fillPly, tooltips: tooltipStrings, renderPoints: renderDataPoints }
                    
                    // Options for the webGL plot.
                    var xLabels = new Array();
                    var i = 0;
                    var divide = 1;
                    // Divide x-axis to be pieces with length of 10 or 100
                    if(numRows > 10 && numRows <= 100) divide = 10;
                    if(numRows > 100) divide = 100;
                    for(;i<= numRows/divide ; i++){
                        xLabels[i] = i * divide;
                    }
                
                    if(xLabels[i-1] < numRows){
                        xLabels[i] = numRows;
                    }
            
                    // Divide y-axis to be pieces with length of 10 or 100
                    divide = 1;
                    if(numCols > 10 && numCols <= 100) divide = 10;
                    if(numCols > 100) divide = 100;
                    var yLabels = new Array();
                    for(i=0;i<= numCols/divide ; i++){
                        yLabels[i] = i * divide;
                    }
                
                    if(yLabels[i-1] < numCols){
                        yLabels[i] = numCols;
                    }
                
                    // Divide z-axis to be pieces with length of 10 or 100
                    /*var zLabels = new Array(); // These labels ar eused when autoCalcZScale is false;
                    divide = 1;
                    if(max > 10 && max <= 100) divide = 10;
                    if(max > 100) divide = 100;
                    for(i=0;i<= max/divide ; i++){
                        zLabels[i] = i * divide;
                    }
                
                    if(zLabels[i-1] < max){
                        zLabels[i] = max;
                    }*/

                    divide = 1;
                    if(numCols > 10 && numCols <= 100) divide = 10;
                    if(numCols > 100) divide = 100;
                    var zLabels = new Array();
                    for(i=0;i<= numCols/divide ; i++){
                        zLabels[i] = i * divide;
                    }
                
                    if(zLabels[i-1] < numCols){
                        zLabels[i] = numCols;
                    }


                    
                    var glOptions = {xLabels: xLabels, yLabels: yLabels, zLabels: zLabels, chkControlId: "allowWebGL" ,autoCalcZScale: false};
                    
                    // Options common to both types of plot.
                    var commonOptions = {xPos: 0, yPos: 0, width: $(window).width() - 400, height: 400, colourGradient: colours, 
                        xTitle: xAxisHeader, yTitle: yAxisHeader, zTitle: zAxisHeader, 
                        backColour: background, axisTextColour: axisForeColour, hideFlatMinPolygons: hideFloorPolygons, origin: chartOrigin};
                    
                    surfacePlot.draw(data, commonOptions, basicPlotOptions, glOptions);
                    
                    $('#'+three_d_id).prepend('X: 1:1 ');
                    $('#'+three_d_id).prepend('Y: 1:' + yShrink + ' </br>');
                    $('#'+three_d_id).prepend('Z: 1:1 </br>');
                    $('#'+three_d_id).prepend('3D graph for ' + "'Graph - " + graph_no + "'</br>");
                }
                
                
                /* Draw 3d graph ends*/
            });

        }

        $('#graph_name').append($('<option></option>').val(graph_no + 1).html("Graph - " + (graph_no + 1)).attr('selected', true));
        graph_no++;
        ctn.attr('style', 'box-shadow: 10px 10px 5px #888888; margin:10px');     
      
    }


        // var addDynamicFunc = function() {
        //     if ($('#lower').val() == 'Lower' || $('#upper').val() == 'Upper' || $('exptID option:selected').val() == '' || $('#exptITR option:selected').val() == '' || $('#nodeID option:selected').val() == '' || $('#resName option:selected').val() == '' || $('#colName option:selected').val() == '') {
        //         alert("Please select all the fields");
        //         return;
        //     }
        //     var params = {
        //         exptID: jQuery('#exptID option:selected').val(),
        //         exptITR: jQuery('#exptITR option:selected').val(),
        //         nodeID: jQuery('#nodeID option:selected').val(),
        //         resourceName: jQuery('#resName option:selected').val(),
        //         columnName: jQuery('#colName option:selected').val(),
        //     };

        //     ctn = $('#container' + (graph_no));
        //     ctn.clone().attr('id', 'container' + (graph_no + 1)).insertBefore(ctn);

        //     var options = {
        //         chart: {
        //             renderTo: ctn.attr('id'),
        //             type: $('#graph_type option:selected').val(),
        //             zoomType: 'x'
        //         },
        //         title: {
        //             text: $('#graph_title').val()
        //         },
        //         subtitle: {
        //             text: "Graph - " + (graph_no + 1)
        //         },
        //         xAxis: {
        //             title: {
        //                 text: $('#x_label').val()
        //             }
        //         },
        //         yAxis: {
        //             title: {
        //                 text: $('#y_label').val()
        //             }
        //         },
        //         plotOptions: {
        //             spline: {
        //                 lineWidth: 1,
        //                 marker: {
        //                     enabled: false,
        //                     states: {
        //                         hover: {
        //                             enabled: true,
        //                             radius: 5
        //                         }
        //                     }
        //                 },
        //                 shadow: false,
        //                 states: {
        //                     hover: {
        //                         lineWidth: 1
        //                     }
        //                 }
        //             },
        //             line: {
        //                 lineWidth: 1,
        //                 marker: {
        //                     enabled: false,
        //                     states: {
        //                         hover: {
        //                             enabled: true,
        //                             radius: 5
        //                         }
        //                     }
        //                 },
        //                 shadow: false,
        //                 states: {
        //                     hover: {
        //                         lineWidth: 1
        //                     }
        //                 }
        //             },
        //             scatter: {
        //                 marker: {
        //                     radius: 2,
        //                     states: {
        //                         hover: {
        //                             enabled: true,
        //                             radius: 5
        //                         }
        //                     }
        //                 }
        //             },
        //             column: {
        //                 lineWidth: 1,
        //                 marker: {
        //                     enabled: false,
        //                     states: {
        //                         hover: {
        //                             enabled: true,
        //                             radius: 5
        //                         }
        //                     }
        //                 },
        //                 shadow: false,
        //                 states: {
        //                     hover: {
        //                         lineWidth: 1
        //                     }
        //                 }
        //             },
        //             bar: {
        //                 lineWidth: 1,
        //                 marker: {
        //                     enabled: false,
        //                     states: {
        //                         hover: {
        //                             enabled: true,
        //                             radius: 5
        //                         }
        //                     }
        //                 },
        //                 shadow: false,
        //                 states: {
        //                     hover: {
        //                         lineWidth: 1
        //                     }
        //                 }
        //             },
        //             area: {
        //                 fillColor: {
        //                     linearGradient: {
        //                         x1: 0,
        //                         y1: 0,
        //                         x2: 0,
        //                         y2: 1
        //                     },
        //                     stops: [
        //                         [0, Highcharts.getOptions().colors[0]],
        //                         [1, 'rgba(2,0,0,0)']
        //                     ]
        //                 },
        //                 lineWidth: 1,
        //                 marker: {
        //                     enabled: false,
        //                     states: {
        //                         hover: {
        //                             enabled: true,
        //                             radius: 5
        //                         }
        //                     }
        //                 },
        //                 shadow: false,
        //                 states: {
        //                     hover: {
        //                         lineWidth: 1
        //                     }
        //                 }
        //             },
        //             areaspline: {
        //                 fillColor: {
        //                     linearGradient: {
        //                         x1: 0,
        //                         y1: 0,
        //                         x2: 0,
        //                         y2: 1
        //                     },
        //                     stops: [
        //                         [0, Highcharts.getOptions().colors[0]],
        //                         [1, 'rgba(2,0,0,0)']
        //                     ]
        //                 },
        //                 lineWidth: 1,
        //                 marker: {
        //                     enabled: false,
        //                     states: {
        //                         hover: {
        //                             enabled: true,
        //                             radius: 5
        //                         }
        //                     }
        //                 },
        //                 shadow: false,
        //                 states: {
        //                     hover: {
        //                         lineWidth: 1
        //                     }
        //                 }
        //             }
        //         },
        //         credits: {
        //             enabled: false
        //         },
        //         series: []
        //     };

        //     $.getJSON("getDynamicData", params, function(result) {
        //         options.series.push(result);
        //         // dynamic graph - start
        //         options.chart.events = {
        //             load: function f() {
        //                 f.counter = result.data.length + 1;
        //                 series = this.series[0];
        //                 setInterval(function() {
        //                     var params = {
        //                         exptID: jQuery('#exptID option:selected').val(),
        //                         exptITR: jQuery('#exptITR option:selected').val(),
        //                         nodeID: jQuery('#nodeID option:selected').val(),
        //                         resourceName: jQuery('#resName option:selected').val(),
        //                         columnName: jQuery('#colName option:selected').val(),
        //                         onlyOne: 'true',
        //                     };
        //                     $.getJSON("getDynamicData", params, function(result) {
        //                         series.addPoint([f.counter++, /*754690*/ parseInt(result.data)], true, true);
        //                     });
        //                 }, 1000);

        //             }
        //         };

        //         chart[graph_no] = new Highcharts.Chart(options);
        //     });
        //     $('#graph_name').append($('<option></option>').val(graph_no + 1).html("Graph - " + (graph_no + 1)).attr('selected', true));
        //     graph_no++;
        //     ctn.attr('style', 'box-shadow: 10px 10px 5px #888888; margin:10px');
        // }

        // var nodeAverageFunc = function() {
        //     if ($('#lower').val() == 'Lower' || $('#upper').val() == 'Upper' || $('exptID option:selected').val() == '' || $('#exptITR option:selected').val() == '' || $('#nodeID option:selected').val() == '' || $('#resName option:selected').val() == '' || $('#colName option:selected').val() == '') {
        //         alert("Please select all the fields");
        //         return;
        //     }

        //     var readonly = 1;

        //     var params = {
        //         exptID: jQuery('#exptID option:selected').val(),
        //         exptITR: jQuery('#exptITR option:selected').val(),
        //         nodeID: jQuery('#nodeID option:selected').val(),
        //         resourceName: jQuery('#resName option:selected').val(),
        //         columnName: jQuery('#colName option:selected').val(),

        //         readonly: readonly,
        //     };

        //     ctn = $('#container' + (graph_no));
        //     ctn.clone().attr('id', 'container' + (graph_no + 1)).insertBefore(ctn);

        //     var options = {
        //         chart: {
        //             renderTo: ctn.attr('id'),
        //             type: $('#graph_type option:selected').val(),
        //             zoomType: 'x'
        //         },
        //         title: {
        //             text: $('#graph_title').val()
        //         },
        //         subtitle: {
        //             text: "Graph - " + (graph_no + 1)
        //         },
        //         xAxis: {
        //             title: {
        //                 text: $('#x_label').val()
        //             }
        //         },
        //         yAxis: {
        //             title: {
        //                 text: $('#y_label').val()
        //             }
        //         },
        //         plotOptions: {
        //             spline: {
        //                 pointStart: 1,
        //                 lineWidth: 1,
        //                 marker: {
        //                     enabled: false,
        //                     states: {
        //                         hover: {
        //                             enabled: true,
        //                             radius: 5
        //                         }
        //                     }
        //                 },
        //                 shadow: false,
        //                 states: {
        //                     hover: {
        //                         lineWidth: 1
        //                     }
        //                 }
        //             },
        //             line: {
        //                 pointStart: 1,
        //                 lineWidth: 1,
        //                 marker: {
        //                     enabled: false,
        //                     states: {
        //                         hover: {
        //                             enabled: true,
        //                             radius: 5
        //                         }
        //                     }
        //                 },
        //                 shadow: false,
        //                 states: {
        //                     hover: {
        //                         lineWidth: 1
        //                     }
        //                 }
        //             },
        //             scatter: {
        //                 pointStart: 1,
        //                 marker: {
        //                     radius: 2,
        //                     states: {
        //                         hover: {
        //                             enabled: true,
        //                             radius: 5
        //                         }
        //                     }
        //                 }
        //             },
        //             column: {
        //                 pointStart: 1,
        //                 lineWidth: 1,
        //                 marker: {
        //                     enabled: false,
        //                     states: {
        //                         hover: {
        //                             enabled: true,
        //                             radius: 5
        //                         }
        //                     }
        //                 },
        //                 shadow: false,
        //                 states: {
        //                     hover: {
        //                         lineWidth: 1
        //                     }
        //                 }
        //             },
        //             bar: {
        //                 pointStart: 1,
        //                 lineWidth: 1,
        //                 marker: {
        //                     enabled: false,
        //                     states: {
        //                         hover: {
        //                             enabled: true,
        //                             radius: 5
        //                         }
        //                     }
        //                 },
        //                 shadow: false,
        //                 states: {
        //                     hover: {
        //                         lineWidth: 1
        //                     }
        //                 }
        //             },
        //             area: {
        //                 pointStart: 1,
        //                 fillColor: {
        //                     linearGradient: {
        //                         x1: 0,
        //                         y1: 0,
        //                         x2: 0,
        //                         y2: 1
        //                     },
        //                     stops: [
        //                         [0, Highcharts.getOptions().colors[0]],
        //                         [1, 'rgba(2,0,0,0)']
        //                     ]
        //                 },
        //                 lineWidth: 1,
        //                 marker: {
        //                     enabled: false,
        //                     states: {
        //                         hover: {
        //                             enabled: true,
        //                             radius: 5
        //                         }
        //                     }
        //                 },
        //                 shadow: false,
        //                 states: {
        //                     hover: {
        //                         lineWidth: 1
        //                     }
        //                 }
        //             },
        //             areaspline: {
        //                 pointStart: 1,
        //                 fillColor: {
        //                     linearGradient: {
        //                         x1: 0,
        //                         y1: 0,
        //                         x2: 0,
        //                         y2: 1
        //                     },
        //                     stops: [
        //                         [0, Highcharts.getOptions().colors[0]],
        //                         [1, 'rgba(2,0,0,0)']
        //                     ]
        //                 },
        //                 lineWidth: 1,
        //                 marker: {
        //                     enabled: false,
        //                     states: {
        //                         hover: {
        //                             enabled: true,
        //                             radius: 5
        //                         }
        //                     }
        //                 },
        //                 shadow: false,
        //                 states: {
        //                     hover: {
        //                         lineWidth: 1
        //                     }
        //                 }
        //             }
        //         },
        //         credits: {
        //             enabled: false
        //         },
        //         series: []
        //     };

        //     $.getJSON("getColumnDataForNodeAvg", params, function(result) {
        //         //alert(JSON.stringify(result));
        //         options.series.push(result);
        //         //chart1 = new Highcharts.Chart(result);
        //         //alert(graph_no);
        //         chart[graph_no] = new Highcharts.Chart(options);
        //     });
        //     $('#graph_name').append($('<option></option>').val(graph_no + 1).html("Graph - " + (graph_no + 1)).attr('selected', true));
        //     graph_no++;
        //     ctn.attr('style', 'box-shadow: 10px 10px 5px #888888; margin:10px');
        // }

    // var stepFreencyFunc = function() {
    //     if ($('#step').val() == 'step' || $('#lower').val() == 'Lower' || $('#upper').val() == 'Upper' || $('exptID option:selected').val() == '' || $('#exptITR option:selected').val() == '' || $('#nodeID option:selected').val() == '' || $('#resName option:selected').val() == '' || $('#colName option:selected').val() == '') {
    //         alert("Please select all the fields");
    //         return;
    //     }
    //     var params = {
    //         exptID: jQuery('#exptID option:selected').val(),
    //         exptITR: jQuery('#exptITR option:selected').val(),
    //         nodeID: jQuery('#nodeID option:selected').val(),
    //         resourceName: jQuery('#resName option:selected').val(),
    //         columnName: jQuery('#colName option:selected').val(),

    //         lower: jQuery('#lower').val(),
    //         upper: jQuery('#upper').val(),
    //         func: jQuery('#func').val(),

    //         step: jQuery('#step').val(),
    //     };

    //     ctn = $('#container' + (graph_no));
    //     ctn.clone().attr('id', 'container' + (graph_no + 1)).insertBefore(ctn);

    //     var Xdisplay = [];

    //     $.getJSON("getXdisplay", params, function(result) {

    //         Xdisplay = result;
    //         sync();
    //     });

    //     function sync() {

    //         var options = {
    //             chart: {
    //                 renderTo: ctn.attr('id'),
    //                 type: $('#graph_type option:selected').val(),
    //                 zoomType: 'x'
    //             },
    //             title: {
    //                 text: $('#graph_title').val()
    //             },
    //             subtitle: {
    //                 text: "Graph - " + (graph_no + 1)
    //             },
    //             xAxis: {
    //                 title: {
    //                     text: $('#x_label').val()
    //                 },
    //                 categories: Xdisplay
    //             },
    //             yAxis: {
    //                 title: {
    //                     text: $('#y_label').val()
    //                 }
    //             },
    //             plotOptions: {
    //                 spline: {
    //                     lineWidth: 1,
    //                     marker: {
    //                         enabled: false,
    //                         states: {
    //                             hover: {
    //                                 enabled: true,
    //                                 radius: 5
    //                             }
    //                         }
    //                     },
    //                     shadow: false,
    //                     states: {
    //                         hover: {
    //                             lineWidth: 1
    //                         }
    //                     }
    //                 },
    //                 line: {
    //                     lineWidth: 1,
    //                     marker: {
    //                         enabled: false,
    //                         states: {
    //                             hover: {
    //                                 enabled: true,
    //                                 radius: 5
    //                             }
    //                         }
    //                     },
    //                     shadow: false,
    //                     states: {
    //                         hover: {
    //                             lineWidth: 1
    //                         }
    //                     }
    //                 },
    //                 scatter: {
    //                     marker: {
    //                         radius: 2,
    //                         states: {
    //                             hover: {
    //                                 enabled: true,
    //                                 radius: 5
    //                             }
    //                         }
    //                     }
    //                 },
    //                 column: {
    //                     lineWidth: 1,
    //                     marker: {
    //                         enabled: false,
    //                         states: {
    //                             hover: {
    //                                 enabled: true,
    //                                 radius: 5
    //                             }
    //                         }
    //                     },
    //                     shadow: false,
    //                     states: {
    //                         hover: {
    //                             lineWidth: 1
    //                         }
    //                     }
    //                 },
    //                 bar: {
    //                     lineWidth: 1,
    //                     marker: {
    //                         enabled: false,
    //                         states: {
    //                             hover: {
    //                                 enabled: true,
    //                                 radius: 5
    //                             }
    //                         }
    //                     },
    //                     shadow: false,
    //                     states: {
    //                         hover: {
    //                             lineWidth: 1
    //                         }
    //                     }
    //                 },
    //                 area: {
    //                     fillColor: {
    //                         linearGradient: {
    //                             x1: 0,
    //                             y1: 0,
    //                             x2: 0,
    //                             y2: 1
    //                         },
    //                         stops: [
    //                             [0, Highcharts.getOptions().colors[0]],
    //                             [1, 'rgba(2,0,0,0)']
    //                         ]
    //                     },
    //                     lineWidth: 1,
    //                     marker: {
    //                         enabled: false,
    //                         states: {
    //                             hover: {
    //                                 enabled: true,
    //                                 radius: 5
    //                             }
    //                         }
    //                     },
    //                     shadow: false,
    //                     states: {
    //                         hover: {
    //                             lineWidth: 1
    //                         }
    //                     }
    //                 },
    //                 areaspline: {
    //                     fillColor: {
    //                         linearGradient: {
    //                             x1: 0,
    //                             y1: 0,
    //                             x2: 0,
    //                             y2: 1
    //                         },
    //                         stops: [
    //                             [0, Highcharts.getOptions().colors[0]],
    //                             [1, 'rgba(2,0,0,0)']
    //                         ]
    //                     },
    //                     lineWidth: 1,
    //                     marker: {
    //                         enabled: false,
    //                         states: {
    //                             hover: {
    //                                 enabled: true,
    //                                 radius: 5
    //                             }
    //                         }
    //                     },
    //                     shadow: false,
    //                     states: {
    //                         hover: {
    //                             lineWidth: 1
    //                         }
    //                     }
    //                 }
    //             },
    //             credits: {
    //                 enabled: false
    //             },
    //             series: []
    //         };


    //         $.getJSON("getStepFreq", params, function(result) {
    //             //alert(JSON.stringify(result));
    //             options.series.push(result);
    //             //chart1 = new Highcharts.Chart(result);
    //             //alert(graph_no);
    //             chart[graph_no] = new Highcharts.Chart(options);
    //         });


    //         $('#graph_name').append($('<option></option>').val(graph_no + 1).html("Graph - " + (graph_no + 1)).attr('selected', true));
    //         graph_no++;
    //         ctn.attr('style', 'box-shadow: 10px 10px 5px #888888; margin:10px');

    //     }
    // }

    // var stepwiseFunc = function() {
    //     if ($('#step').val() == 'step' || $('#lower').val() == 'Lower' || $('#upper').val() == 'Upper' || $('exptID option:selected').val() == '' || $('#exptITR option:selected').val() == '' || $('#nodeID option:selected').val() == '' || $('#resName option:selected').val() == '' || $('#colName option:selected').val() == '') {
    //         alert("Please select all the fields");
    //         return;
    //     }
    //     var params = {
    //         exptID: jQuery('#exptID option:selected').val(),
    //         exptITR: jQuery('#exptITR option:selected').val(),
    //         nodeID: jQuery('#nodeID option:selected').val(),
    //         resourceName: jQuery('#resName option:selected').val(),
    //         columnName: jQuery('#colName option:selected').val(),

    //         lower: jQuery('#lower').val(),
    //         upper: jQuery('#upper').val(),
    //         func: jQuery('#func').val(),

    //         step: jQuery('#step').val(),
    //     };

    //     ctn = $('#container' + (graph_no));
    //     ctn.clone().attr('id', 'container' + (graph_no + 1)).insertBefore(ctn);

    //     var Xdisplay = [];

    //     $.getJSON("getXdisplay", params, function(result) {

    //         Xdisplay = result;
    //         sync();
    //     });

    //     function sync() {

    //         var options = {
    //             chart: {
    //                 renderTo: ctn.attr('id'),
    //                 type: $('#graph_type option:selected').val(),
    //                 zoomType: 'y'
    //             },
    //             title: {
    //                 text: $('#graph_title').val()
    //             },
    //             subtitle: {
    //                 text: "Graph - " + (graph_no + 1)
    //             },
    //             xAxis: {
    //                 title: {
    //                     text: $('#x_label').val()
    //                 },
    //                 categories: Xdisplay
    //             },
    //             yAxis: {
    //                 title: {
    //                     text: $('#y_label').val()
    //                 }
    //             },
    //             plotOptions: {
    //                 spline: {
    //                     lineWidth: 1,
    //                     marker: {
    //                         enabled: false,
    //                         states: {
    //                             hover: {
    //                                 enabled: true,
    //                                 radius: 5
    //                             }
    //                         }
    //                     },
    //                     shadow: false,
    //                     states: {
    //                         hover: {
    //                             lineWidth: 1
    //                         }
    //                     }
    //                 },
    //                 line: {
    //                     lineWidth: 1,
    //                     marker: {
    //                         enabled: false,
    //                         states: {
    //                             hover: {
    //                                 enabled: true,
    //                                 radius: 5
    //                             }
    //                         }
    //                     },
    //                     shadow: false,
    //                     states: {
    //                         hover: {
    //                             lineWidth: 1
    //                         }
    //                     }
    //                 },
    //                 scatter: {
    //                     marker: {
    //                         radius: 2,
    //                         states: {
    //                             hover: {
    //                                 enabled: true,
    //                                 radius: 5
    //                             }
    //                         }
    //                     }
    //                 },
    //                 column: {
    //                     lineWidth: 1,
    //                     marker: {
    //                         enabled: false,
    //                         states: {
    //                             hover: {
    //                                 enabled: true,
    //                                 radius: 5
    //                             }
    //                         }
    //                     },
    //                     shadow: false,
    //                     states: {
    //                         hover: {
    //                             lineWidth: 1
    //                         }
    //                     }
    //                 },
    //                 bar: {
    //                     lineWidth: 1,
    //                     marker: {
    //                         enabled: false,
    //                         states: {
    //                             hover: {
    //                                 enabled: true,
    //                                 radius: 5
    //                             }
    //                         }
    //                     },
    //                     shadow: false,
    //                     states: {
    //                         hover: {
    //                             lineWidth: 1
    //                         }
    //                     }
    //                 },
    //                 area: {
    //                     fillColor: {
    //                         linearGradient: {
    //                             x1: 0,
    //                             y1: 0,
    //                             x2: 0,
    //                             y2: 1
    //                         },
    //                         stops: [
    //                             [0, Highcharts.getOptions().colors[0]],
    //                             [1, 'rgba(2,0,0,0)']
    //                         ]
    //                     },
    //                     lineWidth: 1,
    //                     marker: {
    //                         enabled: false,
    //                         states: {
    //                             hover: {
    //                                 enabled: true,
    //                                 radius: 5
    //                             }
    //                         }
    //                     },
    //                     shadow: false,
    //                     states: {
    //                         hover: {
    //                             lineWidth: 1
    //                         }
    //                     }
    //                 },
    //                 areaspline: {
    //                     fillColor: {
    //                         linearGradient: {
    //                             x1: 0,
    //                             y1: 0,
    //                             x2: 0,
    //                             y2: 1
    //                         },
    //                         stops: [
    //                             [0, Highcharts.getOptions().colors[0]],
    //                             [1, 'rgba(2,0,0,0)']
    //                         ]
    //                     },
    //                     lineWidth: 1,
    //                     marker: {
    //                         enabled: false,
    //                         states: {
    //                             hover: {
    //                                 enabled: true,
    //                                 radius: 5
    //                             }
    //                         }
    //                     },
    //                     shadow: false,
    //                     states: {
    //                         hover: {
    //                             lineWidth: 1
    //                         }
    //                     }
    //                 }
    //             },
    //             credits: {
    //                 enabled: false
    //             },
    //             series: []
    //         };


    //         $.getJSON("getStepPlot", params, function(result) {
    //             //alert(JSON.stringify(result));
    //             options.series.push(result);
    //             //chart1 = new Highcharts.Chart(result);
    //             //alert(graph_no);
    //             chart[graph_no] = new Highcharts.Chart(options);
    //         })

    //         $('#graph_name').append($('<option></option>').val(graph_no + 1).html("Graph - " + (graph_no + 1)).attr('selected', true));
    //         graph_no++;
    //         ctn.attr('style', 'box-shadow: 10px 10px 5px #888888; margin:10px');

    //     }
    // }


    var modifyFunc = function() {
        if ($('#lower').val() == 'Lower' || $('#upper').val() == 'Upper' || $('exptID option:selected').val() == '' || $('#exptITR option:selected').val() == '' || $('#nodeID option:selected').val() == '' || $('#resName option:selected').val() == '' || $('#colName option:selected').val() == '') {
            alert("Please select all the fields");
            return;
        }

        var cumm = 0;

        if($('#advanced_graph option:selected').val() == '2') {
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
        if ($('#lower').val() == 'Lower' || $('#upper').val() == 'Upper' || $('exptID option:selected').val() == '' || $('#exptITR option:selected').val() == '' || $('#nodeID option:selected').val() == '' || $('#resName option:selected').val() == '' || $('#colName option:selected').val() == '') {
            alert("Please select all the fields");
            return;
        }

        var cumm = 0;

        if($('#advanced_graph option:selected').val() == '2') {
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
/*** functions to handle modifications of the elements of the html ***/
// populate the experiment id combobox on page load
// jQuery(function() {
//     $.getJSON("getExptId", function(result) {
//         var tables = result;
//         var out = "";
//         $.each(result, function(i, obj) {
//             $('#exptID').append($('<option></option>').val(obj.experimentid).html(obj.name));
//         });
//     });
// });

// jquery's live tells to add the handler to current element or a future element with id=xxxxxxxxx 
// $('#exptID').live("change", function(e) {
//     $('#exptITR').empty();
//     $('#nodeID').empty();
//     $('#resName').empty();
//     $('#colName').empty();
//     $('#exptITR').append($('<option></option>').html('--Select--').val(''));
//     $('#nodeID').append($('<option></option>').html('--Select--').val(''));
//     $('#resName').append($('<option></option>').html('--Select--').val(''));
//     $('#colName').append($('<option></option>').html('--Select--').val(''));

//     $.getJSON("getExptItr", jQuery(this).val(), function(result) {
//         $.each(result, function(i, obj) {
//             $('#exptITR').append($('<option></option>').val(obj).html(obj));
//         });
//     });

//     $.getJSON("getNodeId", jQuery(this).val(), function(result) {
//         $.each(result, function(i, obj) {
//             //alert(i + " " + obj);
//             $('#nodeID').append($('<option></option>').val(obj.id).html(obj.name));
//         });
//     });

// }); // end of change
// $('#nodeID').live("change", function(e) {

//     $('#resName').empty();
//     $('#colName').empty();
//     $('#resName').append($('<option></option>').html('--Select--').val(''));
//     $('#colName').append($('<option></option>').html('--Select--').val(''));

//     var params = {
//         exptID: jQuery('#exptID option:selected').val(),
//         exptITR: jQuery('#exptITR option:selected').val(),
//         nodeID: jQuery(this).val()
//     };

//     $.getJSON("getResourceName", params, function(result) {
//         $.each(result, function(i, obj) {
//             $('#resName').append($('<option></option>').val(obj).html(obj));
//         });
//     });

// }); // end of change
// $('#resName').live("change", function(e) {

//     $('#colName').empty();
//     $('#colName').append($('<option></option>').html('--Select--').val(''));

//     var params = {
//         exptID: jQuery('#exptID option:selected').val(),
//         exptITR: jQuery('#exptITR option:selected').val(),
//         nodeID: jQuery('#nodeID option:selected').val(),
//         resourceName: jQuery(this).val()
//     };

//     $.getJSON("getColumnName", params, function(result) {
//         $.each(result, function(i, obj) {
//             $('#colName').append($('<option></option>').val(obj).html(obj));
//         });
//     });

// }); // end of change
//Change event for field "Series". Auto-completion when all fields "Experiment Name", "iteration", "Node name", "Resources" and "Series" are selected.
// $('#colName').live("change", function(e) {
//     //Validate all required fields are selected
//     if ($('exptID option:selected').val() == '' || $('#exptITR option:selected').val() == '' || $('#nodeID option:selected').val() == '' || $('#resName option:selected').val() == '' || $('#colName option:selected').val() == '') {
//         return;
//     }

//     //If all required fields are selected, auto-fill "Lower" and "Upper" Range. 
//     var params = {
//         //added for upper data
//         exptID: jQuery('#exptID option:selected').val(),
//         exptITR: jQuery('#exptITR option:selected').val(),
//         nodeID: jQuery('#nodeID option:selected').val(),
//         resourceName: jQuery('#resName option:selected').val(),
//     };

//     $.getJSON("getUpper", params, function(result) {
//         $('#upper').val(result);
//     });

//     $.getJSON("getLower", params, function(result) {
//         $('#lower').val(result);
//     });

// }); // end of change

function isNumberKey(evt) {
    var charCode = (evt.which) ? evt.which : event.keyCode
    if (charCode > 31 && (charCode < 48 || charCode > 57)) return false;

    return true;
}



