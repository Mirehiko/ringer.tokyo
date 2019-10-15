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
		this.xPos 		          = 0;
		this.yPos 		          = 0;
		this.pos                = 0;
		this.content_length     = 0;
		this.elem               = null;
		this.container          = null;
		this.is_events_attached = false;
		this.is_paused          = false;
		this.is_animated        = false;
		this.requestID          = undefined;

		this.current_way = 'normal';
		this.axis        = 'horizontal';
		this.speed       = 1;
		this.key_delta   = 10;

		this.has_pause_evt   = false;
		this.delay_timer     = null;
		this.delayAfterHover = 1000;

		this.on_hover      = 'nothing';
		this.on_hover_objs = '';
		this.hoveringItem  = null;
		this.hoverBgn      = 0;
		this.hoverEnd      = 0;
		this.mouseX        = 0;
		this.mouseY        = 0;

		return this;
	}

	init(options) {
		this.elem            = $(options.elem);
		this.axis            = options.axis || 'horizontal';
		this.speed           = options.speed || 1;
		this.key_delta       = options.key_delta || 10;
		this.has_pause_evt   = options.has_pause_evt || false;
		this.delayAfterHover = options.delayAfterHover*1000 || 1000; // задержка после скрола
		this.on_hover        = options.on_hover || 'nothing';
		this.on_hover_objs   = options.on_hover_objs;
		this.container       = options.container;

		console.log('[LOG] Data initialized');

		this.initAnimation();
		$(window).on('resize', () => {
			this.initAnimation();
		});

		return this;
	}

	updateData(elem) {
		this.elem = $(elem);
		return this;
	}

	initAnimation() {
		if ( this._isNeedToAnimate(this.elem) ) {
			this._prepareToAnimate();

			if (!this.is_animated) {
				this.startMovement();
			}

			if (!this.is_events_attached) {
				console.log('[LOG] Starting attach mouse events');
				this._mouseActions();
				console.log('[LOG] Mouse events attached');

				console.log('[LOG] Starting attach keyboard events');
				this._keyboardActions();
				console.log('[LOG] Keyboard events attached');

				this.is_events_attached = true;
			}
		}
		else {
			this.stopMovement();
			this.elem.find('.fake').remove();
			this._setPosition(true);
		}
		return this;
	}

	startMovement() {
		this._render();
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
			this._resetToDefault();
		}
		console.log('[EVENT] Animation stopped');
	}

	_mouseActions() {
		$(window).on('mousewheel', (evt) => {
			if (this.is_animated) {
				this.is_paused = true;

				if (evt.deltaY > 0) {
					this.pos += evt.deltaFactor;
					this.pos = this._calcScroll(this.pos, 'reverse');
				} else {
					this.pos -= evt.deltaFactor;
					this.pos = this._calcScroll(this.pos, 'normal');
				}

				this._setPosition();

				if ( this.has_pause_evt ) {
				 this.is_paused = true;
		      clearTimeout(this.delay_timer);
					this.delay_timer = setTimeout(() => {
		        this.is_paused = false;
					}, this.delayAfterHover); // выждав паузу запускаем движение
				} else {
		      this.is_paused = false;
		    }
			}
		});

		if ( this.on_hover_objs ) {
			this.container.delegate(this.on_hover_objs, 'mousemove', (evt) => {
				this.mouseX = evt.pageX;
				this.mouseY = evt.pageY;
				this.hoveringItem = $(evt.target).closest(this.on_hover_objs);
				this.hoveringItem.addClass('-hover-');
			});

			this.container.delegate(this.on_hover_objs, 'mouseleave', (evt) => {
				if (this.hoveringItem != null) {
					this.hoveringItem.removeClass('-hover-');
					this.hoveringItem = null;
				}
			});
		}


		// Пауза при наведении мышкой
		if ( this.on_hover == 'pause' ) {
			this.container.delegate('.hoverAction', 'mousemove', (evt) => {
        this.is_paused = true;
				clearTimeout(this.delay_timer);
				this.delay_timer = setTimeout(() => {
          this.is_paused = false;
				}, this.delayAfterHover); // выждав паузу запускаем движение
			});
		}
	}

	_keyboardActions() {
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

	_getEdgesOfHover() {
    this.hoverBgn = this.hoveringItem.offset().top;
    if ( this.axis == 'horizontal' ) {
      this.hoverEnd = this.hoveringItem.offset().left + this.hoveringItem.outerWidth();
    } else {
      this.hoverEnd = this.hoveringItem.offset().top + this.hoveringItem.outerHeight();
    }
  }

	_isInsiteOfItem() {
		if ( this.axis == 'horizontal' ) {
			if ( this.mouseX >= this.hoverBgn && this.mouseX <= this.hoverEnd ) {
				return true;
			}
			return false;
		} else {
			if ( this.mouseY >= this.hoverBgn && this.mouseY <= this.hoverEnd ) {
				return true;
			}
			return false;
		}
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

	_render() {
		const refreshRate = 1000 / 60;
		let inst = this;

		function renderStep() {

			if (inst.hoveringItem != null) {
			  inst._getEdgesOfHover();
			  // console.log('Is hovering:', self.isInsiteOfItem())
			  if ( !inst._isInsiteOfItem() ) {
			    inst.hoveringItem.removeClass('-hover-');
			    inst.hoveringItem = null;
			  }
			}

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

	_resetToDefault() {
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

	_isNeedToAnimate(elem) {
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
