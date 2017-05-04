		//故事类
		function Story(storyId,storyName,url,coverurl,iconurl,time){
				this.id = storyId;
				this.name = storyName;
				this.url = url;
				this.coverurl = coverurl;
				this.iconurl = iconurl;
				this.totaltime = time;
		}
		//故事列表类
		function storyList(storyData,audioSource,fun){
			//所有的故事
	        this.allStory = fun(storyData);
	        //当前故事
	        this.currentStory = this.allStory[0];
	        //当前故事索引
	        this.currentIndex = this.allStory.key || 0;
	        //audio元素
	        this.audioElement = audioSource;

	        //定义上一首                        
	        if (this.currentIndex - 1 >= 0) {
	            this.previousStory = allStory[this.currentIndex - 1];
	        }
	        else {
	            this.previousStory = null;
	        }
	        //定义下一首
	        //this.currentIndex = index || 0;
	        if (this.currentIndex + 1 < this.allStory.length) {
	            this.nextStory = this.allStory[this.currentIndex + 1];
	        }
	        else {
	            this.nextStory = null;
	        }

		}
		storyList.prototype.playThisStory = function(index){
			this.currentIndex = index;
			this.currentStory = this.allStory[this.currentIndex];
			this.audioElement.src = this.currentStory.value.url;
			var nextIndex,preIndex = 0;

			nextIndex = parseInt(index)+1;
			preIndex = parseInt(index)-1;
			if (nextIndex< this.allStory.length) {
                this.nextStory = this.allStory[nextIndex];
            }else {
                this.nextStory = null;
            }

            if (preIndex >= 0) {
                this.previousStory = this.allStory[preIndex];
            }
            else {
                this.previousStory = null;
            }
            //this.audioElement.play();
		}
		//重置播放列表
	    storyList.prototype.resetList = function () {
	    	this.currentStory = this.allStory[0];
	        //当前故事索引
	        this.currentIndex = 0;
	        this.audioElement.src = this.currentStory.value.url;
	        
	        //定义上一首                        
	        if (this.currentIndex - 1 >= 0) {
	            this.previousStory = allStory[this.currentIndex - 1];
	        }
	        else {
	            this.previousStory = null;
	        }
	        //定义下一首
	        //this.currentIndex = index || 0;
	        if (this.currentIndex + 1 < this.allStory.length) {
	            this.nextStory = this.allStory[this.currentIndex + 1];
	        }
	        else {
	            this.nextStory = null;
	        }

	        this.audioElement.pause();
	    }
		//播放事件监听
		storyList.prototype.mediaEvent = function(eventType, callback){
			this.audioElement.removeEventListener(eventType,callback,true);
		    this.audioElement.addEventListener(eventType,callback);
		}
		
		//加载
	    storyList.prototype.load = function () {
	        this.audioElement.src = this.currentStory.value.url;
	        this.audioElement.load();
	    }

	    //播放
	    storyList.prototype.play = function () {
	        this.audioElement.play();
	    }

	    //暂停
	    storyList.prototype.pause = function () {
	        this.audioElement.pause();
	    }

		//控制播放
	    storyList.prototype.controlStory = function () {
	    	
	        if (this.audioElement.paused) {
	            this.audioElement.play();
	        }
	        else {
	            this.audioElement.pause();
	        }
	    }

	    //上一首
        storyList.prototype.moveToPreviousStory = function () {
			this.audioElement.currentTime = 0;
            if (this.currentIndex - 1 >= 0) {
                this.currentStory = this.allStory[this.currentIndex - 1];
                this.currentIndex--;
                this.audioElement.src = this.currentStory.value.url;
                //this.audioElement.play();
                this.nextStory = this.allStory[this.currentIndex+1];
                if (this.currentIndex - 1 >= 0) {
                    this.previousStory = this.allStory[this.currentIndex - 1];
                }
                else {
                    this.previousStory = null;
                }
            }
            else {
                this.audioElement.src = this.currentStory.value.url;
                //this.audioElement.play();
            }
        }

           //下一首
        storyList.prototype.moveToNextStory = function () {
			  this.audioElement.currentTime = 0;
            if (this.currentIndex + 1 < this.allStory.length) {
                this.currentStory = this.allStory[this.currentIndex + 1];
                this.currentIndex++;
                this.audioElement.src = this.currentStory.value.url;
                //this.audioElement.play();
                this.previousStory = this.allStory[this.currentIndex - 1];
                if (this.currentIndex + 1 < this.allStory.length) {
                    this.nextStory = this.allStory[this.currentIndex + 1];
                }
                else {
                    this.nextStory = this.allStory[0];
                }

            }
            else {
                //返回到头部
                // this.currentStory = this.allStory[0];

                // this.currentIndex = this.currentStory.key;

                if (this.currentIndex - 1 >= 0) {
                    this.previousStory = this.allStory[this.currentIndex - 1];
                }
                else {
                    this.previousStory = null;
                }

                if (this.currentIndex + 1 < this.allStory.length) {
                    this.nextStory = this.allStory[this.currentIndex + 1];
                }
                else {
                    this.nextStory = null;
                }
                this.audioElement.src = this.currentStory.value.url;
                //this.audioElement.play();
            }
        }
        
		module.exports = {
				getStoryList:function(){
					return storyList;
				},
				getStory:function(){
					return Story;
				}

		};
