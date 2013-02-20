var page = require('webpage').create();
var system = require('system');

page.onLoadFinished = function(status){
	console.log(page.content);
	phantom.exit();
};

page.open(system.args[1], function(){});
