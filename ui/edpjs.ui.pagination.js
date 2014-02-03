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
 * Create a new instance of pagination
 * @id pagination
 * @alias pagination
 * @classDescription This class creates a new pagination.
 * @private
 * @memberOf edpJS.ui
 */
edpJS.ui.pagination = {};
(function(){
	/**
	 * edpJS.ui.pagination._cached contains cached variables and functions.
	 */
	edpJS.ui.pagination._cached = {
		_options : {},
		_domElement : null,
		_nbPage : null,
		_myPagination : null,
		/**
		 * initialize the current pagination.
		 * @id edpJS.ui.pagination._cached.initialize
		 * @alias edpJS.ui.pagination._cached.initialize		
		 * @param {Object} domElement The pagination element.
		 * @param {Object} opts The pagination options.
		 * @method
		 * @private
		 */
		initialize : function(domElement,opts){
			if (!domElement) {
				return;
			}
			edpJS.ui.pagination._cached._domElement = domElement;
			
			edpJS.ui.pagination._cached._options = {
				itemPerPage: (opts && opts.itemPerPage) ? (opts.itemPerPage) : (20),
				currentPage: (opts && opts.currentPage) ? (opts.currentPage) : (0)
			};
			
			var itemsTotal = edpJS.ui.pagination._cached._domElement.find('li').size();
			if ((itemsTotal % edpJS.ui.pagination._cached._options.itemPerPage) === 0) {
				edpJS.ui.pagination._cached._nbPage = itemsTotal / edpJS.ui.pagination._cached._options.itemPerPage;
			}
			else {
				var restItems = itemsTotal % edpJS.ui.pagination._cached._options.itemPerPage;
				edpJS.ui.pagination._cached._nbPage = ((itemsTotal - restItems) / edpJS.ui.pagination._cached._options.itemPerPage) + 1;
			}
			edpJS.ui.pagination._cached.build();
		},
		/**
		 * build the pagination.
		 * @id edpJS.ui.pagination._cached.build
		 * @alias edpJS.ui.pagination._cached.build	
		 * @method
		 * @private
		 */
		build : function(){
			edpJS.ui.pagination._cached._myPagination = $('<div>').insertAfter(edpJS.ui.pagination._cached._domElement).addClass('edpJSuipaginationContainer');
			var myLink = [];
			for(var p=0, q=edpJS.ui.pagination._cached._nbPage; p < q; p++){
				var link = $('<a>').appendTo(edpJS.ui.pagination._cached._myPagination).addClass("page").attr("href","#page"+(p+1)).html(p+1);
				edpJS.ui.pagination._cached._domElement.find("li").eq(p*edpJS.ui.pagination._cached._options.itemPerPage).attr("id","page"+(p+1));
				myLink.push({link:link,page:p});
			}
			$.each(myLink,function(i){
				myLink[i].link.on("click",function(e){
					e.preventDefault();
					edpJS.ui.pagination._cached.changePage(myLink[i].page);
					$(myLink[i].link).addClass('current');
				});
			});
			$('<a>').prependTo(edpJS.ui.pagination._cached._myPagination).attr("href","#page"+(edpJS.ui.pagination._cached.getPrevPage()+1)).addClass("prev").html("previous page").on("click",function(e){
				e.preventDefault();
				edpJS.ui.pagination._cached.previousPage();
			});
			$('<a>').prependTo(edpJS.ui.pagination._cached._myPagination).attr("href","#page1").addClass("first").html("first page").on("click",function(e){
				e.preventDefault();
				edpJS.ui.pagination._cached.changePage(0);
			});
			$('<a>').appendTo(edpJS.ui.pagination._cached._myPagination).attr("href","#page"+(edpJS.ui.pagination._cached.getNextPage()+1)).addClass("next").html("next page").on("click",function(e){
				e.preventDefault();
				edpJS.ui.pagination._cached.nextPage();
			});
			$('<a>').appendTo(edpJS.ui.pagination._cached._myPagination).attr("href","#page"+edpJS.ui.pagination._cached._nbPage).addClass("last").html("last page").on("click",function(e){
				e.preventDefault();
				edpJS.ui.pagination._cached.changePage(edpJS.ui.pagination._cached._nbPage-1);
			});
			edpJS.ui.pagination._cached.changePage(edpJS.ui.pagination._cached._options.currentPage);
		},
		/**
		 * change the page.
		 * @id edpJS.ui.pagination._cached.changePage
		 * @alias edpJS.ui.pagination._cached.changePage
		 * @param {Object} page The current page number.
		 * @method
		 * @private
		 */
		changePage : function(page){
			edpJS.ui.pagination._cached._options.currentPage = page;
			edpJS.ui.pagination._cached._domElement.find('li').each(function(i){
				if(i >=edpJS.ui.pagination._cached._options.currentPage*edpJS.ui.pagination._cached._options.itemPerPage && i < (edpJS.ui.pagination._cached._options.currentPage*edpJS.ui.pagination._cached._options.itemPerPage + edpJS.ui.pagination._cached._options.itemPerPage)){
					$(this).show();
				}
				else {
					$(this).hide();
				}
			});
			edpJS.ui.pagination._cached._myPagination.find('a').removeClass('current');
			edpJS.ui.pagination._cached._myPagination.find('.page').eq(page).addClass('current');
			edpJS.ui.pagination._cached._myPagination.find(".prev").attr("href","#page"+(edpJS.ui.pagination._cached.getPrevPage()+1));
			edpJS.ui.pagination._cached._myPagination.find(".next").attr("href","#page"+(edpJS.ui.pagination._cached.getNextPage()+1));
		},
		/**
		 * get to the previous page number.
		 * @id edpJS.ui.pagination._cached.getPrevPage
		 * @alias edpJS.ui.pagination._cached.getPrevPage
		 * @method
		 * @private
		 */
		getPrevPage : function(){
			var prevPage = edpJS.ui.pagination._cached._options.currentPage-1;
			return (prevPage < 0)?(edpJS.ui.pagination._cached._nbPage-1):(prevPage);
		},
		/**
		 * go to the previous page.
		 * @id edpJS.ui.pagination._cached.previousPage
		 * @alias edpJS.ui.pagination._cached.previousPage
		 * @method
		 * @private
		 */
		previousPage : function(){
			edpJS.ui.pagination._cached._options.currentPage = edpJS.ui.pagination._cached.getPrevPage();
			edpJS.ui.pagination._cached.changePage(edpJS.ui.pagination._cached._options.currentPage);
			
		},
		/**
		 * get to the next page number.
		 * @id edpJS.ui.pagination._cached.getNextPage
		 * @alias edpJS.ui.pagination._cached.getNextPage
		 * @method
		 * @private
		 */
		getNextPage : function(){
			var nextPage = edpJS.ui.pagination._cached._options.currentPage+1;
			return (nextPage >= edpJS.ui.pagination._cached._nbPage)?(0):(nextPage);
		},
		/**
		 * go to the next page.
		 * @id edpJS.ui.pagination._cached.nextPage
		 * @alias edpJS.ui.pagination._cached.nextPage
		 * @method
		 * @private
		 */
		nextPage : function(){
			edpJS.ui.pagination._cached._options.currentPage = edpJS.ui.pagination._cached.getNextPage();
			edpJS.ui.pagination._cached.changePage(edpJS.ui.pagination._cached._options.currentPage);
			
		}
	};
	edpJS.ui.pagination._public = (function() {
		return {
			/**
			 * Call the private edpJS.ui.pagination._cached.initialize function.
			 * @public
			 * @type {Method}
			 */
			init : edpJS.ui.pagination._cached.initialize,
			/**
			 * Call the private edpJS.ui.pagination._cached.previousPage function.
			 * @public
			 * @type {Method}
			 */
			prev : edpJS.ui.pagination._cached.previousPage,
			/**
			 * Call the private edpJS.ui.pagination._cached.nextPage function.
			 * @public
			 * @type {Method}
			 */
			next : edpJS.ui.pagination._cached.nextPage
		};
	}());
}());