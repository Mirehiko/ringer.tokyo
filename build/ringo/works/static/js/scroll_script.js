function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

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

var Motion =
/*#__PURE__*/
function () {
  function Motion() {
    _classCallCheck(this, Motion);

    this.xPos = 0;
    this.yPos = 0;
    this.pos = 0;
    this.content_length = 0;
    this.elem = null;
    this.container = null;
    this.is_events_attached = false;
    this.is_paused = false;
    this.is_animated = false;
    this.requestID = undefined;
    this.current_way = 'normal';
    this.axis = 'horizontal';
    this.speed = 1;
    this.key_delta = 10;
    this.has_pause_evt = false;
    this.delay_timer = null;
    this.delayAfterHover = 1000;
    this.on_hover = 'nothing';
    this.on_hover_objs = '';
    this.hoveringItem = null;
    this.hoverBgn = 0;
    this.hoverEnd = 0;
    this.mouseX = 0;
    this.mouseY = 0;
    return this;
  }

  _createClass(Motion, [{
    key: "init",
    value: function init(options) {
      var _this = this;

      this.elem = $(options.elem);
      this.axis = options.axis || 'horizontal';
      this.speed = options.speed || 1;
      this.key_delta = options.key_delta || 10;
      this.has_pause_evt = options.has_pause_evt || false;
      this.delayAfterHover = options.delayAfterHover * 1000 || 1000; // задержка после скрола

      this.on_hover = options.on_hover || 'nothing';
      this.on_hover_objs = options.on_hover_objs;
      this.container = options.container;
      console.log('[LOG] Data initialized');
      this.initAnimation();
      $(window).on('resize', function () {
        _this.initAnimation();
      });
      return this;
    }
  }, {
    key: "updateData",
    value: function updateData(elem) {
      this.elem = $(elem);
      return this;
    }
  }, {
    key: "initAnimation",
    value: function initAnimation() {
      if (this._isNeedToAnimate(this.elem)) {
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
      } else {
        this.stopMovement();
        this.elem.find('.fake').remove();

        this._setPosition(true);
      }

      return this;
    }
  }, {
    key: "startMovement",
    value: function startMovement() {
      this._render();

      this.is_animated = true;
      console.log('[EVENT] Animation started');
    }
  }, {
    key: "resumeMovement",
    value: function resumeMovement() {
      this.is_animated = true;
      console.log('[EVENT] Animation resumes');
    }
  }, {
    key: "pauseMovement",
    value: function pauseMovement() {
      this.is_animated = false;
      console.log('[EVENT] Animation paused');
    }
  }, {
    key: "stopMovement",
    value: function stopMovement() {
      if (this.requestID) {
        window.cancelAnimationFrame(this.requestID);
        this.requestID = undefined;
        this.is_animated = false;

        this._resetToDefault();
      }

      console.log('[EVENT] Animation stopped');
    }
  }, {
    key: "_mouseActions",
    value: function _mouseActions() {
      var _this2 = this;

      $(window).on('mousewheel', function (evt) {
        if (_this2.is_animated) {
          _this2.is_paused = true;

          if (evt.deltaY > 0) {
            _this2.pos += evt.deltaFactor;
            _this2.pos = _this2._calcScroll(_this2.pos, 'reverse');
          } else {
            _this2.pos -= evt.deltaFactor;
            _this2.pos = _this2._calcScroll(_this2.pos, 'normal');
          }

          _this2._setPosition();

          if (_this2.has_pause_evt) {
            _this2.is_paused = true;
            clearTimeout(_this2.delay_timer);
            _this2.delay_timer = setTimeout(function () {
              _this2.is_paused = false;
            }, _this2.delayAfterHover); // выждав паузу запускаем движение
          } else {
            _this2.is_paused = false;
          }
        }
      });

      if (this.on_hover_objs) {
        this.container.delegate(this.on_hover_objs, 'mousemove', function (evt) {
          _this2.mouseX = evt.pageX;
          _this2.mouseY = evt.pageY;
          _this2.hoveringItem = $(evt.target).closest(_this2.on_hover_objs);

          _this2.hoveringItem.addClass('-hover-');
        });
        this.container.delegate(this.on_hover_objs, 'mouseleave', function (evt) {
          if (_this2.hoveringItem != null) {
            _this2.hoveringItem.removeClass('-hover-');

            _this2.hoveringItem = null;
          }
        });
      } // Пауза при наведении мышкой


      if (this.on_hover == 'pause') {
        this.container.delegate('.hoverAction', 'mousemove', function (evt) {
          _this2.is_paused = true;
          clearTimeout(_this2.delay_timer);
          _this2.delay_timer = setTimeout(function () {
            _this2.is_paused = false;
          }, _this2.delayAfterHover); // выждав паузу запускаем движение
        });
      }
    }
  }, {
    key: "_keyboardActions",
    value: function _keyboardActions() {
      var _this3 = this;

      $(window).on('keydown', function (e) {
        if (_this3.is_animated) {
          _this3.is_paused = true;

          if (e.keyCode == 37 || e.keyCode == 38) {
            _this3.pos += _this3.key_delta;
            _this3.pos = _this3._calcScroll(_this3.pos, 'reverse');
          } else if (e.keyCode == 39 || e.keyCode == 40) {
            _this3.pos -= _this3.key_delta;
            _this3.pos = _this3._calcScroll(_this3.pos, 'normal');
          }

          _this3._setPosition();
        }
      });
      $(window).on('keyup', function (e) {
        if (_this3.is_animated) {
          _this3.is_paused = false;
        }
      });
    }
  }, {
    key: "_calcScroll",
    value: function _calcScroll(pos, way) {
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
            pos = pos - this.content_length;
          }
        } else {
          if (pos >= 0) {
            pos = pos - this.content_length;
          }
        }
      }

      this.current_way = way;
      return pos;
    }
  }, {
    key: "_getEdgesOfHover",
    value: function _getEdgesOfHover() {
      this.hoverBgn = this.hoveringItem.offset().top;

      if (this.axis == 'horizontal') {
        this.hoverEnd = this.hoveringItem.offset().left + this.hoveringItem.outerWidth();
      } else {
        this.hoverEnd = this.hoveringItem.offset().top + this.hoveringItem.outerHeight();
      }
    }
  }, {
    key: "_isInsiteOfItem",
    value: function _isInsiteOfItem() {
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
    key: "_setPosition",
    value: function _setPosition(is_reset) {
      if (is_reset) {
        this.elem[0].style.transform = "translate3d(0px, 0px, 0)";
      } else {
        if (this.axis == 'horizontal') {
          this.xPos = this.pos;
        } else {
          this.yPos = this.pos;
        }

        this.elem[0].style.transform = "translate3d(".concat(this.xPos, "px, ").concat(this.yPos, "px, 0)");
      }
    }
  }, {
    key: "_render",
    value: function _render() {
      var refreshRate = 1000 / 60;
      var inst = this;

      function renderStep() {
        if (inst.hoveringItem != null) {
          inst._getEdgesOfHover(); // console.log('Is hovering:', self.isInsiteOfItem())


          if (!inst._isInsiteOfItem()) {
            inst.hoveringItem.removeClass('-hover-');
            inst.hoveringItem = null;
          }
        }

        if (!inst.is_paused && inst.is_animated) {
          inst.pos--;
          inst.pos = inst._calcScroll(inst.pos, 'normal');

          inst._setPosition();
        }

        if (inst.requestID) {
          inst.requestID = window.requestAnimationFrame(renderStep);
        }
      }

      this.requestID = window.requestAnimationFrame(renderStep);
    }
  }, {
    key: "_resetToDefault",
    value: function _resetToDefault() {
      this.pos = 0;
      this.xPos = 0;
      this.yPos = 0;
      this.current_way = 'normal';
    }
  }, {
    key: "_setContentLength",
    value: function _setContentLength(elem) {
      if (this.axis == 'horizontal') {
        return elem.find('.fake').length ? elem.outerWidth() / 2 : elem.outerWidth();
      }

      return elem.find('.fake').length ? elem.outerHeight() / 2 : elem.outerHeight();
    }
  }, {
    key: "_prepareToAnimate",
    value: function _prepareToAnimate() {
      console.log('[LOG] Starting prepare data to animate');
      this.content_length = this._setContentLength(this.elem);

      if (!this.is_animated) {
        this.elem.append(this._copyContent(this.elem));
      }

      console.log('[LOG] Data to animate prepared');
    }
  }, {
    key: "_isNeedToAnimate",
    value: function _isNeedToAnimate(elem) {
      var compare_elem = elem || this.elem;

      var content_size = this._setContentLength(compare_elem);

      var parent_size = 0;

      if (this.axis == 'horizontal') {
        parent_size = compare_elem.parent().outerWidth();
      } else {
        parent_size = compare_elem.parent().outerHeight();
      }

      if (content_size < parent_size) {
        console.log('[CHECK] Do not need to animate');
        return false;
      }

      console.log('[CHECK] Need to animate');
      return true;
    }
  }, {
    key: "_copyContent",
    value: function _copyContent(elem) {
      return elem.children().clone().addClass('fake');
    }
  }]);

  return Motion;
}();