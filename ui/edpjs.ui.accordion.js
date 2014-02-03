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
 * Create a new instance of accordion
 * @id accordion
 * @alias accordion
 * @classDescription This class creates a new accordion.
 * @private
 * @constructor
 * @param {Object} domElement The accordion container.
 * @param {Object} opts The accordion options.
 * @return {Object} Returns a new accordion object.
 * @memberOf edpJS.ui
 */

edpJS.ui.accordion = function(domElement,opts){
	var options = {
		visibleElement: (opts && opts.visibleElement) ? (opts.visibleElement) : (0), // first opened element
		show: (opts && opts.show) ? (opts.show) : (function(el){
			$(el).slideDown();
		}), // show effect
		hide :  (opts && opts.hide) ? (opts.hide) : (function(el){
			$(el).slideUp();
		}), //hide effect
		callBack : (opts && opts.callBack) ? (opts.callBack) : (null)
	};
	var _tabsPattern = [], _tabscontainer, _titleChildren, _linkChildren, _children;
	/**
	 * initialize the current accordion container.
	 * @id edpJS.ui.accordion.initialize
	 * @alias accordion.initialize
	 * @method
	 * @private
	 */
	function initialize(){
		hideContent();
		_tabscontainer = domElement.addClass("edpJSuiaccordion");
		_titleChildren = $(domElement).find(".edpJSuiaccordionTitle");
		_linkChildren = $(domElement).find(".edpJSuiaccordionLink");
		_children = $(domElement).find(".edpJSuiaccordionTitle, .edpJSuiaccordionLink");
		
		$.each(_children,function(i){
			var clone = $(this).clone();
			if(clone.hasClass("edpJSuiaccordionTitle")){
				var tabObj = {
					index : i,
					tab : clone,
					tabContent : $(this).next('.edpJSuiaccordionContent')
				};
				_tabsPattern.push(tabObj);
				if(_tabsPattern.length === _children.length){
					buildTabs();
				}
			}
			if(clone.hasClass("edpJSuiaccordionLink")){
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
	 * build accordion tabs and accordion tab content
	 * @id edpJS.ui.accordion.buildTabs
	 * @alias accordion.buildTabs
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
						hideContent();
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
	 * extract accordion tabs and accordion content from external html files
	 * @id edpJS.ui.accordion.extractContentFromExternal
	 * @alias accordion.extractContentFromExternal
	 * @method
	 * @private
	 */
	function extractContentFromExternal(externalContent, index){
		$.each($(externalContent),function(i, tag){
			$.each($(tag),function(){
				if($(this).hasClass("edpJSuiaccordionTitle")){
					_tabsPattern[index].tab = $(this);
				}
				if($(this).hasClass("edpJSuiaccordionContent")){
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
	 * @id edpJS.ui.accordion.hideContent
	 * @alias accordion.hideContent
	 * @method
	 * @private
	 */
	function hideContent(){
		domElement.find('.edpJSuiaccordionTitle').removeClass("on");
		options.hide(domElement.find('.edpJSuiaccordionContent'));
	}
	/**
	 * show content div
	 * @id edpJS.ui.accordion.showContent
	 * @alias accordion.showContent
	 * @method
	 * @private
	 */
	function showContent(i){
		if(domElement.find('.edpJSuiaccordionContent').eq(i).css("display") === 'none'){
			domElement.find('.edpJSuiaccordionTitle').eq(i).addClass("on");
			options.show(domElement.find('.edpJSuiaccordionContent').eq(i));
		}
		else{
			hideContent();
		}
	}
	return{
		/**
		 * Call the private edpJS.ui.accordion.initialize function.
		 * @public
		 * @type {Method}
		 */
		init : initialize
	};
};