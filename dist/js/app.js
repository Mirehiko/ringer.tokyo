!function(e){var n={};function t(i){if(n[i])return n[i].exports;var o=n[i]={i:i,l:!1,exports:{}};return e[i].call(o.exports,o,o.exports,t),o.l=!0,o.exports}t.m=e,t.c=n,t.d=function(e,n,i){t.o(e,n)||Object.defineProperty(e,n,{enumerable:!0,get:i})},t.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},t.t=function(e,n){if(1&n&&(e=t(e)),8&n)return e;if(4&n&&"object"==typeof e&&e&&e.__esModule)return e;var i=Object.create(null);if(t.r(i),Object.defineProperty(i,"default",{enumerable:!0,value:e}),2&n&&"string"!=typeof e)for(var o in e)t.d(i,o,function(n){return e[n]}.bind(null,o));return i},t.n=function(e){var n=e&&e.__esModule?function(){return e.default}:function(){return e};return t.d(n,"a",n),n},t.o=function(e,n){return Object.prototype.hasOwnProperty.call(e,n)},t.p="../",t(t.s=0)}([function(e,n,t){"use strict";t.r(n);t(1)},function(e,n){var t=16/9;$(window);function i(e){e.width(e.height()*t)}i($(".infiniteItem")),$("#header-menu, #hideMenu").on("click",function(e){$(".side-header").toggleClass("open"),$(".backlayer").toggleClass("-visible-"),$(".side-header").hasClass("open")?$(".hmenu-text").html("Close"):$(".hmenu-text").html("Menu")}),$(".side-header").on("click",function(e){$(".side-header").hasClass("open")&&($(".side-header").removeClass("open"),$(".backlayer").removeClass("-visible-"),$(".side-header .line.is-b").css("display","block"),$(".hmenu-text").html("Menu"))}),$(".toggleBtn").on("click",function(e){let n=$(this),t=n.attr("toggle-target"),i=$(`.toggleList[toggle-data="${t}"]`);n.find(".toggleBtn__icon").empty(),n.hasClass("collapse")?(n.removeClass("collapse"),i.addClass("-hidden-"),n.find(".toggleBtn__icon").append('<i class="fas fa-caret-down"></i>')):(n.addClass("collapse"),i.removeClass("-hidden-"),n.find(".toggleBtn__icon").append('<i class="fas fa-caret-up"></i>'))}),$(".iconBtnBox").on("click",function(e){e.stopPropagation(),$(this).toggleClass("open"),$(this).hasClass("open")?$(this).find(".line.is-b").css("display","none"):function(e){e.css("display","block")}($(this).find(".line.is-b"))}),$(window).on("resize",function(e){i($(".infiniteItem"))})}]);