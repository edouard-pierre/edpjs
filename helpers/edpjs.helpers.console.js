/**
 * @projectDescription EDP|JS library contains a lot of classes and functions to make work easy.
 * @author Edouard Pierre dev@edouard-pierre.fr
 * @version 0.1
 */
var edpJS = edpJS || {};

/**
 * EDP|JS helpers
 * @id edpJS.helpers
 * @alias edpJS.helpers
 * @type {Object}
 */
edpJS.helpers = edpJS.helpers || {};

/**
 * console object helper
 * @id console
 * @alias console
 * @type {Object}
 * @memberOf edpJS.helpers
 */

edpJS.helpers.console = {
	consolecontainer : null,
	isConsole : function(){
		if (typeof console === 'undefined') {
			this.addConsole();
		}
	},
	addConsole : function(){
		this.consoleContainer = $('<div>').appendTo('body').css({position:"fixed",bottom:0,left:0,width:"100%"}).hide();
		window.console = {
			show : function(){
				edpJS.helpers.console.consoleContainer.show();
			},
			hide : function(){
				edpJS.helpers.console.consoleContainer.hide();
			},
			info : function(info){
				$("<p>").appendTo(edpJS.helpers.console.consoleContainer).text(info);
			},
			log : function(log){
				$("<p>").appendTo(edpJS.helpers.console.consoleContainer).text(log);
			},
			warn : function(warn){
				$("<p>").appendTo(edpJS.helpers.console.consoleContainer).text(warn);
			}
		};
	}
};