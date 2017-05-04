var appFunc = require('utils/appFunc'),
    Connect = require('utils/api'),
    PackClazz = require('pack'),
    networkStatus = require('components/networkStatus'),
    requestCount = 0;

module.exports = {
    search: function(code, array){
        for (var i=0;i< array.length; i++){
            if (array[i].code === code) {
                return array[i];
            }
        }
        return false;
    },

    getRequestURL: function(options){
        //var host = apiServerHost || window.location.host;
        //var port = options.port || window.location.port;
        var query = options.query || {},
            func = Connect[options.func] || '',
            apiServer = '';
            
        if(options.contentType==='application\/json'){
            apiServer = func;
        }else{
            apiServer = func + (appFunc.isEmpty(query) ? '' : '?');
            var name;
            for (name in query) {
                apiServer += name + '=' + query[name] + '&';
            }
        }
        
        return apiServer.replace(/&$/gi, '');
    },
    assembleData:function(data){
        var that = this,
            newPack={},
            str='',
            pack = that.initPackInfo();

        for(var item in pack){
            if(pack.hasOwnProperty(item)){
                newPack[item]=pack[item];
            }
        }
        if(data){
            if(typeof data === 'string'){
                data = JSON.parse(data);
            }
           
            for(var item in data){
                if(data.hasOwnProperty(item)){
                    newPack[item]=data[item];
                }
            }
        }
        return JSON.stringify(newPack);
    },
    requestInitiallize:function(){
         var InitParam = PackClazz.getInitParam(),
             channelmsg = 'h5-browse';
        if(appFunc.isWechat()) {channelmsg = 'h5-wechat';}
        var initParam = new InitParam('v1.0','123456','aabbcc',channelmsg);//测试环境使用
        //var initParam = new InitParam('v1.0','992099001','ODZDNjUzNkFGMzVFRUQ0ODIxNEJDQ0YzM0MzMzE0MEQ=',channelmsg);//生产环境使用
        if(requestCount<1){
            setTimeout(function(){
            $.ajax({
                url: Connect['initiallize'],
                method:'post',
                data: JSON.stringify(initParam),
                success:function(res){
                    var res = JSON.parse(res);
                    if(res.errcode=='0'){
                        var resultObj = res.result;
                        sessionStorage.setItem('H5initiallize',JSON.stringify(resultObj)); 
                    }
                    location.href = location.href;
                }
            });
            
            },3000);
        }
    },
    simpleCall: function(options,callback){
        var that = this;

        options = options || {};
        options.data = options.data ? options.data : '';

        //If you access your server api ,please user `post` method.
        options.method = options.method || 'GET';
        //options.method = options.method || 'POST';

        if(appFunc.isPhonegap()){
            //Check network connection
            var network = networkStatus.checkConnection();
            if(network === 'NoNetwork'){

                storyApp.alert(no_network,function(){
                   storyApp.hideIndicator();
                   storyApp.hidePreloader();////
                    //$('.mask_layer_1').hide();
                });

                return false;
            }
        }

        $.ajax({
            url: that.getRequestURL(options) ,
            method: options.method,
            data: options.data,
            // xhrFields:{
            //     withCredentials:true
            // },
            //contentType:'application/json',
            beforeSend:function(xhr){
                
                var  H5initiallize =  sessionStorage.getItem('H5initiallize');
                if(H5initiallize){
                    var pack = JSON.parse(H5initiallize);
                    if(pack){
                        xhr.setRequestHeader("token",pack.token);
                        //xhr.setRequestHeader("appid",pack.appid);
                        xhr.setRequestHeader("deviceid",pack.deviceid);
                        xhr.setRequestHeader("apiver",'1.0.0');
                        xhr.setRequestHeader("sessioncode",pack.sessioncode);
                    }
                }else{
                    return;
                }
            },
            statusCode:{
                404:function (xhr) {
                  mainView.router.loadPage(HOST+'/page/error.html');
                }
            },
            success:function(data){
             storyApp.hideIndicator();
            data = data ? JSON.parse(data) : '';
                var codes = [
                    {code:-1, message:data.errmsg},
                    {code:4001, message:data.errmsg},
                    {code:4002, message:data.errmsg},
                    {code:4003, message:data.errmsg},
                    {code:4004, message:data.errmsg},
                    {code:4005, message:data.errmsg},
                    {code:4006, message:data.errmsg},
                    {code:4007, message:data.errmsg}
                ];
                if(data.errcode == '-1'&&requestCount<1){
                    var index = require('app');
                        index.init();
                }
                if(data.errcode == '4003'){
                    that.requestInitiallize();
                    requestCount++;
                }
                var codeLevel = that.search(data.errcode,codes);
                if(!codeLevel){
                    (typeof(callback) === 'function') ? callback(data) : '';
                    storyApp.pullToRefreshDone();
                }else{
                    storyApp.hideIndicator();
                    storyApp.hidePreloader(); 
                    Toast.show('',codeLevel.message);//有遮罩的消息提示
                }
            },
            error:function(){
                Toast.show('','请求失败，请重试！');
                that.requestInitiallize();
            }
        });

    }
};