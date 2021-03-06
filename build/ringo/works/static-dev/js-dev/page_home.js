class WorkItem {
	constructor(data) {
		this.html     = null;
		this.id       = data.id;
		this.title    = data.title;
		this.poster   = data.poster;
		this.launch   = data.launch || formatDate(new Date(data.launch_date));
		this.category = data.category;

		return this;
	}

	getItem(type) {
		if (type == 'mobile') {
			this._createMobile();
		}
		else {
			this._createDesktop();
		}
		return this.html;
	}

	_createDesktop() {
		let preview = false;
		let preview_html = '';
		if (preview) {
			preview_html = `
				<div class="itemPreview">
					<div class="itemPreview__box"></div>
					<div class="itemPreview__btn"></div>
				</div>`;
		}
		this.html = `
			<a href="${ this.id }" class="boxItem" title="">
				<div class="itemWrapper">
					<div class="itemBack" style="background-image: url(${ this.poster }); background-size: cover; background-repeat: no-repeat;"></div>
					<div class="itemContent">
						<div class="itemTitle text-right"><span>${ this.title }</span></div>
						<div class="itemLauchDate text-right"><span>${ this.launch }</span></div>
						<div class="itemCategory text-right"><span>${ this.category }</span></div>
						${ preview_html }
					</div>
				</div>
			</a>
		`;
	}

	_createMobile() {
		this.html = `
			<a href="${ this.id }" class="mobItem" title="">
				<img class="mobileItem__image" src="${ this.poster }" alt="">
				<div class="mobItem__info">
					<h2 class="paramLine">
						<span class="paramTitle"></span>
						<span class="paramValue">${ this.title }</span>
					</h2>
					<div class="paramLine">
						<span class="paramTitle"></span>
						<span class="paramValue">${ this.launch }</span>
					</div>
					<div class="paramLine">
						<span class="paramTitle"></span>
						<span class="paramValue">${ this.category }</span>
					</div>
				</div>
			</a>`;
	}
}

class WorkList {
	constructor(data) {
		this.works         = [];
		this.html          = null;
		this.fragment      = null;

		this._init(data);
		return this;
	}

	_init(data) {
		this.fragment = document.createDocumentFragment();
		for (let i = 0; i < data.length; i++) {
			this.addWork(new WorkItem(data[i]));
			console.log("Creating item:", data[i]);
	  	}
	}

	addWork(work) {
		this.works.push(work);
	}

	getWorks(type, lines) {
		let html = document.createElement('div');
		if (type == 'mobile') {
			$(html).addClass('infiniteBox');
			for (let i = 0; i < this.works.length; i++) {
				$(this.fragment).append(this.works[i].getItem(type));
			}
		}
		else {
			$(html).addClass('infiniteBox hoverAction');
			let works_copy = this.works.slice(0);

			for (let i = 0; i < lines.data_lines.length; i++) {
				let row = works_copy.splice(0, lines.data_lines[i]); // cколько срезаем для линии
				let func = `_${ lines.line_types[i] }`;
				$(this.fragment).append(this[func](row, type));
			}
		}

		$(html).append(this.fragment);
		this.html = html;
		html = null;
		this.fragment = document.createDocumentFragment();

		return this.html;
	}

	_oneBigTwoSmall(data, type) {
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

	_twoSmallOneBig(data, type) {
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

	_trioLine(data, type) {
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

	_pairLine(data, type) {
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
}

class Lines {
	constructor(data_length) {
		this.data_length  = data_length;
		this.clear_part   = 0;
		this.divided_part = 0;
		this.data_lines   = [];
		this.line_types   = [];
		this._init();
	}

	_init() {
		this.clear_part   = Math.trunc(this.data_length / 3);
		this.divided_part = this.data_length % 3;

		if (this.divided_part == 2) {
			this.data_lines = this.data_lines.concat([2]);
		}
		else if (this.divided_part == 1) {
			if (this.clear_part == 0) {
				this.data_lines = this.data_lines.concat([2]);
			}
			else {
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

	_initDouble() {
		this.clear_part   = Math.trunc(this.data_length / 5); // [2, 3] or [3, 2]
		this.divided_part = this.data_length % 5;

		if (this.divided_part == 4) {
			this.data_lines = this.data_lines.concat([2, 2]);
		}
		else if (this.divided_part == 3) {
			this.data_lines = this.data_lines.concat([3]);
		}
		else if (this.divided_part == 2) {
			this.data_lines = this.data_lines.concat([2]);
		}
		else if (this.divided_part == 1) {
			if (this.clear_part == 0) {
				this.data_lines = this.data_lines.concat([2]);
			}
			else {
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

	_setLineTypesTrio() {

		let pair_lines = [], trio_lines = [];
		for (var i = 0; i < this.data_lines.length; i++) {
			if (this.data_lines[i] == 2) {
				pair_lines.push(this.data_lines[i]);
			}
			else {
				trio_lines.push(this.data_lines[i]);
			}
		}

		let lines_count    = this.data_lines.length;
		this.trio_type_tmp = '';
		this.data_lines    = [];
		this.line_types    = [];


		let trio_variants = 3;
		if (lines_count == 1) {
			trio_variants = 2;
		}

		for (let i = 0; i < lines_count; i++) {
			let ntmp = [], ctmp = [];
			if (pair_lines[i] != undefined) {
				ntmp = ntmp.concat(pair_lines[i]);
				ctmp = ctmp.concat('pairLine');
			}
			if (trio_lines[i] != undefined) {
				ntmp = ntmp.concat(trio_lines[i]);
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

  _setLineTypesDouble() {
    let pair_lines = [], trio_lines = [];
		for (var i = 0; i < this.data_lines.length; i++) {
			if (this.data_lines[i] == 2) {
				pair_lines.push(this.data_lines[i]);
			}
			else {
				trio_lines.push(this.data_lines[i]);
			}
		}

    let trio_count = 1,
				pair_count = 0,
				step = 2,
				trio_variants = 3;

		if (this._selectCombination() == 2) {
			trio_count = 0;
			pair_count = 1;
		}

		if (this.clear_part == 0) {
			step          = 1;
			pair_count    = 0;
			trio_count    = 0;
			trio_variants = 2;
		}

		let lines_count = this.data_lines.length;
		this.data_lines = [];
		this.line_types = new Array(lines_count);
		this.data_lines = new Array(lines_count);

		for (let i = 0; i < trio_lines.length; i++) {
			this.data_lines[trio_count] = 3;
			this.line_types[trio_count] = this._selectLineType(trio_variants);
			trio_count += step;
		}

		for (let i = 0; i < pair_lines.length; i++) {
			this.data_lines[pair_count] = 2;
			this.line_types[pair_count] = 'pairLine';
			pair_count += step;
		}

    this.data_lines = this.data_lines.filter(Boolean);
    this.line_types = this.line_types.filter(Boolean);
  }

	_selectCombination() {
		if ( randomInteger(1, 2) == 1) {
			return 1;
		}
		return 2;
	}

	_selectLineType(variants=3) {
		/* Выбираем рандомную комбинацию из трех элементов */
		// var typeID = randomInteger(1, variants);
	  var typeID = 0;
		do {
			typeID = randomInteger(1, variants);
		}
		while(this.trio_type_tmp == typeID);

		this.trio_type_tmp = typeID;

	  switch (typeID) {
	    case 1: {
	      return 'twoSmallOneBig'; // 2 маленьких 1 большой
	      break;
	    }
	    case 2: {
	      return 'oneBigTwoSmall'; // 1 большой 2 маленьких
	      break;
	    }
			case 3: {
				return 'trioLine'; // 3 в ряд
				break;
			}
	    default:
			return "Error";
	     	 break;
	  }
	}
}

class Controller {
	constructor(data) {
		this.windowObj     = $(window);
		this.edge          = 768;
		this.work_list     = null;
		this.animation     = null;
		this.original_data = null;
		this.current_view  = '';
		this.category      = '';
		this.container     = $('#homePage');
		this.init(data);
		return this;
	}

	init(data) {
		this._initData(data);

		this.animation = new Motion();
		this.animation.init({
			elem: '.infiniteBox',
			axis: 'vertical',
			has_pause_evt:   true,
			delayAfterHover: 2,
			container: this.container,
			// on_hover:      'pause',
			on_hover_objs: '.boxItem',
		})
		.initAnimation();


		$(window).on('resize', (e) => {
			this._setView();
		});
	}

	_initData(data, is_update) {
		this.original_data = data;
		this.work_list = new WorkList(data);
		this.lines     = new Lines(this.work_list.works.length);
		this._setView(is_update);
	}

	_setView(is_update) {
		if (this.windowObj.width() < this.edge && this.current_view != 'mobile') {
			this.current_view = 'mobile';
			if (this.animation != null) {this.animation.animationOff();}
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

	_redrawBackgrounds() {
		var items = $('.boxItem');
		$.each(items, function (key, val) {
			$(this).outerHeight($(this).outerWidth() / SCREEN_RATIO);
		});
	}

	_changeView(lines) {
		this.container.empty();
		this.container.append(this.work_list.getWorks(this.current_view, lines));
	}

	getData(category, callback) { // Заменить на фильтрацию уже имеющихся данных или же оставить?
		let inst = this;
		$.ajax({
	    url: '/api/',
	    type: "GET",
	    data: {
	    	category: category,
	    },
	    dataType: 'json',
	    success: function (data) {
		if (data.length) {
			inst.animation.stopMovement();
			inst._initData(data, true);
			inst.animation.updateData('.infiniteBox').initAnimation();
			callback();
		}
		else {
			console.log('Нет данных');
		}
	    }
	  });
	}
}

const mounth_text = [
	'Янв', 'Фев', 'Мар', 'Апр',
	'Май', 'Июн', 'Июл', 'Авг',
	'Сен', 'Окт', 'Ноя', 'Дек',
];

function formatDate(date) {

	var dd = date.getDate();
	if (dd < 10) dd = '0' + dd;
  
	// var mm = date.getMonth() + 1;
	var mm = mounth_text[date.getMonth()];
	// if (mm < 10) mm = '0' + mm;
	
  
	var yy = date.getFullYear() % 100;
	if (yy < 10) yy = '0' + yy;
  
	return `${dd} ${mm}, ${yy}`;
  }

function randomInteger(min, max) {
  var rand = min - 0.5 + Math.random() * (max - min + 1);
  rand = Math.round(rand);
  return rand;
}

function setCategory(category) {
  $(".toggleBtn__text[globcat]").text(category);
}

var controller = new Controller(textData);
// console.log(controller);

$('.toggleList__item').on('click', function (e) {
  e.preventDefault();
	var cat = $(this).attr('globcat');
	controller.getData(cat, () => {
		$('.toggleList__item.-active-').removeClass('-active-');
		$(`.toggleList__item[globcat="${ cat }"]`).addClass('-active-');
		setCategory($(this).text());
	});
});

$('#mobileCategory>.toggleBtn').on('click', function (e) {
  var elem = $(this);
  var mobileNav = $('#mobileNav'); // console.log(mobileNav);

  if (elem.hasClass('collapse')) {
    mobileNav.addClass('-open-');
  }
  else {
    mobileNav.removeClass('-open-');
  }
});