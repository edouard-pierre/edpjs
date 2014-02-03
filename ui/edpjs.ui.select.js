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
 * Create a new instance of select
 * @id select
 * @alias select
 * @classDescription This class creates a new select.
 * @private
 * @constructor
 * @param {Object} domElement The popin element.
 * @param {Object} eventFunc contains the onSelect event and /or the onFocus event and / or the onBlur event.
 * @param {String} isAutoComplete For autocompletion.
 * @param {boolean} isEnable To enable or disable the current select.
 * @return {Object} Returns a new select object.
 * @memberOf edpJS.ui
 */

edpJS.ui.select = function(element,eventFunc,isAutoComplete,enable) {
	var isEnable = (enable === false)?false : true,
	items = [],
	itemsAutocomplete = [],
	selectedOption = null,
	domElement = $(element),
	list = $('<ul>'),
	currentOption,
	view,
	onSelect = (eventFunc && eventFunc.onSelect) ? (eventFunc.onSelect) : (function(){}),
	onFocus = (eventFunc && eventFunc.onFocus) ? (eventFunc.onFocus) : (function(){}),
	onBlur = (eventFunc && eventFunc.onBlur) ? (eventFunc.onBlur) : (function(){});
	/**
	 * initialize the current slideshow.
	 * @id edpJS.ui.select.initialize
	 * @alias select.initialize
	 * @method
	 * @private
	 */
	function initialize(){
		if (!domElement.length){
			return;
		}
		var domElementClasses = (domElement.attr("class"))?' '+domElement.attr("class"):'';
		if(domElement.parents('.edpJSuiselect'+domElementClasses).size()>0){
			return;
		}
		domElement.removeAttr("class");
		domElement.wrap('<div class="edpJSuiselect'+domElementClasses+'"><div></div></div>').css("display", "none");
		view = domElement.parent();
		view.parent().addClass(domElement.className);
		
		if (domElement.get(0).nodeName === "SELECT") {
			selectedOption = domElement.find("option:selected").get(0);
			domElement.value = $(selectedOption).val();
			$(domElement.get(0)).children().each(function(){
				if ($(this).get(0).nodeName === "OPTGROUP") {
					var optGroup = $(this);
					$(this).find("option").each(function(){
						if (!$(this).hasClass("hidden")){
							items.push({
								group: $(optGroup).attr("label"),
								label: $(this).text(),
								value: $(this).val()
							});
						}
					});
				}
				else {
					if (!$(this).hasClass("hidden")) {
						items.push({
							label: $(this).text(),
							value: $(this).val()
						});
					}
				}
			});
		}
		else {
			$(domElement.get(0)).find("li").each(function(){
				items.push({
					label: $(this).text(),
					value: $(this).text()
				});
			});
		}
		if (isAutoComplete) {
			$('<input type="text" />').appendTo(view).attr("autocomplete","off").keyup(function(e){
				itemsAutocomplete = [];
				var inputValue = $(this).val().toLowerCase();
				$.each(items, function(i, iEl){
					if (inputValue!== "" && iEl.label.toLowerCase().substring(0, inputValue.length) === inputValue) {
						itemsAutocomplete.push({
							label: iEl.label,
							value: iEl.value
						});
					}
				});
				updateList(e);
			});
		}
		else {
			$('<span>').appendTo(view).html(($(selectedOption).text() === '')?'&nbsp;':$(selectedOption).text());
		}
		if (domElement.attr("disabled") || !isEnable) {
			isEnable = false;
			view.addClass("disabled");
		}
		if (isEnable) {
			view.bind("click",function(e){
				$(".edpJSuiselect-list").remove();
				onFocus();
				showList(e);
			});
		}
	}
	/**
	 * set the value of the selected option.
	 * @id edpJS.ui.select.setState
	 * @alias select.setState
	 * @method
	 * @private
	 */
	function setState(label, data) {
		if (view) {
			if (isAutoComplete) {
				view.find("input").val(label);
			}
			else{
				view.find("span").html(label);
			}
		}
		domElement.value = data;
	}
	/**
	 * handle the mousedown event
	 * @id edpJS.ui.select.docMouseDown
	 * @alias select.docMouseDown
	 * @method
	 * @private
	 */
	function docMouseDown(e) {
		var climb = $(e.target).closest(".edpJSuiselect");
		if (climb.length === 0){
			hideList();
		}
	}
	/**
	 * show the option list. do not show if !isEnable
	 * @id edpJS.ui.select.showList
	 * @alias select.showList
	 * @method
	 * @private
	 */
	function showList(e){
		if (isEnable) {
			if (view.hasClass("edpJSuiselectactive")) {
				hideList();
			}
			else {
				view.addClass("edpJSuiselectactive");
				updateList(e);
				list.appendTo(view.parent()).addClass("edpJSuiselect-list");
				var width = view.width() + 0;
				var top = $(view).parent().height();
				list.css({
					top: top,
					width: width-(parseInt(list.css("marginLeft"),10)+parseInt(list.css("marginRight"),10)+parseInt(list.css("borderLeftWidth"),10)+parseInt(list.css("borderRightWidth"),10))
				}).show();
				$(document).off("mousedown", docMouseDown);
				$(document).on("mousedown", docMouseDown);
			}
		}
	}
	/**
	 * hide the option list.
	 * @id edpJS.ui.select.showList
	 * @alias select.showList
	 * @method
	 * @private
	 */
	function hideList() {
		$(document).unbind("mousedown", docMouseDown);
		onBlur();
		view.removeClass("edpJSuiselectactive");
		list.hide();
		currentOption = -1;
	}
	/**
	 * update the option list.
	 * @id edpJS.ui.select.updateList
	 * @alias select.updateList
	 * @method
	 * @private
	 */
	function updateList(e) {
		list.empty();
		var lastGroup = '';
		$.each((itemsAutocomplete.length > 0)?(itemsAutocomplete):(items), function() {
			if(this.group && lastGroup !== this.group){
				var liGroup = $('<li>').appendTo(list);
				$('<b>').appendTo(liGroup).html(this.group);
				lastGroup = this.group;
			}
			var li = $('<li>').appendTo(list);
			$('<a>').appendTo(li).html(this.label).attr("href", "#"+this.value).click(function(e){
				e.preventDefault();
				selectItem(this);
			});
		});
		if(e){
			var keynum = (window.event)?e.keyCode:e.which;
			switch(keynum){
				case 13:
				if(currentOption >= 0){
					selectItem($(list).find("a").eq(currentOption));
				}
				break;
				case 38:
					currentOption--;
					currentOption = (currentOption < 0)?($(list).find("a").size()-1):(currentOption);
					$(list).find("a").eq(currentOption).addClass("on");
				break;
				case 40:
					currentOption++;
					var total = $(list).find("a").size();
					currentOption = (currentOption === total)?(0):(currentOption);
					$(list).find("a").eq(currentOption).addClass("on");
				break;
			}
		}
	}
	/**
	 * trigger the selected item
	 * @id edpJS.ui.select.selectItem
	 * @alias select.selectItem
	 * @method
	 * @private
	 */
	function selectItem(opt) {
		var value = $(opt).attr("href");
		value = value.substr(value.indexOf("#") + 1);
		domElement.val(value);
		domElement.change();
		setState($(opt).text(), value);
		onSelect();
		hideList();
	}
	return{
		/**
		 * Call the private edpJS.ui.select.initialize function.
		 * @public
		 * @type {Method}
		 */
		init : initialize
	};
};