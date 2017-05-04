

var Service = require('login/server'),
    appFunc = require('utils/appFunc'),



    Login={
    	init:function(){
			//console.log("This is Login.....");
			var pageName = mainView.activePage.name;
			if(pageName==='loginsexsubmit'){
				Login.initsexSubmit();
			}
			this.bindEvent();
		},
		accountTest:function(){
			//alert('ss');
			//var a=/^1[3,5]{1}[0-9]{1}[0-9]{8}$/;
			var b=/^1[0-9]{10}$/;
				loginAccount = $('#loginAccount').val();
			if(loginAccount===""){
				$('.login-banner-prompt').show();
				$('.login-prompt-span').text("请输入手机号");
				return false;
			}else{
				if(!b.test(loginAccount)){
					$('.login-account').removeClass('login-account-focusout-true').addClass('login-account-focusout-fasle');
					$('.login-banner-prompt').show();
					$('.login-prompt-span').text("手机号输入有错误");
					return false;
				}else{
					$('.login-account').removeClass('login-account-focusout-fasle').addClass('login-account-focusout-true');
					$('.login-banner-prompt').hide();
					$('.login-prompt-span').text("");
					return true;
				}
			}
		},
		accountIn:function(){
			$('.login-account').addClass('login-account-focusIn');
			$('.login-banner-prompt').hide();
		},
		pwdIn:function(){
			$('.login-pwd').addClass('login-pwd-focusIn');
			$('.login-banner-prompt').hide();
		},
		obtainPwd:function(){
			var that = this;
			var t,
				loginAccount,
				loginAccountval,
				loginAccountvaltoHex,
				timer;
				t = 60;
			if($(this).hasClass('login-obtain-bg')){
				return;
			}else{
				timer = setInterval(function(){
					$('.login-obtain-pwd').addClass('login-obtain-bg');
					$('.login-obtain-pwd').text(t+"s");
					if(t<=0){
						$('.login-obtain-pwd').text("获取验证码");
						$('.login-obtain-pwd').removeClass('login-obtain-bg');
						clearInterval(timer);
					}
					t--;
				},1000);

				loginAccount = $('#loginAccount').val();
				loginAccountval = appFunc.stringToBytes(loginAccount);
				loginAccountvaltoHex = appFunc.myStringToHex(loginAccountval);

				options = {
					mobile:loginAccountvaltoHex,
				};
				Service.getObtainPwd(options,function(data){
					if(data){
						sessionStorage.setItem('smscode',data.smscode);
					}
				});
			}

		},
		pwdTest:function(){
			var loginPwd = $('#loginPwd').val();
			var smscode  = sessionStorage.getItem('smscode');
			if(loginPwd===""){
				$('.login-banner-prompt').show();
				$('.login-prompt-span').text("请输入验证码");
				return false;
			}else{
				if(loginPwd=== smscode){
					$('.login-pwd').removeClass('login-pwd-focusout-fasle').addClass('login-pwd-focusout-true');
					$('.login-banner-prompt').hide();
					$('.login-prompt-span').text("");
					return true;
				}else{
					$('.login-pwd').removeClass('login-pwd-focusout-true').addClass('login-pwd-focusout-fasle');
					$('.login-banner-prompt').show();
					$('.login-prompt-span').text("验证码有错误");
					return false;
				}
			}
		},
		phoneSubmit:function(){
			var loginAccount,
				options,
				loginAccountval,
				loginAccountvaltoHex,
				userid,
				babyid;
				loginAccount = $('#loginAccount').val();
				loginAccountval = appFunc.stringToBytes(loginAccount);
				loginAccountvaltoHex = appFunc.myStringToHex(loginAccountval);
				sessionStorage.setItem("phoneNumber",loginAccountvaltoHex);
				options = {
					loginform:{
						mobile: loginAccountvaltoHex,
						smscode: $('#loginPwd').val()
					},
					baby:{
						"sex":"",
						"birthday":""
					}
				};
				if(Login.accountTest()&&Login.pwdTest()){
					Service.getPhoneSubmit(options,function(data){
						if((data.baby_list)[0].sex){
							location.href='../index.html';
						}else{
							userid = data.account.userid;
							babyid = (data.baby_list)[0].babyid;
							sessionStorage.setItem("userid",userid);
							sessionStorage.setItem("babyid",babyid);
							mainView.router.loadPage('loginsexselect.html');
						}

					});
				};
		},
		selectBoy: function(){
			var boyBabyUrl,
				babyBannerText;

				$('.box-baby-select').find('.sex-boy').eq(0).addClass('login-baby-icon-sel').removeClass('login-baby-icon');
				$('.box-baby-select').find('.sex-girl').eq(0).removeClass('login-baby-icon-sel').addClass('login-baby-icon');
				boyBabyUrl = $('.login-baby-boy img').attr('src');
				babyBannerText = $('.login-banner-baby').text();
				sessionStorage.setItem("babyUrl",boyBabyUrl);
				sessionStorage.setItem("babysex",1);
				sessionStorage.setItem("babyBannerText",babyBannerText);
				mainView.router.loadPage('loginsexsubmit.html');
		},
		selectGirl: function(){
			var girlBabyUrl,
				babyBannerText;

				$('.box-baby-select').find('.sex-girl').eq(0).addClass('login-baby-icon-sel').removeClass('login-baby-icon');
				$('.box-baby-select').find('.sex-boy').eq(0).removeClass('login-baby-icon-sel').addClass('login-baby-icon');
				girlBabyUrl = $('.login-baby-girl img').attr('src');
				babyBannerText = $('.login-banner-baby').text();
				sessionStorage.setItem("babyUrl",girlBabyUrl);
				sessionStorage.setItem("babysex",0);
				sessionStorage.setItem("babyBannerText",babyBannerText);
				mainView.router.loadPage('loginsexsubmit.html');
				
		},
		initsexSubmit:function(){
			var babySrc,
				bannerText,
				getFiveYearDate;
				Login.initFiveYearDate();
				babySrc  =   sessionStorage.getItem("babyUrl");
				bannerText = sessionStorage.getItem("babyBannerText");
				getFiveYearDate = sessionStorage.getItem("getFiveYearDate");
				$('#babyboth').attr('value',getFiveYearDate);
				$('#loginSexSubmitBabyIcon img').attr('src',babySrc);
				$('.login-banner-baby-theme span').html(bannerText);

		},
		initFiveYearDate:function(){
			var getFiveYearDate;
				getFiveYearDate = appFunc.getFiveYearDate();
				sessionStorage.setItem("getFiveYearDate",getFiveYearDate);
		},
		completeSubmit:function(){
			var options,
				babysex,
				userid,
				babyBirthday;
				babysex = sessionStorage.getItem('babysex');
				userid = sessionStorage.getItem('userid');
				babyBirthday = $('#babyboth').val();
				options = {
					userid:userid,
				    headimgurl:"",
				    nickname: "辅导课感觉",
				    sex:babysex,
				    birthday:babyBirthday
				};
				Service.getUpdateSubmit(options,function(data){
					if(data){
						location.href='../index.html';
					}
				});
			//location.href='../index.html';
		},
		bindEvent: function(){
			var bindings = [{
				element: '#formAction',
				selector: '.J_accountTest',
				event: 'focusout',
				handler: this.accountTest
			},{
				element: '#formAction',
				selector: '.J_accountTest',
				event: 'focusin',
				handler: this.accountIn
			},{
				element: '#formAction',
				selector: '.J_pwdTest',
				event: 'focusin',
				handler: this.pwdIn
			},{
				element: '#formAction',
				selector: '.J_pwdTest',
				event: 'focusout',
				handler: this.pwdTest
			},{
				element: '#formAction',
				selector: '.J_obtainPwd',
				event: 'click',
				handler: this.obtainPwd
			},{
				element: '#formAction',
				selector: '.J_phoneSubmit',
				event: 'click',
				handler: this.phoneSubmit
			},{
				element: '#loginSexSelectView',
				selector: '.J_girlBaby',
				event: 'click',
				handler: this.selectGirl
			},{
				element: '#loginSexSelectView',
				selector: '.J_boyBaby',
				event: 'click',
				handler: this.selectBoy
			},{
				element: '#loginSexSubmitView',
				selector: '.J_babySubmit',
				event: 'click',
				handler: this.completeSubmit
			}

			];




		    appFunc.bindEvents(bindings);
    	}


    };
    module.exports = Login;