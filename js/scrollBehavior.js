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
/*
	Контеинер в котором происходит смещение объектов
	@container = $(elem)

	Смещаемые данные
	@data = [{}, ...]

	Дополнительные параметры, которые можно изменить по желанию
	@options = {
		direction: // Направление
		speed: // Скорость смещения
		delayAfterScroll: // Задержка после скрола(наведения)
		delayAfterHover: // Задержка после наведения на элемент
		indent: // Отступ от границы
	}
*/
class Motion {
	constructor(container, data, options) {
		this.container = container;
		this.firstID = 'abraham';
		this.container.children().first().attr('id',this.firstID);
		this.data = data;

		this.direction = options.direction || 'down';
		this.speed = options.speed || 2; // скорость движения в пикселях
		this.delayAfterHover = options.delayAfterHover || 1000; // задержка после скрола
		this.indent = options.indent || 0;
		this.onhover = options.onhover || 'default';
		this.pauseOnScroll = options.pauseOnScroll == undefined ? true : options.pauseOnScroll;
    this.itemClass = options.itemClass || '';

		console.log(this.direction);
		console.log(this.speed );
		console.log(this.delayAfterHover );
		console.log(this.indent );
	}

	init() {
		let self = this;
		this.loop = null; // таймер для движения контента
		this.delay = null; // таймер для задержки после скрола
		this.isCanReplace = true;
		this.hoverAction = 'hoverAction';

		this.firstSize = 0; // высота/ширина первого элемента
		this.currentMargin = 0; // отступ
		this.needSide = '';
		this.axis = '';
		this.container.children().addClass(this.hoverAction);

		if ( this.onhover == 'none' ) {
			this.mouseX = 0;
			this.mouseY = 0;
		}

		this.motion = null; // функция движения
		this.setMotionDirection(); // задаем направление движения

		this.simpleMotion();
		// this.render();
		//


		this.container.on('mousewheel', function(evt){
			evt.preventDefault();
			if ( self.pauseOnScroll ) {
				self.clearTimers(); // останавливаем таймеры
			}

			let item = self.container.children().first();
			let margin = item.css('margin-'+self.needSide);

			console.log(self.axis)
			if (evt.deltaY > 0) {
				margin = parseInt(margin);
				margin += evt.deltaFactor;
				item.css('margin-'+self.needSide, margin);

				if (self.isCanReplace) {
					if (self.axis == 'vertical') {
						self.replaceObjects('up');
					} else {
						self.replaceObjects('right');
					}
				}
			} else {
				margin = parseInt(margin);
				margin -= evt.deltaFactor;
				item.css('margin-'+self.needSide, margin);

				if (self.isCanReplace) {
					if (self.axis == 'vertical') {
						self.replaceObjects('down');
					} else {
						self.replaceObjects('left');
					}
				}
			}

			self.currentMargin = margin; // сохраняем текущее положение

			if ( self.pauseOnScroll ) {
				self.delay = setTimeout(function() {
					self.simpleMotion();
				}, 1000); // выждав паузу запускаем движение
			}
			// self.render();
		});

		if ( this.onhover == 'pause' ) {
			this.container.delegate('.hoverAction', 'mousemove', function(evt) {
				self.clearTimers(); // останавливаем таймеры
				self.mouseX = evt.clientX;
				self.mouseY = evt.clientY;
				console.log(mouseX, mouseY)
				self.delay = setTimeout(function() {
					self.simpleMotion();
				}, self.delayAfterHover); // выждав паузу запускаем движение
			});
		} else if ( this.onhover == 'nothing' ) {
			this.container.delegate(this.itemClass, 'mouseover', function(evt) {
				evt.preventDefault();
        $(this).addClass('-hover-');
				console.log('over')
			});
			this.container.delegate(this.itemClass, 'mouseout', function(evt) {
				evt.preventDefault();
        $(this).removeClass('-hover-');
				console.log('leave')
			});
		}
	}

	setMotionDirection() {
		if (this.direction == 'down') {
			this.needSide = 'top';
			this.axis = 'vertical';
		} else if ( this.direction == 'left' ) {
			this.needSide = 'left';
			this.axis = 'horizontal';
		}
	}

	animateData() {
		// let self = this;
		let item = this.container.children().first();
		let margin = 0;
		margin = this.getMargin(item);
		margin -= this.speed;

		this.currentMargin = margin;
		let indent = 'margin-'+this.needSide;
		item.css(indent, margin);

		if (this.isCanReplace) {
			if (this.axis == 'vertical') {
				this.replaceObjects('down');
			} else {
				this.replaceObjects('left');
			}
		}
		requestAnimationFrame.apply(this.animateData(this));
	}
	simpleMotion() {
		let self = this;

		this.loop = setInterval(function(){
			let item = self.container.children().first();

			let margin = 0;
			margin = self.getMargin(item);
			margin -= self.speed;

			self.currentMargin = margin;
			let indent = 'margin-'+self.needSide;
			item.css(indent, margin);

			if (self.isCanReplace) {
				if (self.axis == 'vertical') {
					self.replaceObjects('down');
				} else {
					self.replaceObjects('left');
				}
			}
		}, 50);
	}
	replaceObjects(way) {
		if ( this.axis == 'vertical' ) {
			this.replaceVertical(way);
		} else {
			this.replaceHorizontal(way);
		}
	}
	replaceVertical(way) {}
	replaceHorizontal(way) {}

	isFirstOnScreen() {
		let first = this.container.children().first();
		// console.log('ofset',first.offset().left);
		// console.log('ofset',first.offset().left);
		if ( (first.offset().top >= -first.height() && this.axis == 'vertical') ||
			 ( first.offset().left >= -first.width() && this.axis == 'horizontal') ) {
			return true;
		}
		return false;
	}
	isLastOnScreen() {
		let last = this.container.children().last();
		if ( (last.offset().top <= $(window).height() && this.axis == 'vertical' ) ||
			 ( last.offset().left <= $(window).width() && this.axis == 'horizontal' ) ) {
			return true;
		}
		return false;
	}
	isLastLeaveScreen() {
		let last = this.container.children().last().prev();
		if ( ( last.offset().top >= $(window).height() && this.axis == 'vertical' ) ||
			 ( last.offset().left >= $(window).width() && this.axis == 'horizontal' ) ) {
			return true;
		}
		return false;
	}
	isFirstLeaveScreen() {
		let first = this.container.children().first().next();
		if ( ( first.offset().top <= -first.height() && this.axis == 'vertical' ) ||
			 ( first.offset().left <= -first.width() && this.axis == 'horizontal' ) ) {
			return true;
		}
		return false;
	}

	render() {
		const refreshRate = 1000 / 60;
		let item = this.container.children().first();
		let speedX = 1;
		let positionX = 0;
		let self = this;

		function renderStep() {
			positionX = positionX - speedX;
			// if (positionX > maxXPosition || positionX < 0) {
			// 	speedX = speedX * (-1);
			// }
			// rect.style.left = positionX + 'px';
			let indent = 'margin-'+self.needSide;
			item.css(indent, positionX + 'px');

			// let margin = 0;
			// margin = self.getMargin(item);
			// margin -= self.speed;

			// self.currentMargin = margin;
			// item.css(indent, margin);

			if (self.isCanReplace) {
				if (self.axis == 'vertical') {
					self.replaceObjects('down');
				} else {
					self.replaceObjects('left');
				}
			}

		  	window.requestAnimationFrame(renderStep);
		}

		this.requestID = window.requestAnimationFrame(renderStep);
	}
	stop() {
		cancelAnimationFrame(this.requestID);
	}

	appendToEnd() {}
	prependToStart(){}
	setPropsToFirst(elem) {
		elem.css('margin-'+this.needSide, this.currentMargin + this.firstSize );
	}
	removeElem(elem) {
		elem.remove();
	}


	clearTimers() {
		clearInterval(this.loop);
		clearInterval(this.delay);
		clearTimeout(this.loop);
		clearTimeout(this.delay);
	}

	getMargin(item) {
		let margin = item.css('margin-'+this.needSide);
		return parseInt(margin);
	}
}
