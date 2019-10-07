class WorkItem {
	constructor(data, type) {
		this.html;

		if (type == 'mobile') {
			this._createMobile(data);
		}
		else {
			this._create(data);
		}

		return this;
	}

	_create(data) {
		this.html = `
			<a href="33" class="boxItem" style="height: 358.119px;">
				<div class="itemWrapper">
					<div class="itemBack" style="background-image: url(&quot;/media/works/work_None/poster_gr7MYod.jpg&quot;); background-size: cover; background-repeat: no-repeat;"></div>
					<div class="itemContent">
						<div class="itemTitle withValue">Title<span>Парад олдтаймеров</span></div>
						<div class="itemLauchDate withValue">Launch<span>02 Окт, 2019</span></div>
						<div class="itemCategory withValue">Category<span> Олдтаймеры</span></div>
						<div class="itemPreview">
							<div class="itemPreview__box"></div>
							<div class="itemPreview__btn"></div>
						</div>
					</div>
				</div>
			</a>
		`;
	}

	_createMobile(data) {
		this.html = `
			<a href="${ data.link }" class="mobItem" title="Перейти к ${ data.title }">
				<img class="mobileItem__image" src="${ data.src }" alt="">
				<div class="mobItem__info">
					<h2 class="paramLine">
						<span class="paramTitle">Title</span>
						<span class="paramValue">${ data.title }</span>
					</h2>
					<div class="paramLine">
						<span class="paramTitle">Launch</span>
						<span class="paramValue">${ data.lauch }</span>
					</div>
					<div class="paramLine">
						<span class="paramTitle">Category</span>
						<span class="paramValue">${ data.category }</span>
					</div>
				</div>
			</a>`;
	}
}

class WorkList {
	constructor(data, type) {
		this.works         = data;
		this.html          = null;
		this.mobile_html   = null;
		this.desktop_html  = null;
		this.mobile_works  = [];
		this.desktop_works = [];
		this.fragment      = null;

		this._init(type);
		return this;
	}

	_init(type) {
		this.fragment = document.createDocumentFragment();
		if (type == 'mobile') {
			this._createMobile(this.works);
		}
		else {
			this._createDesktop(this.works);
		}
	}

	_createDesktop(data) {
		this.desktop_html = document.createElement('div');
	  $(this.desktop_html).addClass('infiniteBox');

	  for (var i = 0; i < data.length; i++) {
	    // $(fragment).append(new WorkItem(data[i], 'mobile').html);
			this.addWork('desktop', new WorkItem(data[i], 'desktop'));
	  }

	  $(this.desktop_html).append(this.fragment);
	  this.html = this.desktop_html;
		this.fragment = null;
	}

	_createMobile(data) {
	  this.mobile_html = document.createElement('div');
	  $(this.mobile_html).addClass('infiniteBox');

	  for (var i = 0; i < data.length; i++) {
	    // $(fragment).append(new WorkItem(data[i], 'mobile').html);
			this.addWork('mobile', new WorkItem(data[i], 'mobile'));
	  }

	  $(this.mobile_html).append(this.fragment);
	  this.html = this.mobile_html;
		this.fragment = null;
	}

	addWork(type, work) {
		if (type == 'mobile') {
			this.mobile_works.push(work);
		}
		else {
			this.desktop_works.push(work);
		}
		$(this.fragment).append(work.html);
	}
}

function selectLineType() {
	/* Выбираем рандомную комбинацию из трех элементов */
  var typeID = randomInteger(1, 3);
  var type = null;

  switch (typeID) {
    case 1: {
      return tripleLine; // 3 в ряд
      break;
    }
    case 2: {
      return tsobLine; // 2 маленьких 1 большой
      break;
    }
    case 3: {
      return obtsLine; // 1 большой 2 маленьких
      break;
    }
    default:
			return "Error";
      break;
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



var windowObj = $(window);
var work_list = null;

setView();
redrawBackgrounds();

function setView() {
	if (windowObj.width() < 768) {
		work_list = new WorkList(textData, 'mobile');
		$('#homePage').append(work_list.html);
	}
	else {
		work_list = new WorkList(textData, 'desktop');
		$('#homePage').append(work_list.html);
	}
}



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