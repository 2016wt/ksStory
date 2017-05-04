var Service = require('user/server'),
	myAlbumTpl =__inline('myalbum.tpl.html'),
	appFunc = require('utils/appFunc'),
	myCollectTpl=__inline('myCollect.tpl.html');
	var User = {

		init:function(query){
			if(query){
				if(query.name === 'myalbum'){
					User.initAlbumsPage();
				}
			}
			this.initUserPage();
			// this.headalert();
			this.initCollectPage();//
			this.initUserCollectNavPage();
			this.bindEvent();
		},
		initUserPage:function(){
			//userIndex
			var options = {
				"userid":"19"
			}
			Service.getUserIndex(options,function(data){
				
				$('.changenum_ablum').text(data.ablum_count);
				$('.changenum_love').text(data.favorite_count);
			});
		},
		initUserCollectNavPage:function(){
			var options = {
				"userid":"19"
				
			};
			Service.getUserCollectNav(options,function(data){
				$('.story_count').text(data.story_count);
				$('.ablum_count').text(data.ablum_count);
					
			});
		},
		initAlbumsPage:function(){
			var options = {
				"userid":"46",
				"page_no":1,
				"page_size":15
			};
			Service.getUserAlbum(options,function(data){
				User.renderMyAlbumTpl(data.list);
			});
		},
		initCollectPage:function(){
			var options = {

				userid:"19",
				type:'userfavorite',
				page_no:1,
				page_size:20
			}

			Service.getUserCollect(options,function(data){
				User.renderCollectlist(data.list);
			});

		},
		renderMyAlbumTpl:function(storyList){
			var renderData = {
				storyList:storyList
			}
			var output = appFunc.renderTpl(myAlbumTpl,renderData);
			$('#albumlist').html(output);

		},
		renderCollectlist:function(storyList){
			
			var renderData = {
				storyList:storyList
			}

			var output = appFunc.renderTpl(myCollectTpl,renderData);
			 $('#Collectstorylist').html(output);
			



		},
		headalert:function(){
			var myApp = new Framework7();
			//var $$ = Dom7;
 			//- Two groups
			// $('.headphoto').on('click', function () {
			//     var buttons1 = [
			//         {
			//             text: '拍照',
			//             label: true,
			//             color:'black'
			//         },
			//         {
			//             text: '从手机相册选择',
			//             label: true,
			//             color:'black'
			//         }
			//     ];
			//     var buttons2 = [
			//         {
			//             text: '取消',
			//             label: true,
			//             color:'black',
			//             onClick: function () {
			//             	//alert('23')
			//                 myApp.closeModal();
			//             }

			//         }
			//     ];
			//     var groups = [buttons1, buttons2];
			//     myApp.actions(groups);

			// });
 

		},
		chooseImgAction:function(){
			wx.chooseImage({
		      success: function (res) {
		        images.localId = res.localIds;
		        alert('已选择 ' + res.localIds.length + ' 张图片');
		      }
		    });
		},
    	bindEvent: function(){

	        var bindings = [
	        {
	            element: '#settingView',
	            selector: '.J_chooseHeadImg',
	            event: 'click',
	            handler: this.chooseImgAction
	        }];

	        appFunc.bindEvents(bindings);
    	}
	}
	module.exports = User;
