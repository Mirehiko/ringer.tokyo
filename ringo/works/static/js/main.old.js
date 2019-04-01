"use strict";

// export var SCREEN_RATIO = 16/9;
// export var maxScroll = 0;
// export var WINDOW = $(window);
var SCREEN_RATIO = 16 / 9;
var maxScroll = 0;
var WINDOW = $(window);

reDrawImages($('.infiniteItem'));

$('#header-menu, #hideMenu').on('click', function (e) {
  // e.stopPropagation();
  $('.side-header').toggleClass('open');
  $('.backlayer').toggleClass('-visible-');

  if ($('.side-header').hasClass('open')) {
    $('.hmenu-text').html('Закрыть');
  } else {
    $('.hmenu-text').html('Меню');
  }
});
$('.side-header').on('click', function (e) {
  if ($('.side-header').hasClass('open')) {
    $('.side-header').removeClass('open');
    $('.backlayer').removeClass('-visible-');
    $('.side-header .line.is-b').css('display', 'block');
    $('.hmenu-text').html('Меню');
  }
}); // Toggle accordeon item

$('.toggleBtn').on('click', function (e) {
  var elemItem = $(this);
  var target = elemItem.attr('toggle-target');
  var toggleData = $(".toggleList[toggle-data=\"".concat(target, "\"]"));
  elemItem.find('.toggleBtn__icon').empty();

  if (elemItem.hasClass('collapse')) {
    elemItem.removeClass('collapse');
    toggleData.addClass('-hidden-');
    elemItem.find('.toggleBtn__icon').append('<i class="fas fa-caret-down"></i>');
  } else {
    elemItem.addClass('collapse');
    toggleData.removeClass('-hidden-');
    elemItem.find('.toggleBtn__icon').append('<i class="fas fa-caret-up"></i>');
  }
});
$('.iconBtnBox').on('click', function (e) {
  e.stopPropagation();
  $(this).toggleClass('open');

  if ($(this).hasClass('open')) {
    closeIcon($(this).find('.line.is-b'));
  } else {
    openIcon($(this).find('.line.is-b'));
  }
});
WINDOW.on('resize', function (e) {
  reDrawImages($('.infiniteItem'));
});

function moveInfinate() {
  var mar = 0;
  setInterval(function () {
    $('.infiniteList').css('margin', mar);
    mar -= 5;
  }, 100);
}

function reDrawImages(image) {
  image.width(image.height() * SCREEN_RATIO);
}

function openIcon(icon) {
  icon.css('display', 'block');
}

function closeIcon(icon) {
  icon.css('display', 'none');
}