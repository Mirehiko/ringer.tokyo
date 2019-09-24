(function() {
	var lastTime = 0;
	var vendors = ['ms', 'moz', 'webkit', 'o'];
	for(var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
			window.requestAnimationFrame = window[vendors[x]+'RequestAnimationFrame'];
			window.cancelAnimationFrame = window[vendors[x]+'CancelAnimationFrame']
																 || window[vendors[x]+'CancelRequestAnimationFrame'];
	}

	if (!window.requestAnimationFrame)
		window.requestAnimationFrame = function(callback, element) {
			var currTime = new Date().getTime();
			var timeToCall = Math.max(0, 16 - (currTime - lastTime));
			var id = window.setTimeout(function() { callback(currTime + timeToCall); },
				timeToCall);
			lastTime = currTime + timeToCall;
			return id;
		};

	if (!window.cancelAnimationFrame)
		window.cancelAnimationFrame = function(id) {
			clearTimeout(id);
		};
}());



class Motion {
	constructor() {
		this.scroll_timer        = null;
		this.speed               = 1;
		this.key_delta           = 10;
		this.xPos 		           = 0;
		this.yPos 		           = 0;
		this.axis                = 'horizontal';
		this.onHover             = false;
		this.has_pause_on_scroll = false;
		this.requestID           = undefined;
		this.content_length      = 0;
		this.elem                = null;

		return this;
	}

	init(data) {
		this.elem = $(data.elem);
		console.log('[LOG] Data initialized');
		return this;
	}

	initAnimation() {
		if ( this.isNeedToAnimate(this.elem) ) {
			this.prepareToAnimate();
			this.startMovement();
		}
		else {
			this.stopMovement();
		}

		return this;
	}

	mouseActions() {
		console.log('[LOG] Starting attach mouse events');
	}

	keyboardActions() {
		console.log('[LOG] Starting attach keyboard events');
	}



	scroll(inst) {
		let params = {};
		if (inst.xPos <= -inst.content_length) {
			inst.xPos = 0;
		}
		inst.xPos -= inst.speed;

		params.xPos = inst.xPos;
		params.yPos = inst.yPos;
		params.elem = inst.elem;

		console.log(inst.xPos)

		inst.setPosition(params);
	}

	setPosition(params) {
		params.elem[0].style.transform = `translate3d(${params.xPos}px, ${params.yPos}px, 0)`;
		// params.elem.attr('transform', `translate3d(${params.xPos}px, ${params.yPos}px, 0)`);
	}

	render() {
		const refreshRate = 1000 / 60;
		let self = this;

		function renderStep() {
			// if (self.hoveringItem != null) {
			//   self.getEdgesOfHover();
			//   // console.log('Is hovering:', self.isInsiteOfItem())
			//   if ( !self.isInsiteOfItem() ) {
			//     self.hoveringItem.removeClass('-hover-');
			//     self.hoveringItem = null;
			//   }
			// }

			// if ( !self.onpause ) {
			//   self.itemPosition -= self.itemSpeed;
			// }
			// self.setPropsToFirst(self.firstItem);
			// if ( !self.onpause && self.isCanReplace ) {
			//   self.replaceObjects('next');
			// }
			self.scroll(self);

			if ( self.requestID ) {
				self.requestID = window.requestAnimationFrame(renderStep);
			}
		}

		this.requestID = window.requestAnimationFrame(renderStep);
	}

	startMovement() {
		this.render();
		console.log('[LOG] Animation started');
	}

	stopMovement() {
		if (this.requestID) {
			window.cancelAnimationFrame(this.requestID);
			this.requestID = undefined;
		}
		console.log('[LOG] Animation stopped');
	}

	prepareToAnimate() {
		console.log('[LOG] Starting prepare data to animate');
		this.content_length = this.elem.outerWidth();
		this.elem.append( this.copyContent(this.elem) );
		console.log('[LOG] Data to animate prepared');
	}

	static isNeedToAnimate(elem) {
		let compare_elem = elem || this.elem;
		if (compare_elem.outerWidth() < compare_elem.parent().outerWidth()) {
			console.log('[CHECK] Do not need to animate');
			return false;
		}
		console.log('[CHECK] Need to animate');
		return true;
	}

	static copyContent(elem) {
		return elem.contents('.workItem').clone();
	}
}




var videoObj = {};
var edge = 768;

$("#wrapper2").empty();
$("#wrapper2").append(drawContent(textData));


setSizesToImages();

// var container = $('.workInfo');

var motion = new Motion();
motion.init({
	elem: '.workInfo', 
});

// setTimeout(function() {
// 	// if ( isNeedToAnimate(container) ) {
// 	if ( motion.isNeedToAnimate() ) {
// 		let items_length = container.outerWidth();
// 		container.append( copyContent(container) );

// 		var motion = new Motion();
// 		setTimeout(function() {
// 			motion.init({
// 				elem: '.workInfo', 
// 				content_length: items_length,
// 			});
// 		}, 1000);
// 	}
// }, 1000);



// function copyContent(elem) {
// 	return elem.contents('.workItem').clone();
// }

// function isNeedToAnimate(elem) {
// 	console.log(elem.outerWidth(), elem.parent().outerWidth())
// 	if (elem.outerWidth() < elem.parent().outerWidth()) {
// 		console.log('Do not need to animate')
// 		return false;
// 	}
// 	console.log('Need to animate')
// 	return true;
// }

function setSizesToImages() {
	let contentWidth = $('.infoItem').width();
	$(".imgcfg").one("load", function() {
		let [w, h] = getSize($(this));
		$(this).parent().width(w);
		contentWidth += w;
		$('.workInfo').width(contentWidth);
	}).each(function() {
		if(this.complete) {
			$(this).trigger('load'); // For jQuery >= 3.0
		}
	});
}

function getSize(elem) {
	return [elem.width(), elem.height()];
}

function drawContent(data) {
	var results = document.createElement("div");
	$(results).addClass("workInfo"); // for (let item of data) {

	for (var i = 0; i < data.length; i++) {
		$(results).append(selectDrawModeAndDraw(data[i]));
	}

	return results;
}

function selectDrawModeAndDraw(elem) {
	var item = null;

	if (elem.type == "info") {
		item = drawInfoItem(elem);
	} else if (elem.type == "video") {
		item = drawVideoItem(elem);
		videoObj[elem.id] = elem;
	} else if (elem.type == "integrated_video") {
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

function drawImageItem(data) {
	var item = '<div class="workItem">';
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
	var item = '<div class="workItem videoItem">';
	item += '<img class="imgcfg" ';

	if (data.previewImage) {
		item += 'src="' + data.previewImage + '"';
	} else if (data.color) {
		item += 'style="background-color:' + data.color + '"';
	} else {
		item += 'style="background-color: #333"';
	}

	item += ' alt="' + data.title + '">';
	item +=
		'<a href="#" class="prevIcon" title="' +
		data.title +
		'" vid="' +
		data.id +
		'" own="'.concat(
			data.type == "video" ? "true" : "false",
			'">\n\t\t<img class="playIcon" src="/static/system/play.svg" alt="play icon">\n\t</a><div class="previewcover"></div></div>'
		);
	return item;
}

function drawIntegratedVideoItem(data) {
	var item = '<div class="workItem videoItem">';
	item += '<img class="imgcfg" ';

	if (data.previewImage) {
		item += 'src="' + data.previewImage + '"';
	} else if (data.color) {
		item += 'style="background-color:' + data.color + '"';
	} else {
		item += 'style="background-color: #333"';
	}

	item += ' alt="' + data.title + '">';
	item +=
		'<a href="#" class="prevIcon" title="' +
		data.title +
		'" vid="' +
		data.id +
		'">\n\t\t<img class="playIcon" src="/static/system/play.svg" alt="play icon">\n\t</a><div class="previewcover"></div></div>';
	return item;
}

function drawInfoItem(data) {
	var item = document.createElement("div");
	$(item).addClass("workItem infoItem");

	var wraper = document.createElement("div");
	$(wraper).addClass("infoWrapper");

	var workTitle = document.createElement("div");
	$(workTitle).addClass("paramTitle main");
	$(workTitle).text("Title");
	var workTitle__value = document.createElement("h1");
	$(workTitle__value).addClass("paramValue main");
	$(workTitle__value).text(data.title);

	var itemEtc = document.createElement("div");
	$(itemEtc).addClass("itmEtc");

	var workLaunch = document.createElement("div");
	$(workLaunch).addClass("paramLine");
	var workLaunch__title = document.createElement("span");
	$(workLaunch__title).addClass("paramTitle");
	$(workLaunch__title).text("Launch");
	var workLaunch__value = document.createElement("span");
	$(workLaunch__value).addClass("paramValue");
	$(workLaunch__value).text(data.launch);
	$(workLaunch).append(workLaunch__title);
	$(workLaunch).append(workLaunch__value);

	var workCategory = document.createElement("div");
	$(workCategory).addClass("paramLine");
	var workCategory__title = document.createElement("span");
	$(workCategory__title).addClass("paramTitle");
	$(workCategory__title).text("Category");
	var workCategory__value = document.createElement("span");
	$(workCategory__value).addClass("paramValue");
	$(workCategory__value).text(data.category);
	$(workCategory).append(workCategory__title);
	$(workCategory).append(workCategory__value);


	var workClient = document.createElement("div");
	$(workClient).addClass("paramLine");
	var workClient__title = document.createElement("span");
	$(workClient__title).addClass("paramTitle");
	$(workClient__title).text("Client");
	var workClient__value = document.createElement("span");
	$(workClient__value).addClass("paramValue");
	$(workClient__value).text(data.client);
	$(workClient).append(workClient__title);
	$(workClient).append(workClient__value);

	$(itemEtc).append(workLaunch);
	$(itemEtc).append(workCategory);
	$(itemEtc).append(workClient);

	var header = document.createElement("div");
	$(header).append(workTitle);
	$(header).append(workTitle__value);

	$(item).append(wraper);
	$(wraper).append(header);
	$(wraper).append(itemEtc);

	return item;
}