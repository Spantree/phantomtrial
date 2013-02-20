window.optimizeSwipe = (element)->
    windowHeight = $(window).height()
    padding = 10
    textHeight = windowHeight - padding*2
    $offscreen = $("div.offscreen")
    #$offscreenUl = $('ul', $offscreen)
    $slider = $("##{element}")
    $slider.css
      height: "#{windowHeight}px"

    window.newOffscreenElement = ($oldEl) ->
        el = $("<span/>")
        console.log "el: ", el
        el.html($oldEl.html())
        width = $oldEl.css('width')
        $offscreen.css
          position: "absolute"
          top: "0px"
          left: "#{$(window).width()+ 1000}px"
          display: "block"
        el.css
           width: "#{width}px"
        $offscreen.append(el)
        console.log "appended el: ", el
        el

    adjustLineHeight = ($el, elHeight, availableHeight) ->
      lines = $('span.slabtext', $el)
      totalHeight = 0
      heights = []
      lines.each (i, line) ->
        height = $(line).height()
        heights.push height
        totalHeight += height
      leftover = availableHeight - totalHeight
      perLineHeight = leftover / lines.length
      lineRatio = lines.length / (lines.length + 3)
      newTotalHeight = 0
      lines.each (i, line) ->
        isLastLine = (i >= (lines.length - 1))
        height = heights[i]
        newHeight = Math.round(height / totalHeight * availableHeight * lineRatio)
        newHeight = Math.max(height, newHeight)
        $(line).css
          "line-height": "#{newHeight}px"
        newTotalHeight += newHeight
      leftover = availableHeight - newTotalHeight
      padding = "#{Math.round(leftover/2)}px"
      $el.css
          "padding-top": padding

    optimizedSlabText = (options) ->
        $offscreen.css
          width: $("##{element}").css('width')
        $el = $(options.el)
        elId = $el.attr("id") ? _.uniqueId("li-")
        originalHtml = $el.html()
        # console.log "originalHtml", originalHtml
        lastHtml = null
        minRatio = options.minRatio
        maxRatio = options.maxRatio
        availableHeight = options.availableHeight
        threshold = options.threshold
        maxTries = options.maxTries

        tries = 0
        done = false
        # console.log "word length: #{$el.text().length}"
        #while minRatio < maxRatio and (maxRatio - minRatio) > threshold and not done
        calculatedHeights = []
        newHeight = null
        while minRatio < maxRatio and tries++ < maxTries and not done
          midRatio = (minRatio + maxRatio)/2
          $newEl = newOffscreenElement($el)
          $newEl.slabText fontRatio: midRatio, postTweak: false
          newHeight = $newEl.height()
          calculatedHeights.push newHeight
          # console.log "el: #{elId}, minRatio: #{minRatio}, midRatio: #{midRatio}, maxRatio: #{maxRatio}, newHeight: #{newHeight} availableHeight: #{availableHeight}"
          if newHeight == availableHeight
            lastHtml = $newEl.html()
            done = true
          else if newHeight < availableHeight
            minRatio += threshold
            lastHtml = $newEl.html()
          else if newHeight > availableHeight
            maxRatio -= threshold
          
          #console.log "lastHtml.height: #{$newEl.height()}"
          $newEl.remove()
        
        #console.log "lastHtml", lastHtml
        if lastHtml
          $el.html(lastHtml)
        adjustLineHeight($el, newHeight, windowHeight)
        console.log "showing el: ", $el
        $el.show()

    $("##{element}").each (i, el) ->
      optimizedSlabText
        el: el
        minRatio: 0.4
        maxRatio: 1.65
        availableHeight: textHeight
        threshold: 0.2
        maxTries: 10
        
window.getQueryString = (paramName)->
  queryString = window.location.search.split('?')[1]
  queryItems = queryString.split('&')
  for variable in queryItems
    parameterName = variable.split('=')
    if parameterName[0] == paramName
      return decodeURIComponent(parameterName[1])
