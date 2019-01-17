
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
		indent: // Отступ от границы
	}
*/
class Motion {
	constructor(container, data, options) {
		this.container = container;
		this.firstID = 'abraham';
		this.container.children().first().attr('id',this.firstID);
		//this.data = data;
		
		this.direction = options.direction || 'down';
		this.speed = options.speed || 2; // скорость движения в пикселях
		this.delayAfterScroll = options.delayAfterScroll || 2000; // задержка после скрола
		this.indent = options.indent || 0;

		console.log(this.direction);
		console.log(this.speed );
		console.log(this.delayAfterScroll );
		console.log(this.indent );

	}

	init() {
		let self = this;
		this.loop = null; // таймер для движения контента
		this.delay = null; // таймер для задержки после скрола

		this.firstSize = 0; // высота/ширина первого элемента
		this.currentMargin = 0; // отступ
		this.needSide = '';
		this.axis = '';
		this.motion = null; // функция движения
		this.setMotionDirection(); // задаем направление движения

		this.simpleMotion();
		//


		this.container.on('mousewheel', function(evt){
			evt.preventDefault();

			self.clearTimers(); // останавливаем таймеры

			let item = self.container.children().first();
			let margin = item.css('margin-'+self.needSide);

			if (evt.deltaY > 0) {
				margin = parseInt(margin);
				margin += evt.deltaFactor;
				item.css('margin-'+self.needSide, margin);

				self.replaceObjects('up');
			} else {
				margin = parseInt(margin);
				margin -= evt.deltaFactor;
				item.css('margin-'+self.needSide, margin);

				self.replaceObjects('down');
			}

			self.currentMargin = margin; // сохраняем текущее положение

			self.delay = setTimeout(function() {
				self.simpleMotion();
			}, self.delayAfterScroll); // выждав паузу запускаем движение
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

			self.replaceObjects('down');
		}, 100);
	}
	replaceObjects(way) {
		if ( this.axis == 'vertical' ) {
			this.replaceVertical(way);
		} else {
			this.replaceHorizontal(way);
		}
	}
	replaceVertical(way) {
		// let first = this.container.children().first();
		// let last = this.container.children().last();

		// if (this.needSide == 'down') {
		// 	if ( this.isLastOnScreen() ) {
		// 		this.appendToEnd();
		// 		redrawBackgrounds();
		// 	}

		// 	if ( this.isFirstLeaveScreen() ) {
		// 		this.firstSize = first.height();
		// 		this.removeElem(first);
		// 		this.setPropsToFirst(this.container.children().first());
		// 	}

		// } else {
		// 	if ( this.isFirstOnScreen() ) {
		// 		this.prependToStart();
		// 		redrawBackgrounds();

		// 		this.container.children().css('margin-'+this.needSide, 0);
		// 		first = this.container.children().first();
		// 		first.css('margin-'+this.needSide, this.currentMargin - first.height());
		// 	}

		// 	if ( this.isLastLeaveScreen() ) {
		// 		this.removeElem(last);
		// 	}
		// }
	}
	replaceHorizontal(way) {
		// let first = this.container.children().first();
		// let last = this.container.children().last();

		// if (this.needSide == 'left') {
		// 	if ( this.isLastOnScreen() ) {
		// 		this.appendToEnd();
		// 		redrawBackgrounds();
		// 	}

		// 	if ( this.isFirstLeaveScreen() ) {
		// 		this.firstSize = first.width();
		// 		this.removeElem(first);
		// 		this.setPropsToFirst(this.container.children().first());
		// 	}

		// } else {
		// 	if ( this.isFirstOnScreen() ) {
		// 		this.prependToStart();
		// 		redrawBackgrounds();

		// 		this.container.children().css('margin-'+this.needSide, 0);
		// 		first = this.container.children().first();
		// 		first.css('margin-'+this.needSide, this.currentMargin - first.width());
		// 	}

		// 	if ( this.isLastLeaveScreen() ) {
		// 		this.removeElem(last);
		// 	}
		// }
	}

	isFirstOnScreen() {
		let first = this.container.children().first();
		if ( first.offset().top >= -first.height() /*|| 
			 first.offset().left >= -first.width()*/ ) {
			return true;
		}
		return false;
	}
	isLastOnScreen() {
		let last = this.container.children().last();
		if ( last.offset().top <= $(window).height()/* || 
			 last.offset().left <= $(window).width()*/ ) {
			return true;
		}
		return false;
	}
	isLastLeaveScreen() {
		let last = this.container.children().last().prev();
		if ( last.offset().top >= $(window).height() /*|| 
			 last.offset().left >= $(window).width()*/ ) {
			return true;
		}
		return false;
	}
	isFirstLeaveScreen() {
		let first = this.container.children().first().next();
		if ( first.offset().top <= -first.height() /*||
			 first.offset().left <= -first.width()*/ ) {
			return true;
		}
		return false;
	}


	appendToEnd() {
		// // let box = $('.infiniteBox');
		// let forDraw = computedLines.splice(0,1);
		// if ( forDraw.length == 2 ) {
		// 	this.container.append(doubleLine(forDraw));
		// } else {
		// 	this.container.append(forDraw[0].lineType(forDraw[0].data));
		// }
		// computedLines = computedLines.concat(forDraw);
		// redrawBackgrounds();
	}
	prependToStart(){
		// // let box = $('.infiniteBox');
		// let forDraw = computedLines.splice(-1,1);
		// let item = null;

		// if ( forDraw.length == 2 ) {
		// 	item = doubleLine(forDraw);
		// } else {
		// 	item = forDraw[0].lineType(forDraw[0].data);
		// }
		// this.container.prepend(item);
		
		// computedLines = forDraw.concat(computedLines);
		// // $(item).css('margin-top', currentMargin - $(item).height());
	}
	setPropsToFirst(elem) {
		elem.css('margin-'+this.needSide, this.currentMargin + this.firstSize );
	}
	removeElem(elem) {
		elem.remove();
	}


	clearTimers() {
		clearInterval(this.loop);
		clearTimeout(this.delay);
	}

	getMargin(item) {
		let margin = item.css('margin-'+this.needSide);
		return parseInt(margin);
	}
}

