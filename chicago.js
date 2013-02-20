var page = require('webpage').create();
page.onConsoleMessage = function(msg){
   console.log('Page Title Is ' + msg);
};

page.open('http://chicago.com', function(){
   page.render('chicago.png');
   var title = page.evaluate(function(){
      return document.title;
   });
   console.log('page title is ' + title);
   phantom.exit();
});
