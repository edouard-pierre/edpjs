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
 * Create a new instance of zoompicture
 * @id zoompicture
 * @alias zoompicture
 * @classDescription This class creates new zoom on a picture.
 * @private
 * @memberOf edpJS.ui
 */
edpJS.ui.zoompicture= function(domElement,opts) {
	var _domElement = null,
	_domElementH = 0,
	_domElementW = 0,
	_domElementL = 0,
	_domElementT = 0,
	_options = null;
	/**
	 * initialize the current zoom.
	 * @id initialize
	 * @alias initialize
	 * @param {Object} domElement The zoom container.
	 * @param {Object} opts The zoom options.
	 * @method
	 * @private
	 */
	function initialize(){
		if (!domElement.length){
			return;
		}
		_domElement = domElement;
		_domElementH = domElement.height();
		_domElementW = domElement.width();
		_domElementL = Math.round(domElement.offset().left);
		_domElementT = Math.round(domElement.offset().top);
		
		_options = {
			zoomext: (opts && opts.zoomext) ? (opts.zoomext) : ('')
		};
		
		_domElement.addClass("edpJSzoompicturecontainer");
		var previewSrc = _domElement.find("img").attr("src");
		_domElement.css("height",_domElement.find("img").height());
		_domElement.css("width",_domElement.find("img").width());
		
		var imgzoompath = previewSrc.substring(0,previewSrc.length-4)+''+_options.zoomext+''+previewSrc.substring(previewSrc.length-4,previewSrc.length);
		var imgzoom = new Image();
		if(_domElement.find(".edpJSzoompicturezoom").length === 0){
			$("<div>").appendTo(_domElement).addClass("edpJSzoompicturezoom");
		}
		_domElement.find(".edpJSzoompicturezoom").css("background-image","url("+imgzoompath+")");
		imgzoom.onload = function(){
			_domElement.find(".edpJSzoompicturezoom").css({
				"background-image": "url(" + imgzoom.src + ")",
				"background-position": "0 -" + imgzoom.height + "px"
			});
			
			_domElement.hover(function(){
				_domElement.find(".edpJSzoompicturezoom").show();
				$(this).mousemove(function(e){
					zoom(e.pageY,e.pageX,imgzoom.height,imgzoom.width);
				});
			}, function(){
				_domElement.find(".edpJSzoompicturezoom").hide().css({
					"background-position": "0 -" + imgzoom.height + "px"
				});
				
			});
		};
		imgzoom.src=imgzoompath;
	}
	/**
	 * zoom the picture.
	 * @id zoom
	 * @alias zoom
	 * @method
	 * @private
	 */
	function zoom(cursorY, cursorX,zoomH,zoomW){
		var posT = Math.round((cursorY-_domElementT)*(zoomH-_domElementH)/_domElementH);
		var posL = Math.round((cursorX-_domElementL)*(zoomW-_domElementW)/_domElementW);
		_domElement.find(".edpJSzoompicturezoom").css({
			"background-position": (-posL)+"px "+ (-posT) + "px"
		});
	}
	return {
		/**
		 * Call the private initialize function.
		 * @public
		 * @type {Method}
		 */
		init:initialize
	};
};