function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var WorkItem =
/*#__PURE__*/
function () {
  function WorkItem(data) {
    _classCallCheck(this, WorkItem);

    this.html = null;
    this.id = data.id;
    this.title = data.title;
    this.poster = data.poster;
    this.launch = data.launch || formatDate(new Date(data.launch_date));
    this.category = data.category;
    return this;
  }

  _createClass(WorkItem, [{
    key: "getItem",
    value: function getItem(type) {
      if (type == 'mobile') {
        this._createMobile();
      } else {
        this._createDesktop();
      }

      return this.html;
    }
  }, {
    key: "_createDesktop",
    value: function _createDesktop() {
      var preview = false;
      var preview_html = '';

      if (preview) {
        preview_html = "\n\t\t\t\t<div class=\"itemPreview\">\n\t\t\t\t\t<div class=\"itemPreview__box\"></div>\n\t\t\t\t\t<div class=\"itemPreview__btn\"></div>\n\t\t\t\t</div>";
      }

      this.html = "\n\t\t\t<a href=\"".concat(this.id, "\" class=\"boxItem\" title=\"\">\n\t\t\t\t<div class=\"itemWrapper\">\n\t\t\t\t\t<div class=\"itemBack\" style=\"background-image: url(").concat(this.poster, "); background-size: cover; background-repeat: no-repeat;\"></div>\n\t\t\t\t\t<div class=\"itemContent\">\n\t\t\t\t\t\t<div class=\"itemTitle withValue\"><span>").concat(this.title, "</span></div>\n\t\t\t\t\t\t<div class=\"itemLauchDate withValue\"><span>").concat(this.launch, "</span></div>\n\t\t\t\t\t\t<div class=\"itemCategory withValue\"><span>").concat(this.category, "</span></div>\n\t\t\t\t\t\t").concat(preview_html, "\n\t\t\t\t\t</div>\n\t\t\t\t</div>\n\t\t\t</a>\n\t\t");
    }
  }, {
    key: "_createMobile",
    value: function _createMobile() {
      this.html = "\n\t\t\t<a href=\"".concat(this.id, "\" class=\"mobItem\" title=\"\">\n\t\t\t\t<img class=\"mobileItem__image\" src=\"").concat(this.poster, "\" alt=\"\">\n\t\t\t\t<div class=\"mobItem__info\">\n\t\t\t\t\t<h2 class=\"paramLine\">\n\t\t\t\t\t\t<span class=\"paramTitle\"></span>\n\t\t\t\t\t\t<span class=\"paramValue\">").concat(this.title, "</span>\n\t\t\t\t\t</h2>\n\t\t\t\t\t<div class=\"paramLine\">\n\t\t\t\t\t\t<span class=\"paramTitle\"></span>\n\t\t\t\t\t\t<span class=\"paramValue\">").concat(this.launch, "</span>\n\t\t\t\t\t</div>\n\t\t\t\t\t<div class=\"paramLine\">\n\t\t\t\t\t\t<span class=\"paramTitle\"></span>\n\t\t\t\t\t\t<span class=\"paramValue\">").concat(this.category, "</span>\n\t\t\t\t\t</div>\n\t\t\t\t</div>\n\t\t\t</a>");
    }
  }]);

  return WorkItem;
}();

var WorkList =
/*#__PURE__*/
function () {
  function WorkList(data) {
    _classCallCheck(this, WorkList);

    this.works = [];
    this.html = null;
    this.fragment = null;

    this._init(data);

    return this;
  }

  _createClass(WorkList, [{
    key: "_init",
    value: function _init(data) {
      this.fragment = document.createDocumentFragment();

      for (var i = 0; i < data.length; i++) {
        this.addWork(new WorkItem(data[i]));
        console.log("Creating item:", data[i]);
      }
    }
  }, {
    key: "addWork",
    value: function addWork(work) {
      this.works.push(work);
    }
  }, {
    key: "getWorks",
    value: function getWorks(type, lines) {
      var html = document.createElement('div');

      if (type == 'mobile') {
        $(html).addClass('infiniteBox');

        for (var i = 0; i < this.works.length; i++) {
          $(this.fragment).append(this.works[i].getItem(type));
        }
      } else {
        $(html).addClass('infiniteBox hoverAction');
        var works_copy = this.works.slice(0);

        for (var _i = 0; _i < lines.data_lines.length; _i++) {
          var row = works_copy.splice(0, lines.data_lines[_i]); // cколько срезаем для линии

          var func = "_".concat(lines.line_types[_i]);
          $(this.fragment).append(this[func](row, type));
        }
      }

      $(html).append(this.fragment);
      this.html = html;
      html = null;
      this.fragment = document.createDocumentFragment();
      return this.html;
    }
  }, {
    key: "_oneBigTwoSmall",
    value: function _oneBigTwoSmall(data, type) {
      var dt = data.slice();
      var line = document.createElement('div');
      $(line).addClass('infirow');
      var big = document.createElement('div');
      $(big).addClass('col-8');
      $(big).append(dt[0].getItem(type));
      dt.splice(0, 1);
      var small = document.createElement('div');
      $(small).addClass('col-4');

      do {
        $(small).append(dt[0].getItem(type));
        dt.splice(0, 1);
      } while (dt.length);

      $(line).append(big);
      $(line).append(small);
      return line;
    }
  }, {
    key: "_twoSmallOneBig",
    value: function _twoSmallOneBig(data, type) {
      var dt = data.slice();
      var line = document.createElement('div');
      $(line).addClass('infirow');
      var big = document.createElement('div');
      $(big).addClass('col-8');
      $(big).append(dt[0].getItem(type));
      dt.splice(0, 1);
      var small = document.createElement('div');
      $(small).addClass('col-4');

      do {
        $(small).append(dt[0].getItem(type));
        dt.splice(0, 1);
      } while (dt.length);

      $(line).append(small);
      $(line).append(big);
      return line;
    }
  }, {
    key: "_trioLine",
    value: function _trioLine(data, type) {
      var dt = data.slice();
      var line = document.createElement('div');
      $(line).addClass('infirow');

      do {
        var item = document.createElement('div');
        $(item).addClass('col-4');
        $(item).append(dt[0].getItem(type));
        $(line).append(item);
        dt.splice(0, 1);
      } while (dt.length);

      return line;
    }
  }, {
    key: "_pairLine",
    value: function _pairLine(data, type) {
      var dt = data.slice();
      var line = document.createElement('div');
      $(line).addClass('infirow');

      do {
        var item = document.createElement('div');
        $(item).addClass('col-6');
        $(item).append(dt[0].getItem(type));
        $(line).append(item);
        dt.splice(0, 1);
      } while (dt.length);

      return line;
    }
  }]);

  return WorkList;
}();

var Lines =
/*#__PURE__*/
function () {
  function Lines(data_length) {
    _classCallCheck(this, Lines);

    this.data_length = data_length;
    this.clear_part = 0;
    this.divided_part = 0;
    this.data_lines = [];
    this.line_types = [];

    this._init();
  }

  _createClass(Lines, [{
    key: "_init",
    value: function _init() {
      this.clear_part = Math.trunc(this.data_length / 3);
      this.divided_part = this.data_length % 3;

      if (this.divided_part == 2) {
        this.data_lines = this.data_lines.concat([2]);
      } else if (this.divided_part == 1) {
        if (this.clear_part == 0) {
          this.data_lines = this.data_lines.concat([2]);
        } else {
          this.clear_part--;
          this.data_lines = this.data_lines.concat([2, 2]);
        }
      }

      if (this.clear_part > 0) {
        for (var i = 0; i < this.clear_part; i++) {
          this.data_lines = this.data_lines.concat([3]);
        }
      }

      this._setLineTypesTrio();
    }
  }, {
    key: "_initDouble",
    value: function _initDouble() {
      this.clear_part = Math.trunc(this.data_length / 5); // [2, 3] or [3, 2]

      this.divided_part = this.data_length % 5;

      if (this.divided_part == 4) {
        this.data_lines = this.data_lines.concat([2, 2]);
      } else if (this.divided_part == 3) {
        this.data_lines = this.data_lines.concat([3]);
      } else if (this.divided_part == 2) {
        this.data_lines = this.data_lines.concat([2]);
      } else if (this.divided_part == 1) {
        if (this.clear_part == 0) {
          this.data_lines = this.data_lines.concat([2]);
        } else {
          this.clear_part--;
          this.data_lines = this.data_lines.concat([3, 3]);
        }
      }

      if (this.clear_part > 0) {
        for (var i = 0; i < this.clear_part; i++) {
          this.data_lines = this.data_lines.concat([2, 3]);
        }
      }

      this._setLineTypesDouble();
    }
  }, {
    key: "_setLineTypesTrio",
    value: function _setLineTypesTrio() {
      var pair_lines = [],
          trio_lines = [];

      for (var i = 0; i < this.data_lines.length; i++) {
        if (this.data_lines[i] == 2) {
          pair_lines.push(this.data_lines[i]);
        } else {
          trio_lines.push(this.data_lines[i]);
        }
      }

      var lines_count = this.data_lines.length;
      this.trio_type_tmp = '';
      this.data_lines = [];
      this.line_types = [];
      var trio_variants = 3;

      if (lines_count == 1) {
        trio_variants = 2;
      }

      for (var _i2 = 0; _i2 < lines_count; _i2++) {
        var ntmp = [],
            ctmp = [];

        if (pair_lines[_i2] != undefined) {
          ntmp = ntmp.concat(pair_lines[_i2]);
          ctmp = ctmp.concat('pairLine');
        }

        if (trio_lines[_i2] != undefined) {
          ntmp = ntmp.concat(trio_lines[_i2]);
          ctmp = ctmp.concat(this._selectLineType(trio_variants));
        }

        if (!ntmp.length) {
          break;
        }

        this.data_lines = this.data_lines.concat(ntmp);
        this.line_types = this.line_types.concat(ctmp);
      }

      if (this._selectCombination() == 2) {
        this.line_types.reverse();
        this.data_lines.reverse();
      }
    }
  }, {
    key: "_setLineTypesDouble",
    value: function _setLineTypesDouble() {
      var pair_lines = [],
          trio_lines = [];

      for (var i = 0; i < this.data_lines.length; i++) {
        if (this.data_lines[i] == 2) {
          pair_lines.push(this.data_lines[i]);
        } else {
          trio_lines.push(this.data_lines[i]);
        }
      }

      var trio_count = 1,
          pair_count = 0,
          step = 2,
          trio_variants = 3;

      if (this._selectCombination() == 2) {
        trio_count = 0;
        pair_count = 1;
      }

      if (this.clear_part == 0) {
        step = 1;
        pair_count = 0;
        trio_count = 0;
        trio_variants = 2;
      }

      var lines_count = this.data_lines.length;
      this.data_lines = [];
      this.line_types = new Array(lines_count);
      this.data_lines = new Array(lines_count);

      for (var _i3 = 0; _i3 < trio_lines.length; _i3++) {
        this.data_lines[trio_count] = 3;
        this.line_types[trio_count] = this._selectLineType(trio_variants);
        trio_count += step;
      }

      for (var _i4 = 0; _i4 < pair_lines.length; _i4++) {
        this.data_lines[pair_count] = 2;
        this.line_types[pair_count] = 'pairLine';
        pair_count += step;
      }

      this.data_lines = this.data_lines.filter(Boolean);
      this.line_types = this.line_types.filter(Boolean);
    }
  }, {
    key: "_selectCombination",
    value: function _selectCombination() {
      if (randomInteger(1, 2) == 1) {
        return 1;
      }

      return 2;
    }
  }, {
    key: "_selectLineType",
    value: function _selectLineType() {
      var variants = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 3;

      /* Выбираем рандомную комбинацию из трех элементов */
      // var typeID = randomInteger(1, variants);
      var typeID = 0;

      do {
        typeID = randomInteger(1, variants);
      } while (this.trio_type_tmp == typeID);

      this.trio_type_tmp = typeID;

      switch (typeID) {
        case 1:
          {
            return 'twoSmallOneBig'; // 2 маленьких 1 большой

            break;
          }

        case 2:
          {
            return 'oneBigTwoSmall'; // 1 большой 2 маленьких

            break;
          }

        case 3:
          {
            return 'trioLine'; // 3 в ряд

            break;
          }

        default:
          return "Error";
          break;
      }
    }
  }]);

  return Lines;
}();

var Controller =
/*#__PURE__*/
function () {
  function Controller(data) {
    _classCallCheck(this, Controller);

    this.windowObj = $(window);
    this.edge = 768;
    this.work_list = null;
    this.animation = null;
    this.original_data = null;
    this.current_view = '';
    this.category = '';
    this.container = $('#homePage');
    this.init(data);
    return this;
  }

  _createClass(Controller, [{
    key: "init",
    value: function init(data) {
      var _this = this;

      this._initData(data);

      this.animation = new Motion();
      this.animation.init({
        elem: '.infiniteBox',
        axis: 'vertical',
        has_pause_evt: true,
        delayAfterHover: 2,
        container: this.container,
        // on_hover:      'pause',
        on_hover_objs: '.boxItem'
      }).initAnimation();
      $(window).on('resize', function (e) {
        _this._setView();
      });
    }
  }, {
    key: "_initData",
    value: function _initData(data, is_update) {
      this.original_data = data;
      this.work_list = new WorkList(data);
      this.lines = new Lines(this.work_list.works.length);

      this._setView(is_update);
    }
  }, {
    key: "_setView",
    value: function _setView(is_update) {
      if (this.windowObj.width() < this.edge && this.current_view != 'mobile') {
        this.current_view = 'mobile';

        if (this.animation != null) {
          this.animation.animationOff();
        }

        this._changeView();
      }

      if (this.windowObj.width() >= this.edge && this.current_view != 'desktop') {
        this.current_view = 'desktop';

        this._changeView(this.lines);

        if (this.animation != null) {
          this.animation.updateData('.infiniteBox');
          this.animation.animationOn();
        }
      }

      if (is_update) {
        this._changeView(this.lines);
      }

      if (this.current_view == 'desktop') {
        this._redrawBackgrounds();
      }
    }
  }, {
    key: "_redrawBackgrounds",
    value: function _redrawBackgrounds() {
      var items = $('.boxItem');
      $.each(items, function (key, val) {
        $(this).outerHeight($(this).outerWidth() / SCREEN_RATIO);
      });
    }
  }, {
    key: "_changeView",
    value: function _changeView(lines) {
      this.container.empty();
      this.container.append(this.work_list.getWorks(this.current_view, lines));
    }
  }, {
    key: "getData",
    value: function getData(category, callback) {
      // Заменить на фильтрацию уже имеющихся данных или же оставить?
      var inst = this;
      $.ajax({
        url: '/api/',
        type: "GET",
        data: {
          category: category
        },
        dataType: 'json',
        success: function success(data) {
          if (data.length) {
            inst.animation.stopMovement();

            inst._initData(data, true);

            inst.animation.updateData('.infiniteBox').initAnimation();
            callback();
          } else {
            console.log('Нет данных');
          }
        }
      });
    }
  }]);

  return Controller;
}();

var mounth_text = ['Янв', 'Фев', 'Мар', 'Апр', 'Май', 'Июн', 'Июл', 'Авг', 'Сен', 'Окт', 'Ноя', 'Дек'];

function formatDate(date) {
  var dd = date.getDate();
  if (dd < 10) dd = '0' + dd; // var mm = date.getMonth() + 1;

  var mm = mounth_text[date.getMonth()]; // if (mm < 10) mm = '0' + mm;

  var yy = date.getFullYear() % 100;
  if (yy < 10) yy = '0' + yy;
  return "".concat(dd, " ").concat(mm, ", ").concat(yy);
}

function randomInteger(min, max) {
  var rand = min - 0.5 + Math.random() * (max - min + 1);
  rand = Math.round(rand);
  return rand;
}

function setCategory(category) {
  $(".toggleBtn__text[globcat]").text(category);
}

var controller = new Controller(textData); // console.log(controller);

$('.toggleList__item').on('click', function (e) {
  var _this2 = this;

  e.preventDefault();
  var cat = $(this).attr('globcat');
  controller.getData(cat, function () {
    $('.toggleList__item.-active-').removeClass('-active-');
    $(".toggleList__item[globcat=\"".concat(cat, "\"]")).addClass('-active-');
    setCategory($(_this2).text());
  });
});
$('#mobileCategory>.toggleBtn').on('click', function (e) {
  var elem = $(this);
  var mobileNav = $('#mobileNav'); // console.log(mobileNav);

  if (elem.hasClass('collapse')) {
    mobileNav.addClass('-open-');
  } else {
    mobileNav.removeClass('-open-');
  }
});