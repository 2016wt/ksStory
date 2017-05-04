var xhr = require('utils/xhr');

module.exports = {

	getObtainPwd: function(options,callback){
        xhr.simpleCall({
            func:'obtainPwd',
            query:options
        },function(res){
            callback(res.result);
        });
    },
	getPhoneSubmit: function(options,callback){
        xhr.simpleCall({
            func:'phoneSubmit',
            data:JSON.stringify(options),
            method:'POST'
        },function(res){
            callback(res.result);
        });
    },
    getUpdateSubmit: function(options,callback){
        xhr.simpleCall({
            func:'updateSubmit',
            data:JSON.stringify(options),
            method:'POST'
        },function(res){
            callback(res.result);
        });
    },






}
