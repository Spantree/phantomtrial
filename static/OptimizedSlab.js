// Generated by CoffeeScript 1.4.0
var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

(function(app, context) {
  return context.OptimizedSlab = (function() {

    function OptimizedSlab() {
      this.optimizeSwipe = __bind(this.optimizeSwipe, this);

      this.optimizedSlabText = __bind(this.optimizedSlabText, this);
      this.optimizedSlabText = _.bind(this.optimizedSlabText, this);
    }

    OptimizedSlab.prototype.optimizedSlabText = function(options) {
      var $el, $newEl, availableHeight, calculatedHeights, done, elId, lastHtml, maxRatio, maxTries, midRatio, minRatio, newHeight, originalHtml, threshold, tries, _ref, _results;
      this.$offscreen.css({
        width: $('#slider').css('width')
      });
      $el = $(options.el);
      elId = (_ref = $el.attr('id')) != null ? _ref : _.uniqueId("li-");
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
      _results = [];
      while (minRatio < maxRatio && tries++ < maxTries && !done) {
        midRatio = (minRatio + maxRatio) / 2;
        $newEl = this.newOffscreenElement($el);
        $newEl.slabText({
          fontRatio: midRatio,
          postTweak: false
        });
        newHeight = $newEl.height();
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
        if (lastHtml) {
          $el.html(lastHtml);
        }
        this.adjustLineHeight($el, newHeight, this.windowHeight);
        _results.push($el.show());
      }
      return _results;
    };

    OptimizedSlab.prototype.adjustLineHeight = function($el, elHeight, availableHeight) {
      var heights, leftover, lineRatio, lines, newTotalHeight, padding, perLineHeight, totalHeight;
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

    OptimizedSlab.prototype.newOffscreenElement = function($oldEl) {
      var el, width;
      el = $("<li/>");
      el.html($oldEl.html());
      width = $oldEl.css('width');
      this.$offscreen.css({
        position: "absolute",
        top: "0px",
        left: "" + ($(window).width() + 100) + "px",
        display: "block"
      });
      el.css({
        width: "" + width + "px"
      });
      this.$offscreenUl.append(el);
      return el;
    };

    OptimizedSlab.prototype.renderSlab = function(el, textHeight) {
      return this.optimizedSlabText({
        el: el,
        minRatio: 0.4,
        maxRatio: 1.65,
        availableHeight: textHeight,
        threshold: 0.2,
        maxTries: 10
      });
    };

    OptimizedSlab.prototype.optimizeSwipe = function(indexOfFirstItem, pageSize) {
      var $slider, el, padding, textHeight, totalElementsToRender, _i, _len, _ref, _results;
      console.log("starting to optimize at: ", indexOfFirstItem);
      if (pageSize > 5) {
        pageSize = 5;
      }
      this.windowHeight = $(window).height();
      padding = 10;
      textHeight = this.windowHeight - padding * 2;
      this.$offscreen = $('div.offscreen');
      this.$offscreenUl = $('ul', this.$offscreen);
      $slider = $('#slider');
      $slider.css({
        height: "" + this.windowHeight + "px"
      });
      totalElementsToRender = pageSize + indexOfFirstItem;
      _ref = $('#slider li').slice(indexOfFirstItem, totalElementsToRender);
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        el = _ref[_i];
        _results.push(this.renderSlab(el, textHeight));
      }
      return _results;
    };

    return OptimizedSlab;

  })();
})(app, app.module('optimizedSlab'));
