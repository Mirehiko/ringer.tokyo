class WorkItem {
	constructor(data) {
		this.html;
		this.id       = data.id;
		this.title    = data.title;
		this.poster   = data.poster;
		this.lauch    = data.lauch;
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
			<a href="${ this.id }" class="boxItem" title="Перейти к ${ this.title }">
				<div class="itemWrapper">
					<div class="itemBack" style="background-image: url(${ this.poster }); background-size: cover; background-repeat: no-repeat;"></div>
					<div class="itemContent">
						<div class="itemTitle withValue">Title<span>${ this.title }</span></div>
						<div class="itemLauchDate withValue">Launch<span>${ this.lauch }</span></div>
						<div class="itemCategory withValue">Category<span>${ this.category }</span></div>
						${ preview_html }
					</div>
				</div>
			</a>
		`;
	}

	_createMobile() {
		this.html = `
			<a href="${ this.id }" class="mobItem" title="Перейти к ${ this.title }">
				<img class="mobileItem__image" src="${ this.poster }" alt="">
				<div class="mobItem__info">
					<h2 class="paramLine">
						<span class="paramTitle">Title</span>
						<span class="paramValue">${ this.title }</span>
					</h2>
					<div class="paramLine">
						<span class="paramTitle">Launch</span>
						<span class="paramValue">${ this.lauch }</span>
					</div>
					<div class="paramLine">
						<span class="paramTitle">Category</span>
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
		for (var i = 0; i < data.length; i++) {
			this.addWork(new WorkItem(data[i]));
	  }
	}

	addWork(work) {
		this.works.push(work);
	}

	getWorks(type) {
		if (type == 'mobile') {
			let mobile_html = document.createElement('div');
			$(mobile_html).addClass('infiniteBox');

			for (var i = 0; i < this.works.length; i++) {
				$(this.fragment).append(this.works[i].getItem(type));
			}

			$(mobile_html).append(this.fragment);
			this.html = mobile_html;
			this.fragment = mobile_html = null;
		}
		else {

		}

		return this.html;
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
		// this.clear_part   = Math.trunc(this.data_length / 5); // [2, 3] or [3, 2]
		// this.divided_part = this.data_length % 5;

		// if (this.divided_part == 4) {
		// 	this.data_lines = this.data_lines.concat([2, 2]);
		// }
		// else if (this.divided_part == 3) {
		// 	this.data_lines = this.data_lines.concat([3]);
		// }
		// else if (this.divided_part == 2) {
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
				// this.data_lines = this.data_lines.concat([3, 3]);
			}
		}

		if (this.clear_part > 0) {
			for (var i = 0; i < this.clear_part; i++) {
				this.data_lines = this.data_lines.concat([3]);
				// this.data_lines = this.data_lines.concat([2, 3]);
			}
		}
		console.log(this.data_lines);
		this._setLineTypes();
		console.log(this.line_types);
	}

	_setLineTypes() {

		let pair_lines = [], trio_lines = [];
		for (var i = 0; i < this.data_lines.length; i++) {
			if (this.data_lines[i] == 2) {
				pair_lines.push(this.data_lines[i]);
			}
			else {
				trio_lines.push(this.data_lines[i]);
			}
		}

		let lines_count = this.data_lines.length;
		this.data_lines = [];
		this.line_types = [];

		let trio_variants = 3;
		if (lines_count == 1) {
			trio_variants = 2;
		}

		for (var i = 0; i < lines_count; i++) {
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

		// let trio_count = 1,
		// 		pair_count = 0,
		// 		step = 2,
		// 		trio_variants = 3;
    //
		// if (this._selectCombination() == 2) {
		// 	trio_count = 0;
		// 	pair_count = 1;
		// }
    //
		// if (this.clear_part == 0) {
		// 	step          = 1;
		// 	pair_count    = 0;
		// 	trio_count    = 0;
		// 	trio_variants = 2;
		// }

		// let lines_count = this.data_lines.length;
		// this.data_lines = [];
		// this.line_types = new Array(lines_count);
		// this.data_lines = new Array(lines_count);
    //
		// for (var i = 0; i < trio_lines.length; i++) {
		// 	this.data_lines[trio_count] = 3;
		// 	this.line_types[trio_count] = this._selectLineType(trio_variants);
		// 	trio_count += step;
		// }
    //
		// for (var i = 0; i < pair_lines.length; i++) {
		// 	this.data_lines[pair_count] = 2;
		// 	this.line_types[pair_count] = 'pairLine';
		// 	pair_count += step;
		// }
	}

	_selectCombination() {
		if ( randomInteger(1, 2) == 1) {
			return 1;
		}
		return 2;
	}

	_selectLineType(variants=3) {
		/* Выбираем рандомную комбинацию из трех элементов */
	  var typeID = randomInteger(1, variants);

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

	_oneBigTwoSmall(data) {
		var dt = data.slice();
	  var line = document.createElement('div');
	  $(line).addClass('infirow');
	  var big = document.createElement('div');
	  $(big).addClass('col-8');
	  $(big).append(drawItem(dt[0]));
	  dt.splice(0, 1);
	  var small = document.createElement('div');
	  $(small).addClass('col-4');

	  do {
	    $(small).append(drawItem(dt[0]));
	    dt.splice(0, 1);
	  } while (dt.length);

	  $(line).append(big);
	  $(line).append(small);
	  return line;
	}

	_twoSmallOneBig() {
		var dt = data.slice();
	  var line = document.createElement('div');
	  $(line).addClass('infirow');
	  var big = document.createElement('div');
	  $(big).addClass('col-8');
	  $(big).append(drawItem(dt[0]));
	  dt.splice(0, 1);
	  var small = document.createElement('div');
	  $(small).addClass('col-4');

	  do {
	    $(small).append(drawItem(dt[0]));
	    dt.splice(0, 1);
	  } while (dt.length);

	  $(line).append(small);
	  $(line).append(big);
	  return line;
	}

	_tripleLine() {
		var dt = data.slice();
	  var line = document.createElement('div');
	  $(line).addClass('infirow');

	  do {
	    var item = document.createElement('div');
	    $(item).addClass('col-4');
	    $(item).append(drawItem(dt[0]));
	    $(line).append(item);
	    dt.splice(0, 1);
	  } while (dt.length);

	  return line;
	}

	_doubleLine() {
		var dt = data.slice();
	  var line = document.createElement('div');
	  $(line).addClass('infirow');

	  do {
	    var item = document.createElement('div');
	    $(item).addClass('col-6');
	    $(item).append(drawItem(dt[0]));
	    $(line).append(item);
	    dt.splice(0, 1);
	  } while (dt.length);

	  return line;
	}
}

class Controller {
	constructor(data) {
		this.work_list = null;
		this.edge = 768;
		this.current_view = '';
		this.windowObj = $(window);

		this.init(data);
		return this;
	}

	init(data) {
		this.work_list = new WorkList(data);
		this.lines = new Lines(this.work_list.works.length);

		this._setView();

		$(window).on('resize', (e) => {
			this._setView();
		});
	}

	_setView() {
		if (this.windowObj.width() < this.edge && this.current_view != 'mobile') {
			this.current_view = 'mobile';
			this._changeView();
		}

		if (this.windowObj.width() >= this.edge && this.current_view != 'desktop') {
			this.current_view = 'desktop';
			this._changeView();
		}
	}

	_changeView() {
		$('#homePage').empty();
		$('#homePage').append(this.work_list.getWorks(this.current_view));
	}
}

function randomInteger(min, max) {
  var rand = min - 0.5 + Math.random() * (max - min + 1);
  rand = Math.round(rand);
  return rand;
}

function redrawBackgrounds() {
  var items = $('.boxItem');
  $.each(items, function (key, val) {
    $(this).outerHeight($(this).outerWidth() / SCREEN_RATIO);
  });
}



var controller = new Controller(textData);
console.log(controller)

redrawBackgrounds();

// remake it!
$('.toggleList__item').on('click', function (e) {
  e.preventDefault();
  var cat = $(this).attr('globcat');

  $.ajax({
    url: '/api/',
    type: "GET",
    data: {
      category: cat,
    },
    dataType: 'json',
    success: function (data) {
      if (data.length) {
        var db = data.slice()
        console.log(db)
        // console.log(motionObj)
        // if (windowObj.width() >= 768) {
        //   motionObj.stop();
        //   motionObj.offSroll();
        // }
        // reset();
        // renderer(data);
        $('.toggleList__item.-active-').removeClass('-active-');
        $(".toggleList__item[globcat=\"".concat(cat, "\"]")).addClass('-active-');
      }
      else {
        console.log('Нет данных')
      }
    }
  });

  var text = $(this).text(); // console.log(text);
  $(".toggleBtn__text[globcat]").text(text);
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