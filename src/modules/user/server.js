
var xhr = require('utils/xhr');

    module.exports = {
    	getUserIndex: function(options,callback){
            xhr.simpleCall({
                func:'userIndex',
                query:options
            },function(res){
                callback(res.result);
            });
        },
       getUserAlbum: function(options,callback){
           xhr.simpleCall({
               func:'userAlbum',
               query:options
            },function(res){
               callback(res.result);
           });
       },
  		getUserCollect:function(options,callback){
  			xhr.simpleCall({
            func:'userCollect',
            query:options
          },function(res){
              callback(res.result);
          });
  		},
      getUserCollectNav:function(options,callback){
        xhr.simpleCall({
            func:'userCollectNav',
            query:options
          },function(res){
              callback(res.result);
          });
      }
     
     };

