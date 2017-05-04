
var xhr = require('utils/xhr');

module.exports = {
	getHomeBanner: function(options,callback){
        xhr.simpleCall({
            query:options,
            func:'homeBanner'
        },function(res){
            callback(res.result);
        });
    },
    getBossRecommend: function(options,callback){
        xhr.simpleCall({
            func:'bossRecommend',
            data:JSON.stringify(options),
            method:'POST'
        },function(res){
            callback(res.result);
        });
    },
    getStorySearch: function(options,callback){
        xhr.simpleCall({
            func:'storySearch',
            query:options
        },function(res){
            callback(res.result);
        });
    },
    getStoryKeywords: function(options,callback){
        xhr.simpleCall({
            func:'storyKeywords',
            query:options
        },function(res){
            callback(res.result);
        });
    },
    getStoryCatalogue: function(options,callback){
        xhr.simpleCall({
            func:'storyCatalogue',
            query:options
        },function(res){
            callback(res.result);
        });
    },
    getStoryAndAlbumList:function(options,callback){
         xhr.simpleCall({
            func:'searchStoryAlbumByTag',
            query:options
        },function(res){
            callback(res.result);
        });
    },
    getTouchPage: function(options,callback){
        xhr.simpleCall({
            func:'touchPage',
            data:JSON.stringify(options),
            method:'POST'
        },function(res){
            callback(res.result);
        });
    }
};