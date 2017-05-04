var index = require('app'),
    Player = require('player'),
    Login = require('login'),
    Home = require('home'),
    appFunc = require('utils/appFunc');
    
module.exports = {
    init: function() {
        var that = this;
        $(document).on('pageBeforeInit', function (e) {
            var page = e.detail.page;
            that.pageBeforeInit(page);
        });

        $(document).on('pageAfterAnimation', function (e) {
            var page = e.detail.page;
            that.pageAfterAnimation(page);
        });

        $(document).on('pageBack', function (e) {
            var page = e.detail.page;
            that.pageBack(page);
        });
        
    },
    pageAfterAnimation: function(page){
        var name = page.name;
        var from = page.from;
        appFunc.hideToolbar();
        storyApp.closeModal();
        if(name === 'home' || name === 'task' || name === 'setting' ){
            if(from === 'left'){
                index.init();
                appFunc.showToolbar();
            }
        }
    },
    pageBeforeInit: function(page) {
        var name = page.name;
        var query = page.query;
        
        history.pushState("back","",location.href);
        history.pushState("back","",location.href);
        switch(name){
            case 'player':
                Player.init(query);
            break;
 	        case 'loginselect':
                Login.init(query);
            break;
            case 'loginmobile':
                Login.init(query);
            break;
            case 'loginsexselect':
                Login.init(query);
            break;
            case 'loginsexsubmit':
                Login.init();
            break;
            case 'homeSearchResult':
                Home.init(query);
            break;
             case 'touch':
                Home.init(query);
            break;
            case 'albums':
                var Album = require('album');
		          appFunc.hideToolbar();
                Album.init();
            break;
	        case 'tagPage':
                var Album = require('album');
                Album.init(query);
            break;
            case 'newAlbums':
                var Album = require('album');
                Album.init(query);
            break;
            case 'album-list':
                var Album = require('album');
                Album.init(query);
            break;
            case 'editNewAlbumsName':
                var Album = require('album');
                Album.init(query);
            break;
            case 'userEditNewAlbumsName':
                // var User = require('user');
                // User.init(query);
            break;
            case 'myalbum':
                // var User = require('user');
                // User.init(query);
            break;
            case 'mycollect':
                // var User = require('user');
                // User.init(query);
            break;
            case 'catalogue':
                var Catalogue = require('catalogue');
                Catalogue.init(query);
            break;
            case 'albumPage':
                var Album = require('album');
                Album.init(query);
            break;
        }
        appFunc.setStatistics();
    },
    pageBack:function(page){
        var name = page.name;
        var query = page.query;
    
        var title = $('.J_albumPageTitle').data('title')
        if(name=='albumPage'){
            $('.J_tagPageTitle').text($('.J_tagPageTitle').data('title'));
            var oNumber = sessionStorage.getItem('StoryandAlbum_total_count'),
            oI = $('.contentTop .left div i');
            oI.text(oNumber);
            var oSpan = '<span class="playbtn"></span>新建哄睡专辑';
            $('.contentTop .right').find('div').html(oSpan);
        }
        else if(name=='player'){
            if(1==1){
                $('.J_albumPageTitle').text($('.J_albumPageTitle').data('title'));
                var oNumber = sessionStorage.getItem('Album_total_count'),
                    oI = $('.contentTop .left div i');
                    oI.text(oNumber);

            }else{
                $('.J_albumPageTitle').text($('.J_albumPageTitle').data('title'));
                var oNumber = sessionStorage.getItem('StoryandAlbum_total_count'),
                    oI = $('.contentTop .left div i');
                    oI.text(oNumber);
            }
        }
        history.pushState("back","",location.href);
        history.pushState("back","",location.href);
    }
};






