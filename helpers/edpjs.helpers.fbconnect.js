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
 * EDP|JS helpers
 * @id edpJS.helpers
 * @alias edpJS.helpers
 * @type {Object}
 */
edpJS.helpers = edpJS.helpers || {};

/**
 * Create a new instance of fbconnect
 * @id fbconnect
 * @alias fbconnect
 * @classDescription This class activate a facebook login button.
 * @private
 * @constructor
 * @memberOf edpJS.helpers
 */

edpJS.helpers.fbconnect = function(domElement, appId, opts, perms){
	var currentAppId = appId;
	var currentPerms = perms;
	var options = opts || {
			getLoginStatusOnload: false,
			getLoginStatusAfterloaded : false,
			onLogin : function(){}
	};
	/**
	 * initialize the current btn.
	 * @id edpJS.helpers.fbconnect.initialize
	 * @alias fbconnect.initialize
	 * @method
	 * @private
	 */
	function initialize(){
		if ($("#fb-root").size() === 0) {
			$("<div>").appendTo("body").attr("id", "fb-root");
		}
		$.getScript(document.location.protocol + '//connect.facebook.net/fr_FR/all.js', function(){
			FB.init({
				appId: currentAppId,
				status: true, // check login status
				cookie: true, // enable cookies to allow the server to access the session
				xfbml: true, // parse XFBML
				oauth: true
			});
		});
		if(options.getLoginStatusOnload){
			getLoginStatus();
		}
		$(domElement).on("click",function(){
			login();
		});
	}
	/**
	 * Check the current login status.
	 * @id edpJS.helpers.fbconnect.getLoginStatus
	 * @alias fbconnect.getLoginStatus
	 * @method
	 * @private
	 */
	function getLoginStatus(){
			FB.getLoginStatus(function(response){
				switch (response.status) {
					case 'connected':
						// the user is logged in and connected to your
						// app, and response.authResponse supplies
						// the user's ID, a valid access token, a signed
						// request, and the time the access token 
						// and signed request each expire
						var uid = response.authResponse.userID;
						var accessToken = response.authResponse.accessToken;
						options.onLogin();
						break;
					case 'not_authorized':
						// the user is logged in to Facebook, 
						//but not connected to the app
						login();
						break;
					default:
						// the user isn't even logged in to Facebook.
						login();
						break;
				}
			});
	}
	/**
	 * login FB.
	 * @id edpJS.helpers.fbconnect.login
	 * @alias fbconnect.login
	 * @method
	 * @private
	 */
	function login(){
		FB.login(function(response){
			if (response.authResponse) {
				if(options.getLoginStatusAfterloaded){
					getLoginStatus();
				}
			}
		}, {
			scope: 'email'
		});
	}
	/**
	 * logout FB.
	 * @id edpJS.helpers.fbconnect.logout
	 * @alias fbconnect.logout
	 * @method
	 * @private
	 */
	function logout(){
		FB.logout(function(response) {
			console.log('Logged out.');
		});
	}
	return {
		/**
		 * Call the private edpJS.helpers.fbconnect.initialize function.
		 * @public
		 * @type {Method}
		 */
		init: initialize
	};
};