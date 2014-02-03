/**
 * @projectDescription EDP|JS library contains a lot of classes and functions to make work easy.
 * @author Edouard Pierre pierree@proximity.bbdo.fr
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
 * Create a new form helper
 * @id forms
 * @alias forms
 * @classDescription This class validate forms.
 * @private
 * @constructor
 * @param {Object} domElement The form element.
 * @param {String} ISO 3166-1 country norm.
 * @param {String} ISO 639 language code.
 * @memberOf edpJS.helpers
 */

edpJS.helpers.forms = function(domElement, opts){
	var options = {
		country : (opts && opts.country)?(opts.country):('FR'), // ISO 3166-1 alpha-2;
		language : (opts && opts.language )?(opts.language):('fr'), // ISO 639-1;
		servicePath : (opts && opts.servicePath )?(opts.servicePath):(null), // default : get the form action value
		stepByStep : (opts && opts.stepByStep)?(true):(false), // boolean;
		onSuccessHandler:(opts&&opts.onSuccessHandler)?(opts.onSuccessHandler):(function(){}), // calls a function when the WS succeed
		onErrorHandler:(opts&&opts.onErrorHandler)?(opts.onErrorHandler):(function(){}) // calls a function when the WS failed
	};
	var regexpPatterns = {
		FR: {
			name: /^[A-Za-z ]{3,20}$/,
			userName: /^[A-Za-z0-9 ]{3,20}$/,
			email: /^[a-z0-9._\-][a-z0-9._\-\+]*@[a-z0-9][a-z0-9.\-]*[\.]{1}[a-z]{2,4}$/i,
			phone: /^([\+0])?(\d{1,4})?([0-9. ]{9,14})$/,
			zip: /^\d{5}$/,
			date: /^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[012])\/[0-9]{4}$/,
			onlyNumber: /^[0-9]+$/,
			onlyLetter: /^[a-zA-Z]+$/,
			alphaNumeric: /^[a-zA-Z0-9_]*$/
		}
	};
	var errorMsg = {
		fr: {
			radioMandatory : "veuillez faire un choix",
			checkboxMandatory : "veuillez cocher la case",
			mandatory : "champs obligatoire",
			name: "3 à 10 caractÃ¨res alphabétiques requis",
			userName: "3 à 20 caractÃ¨res alpha-numériques requis",
			email: "email invalide",
			phone: "numéro invalide",
			zip: "5 caractères numérique requis",
			date: "cette date n’est pas valide",
			onlyNumber: "seuls les chiffres sont acceptés",
			onlyLetter: "seules les lettres sont acceptées",
			alphaNumeric: "Ne doit comporter que des caractères alpha-numériques"
		}
	};
	var errors, formSubmited = false;
	var errorsContainer = null;
	var domElementId = null;

	function initialize(){
		if(!domElement.attr("id")){
			return;
		}
		domElementId = domElement.attr("id");
		_addListeners();
		errorsContainer = $("<p>").prependTo(domElement).addClass("edpJShelpersformsErrorsContainer");
	}

	function _addListeners(){
		domElement.submit(function(e){ _onSubmit(e); });
		$('input[type="radio"]').change(function(e){ _onRadioChange(e); });
		$('input[type="checkbox"]').change(function(e){ _onCheckBoxChange(e); });
		domElement.find('input').focus(function(e){ _onInputFocus(e); });
		domElement.find('select').select(function(e){ _onSelectChange(e); });
	}

	function _onSubmit(e){
		e.preventDefault();
		_validate();
	}

	function _onInputFocus(e){
		domElement.find("input[name='"+e.target.name+"']").removeClass('edpJShelpersformsError');
		$('#'+domElementId+'_'+e.target.name+'_Error').html('');
	}
	function _onSelectChange(e){
		domElement.find("select[name='"+e.target.name+"']").removeClass('edpJShelpersformsError');
		$('#'+domElementId+'_'+e.target.name+'_Error').html('');
	}
	function _onRadioChange(e){
		$('#'+domElementId+'_'+e.target.name+'_Error').html('');
	}
	function _onCheckBoxChange(e){
		$('#'+domElementId+'_'+e.target.name+'_Error').html('');
	}

	function _validate(){
		if(!formSubmited){
			formSubmited = true;
			errors = {};
			errorsContainer.empty();

			var errorCount = 0;

			if(options.country && regexpPatterns[options.country]){
				domElement.find("input, select").each(function(){
					var input = $(this);
					var inputName = input.attr('id');

					var errorText = [];

					if (input.hasClass("edpJShelpersformsMandatory") && input.val() === ''){
						errorText.push("edpJShelpersformsMandatory");
					}
					if(input.hasClass("edpJShelpersformsEmail")){
						if(!regexpPatterns[options.country].email.test(input.val())){
							if($.inArray("edpJShelpersformsEmail",errorText) === -1){
								errorText.push("edpJShelpersformsEmail");
							}
						}
					}
					if(input.val() !== '' && input.hasClass("edpJShelpersformsPhone")){
						if(!regexpPatterns[options.country].phone.test(input.val())){
							if($.inArray("edpJShelpersformsPhone",errorText) === -1){
								errorText.push("edpJShelpersformsPhone");
							}
						}
					}
					if(input.hasClass("edpJShelpersformsName")){
						if(!regexpPatterns[options.country].name.test(input.val())){
							if($.inArray("edpJShelpersformsName",errorText) === -1){
								errorText.push("edpJShelpersformsName");
							}
						}
					}
					if(input.hasClass("edpJShelpersformsUserName")){
						if(!regexpPatterns[options.country].userName.test(input.val())){
							if($.inArray("edpJShelpersformsUserName",errorText) === -1){
								errorText.push("edpJShelpersformsUserName");
							}
						}
					}
					if(input.hasClass("edpJShelpersformsZip")){
						if(input.val() !== '' && !regexpPatterns[options.country].zip.test(input.val())){
							if($.inArray("edpJShelpersformsZip",errorText) === -1){
								errorText.push("edpJShelpersformsZip");
							}
						}
					}
					if(input.hasClass("edpJShelpersformsDate")){
						if(!regexpPatterns[options.country].date.test(input.val())){
							if($.inArray("edpJShelpersformsDate",errorText) === -1){
								errorText.push("edpJShelpersformsDate");
							}
						}
					}
					if(input.hasClass("edpJShelpersformsOnlyNumber")){
						if(!regexpPatterns[options.country].onlyNumber.test(input.val())){
							if($.inArray("edpJShelpersformsOnlyNumber",errorText) === -1){
								errorText.push("edpJShelpersformsOnlyNumber");
							}
						}
					}
					if(input.hasClass("edpJShelpersformsOnlyLetter")){
						if(!regexpPatterns[options.country].onlyLetter.test(input.val()))
						{
							if($.inArray("edpJShelpersformsOnlyLetter",errorText) === -1){
								errorText.push("edpJShelpersformsOnlyLetter");
							}
						}
					}
					if(input.hasClass("edpJShelpersformsAlphaNumeric")){
						if(!regexpPatterns[options.country].alphaNumeric.test(input.val())){
							if($.inArray("edpJShelpersformsAlphaNumeric",errorText) === -1){ 
								errorText.push("edpJShelpersformsAlphaNumeric");
							}
						}
					}
					if(input.hasClass("edpJShelpersformsRadioMandatory")){
						
						if(!$('input[name="' + input.attr('name') + '"]:checked')[0]){
							if($.inArray("edpJShelpersformsRadioMandatory",errorText) === -1){ 
								errorText.push("edpJShelpersformsRadioMandatory");
							}
						}
					}
					if(input.hasClass("edpJShelpersformsCheckboxMandatory")){
						if(!$('input[name="' + input.attr('name') + '"]:checked')[0])
						{
							if($.inArray("edpJShelpersformsCheckboxMandatory",errorText) === -1){ 
								errorText.push("edpJShelpersformsCheckboxMandatory");
							}
						}
					}
					if(errorText.length > 0){
						if(domElement.find("input[name='"+input.attr("name")+"']").length === 0 ||!domElement.find("input[name='"+input.attr("name")+"']").hasClass("edpJShelpersformsError")){
							domElement.find("input[name='"+input.attr("name")+"']").addClass('edpJShelpersformsError');
							domElement.find("select[name='"+input.attr("name")+"']").addClass('edpJShelpersformsError');
							errors[inputName] = errorText;
							errorCount++;
							if(options.stepByStep){
								return false;
							}
						}
					}
				});
			}

			if(errorCount > 0){
				if (options.language && errorMsg[options.language]) {
					_reportErrors();
				}
				formSubmited = false;
			}
			else{
				_sendData();
			}
		}
	}

	function _sendData(){
		
		var dataSerialize = domElement.serialize();
		/*var prepareToPostData = {};
		$.each(dataSerialize.split("&"),function(i,iEl){
			if (iEl.split("=")[0] !== "reglement") {
				var v = (iEl.split("=")[1]) ? decodeURIComponent(iEl.split("=")[1].replace(/\+/gi, " ")) : '';
				if (iEl.split("=")[0]) {
					prepareToPostData[iEl.split("=")[0]] = v;
				}
			}
		});*/
		var request = $.ajax({
			url: options.servicePath,
			type: 'POST',
			//data: $.stringify(prepareToPostData),
			data : dataSerialize,
			dataType: "json"
			/*,
			contentType: 'application/json; charset=utf-8'*/
		});
		
		request.done(function(response) {
			options.onSuccessHandler(response);
			formSubmited = false;
		});
		request.fail(function(jqXHR, textStatus) {
			options.onErrorHandler('Service non disponible');
			formSubmited = false;
		});
	}
	function _reportErrors()
	{
		var mainStr = '';
		for(var prop in errors){
			var input = prop;
			var errorArray = errors[prop];
			var lng = errorArray.length;
			var str = '';
		
			for(var i = 0; i < lng; i++){
				switch(errorArray[i]){
					case "edpJShelpersformsEmail":
						str += errorMsg[options.language].email;
					break;
					case "edpJShelpersformsPhone":
						str += errorMsg[options.language].phone;
					break;
					case "edpJShelpersformsName":
						str += errorMsg[options.language].name;
					break;
					case "edpJShelpersformsUserName":
						str += errorMsg[options.language].userName;
					break;
					case "edpJShelpersformsMandatory":
						str += errorMsg[options.language].mandatory;
					break;
					case "edpJShelpersformsZip":
						str += errorMsg[options.language].zip;
					break;
					case "edpJShelpersformsDate":
						str += errorMsg[options.language].date;
					break;
					case "edpJShelpersformsOnlyNumber":
						str += errorMsg[options.language].onlyNumber;
					break;
					case "edpJShelpersformsOnlyLetter":
						str += errorMsg[options.language].onlyLetter;
					break;
					case "edpJShelpersformsAlphaNumeric":
						str += errorMsg[options.language].alphaNumeric;
					break;
					case "edpJShelpersformsRadioMandatory":
						str += errorMsg[options.language].radioMandatory;
					break;
					case "edpJShelpersformsCheckboxMandatory":
						str += errorMsg[options.language].checkboxMandatory;
					break;
				}
				str += (i == (lng-1)) ? '.' : ', ';
				
			}
			//var inputName = input;
			var inputName = $('#'+input).attr('name');
			var label = $("label").filter(function(){
				return $(this).attr("for") && $(this).attr("for") === input;
			}).text().replace(/\*/gi,'');
			
			if($('#'+input).attr("type") === "radio"){
				label = domElement.find(".edpJShelpersformsLabel_"+$('#'+input).attr('name')).text().replace(/\*/gi,'');
				//inputName = $('#'+input).attr('name');
			}
			
			$("<span>").appendTo(errorsContainer).attr("id",domElementId+'_'+inputName+'_Error').html(label+' : ' + str);
			if(options.stepByStep){
				options.onErrorHandler();
				return;
			}
		}
		options.onErrorHandler();
	}
	return {
		/**
		 * Call the private edpJS.helpers.forms.initialize function.
		 * @public
		 * @type {Method}
		 */
		init: initialize
	};
};