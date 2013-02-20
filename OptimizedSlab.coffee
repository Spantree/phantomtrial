((app, context) ->

	# OptimizedSlab
	# --------------
	# Optimizes slabtext plugin.
	#  For every list item to be displayed, this utility renders it,
	#  and verifies that the text fits in the screen. If not, it adjusts 
	#  the font to make it fit.

	class context.OptimizedSlab
		constructor: ->
			@optimizedSlabText = _.bind(@optimizedSlabText, @)

		# optimizedSlabText
		# -----------------
		# Renders the text using the slabtext plugin.
		# Adjusts the font to make the text fit in the available screenspace
		# as best as possible.
		optimizedSlabText: (options) =>
			@$offscreen.css
				width: $('#slider').css('width')
			$el = $(options.el)
			elId = $el.attr('id') ? _.uniqueId("li-")
			originalHtml = $el.html()
			lastHtml = null
			minRatio = options.minRatio
			maxRatio = options.maxRatio
			availableHeight = options.availableHeight
			threshold = options.threshold
			maxTries = options.maxTries

			tries = 0
			done = false
			calculatedHeights = []
			newHeight = null
			while minRatio < maxRatio and tries++ < maxTries and not done
				midRatio = (minRatio + maxRatio)/2
				$newEl = @newOffscreenElement($el)
				$newEl.slabText fontRatio: midRatio, postTweak: false
				newHeight = $newEl.height()
				if newHeight == availableHeight
					lastHtml = $newEl.html()
					done = true
				else if newHeight < availableHeight
					minRatio += threshold
					lastHtml = $newEl.html()
				else if newHeight > availableHeight
					maxRatio -= threshold

				$newEl.remove()
				if lastHtml
					$el.html(lastHtml)
				@adjustLineHeight($el, newHeight, @windowHeight)
				$el.show()

		adjustLineHeight: ($el, elHeight, availableHeight) ->
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

		newOffscreenElement: ($oldEl)->
			el = $("<li/>")
			el.html($oldEl.html())
			width = $oldEl.css('width')
			@$offscreen.css
				position: "absolute"
				top: "0px"
				left: "#{$(window).width() + 100}px"
				display: "block"
			el.css
				width: "#{width}px"
			@$offscreenUl.append(el)
			el

		renderSlab: (el, textHeight) ->
			@optimizedSlabText
				el: el 
				minRatio: 0.4
				maxRatio: 1.65
				availableHeight: textHeight
				threshold: 0.2
				maxTries: 10
				
		#optimizeSwipe: (currentPage, pageSize) =>
		optimizeSwipe: (indexOfFirstItem, pageSize) =>
			console.log "starting to optimize at: ", indexOfFirstItem
			if pageSize > 5
				pageSize = 5
			@windowHeight = $(window).height()
			padding = 10
			textHeight = @windowHeight - padding*2
			@$offscreen = $('div.offscreen')
			@$offscreenUl = $('ul', @$offscreen)
			$slider = $('#slider')
			$slider.css
				height: "#{@windowHeight}px"

			#totalElementsToRender = $('#slider li').length
			totalElementsToRender = pageSize + indexOfFirstItem
			# This is the index of the first item in *this* page.
			#indexOfFirstItem = ((pageSize * currentPage) - pageSize) 
			# Only optimize those items in the new page.
			for el in $('#slider li').slice(indexOfFirstItem, totalElementsToRender)
				@renderSlab(el, textHeight)

)(app, app.module('optimizedSlab'))

