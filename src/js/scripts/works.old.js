"use strict";

var videoObj = {};
var edge = 768;
var motionObj;

function redrawBackgrounds() {
  var items = $('.boxItem');
  $.each(items, function (key, val) {
    $(this).outerHeight($(this).outerWidth() / SCREEN_RATIO);
  });
}

WINDOW.on('resize', function (e) {
  checkDimentions();
});
checkDimentions();

function checkDimentions() {
  if (motionObj) {
    motionObj.stop();
    motionObj.offSroll();
  }

  $('#wrapper').empty();
  $('#wrapper').append(drawContent(textData));

  if (WINDOW.width() >= edge) {
    desktopView(textData);
    return;
  }
}

function drawContent(data) {
  var results = document.createElement('div');
  $(results).addClass('workInfo'); // for (let item of data) {
  // 	$(results).append(selectDrawModeAndDraw(item));
  // }

  for (var i = 0; i < data.length; i++) {
    $(results).append(selectDrawModeAndDraw(data[i]));
  }

  return results;
}

function drawImageItem(data) {
  var item = '<div class="workItem">';
  item += '<img class="workImage workContent" src="' + data.src;
  item += '" alt="' + data.alt + '"></div>';
  return item;
}

function drawVideoItem(data) {
  var item = '<div class="workItem videoItem">';
  item += '<img ';

  if (data.previewImage) {
    item += 'src="' + data.previewImage + '"';
  } else if (data.color) {
    item += 'style="background-color:' + data.color + '"';
  } else {
    item += 'style="background-color: #333"';
  }

  item += ' alt="' + data.title + '">';
  item += "<a href=\"#\" class=\"prevIcon\" title=\"" + data.title + "\" vid=\"" + data.id + "\" own=\"".concat(data.type == 'video' ? 'true' : 'false', "\">\n\t\t<img class=\"playIcon\" src=\"images/system/play.svg\" alt=\"play icon\">\n\t</a><div class=\"previewcover\"></div></div>");
  return item;
}

function drawIntegratedVideoItem(data) {
  var item = '<div class="workItem videoItem">';
  item += '<img ';

  if (data.previewImage) {
    item += 'src="' + data.previewImage + '"';
  } else if (data.color) {
    item += 'style="background-color:' + data.color + '"';
  } else {
    item += 'style="background-color: #333"';
  }

  item += ' alt="' + data.title + '">';
  item += "<a href=\"#\" class=\"prevIcon\" title=\"" + data.title + "\" vid=\"" + data.id + "\">\n\t\t<img class=\"playIcon\" src=\"images/system/play.svg\" alt=\"play icon\">\n\t</a><div class=\"previewcover\"></div></div>";
  return item;
}

function drawInfoItem(data) {
  var item = document.createElement('div');
  $(item).addClass('workItem infoItem');
  var workTitle = document.createElement('div');
  $(workTitle).addClass('paramTitle main');
  $(workTitle).text('Title');
  var workTitle__value = document.createElement('h1');
  $(workTitle__value).addClass('paramValue main');
  $(workTitle__value).text(data.title);
  var itemEtc = document.createElement('div');
  $(itemEtc).addClass('itmEtc');
  var workLaunch = document.createElement('div');
  $(workLaunch).addClass('paramLine');
  var workLaunch__title = document.createElement('span');
  $(workLaunch__title).addClass('paramTitle');
  $(workLaunch__title).text('Launch');
  var workLaunch__value = document.createElement('span');
  $(workLaunch__value).addClass('paramValue');
  $(workLaunch__value).text(data.launch);
  $(workLaunch).append(workLaunch__title);
  $(workLaunch).append(workLaunch__value);
  var workCategory = document.createElement('div');
  $(workCategory).addClass('paramLine');
  var workCategory__title = document.createElement('span');
  $(workCategory__title).addClass('paramTitle');
  $(workCategory__title).text('Category');
  var workCategory__value = document.createElement('span');
  $(workCategory__value).addClass('paramValue');
  $(workCategory__value).text(data.category);
  $(workCategory).append(workCategory__title);
  $(workCategory).append(workCategory__value);
  var workClient = document.createElement('div');
  $(workClient).addClass('paramLine');
  var workClient__title = document.createElement('span');
  $(workClient__title).addClass('paramTitle');
  $(workClient__title).text('Client');
  var workClient__value = document.createElement('span');
  $(workClient__value).addClass('paramValue');
  $(workClient__value).text(data.client);
  $(workClient).append(workClient__title);
  $(workClient).append(workClient__value);
  $(itemEtc).append(workLaunch);
  $(itemEtc).append(workCategory);
  $(itemEtc).append(workClient);
  var header = document.createElement('div');
  $(header).append(workTitle);
  $(header).append(workTitle__value);
  $(item).append(header);
  $(item).append(itemEtc);
  return item;
}

function selectDrawModeAndDraw(elem) {
  var item = null;

  if (elem.type == 'info') {
    item = drawInfoItem(elem);
  } else if (elem.type == 'video') {
    item = drawVideoItem(elem);
    videoObj[elem.id] = elem;
  } else if (elem.type == 'integrated_video') {
    item = drawIntegratedVideoItem(elem);
    videoObj[elem.id] = {
      src: elem.src,
      title: elem.title
    };
  } else {
    item = drawImageItem(elem);
  }

  return item;
}

function desktopView() {
  if (motionObj === undefined) {
    motionObj = new MotionGlob($('#wrapper'), {
      direction: 'left',
      pauseOnScroll: false,
      original: $('.workInfo')
    });
    setTimeout(function () {
      motionObj.init();
    }, 1000);
  } else {
    motionObj.render();
  }
}

$(document).on('keyup', function (e) {
  if (e.keyCode == 27) {
    closeVideo();
  }
});
$('body').delegate('.fullView__close', 'click', closeVideo);
$('body').delegate('.prevIcon', 'click', function (e) {
  e.preventDefault();

  if ($(this).attr('own') == 'true') {
    drawOwnVideo(videoObj[$(this).attr('vid')]);
  } else {
    drawVideo($(this).attr('vid'));
  }

  showVideo();
});

function showVideo() {
  $('.fullView').removeClass('-hidden-');
  motionObj.stop();
}

function closeVideo() {
  $('.fullView').addClass('-hidden-');
  $('#videoContent').empty();
  motionObj.render();
}

function drawOwnVideo(data) {
  var video = "\n\t\t<video id=\"".concat(data.id, "\" class=\"video-js vjs-default-skin\" controls\n\t\t preload=\"auto\" width=\"640\" height=\"264\" poster=\"").concat(data.previewImage, "\"\n\t\t data-setup=\"{}\" title=\"").concat(data.title, "\">\n\t\t ").concat(data.srcMP4 ? '<source src="' + data.srcMP4 + '" type="video/mp4">' : '', "\n\t\t ").concat(data.srcwebm ? '<source src="' + data.srcwebm + '" type="video/webm">' : '', "\n\t\t <p class=\"vjs-no-js\">To view this video please enable JavaScript, and consider upgrading to a web browser that <a href=\"http://videojs.com/html5-video-support/\" target=\"_blank\">supports HTML5 video</a></p>\n\t\t</video>");
  $('#videoContent').append(video);
}

function drawVideo(id) {
  $('#videoContent').append(videoObj[id].src);
}