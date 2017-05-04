
var xhr = require('utils/xhr');

module.exports = {
	getStoryCatalogue:function(callback){
        xhr.simpleCall({
            func:'storyCatalogue'
        },function(res){
            callback(res.result);
        });
    }
};

