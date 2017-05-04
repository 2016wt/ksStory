var appFunc = require('utils/appFunc');
    // homeView = require('home');
    // playerView = require('player');

module.exports = {
    init: function(){
        
        if(mainView){
            var activePage = mainView.activePage.name,
                activeModule = '',
                query = $.parseUrlQuery(decodeURI(mainView.url)), 
                isShare = false;
            
            switch(activePage){
                case 'home':
                    activeModule = require('home');
		        // var userModule = require('user');
                // userModule.init();
                break;
                case 'player':
                    $('.back').attr('href',HOST+'/');
                    $('.back').addClass('external');
                    isShare = true;
                    activeModule = require('player');

                break;
		        case 'editor':
                    //activeModule = require('user');
                break;
		        case 'loginselect':
                    activeModule = require('login');
                break;
                case 'loginmobile':
                    activeModule = require('login');
                break;
                case 'loginsexselect':
                    activeModule = require('login');
                break;
                case 'loginsexsubmit':
                    activeModule = require('login');
                break;
                case 'albums':
                    activeModule = require('album');
                break;
                case 'tagPage':
                    $('.back').attr('href',HOST+'/');
                    $('.back').addClass('external');
                    isShare = true;
                    activeModule = require('album');
                break;
                case 'newAlbums':
                    activeModule = require('album');
                break;
                case 'editNewAlbumsName':
                    activeModule = require('album');
                break;
                case 'homeSearchResult':
                    activeModule = require('home');
                    activeModule.renderSearchResultTpl();
                break;
		        case 'album-list':
                activeModule = require('album');
                break;
                case 'catalogue':
                    activeModule = require('catalogue');
                break;
                case 'albumPage':
                 $('.back').attr('href',HOST+'/');
                 $('.back').addClass('external');
                 isShare = true;
                activeModule = require('album');
                break;

            }
            if(activeModule){
                activeModule.init(query);
            }
        }
        if(isShare==true){
            appFunc.setStatistics('share');
        }else{
            appFunc.setStatistics();
        }
    },
    i18next: function(content){
        var that = this;

        var renderData = {};

        var output = appFunc.renderTpl(content,renderData);

        $('.views .i18n').each(function(){
            var value;
            var i18nKey = $(this).data('i18n');
            var handle = i18nKey.split(']');
            if(handle.length > 1 ){
                var attr = handle[0].replace('[','');
                value = that.i18nValue(handle[1]);
                $(this).attr(attr,value);
            }else{
                value = that.i18nValue(i18nKey);
                $(this).html(value);
            }
        });

        return output;
    },

    i18nValue: function(key){

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
    }
};