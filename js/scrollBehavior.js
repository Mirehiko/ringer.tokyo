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
		this.delayAfterHover = options.delayAfterHover || 1000; // задержка после скрола
		this.onhover = options.onhover || 'default';
		this.pauseOnScroll = options.pauseOnScroll == undefined ? true : options.pauseOnScroll;

    this.itemClass = options.itemClass || '';
    this.indent = options.indent || 0;
    this.itemPosition = 0 + this.indent; // для движения
    this.itemSpeed = options.speed || 1; // скорость движения в пикселях
	}

	init() {
		let self = this;
		this.loop = null; // таймер для движения контента
		this.delay = null; // таймер для задержки после скрола
		this.isCanReplace = true;
		this.hoverAction = 'hoverAction';

    this.firstSize = 0; // высота/ширина первого элемента
		this.lastSize = 0; // высота/ширина последнего элемента
		this.lastPosition = 0; // отступ
		this.needSide = '';
		this.axis = '';
    this.firstItem = this.container.children().first();
    this.lastItem = this.container.children().last();
    this.setFirstSize();
    this.setLastSize();
		this.container.children().addClass(this.hoverAction);
    this.onpause = false;
    this.mousetimer = null;

		if ( this.onhover == 'none' ) {
			this.mouseX = 0;
			this.mouseY = 0;
		}

		this.motion = null; // функция движения
		this.setMotionDirection(); // задаем направление движения
    this.isBGCrossProgress = false;
    this.isENDCrossProgress = false;
    this.setEdges();

		this.render();

		this.container.on('mousewheel', function(evt){
			evt.preventDefault();

      self.onpause = true;
      // console.log('=======================================================================================================================')
      // console.log('bg progress', self.isBGCrossProgress,'bgEdge',self.bgEdge, 'this.itemPosition:',self.itemPosition)
    	// console.log('end progress', self.isENDCrossProgress,'endEdge',self.endEdge, 'this.itemPosition:',self.lastItem.offset().left + self.lastSize)
			// console.log(self.axis)
      // console.log('evt.deltaFactor',evt.deltaFactor)
			if (evt.deltaY > 0) {
        self.itemPosition += evt.deltaFactor;
        self.replaceObjects('prev');
			} else {
        self.itemPosition -= evt.deltaFactor;
        self.replaceObjects('next');
			}
      // self.setPropsToFirst(self.firstItem);


			if ( self.pauseOnScroll ) {
				self.delay = setTimeout(function() {
          self.onpause = false;
				}, 1000); // выждав паузу запускаем движение
			} else {
        self.onpause = false;
      }
		});

		if ( this.onhover == 'pause' ) {
			this.container.delegate('.hoverAction', 'mousemove', function(evt) {
        self.onpause = true;

				self.mouseX = evt.clientX;
				self.mouseY = evt.clientY;
				console.log(mouseX, mouseY)
				self.delay = setTimeout(function() {
          self.onpause = false;
				}, self.delayAfterHover); // выждав паузу запускаем движение
			});
		} else if ( this.onhover == 'nothing' ) {
      this.container.delegate(window, 'mousemove', function(evt) {
        evt.preventDefault();
        // console.log('move')
        self.hoverRemove(self);
      });
			this.container.delegate(this.itemClass, 'mouseover', function(evt) {
				evt.preventDefault();
        $(this).addClass('-hover-');
        self.hoverRemove();
				// console.log('over')
			});
			this.container.delegate(this.itemClass, 'mouseout', function(evt) {
				evt.preventDefault();
        $(this).removeClass('-hover-');
				// console.log('leave')
			});
		}

    $(window).on('resize', function(e) {
      self.setEdges();
      self.setFirstSize();
      self.setLastSize();
    });
	}
  hoverRemove(context) {
    clearTimeout(context.mousetimer);
    context.mousetimer = setTimeout(function(){
      $(context.itemClass).removeClass('-hover-');
    }, 1000);
  }
  getLastPosition() {
    if ( this.axis == 'horizontal' ) {
      return this.lastSize + this.lastItem.offset().left;
    } else {
      return this.lastSize + this.lastItem.offset().top;
    }
  }
  setFirstSize() {
    if ( this.axis == 'horizontal' ) {
      this.firstSize = this.firstItem.outerWidth();
    } else {
      this.firstSize = this.firstItem.outerHeight();
    }
  }
  setLastSize() {
    if ( this.axis == 'horizontal' ) {
      this.lastSize = this.lastItem.outerWidth();
    } else {
      this.lastSize = this.lastItem.outerHeight();
    }
  }
  setEdges() {
    if ( this.axis == 'horizontal' ) {
      this.bgEdge = $(window).width() / 2;
      this.endEdge = $(window).width() + this.bgEdge;
    } else {
      this.bgEdge = $(window).height() / 2;
      this.endEdge = $(window).height() + this.bgEdge;
    }
  }
  isAcrossBGEdge() {
    if ( this.itemPosition <= (-this.bgEdge) && !this.isBGCrossProgress ) {
      return true;
    }
    return false;
  }
  isAcrossEndEdge() {
    if ( this.getLastPosition() >= this.endEdge && !this.isENDCrossProgress ) {
      return true;
    }
    return false;
  }
  isFirstOut(first) {
    if ( (this.itemPosition < (-(this.bgEdge + first.outerHeight())) && this.axis == 'vertical') ||
         (this.itemPosition < (-(this.bgEdge + first.outerWidth())) && this.axis == 'horizontal')) {
      return true;
    }
		return false;
  }
  isLastOut(last) {
		if ( ( last.offset().top > this.endEdge && this.axis == 'vertical' ) ||
			 ( last.offset().left > this.endEdge && this.axis == 'horizontal' ) ) {
			return true;
		}
		return false;
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
	replaceObjects(way) {
		if ( this.axis == 'vertical' ) {
			this.replaceVertical(way);
		} else {
			this.replaceHorizontal(way);
		}
	}
	replaceVertical(way) {}
	replaceHorizontal(way) {}

	render() {
    const refreshRate = 1000 / 60;
		let self = this;

		function renderStep() {
      if ( !self.onpause ) {
        self.itemPosition -= self.itemSpeed;
        self.setPropsToFirst(self.firstItem);

    		if (self.isCanReplace) {
          self.replaceObjects('next');
  			}
        self.requestID = window.requestAnimationFrame(renderStep);
      }
		}

		this.requestID = window.requestAnimationFrame(renderStep);
	}
	stop() {
		window.cancelAnimationFrame(this.requestID);
	}

	appendToEnd() {}
	prependToStart(){}
	setPropsToFirst(elem) {
    let indent = 'margin-'+this.needSide;
    elem.css(indent, this.itemPosition + 'px');
	}
	removeElem(elem) {
		elem.remove();
	}

}
