/**
 * @require 'lang/zh-cn'
 **/
require('framework7');
require('components/framework7/plugins/toast');
require('components/framework7/plugins/upscroller');


var appFunc = require('utils/appFunc'),
    router = require('router'),
    Connect = require('utils/api'),
    PackClazz = require('utils/pack'),
    index = require('app'),
    networkStatus = require('components/networkStatus');

var app = {
    initialize: function() {
        this.bindEvents();
        // this.initBounceScrolling();
        // this.listenSortDom();
        this.initRem();
        this.initToolbars();
    },
    initBounceScrolling:function(){
        $('ducument body').on('touchmove touchstart', function (event) {
            event.preventDefault();
        });
    },
    listenSortDom:function(){
        // var _script = document.createElement('script');
        //     _script.type = "text/javascript";
        //     _script.src = "http://framework7.taobao.org/dist/js/framework7.min.js";
        //     document.head.appendChild(_script);
            var myApp = new Framework7();
    },
    initRem:function(){
        (function (doc, win) {
            var docEl = doc.documentElement,
                resizeEvt = 'orientationchange' in window ? 'orientationchange' : 'resize',
                recalc = function () {
                    var clientWidth = docEl.clientWidth;

                    if (!clientWidth) return;
                    if(clientWidth<=320){
                        docEl.style.fontSize = '10px';
                    }else{
                        docEl.style.fontSize = 10 * (clientWidth / 320) + 'px';
                    }
                };
            if (!doc.addEventListener) return;
            win.addEventListener(resizeEvt, recalc, false);
            doc.addEventListener('DOMContentLoaded', recalc, false);
        })(document, window);
    },
    initRequestInfo:function(isReq){

        var InitParam = PackClazz.getInitParam(),
            channelmsg = 'h5-browse';
            if(appFunc.isWechat()) {channelmsg = 'h5-wechat';}
            var initParam = new InitParam('v1.0','123456','aabbcc',channelmsg);//测试环境使用
            //var initParam = new InitParam('v1.0','992099001','ODZDNjUzNkFGMzVFRUQ0ODIxNEJDQ0YzM0MzMzE0MEQ=',channelmsg);//生产环境使用
        $.ajax({
            url: Connect['initiallize'],
            method:'post',
            data: JSON.stringify(initParam),
            success:function(res){
                var res = JSON.parse(res);
                var resultObj = res.result;
                if(!localStorage.getItem('deviceid'))localStorage.setItem('deviceid',resultObj.deviceid);
                sessionStorage.setItem('H5initiallize',JSON.stringify(resultObj));
                if(isReq){
                    router.init();
                    index.init();
                }
            }
        });
       
    },
    bindEvents: function() {
        if(appFunc.isPhonegap()) {
            document.addEventListener('deviceready', this.onDeviceReady, false);
        }else{
            this.onDeviceReady();
        }
    },
    initToolbars:function(){

        var toolsTabLink = $('.views .toolbar').find('.tab-link');

        toolsTabLink.each(function(){
            var that = $(this),
                iconObj = that.find('i');
            
                if(that.hasClass('active')){
                    iconObj.addClass(iconObj.data('clazz'));
                }else{
                    iconObj.removeClass(iconObj.data('clazz'));
                }
        });
    },
    onDeviceReady: function() {
        app.receivedEvent('deviceready');
    },
    receivedEvent: function(event) {
        switch (event) {
            case 'deviceready':
                app.initMainView();
                break;
        }
    },
    initMainView:function(){
       require.async('lang/zh-cn', function(lang){
            window.i18n = lang;
            app.initFramework7();
        });
    },
    listenHistory:function(){
            $(window).on('popstate',function(e){
                if(e.state=="back"){
                    mainView.router.back();
                }
                else if(e.state=="reload"){
                    window.location.reload();
                }else if(e.state=="goback"){
                    window.location.reload(true);
                }

            });
    },
    initFramework7: function(){
        var that = this;

          Template7.registerHelper('rif', function (v1, operator, v2, options) {
            v1 = typeof(this[v1]) != "undefined" ? this[v1] : v1;
            v2 = typeof(this[v2]) != "undefined" ? this[v2] : v2;
            switch (operator) {
                case '==':
                    return (v1 == v2) ? options.fn(this) : options.inverse(this);
                case '===':
                    return (v1 === v2) ? options.fn(this) : options.inverse(this);
                case '<':
                    return (parseInt(v1) < parseInt(v2)) ? options.fn(this) : options.inverse(this);
                case '<=':
                    return (parseInt(v1) <= parseInt(v2)) ? options.fn(this) : options.inverse(this);
                case '>':
                    return (parseInt(v1) > parseInt(v2)) ? options.fn(this) : options.inverse(this);
                case '>=':
                    return (parseInt(v1) >= parseInt(v2)) ? options.fn(this) : options.inverse(this);
                case '&&':
                    return (v1 && v2) ? options.fn(this) : options.inverse(this);
                case '||':
                    return (v1 || v2) ? options.fn(this) : options.inverse(this);
                case '!=':
                    return (parseInt(v1) != parseInt(v2)) ? options.fn(this) : options.inverse(this);
                default:
                    return options.inverse(this);
            }
        });    
        Template7.registerHelper('t', function (options){
            var key = options.hash.i18n || '';
            var keys = key.split('.');

            var value;
            for (var idx = 0, size = keys.length; idx < size; idx++)
            {
                if (value != null)
                {
                    value = value[keys[idx]];
                } else {
                    value = i18n[keys[idx]];
                }

            }
            return value;
        });

        window.$ = Dom7;
        window.storyApp = new Framework7({
            pushState: false,
            popupCloseByOutside:false,
            animateNavBackIcon: true,
            modalTitle: i18n.global.modal_title,
            modalButtonOk: i18n.global.modal_button_ok,
            modalButtonCancel: i18n.global.cancel,
            template7Pages: true,
            scroller:"native",
            tapHold: true,
            imagesLazyLoadThreshold:0,
            imagesLazyLoadSequential:true
        });
        $(document).on('click','.J_collect,#J_collect',function(event){
        $(document).off('click','.J_collect,#J_collect',function(){});
           var activePage = mainView.activePage.name,
                target = $(this);
           if(target.hasClass('J_collect_panel')){
                appFunc.setStatistics('panel',target.data('type'),target.data('alisname'));
           }else{
                appFunc.setStatistics('Event',target.data('type'),target.data('alisname'));
           }  
           event.stopPropagation();   
        });
        //判断是否为ios／android
        window.isIos = Framework7.prototype.device.ios === true;
        window.isAndroid = Framework7.prototype.device.android === true;
        window.mainView = storyApp.addView('.view-main', {
            dynamicNavbar: true
        });
        var homeView = $('#homeView').length;
        if(homeView>0){
            storyApp.addView('#taskView', {
                dynamicNavbar: true
            });

            storyApp.addView('#settingView', {
                dynamicNavbar: true
            });
        }
        window.Toast=function(){};
        window.Toast.show=function(title,message){
            var toast=storyApp.toast(message,title,{});
            toast.show(true);
        };
        
        window.HOST = 'http://'+window.location.host.split('/')[0]+'/m';
        //window.HOST = 'http://'+window.location.host.split('/')[0]+'/mtest';
        //window.HOST = 'http://'+window.location.host.split('/')[0];    
       
        var ajaxjson = $.ajax({
            url:"http://weixin.kaishustory.com/token-services/config/get_wxjsconfig?signurl="+encodeURIComponent(window.location.href),
            async:false
        });
        var wxconfig = JSON.parse(ajaxjson.responseText);
        wx.config({
            debug : false, 
            appId : wxconfig.appid,
            timestamp : wxconfig.timestamp,
            nonceStr : wxconfig.noncestr,
            signature : wxconfig.signature,
            jsApiList : [ 'showMenuItems', 'showOptionMenu', 'onMenuShareTimeline', 'onMenuShareAppMessage', 'startRecord','stopRecord','chooseImage','previewImage','uploadImage','downloadImage']
        });
        // init app
        that.initRequestInfo();
        var H5initiallize = sessionStorage.getItem('H5initiallize');
        if(H5initiallize){
            router.init();
            index.init();
        }else{
            setTimeout(function(){
                if(H5initiallize){
                    router.init();
                    index.init();
                }else{
                    that.initRequestInfo('Again');
                }
            },1000);
        }

        

         
    }
};

app.initialize();
app.listenHistory();
