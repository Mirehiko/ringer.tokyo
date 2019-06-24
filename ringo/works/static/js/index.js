"use strict";var computedLines=[],renderedData=[],isScrolling=!1;Array.prototype.shuffle=function(){for(var e=this.length-1;0<e;e--){var t=Math.floor(Math.random()*(e+1)),a=this[t];this[t]=this[e],this[e]=a}return this};var motionObj,firstID="",lastID="",windowObj=$(window),homePageObj=$("#homePage");function renderer(){windowObj.width()<768?(homePageObj.empty(),homePageObj.append(renderMobile(textData))):(homePageObj.empty(),homePageObj.append(renderPage(textData)),motionObj=new MotionGlob($("#homePage"),{onhover:"nothing",itemClass:".boxItem",delayAfterHover:2,original:$(".infiniteBox")}),setTimeout(function(){motionObj.init()},1e3))}function checkForAdditionData(){var e=$(".infiniteBox"),t=$(window);for($(".infirow:last-child");$(".infirow:last-child").offset().top-t.height()<0;)try{var a=computedLines.splice(0,1);2==a.length?e.append(doubleLine(a)):e.append(a[0].lineType(a[0].data)),computedLines=computedLines.concat(a),redrawBackgrounds()}catch(e){console.log(e)}}function renderMobile(e){var t=document.createElement("div");$(t).addClass("infiniteBox");for(var a=document.createDocumentFragment(),n=0;n<e.length;n++)$(a).append(mobileItem(e[n]));return $(t).append(a),t}function mobileItem(e){return'\n\t\t<a href="'.concat(e.link,'" class="mobItem" title="Перейти к ').concat(e.title,'">\n\t\t\t<img class="mobileItem__image" src="').concat(e.src,'" alt="">\n\t\t\t<div class="mobItem__info">\n\t\t\t\t<h2 class="paramLine">\n\t\t\t\t\t<span class="paramTitle">Title</span>\n\t\t\t\t\t<span class="paramValue">').concat(e.title,'</span>\n\t\t\t\t</h2>\n\t\t\t\t<div class="paramLine">\n\t\t\t\t\t<span class="paramTitle">Launch</span>\n\t\t\t\t\t<span class="paramValue">').concat(e.lauch,'</span>\n\t\t\t\t</div>\n\t\t\t\t<div class="paramLine">\n\t\t\t\t\t<span class="paramTitle">Category</span>\n\t\t\t\t\t<span class="paramValue">').concat(e.category,"</span>\n\t\t\t\t</div>\n\t\t\t</div>\n\t\t</a>")}function renderPage(e){var t=e,a=document.createElement("div");$(a).addClass("infiniteBox");var n=calcView(e.length),r=n.filter(function(e){return 3==e}),i=[],o=[];if(r.length){for(var d=0;d<r.length;d++)o.push(autoSelectType());for(var c=0;c<r.length;c++)i.push({lineType:o[c],data:[].concat(t.splice(0,r[c]))})}var l=n.filter(function(e){return 2==e}),s=[];if(l.length)for(var p=0;p<l.length;p++)s.push({lineType:"double",data:[].concat(t.splice(0,l[p]))});(computedLines=s.concat(i)).shuffle();for(var m=0;m<computedLines.length;m++){var u=computedLines[m];"double"==u.lineType?$(a).append(doubleLine(u.data)):$(a).append(u.lineType(u.data))}return a}function autoSelectType(){var e=null;switch(randomInteger(1,3)){case 1:e=tripleLine;break;case 2:e=tsobLine;break;case 3:e=obtsLine}return e}function calcView(e){var t=[],a=0,n=0,r=0,i=!0,o=3;if(e<5&&(o=2),0!=e)for(;i;)e<(a+=o)+r?(r=e-n,a=0,t=[]):(t.push(o),a+r==e&&(1==r?(r=e-n,t=[],a=0):i=!1)),n=a;if(3<=o)if(2==r)t.push(2);else if(0!=r)for(var d=0;d<r/2;d++)t.push(2);return t}function randomInteger(e,t){var a=e-.5+Math.random()*(t-e+1);return a=Math.round(a)}function tsobLine(e){var t=e.slice(),a=document.createElement("div");$(a).addClass("infirow");var n=document.createElement("div");$(n).addClass("col-8"),$(n).append(drawItem(t[0])),t.splice(0,1);var r=document.createElement("div");for($(r).addClass("col-4");$(r).append(drawItem(t[0])),t.splice(0,1),t.length;);return $(a).append(r),$(a).append(n),a}function obtsLine(e){var t=e.slice(),a=document.createElement("div");$(a).addClass("infirow");var n=document.createElement("div");$(n).addClass("col-8"),$(n).append(drawItem(t[0])),t.splice(0,1);var r=document.createElement("div");for($(r).addClass("col-4");$(r).append(drawItem(t[0])),t.splice(0,1),t.length;);return $(a).append(n),$(a).append(r),a}function tripleLine(e){var t=e.slice(),a=document.createElement("div");$(a).addClass("infirow");do{var n=document.createElement("div");$(n).addClass("col-4"),$(n).append(drawItem(t[0])),$(a).append(n),t.splice(0,1)}while(t.length);return a}function doubleLine(e){var t=e.slice(),a=document.createElement("div");$(a).addClass("infirow");do{var n=document.createElement("div");$(n).addClass("col-6"),$(n).append(drawItem(t[0])),$(a).append(n),t.splice(0,1)}while(t.length);return a}function redrawBackgrounds(){var e=$(".boxItem");$.each(e,function(e,t){$(this).outerHeight($(this).outerWidth()/SCREEN_RATIO)})}function drawItem(e){var t=document.createElement("a");t.href=e.link,$(t).addClass("boxItem");var a=document.createElement("div");$(a).addClass("itemWrapper"),$(t).append(a);var n=document.createElement("div");$(n).addClass("itemBack"),$(n).css("background-image","url("+e.src+")"),$(n).css("background-size","cover"),$(n).css("background-repeat","no-repeat"),$(a).append(n);var r=document.createElement("div");$(r).addClass("itemContent"),$(a).append(r);var i=document.createElement("div");$(i).addClass("itemTitle withValue"),$(i).text("Title"),$(r).append(i);var o=document.createElement("span");$(o).text(e.title),$(i).append(o);var d=document.createElement("div");$(d).addClass("itemLauchDate withValue"),$(d).text("Launch"),$(r).append(d);var c=document.createElement("span");$(c).text(e.lauch),$(d).append(c);var l=document.createElement("div");$(l).addClass("itemCategory withValue"),$(l).text("Category"),$(r).append(l);var s=document.createElement("span");$(s).text(e.category),$(l).append(s);var p=document.createElement("div");$(p).addClass("itemPreview"),$(r).append(p);var m=document.createElement("div");$(m).addClass("itemPreview__box"),$(p).append(m);var u=document.createElement("div");return $(u).addClass("itemPreview__btn"),$(p).append(u),t}renderer(),768<=WINDOW.width()&&(redrawBackgrounds(),checkForAdditionData()),$(window).on("resize",function(e){redrawBackgrounds()}),$("#mobileCategory>.toggleBtn").on("click",function(e){var t=$(this),a=$("#mobileNav");t.hasClass("collapse")?a.addClass("-open-"):a.removeClass("-open-")}),$(".toggleList__item").on("click",function(e){e.preventDefault();var t=$(this).attr("globcat");$(".toggleList__item.-active-").removeClass("-active-"),$('.toggleList__item[globcat="'.concat(t,'"]')).addClass("-active-");var a=$(this).text();$(".toggleBtn__text[globcat]").text(a)});