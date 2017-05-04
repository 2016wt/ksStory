// var SERVER = 'http://weixin.kaishustory.com/api';
//var SERVER = 'http://weixin.kaishustory.com/tapi';
//var SERVER = 'http://weixin.kaishustory.com/gapi';
var SERVER = 'http://www.kaishustory.com/api';
//var SERVER = 'http://www.kaishustory.com/gapi';

module.exports = {
	//初始化配置
	'initiallize':SERVER+'/appinitservice/generate/initialize',
	//故事搜索
	'storySearch':SERVER+'/storysearch/search',
	//热门搜索关键词
	'storyKeywords':SERVER+'/storysearch/search/keywords',
	//首页导航
	'storyLists':SERVER+'/storyservice/story/list',
	//推荐位Banner
	'homeBanner':SERVER+'/homeservice/adver/list',
	//凯叔推荐
	'bossRecommend':SERVER+'/homeservice/day/recommend',
	//故事评论列表
	'storyComments':SERVER+'/storyservice/comment/list',
	///故事播放计数	
	'storyPlayerCounter':SERVER+'/storyservice/play/counter',
	//故事评论页顶部的“凯叔说”内容包括“凯叔说”的文字内容，头像
	'storyBossTalk':SERVER+'/storyservice/say/story',
	//故事评论
	'storyCmtWrite':SERVER+'/storyservice/comment',
	//评论点赞
	'storyCmtPraise':SERVER+'/storyservice/comment/praise',
	//评论取消点赞
	'storyCmtCancelPraise':SERVER+'/storyservice/story/comment/praise/cancel',
	//故事分类标签
	'storyTagGroupService':SERVER+'/tagservice/group',
	//故事分类标签
	'storyTagservice':SERVER+'/tagservice/list',
	//获取验证码
	'obtainPwd':SERVER+'/loginservice/getsmscode',
	//手机用户登录提交
	'phoneSubmit':SERVER+'/loginservice/mobile/login',
	//宝宝完善提交
	'updateSubmit':SERVER+'/userservice/baby/update',
	//我的首页
	'userIndex':SERVER+'/userservice/user/index',
	//我的收藏
	'userCollectNav':SERVER+'/userservice/favorite/count',
	//故事详情  根据故事id查找对应的故事
	'storyDetailByIds':SERVER+'/storyservice/story/detail',
	//根据专辑Id查找故事列表
	'storyListByalbumId':SERVER+'/ablumservice/findById',
	//故事详情 
	'newAlbums':SERVER+'/storyservice/story/detail',
	//获取专辑默认名称
	'obtainAlbumsName':SERVER+'/userservice/ablum/getautoname',
	//检查用户专辑名称是否重复
	'checkAlbumsName':SERVER+'/userservice/ablum/nameexists',
	//新建专辑／修改专辑／删除专辑
	'createAlbums':SERVER+'/userservice/ablum/create',
	//修改专辑／
	'updateAlbums':SERVER+'/userservice/ablum/update',

	//我的专辑 自定义专辑列表
	'userAlbum':SERVER+'/userservice/ablum/custom/list',
	//获取单个专辑的故事
	'obtainEveryAlbum':SERVER+'/userservice/ablum/storylist',
	//我喜欢的故事列表
	'userCollect':SERVER+'/userservice/story/list',
	//为自定义专辑新增故事
	'appendstory':SERVER+'/userservice/ablum/appendstory',
	//故事分类
	'storyCatalogue':SERVER+'/tagservice/group',
	//标签搜索故事和专辑
	'searchStoryAlbumByTag':SERVER+'/tagservice/search',
	//摸一摸
	'touchPage':SERVER+'/ablumservice/random',
	//播放页广告列表
	'playPageBannerList':SERVER+'/adver/promote/query'

}