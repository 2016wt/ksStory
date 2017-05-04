module.exports = {

    isPhonegap: function() {
        return (typeof(cordova) !== 'undefined' || typeof(phonegap) !== 'undefined');
    },

    renderTpl: function(markup,renderData){
        var compiledTemplate = Template7.compile(markup);
        return compiledTemplate(renderData);
    },
    initGuideDownload:function(obj){
            var that = this,
                eventObj = $('.'+obj),
                downText = $('.J_downText'),
                showText = '获得更好的收听体验';
            eventObj.click(function(ev){
                var target = target = $(this);
                 ev.stopPropagation();  // 清除冒泡
                 ev.preventDefault(); 
                if(target.hasClass('home-feel-icon')){
                    showText = "下载APP，摸摸凯叔的大光头，凯叔就为你推荐一组故事。";
                }else if(target.hasClass('downapp-link')){
                    showText = "下载APP，就可以下载收听故事啦。";
                }else if(target.hasClass('newalbum-link')){
                    showText = "下载APP，定制属于自己孩子的专辑故事。";
                }else if(target.hasClass('collect-link')){
                    showText = "下载APP，就可以收藏喜欢的故事啦。";
                }else{
                    showText = '获得更好的收听体验';
                }
                downText.text(showText);
                $('#guideDownloadModel').show();   // 让隐藏的#show窗口显示出来
                $('.mask_layer_1').show();   // mask layer显示
                $('.mask_layer_1').height(1000); // mask layer 高度设置为整个文档高度
                that.setStatistics('Event',target.data('type'),target.data('alisname'));
                that.setStatistics('Event','app-download','app下载页面');
            });
            //step 2 ---------------------------------------------------------------------
            $(document).click(function(ev){
                //点击文档时
                $('#guideDownloadModel').hide(); //让弹出的窗口隐藏
                $('.mask_layer_1').hide();   // mask layer 隐藏
                ev.stopPropagation();  // 清除冒泡
            });

            //step 3 ---------------------------------------------------------------------
            $('#guideDownloadModel').click(function(ev){
                ev.stopPropagation();   // 点击弹出的窗口时，清除冒泡，让其不触发其他点击事件
            });
            //step 4 ---------------------------------------------------------------------
            $('.J_guideCancelModel').click(function(ev){
                $('#guideDownloadModel').hide(); //让弹出的窗口隐藏
                $('.mask_layer_1').hide(); 
                ev.stopPropagation();   // 点击弹出的窗口时，清除冒泡，让其不触发其他点击事件
            });

            if(isIos){
                $('.J_downloadLink').click(function(ev){
                    ev.stopPropagation();
                        var loadDateTime = new Date();
                        window.setTimeout(function() {
                          var timeOutDateTime = new Date();
                          if (timeOutDateTime - loadDateTime < 5000) {
                            window.location = "http://fir.im/ksios";
                          } else {
                            window.close();
                          }
                        },1500);         
                        window.location = "ksstory://token=123abc&registerd=1";
                        that.setStatistics('Event','app-download-btn','iOSDownload');
                });
            }

            if(isAndroid){
                $('.J_downloadLink').text('Android版敬请期待');
                $('.J_downloadLink').click(function(ev){
                    ev.stopPropagation();
                    that.setStatistics('Event','app-download-btn','AndroidDownload');
                    return;
                    //     var state = null;
                    //     try {
                    //       state = window.open("ksstory://com.kswh.ksstory/openwith", '_blank');
                    //     } catch(e) {}
                    //     if (state) {
                    //       window.close();
                    //     } 
                       
                    //     setTimeout(function(){
                    //       window.location = "http://fir.im/android103";
                    //     },1000);
                    
                    // that.setStatistics('Event','app-download','Android');
                });
            }
    },
    isEmail: function(str){
        var reg = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+((\.[a-zA-Z0-9_-]{2,3}){1,2})$/;
        return reg.test(str);
    },
    isWechat:function(){
        var ua = window.navigator.userAgent.toLowerCase();
        if(ua.match(/MicroMessenger/i) == 'micromessenger'){
            return true;
        }else{
            return false;
        }
    },
    isLocalStorageSupported:function() {
        var testKey = 'test',
            storage = window.sessionStorage;
        try {
            storage.setItem(testKey, 'testValue');
            storage.removeItem(testKey);
            return true;
        } catch (error) {
            return false;
        }
    },
    getPageNameInUrl: function(url){
        url = url || '';
        var arr = url.split('.');
        return arr[0];
    },

    isEmpty: function(obj) {
        for(var prop in obj) {
            if(obj.hasOwnProperty(prop))
                return false;
        }

        return true;
    },

    hideToolbar: function() {
        storyApp.hideToolbar('.toolbar');
    },

    showToolbar: function() {
        storyApp.showToolbar('.toolbar');
    },

    timeFormat: function(ms){

        ms = ms * 1000;

        var d_second,d_minutes, d_hours, d_days;
        var timeNow = new Date().getTime();
        var d = (timeNow - ms)/1000;
        d_days = Math.round(d / (24*60*60));
        d_hours = Math.round(d / (60*60));
        d_minutes = Math.round(d / 60);
        d_second = Math.round(d);
        if (d_days > 0 && d_days < 2) {
            return d_days + i18n.global.day_ago;
        } else if (d_days <= 0 && d_hours > 0) {
            return d_hours + i18n.global.hour_ago;
        } else if (d_hours <= 0 && d_minutes > 0) {
            return d_minutes + i18n.global.minute_ago;
        } else if (d_minutes <= 0 && d_second >= 0) {
            return i18n.global.just_now;
        } else {
            var s = new Date();
            s.setTime(ms);
            return (s.getFullYear() + '-' + f(s.getMonth() + 1) + '-' + f(s.getDate()) + ' '+ f(s.getHours()) + ':'+ f(s.getMinutes()));
        }

        function f(n){
            if(n < 10)
                return '0' + n;
            else
                return n;
        }
    },

    getCharLength: function(str){
        var iLength = 0;
        for(var i = 0;i<str.length;i++)
        {
            if(str.charCodeAt(i) >255)
            {
                iLength += 2;
            }
            else
            {
                iLength += 1;
            }
        }
        return iLength;
    },

    matchUrl: function(string){
        var reg = /((http|ftp|https):\/\/)?[\w\-_]+(\.[\w\-_]+)+([\w\-\.,@?^=%&;:\/~\+#]*[\w\-\@?^=%&;\/~\+#])?/g;

        string = string.replace(reg,function(a){
            if(a.indexOf('http') !== -1 || a.indexOf('ftp') !== -1){
                return '<a href=\"#\" onclick=\"event.stopPropagation();window.open(\'' + a + '\',\'_blank\')\">' + a + '</a>';
            }
            else
            {
                return '<a href=\"#\" onclick=\"event.stopPropagation();window.open(\'http://' + a + '\',\'_blank\')\">' + a + '</a>';
            }
        });
        return string;
    },
    getSessionObj:function(sessionName){
        var obj = sessionStorage.getItem(sessionName);
        return JSON.parse(obj);
    },
    initTplLink:function(container){
        container.find('a').click(function(){
            var accessible = $(this).data('src')||'#';
            $(this).attr('src',accessible);
        });
    },
    countSubstr:function(str,substr){
       var count;
       var reg="/"+substr+"/gi";    
       reg=eval(reg);
       if(str.match(reg)==null){
               count=0;
       }else{
               count=str.match(reg).length;
       }
       return count;
    },
    bindEvents: function(bindings) {
        for (var i in bindings) {
            
            if(bindings[i].selector) {
                $(bindings[i].element)
                    .off(bindings[i].event,bindings[i].selector , bindings[i].handler);
            }else{
                $(bindings[i].element)
                    .off(bindings[i].event, bindings[i].handler);
            }

            if(bindings[i].selector) {
                $(bindings[i].element)
                    .on(bindings[i].event,bindings[i].selector , bindings[i].handler);
            }else{
                $(bindings[i].element)
                    .on(bindings[i].event, bindings[i].handler);
            }
        }
    },
    stringToBytes:function(str) {
          var ch, st, re = [];
          for (var i = 0; i < str.length; i++ ) {
            ch = str.charCodeAt(i);
            st = [];
            do {
              st.push( ch & 0xFF );
              ch = ch >> 8;
            }
            while ( ch );
            re = re.concat( st.reverse() );
          }
          return re;
    },
    myStringToHex: function (arr){
　　　　var val="";
　　　　for(var i = 0; i < arr.length; i++){

　　　　　　if(val == "")
　　　　　　　　val = arr[i].toString(16);
　　　　　　else
　　　　　　　　val += "" + arr[i].toString(16);
　　　　}
　　　　return val;
　　},
    getFiveYearDate:function(){
        var cur;
        var curdate =  new Date();
        var year =  curdate.getFullYear()-5;
        var month = curdate.getMonth();
        var date =  curdate.getDate();
        month < 10 ? month = '0'+ month : month = month;
        date < 10 ? date ='0'+ date :date = date;
        cur = year+"-"+month+"-"+date;
        return cur;
    },
    getParameter:function(param)  
    {  
        var query = window.location.search;//获取URL地址中？后的所有字符  
        var iLen = param.length;//获取你的参数名称长度  
        var iStart = query.indexOf(param);//获取你该参数名称的其实索引  
        if (iStart == -1)//-1为没有该参数  
            return "";  
        iStart += iLen + 1;  
        var iEnd = query.indexOf("&", iStart);//获取第二个参数的其实索引  
        if (iEnd == -1)//只有一个参数  
            return query.substring(iStart);//获取单个参数的参数值  
        return query.substring(iStart, iEnd);//获取第二个参数的值  
    },
    // 2.1 监听“分享事件
    wechatShareFun:function(message) {
        var that = this,
            activePage = mainView.activePage.name;
            activePage = that.pageDictionary(activePage);
        wx.ready(function() {
            wx.onMenuShareAppMessage({
                title:message.title,
                desc:message.desc,
                link:message.link,
                imgUrl:message.imgUrl,
                trigger: function (res) {
                   that.setStatistics('share','share-trigger',message.title);
                },
                success: function (res) {
                    that.setStatistics('share','share-success',message.title);
                },
                cancel: function (res) {
                    that.setStatistics('share','share-cancel',message.title);
                },
                fail: function (res) {
                    that.setStatistics('share','share-fail',message.title);
                }
            });
            wx.onMenuShareTimeline({
                title:message.title,
                desc:message.desc,
                link:message.link,
                imgUrl:message.imgUrl,
                trigger: function (res) {
                    that.setStatistics('share','share-trigger',message.title);
                },
                success: function (res) {
                    that.setStatistics('share','share-success',message.title);
                },
                cancel: function (res) {
                    that.setStatistics('share','share-cancel',message.title);
                },
                fail: function (res) {
                    that.setStatistics('share','share-fail',message.title);
                }
            });
        });
    },
  //trim方法   去字符窜两端的空格
    getTrim:function(str){
        return str.replace(/(^\s*)|(\s*$)/g, "");
    },
    //特殊字符处理
    getSpecialCode:function(s){
        var pattern = new RegExp("[`~!@#$^&*()=|{}':;',\\[\\].<>/?~！@#￥……&*（）——|{}【】‘；：”“'。，、？]");
        var rs = "";
        for (var i = 0; i < s.length; i++) {
            rs = rs + s.substr(i, 1).replace(pattern, '');
        }
        return rs;
    },
    //截取字符窜前20个字符
    getSringLength:function(str){
        return str.slice(0,20);
    },
    pageDictionary:function(key){
        var dicData = {
            "home":"首页",
            "player":"播放页",
            "tagPage":"标签单页",
            "albumPage":"专辑单页",
            "catalogue":"全部分类",
            "search":"搜索",
            "adver":"播放页广告",
            "timeoff":"定时关闭",
        };
        return dicData[key];
    },
    setStatistics:function(event,type,aliasname){
        var activePage = mainView.activePage.name,
            fromPage = mainView.activePage.fromPage,
            fromVal = mainView.activePage.from,
            activeModule = '',
            that = this,
            query = $.parseUrlQuery(decodeURI(mainView.url)),
            options = {
                "page": activePage,
                "event":'show',
                "title":that.pageDictionary(activePage),
                "source":activePage,
                "project": "wx-story",
            },
            that = this,
            license = {
                'nav':'album',
                'tag':'album',
                'album':'album',
                'sysalbum':'album',
                'sysablum':'album',
                'story':'story'
            };
             
            if(fromPage) options.source = fromPage.name;

            if(event==="Event"){
                options.title = aliasname;
                options.event = type;

                if(type&&type.indexOf('-')>0) options.page = type.substring(0,type.indexOf('-'));
                
                // if(type=='search'||type=='search-tag'||type=='search-keyword') options.page="search";
                // if(type=='search') options.event="show";

                if(type=='app-download'||type=='app-download-btn') options.page="appDownloadPage";
                if(type=='app-download') options.event="show";

                // if(type=='player-adver'||type=='player-adver-click') options.page="adverPage";
                // if(type=='player-adver') options.event="show";
            }else if(event==="share"){
                options.page = aliasname;
                options.event = type;
                //options.source = 'share';
            }else if(event==="panel"){
                if(type.indexOf('-')>0){
                    var panelName = type.substring(0,type.indexOf('-'));
                    options.page= panelName;
                    options.title = aliasname;
                    options.event=type;
                }else{
                    options.page=type;
                    options.event="show";
                    options.title = that.pageDictionary(type);
                }
                options.source = activePage;
            }else{
                if(query.type){
                    if(license[query.type] === 'album'){
                        options.title = query.albumName;
                    }else if(license[query.type] === 'story'){
                        options.title = query.storyName;
                    }else{

                    }
                }
            }
            
            
            if(that.isWechat()){
           
                var url = location.href,
                    wxParam = $.parseUrlQuery(decodeURI(url));
                
                if(wxParam.open_id){
                    options.openid = wxParam.open_id;
                }else{
                    options.openid = localStorage.getItem('deviceid');
                }
                
                options.isuv = true;
                //options.src = wxParam.custom;     
                sessionStorage.setItem('openId',wxParam.open_id);
                // if(!sessionStorage.getItem('openId')){
                //     var URL = "http://weixin.kaishustory.com/weixin/oauth?redirect_uri="+location.href+"&scope=snsapi_base&custom=openid";
                //     location.href = URL;  
                // }
            }else{
                options.openid = localStorage.getItem('deviceid');
                options.isuv = false;
            }
          console.log('request'+JSON.stringify(options));
          var logError = sessionStorage.getItem('pagelogError');
         if(logError&&logError=='true'){
                return;
         }else{
            try{
                $.ajax({
                    //url: 'http://www.kaishustory.com/count/wxpagelog/accesslog',
                    //url:'http://weixin.kaishustory.com/tapi/pagelog/accesslog',
                    url:'http://weixin.kaishustory.com/api/pagelog/accesslog',
                    method:'post',
                    data: JSON.stringify(options),
                    success:function(res){
                        sessionStorage.setItem('pagelogError',null);
                    },
                    error:function(){
                        sessionStorage.setItem('pagelogError','true');
                    }
                });
            }catch(e){
                sessionStorage.setItem('pagelogError','true');
            }
         } 
        
    },
    //计算孩子年龄
    ageCalculation:function(str){
        var oDate,
            oYear,
            newMs,
            oMonth,
            s,
            b;
            oDate = new Date();
            s = str.slice(0,4);
            b = str.slice(5,6);
            oYear = oDate.getFullYear();
            oMonth = oDate.getMonth();
            oMonth = Number(oMonth)+1;
            newMs = oYear - s;
            if(b <= oMonth){
                return newMs;
            }else{
                return newMs-1;
            }
    },
    initBrowserVersion:function(){
            var that = this,
                myBrowser = 'no';
            var browser = {
                versions: function() {
                    var u = navigator.userAgent, app = navigator.appVersion;
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
            if(that.isWechat()){
                    myBrowser = "no";
            }else{
                if (browser.versions.ios || browser.versions.iPhone || browser.versions.iPad) {
                    myBrowser = "Safari";
                }else if (browser.versions.android) {
                    myBrowser = "no";
                    // window.location="http://www.baidu.com";
                }  
            }
        return myBrowser;
    }
};