
var xhr = require('utils/xhr');

module.exports = {
	getThisAlbumTag: function(options,callback){
        xhr.simpleCall({
            func:'storyTagGroupService',
            query:options
        },function(res){
            callback(res.result);
        });
    },
    getStorysByTag: function(options,callback){
        xhr.simpleCall({
            func:'storyLists',
            query:options
        },function(res){
            callback(res);
        });
    },
    getNewAlbums:function(options,callback){
        xhr.simpleCall({
            func:'newAlbums',
            data:JSON.stringify(options),
            method:'post'
        },function(res){
            callback(res.result);
        });
    },
    getStoryLists: function(options,callback){
        xhr.simpleCall({
            func:'storyLists',
            query:options
        },function(res){
            callback(res);
        });
    },
    getStoryListByAlbumId:function(options,callback){
        xhr.simpleCall({
            func:'storyListByalbumId',
            query:options
        },function(res){
            callback(res.result);
        });
    },
    createAlbums:function(options,callback){
        xhr.simpleCall({
            func:'createAlbums',
            data:JSON.stringify(options),
            method:'post'
        },function(res){
            callback(res);
        });
    },
    updateAlbums:function(options,callback){
        xhr.simpleCall({
            func:'updateAlbums',
            data:JSON.stringify(options),
            method:'post'
        },function(res){
            callback(res);
        });
    },
    getEveryAlbums:function(options,callback){
        xhr.simpleCall({
            func:'obtainEveryAlbum',
            data:options
        },function(res){
            callback(res.result);
        });
    },
    getAlbumsName:function(options,callback){
        xhr.simpleCall({
            func:'obtainAlbumsName',
            data:options
        },function(res){
            callback(res.result);
        });
    },
    getCheckAlbumsName:function(options,callback){
        xhr.simpleCall({
            func:'checkAlbumsName',
            data:options
        },function(res){
            callback(res.result);
        });
    },
    appendStory:function(options,callback){
        xhr.simpleCall({
            func:'appendstory',
            data:JSON.stringify(options),
            method:'post'
        },function(res){
            callback(res);
        });
    },
    getStoryAndAlbumList:function(options,callback){
         xhr.simpleCall({
            func:'searchStoryAlbumByTag',
            query:options
        },function(res){
            callback(res);
        });
    }







};