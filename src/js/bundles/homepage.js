import '../../css/index.css';

// import defaultExport from '../scripts/jquery-mousewheel-3.1.12/jquery.mousewheel';
import { MotionGlob } from '../scripts/scrollBehaviorGlob';
import { SCREEN_RATIO, maxScroll, WINDOW } from '../scripts/main';

// console.log('MotionGlob',MotionGlob)

var computedLines = [];
var renderedData = [];
var isScrolling = false;
var homePageObj = $('#homePage');
var motionObj;

Array.prototype.shuffle = function() {
  for (var i = this.length - 1; i > 0; i--) {
    var num = Math.floor(Math.random() * (i + 1));
    var d = this[num];
    this[num] = this[i];
    this[i] = d;
  }
  return this;
}



renderer();



function renderer() {
	if ( WINDOW.width() < 768 ) {
		homePageObj.empty();
		homePageObj.append( renderMobile(textData) );
	} else {
		homePageObj.empty();
		homePageObj.append( renderPage(textData) );

    motionObj = new MotionGlob( $('#homePage'), {
      onhover: 'nothing',
      itemClass: '.boxItem',
      delayAfterHover: 2,
    	original: $('.infiniteBox')
    } );

		setTimeout(function() {motionObj.init();}, 1000)
	}
}

if ( WINDOW.width() >= 768 ) {
	redrawBackgrounds();
	checkForAdditionData();
}



WINDOW.on('resize', function(e) {
	redrawBackgrounds();
});

$('#mobileCategory>.toggleBtn').on('click', function(e) {
	let elem = $(this);
	let mobileNav = $('#mobileNav');
	console.log(mobileNav)

	if ( elem.hasClass('collapse') ) {
		mobileNav.addClass('-open-');
	} else {
		mobileNav.removeClass('-open-');
	}
});

$('.toggleList__item').on('click', function(e) {
	e.preventDefault();
	let cat = $(this).attr('globcat');
	$('.toggleList__item.-active-').removeClass('-active-');
	$(`.toggleList__item[globcat="${ cat }"]`).addClass('-active-');
	let text = $(this).text()
	console.log(text)
	$(`.toggleBtn__text[globcat]`).text(text);
})

function checkForAdditionData() {
	let box = $('.infiniteBox');
	let w = $(window);
	let lastLine = $('.infirow:last-child');

	while( $('.infirow:last-child').offset().top - w.height() < 0 ) {
		try {
			// console.log('computedLines:before:', computedLines)
			let forDraw = computedLines.splice(0,1);
			if ( forDraw.length == 2 ) {
				box.append(doubleLine(forDraw));
			} else {
				box.append(forDraw[0].lineType(forDraw[0].data));
			}
			computedLines = computedLines.concat(forDraw);
			redrawBackgrounds();
			// console.log('computedLines:after:', computedLines)
		} catch(e) {console.log(e)}
	}
}

function renderMobile(data) {
	let tmpData = data;
	let result = document.createElement('div');
	$(result).addClass('infiniteBox');

	let fragment = document.createDocumentFragment();

	for ( let item of data ) {
		$(fragment).append( mobileItem(item) );
	}

	$(result).append(fragment);

	return result;
}

function mobileItem(data) {
	return `
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

function renderPage(data) {
	let tmpData = data;
	let result = document.createElement('div');
	$(result).addClass('infiniteBox');

	let linesCount = data.length;
	// console.log('linesCount:',linesCount)

	// Вычисляем какие плитки будут
	let lines = calcView(linesCount);
	// console.log('lines:',lines)

	// Отбираем данные для тройной плитки
	let tripleLines = lines.filter(length => length == 3);
	let tripleData = [];
	let lineTypes = [];

	if (tripleLines.length) {
		// Для линий с тремя объектами вычисляем тип плитки
		for (let item of tripleLines) {
			lineTypes.push(autoSelectType())
		}
		// console.log('lineTypes:',lineTypes)

		// Отбираем данные для отображения
		for (let i = 0; i < tripleLines.length; i++ ) {
			tripleData.push({
				lineType: lineTypes[i],
				data: [].concat(tmpData.splice(0, tripleLines[i])),
			});
		}
	}

	// Отбираем данные для двойной плитки
	let doubleLines = lines.filter(length => length == 2);
	let doubleData = [];

	if ( doubleLines.length ) {
		// Отбираем данные для отображения
		for (let item of doubleLines) {
			doubleData.push({
        lineType: 'double',
        data: [].concat(tmpData.splice(0, item)),
      });
		}
	}

	// Собираем все плитки воедино
	computedLines = doubleData.concat(tripleData);
	computedLines.shuffle(); // Задаем случайное положение
	// console.log('computedLines:',computedLines)

	// Собираем данные для отрисовки
	for ( let item of computedLines ) {
		// console.log('line:', item)
		if ( item.lineType == 'double' ) {
			$(result).append(doubleLine(item.data));
		} else {
			$(result).append(item.lineType(item.data));
		}
	}
	// console.log('result:',result)


	return result;
}

function autoSelectType() {
	let typeID = randomInteger(1,3);
	let type = null;
	switch (typeID) {
		case 1: {
			type = tripleLine;
			break;
		}
		case 2: {
			type = tsobLine;
			break;
		}
		case 3: {
			type = obtsLine;
			break;
		}
		default:
			break;
	}
	return type;
}

function calcView(num) {
	let result = [];
	let count = 0;
	let lastState = 0;
	let tmp = 0;
	let c = true;
	let step = 3;

	if (num < 5) {
		step = 2;
	}

	if (num != 0 ) {
		while(c) {
			count += step;

			if (count + tmp > num) {
				tmp = num - lastState;
				count = 0;
				result = [];
			} else {
				result.push(step);
				if ( count + tmp == num ) {
					if (tmp == 1) {
						tmp = num-lastState;
						result = [];
						count = 0;
					} else {
						c = false;
					}
				}
			}

			lastState = count;
		}
	}

	if (step >= 3) {
		if ( tmp == 2 ) {
			result.push(2);
		} else if (tmp != 0) {
			for ( let i = 0; i < tmp / 2; i++) {
				result.push(2);
			}
		}
	}

	// let isCan = num % 7;
	// let cres = num / 7;
  //
	// if (isCan == 0 && cres > 3 ) {
	// 	result = calcView(num-7);
	// 	let arr = calcView(7);
	// 	result.concat( arr.slice() );
	// }

	return result;
}

function randomInteger(min, max) {
  var rand = min - 0.5 + Math.random() * (max - min + 1)
  rand = Math.round(rand);
  return rand;
}

function tsobLine(data){
	let dt = data.slice();
	let line = document.createElement('div');
	$(line).addClass('infirow');

	let big = document.createElement('div');
	$(big).addClass('col-8');
	$(big).append( drawItem(dt[0]) );
	dt.splice(0,1);

	let small = document.createElement('div');
	$(small).addClass('col-4');
	do {
		$(small).append(drawItem(dt[0]));
		dt.splice(0,1);
	}
	while(dt.length)

	$(line).append(small);
	$(line).append(big);

	return line;
}

function obtsLine(data){
	let dt = data.slice();
	let line = document.createElement('div');
	$(line).addClass('infirow');

	let big = document.createElement('div');
	$(big).addClass('col-8');
	$(big).append( drawItem(dt[0]) );
	dt.splice(0,1);

	let small = document.createElement('div');
	$(small).addClass('col-4');
	do {
		$(small).append(drawItem(dt[0]));
		dt.splice(0,1);
	}
	while(dt.length)

	$(line).append(big);
	$(line).append(small);

	return line;
}

function tripleLine(data) {
	let dt = data.slice();
	let line = document.createElement('div');
	$(line).addClass('infirow');

	do {
		let item = document.createElement('div');
		$(item).addClass('col-4');
		$(item).append( drawItem(dt[0]) );
		$(line).append(item);
		dt.splice(0,1);
	}
	while(dt.length)

	return line;
}

function doubleLine(data) {
	let dt = data.slice();
	let line = document.createElement('div');
	$(line).addClass('infirow');

	do {
		let item = document.createElement('div');
		$(item).addClass('col-6');
		$(item).append( drawItem(dt[0]) );
		$(line).append(item);
		dt.splice(0,1);
	}
	while(dt.length)

	return line;
}

function redrawBackgrounds() {
	let items = $('.boxItem');

	$.each(items, function(key, val){
		$(this).outerHeight($(this).outerWidth() / SCREEN_RATIO);
	});
}

function drawItem(data) {
	let item = document.createElement('a');
	item.href = data.link;
	$(item).addClass('boxItem');

	let wrapper = document.createElement('div');
	$(wrapper).addClass('itemWrapper');
	$(item).append(wrapper);


	let back = document.createElement('div');
	$(back).addClass('itemBack');
	$(back).css('background-image', 'url('+data.src+')');
	$(back).css('background-size', 'cover');
	$(back).css('background-repeat', 'no-repeat');
	$(wrapper).append(back);

	let itemContent = document.createElement('div');
	$(itemContent).addClass('itemContent');
	$(wrapper).append(itemContent);


	let itemTitle = document.createElement('div');
	$(itemTitle).addClass('itemTitle withValue');
	$(itemTitle).text('Title');
	$(itemContent).append(itemTitle);
	let itemTitle__value = document.createElement('span');
	$(itemTitle__value).text(data.title);
	$(itemTitle).append(itemTitle__value);

	let itemLauchDate = document.createElement('div');
	$(itemLauchDate).addClass('itemLauchDate withValue');
	$(itemLauchDate).text('Launch');
	$(itemContent).append(itemLauchDate);
	let itemLauch__value = document.createElement('span');
	$(itemLauch__value).text(data.lauch);
	$(itemLauchDate).append(itemLauch__value);

	let itemCategory = document.createElement('div');
	$(itemCategory).addClass('itemCategory withValue');
	$(itemCategory).text('Category');
	$(itemContent).append(itemCategory);
	let itemCategory__value = document.createElement('span');
	$(itemCategory__value).text(data.category);
	$(itemCategory).append(itemCategory__value);

	let previewBlock = document.createElement('div');
	$(previewBlock).addClass('itemPreview');
	$(itemContent).append(previewBlock);

	let previewContent = document.createElement('div');
	$(previewContent).addClass('itemPreview__box');
	$(previewBlock).append(previewContent);

	let btn = document.createElement('div');
	$(btn).addClass('itemPreview__btn');
	$(previewBlock).append(btn);


	return item;
}
