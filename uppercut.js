var express = require('express')
var app = express();

var phantomContent = function(theURL, callback){
   var content = '';
   var phantom = require('child_process').spawn(
      '/usr/local/bin/phantomjs',
      ['/usr/local/code/javascript/phantomtrial/phantom-server.js', theURL]
   );
   phantom.stdout.setEncoding('utf8');
   phantom.stdout.on('data', function(data){
      content += data.toString();
   });
   phantom.on('exit', function(code) {
      if(code != 0){
         console.log('We have an error');
      }else{
         callback(content)
      }
   });

};


var underscorejs = {
   get: function(req, res){
      res.status(200).sendfile('static/underscore.js');
   }
};

var underscoreStringjs = {
   get: function(req, res){
      res.status(200).sendfile('static/underscore.string.js');
   }
};

var jqueryjs = {
   get: function(req, res){
      res.status(200).sendfile('static/jquery.js');
   }
};

var optimizedSlab = {
   get: function(req, res){
      res.status(200).sendfile('static/optimizedSlab.js');
   }
};

var slabHtml = {
   get: function(req, res){
      res.status(200).sendfile('slab.html');
   }
};

var slabText = {
   get: function(req, res){
      res.status(200).sendfile('static/jquery.slabtext.js');
   }
};

var slab = {
   get: function(req, res){
      var theUrl = 'http://localhost:8080/uppercut/crawl?eventName='+req.query.eventName;
      phantomContent(theUrl, function(content){
         res.send(content);
      });
   }
};

app.get('/static/js/libs/underscore.js', underscorejs.get);
app.get('/static/js/libs/underscore.string.js', underscoreStringjs.get);
app.get('/static/js/libs/jquery.slabtext.js', slabText.get);
app.get('/static/jquery.js', jqueryjs.get);
app.get('/static/js/libs/jquery.js', jqueryjs.get);
app.get('/static/coffee/uppercut/optimizedSlab.js', optimizedSlab.get);
app.get('/static/optimizedSlab.js', optimizedSlab.get);
app.get('/slab', slab.get);
app.listen(3001);
