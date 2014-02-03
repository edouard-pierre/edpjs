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
 * storage object helper
 * @id storage
 * @alias storage
 * @type {Object}
 * @memberOf edpJS.helpers
 */

edpJS.helpers.storage = {
	storageName : null,
	init : function() {
		if(('localStorage' in window) && window['localStorage'] && window.localStorage !== null){
			// use localStorage
			this.storageName = 'localStorage';
		}
		else{
			// use cookie
			this.storageName = 'cookie';
		}
		return this.storageName;
	},
	localStorage: {
		get: function(key){
			// Get localStorage
			if(('localStorage' in window) && window['localStorage'] && window.localStorage !== null){
				return window.localStorage.getItem(key);
			}
		},
		set: function(key, data){
			// Set localStorage
			var bool = true;
			try {
				if(('localStorage' in window) && window['localStorage'] && window.localStorage !== null){
					window.localStorage.setItem(key, data);
				}
			} catch (e) {
				bool = false;
			}
			return bool;
		},
		remove: function(key){
			// Remove a storage item
			if(('localStorage' in window) && window['localStorage'] && window.localStorage !== null){
				window.localStorage.removeItem(key);
			}
		},
		clear: function(){
			// Clear storage
			if(('localStorage' in window) && window['localStorage'] && window.localStorage !== null){
				window.localStorage.clear();
			}
		}
	},
	cookie : {
		get : function(key){
			// Get cookie
			var i,x,y,cookies=document.cookie.split(";");
			for (i=0;i<cookies.length;i++){
				x=cookies[i].substr(0,cookies[i].indexOf("="));
				y=cookies[i].substr(cookies[i].indexOf("=")+1);
				x=x.replace(/^\s+|\s+$/g,"");
				if (x===key){
					return unescape(y);
				}
			}
		},
		set: function(key,value,days) {
			// Set cookie
			var expires = "";
			if (days) {
				var date = new Date();
				date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
				expires = "; expires=" + date.toGMTString();
			}
			document.cookie = key+"="+value.toString()+expires+"; path=/";
		},
		remove : function(key) {
			// remove cookie
			this.set(key,"",-1);
		}
	}
};