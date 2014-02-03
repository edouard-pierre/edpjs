/**
 * TODO
 */
/**
 * @projectDescription EDP|JS library contains a lot of classes and functions to make work easy.
 * @author Edouard Pierre dev@edouard-pierre.fr
 * @version 0.1
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
 * Create a new instance of popin
 * @id popin
 * @alias popin
 * @classDescription This class creates a new popin.
 * @private
 * @constructor
 * @param {Object} domElement The popin element.
 * @param {Object} content The popin content.
 * @param {Object} opts The popin options.
 * @return {Object} Returns a new popin object.
 * @memberOf edpJS.ui
 */

edpJS.ui.popin = function(domElement, content, opts){
	var popinBackground = null;
	var popinForeground = null;
	var popinForegroundContent = null;
	var options = {
		closetxt :  (opts && opts.closetxt) ? (opts.closetxt) : ('X'),
		frameborder :  (opts && opts.frameborder) ? (opts.frameborder) : (0),
		scrolling :  (opts && opts.scrolling) ? (opts.scrolling) : ('auto'),
		fullscreen : (opts && opts.fullscreen) ? (opts.fullscreen) : (false),
		background : (opts && opts.background) ? (opts.background) : ({
			attrClass : "edpJSuipopinBackground",
			css : {
				width : 100,
				height : 100,
				sizeUnit : '%', // px || %
				left : 0,
				top : 0,
				posUnit : '%' // px || %
			}
		}),
		foreground : (opts && opts.foreground) ? (opts.foreground) : ({
			attrClass : "edpJSuipopinForeground",
			css : {
				width : 500,
				height : 500,
				sizeUnit : 'px', // px || %
				left : 50,
				top : 50,
				posUnit : '%' // px || %
			}
		}),
		show: (opts && opts.show) ? (opts.show) : (function(el){
			$(el).show();
		}), // show default effect
		hide :  (opts && opts.hide) ? (opts.hide) : (function(el){
			$(el).hide();
		})
	};
	function getScreenSize(){
		return {h : $(window).height(), w : $(window).width()};
	}
	function findMaxZindex(){
		var maxZ = Math.max.apply(null,$.map($('body > *'), function(e,n){
			if($(e).css('position')==='absolute'){
				return parseInt($(e).css('z-index'),10)||1 ;
			}
		}));
		return maxZ;
	}
	function scrollableContent(){
		var popinForegroundContentHeight = 0;
		popinForegroundContent.children().each(function(){
			popinForegroundContentHeight+=$(this).outerHeight(true);
		});
		if(popinForegroundContent.get(0).tagName.toLowerCase() !== 'iframe' && popinForegroundContent.height() >= popinForegroundContentHeight){
			popinForegroundContent.addClass("scrollable");
		}
		else{
			popinForegroundContent.removeClass("scrollable");
		}
	}
	function resizePopin(){
		$(window).unbind("resize").bind("resize",function(){
			resizePopin();
		});
		var popinWidth = (options.background.css.sizeUnit === '%')?(getScreenSize().w*options.background.css.width/100):(options.background.css.width);
		var popinHeight = (options.background.css.sizeUnit === '%')?(getScreenSize().h*options.background.css.height/100):(options.background.css.height);
		domElement.css({width:popinWidth, height:popinHeight, zIndex : findMaxZindex()});
		popinBackground.css({width:popinWidth, height:$(document).height()});
		
		var popinFGWidth = (options.foreground.css.sizeUnit === '%')?(popinWidth*options.foreground.css.width/100):(options.foreground.css.width);
		var popinFGHeight = (options.foreground.css.sizeUnit === '%')?(popinHeight*options.foreground.css.height/100):(options.foreground.css.height);
		var popinFGLeft = (options.foreground.css.posUnit === '%')?((popinWidth*options.foreground.css.left/100)-popinFGWidth/2):(options.foreground.css.left);
		var popinFGTop = (options.foreground.css.posUnit === '%')?((popinHeight*options.foreground.css.top/100)-popinFGHeight/2):(options.foreground.css.top);
		popinForeground.css({
			width : popinFGWidth,
			height : popinFGHeight,
			left : popinFGLeft,
			top : popinFGTop
		});
		popinForegroundContent.css({
			width : popinFGWidth,
			height : popinFGHeight-20,
			top:20
		});
		scrollableContent();
		if(popinForeground.find('.edpJSuipopinfullScreen')){
			popinForeground.find('.edpJSuipopinfullScreen').show();
		}
	}
	function switchScreenSize(){
		popinForeground.animate({
			width:domElement.width(),
			height:domElement.height()-20,
			top:domElement.position().top,
			left:domElement.position().left
		},300);
		popinForegroundContent.animate({
			width:domElement.width(),
			height:domElement.height()-20
		},300);
		scrollableContent();
		popinForeground.find('.edpJSuipopinfullScreen').hide();
	}
	function createHeaderBtn(){
		if(options.fullscreen){
			$("<a>").appendTo(popinForeground).addClass("edpJSuipopinfullScreen").attr("href", "#").html("fullscreen").on("click", function(e){
				e.preventDefault();
				switchScreenSize();
			});
		}
		
		/*$("<a>").appendTo(popinForeground).addClass("edpJSuipopinPopin").attr("href", "javascript:void(0);").html("popin").bind("click", function(){
			resizePopin()
		});*/
	}
	function createCloseBtn(){
		$("<a>").appendTo(popinForeground).addClass("edpJSuipopinClose").attr("href","#").html(options.closetxt).on("click",function(e){
			e.preventDefault();
			resizePopin();
			close();
		});
	}
	/**
	 * Initialize the current popin.
	 * @id edpJS.ui.popin.initialize
	 * @alias popin.initialize
	 * @method
	 * @private
	 */
	function initialize(){
		domElement.addClass('edpJSuipopin').parent().css('position','relative');
		popinBackground = $('<div>').appendTo(domElement).addClass(options.background.attrClass).bind("click",function(){
			close();
		});
		popinForeground = $('<div>').appendTo(domElement).addClass(options.foreground.attrClass);
		if(content.indexOf("http://") === 0 || content.indexOf("https://") === 0){
			var currentDomain = location.protocol+'//'+location.host;
			if(content.substring(0,currentDomain.length) !== currentDomain){
				//cross domain
				popinForegroundContent = $('<iframe src="'+content+'">').appendTo(popinForeground).addClass("edpJSuipopinContent").attr({
					frameborder : options.frameborder,
					scrolling : options.scrolling
				});
				createHeaderBtn();
				createCloseBtn();
			}
			else{
				$.get(content,function(response){
					$.each($(response),function(i, tag){
						$.each($(tag),function(){
							if($(this).hasClass("edpJSuipopinContent")){
								popinForegroundContent = $(this).appendTo(popinForeground);
								createHeaderBtn();
								createCloseBtn();
							}
						});
					});
				});
				
			}
			
		}
		else{
			popinForegroundContent = $("<div>").appendTo(popinForeground).addClass("edpJSuipopinContent").html(content);
			createCloseBtn();
		}
	}
	/**
	 * Open the current popin.
	 * @id edpJS.ui.popin.open
	 * @alias popin.open
	 * @method
	 * @private
	 */
	function open(){
		resizePopin();
		options.show(domElement);
	}
	/**
	 * Close the current popin.
	 * @id edpJS.ui.popin.close
	 * @alias popin.close
	 * @method
	 * @private
	 */
	function close(){
		resizePopin();
		options.hide(domElement);
	}
	return{
		/**
		 * Call the private edpJS.ui.popin.initialize function.
		 * @public
		 * @type {Method}
		 */
		init : initialize,
		/**
		 * Call the private edpJS.ui.popin.open function.
		 * @public
		 * @type {Method}
		 */
		show : open,
		/**
		 * Call the private edpJS.ui.popin.close function.
		 * @public
		 * @type {Method}
		 */
		hide : close
	};
};