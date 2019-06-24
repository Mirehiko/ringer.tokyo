'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

(function () {
  var lastTime = 0;
  var vendors = ['ms', 'moz', 'webkit', 'o'];
  for (var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
    window.requestAnimationFrame = window[vendors[x] + 'RequestAnimationFrame'];
    window.cancelAnimationFrame = window[vendors[x] + 'CancelAnimationFrame'] || window[vendors[x] + 'CancelRequestAnimationFrame'];
  }

  if (!window.requestAnimationFrame) window.requestAnimationFrame = function (callback, element) {
    var currTime = new Date().getTime();
    var timeToCall = Math.max(0, 16 - (currTime - lastTime));
    var id = window.setTimeout(function () {
      callback(currTime + timeToCall);
    }, timeToCall);
    lastTime = currTime + timeToCall;
    return id;
  };

  if (!window.cancelAnimationFrame) window.cancelAnimationFrame = function (id) {
    clearTimeout(id);
  };
})();

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
// export class MotionGlob {
var MotionGlob = (function () {
  function MotionGlob(container, options) {
    _classCallCheck(this, MotionGlob);

    this.container = container;

    this.direction = options.direction || 'down';
    this.delayAfterHover = options.delayAfterHover * 1000 || 1000; // задержка после скрола
    this.onhover = options.onhover || 'default';
    this.pauseOnScroll = options.pauseOnScroll == undefined ? true : options.pauseOnScroll;

    this.itemClass = options.itemClass || '';
    this.indent = options.indent || 0;
    this.itemPosition = 0 + this.indent; // для движения
    this.itemSpeed = options.speed || 1; // скорость движения в пикселях

    this.original = options.original;
    this.key_delta = 10;
  }

  _createClass(MotionGlob, [{
    key: 'init',
    value: function init() {
      var _this = this;

      var self = this;
      this.delay = null; // таймер для задержки после скрола
      this.isCanReplace = true;
      this.hoverAction = 'hoverAction';

      this.needSide = '';
      this.axis = '';
      this.motion = null; // функция движения
      this.setMotionDirection(); // задаем направление движения
      this.setEdges();
      this.setOriginalSize();
      this.setStartPosition();
      this.addToStart();
      this.addToEnd();
      this.firstItem = this.container.children().first();
      this.lastItem = this.container.children().last();
      this.setPropsToFirst(this.firstItem);
      this.container.children().addClass(this.hoverAction);
      this.onpause = false;
      this.mousetimer = null;
      this.hoveringItem = null;

      if (this.onhover == 'nothing') {
        this.mouseX = 0;
        this.mouseY = 0;
      }

      this.isBGCrossProgress = false;
      this.isENDCrossProgress = false;

      this.render();

      this.container.on('mousewheel', function (evt) {
        // console.log('mousewheel', evt.deltaY, evt.deltaFactor)
        evt.preventDefault();
        self.onpause = true;

        if (evt.deltaY > 0) {
          self.itemPosition += evt.deltaFactor;
          self.replaceObjects('prev');
        } else {
          self.itemPosition -= evt.deltaFactor;
          self.replaceObjects('next');
        }

        if (self.pauseOnScroll) {
          clearTimeout(self.delay);
          self.delay = setTimeout(function () {
            self.onpause = false;
          }, self.delayAfterHover); // выждав паузу запускаем движение
        } else {
            self.onpause = false;
          }
      });

      $(window).on('keydown', function (e) {
        _this.onpause = true;
        if (e.keyCode == 37 || e.keyCode == 38) {
          self.itemPosition += _this.key_delta;
          self.replaceObjects('prev');
        } else if (e.keyCode == 39 || e.keyCode == 40) {
          self.itemPosition -= _this.key_delta;
          self.replaceObjects('next');
        }
      });
      $(window).on('keyup', function (e) {
        _this.onpause = false;
      });

      if (this.onhover == 'pause') {

        this.container.delegate('.hoverAction', 'mousemove', function (evt) {
          self.onpause = true;
          self.delay = setTimeout(function () {
            self.onpause = false;
          }, self.delayAfterHover); // выждав паузу запускаем движение
        });
      } else if (this.onhover == 'nothing') {

          this.container.delegate(this.itemClass, 'mousemove', function (evt) {
            self.mouseX = evt.pageX;
            self.mouseY = evt.pageY;
            $(this).addClass('-hover-');
            self.hoveringItem = $(this);
          });

          this.container.delegate(this.itemClass, 'mouseleave', function (evt) {
            evt.preventDefault();
            $(this).removeClass('-hover-');
            self.hoveringItem = null;
          });
        }

      $(window).on('resize', function (e) {
        self.setEdges();
        self.setOriginalSize();
      });
    }
  }, {
    key: 'getEdgesOfHover',
    value: function getEdgesOfHover() {
      this.hoverBgn = this.hoveringItem.offset().top;
      if (this.axis == 'horizontal') {
        this.hoverEnd = this.hoveringItem.offset().left + this.hoveringItem.outerWidth();
      } else {
        this.hoverEnd = this.hoveringItem.offset().top + this.hoveringItem.outerHeight();
      }
    }
  }, {
    key: 'offSroll',
    value: function offSroll() {
      this.container.css('margin', 0);
      this.container.off('mousewheel mousemove mouseleave');
    }
  }, {
    key: 'setStartPosition',
    value: function setStartPosition() {
      this.itemPosition = -(this.bgEdge + Math.abs(this.originalSize - this.bgEdge));
    }
  }, {
    key: 'addToStart',
    value: function addToStart() {
      var item = this.original.clone();
      this.container.prepend(item);
    }
  }, {
    key: 'addToEnd',
    value: function addToEnd() {
      this.container.append(this.original.clone());
    }
  }, {
    key: 'replaceObjects',
    value: function replaceObjects(way) {
      this.isCanReplace = false;
      var self = this;
      self.setPropsToFirst(self.firstItem);

      if (way == 'next') {
        // Если достиг начальной границы
        if (this.isAcrossBGEdge()) {
          //Добавляем в конец новый элемент
          this.isBGCrossProgress = true;
          // console.log('Copy element to end')
          this.addToEnd();
          this.lastItem = this.container.children().last();
        }

        // Если первый полностью ушел за пределы границы
        if (this.isFirstOut(this.firstItem)) {
          // console.log('First element leave the screen')
          this.isBGCrossProgress = false;
          this.removeElem(this.firstItem);
          this.firstItem = this.container.children().first();
          this.itemPosition += this.originalSize;
          this.setPropsToFirst(this.firstItem);
        }
      } else {

        if (this.isAcrossEndEdge()) {
          //Добавляем в начало новый элемент
          this.isENDCrossProgress = true;
          // console.log('Copy element to start')
          this.firstItem.css('margin', 0);
          this.addToStart();
          this.firstItem = this.container.children().first();
          this.itemPosition -= this.originalSize;
          this.setPropsToFirst(this.firstItem);
        }

        // Если последний полностью ушел за пределы границы
        if (this.isLastOut(this.lastItem)) {
          // console.log('Last element leave the screen')
          this.isENDCrossProgress = false;
          this.removeElem(this.lastItem);
          this.lastItem = this.container.children().last();
        }
      }

      this.isCanReplace = true;
    }
  }, {
    key: 'setOriginalSize',
    value: function setOriginalSize() {
      if (this.axis == 'horizontal') {
        this.originalSize = this.original.outerWidth();
      } else {
        this.originalSize = this.original.outerHeight();
      }
    }
  }, {
    key: 'getLastPosition',
    value: function getLastPosition() {
      if (this.axis == 'horizontal') {
        return this.originalSize + this.lastItem.offset().left;
      } else {
        return this.originalSize + this.lastItem.offset().top;
      }
    }
  }, {
    key: 'hoverRemove',
    value: function hoverRemove(context) {
      clearTimeout(context.mousetimer);
      context.mousetimer = setTimeout(function () {
        $(context.itemClass).removeClass('-hover-');
        // console.log('remove')
      }, 1000);
    }
  }, {
    key: 'setEdges',
    value: function setEdges() {
      if (this.axis == 'horizontal') {
        this.bgEdge = $(window).width() / 2;
        this.endEdge = $(window).width() + this.bgEdge;
      } else {
        this.bgEdge = $(window).height() / 2;
        this.endEdge = $(window).height() + this.bgEdge;
      }
    }
  }, {
    key: 'isAcrossBGEdge',
    value: function isAcrossBGEdge() {
      if (this.itemPosition <= -this.bgEdge && !this.isBGCrossProgress) {
        return true;
      }
      return false;
    }
  }, {
    key: 'isAcrossEndEdge',
    value: function isAcrossEndEdge() {
      if (this.getLastPosition() >= this.endEdge && !this.isENDCrossProgress) {
        return true;
      }
      return false;
    }
  }, {
    key: 'isFirstOut',
    value: function isFirstOut(first) {
      if (this.itemPosition < -(this.bgEdge + first.outerHeight()) && this.axis == 'vertical' || this.itemPosition < -(this.bgEdge + first.outerWidth()) && this.axis == 'horizontal') {
        return true;
      }
      return false;
    }
  }, {
    key: 'isLastOut',
    value: function isLastOut(last) {
      if (last.offset().top > this.endEdge && this.axis == 'vertical' || last.offset().left > this.endEdge && this.axis == 'horizontal') {
        return true;
      }
      return false;
    }
  }, {
    key: 'setMotionDirection',
    value: function setMotionDirection() {
      if (this.direction == 'down') {
        this.needSide = 'top';
        this.axis = 'vertical';
      } else if (this.direction == 'left') {
        this.needSide = 'left';
        this.axis = 'horizontal';
      }
    }
  }, {
    key: 'isInsiteOfItem',
    value: function isInsiteOfItem() {
      if (this.axis == 'horizontal') {
        if (this.mouseX >= this.hoverBgn && this.mouseX <= this.hoverEnd) {
          return true;
        }
        return false;
      } else {
        if (this.mouseY >= this.hoverBgn && this.mouseY <= this.hoverEnd) {
          return true;
        }
        return false;
      }
    }
  }, {
    key: 'render',
    value: function render() {
      var refreshRate = 1000 / 60;
      var self = this;

      function renderStep() {
        // console.log('=======================================================================================================================')
        // console.log('bg progress', self.isBGCrossProgress,'bgEdge',self.bgEdge, 'this.itemPosition:',self.itemPosition)
        // console.log('end progress', self.isENDCrossProgress,'endEdge',self.endEdge, 'this.itemPosition:',self.lastItem.offset().left + self.lastSize)
        // console.log(self.axis)
        // console.log('evt.deltaFactor',evt.deltaFactor)s,'endEdge',self.endEdge, 'this.itemPosition:',self.lastItem.offset().left + self.lastSize)
        // console.log('event',trig, trig.clientX,trig.clientY);

        if (self.hoveringItem != null) {
          self.getEdgesOfHover();
          // console.log('Is hovering:', self.isInsiteOfItem())
          if (!self.isInsiteOfItem()) {
            self.hoveringItem.removeClass('-hover-');
            self.hoveringItem = null;
          }
        }

        if (!self.onpause) {
          self.itemPosition -= self.itemSpeed;
        }
        self.setPropsToFirst(self.firstItem);
        if (!self.onpause && self.isCanReplace) {
          self.replaceObjects('next');
        }

        if (self.requestID) {
          self.requestID = window.requestAnimationFrame(renderStep);
        }
      }

      this.requestID = window.requestAnimationFrame(renderStep);
    }
  }, {
    key: 'stop',
    value: function stop() {
      if (this.requestID) {
        window.cancelAnimationFrame(this.requestID);
        this.requestID = undefined;
      }
    }
  }, {
    key: 'appendToEnd',
    value: function appendToEnd() {}
  }, {
    key: 'prependToStart',
    value: function prependToStart() {}
  }, {
    key: 'setPropsToFirst',
    value: function setPropsToFirst(elem) {
      this.container.children().css('margin', 0);
      var indent = 'margin-' + this.needSide;
      elem.css(indent, this.itemPosition + 'px');
    }
  }, {
    key: 'removeElem',
    value: function removeElem(elem) {
      elem.remove();
    }
  }]);

  return MotionGlob;
})();