Framework7.prototype.plugins.upscroller = function (app, params) {
    'use strict';
    params = params || {text: '返回顶部'};
    //Export selectors engine
    //var $$ = window.Dom7;

    return {
        hooks : {
			pageBeforeInit: function (pageData) {	
				var $$btn = $('<div class="upscroller"></div>');				
				$(pageData.container).prepend($$btn);
				if ($("[data-page='"+pageData.name+"'] > .searchbar")[0]) $("[data-page='"+pageData.name+"'] >  .upscroller").css('top', '-10px');
				
				$$btn.click(function(event) {
					event.stopPropagation();
				    event.preventDefault();
				    var curpage = $(".page-content", mainView.activePage.container);		
				    //var curpage = $(".page-content");				
				    $(curpage).scrollTop(0);
				});
				
				$(".page-content", pageData.container).scroll(function(event){	
				  var e = $(event.target).scrollTop();
				  if(e > 300) {
				  	 $$btn.addClass('show'); 
				  }
				  else {
			        $$btn.removeClass('show'); 
				  }					  
				});
            }
        }
    };
};
