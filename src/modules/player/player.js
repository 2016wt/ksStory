var Service = require('player/server');
    appFunc = require('utils/appFunc');
    storyClazz = require('components/storyLists'),
    //inputModule = require('input'),
    shareModal = __inline('player-share.html'),
    speechModal = __inline('player-speech.html'),
    
    commentModal = __inline('player-comment.html'),
    commentListTpl = __inline('commentList.tpl.html'),
    storyListTpl = __inline('storyList.tpl.html'),
    timinglayerTpl = __inline('player-timinglayer.html'),
    playerBannerListTpl=__inline('player-bannerlist.html'),
    myBrowser=null;

    var startX, x, aboveX = 0;
  	var storyList = null;
  	var page = 1;
  	var currentTimeListen = null;
  	var modeData = ['player-model-all-icon','player-model-loop-icon','player-model-order-icon'];
  	var setTimeListen;
  	var surplus;
	var Player = {
		
		init:function(query){
			var license = {'nav':'typeOne','tag':'typeOne','album':'typeTwo','sysalbum':'typeTwo','sysablum':'typeTwo'};
			if(query){
				sessionStorage.setItem('playerLink',mainView.url);
				sessionStorage.setItem('playerQuery',JSON.stringify(query));
				if(license[query.type] === 'typeOne'){
					this.initStoryLists(query,page);
				}else if(license[query.type] === 'typeTwo'){
					this.initStoryListsByAlbumId(query);
				}else if(query.type&&query.type==='story'){
					this.initSingleStory(query);
				}
			}
			this.initPlayerPage();
			this.swingEvent();
			this.bindEvent();
			this.initBrowserVersion();
			appFunc.initGuideDownload("app-download-link");
			//$('.J_playerPicker').attr('href',HOST+'/page/appDownload.html');
		},
		initPlayerCounter:function(storyId){
			var options={
				storyid:storyId,
				userid:''
			}
			Service.setPlayerCounter(options,function(data){});
		},
		initBrowserVersion:function(){
			var browser = {
       			 	versions: function() {
                		var u = navigator.userAgent, app = navigator.appVersion;
                		//console.log(u);
		                return {//移动终端浏览器版本信息
			                    trident: u.indexOf('Trident') > -1, //IE内核
			                    presto: u.indexOf('Presto') > -1, //opera内核
			                    webKit: u.indexOf('AppleWebKit') > -1, //苹果、谷歌内核
			                    gecko: u.indexOf('Gecko') > -1 && u.indexOf('KHTML') == -1, //火狐内核
			                    mobile: !!u.match(/AppleWebKit.*Mobile.*/) || !!u.match(/AppleWebKit/), //是否为移动终端
			                    ios: !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/), //ios终端
			                    android: u.indexOf('Android') > -1 || u.indexOf('Linux') > -1, //android终端或者uc浏览器
			                    iPhone: u.indexOf('iPhone') > -1 || u.indexOf('Mac') > -1, //是否为iPhone或者QQHD浏览器
			                    iPad: u.indexOf('iPad') > -1, //是否iPad
			                    webApp: u.indexOf('Safari') == -1 //是否web应该程序，没有头部与底部
					        };
					}(),
					language: (navigator.browserLanguage || navigator.language).toLowerCase()
				}
				if(appFunc.isWechat()){
			    		myBrowser = "no";
			    }else{
			    	if (browser.versions.ios || browser.versions.iPhone || browser.versions.iPad) {
			    		myBrowser = "Safari";
				    }else if (browser.versions.android) {
				    		myBrowser = "no";
		   			}
			    }
			    
		},
		initStoryListsByAlbumId:function(query){
			storyApp.showIndicator(); 
			if(query.typeId){
				var albumId = query.typeId,
					that = this,
					options = {
						ablumid:albumId
					},
					isRender = true;
					storyApp.showIndicator();
	        	
				if(sessionStorage.getItem(albumId)){
	        		var dataList = appFunc.getSessionObj(albumId);
	        		that.renderStoryListTpl(dataList);
	    			that.storyPlayerAction(dataList);
	    			isRender = false;
	    			requestAPI();
	    			return ;
	        	}

				requestAPI();

	        	function requestAPI(){
	        		Service.getStoryListByAlbumId(options,function(data){
						if(data.list){
							var storyList = data.list;
							if(storyList){
								sessionStorage.setItem(albumId,JSON.stringify(storyList));
								if(isRender){
									that.renderStoryListTpl(storyList);
									that.storyPlayerAction(storyList,query);
								}
							}
						}
					});
	        	}
			}
		},
		initSingleStory:function(query){
			var	 that = this,
			 	 typeArray = {'story':'2','album':'1'},
			 	 reqType = typeArray[query.type] || '1',
			 	 storyList = [],
			 	 idsArry = [];	
			 	storyApp.showIndicator(); 
			 if(sessionStorage.getItem("recommendList") || sessionStorage.getItem("hotSearchResultList")){
			 	 	var recommendList = null;

			 	 	if(query.target){
					 	recommendList = appFunc.getSessionObj("hotSearchResultList");
			 		}else{
			 			recommendList = appFunc.getSessionObj("recommendList");
			 		}

				 	for(var i = 0; i<recommendList.length; i++){
				 		var item = recommendList[i];
					 	if(item.type){
					 		if(item.type == reqType){
					 			var storyData = getStoryByEveryId(item,query);
					 			if(storyData){
					 				storyList.push(storyData);
					 				break;
					 			}else{
					 				continue;
					 			}
				 			}
					 	}
				 		

				 		if(query.target){
				 			var storyData = getStoryByEveryId(item,query);
				 			if(storyData){
				 				storyList.push(storyData);
				 			}else{
				 				continue;
				 			}
				 		}

				 	}

				 	if(storyList.length>0){
				 		that.renderStoryListTpl(storyList);
						that.storyPlayerAction(storyList);
					}else{
						requestAPI();
					}
			 }else{
			 	requestAPI();
			 }

		 	//请求后台接口  根据故事Id获得故事
		 	function requestAPI(){
		 		idsArry.push(query.storyId);
		 		that.getStoryDetailById(idsArry);
		 	}
		 	

			function getStoryByEveryId(Item,query){
				if(Item.type){
					if(Item.type == '1'){
		 				if(query.albumId == Item.ablumvalue.ablumid){
		 					var storys = Item.ablumvalue.list;
		 					for(var j = 0; j<storys.length; j++){
		 						var every = storys[j];
		 						 if(every.storyid === query.storyId){
		 						 	return every;
		 						 }
		 					}
			 			}
					}

					if(Item.type == '2' || query.target){
						var every = Item.storyvalue;
						if(every.storyid === query.storyId){
		 					return every;
		 				}
		 			}
				}

				
	 			
	 		}	
		},
		getStoryDetailById:function(array){
			var that = this,
				options = {
					storyids:array
				};
			Service.getStorysByIds(options,function(data){
				if(data.list){
					var  playerStoryList = data.list;
					if(playerStoryList){
						that.renderStoryListTpl(playerStoryList);
					 	that.storyPlayerAction(playerStoryList);
					 	sessionStorage.setItem('storyDetail',JSON.stringify(playerStoryList));
					}
				 	
				}		
			});
		},
		playerListAction:function(){
    		var that = this,
    			audio = document.getElementById("audio"),
    			storyKey = parseInt($(this).data('key')),
    			storyId = $(this).data('storyid'),
    			playId = $(audio).data('storyid');
    		if(playId == storyId)	return;
    		if(storyList) 
			{	
				Player.audioReset();
				storyList.playThisStory(storyKey);
				audio.play();
	    		Player.checkStoryHighlight(storyList);
	    		Player.setAudioData(audio,storyList.currentStory);
    		}
    	},
		recordStatus:function(audioObj){
			var playing = $('.J_homePlaying');
			if(playing.length>0){
    			var query = $.parseUrlQuery(mainView.url);
    			if(appFunc.isEmpty(query)){
					query = appFunc.getSessionObj('playerQuery');
				}
    			playing.parent('a').attr('href',HOST+'/page/player.html?type='+query.type+'&storyId='+audioObj.data('storyId')+'&storyName='+audioObj.data('storyName'));
    			playing.attr('src',playing.data('src'));
    			playing.show();
    		}
		},
		playerEvent:function(){
			var target = $(this),
				audio = $("#audio"),
				action = target.data('action');
				
    			switch(action){
		            case 'previous':
		           	    if(storyList.currentIndex == '0') return;
		                storyList.moveToPreviousStory();
		                appFunc.setStatistics('Event',target.data('type'),audio.data('storyname'));
		                break;
		            case 'control':
		                storyList.controlStory();
		                break;
		            case 'next':
		            	if(storyList.currentIndex == (storyList.allStory.length-1)) return;
		                storyList.moveToNextStory();
		                appFunc.setStatistics('Event',target.data('type'),audio.data('storyname'));
		            	break;  
            	}
            if(action!='control'){
            	storyApp.showIndicator();	
	            Player.audioReset();	
	            if(storyList.currentStory) audio[0].play();
	        	Player.checkStoryHighlight(storyList);
	        	Player.setAudioData(audio,storyList.currentStory);
            }	
		},
		storyPlayerAction:function(storys,query,target){
			var that = this,	
			 	audio = document.getElementById("audio"),
			 	audioObj = $(audio),
			 	query = query || $.parseUrlQuery(mainView.url),
			 	target = target,
			 	playIng = $('.J_playerControl'),
			 	playerPageTitle = $('.J_playerPageTitle'),
			 	playerAction = $('.J_playerActionItem'),
			 	timetext = $('.J_timeText'),
			 	setTimeVal = sessionStorage.getItem('setTimeVal'),
			 	audioStatus = audioObj.data('status');

			if(appFunc.isEmpty(query)) query = appFunc.getSessionObj('playerQuery');	

			//记录当前播放状态——设置首页音柱链接
			Player.recordStatus(audioObj);
			//判断是否需要重新创建播放故事
			var  isContinue= Player.isReloadById(audioObj,storys,query);
			
			//初始化播放控件信息
			Player.initAudioInfo(audio);

        	if(!storyList){
        		var currentIndex = 0,
        			storyLists = storyClazz.getStoryList(),
        			isPlayThis = false;

				 storyList = new storyLists(storys,audio,Player.getAllStorys);
				 if(/i(Phone|P(o|a)d)/.test(navigator.userAgent)) storyList.load();
				 if(query){
        		 	for(var i = 0; i<storys.length; i++){
        		 		if(storys[i].storyid == query.storyId){
        		 			currentIndex = i;
        		 			storyList.playThisStory(currentIndex);
        		 			break;
        		 		}
        		 	}
				 }
				 //sessionStorage.setItem('storyList',JSON.stringify(storyList));
        	}	
     
        	if(storyList.currentStory){
        		var current = storyList.currentStory;
        		
        		Player.setAudioData(audio,current);
        		//Player.initCommentLists({'storyId':current.value.id});
        		//监听播放状态
        		Player.playListenAction(audio);
        		Player.checkStoryHighlight(storyList);
        		if(setTimeListen){
        			if(setTimeVal==9999&&setTimeVal==-1&&setTimeVal==0){
        				clearInterval(setTimeListen);
        			}
        		}else{
        			if(setTimeVal&&setTimeVal!=9999&&setTimeVal!=-1&&setTimeVal!=0){
        				Player.sleepTimeEvent(setTimeVal);
        			}
        		}
        		sessionStorage.getItem('timetextVal');
                if(isContinue==false) {//监听播放事件
					//that.dragMove(audio);
					// console.log(sleepMinutes+"-----"+sleepSeconds);
					// timetext.text(sleepMinutes+":"+sleepSeconds);
					
				}else{
					// clearInterval(setTimeListen);
					// if(setTimeVal&&setTimeVal!=9999&&setTimeVal!=-1&&setTimeVal!=0) Player.sleepTimeEvent(setTimeVal);
					audio.play();
				}
        		
        		if(query.type!='story'){
        			if(query.albumName){
        				playerPageTitle.text(query.albumName);
        			}
        		}else{
        			playerPageTitle.text(current.value.name);
        		}
				if(audioStatus!='play'&&audioStatus!='pause') {audio.addEventListener('ended',playerEndListen);}
        		function playerEndListen(e){
        			e.preventDefault();
        			Player.audioReset();
        			var modeDom = $('.J_switchMode').find('i'),
	            		modeTarget = Player.getAndCheckModeInfo(modeData,modeDom),
	            		modeVal = modeTarget.getVal(),
	            		setTimeValEnd = sessionStorage.getItem('setTimeVal');

	            	if(setTimeValEnd==9999){
    					if(modeVal!=='player-model-loop-icon'){
	            		 	if(storyList.currentIndex == (storys.length-1)) {
	        					storyList.resetList();	
				            }else{	
				            	var storyKey = $(audio).data('key');
				            		storyKey = parseInt(storyKey)+1;
				            		storyList.playThisStory(storyKey);
				            }
		            	}
		            	audio.pause();
        			}else{
        				if(modeVal==='player-model-loop-icon'){
	            		 	audio.play();
		            	}else{
			            	if(storyList.currentIndex == (storys.length-1)) {
	        					storyList.resetList();
	        					if(modeVal==='player-model-all-icon'){
		        					audio.play();
			            		}
				            }else{	
				            	var storyKey = $(audio).data('key');
				            		storyKey = parseInt(storyKey)+1;
				            		storyList.playThisStory(storyKey);
				            		audio.play();
				            }
		            	}
        			}
		            Player.checkStoryHighlight(storyList);
	            	Player.setAudioData(audio,storyList.currentStory);
        		}
        	}
		},
		setPlayerTime:function(){
			var iconObj = $('.playerTime-wrap').find('.playerTime-item-iconbg'),
				closeTimeOffLink = $('.J_closeSetTimeLink');
			if($('#playerTime').length==0){
 				$('#modal-container').html(timinglayerTpl);
 				iconObj.eq(0).addClass('playerTime-item-iconbg-active');
			}else{
				storyApp.pickerModal('.picker-playerTime');
    			var cktime = sessionStorage.getItem('setTimeVal'),
    				typeData = {'-1':'timeoff-notOpen','9999':'timeoff-thisOver','10':'timeoff-10minnteOver','20':'timeoff-20minnteOver','30':'timeoff-30minnteOver','60':'timeoff-60minnteOver','90':'timeoff-90minnteOver','0':'timeoff-close',};
    			if(cktime){
    				iconObj.removeClass('playerTime-item-iconbg-active');
    				$('.J_ckIcon').each(function(){
	    				var everyTime = $(this).data('cktime');
	    				if(everyTime==cktime) $(this).addClass('playerTime-item-iconbg-active');
    				});
    				closeTimeOffLink.attr('data-type',typeData[cktime]);
    			}else{
    			   iconObj.eq(0).addClass('playerTime-item-iconbg-active');
    			   closeTimeOffLink.attr('data-type',typeData['-1']);
    			}	
			}
    	},
    	getAndCheckModeInfo:function(arry,val){
			var targetKey = 0,targetVal = '';
			if(arry&&arry.length>0){
				arry.map(function(n,i){
					if(val.hasClass(n)){
						targetKey = i;
						targetVal = n;
					}
				});

			}
			return {
				getKey:function(){
					return targetKey;
				},
				getVal:function(){
					return targetVal;
				}
			}
		},
		audioReset:function(){
			$('#currentTime').text('00:00');
    		var drag = $("#drag"),
	         	speed = $("#speed");
	         	if(drag.length>0 && speed.length>0){
		    		drag[0].style.left = 0 + "px";
	        		speed[0].style.width = 0 + "px";	
		    	}
    	},
		setAudioData:function(audio,current){
			var thisAudio = $(audio),
				totalTime = $('#allTime');

			thisAudio.attr('data-storyId',current.value.id);
    		thisAudio.attr('data-storyName',current.value.name);
    		thisAudio.attr('data-key',storyList.currentIndex);
    		thisAudio.attr('data-totalTime',current.value.totaltime);
    		thisAudio.attr('data-iconurl',current.value.iconurl);
    		totalTime.html(current.value.totaltime);
    		if(appFunc.isWechat()){
    			Player.getKaishuSay();
    		}	
		},
		initWechatShare:function(descText){
			var message = {
	            title:$('.J_playerPageTitle').text(),
	            desc:descText,
	            link:mainView.url,
	            imgUrl:$('#audio').data('iconurl')
        	};
	        appFunc.wechatShareFun(message);
		},
		drawBeauty:function(beauty){
			var control = document.getElementById('control'),
			 	controlImg = control.getContext("2d"),
			 	headImgWidth = $('.J_playerHeadImg').width(),
			 	headImgHeight = $('.J_playerHeadImg').height();
			 	controlImg.drawImage(beauty, 0, 0, headImgWidth,headImgHeight);
		},
		checkStoryHighlight:function(storyData){
			var playerStatus = $('.J_playerStatus'),
			 	playerMask = $('.J_playerMask'),
			 	current = storyData.currentStory,
			 	currentStoryName = $('.J_currentStoryName'),
			 	headImgWidth = $('.J_playerHeadImg').width(),
			 	headImgHeight = $('.J_playerHeadImg').height(),
			 	totalTime = $('#allTime'),
			 	currentId = current.value.id,
			 	nextStory = storyData.nextStory,
			 	previousStory = storyData.previousStory;
			currentStoryName.text(current.value.name);
			var beauty = new Image();
				beauty.src = current.value.coverurl;
				beauty.width = headImgWidth;
				beauty.height = headImgHeight;
			if(beauty.complete){
			   Player.drawBeauty(beauty);
			}else{
			   beauty.onload = function(){
			     Player.drawBeauty(beauty);
			   };
			};
			playerStatus.each(function(){
    			var storyId = $(this).data('storyid');
    			
    			if(storyId !== current.value.id){
    				//$(this).css('color','#666');
    				$(this).removeClass('currenttxt');
    			}else{
    				$(this).addClass('currenttxt');
    			}
    		});
        		
			var maskImg = new Image();
				maskImg.src = current.value.coverurl;
				maskImg.width = '450';
				maskImg.height ="450";
			if(maskImg.complete){
			   	Player.drawMaskImg(maskImg);
			}else{
			   maskImg.onload = function(){
			     Player.drawMaskImg(maskImg);
			   };
			};

			if(nextStory) createPreload('nextId',nextStory.value.coverurl);	
			
			if(previousStory) createPreload('preId',previousStory.value.coverurl);

			function createPreload(id,imgSrc,audioSrc){
				if($('#'+id).length>0){
					$('#'+id).attr('href',imgSrc);
				}else{
					var link = document.createElement("link");
					link.rel = "preload";
					link.as = "image";
					link.id = id;
					link.href = imgSrc;
					document.head.appendChild(link);
				}
				
			}
			
			storyApp.hideIndicator();
		},
		drawMaskImg:function(maskImgdata){
			var mask = document.getElementById('J_playerMask'),
			 	maskImg = mask.getContext("2d");
			 	maskImg.drawImage(maskImgdata, 0, 0, 768, 736);
		},
		isReloadById:function(audio,storys,query){
			var that = this,
				flag = false;
				if(query.storyId === audio.data('storyid')){
					Player.addListenTouch();
					return false;
				}else{
					flag = true; 
				}
	
			if(flag){
				storyList = null;

			}
		},
		getAllStorys:function(storys){
			var storyArray = new Array(),
				imgArray = new Array,
				Story = storyClazz.getStory();
			for(var i = 0; i< storys.length; i++){
				var item = storys[i];
				if(item){
					//Player.preloadingImg(item);
					var story = new Story(item.storyid,item.storyname,item.voiceurl,item.coverurl,item.iconurl,item.timetext);
					storyArray.push({ key: i, value: story });
				}
				continue;
			}
			return storyArray;
		},
		preloadingImg:function(storys){
			var maskWrap = document.getElementById("J_playerMask"),
				audioWrap = document.getElementById("audio");
			//console.log('storys'+JSON.stringify(storys));
			// if(maskWrapObj.length>0 && maskWrapObj.length == storys.length){
			// 	return;
			// }
			// maskWrapObj.length = 0;

			var fragImg = document.createDocumentFragment();
			for(var i = 0; i< storys.length; i++){
				var item = storys[i];
				if(item){
					var imgElement = document.createElement("img");
					$(imgElement).attr('data-src',item.coverurl);
					$(imgElement).attr('data-id',item.storyid);
					$(imgElement).attr('width','100%');
					$(imgElement).attr('height','100%');
					$(imgElement).css('display','none');
					fragImg.appendChild(imgElement);
				}
			}
			maskWrap.appendChild(fragImg);
		},
		initPlayerPage:function(){
			$('.J_swiperNthOne').removeAttr('style');
			var playerSwiper = storyApp.swiper('.player-swiper-container', {
			    pagination:'.swiper-player-pagination',
			    initialSlide:'1',
			    noSwipingClass:'swiper-no-swiping',
			    onSliderMove:function(){
			    	if(playerSwiper.activeIndex=='1'){
			    		$('#J_swing').hide();
			    	}else{
			    		$('#J_swing').show();
			    	}
			    }
			 });
			var activeObj = mainView.activePage,
				activePage = activeObj.name,
				activeQuery = activeObj.query,
				that = this,
				popupOverlay = $('.popup-overlay');
			if(activePage === 'home' || activePage === 'task' || activePage === 'setting' ){
                appFunc.showToolbar();
        	}else{
        		appFunc.hideToolbar();
        	}
        	that.initUserPlayMode();
        	if(popupOverlay.length>0&&popupOverlay.hasClass('modal-overlay-visible')) popupOverlay.removeClass('modal-overlay-visible');
        	$('#modal-container').html(timinglayerTpl);
			$('.playerTime-wrap').find('.playerTime-item-iconbg').eq(0).addClass('playerTime-item-iconbg-active');
        	//$('#modal-container').html(shareModal);
		},
		initStoryLists: function(query,page){
	        var that = this,
	        	options = {
	        		type:query.type,
	        		id:query.typeId,
	        		page_no:page,
	        		page_size:99999,
	        		queryablum:true
	        	},
	        	isRender = true;
	        	storyApp.showIndicator(); 
	      if(sessionStorage.getItem(query.typeId)){

    			var dataList = appFunc.getSessionObj(query.typeId);
        		
        		that.renderStoryListTpl(dataList);
				that.storyPlayerAction(dataList,query);
				isRender = false;
    			requestAPI();
    			return ;			
	        }

	        requestAPI();

	        function requestAPI(){
	        	Service.getStoryLists(options,function(data){
		        	if(data.list){
		        		var dataList = data.list;
		        		if(dataList){
		        			sessionStorage.setItem(query.typeId,JSON.stringify(dataList));
		        			if(isRender){
			        			that.renderStoryListTpl(dataList);
			    				that.storyPlayerAction(dataList,query);
		        			}
		        		}
		        		
		        	}
	        	});
	        }      
    	},
    	getKaishuSay:function(){
    		var audio = $('#audio');
    		Service.getBossTalk({storyid:audio.data('storyid')},function(bossData){
    			Player.initWechatShare(bossData.text);
    		});
    	},
    	initCommentLists:function(query){
    		var that = this,
	        	comment_options = {
	        		storyid:query.storyId,
	        		page_no:'1',
	        		page_size:'20'
	        	};
	        Service.getCommentLists(comment_options,function(commentData){
	             Service.getBossTalk({storyid:query.storyId},function(bossData){
	             	var renderData = {
		    			bossHeadImg:bossData.headimgurl,
		    			bossTalk:bossData.text,
		    			commentList:commentData.list
		    		}
		    		sessionStorage.setItem('bossData',JSON.stringify(bossData));
		    		sessionStorage.setItem('commentList',JSON.stringify(commentData.list));
	            	var output = appFunc.renderTpl(commentListTpl,renderData);
    				$('#J_commentDetal').html(output);
	        	});
	        });  
    	},
    	renderCommentTpl:function(renderData){		
    		var output = appFunc.renderTpl(commentListTpl,renderData);
    		$('#J_commentDetal').html(output);
    	},
    	renderStoryListTpl:function(dataList){
    		var renderData = {
    					HOST:HOST,
		    			storyList:dataList
		    		},
		    	that = this;	
            var output = appFunc.renderTpl(storyListTpl,renderData);
            var dataContainer = $('#storyListsView');
           	dataContainer.html(output);
			storyApp.attachInfiniteScroll($('.infinite-scroll'));
			//初始化故事图片
			Player.preloadingImg(dataList);
			storyApp.hideIndicator();
    	},
    	renderPlayerTpl: function(data, type){
    		var that = this;
    		$('#playerView').html(playerTpl);
    	},
	    timeChange:function(time) {
	    	////播放时间
	        //分钟
	        var time = parseInt(time);
	        var minute = time / 60;
	        var minutes = parseInt(minute);
	        if (minutes < 10) {
	            minutes = "0" + minutes;
	        }
	        //秒
	        var second = time % 60;
	        var seconds = parseInt(second);
	        if (seconds < 10) {
	            seconds = "0" + seconds;
	        }
	        var allTime = "" + minutes + "" + ":" + "" + seconds + "";

	        return allTime;
	    },
	    timeChange2:function(time) {
	    	//默认获取的时间是时间戳改成我们常见的时间格式
	        //分钟
	        var time = parseInt(time);
	        var minute = time / 60;
	        var minutes = parseInt(minute);
	        if (minutes < 10) {
	            minutes = "0" + minutes;
	        }
	        //秒
	        var second = time % 60;
	        var seconds = parseInt(second);
	        if (seconds < 10) {
	            seconds = "0" + seconds;
	        }
	        var allTime = "" + minutes + "" + ":" + "" + seconds + "";
	        $(".currentTime").html(allTime);
	    },
	    initAudioInfo:function(audio){
	    	var that = this;
    		var playerControl = $(".J_playerControl"),
    			playerHeadImg = $("#control"),
    			totalTime = $('#allTime');
    		totalTime.html($(audio).data('totaltime'));
	    	if (audio.paused) {
	            playerControl.removeClass("pause");
                playerHeadImg.removeClass("player-headImg-on");
	        }else{
	        	playerControl.addClass("pause");
                playerHeadImg.addClass("player-headImg-on");
        		//that.dragMove(audio);
	        }
	    },
    	playListenAction:function(audio){
    		//播放事件监听
    		var that = this,
    			playerControl = $(".J_playerControl"),
    			playerHeadImg = $("#control"),
    			playing = $('.J_homePlaying'),
    			totalTime = $('#allTime'),
    			timetext = $('.J_timeText');
    		audio = null;
    		audio = document.getElementById('audio');
   			audio.addEventListener("play",playEvent, false);
	   		audio.addEventListener("pause",pauseEvent, false);
	  		audio.addEventListener("loadeddata",loadeddataEvent, false);
	        audio.addEventListener("timeupdate",timeUpdate,false);
			audio.addEventListener("error",
	            function() { 
	            console.log('audio error .....');
	        });

    		
	   //      audio.addEventListener("canplay",
	   //          function() { 
       //         	//监听播放事件
				// //that.dragMove(audio);
	   //      });
	   		function loadeddataEvent(e){
	   			e.preventDefault();
    			that.addListenTouch();
    		}
	        function pauseEvent(e){
	        	e.preventDefault();
        		playerControl.removeClass("pause");
        		playerControl.addClass("play");
        		if(myBrowser=="Safari"){
        			playerHeadImg.removeClass("player-headImg-on");
        			playerHeadImg.removeClass("player-headImg-off");
        		}else{
        			playerHeadImg.removeClass("player-headImg-on");
        		}
                $(audio).attr('data-status','pause');
                if(playing.length>0){
        			playing.parent('a').attr('href','#');
        			playing.removeAttr('src');
        			playing.hide();
        		}
                if (audio.currentTime == audio.duration) {
                    audio.pause();
                    audio.currentTime = 0;   
                }
	        }    
	        function playEvent(e){
	        	e.preventDefault();
	        	//监听播放
	        	playerControl.removeClass("play");
                playerControl.addClass("pause");
                if(myBrowser=="Safari"){
        			playerHeadImg.addClass("player-headImg-on");
        			playerHeadImg.addClass("player-headImg-off");
        		}else{
        			playerHeadImg.addClass("player-headImg-on");
        		}
                $(audio).attr('data-status','play');
                var key = storyList.currentIndex,
                	upstorykey = sessionStorage.getItem('upstorykey'),
        			timetext = $('.J_timeText'),
        			startlisten = timetext.data('startlisten'),
		    		setTimeVal = timetext.data('cktime'),
		    		sleepStatus = timetext.data('status');
        		// clearInterval(currentTimeListen); 
        		// var currentTimeListen = setInterval(function() {
		          //           var currentTime = audio.currentTime;
		          //           that.timeChange2(currentTime);
		          //       },1000);
        		if(upstorykey!=key){
        			Player.initPlayerCounter($(audio).data('storyid'));	
    				appFunc.setStatistics('Event','player-play',$(audio).data('storyname'));
        			sessionStorage.setItem('upstorykey',key);
        		}
		    	if(sleepStatus=="over"&&startlisten=="false"){
		    		Player.sleepTimeEvent(setTimeVal);
		    	}
	        }
	        function timeUpdate(e){
	        	e.preventDefault();
	         	var drag = $("#drag"),
			         	speed = $("#speed"),
			         	progressBac = $(".player-progressBac").width(),
			         	setTimeVal = sessionStorage.getItem('setTimeVal');
			    	if(drag.length>0 && speed.length>0){
			    		drag[0].style.left = (audio.currentTime / audio.duration) * progressBac + "px";
		        		speed[0].style.width = (audio.currentTime / audio.duration) * progressBac + "px";	
			    	}
		        that.timeChange2(audio.currentTime);

		        if(timetext.data('startlisten')=='true'||setTimeVal==9999){
		        	surplus = (audio.duration)-(audio.currentTime);
        			surplus = that.timeChange(surplus);
        			timetext.text(surplus);
		        }
	         }
    	},   	
	    addListenTouch:function() {
	    	var that = this;
	    	if($("#progressBar").length>0){
	    		document.getElementById("dragTarget").addEventListener("touchstart", that.touchStart, false);
		        document.getElementById("dragTarget").addEventListener("touchmove", that.touchMove, false);
		        document.getElementById("dragTarget").addEventListener("touchend", that.touchEnd, false); 
	    	}  
	    },
	    touchStart:function(e) {
	        e.preventDefault();
	        var touch = e.touches[0];
	        startX = touch.pageX;
	        isMove = true;
	        $('.swiper-slide-active').addClass('swiper-no-swiping');
	        
	    },
	    touchMove:function(e) { //滑动
	        e.preventDefault();
	       $('#audio')[0].pause();
	        if(isMove){

	        	var progressBac = $(".player-progressBac").width();
		        var touch = e.touches[0];
		        x = touch.pageX - startX; //滑动的距离
		        $('.swiper-slide-active').addClass('swiper-no-swiping');
		        //drag.style.webkitTransform = 'translate(' + 0+ 'px, ' + y + 'px)';  //也可以用css3的方式
		        var drag = $("#drag"),
		         	speed = $("#speed"),
		         	progressObj = $(".player-progressBac"),
		         	progressBac = progressObj.width(),
		         	moveLength = aboveX + x,
		         	startLength = progressObj.offset().left,
		         	dragX = drag.offset().left;
		         	if(dragX<=startLength || moveLength<=0){
		         		
		         		drag[0].style.left = 0+ "px"; //
			        	speed[0].style.width = 0+ "px";
		         		isMove =false;
		         	
		         	}
		         	if(moveLength<=progressBac){
		         		drag[0].style.left = moveLength+ "px"; //
			        	speed[0].style.width = moveLength+ "px";
		         	}

			        	
	        }
	        
	    },
	    touchEnd:function(e) { //手指离开屏幕
	        e.preventDefault();
	        $('#audio')[0].play();
	        isMove = false;
	        var progressBac = $(".player-progressBac").width();
	        aboveX = parseInt(drag.style.left);
	        var touch = e.touches[0];
	        var dragPaddingLeft = drag.style.left;
	        var change = dragPaddingLeft.replace("px", "");
	        numDragpaddingLeft = parseInt(change);
	        var currentTime = (numDragpaddingLeft / progressBac) * audio.duration;//30是拖动圆圈的长度，减掉是为了让歌曲结束的时候不会跑到window以外
	        audio.currentTime = currentTime;
	        $('.swiper-slide-active').removeClass('swiper-no-swiping');
	    },
	    dragMove:function(audio) {
	    	var drag = $("#drag"),
	         	speed = $("#speed"),
	         	progressBac = $(".player-progressBac").width();
	    	if(drag.length>0 && speed.length>0){
	    		var dragListen= setInterval(function() {
		            drag[0].style.left = (audio.currentTime / audio.duration) * progressBac + "px";
		            speed[0].style.width = (audio.currentTime / audio.duration) * progressBac + "px";
		            //console.log($("#currentTime").text());
		            if($("#currentTime").text() == $("#allTime").text()){
		            	$(audio).attr('data-over','true');
		            	clearInterval(dragListen);
		            };
	            	//speed[0].style.left = -((window.innerWidth) - (audio.currentTime / audio.duration) * (window.innerWidth - 30)) + "px";
	        	},1000);
	    	}      
	    },
    	storyAction:function(){
    		var that = $(this);
    		that.toggleClass('like-on');
    	},
    	commentAction:function(){
    		var that = $(this),
    			commentId = that.parent('span').data('commentId'),
    			options = {
    				storycommentid:commentId,
  					userid: "100344"
    			};
    		that.toggleClass('player-praise-icon');
			that.toggleClass('praise-on');

			// if(that.hasClass('praise-on')){
			// 	Service.setCmtPraise(options,function(){

			// 	});
			// }else{
			// 	Service.setCmtCancelPraise(options,function(){
					
			// 	});
			// }		
    	},
    	commentEdit:function(){
    		$('#modal-container').html(commentModal);
    	},
    	tabVoicePanel:function(){
			storyApp.closeModal('.popup-comment');
    		$('#modal-container').html(speechModal);
    		storyApp.pickerModal('.player-speech－picker')
    	},
    	storyCommentWrite:function(){
    		var storyId = $('#audio').data('storyid'),
    			commentText = $('#commentText').val(),
				bossData = appFunc.getSessionObj('bossData'),
	    		sessionComment = appFunc.getSessionObj('commentList'),
			 	options = {
				    storyid: storyId,
				    userid: "10001",
				    headimgurl: "http://wx.qlogo.cn/mmopen/Q3auHgzwzM4pGNibBNLR2qRPecG9RzC9jDdiaLcjNaggFpIOcVHuqUMiaZ4ibbDyqqdvEoNmRzbbVjCCyRvsCxqHwg/0",
				    comment: commentText,
				    type: 1
				},
			 	comment_options = {
	        		storyid:storyId,
	        		page_no:'1',
	        		page_size:'20'
	        	};	
    		Service.setCmtComment(options,function(data){
	    		Service.getCommentLists(comment_options,function(commentData){
	    			var renderData = {
	    			bossHeadImg:bossData.headimgurl,
	    			bossTalk:bossData.text,
	    			commentList:commentData.list==null?sessionComment:commentData.list
	    			}
	    			sessionStorage.setItem('commentList',commentData.list);
	            	var output = appFunc.renderTpl(commentListTpl,renderData);
					$('#J_commentDetal').html(output);
	    		});	
	        });
    	},
    	storyShare:function(){
    		$('#modal-container').html(shareModal);
    	},
    	commentVoice:function(){
    		var status = $(this).data('status'),
    		 	voice  = {
					    localId: '',
					    serverId: ''
					  };
    		if(status==='send'){
    			wx.stopRecord({
			      success: function (res) {
			        voice.localId = res.localId;
			      },
			      fail: function (res) {
			        alert(JSON.stringify(res));
			      }
			    });

			     wx.uploadVoice({
			      localId: voice.localId,
			      success: function (res) {
			        alert('上传语音成功，serverId 为' + res.serverId);
			        voice.serverId = res.serverId;
			      }
			    });

			    //storyApp.closeModal('.player-speech－picker')
    		}else if(status==='voice'){
    			$('.J_recordtText').text('点击发送');
    			$(this).attr('data-status','send');
    			wx.startRecord({
				      cancel: function () {
				        alert('用户拒绝授权录音');
				      }
		    	});

		    	// 4.4 监听录音自动停止
				wx.onVoiceRecordEnd({
				    complete: function (res) {
				      voice.localId = res.localId;
				      alert('录音时间已超过一分钟');
				    }
				});
    		}	
    	},
    	deleteVoice:function(){
    		storyApp.closeModal('.player-speech－picker');
    	},
    	playerCommentVoice:function(){
    		var commentAudio = $(this).find('audio');
    		commentAudio[0].play();
    		//audio.play()
    		//console.log('<><><><><><><>'+);
    	},
    	openDownLoadPage:function(){
    		//location.href=HOST+'/page/appDownload.html';
    	},
    	initUserPlayMode:function(){
    		var userMode = sessionStorage.getItem('userMode');
    		if(userMode){
    			var	modeIcon = $('.J_switchMode').find('i'),
    			modeTarget = Player.getAndCheckModeInfo(modeData,modeIcon);
    			modeIcon.removeClass(modeTarget.getVal());
				modeIcon.addClass(userMode);
    		}
    	},
    	switchModeAction:function(event){    		
			var	modeIcon = $(this).find('i'),
				dataLength = modeData.length,
				modeTarget = Player.getAndCheckModeInfo(modeData,modeIcon),
				targetIndex = modeTarget.getKey() || 0;
				targetIndex = targetIndex+1>=dataLength?0:targetIndex+1;
				modeIcon.removeClass(modeTarget.getVal());
				modeIcon.addClass(modeData[targetIndex]);
				sessionStorage.setItem('userMode',modeData[targetIndex]);
			var	modeClass = modeData[targetIndex];
				lastIndex = modeClass.lastIndexOf('-'),
				modeType = modeClass.substring(0,lastIndex);
				$(this).attr('data-type',modeType);
				$(this).attr('data-alisname',$('#audio').data('storyname'));
    	},
    	showPlayerTimeAction:function(){
    		$('.playerTime-wrap').find('.playerTime-item-iconbg').removeClass('playerTime-item-iconbg-active');
    		var itemIcon = $(this).find('.playerTime-item-iconbg'),
    			closeTimeOffLink = $('.J_closeSetTimeLink');
    		itemIcon.toggleClass('playerTime-item-iconbg-active');
    		sessionStorage.setItem('setTimeVal',itemIcon.data('cktime'));
    		closeTimeOffLink.attr('data-cktime',itemIcon.data('cktime'));
    		closeTimeOffLink.attr('data-type',$(this).data('type'));
    		closeTimeOffLink.attr('data-alisname',$('#audio').data('storyname'));
    	},
    	setPlayerTimeAction:function(){
    		$(this).attr('data-alisname',$("#audio").data('storyname'));
    		var  setTimeVal = sessionStorage.getItem('setTimeVal'),
    			 timetext = $('.J_timeText');
    		if(setTimeVal){
    			setTimeVal = parseInt(setTimeVal);
			}else{
				setTimeVal = -1;
			}
    		if(setTimeListen){
    			clearInterval(setTimeListen);
    			setTimeListen = null;
    		}
    		if(setTimeVal==0||setTimeVal==-1||setTimeVal==9999){
    			if(setTimeVal==9999){
    				timetext.attr('data-startlisten','true');
    				timetext.text(surplus);
    			}else{
    				timetext.attr('data-startlisten','false');
    				timetext.text('定时关闭');
    			}
    			return;
    		}else{
    			Player.sleepTimeEvent(setTimeVal);
    		}
    	},
    	sleepTimeEvent:function(setTimeVal){
    			var	sleepMinutes=parseInt(setTimeVal)-1,
			    	sleepSeconds=59;
			    
    			// if(setTimeVal==9999){
    			// 	var audioTime = $('#allTime').text(),
    			// 		index = audioTime.indexOf(':'),
    			// 		length = audioTime.length,
    			// 		audioMinue = parseInt(audioTime.substring(0,index)),
    			// 		audioSeconds = parseInt(audioTime.substring(index+1,length));
    			// 		minutes = audioSeconds==0?audioMinue-1:audioMinue;
    			// 		seconds = audioSeconds;
    			// }
    			
			   
			   setTimeListen = setInterval(function(){
			   	var timetext = $('.J_timeText');
			    	timetext.attr('data-startlisten','false');
			    	timetext.attr('data-cktime',setTimeVal);
			        if(sleepSeconds<10){
			            timetext.text(sleepMinutes+':0'+sleepSeconds);
			        }else{
			            timetext.text(sleepMinutes+':'+sleepSeconds);
			        }
			        sleepSeconds--;
			        if(sleepSeconds<0){
			            sleepSeconds=59;
			            sleepMinutes--;
			        }
			        if(sleepMinutes=='00'&&sleepSeconds=="00"){
        				audio.pause();
        				clearInterval(setTimeListen);
        				setTimeListen = null;
        				timetext.text('00:00');
        				timetext.attr('data-status','over');
        			}else{
        				timetext.attr('data-status','start');
        			}
        			var dataset = {
        				startlisten:timetext.data('startlisten'),
        				cktime:timetext.data('cktime'),
        				status:timetext.data('status')
        			};
			    },1000);
    	},
    	swingEvent:function(){
    		var options = {
	        		'clientType':'web'
	        	};	
    		Service.getplayPageBannerList(options,function(data){
	    		var renderData = {
	          		playerBannerList: data.list
	       		};
           		var output = appFunc.renderTpl(playerBannerListTpl, renderData);
           		$('#J_swingbox').html(output);
           		//data.list.length=0;
           		if(data.list.length>0){
           			$('#J_swingbox').addClass('swingbox-show');
	           			$('#J_swing').touchstart(function(){
			    			var J_swingbox=$('#J_swingbox'),
			    				adverTitle = $('.J_collectLink').data('title'),
			    				storyName = $('.J_playerPageTitle').text();
			    			J_swingbox.toggleClass('up');
			    			if(J_swingbox.hasClass('up')){
			    				$('.mask').hide();
			    				appFunc.setStatistics('Event','player-pendant-close',storyName);
			    			}else{
			    				$('.mask').show();
			    				appFunc.setStatistics('Event','player-pendant-open',storyName);
			    				appFunc.setStatistics('panel','adver',adverTitle);
							}
						})
			    		$('.mask').on('click',function(){
			    			$(this).hide();
			    			$('#J_swingbox').addClass('up');
			    		});
           		}else{
           			$('.albumNav-right-a').show();
           		}
           		

	        });
    	},
    	bindEvent: function(){

	        var bindings = [{
	            element: '#playerView',
	            selector: '.J_playerCollect',
	            event: 'click',
	            handler: this.storyAction
	        },
	        {
	            element: '#playerView',
	            selector: '.J_playerItem',
	            event: 'click',
	            handler: this.playerListAction
	        },
	        {
	            element: '#playerView',
	            selector: '.J_commentPraise',
	            event: 'click',
	            handler: this.commentAction
	        },{
	            element: '#playerView',
	            selector: '.J_commentEdit',
	            event: 'click',
	            handler: this.commentEdit
	        },{
	            element: '#playerNavbar',
	            selector: '.J_playerPicker',
	            event: 'click',
	            handler: this.storyShare
	        },{
	            element: '#playerAction',
	            selector: '.J_playerActionItem',
	            event: 'click',
	            handler: this.playerEvent
	        },{
	            element: '#modal-container',
	            selector: '.J_commentSendBtn',
	            event: 'click',
	            handler: this.storyCommentWrite
	        },{
	            element: '#modal-container',
	            selector: '.J_voiceInput',
	            event: 'click',
	            handler: this.tabVoicePanel
	        },{
	            element: '#modal-container',
	            selector: '.J_recordts',
	            event: 'click',
	            handler: this.commentVoice
	        },{
	            element: '#modal-container',
	            selector: '.J_record_delete',
	            event: 'click',
	            handler: this.deleteVoice
	        },{
	            element: '#J_commentDetal',
	            selector: '.J_commentVoice',
	            event: 'click',
	            handler: this.playerCommentVoice
	        },{
	            element: '#playerView',
	            selector: '.J_playerDownload',
	            event: 'click',
	            handler: this.openDownLoadPage
	        },{
	            element: '#playerView',
	            selector: '.J_playerCollect',
	            event: 'click',
	            handler: this.openDownLoadPage
	        },{
	            element: '#playerView',
	            selector: '.J_playerAddAlbums',
	            event: 'click',
	            handler: this.openDownLoadPage
	        },{
	            element: '#playerAction',
	            selector: '.J_switchMode',
	            event: 'click',
	            handler: this.switchModeAction
	        },{
	            element: '#playerAction',
	            selector: '.J_playerTimeEvent',
	            event: 'click',
	            handler: this.setPlayerTime
	        },{
	            element: '#modal-container',
	            selector: '.J_setTimeItem',
	            event: 'click',
	            handler: this.showPlayerTimeAction
	        },{
	            element: '#modal-container',
	            selector: '.J_closeSetTimeLink',
	            event: 'click',
	            handler: this.setPlayerTimeAction
	        }];	    
	
	        appFunc.bindEvents(bindings);
    	}	
	}
	module.exports = Player;
