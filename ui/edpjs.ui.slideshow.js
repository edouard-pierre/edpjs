/**
 * @projectDescription EDP|JS library contains a lot of classes and functions to make work easy.
 * @author Edouard Pierre dev@edouard-pierre.fr
 * @version 1.0
 */
var edpJS = edpJS || {};

/**
 * EDP|JS User Interface
 * @id edpJS.ui
 * @alias edpJS.ui
 * @type {Object}
 */
edpJS.ui = edpJS.ui || {};

/**
 * Create a new instance of slideshow
 * @id slideshow
 * @alias slideshow
 * @classDescription This class creates a new slideshow.
 * @private
 * @constructor
 * @param {Object} domElement The slideshow element.
 * @param {Object} opts The slideshow options.
 * @return {Object} Returns a new slideshow object.
 * @memberOf edpJS.ui
 */

edpJS.ui.slideshow = function(domElement,opts){
	var options = {
		orientation : (opts && opts.orientation)?(opts.orientation):('H'), // H: horizontal / V: vertical
		visibleElements : (opts && opts.visibleElements)?(opts.visibleElements):(6), // visible elements by slide;
		firstElement : (opts && opts.firstElement)?(opts.firstElement):(0), // count from 0;
		auto : (opts && opts.auto === true)?(true):(false), // boolean true: auto-scrollable slideshow;
		loop : (opts && opts.auto === true)?(true):((opts && opts.loop === true)?(true):(false)),  // boolean true: infinite loop;
		direction : (opts && opts.direction)?(opts.direction):('rtl'), // rtl: right to left OR ltr: left to right;
		speedFactor : (opts && opts.speedFactor)?(opts.speedFactor):(1),
		control : (opts && opts.control)?(opts.control):('click'), //click OR hover;
		displayCaption : (opts && opts.displayCaption === true)?(true):(false), // boolean true: show caption;
		htmlContent: (opts && opts.htmlContent === true)?(true):(false), //boolean true: content with html / false: content width images;
		zoom : (opts && opts.zoom)?(opts.zoom):(100), // image zoom in percent;
		sprite : (opts && opts.sprite === true)?(true):(false), // boolean true: slideshow with css sprite img;
		callback:(opts&&opts.callback)?(opts.callback):(function(){}), // calls a function after the slideshow is built
		slideLeftCallBack : (opts && opts.slideLeftCallBack) ? (opts.slideLeftCallBack) : (function(){}),// calls a function after a slide toward left;
		slideRightCallBack : (opts && opts.slideRightCallBack) ? (opts.slideRightCallBack) : (function(){}),// calls a function after a slide toward right;
		displayArrows : (opts && opts.displayArrows === true)?(true):(false) // boolean true: displays arrows;
	};
	var slideshowContainer = null;
	var slideshowContainerUl = null;
	var arrowNext = null;
	var arrowPrev = null;
	var timer = null;
	var content = [];
	var elements = [];
	var arrowNextAct = true;
	var arrowPrevAct = true;
	var lastH = 0;var lastW = 0;var highest = 0;var widest = 0;var currentSlide = 0;
	/**
	 * initialize the current slideshow.
	 * @id edpJS.ui.slideshow.initialize
	 * @alias slideshow.initialize
	 * @method
	 * @private
	 */
	function initialize(){
		slideshowContainer = $(domElement).children("div")[0];
		slideshowContainerUl = $(slideshowContainer).children("ul")[0];
		content = $(slideshowContainerUl).children("li").addClass("edpJSuislideshowitem");
		
			$(slideshowContainer).addClass("edpJSuislideshow");
			$(slideshowContainerUl).addClass("edpJSuislideshowcontainer");
			$.each(content, function(i, iEl){
				if($(iEl).height() > lastH){
					lastH = $(iEl).height();
					highest = i;
				}
				if($(iEl).width() > lastW){
					lastW = $(iEl).width();
					widest = i;
				}
				var element = (options.htmlContent)?({
						html: $(iEl).html(),
						style: $(iEl).attr("class"),
						width: $(iEl).width(),
						height: $(iEl).height()
					}):({
						style: $(iEl).attr("class"),
						width: $(iEl).width(),
						height: $(iEl).height(),
						src: $(iEl).find("img").attr("src"),
						title: $(iEl).find("img").attr("alt"),
						link: $(iEl).find("a").attr("href"),
						caption: $(iEl).find("span").html(),
						onclick:$(iEl).find("a").attr("onclick")
					});
				elements.push(element);
			});
		if (content.length > options.visibleElements) {	
			if (options.auto === true) {
				$(slideshowContainerUl).hover(function(){
					stop();
				}, function(){
					auto();
				});
			}
			// add arrows
			if (options.displayArrows) {
				domElement.find(".previous, .next").remove();
				arrowPrev = $("<a>").prependTo(domElement).attr("href", "#").addClass("previous").html("previous");
				if (options.control === 'hover') {
					$(arrowPrev).unbind('mouseover, mouseout').hover(function(){
						if (timer) {
							options.speedFactor = 2;
							options.direction = 'ltr';
						}
						else {
							backward();
						}
					}, function(){
						options.speedFactor = 1;
					});
				}
				else{
					$(arrowPrev).unbind('click').bind('click',function(e){
						e.preventDefault();
						if(arrowPrevAct){
							options.auto = false;
							arrowPrevAct = false;
							if(timer){
								stop();
							}
							backward();
						}
						
					});
				}
				arrowNext = $("<a>").appendTo(domElement).attr("href", "#").addClass("next").html("next");
				if (options.control === 'hover') {
					$(arrowNext).unbind('mouseover, mouseout').hover(function(){
						if (timer) {
							options.speedFactor = 2;
							options.direction = 'rtl';
						}
						else {
							forward();
						}
					}, function(){
						options.speedFactor = 1;
					});
				}
				else{
					$(arrowNext).unbind('click').bind('click',function(e){
						e.preventDefault();
						if(arrowNextAct){
							options.auto = false;
							arrowNextAct = false;
							if(timer){
								stop();
							}
							forward();
						}
					});
				}
				
			}
			build();
		}
		else{
			domElement.find(".previous, .next").remove();
			build();
		}
	}
	/**
	 * build the current slide.
	 * @id edpJS.ui.slideshow.build
	 * @alias slideshow.build
	 * @method
	 * @private
	 */
	function build(){
		var domElementWidth = (options.orientation === 'H') ? (options.htmlContent) ? (elements[widest].width * options.visibleElements) : (elements[widest].width * options.zoom / 100 * options.visibleElements) : (options.htmlContent) ? (elements[widest].width) : (elements[widest].width * options.zoom / 100);
		var domElementHeight = (options.orientation === 'H') ? (options.htmlContent) ? (elements[highest].height) : (elements[highest].height * options.zoom / 100) : (options.htmlContent) ? (elements[highest].height * options.visibleElements) : (elements[highest].height * options.zoom / 100 * options.visibleElements);
		
		$(slideshowContainer).css({
			width: domElementWidth,
			height: domElementHeight
		});
		
		var slideshowContainerUlWidth = (options.orientation === 'H') ? (options.htmlContent) ? (content.length * elements[widest].width) : (content.length * elements[widest].width * options.zoom / 100) : (options.htmlContent) ? (elements[widest].width) : (elements[widest].width * options.zoom / 100);
		var slideshowContainerUlHeight = (options.orientation === 'H') ? (options.htmlContent) ? (elements[highest].height) : (elements[highest].height * options.zoom / 100) : (options.htmlContent) ? ((options.visibleElements + 2) * elements[highest].height) : ((options.visibleElements + 2) * elements[highest].height * options.zoom / 100);
		
		$(slideshowContainerUl).css({
			width: slideshowContainerUlWidth,
			height: slideshowContainerUlHeight
		});
		
		if (options.orientation === 'H') {
			$(slideshowContainerUl).css("left", 0);
		}
		else {
			$(slideshowContainerUl).css("top", 0);
		}
		$(slideshowContainerUl).empty();
		options.firstElement = (options.firstElement > content.length) ? content.length : (options.firstElement < 0) ? 0 : options.firstElement;
		currentSlide = Math.floor(options.firstElement / 2);
		var buildElements = function(ii,jj){
			for (var i = ii, j = jj; i < j; i++) {
				var tag = $("<li>").appendTo(slideshowContainerUl).addClass("edpJSuislideshowitem");
				var elNb = i;
				if (elements[elNb]) {
					if (options.htmlContent) {
						$(tag).html(elements[elNb].html).css({
							"width": elements[elNb].width,
							"height": elements[elNb].height
						}).addClass(elements[elNb].style);
					}
					else {
						if (elements[elNb].link) {
							tag = $("<a>").appendTo(tag).attr("href", elements[elNb].link);
							if (elements[elNb].onclick) {
								$(tag).attr("onclick", elements[elNb].onclick);
							}
						}
						if (options.zoom / 100 !== 1) {
							$("<img>").appendTo(tag).attr("src", elements[elNb].src).css({
								"width": elements[elNb].width * options.zoom / 100,
								"height": elements[elNb].height * options.zoom / 100
							});
						}
						else {
							$(tag).css({
								"width": elements[elNb].width * options.zoom / 100,
								"height": elements[elNb].height * options.zoom / 100
							});
							if (!options.sprite) {
								$(tag).css("background-image", "url(" + elements[elNb].src + ")");
							}
							else {
								$(tag).addClass(elements[elNb].style);
							}
							$(tag).html("&nbsp;");
						}
						if (elements[elNb].title) {
							$(tag).attr("title", elements[elNb].title);
						}
						if (elements[elNb].caption) {
							var span = $("<span>").appendTo(tag).html(elements[elNb].caption);
							if (options.displayCaption) {
								$(span).show();
							}
						}
					}
				}
			}
		};
		buildElements(options.firstElement,content.length);
		buildElements(0,options.firstElement);
		options.callback();
		if (options.auto === true) {
			auto();
		}
	}
	/**
	 * looping the current slideshow.
	 * @id edpJS.ui.slideshow.loop
	 * @alias slideshow.loop
	 * @method
	 * @private
	 */
	function auto(){
		if(timer){
			stop();
		}
		var speed = Math.ceil(500/options.speedFactor);
		timer = setTimeout(function(){
			if(options.direction === 'rtl'){
				forward();
			}
			else{
				backward();
			}
		},speed);
	}
	/**
	 * stop the current slideshow.
	 * @id edpJS.ui.slideshow.stop
	 * @alias slideshow.stop
	 * @method
	 * @private
	 */
	function stop(){
		if(timer){
			window.clearTimeout(timer);
			timer = null;
		}
	}
	/**
	 * stop the current slide.
	 * @id edpJS.ui.slideshow.getCurrentSlide
	 * @alias slideshow.getCurrentSlide
	 * @method
	 * @private
	 */
	function getCurrentSlide(){
		return currentSlide;
	}
	/**
	 * slide forward the current slideshow.
	 * @id edpJS.ui.slideshow.forward
	 * @alias slideshow.forward
	 * @method
	 * @private
	 */
	function forward(){
		if (arrowPrev && arrowNext) {
			arrowPrev.removeClass("disabled");
			arrowNext.removeClass("disabled");
		}
		if (!options.loop && elements.length - options.visibleElements === currentSlide) {
			if (arrowNext) {
				arrowNext.addClass("disabled");
			}
			arrowNextAct = true;
			return false;
		}
		currentSlide++;
		options.firstElement++;
		options.direction = 'rtl';
		if (options.firstElement > elements.length - 1) {
			currentSlide = 0;
			options.firstElement = 0;
		}
		var speed = Math.ceil(500 / options.speedFactor);
		
		if (options.orientation === 'H') {
			$(slideshowContainerUl).stop(true, true).animate({
				left: ((options.htmlContent) ? ('-=' + elements[0].width) : ('-=' + elements[0].width * options.zoom / 100))
			}, speed, function(){
				$(slideshowContainerUl).find('li.edpJSuislideshowitem:first').insertAfter($(slideshowContainerUl).find('li.edpJSuislideshowitem:last'));
				$(slideshowContainerUl).css("left", 0);
				options.slideRightCallBack();
				arrowNextAct = true;
				if (options.auto === true) {
					auto();
				}
			});
		}
		else {
			$(slideshowContainerUl).stop(true, true).animate({
				top: ((options.htmlContent) ? ('-=' + elements[0].height) : ('-=' + elements[0].height * options.zoom / 100))
			}, speed, function(){
				$(slideshowContainerUl).find('li.edpJSuislideshowitem:first').insertAfter($(slideshowContainerUl).find('li.edpJSuislideshowitem:last'));
				$(slideshowContainerUl).css("top", 0);
				options.slideRightCallBack();
				arrowNextAct = true;
				if (options.auto === true) {
					auto();
				}
			});
		}
	}
	/**
	 * slide backward the current slideshow.
	 * @id edpJS.ui.slideshow.backward
	 * @alias slideshow.backward
	 * @method
	 * @private
	 */
	function backward(){
		if (arrowPrev && arrowNext) {
			arrowNext.removeClass("disabled");
			arrowPrev.removeClass("disabled");
		}
		if (!options.loop && currentSlide === 0) {
			if (arrowPrev && arrowNext) {
					arrowPrev.addClass("disabled");
			}
			arrowPrevAct = true;
			return false;
		}
		currentSlide--;
		options.firstElement--;
		options.direction = 'ltr';
		if (options.firstElement < 0) {
			currentSlide = elements.length - 1;
			options.firstElement = elements.length - 1;
		}
		var speed = Math.ceil(500 / options.speedFactor);
		
		if (options.orientation === 'H') {
			$(slideshowContainerUl).css("left", ((options.htmlContent) ? (-elements[0].width) : (-elements[0].width * options.zoom / 100)));
			$(slideshowContainerUl).find('li.edpJSuislideshowitem:last').insertBefore($(slideshowContainerUl).find('li.edpJSuislideshowitem:first'));
			$(slideshowContainerUl).stop(true, true).animate({
				left: ((options.htmlContent) ? ('+=' + elements[0].width) : ('+=' + elements[0].width * options.zoom / 100))
			}, speed, function(){
				$(slideshowContainerUl).css("left", 0);
				options.slideLeftCallBack();
				arrowPrevAct = true;
				if (options.auto === true) {
					auto();
				}
			});
		}
		else {
			$(slideshowContainerUl).css("top", ((options.htmlContent) ? (-elements[0].height) : (-elements[0].height * options.zoom / 100)));
			$(slideshowContainerUl).find('li.edpJSuislideshowitem:last').insertBefore($(slideshowContainerUl).find('li.edpJSuislideshowitem:first'));
			$(slideshowContainerUl).stop(true, true).animate({
				top: ((options.htmlContent) ? ('+=' + elements[0].height) : ('+=' + elements[0].height * options.zoom / 100))
			}, speed, function(){
				$(slideshowContainerUl).css("top", 0);
				options.slideLeftCallBack();
				arrowPrevAct = true;
				if (options.auto === true) {
					auto();
				}
			});
		}
	}
	/**
	 * slide to the current item.
	 * @id edpJS.ui.slideshow.slideTo
	 * @alias slideshow.slideTo
	 * @method
	 * @private
	 */
	function slideTo(pos){
		options.firstElement = (pos>content.length)?content.length:(pos<0)?0:pos;
		currentSlide = Math.floor(options.firstElement/2);
		build();
	}
	return{
		/**
		 * Call the private edpJS.ui.slideshow.forward function.
		 * @public
		 * @type {Method}
		 */
		slideForward : forward,
		/**
		 * Call the private edpJS.ui.slideshow.backward function.
		 * @public
		 * @type {Method}
		 */
		slideBackward : backward,
		/**
		 * Call the private edpJS.ui.slideshow.slideTo function.
		 * @public
		 * @type {Method}
		 */
		slideTo : slideTo,
		/**
		 * Call the private edpJS.ui.slideshow.getCurrentSlide function.
		 * @public
		 * @type {Method}
		 */
		getCurrentSlide : getCurrentSlide,
		/**
		 * Call the private edpJS.ui.slideshow.initialize function.
		 * @public
		 * @type {Method}
		 */
		init : initialize
	};
};