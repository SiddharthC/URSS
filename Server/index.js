var server = require("./server");
var router = require("./router");
var requestHandlers = require("./requestHandlers");

var handle = {}
handle["/"] = requestHandlers.elbaVisualization;
handle["/start"] = requestHandlers.elbaVisualization;
// handle["/getExptId"] = requestHandlers.getExptId;
// handle["/getExptItr"] = requestHandlers.getExptItr;
// handle["/getNodeId"] = requestHandlers.getNodeId;
// handle["/getResourceName"] = requestHandlers.getResourceName;
// handle["/getColumnName"] = requestHandlers.getColumnName;
// handle["/getUpper"] = requestHandlers.getUpper;
// handle["/getLower"] = requestHandlers.getLower;
handle["/getPropertyName"] = requestHandlers.getPropertyName;
handle["/getColumnData"] = requestHandlers.getColumnData;
handle["/getStepFreq"] = requestHandlers.getStepFreq;
// handle["/getColumnDataCorr"] = requestHandlers.getColumnDataCorr;
// handle["/getColumnDataForNodeAvg"] = requestHandlers.getColumnDataForNodeAvg;
// handle["/getDynamicData"] = requestHandlers.getDynamicData;
// handle["/getStepFreq"] = requestHandlers.getStepFreq;
// handle["/getStepPlot"] = requestHandlers.getStepPlot;
handle["/getXdisplay"] = requestHandlers.getXdisplay;
handle["/*.js"] = requestHandlers.serveFileJS;
handle["/*.css"] = requestHandlers.serveFileCSS;
handle["/image"] = requestHandlers.serveFileImage;

server.start(router.route, handle);
