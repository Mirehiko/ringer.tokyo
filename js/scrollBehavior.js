
/*
	Контаинер в котором происходит смещение объектов
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

		this.motion = null; // функция движения
		this.setMotionDirection(); // задаем направление движения

		this.simpleMotion();
		//


		this.container.on('mousewheel', function(evt){
			evt.preventDefault();

			self.clearTimers(); // останавливаем таймеры

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

			self.delay = setTimeout(function() {
				self.simpleMotion();
			}, 1000); // выждав паузу запускаем движение
		});

		this.container.delegate('.hoverAction', 'mousemove', function(evt) {
			self.clearTimers(); // останавливаем таймеры
			self.delay = setTimeout(function() {
				self.simpleMotion();
			}, self.delayAfterHover); // выждав паузу запускаем движение
		});
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
