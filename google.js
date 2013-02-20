var page = require('webpage').create();
page.onConsoleMessage = function(msg){
   console.log('Page Title Is ' + msg);
};

page.open('http://www.google.com', function(){
   page.render('google.png');
   var title = page.evaluate(function(){
      return document.title;
   });
   console.log('Page title is ' + title);
   phantom.exit();
});
