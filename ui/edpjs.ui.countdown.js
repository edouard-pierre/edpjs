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
 * Create a new instance of countdown
 * @id countdown
 * @alias countdown
 * @classDescription This class creates a new countdown.
 * @private
 * @constructor
 * @param {Object} domElement The countdown element.
 * @param {Object} endDate The end date of the countdown.
 * @param {Object} tmp The html template of the countdown. if null it get the default template
 * @param {function} callback The callback function executed after the countdown.
 * @return {Object} Returns a new countdown object.
 * @memberOf edpJS.ui
 */

edpJS.ui.countdown = function(domElement, endDate, tmp, callback){
	var template = tmp || '<b>DAYS</b> j : <b>HOURS</b> h : <b>MINUTES</b> min : <b>SECONDS</b> sec';
	var time = parseInt(endDate.getTime() / 1000, 10);
	function remainingTime(){
		var today = new Date();
		var time_tmp = parseInt(today.getTime() / 1000, 10);
		var remaining = time - time_tmp;
		var d = parseInt((remaining / (60 * 60 * 24)), 10),
		h = parseInt((remaining / (60 * 60) - d * 24), 10),
		m = parseInt((remaining / 60 - d * 24 * 60 - h * 60), 10),
		s = parseInt((remaining - d * 24 * 60 * 60 - h * 60 * 60 - m * 60), 10);
		setElement(d,h,m,s);
		if (time_tmp < time){
			setTimeout(function(){
				remainingTime();
			}, 1000);
		}
		else{
			callback();
		}
	}
	function setElement(d,h,m,s){
		if($(domElement).size()){
			var html = template.replace(/DAYS/i,d).replace(/HOURS/i,h).replace(/MINUTES/i,m).replace(/SECONDS/i,s);
			$(domElement).html(html);
		}
	}
	return{
		init : remainingTime
	};
};