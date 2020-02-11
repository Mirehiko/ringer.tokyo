function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { if (!(Symbol.iterator in Object(arr) || Object.prototype.toString.call(arr) === "[object Arguments]")) { return; } var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

var player = null;
var motion = null;
var type = '';
var videoObj = {};
videojs.TOUCH_ENABLED = true;

function getSize(elem) {
  return [elem.width(), elem.height()];
}

function setSizesToImages(contentWidth) {
  return new Promise(function (resolve) {
    $('.imgcfg').one('load', function () {
      var _getSize = getSize($(this)),
          _getSize2 = _slicedToArray(_getSize, 2),
          w = _getSize2[0],
          h = _getSize2[1];

      $(this).parent().width(w);
      contentWidth += w;
      $('.workInfo').width(contentWidth);
    }).each(function () {
      if (this.complete) {
        $(this).trigger('load'); // For jQuery >= 3.0
      }
    });
    setTimeout(function () {
      resolve();
    }, 1000);
  });
}

function setSizes() {
  var contentWidth = $('.infoItem').width();
  setSizesToImages(contentWidth);
}

function drawImageItem(data) {
  var item = '<div class="workItem">';

  if (data.link) {
    item += "<a href=\"".concat(data.link, "\" target=\"_blank\">");
    item += "<img class=\"workImage workContent imgcfg\" src=\"".concat(data.src);
    item += "\" alt=\"".concat(data.alt, "\"></a></div>");
  } else {
    item += "<img class=\"workImage workContent imgcfg\" src=\"".concat(data.src);
    item += "\" alt=\"".concat(data.alt, "\"></div>");
  }

  return item;
}

function drawVideoItem(data) {
  var item = '<div class="workItem videoItem">';
  item += '<img class="imgcfg" ';

  if (data.previewImage) {
    item += "src=\"".concat(data.previewImage, "\"");
  } else if (data.color) {
    item += "style=\"background-color:".concat(data.color, "\"");
  } else {
    item += 'style="background-color: #333"';
  }

  item += " alt=\"".concat(data.title, "\">");
  item += "<a href=\"#\" class=\"prevIcon\" title=\"".concat(data.title, "\" vid=\"").concat(data.id).concat('" own="'.concat(data.type === 'video' ? 'true' : 'false', '">\n\t\t<img class="playIcon" src="/static/system/play.svg" alt="play icon">\n\t</a><div class="previewcover"></div></div>'));
  return item;
}

function drawIntegratedVideoItem(data) {
  var item = '<div class="workItem videoItem">';
  item += '<img class="imgcfg" ';

  if (data.previewImage) {
    item += "src=\"".concat(data.previewImage, "\"");
  } else if (data.color) {
    item += "style=\"background-color:".concat(data.color, "\"");
  } else {
    item += 'style="background-color: #333"';
  }

  item += " alt=\"".concat(data.title, "\">");
  item += "<a href=\"#\" class=\"prevIcon\" title=\"".concat(data.title, "\" vid=\"").concat(data.id, "\">\n\t\t<img class=\"playIcon\" src=\"/static/system/play.svg\" alt=\"play icon\">\n\t</a><div class=\"previewcover\"></div></div>");
  return item;
}

function drawInfoItem(data) {
  var item = document.createElement('div');
  $(item).addClass('workItem infoItem');
  var wraper = document.createElement('div');
  $(wraper).addClass('infoWrapper');
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
  $(item).append(wraper);
  $(wraper).append(header);
  $(wraper).append(itemEtc);
  return item;
}

function selectDrawModeAndDraw(elem) {
  var item = null;

  if (elem.type === 'info') {
    item = drawInfoItem(elem);
  } else if (elem.type === 'video') {
    item = drawVideoItem(elem);
    videoObj[elem.id] = elem;
  } else if (elem.type === 'integrated_video') {
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

function drawContent(data) {
  var results = document.createElement('div');
  $(results).addClass('workInfo'); // for (let item of data) {

  for (var i = 0; i < data.length; i++) {
    $(results).append(selectDrawModeAndDraw(data[i]));
  }

  return results;
}

function showVideo() {
  $('.fullView').removeClass('-hidden-');
  motion.pauseMovement();
}

function closeVideo() {
  try {
    if (!$.isEmptyObject(player)) {
      player.pause();
      delete videojs.players[player.id_];
      player = null;
    }
  } catch (e) {
    console.log('Player does\'t exist');
  }

  $('.fullView').addClass('-hidden-');
  $('#videoContent').empty();
  motion.resumeMovement();
}

function drawVideo(id) {
  var text_elem = $.parseHTML(videoObj[id].src)[0].data;
  $('#videoContent')[0].innerHTML = text_elem;
}

function drawOwnVideo(data) {
  var video = '\n\t\t<video id="'.concat(data.id, '" class="video-js vjs-default-skin" controls preload="auto" width="640" height="264" poster="').concat(data.previewImage, '"\n\t\t data-setup="{}" title="">\n\t\t ') // .concat(data.title, '">\n\t\t ')
  .concat(data.srcMP4 ? "<source src=\"".concat(data.srcMP4, "\" type=\"video/mp4\">") : '', '\n\t\t ').concat(data.srcwebm ? "<source src=\"".concat(data.srcwebm, "\" type=\"video/webm\">") : '', '\n\t\t <p class="vjs-no-js">To view this video please enable JavaScript, and consider upgrading to a web browser that <a href="http://videojs.com/html5-video-support/" target="_blank">supports HTML5 video</a></p>\n\t\t</video>');
  $('#videoContent').append(video);
  player = videojs(data.id, {
    controls: true,
    liveui: false
  });
  player.src([{
    type: 'video/mp4',
    src: data.srcMP4
  }, {
    type: 'video/webm',
    src: data.srcwebm
  }]);
  player.ready(function () {
    player.play();
    player.pause();
  });
}

function clearContent() {
  $('#wrapper2').empty();
}

function setContent() {
  clearContent();
  $('#wrapper2').append(drawContent(textData));
}

setView();

function setView() {
  if ($(window).width() >= 768) {
    if (type !== 'desktop') {
      type = 'desktop';
      setContent();
    }

    if (motion === null) {
      motion = new Motion();
      motion.init({
        elem: '.workInfo'
      });
    } else {
      motion.updateData('.workInfo');
    }

    setSizes().then(function () {
      motion.animationOn();
    });
  } else {
    if (motion !== null) {
      motion.animationOff();
    }

    if (type !== 'mobile') {
      type = 'mobile';
      setContent();
    }
  }
}

$(window).on('resize', function () {
  setView();
});
$(document).on('keyup', function (e) {
  if (e.keyCode === 27) {
    closeVideo();
  }
});
$('body').delegate('.fullView__close', 'click', closeVideo);
$('body').delegate('.prevIcon', 'click', function (e) {
  e.preventDefault();

  if ($(this).attr('own') === 'true') {
    drawOwnVideo(videoObj[$(this).attr('vid')]);
  } else {
    drawVideo($(this).attr('vid'));
  }

  showVideo();
});
window.addEventListener('orientationchange', function () {
  if (player !== null) {
    var orientation = screen.msOrientation || screen.mozOrientation || (screen.orientation || {}).type;

    if (orientation === 'landscape-primary' || orientation === 'landscape-secondary') {
      $(window).scrollTop();
      player.focus();
      $('.vjs-fullscreen-control').click();
      player.enterFullScreen();
      player.enterFullWindow();
    } else {
      player.exitFullscreen();
      player.exitFullWindow();
    }
  }
}, false);
$(document).delegate('.vjs-play-control, .vjs-tech, .vjs-big-play-button', 'click', function () {
  if (player.paused()) {
    $('.vjs-big-play-button').show();
  } else {
    $('.vjs-big-play-button').hide();
  }
});