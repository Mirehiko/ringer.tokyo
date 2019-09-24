"use strict";function _slicedToArray(e,t){return _arrayWithHoles(e)||_iterableToArrayLimit(e,t)||_nonIterableRest()}function _nonIterableRest(){throw new TypeError("Invalid attempt to destructure non-iterable instance")}function _iterableToArrayLimit(e,t){var a=[],n=!0,r=!1,o=void 0;try{for(var i,d=e[Symbol.iterator]();!(n=(i=d.next()).done)&&(a.push(i.value),!t||a.length!==t);n=!0);}catch(e){r=!0,o=e}finally{try{n||null==d.return||d.return()}finally{if(r)throw o}}return a}function _arrayWithHoles(e){if(Array.isArray(e))return e}var motionObj,videoObj={},edge=768;function redrawBackgrounds(){var e=$(".boxItem");$.each(e,function(e,t){$(this).outerHeight($(this).outerWidth()/SCREEN_RATIO)})}function checkDimentions(){motionObj&&(motionObj.stop(),motionObj.offSroll()),$("#wrapper2").empty(),$("#wrapper2").append(drawContent(textData)),WINDOW.width()>=edge&&desktopView(textData)}function drawContent(e){var t=document.createElement("div");$(t).addClass("workInfo");for(var a=0;a<e.length;a++)$(t).append(selectDrawModeAndDraw(e[a]));return t}function drawImageItem(e){var t='<div class="workItem">';return e.link?(t+='<a href="'+e.link+'" target="_blank">',t+='<img class="workImage workContent imgcfg" src="'+e.src,t+='" alt="'+e.alt+'"></a></div>'):(t+='<img class="workImage workContent imgcfg" src="'+e.src,t+='" alt="'+e.alt+'"></div>'),t}function drawVideoItem(e){var t='<div class="workItem videoItem">';return t+='<img class="imgcfg" ',e.previewImage?t+='src="'+e.previewImage+'"':e.color?t+='style="background-color:'+e.color+'"':t+='style="background-color: #333"',t+=' alt="'+e.title+'">',t+='<a href="#" class="prevIcon" title="'+e.title+'" vid="'+e.id+'" own="'.concat("video"==e.type?"true":"false",'">\n\t\t<img class="playIcon" src="/static/system/play.svg" alt="play icon">\n\t</a><div class="previewcover"></div></div>')}function drawIntegratedVideoItem(e){var t='<div class="workItem videoItem">';return t+='<img class="imgcfg" ',e.previewImage?t+='src="'+e.previewImage+'"':e.color?t+='style="background-color:'+e.color+'"':t+='style="background-color: #333"',t+=' alt="'+e.title+'">',t+='<a href="#" class="prevIcon" title="'+e.title+'" vid="'+e.id+'">\n\t\t<img class="playIcon" src="/static/system/play.svg" alt="play icon">\n\t</a><div class="previewcover"></div></div>'}function drawInfoItem(e){var t=document.createElement("div");$(t).addClass("workItem infoItem");var a=document.createElement("div");$(a).addClass("infoWrapper");var n=document.createElement("div");$(n).addClass("paramTitle main"),$(n).text("Title");var r=document.createElement("h1");$(r).addClass("paramValue main"),$(r).text(e.title);var o=document.createElement("div");$(o).addClass("itmEtc");var i=document.createElement("div");$(i).addClass("paramLine");var d=document.createElement("span");$(d).addClass("paramTitle"),$(d).text("Launch");var l=document.createElement("span");$(l).addClass("paramValue"),$(l).text(e.launch),$(i).append(d),$(i).append(l);var c=document.createElement("div");$(c).addClass("paramLine");var s=document.createElement("span");$(s).addClass("paramTitle"),$(s).text("Category");var p=document.createElement("span");$(p).addClass("paramValue"),$(p).text(e.category),$(c).append(s),$(c).append(p);var m=document.createElement("div");$(m).addClass("paramLine");var v=document.createElement("span");$(v).addClass("paramTitle"),$(v).text("Client");var u=document.createElement("span");$(u).addClass("paramValue"),$(u).text(e.client),$(m).append(v),$(m).append(u),$(o).append(i),$(o).append(c),$(o).append(m);var w=document.createElement("div");return $(w).append(n),$(w).append(r),$(t).append(a),$(a).append(w),$(a).append(o),t}function selectDrawModeAndDraw(e){var t=null;return"info"==e.type?t=drawInfoItem(e):"video"==e.type?(t=drawVideoItem(e),videoObj[e.id]=e):"integrated_video"==e.type?(t=drawIntegratedVideoItem(e),videoObj[e.id]={src:e.src,title:e.title}):t=drawImageItem(e),t}function desktopView(){if(void 0===motionObj){motionObj=new MotionGlob($("#wrapper2"),{direction:"left",pauseOnScroll:!1,original:$(".workInfo")});var a=$(".infoItem").width();$(".imgcfg").one("load",function(){var e=_slicedToArray(getSize($(this)),2),t=e[0];e[1];$(this).parent().width(t),a+=t,$(".workInfo").width(a)}).each(function(){this.complete&&$(this).trigger("load")}),setTimeout(function(){motionObj.init()},1e3)}else motionObj.render()}function getSize(e){return[e.width(),e.height()]}function showVideo(){$(".fullView").removeClass("-hidden-"),motionObj.stop()}function closeVideo(){try{$.isEmptyObject(player)||(player.pause(),delete videojs.players[player.id_],player={})}catch(e){console.log("Player does't exist")}$(".fullView").addClass("-hidden-"),$("#videoContent").empty(),motionObj.render()}WINDOW.on("resize",function(e){checkDimentions()}),checkDimentions(),$(document).on("keyup",function(e){27==e.keyCode&&closeVideo()}),$("body").delegate(".fullView__close","click",closeVideo),$("body").delegate(".prevIcon","click",function(e){e.preventDefault(),"true"==$(this).attr("own")?drawOwnVideo(videoObj[$(this).attr("vid")]):drawVideo($(this).attr("vid")),showVideo()});var player={};function drawOwnVideo(e){var t='\n\t\t<video id="'.concat(e.id,'" class="video-js vjs-default-skin" controls preload="auto" width="640" height="264" poster="').concat(e.previewImage,'"\n\t\t data-setup="{}" title="').concat(e.title,'">\n\t\t ').concat(e.srcMP4?'<source src="'+e.srcMP4+'" type="video/mp4">':"","\n\t\t ").concat(e.srcwebm?'<source src="'+e.srcwebm+'" type="video/webm">':"",'\n\t\t <p class="vjs-no-js">To view this video please enable JavaScript, and consider upgrading to a web browser that <a href="http://videojs.com/html5-video-support/" target="_blank">supports HTML5 video</a></p>\n\t\t</video>');$("#videoContent").append(t),(player=videojs(e.id,{controls:!0,liveui:!1})).src([{type:"video/mp4",src:e.srcMP4},{type:"video/webm",src:e.srcwebm}]),player.ready(function(){player.play(),player.pause()})}function drawVideo(e){var t=$.parseHTML(videoObj[e].src)[0].data;$("#videoContent")[0].innerHTML=t}videojs.TOUCH_ENABLED=!0,window.addEventListener("orientationchange",function(){var e=screen.msOrientation||screen.mozOrientation||(screen.orientation||{}).type;"landscape-primary"==e||"landscape-secondary"==e?($(window).scrollTop(),player.focus(),$(".vjs-fullscreen-control").click(),player.enterFullScreen(),player.enterFullWindow()):(player.exitFullscreen(),player.exitFullWindow())},!1),$(document).delegate(".vjs-play-control, .vjs-tech, .vjs-big-play-button","click",function(e){player.paused()?$(".vjs-big-play-button").show():$(".vjs-big-play-button").hide()});