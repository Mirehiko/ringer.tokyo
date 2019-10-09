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

		this.initAnimation();
		$(window).on('resize', () => {
			this.initAnimation();
		});

		return this;
	}

	initAnimation() {
		if ( this.isNeedToAnimate(this.elem) ) {
			this._prepareToAnimate();

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
			this._setPosition(true);
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
					inst.pos = inst._calcScroll(inst.pos, 'reverse');
				} else {
					inst.pos -= evt.deltaFactor;
					inst.pos = inst._calcScroll(inst.pos, 'normal');
				}

				inst._setPosition();

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
					this.pos = this._calcScroll(this.pos, 'reverse');
	      }
	      else if (e.keyCode == 39 || e.keyCode == 40) {
					this.pos -= this.key_delta;
					this.pos = this._calcScroll(this.pos, 'normal');
	      }

				this._setPosition();
			}
    });

    $(window).on('keyup', (e) => {
			if (this.is_animated) {
      	this.is_paused = false;
			}
    });
	}

	_calcScroll(pos, way) {
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

	_setPosition(is_reset) {
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

			if (!inst.is_paused && inst.is_animated) {
				inst.pos--;
				inst.pos = inst._calcScroll(inst.pos, 'normal');
				inst._setPosition();
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

	resumeMovement() {
		this.is_animated = true;
		console.log('[EVENT] Animation resumes');
	}

	pauseMovement() {
		this.is_animated = false;
		console.log('[EVENT] Animation paused');
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

	_setContentLength(elem) {
		if (this.axis == 'horizontal') {
			return elem.find('.fake').length ? elem.outerWidth() / 2 : elem.outerWidth();
		}
		return elem.find('.fake').length ? elem.outerHeight() / 2 : elem.outerHeight();
	}

	_prepareToAnimate() {
		console.log('[LOG] Starting prepare data to animate');
		this.content_length = this._setContentLength(this.elem);

		if (!this.is_animated) {
			this.elem.append( this._copyContent(this.elem) );
		}
		console.log('[LOG] Data to animate prepared');
	}

	isNeedToAnimate(elem) {
		let compare_elem = elem || this.elem;
		let content_size = this._setContentLength(compare_elem);
		let parent_size = 0;
		if (this.axis == 'horizontal') {
			parent_size = compare_elem.parent().outerWidth();
		}
		else {
			parent_size = compare_elem.parent().outerHeight();
		}

		if (content_size < parent_size) {
			console.log('[CHECK] Do not need to animate');
			return false;
		}
		console.log('[CHECK] Need to animate');
		return true;
	}

	_copyContent(elem) {
		return elem.children().clone().addClass('fake');
	}
}
