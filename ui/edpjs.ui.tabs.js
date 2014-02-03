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
 * Create a new instance of tabs
 * @id tabs
 * @alias tabs
 * @classDescription This class creates new tabs.
 * @private
 * @constructor
 * @param {Object} domElement The tabs container.
 * @param {Object} opts The tabs options.
 * @return {Object} Returns a new tabs object.
 * @memberOf edpJS.ui
 */

edpJS.ui.tabs = function(domElement,opts){
	var options = {
		visibleElement: (opts && opts.visibleElement) ? (opts.visibleElement) : (0), // first opened element
		show: (opts && opts.show) ? (opts.show) : (function(el){
			$(el).show();
		}), // show effect
		hide :  (opts && opts.hide) ? (opts.hide) : (function(el){
			$(el).hide();
		}), //hide effect
		callBack : (opts && opts.callBack) ? (opts.callBack) : (null)
	};
	var _tabsPattern = [], _tabscontainer, _titleChildren, _linkChildren, _children;
	/**
	 * initialize the current tabs container.
	 * @id edpJS.ui.tabs.initialize
	 * @alias tabs.initialize
	 * @method
	 * @private
	 */
	function initialize(){
		domElement.addClass("edpJSuitabs");
		_tabscontainer = $("<div>").prependTo(domElement).addClass("edpJSuitabsContainer");
		_titleChildren = $(domElement).find(".edpJSuitabsTitle");
		_linkChildren = $(domElement).find(".edpJSuitabsLink");
		_children = $(domElement).find(".edpJSuitabsTitle, .edpJSuitabsLink");
		
		$.each(_children,function(i){
			var clone = $(this).clone();
			if(clone.hasClass("edpJSuitabsTitle")){
				var tabObj = {
					index : i,
					tab : clone,
					tabContent : $(this).next('.edpJSuitabsContent')
				};
				_tabsPattern.push(tabObj);
				if(_tabsPattern.length === _children.length){
					buildTabs();
				}
			}
			if(clone.hasClass("edpJSuitabsLink")){
				var url = clone.attr("href");
				$.ajax({
					url : url,
					success : function(response){
						var tabObj = {
							index : i,
							tab : null,
							tabContent : null
						};
						_tabsPattern.push(tabObj);
						extractContentFromExternal(response,_tabsPattern.length-1);
					}
				});
			}
			$(this).remove();
		});
	}
	/**
	 * build tabs and tab content
	 * @id edpJS.ui.tabs.buildTabs
	 * @alias tabs.buildTabs
	 * @method
	 * @private
	 */
	function buildTabs(){
		var _actual = 0;
		var tabsPatternLoop = function(){
			$.each(_tabsPattern,function(i){
				var index = i;
				if(_tabsPattern[index].index === _actual){
					// build tab
					$(_tabsPattern[index].tab).appendTo(_tabscontainer).bind('click',function(){
						showContent(_tabsPattern[index].index);
					});
					// buildTabContent
					$(_tabsPattern[index].tabContent).appendTo(domElement).hide();
					// active tab
					_actual++;
					return;
				}
			});
		};
		for(var i = _tabsPattern.length-1, j=0; i>=j;i--){
			tabsPatternLoop();
		}
		showContent(options.visibleElement);
		if(options.callBack){
			options.callBack();
		}
	}
	/**
	 * extract tabs and tab content from external html files
	 * @id edpJS.ui.tabs.extractContentFromExternal
	 * @alias tabs.extractContentFromExternal
	 * @method
	 * @private
	 */
	function extractContentFromExternal(externalContent, index){
		$.each($(externalContent),function(i, tag){
			$.each($(tag),function(){
				if($(this).hasClass("edpJSuitabsTitle")){
					_tabsPattern[index].tab = $(this);
				}
				if($(this).hasClass("edpJSuitabsContent")){
					_tabsPattern[index].tabContent = $(this);
				}
			});
		});
		if(_tabsPattern.length === _children.length){
			buildTabs();
		}
	}
	/**
	 * hide content div
	 * @id edpJS.ui.tabs.hideContent
	 * @alias tabs.hideContent
	 * @method
	 * @private
	 */
	function hideContent(){
		domElement.find('.edpJSuitabsTitle').removeClass("on");
		options.hide(domElement.find('.edpJSuitabsContent'));
	}
	/**
	 * show content div
	 * @id edpJS.ui.tabs.showContent
	 * @alias tabs.showContent
	 * @method
	 * @private
	 */
	function showContent(i){
		hideContent();
		options.show(domElement.find('.edpJSuitabsContent').eq(i));
		domElement.find('.edpJSuitabsTitle').eq(i).addClass("on");
	}
	return{
		/**
		 * Call the private edpJS.ui.tabs.initialize function.
		 * @public
		 * @type {Method}
		 */
		init : initialize,
		show : showContent
	};
};