var firstID = '';
var lastID = '';
var videoObj = {};

$('#workPage').append(drawContent(textData));
// redrawBackgrounds();
// checkForAdditionData();z


// $(window).on('resize', function(e) {
// 	redrawBackgrounds();
// });


function redrawBackgrounds() {
	let items = $('.boxItem');

	$.each(items, function(key, val){
		$(this).outerHeight($(this).outerWidth() / SCREEN_RATIO);
	});
}



function drawContent(data) {
	let results = document.createElement('div');
	$(results).addClass('workInfo');

	for (let item of data) {
		$(results).append(selectDrawModeAndDraw(item));
	}

	return results;
}

function drawImageItem(data) {
	let item = '<div class="workItem">';
	item += '<img class="workImage workContent" src="' + data.src;
	item += '" alt="' + data.alt + '"></div>';
	return item;
}
function drawVideoItem(data) {
	let item = '<div class="workItem videoItem">';
	item += '<img ';

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
	item += '<img ';

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

	let workTitle = document.createElement('div');
	$(workTitle).addClass('paramTitle');
	$(workTitle).text('Title');
	let workTitle__value = document.createElement('h1');
	$(workTitle__value).addClass('paramValue');
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

	$(item).append(workTitle);
	$(item).append(workTitle__value);
	$(item).append(itemEtc);

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

var motionObj = new Motion( $('.workInfo'), textData, {
	direction: 'left',
	pauseOnScroll: false,
} );

motionObj.appendToEnd = function() {
	let elem = this.data.splice(0,1);
	let item = null;

	item = selectDrawModeAndDraw(elem[0]);
	$(item).addClass(this.hoverAction);
	this.container.append(item);

	this.data = this.data.concat(elem);
	// redrawBackgrounds();
};

motionObj.prependToStart = function() {
	let elem = this.data.splice(-1,1);
	let item = null;

	item = selectDrawModeAndDraw(elem[0]);
	$(item).addClass(this.hoverAction);
	this.container.prepend(item);

	//
	this.data = elem.concat(this.data);
}

motionObj.replaceHorizontal = function(way) {
	let first = this.container.children().first();
	let last = this.container.children().last();
	this.isCanReplace = false;
	// console.log('replaceHorizontal');
	console.log(way)

	if (way == 'left') {
		if ( this.isLastOnScreen() ) {
			this.appendToEnd();
			// redrawBackgrounds();
		}

		if ( this.isFirstLeaveScreen() ) {
			this.firstSize = first.width();
			this.removeElem(first);
			this.setPropsToFirst(this.container.children().first());
		}

	} else {
		if ( this.isFirstOnScreen() ) {
			this.prependToStart();
			// redrawBackgrounds();

			this.container.children().css('margin-'+this.needSide, 0);
			first = this.container.children().first();
			first.css('margin-'+this.needSide, this.currentMargin - first.width());
		}

		if ( this.isLastLeaveScreen() ) {
			this.removeElem(last);
		}
	}

	this.isCanReplace = true;
};

motionObj.init();



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
	motionObj.clearTimers();
}
function closeVideo() {
	$('.fullView').addClass('-hidden-');
	$('#videoContent').empty();
	motionObj.simpleMotion();
}

function drawOwnVideo(data) {
	let video = `
		<video id="${ data.id }" class="video-js vjs-default-skin" controls
		 preload="auto" width="640" height="264" poster="${ data.previewImage }"
		 data-setup="{}" title="${ data.title }">
		 ${ data.srcMP4 ? '<source src="' + data.srcMP4 + '" type="video/mp4">' : '' }
		 ${ data.srcwebm ? '<source src="' + data.srcwebm + '" type="video/webm">' : '' }
		 <p class="vjs-no-js">To view this video please enable JavaScript, and consider upgrading to a web browser that <a href="http://videojs.com/html5-video-support/" target="_blank">supports HTML5 video</a></p>
		</video>`;
	$('#videoContent').append(video);
}
function drawVideo(id) {
	$('#videoContent').append(videoObj[id].src);
}
