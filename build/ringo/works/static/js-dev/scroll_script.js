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
		this.delay_timer        = null;
		this.elem               = null;
		this.xPos 		          = 0;
		this.yPos 		          = 0;
		this.pos                = 0;
		this.is_paused          = false;
		this.requestID          = undefined;
		this.content_length     = 0;
		this.is_animated        = false;
		this.is_events_attached = false;

		this.current_way     = 'normal';
		this.axis            = 'horizontal';
		this.speed           = 1;
		this.key_delta       = 10;
		this.on_hover        = false;
		this.has_pause_evt   = false;
		this.delayAfterHover = 1000;
		return this;
	}

	init(options) {
		this.elem            = $(options.elem);
		this.axis            = options.axis || 'horizontal';
		this.speed           = options.speed || 1;
		this.key_delta       = options.key_delta || 10;
		this.has_pause_evt   = options.has_pause_evt || false;
		this.delayAfterHover = options.delayAfterHover*1000 || 1000; // задержка после скрола
		console.log('[LOG] Data initialized');

		$(window).on('resize', () => {
			setSizes().then(() => {
				this.initAnimation();
			});
		});

		return this;
	}

	initAnimation() {
		if ( this.isNeedToAnimate(this.elem) ) {
			this.prepareToAnimate();

			if (!this.is_animated) {
				this.startMovement();
			}
			if (!this.is_events_attached) {
				console.log('[LOG] Starting attach mouse events');
				this.mouseActions();
				console.log('[LOG] Mouse events attached');

				console.log('[LOG] Starting attach keyboard events');
				this.keyboardActions();
				console.log('[LOG] Keyboard events attached');

				this.is_events_attached = true;
			}
		}
		else {
			this.stopMovement();
			// this.resetToDefault();
			this.elem.find('.fake').remove();
			this.setPosition(true);
		}
		return this;
	}

	mouseActions() {
		let inst = this;
		$(window).on('mousewheel', (evt) => {
			// evt.preventDefault();
			if (this.is_animated) {
				this.is_paused = true;

				if (evt.deltaY > 0) {
					inst.pos += evt.deltaFactor;
					inst.pos = inst.calcScroll(inst.pos, 'reverse');
				} else {
					inst.pos -= evt.deltaFactor;
					inst.pos = inst.calcScroll(inst.pos, 'normal');
				}

				inst.setPosition();

				// if ( inst.has_pause_evt ) {
		 //      clearTimeout(inst.delay_timer);
				// 	inst.delay_timer = setTimeout(function() {
		 //        inst.is_paused = false;
				// 	}, inst.delayAfterHover); // выждав паузу запускаем движение
				// } else {
		 //      inst.is_paused = false;
		 //    }
				inst.is_paused = false;
			}
		});
	}

	keyboardActions() {
    $(window).on('keydown', (e) => {
			if (this.is_animated) {
	      this.is_paused = true;

	      if (e.keyCode == 37 || e.keyCode == 38) {
					this.pos += this.key_delta;
					this.pos = this.calcScroll(this.pos, 'reverse');
	      }
	      else if (e.keyCode == 39 || e.keyCode == 40) {
					this.pos -= this.key_delta;
					this.pos = this.calcScroll(this.pos, 'normal');
	      }

				this.setPosition();
			}
    });
    
    $(window).on('keyup', (e) => {
			if (this.is_animated) {
      	this.is_paused = false;
			}
    });
	}

	calcScroll(pos, way) {
		if (way == 'normal') {
			if (this.current_way == way) {
				if (pos <= -this.content_length) {
					pos = 0;
				}
			}
		} 
		if (way == 'reverse') {
			if (this.current_way == way) {
				if (pos >= 0) {
					pos = pos -(this.content_length);
				}
			}
			else {
				if (pos >= 0) {
					pos = pos -(this.content_length);
				}
			}
		}
		this.current_way = way;
		return pos;
	}

	setPosition(is_reset) {
		if (is_reset) {
			this.elem[0].style.transform = `translate3d(0px, 0px, 0)`;
		}
		else {
			if (this.axis == 'horizontal') {
				this.xPos = this.pos;
			}
			else {
				this.yPos = this.pos;
			}

			this.elem[0].style.transform = `translate3d(${this.xPos}px, ${this.yPos}px, 0)`;
		}
	}

	render() {
		const refreshRate = 1000 / 60;
		let inst = this;

		function renderStep() {
			// if (self.hoveringItem != null) {
			//   self.getEdgesOfHover();
			//   // console.log('Is hovering:', self.isInsiteOfItem())
			//   if ( !self.isInsiteOfItem() ) {
			//     self.hoveringItem.removeClass('-hover-');
			//     self.hoveringItem = null;
			//   }
			// }

			if (!inst.is_paused) {
				inst.pos--;
				inst.pos = inst.calcScroll(inst.pos, 'normal');
				inst.setPosition();
			}

			if ( inst.requestID ) {
				inst.requestID = window.requestAnimationFrame(renderStep);
			}
		}

		this.requestID = window.requestAnimationFrame(renderStep);
	}

	startMovement() {
		this.render();
		this.is_animated = true;
		console.log('[EVENT] Animation started');
	}

	stopMovement() {
		if (this.requestID) {
			window.cancelAnimationFrame(this.requestID);
			this.requestID = undefined;
			this.is_animated = false;
			this.resetToDefault();
		}
		console.log('[EVENT] Animation stopped');
	}

	resetToDefault() {
			this.pos = 0;
			this.xPos = 0;
			this.yPos = 0;
			this.current_way = 'normal';
	}

	setContentLength(elem) {
		return elem.find('.fake').length ? elem.outerWidth() / 2 : elem.outerWidth();
	}

	prepareToAnimate() {
		console.log('[LOG] Starting prepare data to animate');
		this.content_length = this.setContentLength(this.elem);

		if (!this.is_animated) {
			this.elem.append( this.copyContent(this.elem) );
		}
		console.log('[LOG] Data to animate prepared');
	}

	isNeedToAnimate(elem) {
		let compare_elem = elem || this.elem;
		let content_size = this.setContentLength(compare_elem);
		if (content_size < compare_elem.parent().outerWidth()) {
			console.log('[CHECK] Do not need to animate');
			return false;
		}
		console.log('[CHECK] Need to animate');
		return true;
	}

	copyContent(elem) {
		return elem.contents('.workItem').clone().addClass('fake');
	}
}




var videoObj = {};
var edge = 768;
var motion = null;

$("#wrapper2").empty();
$("#wrapper2").append(drawContent(textData));


setSizes().then(() => {
	motion = new Motion();
	motion.init({
		elem: '.workInfo', 
	});
	motion.initAnimation();
});

async function setSizes() {
	let contentWidth = $('.infoItem').width();
	await setSizesToImages(contentWidth);
}

function setSizesToImages(contentWidth) {
	return new Promise(resolve => {
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
		setTimeout(() => {
			resolve();
		}, 1000);
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