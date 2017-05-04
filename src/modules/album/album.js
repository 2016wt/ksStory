var appFunc = require('utils/appFunc'),
	Service = require('album/server'),
    albumStoryListTpl = __inline('album-storys.tpl.html'),
    newAlbumsTpl =__inline('newAlbums.tpl.html'),
    newAlbumsListTpl =__inline('newAlbumslist.tpl.html'),
    homeFloatModal = __inline('../home/homeFloatForPlayer.tpl.html'),
    searchModal = __inline('../home/home-search.html'),
    storyListTpl =  __inline('albumstoryList.tpl.html'),
    storyAndAlbumListTpl =  __inline('albumandstoryList.tpl.html'),
    albumtagsTpl = __inline('albumtags.tpl.html'),
    state = 0,//cichugaidong
    slag = 0,
    page = 1,
    pageNum = 1;


var Album = {
	init:function(query){
		if(query){
			var license = {'nav':'typethree','tag':'typeOne','album':'typeTwo','sysalbum':'typeTwo','sysablum':'typeTwo'};

			if(license[query.type] === 'typethree'){
				this.initStoryLists(query,page);
				this.pagingByScroll(query,page);
			}
			if(license[query.type] === 'typeOne'){
				this.initStoryAndAlbumLists(query,page);
				this.pagingAlbumByScroll(query,page);
			}
			if(license[query.type] === 'typeTwo'){
				this.initStoryListsByAlbumId(query);
			}
			if(query.myinit === '1'){
				Album.listenSortDom();
				setTimeout(function(){
					$('.album-float-one').css({'display':'none'});
						Album.initnewAlbums();
						Album.initnewAlbumsName();
						Album.returnAbulmSelect();
						Album.goToAlbumList();
						Album.listenDomTree();
				},1000);
			}
			if(query.youinit === '2'){
				Album.goEditorName();
				Album.changeLastName();
			}
			if(query.tag === 'editNewAlbumsName'){
				Album.determineName();
			}
			if(query.name === 'myalbum'){
				Album.determineName();
			}
			if(query.name ==='album-list'){
				Album.editorAlbum();
				Album.goToPlayer();
			}
		}else{
			this.initAlbumStoryList();
		}
		var pageName = mainView.activePage.name;
		if(pageName==='newAlbums'){
			Album.changeLastName();
		}
		//$('.J_rightLink').attr('href',HOST+'/page/appDownload.html');
		//this.getStorysByTag();
		this.bindEvent();
	},
	initnewAlbumsName:function(){
		var changeNameValue = sessionStorage.getItem('changeNameValue');
		if(!changeNameValue){
			var initnewAlbumsName = sessionStorage.getItem('newAlbumsName');
			$('.obtainNewAlbumsName').text(initnewAlbumsName);
		}else{
			$('.obtainNewAlbumsName').text(changeNameValue);
		}
	},
	initStoryListsByAlbumId:function(query){
		var that = this;
		$('.J_albumPageTitle').text(query.albumName);
		$('.J_albumPageTitleTwo').text(query.albumName);
		$('.J_albumPageTitle').attr('data-title',query.albumName);
		if(query.id){
			var albumId = query.id,
			options = {
				ablumid:albumId
			};
			// $('.J_allplay').attr('data-type',query.type);
	  //   	$('.J_allplay').attr('data-typeId',query.id);
			Service.getStoryListByAlbumId(options,function(data){
				if(data.list){
					var storyList = data.list;
					var type = 'albumListPage';
	        		sessionStorage.setItem('Album_total_count',JSON.stringify(data.storycount));
					that.renderStoryListTpl(query,storyList,type);
				}
			});
		}else{
			//给用户一个友好反馈
		}
	},
	pagingByScroll:function(query,page){
			var that = this,
				loading = false;
			$('.infinite-scroll').on('infinite',function(){
				if(loading) return;

				var isNext = $('#isMore').val();
				loading=true;

				if(isNext=='true'){
					storyApp.detachInfiniteScroll($('.infinite-scroll'));
					page++;
					storyApp.showIndicator();
					//$('.mask').show();
					that.initStoryLists(query,page);
					loading=false;
				}else{
					//$('.notMore').show();
					
				}
			});
	},
	pagingAlbumByScroll:function(query,page){
			var that = this,
				loading = false;
			$('.infinite-scroll').on('infinite',function(){
				if(loading) return;

				var isNext = $('#isMore').val();
				loading=true;

				if(isNext=='true'){
					storyApp.detachInfiniteScroll($('.infinite-scroll'));
					page++;
					storyApp.showIndicator();
					//$('.mask').show();
					//$('.notMore').hide();	
					that.initStoryAndAlbumLists(query,page);
					loading=false;	


				}else{
					//$('.notMore').show();
				}
			});
	},

	initStoryLists: function(query,page){
	        var that = this,
	        	options = {
	        		type:query.type,
	        		id:query.id,
	        		birthday:'',
	        		page_no:page,
	        		page_size:15
	        	},
	        	isMore = $('#isMore');
	        $('.J_tagPageTitle').text(query.albumName);
	        $('.J_allplay').attr('data-type',query.type);
	        $('.J_allplay').attr('data-typeId',query.id);
	       //  if(sessionStorage.getItem('storyData')){
	       //  		var dataList = sessionStorage.getItem('storyData');
	       //  			dataList = JSON.parse(dataList);
	       //  		that.renderStoryListTpl(dataList);
	    			// return ;
	       //  }
	       storyApp.showIndicator();
	      	//$('.mask').show();
	        Service.getStoryLists(options,function(data){
	        	//console.log(data.result.more)
	        	if(data.result.more==false){
		        // 	$('.notMore').text('没有更多了...');
		        $('.notMore').show();

		         }

	        	if(page==1){
	        		if(query.albumName=='最新故事'){
	        		if(data.errcode==0){
	        			Toast.show('','凯叔决定了今晚讲这些故事');
		        	}else if(data.errcode==-1){
		        		Toast.show('','网络连接失败或凯叔大脑短路>_<');
		        	}else{
		        		Toast.show('','凯叔正在琢磨今天的最新故事...');
		        	}
	        	}else if(query.albumName=='哄睡神器'){
	        		if(data.errcode==0){
	        			Toast.show('','凯叔抱着一摞故事书扑面而来');
		        	}else if(data.errcode==-1){
		        		Toast.show('','网络连接失败或凯叔躲进了小黑屋>_<');
		        	}else{
		        		Toast.show('','正在邀请凯叔...');
		        	}
				}else if(query.albumName=='凯叔叫早'){
	        		if(data.errcode==0){
	        			Toast.show('','凯叔洗漱完毕准备讲新故事啦');
		        	}else if(data.errcode==-1){
		        		Toast.show('','网络连接失败或凯叔赖床成功>_<');
		        	}else{
		        		Toast.show('','正在叫醒凯叔...');
		        	}
				}
	        	}
				
	        	if(data.result.list){
	        		var dataList = data.result.list;
	        		isMore.val('');
	        		if(data.result.more) isMore.val(data.result.more);
	        		var type = page>1?'append':'';
	        		sessionStorage.setItem('storyData',JSON.stringify(dataList));
	        		that.renderStoryListTpl(query,dataList,type);

	        	}
	        });
    },
    initStoryAndAlbumLists:function(query,page){
    	 var that = this,
	        	options = {
	        		tagid:query.id,
	        		page_no:page,
	        		page_size:15
	        	},
	        	isMore = $('#isMore');
	        	$('.J_tagPageTitle').text(decodeURI(query.albumName));
	        	$('.J_tagPageTitle').attr('data-title',decodeURI(query.albumName));
	        	storyApp.showIndicator();
	        	 //$('.mask').show();
		        Service.getStoryAndAlbumList(options,function(data){
		        	//console.log(data.result.more)
		        	if(data.result.more==false){
		        		//$('.notMore').text('没有更多了...');
		        		$('.notMore').show();

		        	}
					 if(page==1){
					 	if(query.albumName=='0~2岁故事' || query.albumName=='3岁+故事' || query.albumName=='6岁+故事'){
			        		if(data.errcode==0){
			        			Toast.show('','凯叔找了一些适合你的故事');
				        	}else if(data.errcode==-1){
				        		Toast.show('','网络连接失败或凯叔躲进了小黑屋>_<');
				        	}else{
				        		Toast.show('','正在邀请凯叔...');
				        	}
			        	}
					 }
		        	if(data.result.list){
		        		var dataList = data.result.list;
		        		isMore.val('');
		        		if(data.result.more) isMore.val(data.result.more);
		        		var type = page>1?'append':'';
		        		sessionStorage.setItem('StoryandAlbum_total_count',JSON.stringify(data.result.total_count));
		        		that.renderStoryAndAlbumListTpl(query,dataList,type);

		        	}
		        });

    },
    /*  1.计算播放次数 过10000时候  变成1W
        */
    countCalculate:function(count){
    	var a = Number(count);
    	if(a<10000){
    		return a;
    	}else{
    		a = a/1000;
    		a = Math.round(a);
    		a = a/10;
    		a.toFixed(1);
    		return a+'W';
    	}
    },
    renderStoryAndAlbumListTpl:function(query,dataList,type){
    		var renderData = {
    					type:query.type,
    					typeId:query.id,
    					HOST:HOST,
    					albumName:$('.J_tagPageTitle').text(),
		    			storyList:dataList,
		    			storyTime:function(){
							return Album.timeChange(this.duration);
						},
						playCount:function(){
							return Album.countCalculate(this.playcount);
						},
			            albumTime:function(){
							return Album.timeChange(this.duration);
						}
		    	},
		    	that = this,
		    	dataContainer,
		    	numberOnly;
		    	if(query.id==='40815'&&query.albumName==='哄睡神器'){
		    		dataContainer = $('#albumOnlyPagelist');
		    		$('#tagContentTop').removeAttr('style');
		    		var activePage = mainView.activePage;
		    		if(activePage&&activePage.from=='right'){
		    			var oSpan = '<span class="playbtn"></span>新建哄睡专辑';
		    			$('.contentTop .right').find('div').html(oSpan);
		    		}
		    		numberOnly = 4;
		    	}else{
		    		dataContainer = $('#albumOnlyPagelist');
		    		numberOnly = 4;
		    	}
            var output = appFunc.renderTpl(storyAndAlbumListTpl,renderData);
            if(type === 'append') {
	            dataContainer.append(output);
	        }else {
	            dataContainer.html(output);
	        }
	        that.initWechatShare($('.J_tagPageTitle').text());
	        appFunc.initGuideDownload("app-download-link");
	        //$('.J_allplay').removeAttr('style');
			storyApp.attachInfiniteScroll($('.infinite-scroll'));

			that.initStorysLink(dataContainer,numberOnly);
    },
    timeChange:function(value) {
	    	var seconds = parseInt(value);// 秒 
			var minutes = 0;// 分 
			var hours = 0;// 小时 
			// alert(theTime); 
			if(seconds > 60) { 
			minutes = parseInt(seconds/60); 
			seconds = parseInt(seconds%60); 
			// alert(theTime1+"-"+theTime); 
			if(minutes > 60) { 
				hours = parseInt(minutes/60); 
				minutes = parseInt(minutes%60); 
			} 
			} 
			var result = ""; 
			if(seconds<10){
				result = "0"+parseInt(seconds); 
			}else{
				result = ""+parseInt(seconds); 
			}
			if(minutes > 0) { 
				 
				if(minutes<10){
					result = "0"+parseInt(minutes)+":"+result;
				}else{
					result = ""+parseInt(minutes)+":"+result;
				}
			} 
			if(hours > 0) { 
				if(hours<10){
					result = "0"+parseInt(hours)+":"+result;
				}else{
					result = ""+parseInt(hours)+":"+result;
				} 
			} 
	      
	        return result;
	},
	initnewAlbums:function(){
		var story,
			options;
			story = sessionStorage.getItem('storyid');
			story = JSON.parse(story);
			options = {
				"storyids":story
			};
			Service.getNewAlbums(options,function(data){
					Album.renderNewAlbums(data.list);
					Album.listenNewAlbumsCount();
			});
	},
	renderStoryListTpl:function(query,dataList,type){
    		var renderData = {
    					type:query.type,
    					typeId:query.id,
    					HOST:HOST,
    					albumName:query.albumName,
		    			storyList:dataList,
		    			playCount:function(){
		    				return Album.countCalculate(this.playcount);
		    			},
		    		},
		    	that = this,
		    	numberOnly;
		    	if(type==="albumListPage"){
		    		var dataContainer = $('#albumPagelist');
		    		numberOnly = 1;
		    		var oSpan = '<span class="downbtn"></span>全部下载';
		    		$('.contentTop .right').find('div').html(oSpan);
		    	}else if(type==="nav"){//判断进入的 标签第一个
		    		var dataContainer = $('#albumOnlyPagelist');
		    		numberOnly = 2;
		    	}
		    	else{//判断进入的是全部故事分类
		    		var dataContainer = $('#albumOnlyPagelist');
		    		numberOnly = 3;
		    	}
            var output = appFunc.renderTpl(storyListTpl,renderData);
            if(type === 'append') {
	            dataContainer.append(output);
	        }else {
	            dataContainer.html(output);
	        }
	        that.initWechatShare($('.J_albumPageTitle').text());
	        appFunc.initGuideDownload("app-download-link");
	        //allplayLink.removeAttr('style');

			storyApp.attachInfiniteScroll($('.infinite-scroll'));
			that.initStorysLink(dataContainer,numberOnly);
			//allplayLink.attr('href',dataContainer.find('a').data('href'));
	},
	initWechatShare:function(title){
		var shareImgObj = $('.J_albumPageList').find('li').eq(0),
			shareImg = shareImgObj.find('img').attr('src'),
			shareLink = mainView.url;
		if(shareLink.indexOf('.com')<0)	shareLink = HOST+'/'+shareLink;
		var message = {
	            title:title,
	            desc:'没有故事，不成童年',
	            link:shareLink,
	            imgUrl:shareImg
        };
		appFunc.wechatShareFun(message);
	},
    initStorysLink:function(eventWrap,numberOnly){
    	eventWrap.find('a').each(function(){
    		$(this).attr('href',$(this).data('href'));
    	});
    	var oNumber,
    		oI;
    	if(numberOnly===1){
    		oNumber = sessionStorage.getItem('Album_total_count');
    	}else if(numberOnly===2){
    		oNumber = sessionStorage.getItem('StoryandAlbum_total_count');
    	}
    	else if(numberOnly===4){
    		oNumber = sessionStorage.getItem('StoryandAlbum_total_count');
    	}else{
    		oNumber = sessionStorage.getItem('Album_total_count');
    	}
    	oI = $('.contentTop .left div i');
    	var activePage = mainView.activePage;
    	if(activePage&&activePage.from=='left'){
    		oI.text(oI.data('count'));
    	}else{
    		oI.attr('data-count',oNumber);
    		oI.text(oNumber);
    	}
    	
    },
    /*
		首页新建专辑入口
		1.新建专辑
		2.获取session  生日
		3.通过现在的时间减去 session  然后在算出 孩子几岁 来进行 tagid 的判断
    	*/
	initAlbumStoryList:function(){
		var that = this,
			options,
			oBirthday,
			num,
			index;
			//这里是假设   已经存储了小孩的生日
			// oBirthday = sessionStorage.getItem('babyBirthday');
			// oBirthday = appFunc.ageCalculation(oBirthday);
			oBirthday = 5;
			if(oBirthday<=2){
				index = 0;
				num = '40788';
			}else if(oBirthday > 2 && oBirthday <= 3){
				index = 1;
				num = '40703';
			}else{
				index = 2;
				num = '40728';
			}
			options = {
			};
			Service.getThisAlbumTag(options,function(data){
				that.renderTagWrap(data.list,index,num);
			});
			that.pagTagAlbumByScroll(num,pageNum);
	},
	/*
		1.初始化页面时候进入 根据用户输入的生日来确定渲染哪个专辑 渲染默认第一个专辑
		2.这里需要更改  根据用户传入的生日 来确定进入时候的默认列表
		*/
	renderTagWrap:function(data,index,num){
		if(data){
			// var  output = '';
			// for(var i = 0; i<data.length; i++){
			// 	var item = data[i];
			// 	output += '<li class="J_tagItem tag-item" data-tagid='+item.tagid+' data-tagval='+item.tagvalue+'>'+item.tagname+'</li>';
			// }
			var renderData = {
				storyList:data
			}
			var output = appFunc.renderTpl(albumtagsTpl,renderData);
		}
		$('#tagWrapView').html(output);
		$('.tagid').eq(index).addClass('changered');
		var text = $('.tagid').eq(index).text();
		$('.J_albumPageName').text(text);
		var tagId = $('.tagid').eq(index).data('tagid');
		var that = this,
			options = {
				type:'tag',
				'id':num,
				page_no:pageNum,
				page_size:'20',
				queryablum:true
			},
			isMore = $('#albumView');
			console.log(isMore);
			Service.getStorysByTag(options,function(data){
				if(data.result.more) isMore.attr('data-more','');isMore.attr('data-more',data.result.more);
				// if(data.result.more==false){
    //    				$('.notMore').show();
		  //       }
				if(data.result.list){
	        		var dataList = data.result.list;
	        		// isMore.val('');
	        		//if(data.result.more) isMore.val(data.result.more);
	        		var type = pageNum>1?'append':'';
	        		//sessionStorage.setItem('storyData',JSON.stringify(dataList));
	        		that.renderAlbumStorys(dataList,type);
	        	}
			});
	},
	/*
		1.分页加载
		*/
	pagTagAlbumByScroll:function(tagId,pageNum){

			var that = this,
				loading = false;
				storyApp.attachInfiniteScroll($('.infinite-scroll'));
			$('.infinite-scroll').on('infinite',function(){
				console.log('1111')
				if(loading) return;
				var isNext = $('#albumView').data('more');

				loading=true;

				if(isNext=='true'){
					storyApp.detachInfiniteScroll($('.infinite-scroll'));
					pageNum++;
					storyApp.showIndicator();
					that.getStorysByTag(tagId,pageNum);
					loading=false;
				}else{
					//$('.notMore').show();
				}
			});
	},
	/*
		根据tags的专辑Id  获得专辑列表
		*/
	getStorysByTag:function(tagId,pageNum){
		console.log("aaaaa");
		var that = this,
			options = {
				type:'tag',
				'id':tagId,
				page_no:pageNum,
				page_size:20,
				queryablum:true
			},
			isMore = $('#albumView');
			storyApp.showIndicator();
			Service.getStorysByTag(options,function(data){
				if(data.result.more) isMore.attr('data-more','');isMore.attr('data-more',data.result.more);
		      	if(data.result.more==false){
       				$('.notMore').show();
		        }
	        	if(data.result.list){
	        		var dataList = data.result.list;
	        		// isMore.val('');
	        		// if(data.result.more) isMore.val(data.result.more);
	        		var type = pageNum>1?'append':'';
	        		//sessionStorage.setItem('storyData',JSON.stringify(dataList));
	        		that.renderAlbumStorys(dataList,type);
	        	}
			});
	},
	/*
		tags获取点击哪个tag  列表替换哪个
		*/
	tagCheckAction:function(){
		$('.album-tag-panel').toggleClass('album-tag-panel-on');
		$('.album-tag-content').toggleClass('album-tag-content-on');
		var tagId = $(this).data('tagid');
		var tagTagval = $(this).text();
		$('.J_albumPageName').text(tagTagval);
		$(this).parent().parent().parent().find(".J_tagItem").removeClass('changered');
		$(this).addClass('changered');
		$('.newAlbums-symbol').toggleClass('newAlbums-symbol-on');
		pageNum = 1;
		$('#albumView').html('');
		Album.getStorysByTag(tagId,pageNum);
		storyApp.detachInfiniteScroll($('.infinite-scroll'));
		Album.pagTagAlbumByScroll(tagId,pageNum);
	},
	/*
		根据tagID渲染页面
		*/
	renderAlbumStorys:function(storyList,type){
		var renderData = {
				storyList:storyList
			},
			dataContainer = $('#albumView'),
			output = appFunc.renderTpl(albumStoryListTpl,renderData);
			if(type === 'append') {
	            dataContainer.append(output);
	        }else {
	            dataContainer.html(output);
	        }
	},
	/*
		返回专辑tags 选择页面
		*/
	returnAbulmSelect:function(){
		//如果页面的数据有改动 则执行是否保存  否则不执行
		if(state=='0'){
			$('.J_returnAbulmSelect').click(function(){
				mainView.router.back('page/albums.html?backto=12');
			});
		}else{
			$('.J_returnAbulmSelect').click(function(){
				storyApp.modal({
					//title:  '您确定要删除这个故事吗？',
						text: '操作未保存，确定要离开？',
					buttons: [
					{
						text: '确定',
						onClick: function() {
							//mainView.router.reloadPage('page/albums.html?backto=12');
							mainView.router.back('page/albums.html?backto=12');
						}   
					},
					{
						text: '取消',
						onClick: function() {
							
						}
					},]
					});
			});
		}

	},
	renderNewAlbums:function(storyList){
		var renderData = {
	    	storyList:storyList
	    }
        var output = appFunc.renderTpl(newAlbumsTpl,renderData);
		$('#newAlbumsViewUl').html(output);
		Album.setNewActionCount();
	},
	renderNewAlbumsList:function(storyList){
		var renderData = {
			storyList:storyList
		}
		var output = appFunc.renderTpl(newAlbumsListTpl,renderData);
		$('#newAlbumlistUlTwo').html(output);
	},
	/*
		监听播放次数
		*/
	listenNewAlbumsCount:function(){
		$('.J_newAlbumsReduce').click(function(){
			state = 1;
			var val = $(this).next().html();
				val--;
				if(val<1){
					//首先  为零的时候 弹出 确认窗
					$(this).next().html("1");
					var ind = $(this).parent().parent().parent().parent().index();
					//监听用户点击 确认 还是 取消
					//如果是确认 执行以下代码
					storyApp.modal({
					//title:  '您确定要删除这个故事吗？',
						text: '您确定要删除这个故事吗？',
						buttons: [
						{
							text: '确定',
							onClick: function() {
								$('#newAlbumsViewUl').children('.newAlbums-list-li').eq(ind).remove();
								Album.setNewActionCount();
							}
						},
						{
							text: '取消',
							onClick: function() {
								$('#newAlbumsViewUl').children('.newAlbums-list-li').eq(ind).find('.J_newAlbumsCount').html('1');
							}
						},]
					});

				}else if(val>=1){
					$('.album-float-two').css({'display':'none'});
					$(this).next().html(val);
				}
				Album.setNewActionCount();
		});
		$('.J_newAlbumsAdd').click(function(){
			state = 1;
			var val = $(this).prev().html();
				val++;
				if(val>9){
					$(this).prev().html(9);
				}else{
					$(this).prev().html(val);
					$('.album-float-two').css({'display':'none'})
					Album.setNewActionCount();
				}
		});
		Album.goEditorName();
	},
	/*
		监听者页面 dom value 是否变化
		*/
	listenDomTree:function(){
		$('.J_listenDomTree').click(function(){
			if(state != 0){
				storyApp.modal({
					text: '操作未保存，确定要离开？',
					buttons: [
					{
						text: '确定',
						onClick: function() {
							var URL = HOST+'/page/albumsName.html';
							mainView.router.back(URL);
						}
					},
					{
						text: '取消',
						onClick: function() {

						}
					},]
				});
			}else{
				var URL = HOST+'/page/albumsName.html';
				mainView.router.back(URL);
			}
		});
	},
	/*
		监听者页面 domTree 是否变化
		*/
	listenSortDom:function(){
		var _script = document.createElement('script');
			_script.type = "text/javascript";
      		_script.src = "http://framework7.taobao.org/dist/js/framework7.min.js";
       		document.head.appendChild(_script);
			var myApp = new Framework7();
			document.addEventListener('DOMNodeInserted',function(){state = 1;},false);
			document.addEventListener('DOMAttrModified',function(){state = 1;},false);
			document.addEventListener('DOMNodeRemoved',function(){state = 1;},false);
	},

	checkAlbumItem:function(){
		$(this).toggleClass('item-ck-on');
		$(this).find("i").toggleClass('item-ck-on');
		Album.setActionCount();
	},
	checkAllItem:function(){
		$(this).toggleClass('item-ck-on');
		if($(this).hasClass('item-ck-on')){
			$('.J_albumItem').addClass('item-ck-on');
		}else{
			$('.J_albumItem').removeClass('item-ck-on');
		}
		Album.setActionCount();
	},
	setActionCount:function(){
		var hour=0,minute=0,second = 0,count=0;
		$('.J_albumItem').each(function(){

			if($(this).hasClass('item-ck-on')){
				count++;
				var thisTime = $(this).data('storytime'),
				dataTime = thisTime.split(":");

				if(appFunc.countSubstr(thisTime,':')==1){

					minute += parseInt(dataTime[0]);
					second += parseInt(dataTime[1]);

				}else if(appFunc.countSubstr(thisTime,':')==2){
					hour += parseInt(dataTime[0]);
					minute += parseInt(dataTime[1]);
					second += parseInt(dataTime[2]);
				}
			}

		});

		function timeChage(hour,minute,second){
			if(second>=1){
				minute += second/60;
				second = parseInt(second%60);
				if(second<10) second = '0'+second;
			}else{
				second = '00';
			}

			if(minute>=1){
				hour +=minute/60;
				minute = parseInt(minute%60);
				if(minute<10) minute = '0'+minute;
			}else{
				minute = '00';
			}

			if(hour>=1){
				hour = parseInt(hour)+':';
			}else{
				hour = '';
			}
			return hour+minute+":"+second;
		}

		var allTime = timeChage(hour,minute,second);
		$('.J_ckStoryTotal').text(count);
		$('.J_ckStoryAllTime').text(allTime);
	},
	setNewActionCount:function(){
		var hour=0,minute=0,second = 0,count=0,allcount=0;
		$('.newAlbums-list-li').each(function(){
				count = $(this).find('.J_newAlbumsCount').text();
				var thisTime = $(this).find('.newAlbums-listRight-text').data('storytime'),
				dataTime = thisTime.split(":");

				if(appFunc.countSubstr(thisTime,':')==1){

					minute += parseInt(dataTime[0]*count);
					second += parseInt(dataTime[1]*count);

				}else if(appFunc.countSubstr(thisTime,':')==2){
					hour += parseInt(dataTime[0]*count);
					minute += parseInt(dataTime[1]*count);
					second += parseInt(dataTime[2]*count);
				}
				allcount += parseInt(count);
		});
		function timeChage(hour,minute,second){
			if(second>=1){
				minute += second/60;
				second = parseInt(second%60);
				if(second<10) second = '0'+second;
			}else{
				second = '00';
			}

			if(minute>=1){
				hour +=minute/60;
				minute = parseInt(minute%60);
				if(minute<10) minute = '0'+minute;
			}else{
				minute = '00';
			}

			if(hour>=1){
				hour = parseInt(hour)+':';
			}else{
				hour = '';
			}
			return hour+minute+":"+second;
		}

		var allTime = timeChage(hour,minute,second);
		$('.newAlbums-action-allCount').text(allcount);
		$('.newAlbums-action-allTime').text(allTime);
	},
	showTagPanel:function(){
		// $('.album-tag-panel').toggleClass('album-tag-panel-on');
		// $('.modal-overlay').toggleClass('album-tag-panel-bg');
		$('.album-tag-panel').toggleClass('album-tag-panel-on');
		$('.album-tag-content').toggleClass('album-tag-content-on');
		$('.newAlbums-symbol').toggleClass('newAlbums-symbol-on');

	},
	/*
		跳转 编辑 专辑名字
		*/
	goEditorName:function(){
		$('.J_goEditorName').click(function(){
			state = 1;
			var URL = HOST+'/page/editNewAlbumsName.html?tag=editNewAlbumsName';
			mainView.router.loadPage(URL);
		})
	},
	/*
		判断编辑专辑名字是否存在
		*/
	determineName:function(){
		$('.J_determineName').click(function(){
			var nameValue,
				options;
				val = $('#editNewAlbumsNameValue').val();
				if(val!=''){
					nameValue = $('#editNewAlbumsNameValue').val();
					options ={
						"userid":"46",
						"ablumname":nameValue
					};
					Service.getCheckAlbumsName(options,function(data){
							if(data.nameexists==false){
								sessionStorage.setItem("changeNameValue",nameValue);
								var URL = HOST+'/page/newAlbums.html?backto=newAlbums';
								mainView.router.back(URL);
							}else{
								storyApp.modal({
									text: '专辑名称重复，请重新输入！！！',
									buttons: [
									{
										text: '确定',
										onClick: function() {
											$('#editNewAlbumsNameValue').val('');
											$('#editNewAlbumsNameValue').focus();
										}
									},
									]
								});
							};
					});
				}else{
					alert("您输入的名字重复啦！！！")
				}
			});
		
	},
	/*
		获取用户编辑专辑名字
		*/
	changeLastName:function(){
		var changeLastName = sessionStorage.getItem('changeNameValue');
			if(changeLastName){
				$('.obtainNewAlbumsName').text(changeLastName);
			}
	},
	/*
		专辑列表页面  编辑执行
		*/
	editorAlbum:function(){
		$('.J_editorAlbum').click(function(){
			var URL = HOST+'/page/newAlbums.html';
			mainView.router.back(URL);
		})
	},
	goNewAlbums:function(){
		var classStyle = $('.item-ck-on').length;
		if(classStyle==0){
			alert('您还没有选择故事');
			return;
		}else{
			var arr = [],
			options,
			URL,
			optionsTwo;
			$('.J_albumItem').each(function(index){
				if($(this).hasClass('item-ck-on')){
					var currentId = $(this).data('storyid');
					arr.push(currentId);
				}
			});
			arr = JSON.stringify(arr);
			sessionStorage.setItem("storyid",arr);
			options = {
				"userid":"46"
			};
			Service.getAlbumsName(options,function(data){
				if(data){
					sessionStorage.setItem("newAlbumsName",data.ablumname);
				}
			});
			URL = HOST+'/page/newAlbums.html?myinit=1';
			mainView.router.loadPage(URL);
		}
	},
	goToAlbumList:function(){
			$('.J_goToAlbumList').click(function(){
					var arr = [],
						options,
						newAlbumsName;
						$('.newAlbums-list-li').each(function(index){
							var obj;
							var currentId = $(this).find('.newAlbums-listRight-text').data('storyid');
							var currentCount = $(this).find('.J_newAlbumsCount').text();
							obj= {
								storyid:currentId,
								repeatcount:currentCount
							};
							arr.push(obj);
						});
						arr = JSON.stringify(arr);
						sessionStorage.setItem("storyarr",arr);
						newAlbumsName = $('.obtainNewAlbumsName').text();
						arr = JSON.parse(arr);
						if(slag != 0){
								options = {
									"userid": "46",
								    "ablumid":sessionStorage.getItem('ablumid'),
								    "ablumname": newAlbumsName,
								    "list": arr
								};
								Service.updateAlbums(options,function(data){
									if(data.errcode=='0'){
										var URL = HOST+'/page/album-list.html?name=album-list';
										mainView.router.loadPage(URL);
									}
								});
						}else{
							slag = 1;
							options = {
								"userid": "46",
							    "ablumid":"",
							    "ablumname": newAlbumsName,
							    "list": arr
							};
							Service.createAlbums(options,function(data){
								if(data.errcode=='0'){
									sessionStorage.setItem('ablumid',data.result.ablumid);
									var URL = HOST+'/page/album-list.html?name=album-list';
									mainView.router.loadPage(URL);
								}
							});
						}
			});
	},
	/*
		跳转到播放页面
		*/
	goToPlayer:function(){
			var story,
				arr = [],
				options,
				ablumid,
				URL,
				changeNameValue;
				changeNameValue = sessionStorage.getItem('changeNameValue');
				if(changeNameValue){
					$('.albumListNav').html(changeNameValue);
				}else{
					$('.albumListNav').html(sessionStorage.getItem('newAlbumsName'));
				}
				story = sessionStorage.getItem("storyarr");
				story = JSON.parse(story);
				for(var i=0;i <story.length;i++){
					var storyid = story[i].storyid;
					arr.push(storyid);
				}
				ablumid = sessionStorage.getItem('ablumid');
				options = {
					"ablumtype":"1",
					"ablumid":ablumid,
					"userid":"46"
				};
				Service.getEveryAlbums(options,function(data){
						Album.renderNewAlbumsList(data.list);
						Album.listenNewAlbumsAdd(story);
				});
				$('.J_goToPlayer').click(function(){
					sessionStorage.setItem("storysIdArr",arr);
					//下面这行需要改 userId  没有获取
					URL = HOST+'/page/player.html?type=album&typeId='+ablumid+'&userId='+userId;
					mainView.router.loadPage(URL);
				})
	},
	/*
		监听add事件
		*/
	listenNewAlbumsAdd:function(arr){
			$('.J_playerAddAlbums').click(function(){
				var URL,
					obj,
					ind = $(this).parent().parent().parent().parent().parent().index();
					obj ={
						"storyid":$('.swipeout').eq(ind).data('storyId'),
						"repeatcount":$('.swipeout').eq(ind).data('repeatcount'),
					};
					obj = JSON.stringify(obj);
					//将每条数据存在session中
					sessionStorage.setItem("newStorysforAlbum",obj);
					//跳转到我的专辑页面
					URL = HOST+'/page/myalbum.html?name=myalbum';
					mainView.router.loadPage(URL);
			});
	},
	/*
		添加单个故事到专辑
		*/
	appendSingleStory:function(){
		var i,
			obj,
			options;
			$('.J_goToAlbumlistEditor').click(function(){
				i = this
			});
			obj = sessionStorage.getItem("newStorysforAlbum");
			options = {
				"userid": "46",
			    "ablumid":ablumid,
			    "list": obj
			};
			Service.appendStory(options,function(data){
			});
	},
	//播放专辑所有
	playerAllAction:function(){
		var type,
			URL,
			typeId;
			type = $(this).data('type');
			typeId = $(this).data('typeId');
			if(appFunc.isEmpty(type)||appFunc.isEmpty(typeId)){
				Toast.show('','宝贝儿,故事正在努力奔跑~');
				return;
			}
			URL = HOST+'/page/player.html?type='+type+'&typeId='+typeId+'&albumName='+$('.J_albumPageTitle').text();
			mainView.router.loadPage(URL);
	},
	bindEvent: function(){

        var bindings = [{
            element: '#albumView',
            selector: '.J_albumItem',
            event: 'click',
            handler: this.checkAlbumItem
        },{
            element: '#albumHeadView',
            selector: '.J_albumAllCK',
            event: 'click',
            handler: this.checkAllItem
        },{
            element: '#albumNavbar',
            selector: '.J_albumPageTitle',
            event: 'click',
            handler: this.showTagPanel
        },{
            element: '#tagWrapView',
            selector: '.J_tagItem',
            event: 'click',
            handler: this.tagCheckAction
        },{
            element: '#albumAction',
            selector: '.J_goNewAlbums',
            event: 'click',
            handler: this.goNewAlbums
        }
        ];

        appFunc.bindEvents(bindings);
	}
}
module.exports = Album;