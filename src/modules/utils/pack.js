
	function Pack(deviceid,sessioncode,token){
		this.appid = navigator.userAgent;//设备唯一号
		this.deviceid = deviceid || 'H5';//设备用户id
		this.sessioncode = sessioncode;//会话id
		this.token = token;
	}

	function InitParam(appversion,appid,appsecret,channelmsg){
		this.phonedevicecode = 'FK1QFD48G5QQ2';//navigator.userAgent;
		this.phonemodel = storyApp.device.os;
		this.sysversion = storyApp.device.osVersion;
		this.appversion = appversion;
		this.appid =  appid;
		this.appsecret = appsecret;
		this.channelmsg = channelmsg;//h5-wechat h5-browser
		this.platform = 'kaishu';
		this.channelid = 'ks';
	}

	module.exports = {
		getPack:function(){
			return Pack;
		},
		getInitParam:function(){
			return InitParam;
		},
		setDeviceId:function(deviceid){
			if(deviceid!="undefined"){
				Pack.deviceid=deviceid;
			}
		},
		setToken:function(token){
			if(token!="undefined"){
				Pack.token=token;
			}
		},
		setSessionCode:function(sessioncode){
			if(sessioncode!="undefined"){
				Pack.sessioncode=sessioncode;
			}
		},
		clearPack:function(){
			delete Pack.api;
			delete Pack.token;
			delete Pack.sessioncode;
			delete Pack.deviceid;
		}

	};