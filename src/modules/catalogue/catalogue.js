var Service = require('catalogue/server'),
	appFunc = require('utils/appFunc'),
	catalogueTpl =__inline('catalogue.tpl.html');
	
var	Catalogue = {
	init:function(query){
			this.initCataloguePage();
	},
	initCataloguePage:function(){
		Service.getStoryCatalogue(function(data){ 
			var  data = data.list;
    			for(var i =0;i< data.length;i++){
    				if(data[i].values==''){
    					data.splice(i,1);
    				}
    			}
    			var renderData = {
	          	  hotSearchList: data
	       		};
	       		  var output = appFunc.renderTpl(catalogueTpl, renderData);
	            $('#hotSearchList').html(output);
				
		});
	},
	collectData:function(event){
		appFunc.setStatistics('Event',$(this).data('type'),$(this).data('alisname'));
	}
}
module.exports = Catalogue;
