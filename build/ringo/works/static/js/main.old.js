"use strict";var SCREEN_RATIO=16/9,maxScroll=0,WINDOW=$(window);function moveInfinate(){var e=0;setInterval(function(){$(".infiniteList").css("margin",e),e-=5},100)}function reDrawImages(e){e.width(e.height()*SCREEN_RATIO)}function openIcon(e){e.css("display","block")}function closeIcon(e){e.css("display","none")}function sendEmail(){var e={};e.name=$("#name").val(),e.company=$("#company").val(),e.email=$("#email").val(),e.website=$("#website").val(),e.reason=$("#reason option:selected").val(),e.message=$("#message").val(),$.ajax({url:"/api/send_email_to_admin/12/",type:"POST",data:e,dataType:"json",success:function(e){"success"==e?$(".contactForm__send").addClass("is-complete"):alert("Произошла ошибка при отправке сообщения. Попробуйте повторить операцию позднее."),console.log("response:",e)}})}reDrawImages($(".infiniteItem")),$("#header-menu, #hideMenu").on("click",function(e){$(".side-header").toggleClass("open"),$(".backlayer").toggleClass("-visible-"),$(".side-header").hasClass("open")?$(".hmenu-text").html("Закрыть"):$(".hmenu-text").html("Меню")}),$(".side-header").on("click",function(e){$(".side-header").hasClass("open")&&($(".side-header").removeClass("open"),$(".backlayer").removeClass("-visible-"),$(".side-header .line.is-b").css("display","block"),$(".hmenu-text").html("Меню"))}),$(".toggleBtn").on("click",function(e){var s=$(this),n=s.attr("toggle-target"),a=$('.toggleList[toggle-data="'.concat(n,'"]'));s.find(".toggleBtn__icon").empty(),s.hasClass("collapse")?(s.removeClass("collapse"),a.addClass("-hidden-"),s.find(".toggleBtn__icon").append('<i class="fas fa-caret-down"></i>')):(s.addClass("collapse"),a.removeClass("-hidden-"),s.find(".toggleBtn__icon").append('<i class="fas fa-caret-up"></i>'))}),$(".iconBtnBox").on("click",function(e){e.stopPropagation(),$(this).toggleClass("open"),$(this).hasClass("open")?closeIcon($(this).find(".line.is-b")):openIcon($(this).find(".line.is-b"))}),WINDOW.on("resize",function(e){reDrawImages($(".infiniteItem"))});