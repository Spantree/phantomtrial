var express = require('express')
var app = express();

var hello = {
   get: function(req, res){
      var body = "Hello Express from get..!";
      res.setHeader('Content-Type', 'text/plain');
      res.setHeader('Content-Length', body.length);
      res.end(body);
   }
};

var rude = {
   get: function(req, res){
      res.status(200).sendfile('hello.html')
   }
}

alert = {
   get: function(req, res){
      var body = "Some JS";

   }
};

var google = {
   get: function(req, res){
      res.status(200).sendfile('google.png');
   }
};

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

var phantomJsContent = function(theURL, callback){
   var content = '';
   var phantom = require('child_process').spawn(
      '/usr/local/bin/phantomjs',
      ['/usr/local/code/javascript/phantomtrial/phantom-server-includes.js', theURL]
   );
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

// var _underscorejs = {
//    get: function(req, res){
//       var theUrl = 'http://underscorejs.org';
//       phantomContent(theUrl, function(content){
//          res.send(content);
//       })
//    }
// };

var u2rude = {
   get: function(req, res){
      var theUrl = 'http://localhost:3000/rude/'+req.params.name;
      phantomContent(theUrl, function(content){
         res.send(content);
      });
   }
};

var underscorejs = {
   get: function(req, res){
      res.status(200).sendfile('static/underscore.js');
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

var appjs = {
   get: function(req, res){
      res.status(200).sendfile('static/app.js');
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
      //var theUrl = 'http://localhost:8080/uppercut/crawl?eventName='+req.query.eventName;
      //
      var theUrl = 'http://localhost:8080/simple-slab/slab/index?eventName='+req.query.eventName+'&screenSize='+req.query.screenSize;
      phantomContent(theUrl, function(content){
         res.send(content);
      });
   }
};

app.get('/hello', hello.get);
app.get('/rude/:name', rude.get);
app.get('/u2rude/:name', u2rude.get);
app.get('/google', google.get);
app.get('/static/underscore.js', underscorejs.get);
app.get('/simple-slab/static/js/libs/underscore.js', underscorejs.get);
app.get('/static/js/libs/underscore.js', underscorejs.get);
app.get('/simple-slab/static/js/libs/OptimizedSlab.js', optimizedSlab.get);
app.get('/simple-slab/static/js/libs/jquery.slabtext.js', slabText.get);
app.get('/static/js/libs/jquery.slabtext.js', slabText.get);
app.get('/simple-slab/static/js/libs/app.js', appjs.get);
app.get('/static/jquery.js', jqueryjs.get);
app.get('/static/plugins/jquery-1.7.1/js/jquery/jquery-1.7.1.min.js', jqueryjs.get);
app.get('/simple-slab/static/js/libs/jquery.js', jqueryjs.get);
app.get('/static/coffee/uppercut/optimizedSlab.js', optimizedSlab.get);
app.get('/static/optimizedSlab.js', optimizedSlab.get);
app.get('/slab.html', slabHtml.get);
app.get('/slab', slab.get);
app.listen(3000);
