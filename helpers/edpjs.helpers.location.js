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
 * location object helper
 * @id location
 * @alias location
 * @type {Object}
 * @memberOf edpJS.helpers
 */

edpJS.helpers.location = {
	/**
	 * get parameters and values from document.location.search
	 * @id edpJS.helpers.location.getSearch
	 * @alias location.getSearch
	 * @return {Array} Returns parameters and values.
	 */
	getSearch : function(){
		if(location.search){
			var arr = [], a = location.search.substring(1).split('&');
			for (var i=0, j=a.length; i<j; i++){
				var b = a[i].split('=');
				arr.push({param:b[0],val:b[1]});
			}
			return arr;
		}
		else{
			return false;
		}
	},
	/**
	 * get value from document.location.hash
	 * @id edpJS.helpers.location.getHash
	 * @alias location.getHash
	 * @return {String} hash value.
	 */
	getHash : function(){
		return (location.hash)?(location.hash.substring(1)):(false);
	}
};