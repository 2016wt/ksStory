

var Service = require('home/server'),
    appFunc = require('utils/appFunc'),
    //inputModule = require('input'),
    Template = __inline('home.tpl.html'),
    bannerTpl = __inline('homeBanner.tpl.html'),
    homeSearchTpl =__inline('homeSearch.tpl.html'),
    homeSearchResultTpl =__inline('homeSearchResult.tpl.html'),
    searchModal = __inline('home-search.html'),
    homeFloatModal = __inline('homeFloat.tpl.html'),
    homeSearchEmptyTpl = __inline('homeSearchEmpty.tpl.html'),
    touchTpl=__inline('touch.tpl.html'),
    pageNumber = 1,
    pageNum = 1;
	var Home = {
		init:function(query){
			// var url = 'http://weixin.kaishustory.com/html5-test/reponse.html?fans_id=1219246909&open_id=onSqzjvHhon3HMfWxZy6oiObvuXM&subscribe=1&nickname=%E5%BC%A0%E4%B8%89&sex=1&country=%E4%B8%AD%E5%9B%BD&province=%E5%8C%97%E4%BA%AC&city=%E6%B5%B7%E6%B7%80&avatar=http%3A%2F%2Fwx.qlogo.cn%2Fmmopen%2FVO8Z4IMAYrwPbxdrYhPCwLxiaNhjCRz0bg56JrbaRicSMQTZFTtcuUYL9bcL7LKyOq9n1eaGC6h67Cc3TSWCZY6G11N5SgeWut%2F0&app_id=446b05cca8309cd80d&timestamp=2016-05-18+20%3A37%3A36&custom=openid&sign_keys=app_id%2Cavatar%2Ccity%2Ccountry%2Ccustom%2Cfans_id%2Cnickname%2Copen_id%2Cprovince%2Csex%2Csign_keys%2Csubscribe%2Ctimestamp&sign=2dee2b20ab5ceef7d4fd4f8e769d9e89';
	  		// var query = $.parseUrlQuery(decodeURI(url));
	        // console.log('Transform : '+JSON.stringify(query));
	        // console.log('Link : '+encodeURI(query.open_id));
			//console.log("This is Home.....");
			//this.getTimeline();
			//var openId = sessionStorage.getItem('openId');
			if(query){
				if(query.begin=='search'){
					Home.renderSearchResultTpl(pageNumber);
					Home.searchPageByScroll(pageNumber);
					Home.renderSearchResultDouble(pageNum);
				}
				if(query.type=='touch'){
					Home.touchevent();
				}
			}
			this.initHomePage();
			this.bindEvent();
			var ptrContent = $('.pull-to-refresh-content');
				
			// 添加'refresh'监听器
			ptrContent.on('refresh', function (e) {
				Home.initHomePage();
			});	
			appFunc.initGuideDownload("app-download-link");

		},
		initHomePage:function(){
			var that = this,
				myDate = new Date(),
				hours = myDate.getHours(),
				itemIcon= $('.J_menuItem'); 
				itemIcon.find('span').removeClass('menu-item-highlight'),
				page = 1;
				
			// if(5 <= hours && hours < 10){
			// 	itemIcon.eq(2).find('span').addClass('menu-item-highlight');
			// }else if((12 <= hours && hours < 15) || (17 <= hours && hours < 24)){
			// 	itemIcon.eq(1).find('span').addClass('menu-item-highlight');
			// }

			that.initBannerData();
			that.getStoryList(page);
			that.checkPlayerStatus();
			that.pagingByScroll();

			var message = {
	            title:'凯叔讲故事',
	            desc:'没有故事，不成童年',
	            link:mainView.url,
	            imgUrl:$('#homeShareImg').data('src')
        	};
	        appFunc.wechatShareFun(message);
		},
		scrollHeadFun:function(){
			$(".page-content").scroll(function(event){	
			  var e = $(event.target).scrollTop(),
			  	headWrap =  $("#homeHead");
			  if(e>100) {
			  	headWrap.addClass("homeHead-scroll");
			  }else{
				headWrap.removeClass("homeHead-scroll");
			  }					  
			});
		},
		initBannerData:function(){
			var that = this,
				isRender = true;

			if(sessionStorage.getItem('bannerList')){
        		var bannerList = appFunc.getSessionObj('bannerList');
        		if(bannerList) that.renderBannerTpl(bannerList);
    			isRender = false;
    			requestAPI();
    			// setTimeout(function(){
    			// 	requestAPI();
    			// },5000);
    			return ;
        	}

			requestAPI();

        	function requestAPI(){
        		Service.getHomeBanner({clientType:'web'},function(data){
					if(data.list.length>0){
						$('.bannerbox').css({'visibility':'visible'});
						var bannerList = data.list;
						sessionStorage.setItem('bannerList',JSON.stringify(bannerList));
						if(isRender){
							that.renderBannerTpl(bannerList);
						}
					}else{
						sessionStorage.setItem('bannerList',null);
					}
	        	});
        	}
			
		},
		checkPlayerStatus:function(){
			var audio = $('#audio'),
				status = audio.data('status'),
				playing = $('.J_homePlaying');
			if(status){
				if(playing.length>0){
					var  playQuery = sessionStorage.getItem('playerLink'),
						 queryObj = $.parseUrlQuery(playQuery),
						 storyID = audio.data('storyid');
						 
						 if(appFunc.isEmpty(queryObj)){
							queryObj = appFunc.getSessionObj('playerQuery');
						 }
						 var URL,param = '';
					 	 if(playQuery.indexOf('?')>0){
					 		URL = playQuery.substring(0,playQuery.indexOf('?')+1);
					 	 }else{
					 		URL = HOST+'/page/player.html?';
					 	 }
					 	 
						 if(storyID==queryObj.storyId){
						 	param = $.serializeObject(queryObj);
						 	playing.parent('a').attr('href',URL+param);
						 }else{
						 	queryObj.storyId = storyID;
						 	queryObj.storyName = audio.data('storyname');
						 	queryObj.storyStatus = audio.data('status');
						 	param = $.serializeObject(queryObj);
						 	playing.parent('a').attr('href',URL+param);
						 }

		    			if(status==='play')
		    			{
							playing.attr('src',playing.data('src'));
							playing.show();
		    			}else{
		    				playing.hide();
		    			}     			
        		}
			}
		},
		getStoryList:function(){
			var that = this,
				options = {
				  userid:"",
				  sex:1,
				  birthday:"",
				  page_no:page,
				  page_size:10
				},
			storyView = $('#recommedStorysView'),
			isRender = true;

			var isNext = storyView.data('more');
			if(isNext=='false') return;
			if(page==1){
				var homePage1 = appFunc.getSessionObj('homePage1');
				if(homePage1){
					if(homePage1.more) storyView.attr('data-more','');storyView.attr('data-more',homePage1.more);
		        		var type = page>1?'append':'';
		        		that.renderRecommedTpl(homePage1,type);
		        		isRender = false;
		        		requestAPI();
						return;
					}
			}else{
				storyApp.showIndicator(); 
			}
			requestAPI();
			
			
			
			function requestAPI(){
				Service.getBossRecommend(options,function(data){
					if(data&&data.more) storyView.attr('data-more','');storyView.attr('data-more',data.more);
		        	var type = page>1?'append':'';
		        	if(page==1){
		        		sessionStorage.setItem('homePage1',JSON.stringify(data));
		        	}
		        	if(isRender){
		        		that.renderRecommedTpl(data,type);
		        	}
		        	if(data.more==false){
		        		$('.notMore').show();
		    		}
	        	});
			}
			
		},
		pagingByScroll:function(){
			var that = this,
				loading = false;
				
			$('.infinite-scroll').on('infinite',function(){
				
				if(loading) return;

				var isNext = $('#recommedStorysView').data('more');

				loading=true;

				if(isNext=='true'){
					storyApp.detachInfiniteScroll($('.infinite-scroll'));
					page++;
					that.getStoryList(page);
					loading=false;			
					
				}
				
			});
		},
		timeChange:function(value) {
			value = value||'0';

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
	        if(value==0) result = "00:00"
	        return result;
	    },
		renderRecommedTpl:function(data,type){
			
			if(!data.list) return;

			if(data.list.length==0) return;
			
			sessionStorage.setItem('recommendList',JSON.stringify(data.list));

			var renderData ={
				HOST:HOST,
	            storyList: data.list,
	            storyTime:function(){
					return Home.timeChange(this.duration);
				},
	            albumTime:function(){
					return Home.timeChange(this.duration);
				}
	        },
	        dataContainer = $('#recommedStorysView'),
	        audio = $('#audio');
	        var output = appFunc.renderTpl(Template,renderData);

	        if(type === 'append') {
	            dataContainer.append(output);
	        }else {
	            dataContainer.html(output);
	        }
	        storyApp.initImagesLazyLoad('#home-page-content');
	        storyApp.attachInfiniteScroll($('.infinite-scroll'));
	        appFunc.initTplLink(dataContainer);
			
			// dataContainer.find('.home-recommend-theme,.group-theme').each(function(){
			// 	var backgroundVal = $(this).data('background');
			// 	$(this).css({
			// 		"background":'url('+backgroundVal+') no-repeat',
			// 		'background-size':'cover'
			// 	});
			// });

			dataContainer.find('a').each(function(){
				$(this).attr('href',$(this).data('href'));
			});

			var albumLink = dataContainer.find('#storyLink').eq(0);
			if(!audio.attr('src')) $('.J_checkPlayLink').attr('href',albumLink.data('href'));
			//storyApp.pullToRefreshDone();
			// var groupSwiper = storyApp.swiper('.group-swiper', {
			//   spaceBetween: 10,
			//   slidesPerView: 3
			// });
		},
		renderBannerTpl:function(data){
			var renderData = {
				HOST:HOST,
	            bannerList: data
	        },
	        bannerView = $('#homeBannerView');
	        var output = appFunc.renderTpl(bannerTpl, renderData);

	        bannerView.html(output);
	        bannerView.addClass('home-banner-on');
	        
	        var homeSwiper = storyApp.swiper('.home-banner', {
			  	pagination:'.swiper-pagination',
			  	spaceBetween:0,
				slidesPerView: 1,
				autoplay:3000,
				speed:600,
				longSwipesMs:500,
				autoplayDisableOnInteraction:false,
				loop:true
			});

	        bannerView.find('a').each(function(index){
	        	$(this).attr('href',$(this).data('href'));
	        });  

	        storyApp.pullToRefreshDone(); 
		},
    	searchHandle:function(){//搜索浮层渲染模版
    		var that = this,
    		options = {
	        };
			appFunc.setStatistics('Event','home-search','搜索');	        
			Service.getStoryCatalogue(options,function(data){
				var renderData = {
	          	  hotSearchKewords: data.list
	       		};
	            var output = appFunc.renderTpl(homeSearchTpl, renderData);
	            $('#hotSearchKewords').html(output);
	            $('.J_hotRightReturn').click(function(){
	            	Home.hotRightReturn();
	            });
	            $('.J_hotSearchContentTag').click(function(){
	            	var ind = $(this).index();
	            	Home.clickDownSearch(ind);
	            });
	        });
    		$('#modal-container').html(searchModal);
    		$('.J_hotSearchContent').keydown(function(e){
		        if(e.which  == 13){
		        	var searchView = $('#hotSearchKewords');
		        	pageNumber = 1;
		        	searchView.html(' ');
		        	Home.keyDownSearch(pageNumber);
		        	storyApp.detachInfiniteScroll($('.infinite-scroll'));
		        	Home.searchPageByScroll(pageNumber);
		        	appFunc.setStatistics('Event','search-keyword',$(this).val());
		        }
    		});
    	},
    	searchPageByScroll:function(pageNumber){
			var that = this,
				loading = false;
				storyApp.attachInfiniteScroll($('.infinite-scroll'));
			$('.infinite-scroll').on('infinite',function(){
				if(loading) return;
				loading=true;
				var isNext = $('#hotSearchKewords').data('more');
					if(isNext=='true'){
						storyApp.detachInfiniteScroll($('.infinite-scroll'));
						pageNumber++;
						that.keyDownSearch(pageNumber);
						loading=false;
					}
			});
		},
		keyDownSearch:function(pageNumber){
				var options,
	        		key,
	        		searchView;
	        		key = $('#hotSearchContent').val();
	        		key = appFunc.getSringLength(key);
	        		key = appFunc.getSpecialCode(key);
	        		key = appFunc.getTrim(key);
	        		if(key == ''){
	        			return;
	        		}else{
			        	options = {
							keyword:key,
							page_no:pageNumber,
							page_size:15
						};
						searchView = $('#hotSearchKewords');
						storyApp.showIndicator();
						Service.getStorySearch(options,function(data){
							if(data.more) searchView.attr('data-more','');searchView.attr('data-more',data.more);
				        	var type = pageNumber>1?'append':'';
				        	if(pageNumber==1){
				        		sessionStorage.setItem('hotSearchResultList',JSON.stringify(data.list));
								if(data.list==""){
				        				searchView.html('');
						        		searchView.html(homeSearchEmptyTpl);
					        	}else{
		    						Home.renderSearchResultTpl(data,type);
					        	}
				        	}else{
				        		if(data.list==""){
				        				return;
					        	}else{
					        		var list = JSON.parse(sessionStorage.getItem('hotSearchResultList'));
					        		var dataList = data.list;
					        		var list = list.concat(dataList);
					        		sessionStorage.setItem('hotSearchResultList',JSON.stringify(list));
		    						Home.renderSearchResultTpl(data,type);
					        	}
				        	}
			        	});
			        }
		},
		renderSearchResultTpl:function(data,type){
				var searchView = $('#hotSearchKewords');
				searchView.css({'padding':'0'});
				var renderData = {
	          		hotSearchList: data
	       		};
           		var output = appFunc.renderTpl(homeSearchResultTpl, renderData);
           		if(type === 'append') {
	            	searchView.append(output);
		        }else {
		            searchView.html(output);
		        }
		        Home.goCurrentPlayer();
        		appFunc.initGuideDownload("app-download-link");
		},
		hotRightReturn:function(){
				storyApp.closeModal();
		},
		hotResultReturn:function(){
				var URL,
					URL = HOST+'/index.html';
					mainView.router.back(URL);
		},
		hotSearchListFloat:function(){
			    // $('#modal-container').html(homeFloatModal);
		},
		goCurrentPlayer:function(event){
			$('.J_goCurrentPlayer').click(function(event){
				event.stopPropagation();
				event.preventDefault();
				var ind = $(this).parent().index();
				var currentStoryName = $('.hotsearch-name').eq(ind).text();
				var dataList = sessionStorage.getItem('hotSearchResultList');
				//console.log(JSON.parse(dataList)[ind].storyid);
				var currentStoryid = JSON.parse(dataList)[ind].storyid;
				if(!currentStoryid){
					currentStoryid = $(this).parent().attr("storyid");
				}
				//获取当前的ID
				sessionStorage.setItem("currentStoryid",currentStoryid);
				var story = HOST+"/page/player.html?type=story&storyId="+currentStoryid+"&storyName="+currentStoryName+"&target=search";
				mainView.router.loadPage(story);
			});
		},
		touchevent:function(){
			var playcon=document.getElementById('touch-audio');
			var audio=document.getElementById('audio');
			var flag=true;
			var music = 0;
			//var times=null;
			audio.pause();
			
			function init(){
				$("#touch-audio").attr("src",HOST+"/style/media/touch_one.mp3");
				playcon.play();
				music = 1;
			}
			init();
			$('.touch-before').show();
			$('.touch-before').touchstart(function(){
				$("#touch-audio").attr("src",HOST+"/style/media/touch_two.mp3");
				playcon.play();
				music = 2;
				$(this).hide();
			 	$('.touch-after').show();
			 	//波纹动画
			 	$(".circle").addClass('circleshow');
				setTimeout(function(){
	    			$('.touch-after').addClass('opacityChange');
	    			$('.touchresult-list').addClass('touchresult');
					$('.touchresult-content').addClass('touchresultshow');	
					$("#touch-audio").attr("src",HOST+"/style/media/touch_three.mp3");
					music = 3;
					playcon.play();
					//$("#touch-audio").attr("src","");
				 },6000)
			})
			$('#touch-playbtn').click(function(){
			if(flag){
			 		playcon.pause();
			 		$('.touch-playbtn').addClass('paused-bg');
			 		flag = false;
			 		
			}else{
			 		playcon.play();
			 		
			 		$('.touch-playbtn').removeClass('paused-bg');
			 		flag = true;
			 	}
			 if(music==3&&playcon.ended){
			 	playcon.src = "";
			 }
			 	// if(playcon.paused){

			 	// 	playcon.play();
			 	// 	$('.touch-playbtn').removeClass('paused-bg');
			 	// }else{
			 	// 	playcon.pause();
			 	// 	$('.touch-playbtn').addClass('paused-bg');
			 	// }
			 	
			})
			 var options={
			 	"sex": 1,
    			"birthday": "1988-09-20"
			 }
			Service.getTouchPage(options,function(data){
				//console.log(data)
				var renderData = {
	          		touchlist:data,
	          		HOST:HOST
	       		};
           		var output = appFunc.renderTpl(touchTpl, renderData);
           		$('#listbox').html(output);
			 });
		},
    	bindEvent: function(){
	        var bindings = [{
	            element: '#homeHead',
	            selector: '.J_homeSearch',
	            event: 'click',
	            handler: this.searchHandle
	        },{
	            element: '#hotSearch',
	            selector: '.J_hotSearchContent',
	            event: 'keydown',
	            handler: this.keyDownSearch
	        },{
	            element: '#hotSearch',
	            selector: '.J_hotSearchContentTag',
	            event: 'click',
	            handler: this.clickDownSearch
	        },{
	            element: '#hotSearchResult',
	            selector: '.J_hotRightReturn',
	            event: 'click',
	            handler: this.hotResultReturn
	        },{
	            element: '#hotSearchList',
	            selector: '.J_hotSearchListFloat',
	            event: 'click',
	            handler: this.hotSearchListFloat
	        },{
	            element: '#homeModal-container',
	            selector: '.J_closeFloat',
	            event: 'click',
	            handler: this.closeFloat
	        }
	     	];

	        appFunc.bindEvents(bindings);
    	}
	}
	module.exports = Home;
