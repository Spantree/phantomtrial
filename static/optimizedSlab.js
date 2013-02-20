(function() {

  window.optimizeSwipe = function(element) {
    var $offscreen, $slider, adjustLineHeight, optimizedSlabText, padding, textHeight, windowHeight;
    windowHeight = $(window).height();
    padding = 10;
    textHeight = windowHeight - padding * 2;
    $offscreen = $("div.offscreen");
    $slider = $("#" + element);
    $slider.css({
      height: "" + windowHeight + "px"
    });
    window.newOffscreenElement = function($oldEl) {
      var el, width;
      el = $("<span/>");
      console.log("offscreen el: ", el);
      el.html($oldEl.html());
      width = $oldEl.css('width');
      $offscreen.css({
        position: "absolute",
        top: "0px",
        left: "" + ($(window).width() + 1000) + "px",
        display: "block"
      });
      el.css({
        width: "" + width + "px"
      });
      $offscreen.append(el);
      console.log("appended el: ", el);
      return el;
    };
    adjustLineHeight = function($el, elHeight, availableHeight) {
      var heights, leftover, lineRatio, lines, newTotalHeight, perLineHeight, totalHeight;
      lines = $('span.slabtext', $el);
      totalHeight = 0;
      heights = [];
      lines.each(function(i, line) {
        var height;
        height = $(line).height();
        heights.push(height);
        return totalHeight += height;
      });
      leftover = availableHeight - totalHeight;
      perLineHeight = leftover / lines.length;
      lineRatio = lines.length / (lines.length + 3);
      newTotalHeight = 0;
      lines.each(function(i, line) {
        var height, isLastLine, newHeight;
        isLastLine = i >= (lines.length - 1);
        height = heights[i];
        newHeight = Math.round(height / totalHeight * availableHeight * lineRatio);
        newHeight = Math.max(height, newHeight);
        $(line).css({
          "line-height": "" + newHeight + "px"
        });
        return newTotalHeight += newHeight;
      });
      leftover = availableHeight - newTotalHeight;
      padding = "" + (Math.round(leftover / 2)) + "px";
      return $el.css({
        "padding-top": padding
      });
    };
    optimizedSlabText = function(options) {
      var $el, $newEl, availableHeight, calculatedHeights, done, elId, lastHtml, maxRatio, maxTries, midRatio, minRatio, newHeight, originalHtml, threshold, tries, _ref;
      $offscreen.css({
        width: $("#" + element).css('width')
      });
      console.log("############# optimizedSlabText ###################");
      console.log("options.el: ", $(options.el).html());
      $el = $(options.el);
      console.log("$el: ", $el.html());
      elId = (_ref = $el.attr("id")) != null ? _ref : _.uniqueId("li-");
      originalHtml = $el.html();
      lastHtml = null;
      minRatio = options.minRatio;
      maxRatio = options.maxRatio;
      availableHeight = options.availableHeight;
      threshold = options.threshold;
      maxTries = options.maxTries;
      tries = 0;
      done = false;
      calculatedHeights = [];
      newHeight = null;
      while (minRatio < maxRatio && tries++ < maxTries && !done) {
        midRatio = (minRatio + maxRatio) / 2;
        $newEl = newOffscreenElement($el);
        $newEl.slabText({
          fontRatio: midRatio,
          postTweak: false
        });
        newHeight = $newEl.height();
        calculatedHeights.push(newHeight);
        if (newHeight === availableHeight) {
          lastHtml = $newEl.html();
          done = true;
        } else if (newHeight < availableHeight) {
          minRatio += threshold;
          lastHtml = $newEl.html();
        } else if (newHeight > availableHeight) {
          maxRatio -= threshold;
        }
        $newEl.remove();
      }
      if (lastHtml) {
        $el.html(lastHtml);
      }
      adjustLineHeight($el, newHeight, windowHeight);
      console.log("showing el: ", $el);
      return $el.show();
    };
    return $("#" + element).each(function(i, el) {
      console.log("i: ", i);
      console.log("el: ", $(el).html());
      return optimizedSlabText({
        el: el,
        minRatio: 0.4,
        maxRatio: 1.65,
        availableHeight: textHeight,
        threshold: 0.2,
        maxTries: 10
      });
    });
  };

  window.getQueryString = function(paramName) {
    var parameterName, queryItems, queryString, variable, _i, _len;
    queryString = window.location.search.split('?')[1];
    queryItems = queryString.split('&');
    for (_i = 0, _len = queryItems.length; _i < _len; _i++) {
      variable = queryItems[_i];
      parameterName = variable.split('=');
      if (parameterName[0] === paramName) {
        return decodeURIComponent(parameterName[1]);
      }
    }
  };

  window.appendToElement = function(eventName) {
    if (eventName) {
      $("<span>" + eventName + "</span>").appendTo("#480x208");
      $("<span>" + eventName + "</span>").appendTo("#320x356");
    }
  };

  window.startSlabbing = function() {
    var eventName;
    eventName = getQueryString("eventName");
    appendToElement(eventName);
    optimizeSwipe("480x208");
    return optimizeSwipe("320x356");
  };

  /*  _.delay(->
      optimizeSwipe("480x208")
      optimizeSwipe("320x356")
    , 100)
  */


}).call(this);
