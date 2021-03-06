var videoObj = {};
var edge = 768;
var motionObj;

function redrawBackgrounds() {
	let items = $('.boxItem');

	$.each(items, function(key, val){
		$(this).outerHeight($(this).outerWidth() / SCREEN_RATIO);
	});
}

WINDOW.on('resize', function(e){
	checkDimentions();
});

checkDimentions();

function checkDimentions() {
	if ( motionObj ){
		motionObj.stop();
		motionObj.offSroll();
	}

	$('#wrapper2').empty();
	$('#wrapper2').append(drawContent(textData));

	if ( WINDOW.width() >= edge ) {
		desktopView(textData);
		return;
	}
}

function drawContent(data) {
	let results = document.createElement('div');
	$(results).addClass('workInfo');

	// for (let item of data) {
	// 	$(results).append(selectDrawModeAndDraw(item));
	// }
	for (let i = 0; i < data.length; i++) {
		$(results).append(selectDrawModeAndDraw(data[i]));
	}

	return results;
}

function drawImageItem(data) {
	let item = '<div class="workItem">';
	if ( data.link ) {
		item += '<a href="' + data.link + '" target="_blank">';
		item += '<img class="workImage workContent imgcfg" src="' + data.src;
		item += '" alt="' + data.alt + '"></a></div>';
	}
	else {
		item += '<img class="workImage workContent imgcfg" src="' + data.src;
		item += '" alt="' + data.alt + '"></div>';
	}

	return item;
}

function drawVideoItem(data) {
	let item = '<div class="workItem videoItem">';
	item += '<img class="imgcfg" ';

	if ( data.previewImage ) {
		item += 'src="' + data.previewImage + '"';
	} else if ( data.color ) {
		item += 'style="background-color:' + data.color + '"';
	} else {
		item += 'style="background-color: #333"';
	}

	item += ' alt="' + data.title + '">';
	item += `<a href="#" class="prevIcon" title="` + data.title + `" vid="` + data.id + `" own="${ data.type == 'video' ? 'true' : 'false' }">
		<img class="playIcon" src="images/system/play.svg" alt="play icon">
	</a><div class="previewcover"></div></div>`;

	return item;
}

function drawIntegratedVideoItem(data) {
	let item = '<div class="workItem videoItem">';
	item += '<img class="imgcfg" ';

	if ( data.previewImage ) {
		item += 'src="' + data.previewImage + '"';
	} else if ( data.color ) {
		item += 'style="background-color:' + data.color + '"';
	} else {
		item += 'style="background-color: #333"';
	}

	item += ' alt="' + data.title + '">';
	item += `<a href="#" class="prevIcon" title="` + data.title + `" vid="` + data.id + `">
		<img class="playIcon" src="images/system/play.svg" alt="play icon">
	</a><div class="previewcover"></div></div>`;

	return item;
}

function drawInfoItem(data) {
	let item = document.createElement('div');
	$(item).addClass('workItem infoItem');

	let wraper = document.createElement('div');
	$(wraper).addClass('infoWrapper');

	let workTitle = document.createElement('div');
	$(workTitle).addClass('paramTitle main');
	$(workTitle).text('Title');
	let workTitle__value = document.createElement('h1');
	$(workTitle__value).addClass('paramValue main');
	$(workTitle__value).text(data.title);

	let itemEtc = document.createElement('div');
	$(itemEtc).addClass('itmEtc');

	let workLaunch = document.createElement('div');
	$(workLaunch).addClass('paramLine');
	let workLaunch__title = document.createElement('span');
	$(workLaunch__title).addClass('paramTitle');
	$(workLaunch__title).text('Launch');
	let workLaunch__value = document.createElement('span');
	$(workLaunch__value).addClass('paramValue');
	$(workLaunch__value).text(data.launch);
	$(workLaunch).append(workLaunch__title);
	$(workLaunch).append(workLaunch__value);

	let workCategory = document.createElement('div');
	$(workCategory).addClass('paramLine');
	let workCategory__title = document.createElement('span');
	$(workCategory__title).addClass('paramTitle');
	$(workCategory__title).text('Category');
	let workCategory__value = document.createElement('span');
	$(workCategory__value).addClass('paramValue');
	$(workCategory__value).text(data.category);
	$(workCategory).append(workCategory__title);
	$(workCategory).append(workCategory__value);


	let workClient = document.createElement('div');
	$(workClient).addClass('paramLine');
	let workClient__title = document.createElement('span');
	$(workClient__title).addClass('paramTitle');
	$(workClient__title).text('Client');
	let workClient__value = document.createElement('span');
	$(workClient__value).addClass('paramValue');
	$(workClient__value).text(data.client);
	$(workClient).append(workClient__title);
	$(workClient).append(workClient__value);


	$(itemEtc).append(workLaunch);
	$(itemEtc).append(workCategory);
	$(itemEtc).append(workClient);

	let header = document.createElement('div');
	$(header).append(workTitle);
	$(header).append(workTitle__value);

	$(item).append(wraper);
	$(wraper).append(header);
	$(wraper).append(itemEtc);

	return item;
}

function selectDrawModeAndDraw(elem) {
	let item = null;

	if (elem.type == 'info') {
		item = drawInfoItem(elem);
	} else if (elem.type == 'video') {
		item = drawVideoItem(elem);
		videoObj[elem.id] = elem;
	} else if (elem.type == 'integrated_video') {
		item = drawIntegratedVideoItem(elem);
		videoObj[elem.id] = {
			src: elem.src,
			title: elem.title,
		};
	} else {
		item = drawImageItem(elem);
	}

	return item;
}

function desktopView() {

	if ( motionObj === undefined ) {
		motionObj = new MotionGlob( $('#wrapper2'), {
			direction: 'left',
			pauseOnScroll: false,
			original: $('.workInfo')
		});

		let contentWidth = $('.infoItem').width();
		$(".imgcfg").one("load", function() {
      let [w, h] = getSize($(this));
      $(this).parent().width(w);
			contentWidth += w;
			$('.workInfo').width(contentWidth);
    }).each(function() {
      if(this.complete) {
          // $(this).load(); // For jQuery < 3.0
          $(this).trigger('load'); // For jQuery >= 3.0
      }
    });

		setTimeout(function() {motionObj.init();}, 1000);
	} else {
		motionObj.render();
	}
}

function getSize(elem) {
  return [elem.width(), elem.height()];
}

$(document).on('keyup', function(e) {

	if (e.keyCode == 27) {
		closeVideo();
	}
});

$('body').delegate('.fullView__close', 'click', closeVideo);

$('body').delegate('.prevIcon', 'click', function(e) {
	e.preventDefault();

	if ( $(this).attr('own') == 'true' ) {
		drawOwnVideo( videoObj[$(this).attr('vid')] );
	} else {
		drawVideo( $(this).attr('vid') );
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
	let video = `
		<video id="${ data.id }" class="video-js vjs-default-skin" controls
		 preload="auto" width="640" height="264" poster="${ data.previewImage }"
		 data-setup="{}" title="${ data.title }">
		 ${ data.srcMP4 ? '<source src="' + data.srcMP4 + '" type=app/video/mp4">' : '' }
		 ${ data.srcwebm ? '<source src="' + data.srcwebm + '" type=app/video/webm">' : '' }
		 <p class="vjs-no-js">To view this video please enable JavaScript, and consider upgrading to a web browser that <a href="http://videojs.com/html5-video-support/" target="_blank">supports HTML5 video</a></p>
		</video>`;

	// let video = `
 //  <video id='${ data.id }' class='video-js' controls preload='auto' width='640' height='264'
 //  poster='${ data.previewImage }' data-setup='{}' title="${ data.title }">
	// 	${ data.srcMP4 ? '<source src="' + data.srcMP4 + '" type=app/video/mp4">' : '' }
	// 	${ data.srcwebm ? '<source src="' + data.srcwebm + '" type=app/video/webm">' : '' }
 //    <p class='vjs-no-js'>
 //      To view this video please enable JavaScript, and consider upgrading to a web browser that
 //      <a href='https://videojs.com/html5-video-support/' target='_blank'>supports HTML5 video</a>
 //    </p>
 //  </video>
	// `;

	$('#videoContent').append(video);
}
function drawVideo(id) {
	// $('#videoContent').append(videoObj[id].src);
  var text_elem = $.parseHTML(videoObj[id].src)[0].data;
  $("#videoContent")[0].innerHTML = text_elem;
}
