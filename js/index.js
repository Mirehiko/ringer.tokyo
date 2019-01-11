var textData = [
	{
		title: 'testTitle',
		lauch: 'January',
		category: 'development',
		preview: {
			type: 'image',
			src: 'images/works/deki2_2.jpg',
		},
		src: 'images/works/deki2_2.jpg',
		link: 'works.html',
	},
	{
		title: 'testTitle',
		lauch: 'January',
		category: 'development',
		preview: {
			type: 'image',
			src: 'images/works/deki2_4.jpg',
		},
		src: 'images/works/deki2_4.jpg',
		link: 'works.html',
	},
	{
		title: 'testTitle',
		lauch: 'January',
		category: 'development',
		preview: {
			type: 'image',
			src: 'images/works/deki2_6.jpg',
		},
		src: 'images/works/deki2_6.jpg',
		link: 'works.html',
	},
	{
		title: 'testTitle',
		lauch: 'January',
		category: 'development',
		preview: {
			type: 'image',
			src: 'images/works/deki2_8.jpg',
		},
		src: 'images/works/deki2_8.jpg',
		link: 'works.html',
	},
	{
		title: 'testTitle',
		lauch: 'January',
		category: 'development',
		preview: {
			type: 'image',
			src: 'images/works/victas_iamnext_03.jpg',
		},
		src: 'images/works/victas_iamnext_03.jpg',
		link: 'works.html',
	},
	{
		title: 'testTitle',
		lauch: 'January',
		category: 'development',
		preview: {
			type: 'image',
			src: 'images/works/iamnext.jpg',
		},
		src: 'images/works/iamnext.jpg',
		link: 'works.html',
	},
];
var computedLines = [];
var renderedData = [];
Array.prototype.shuffle = function() {
  for (var i = this.length - 1; i > 0; i--) {
    var num = Math.floor(Math.random() * (i + 1));
    var d = this[num];
    this[num] = this[i];
    this[i] = d;
  }
  return this;
}

// var box =  $('.infiniteBox')[0];
// if (box.addEventListener) {
//   if ('onwheel' in document) {
//     // IE9+, FF17+, Ch31+
//     box.addEventListener("wheel", onWheel);
//   } else if ('onmousewheel' in document) {
//     // устаревший вариант события
//     box.addEventListener("mousewheel", onWheel);
//   } else {
//     // Firefox < 17
//     box.addEventListener("MozMousePixelScroll", onWheel);
//   }
// } else { // IE8-
//   box.attachEvent("onmousewheel", onWheel);
// }

// function onWheel(e) {
//   e = e || window.event;

//   // wheelDelta не дает возможность узнать количество пикселей
//   var delta = e.deltaY || e.detail || e.wheelDelta;

//   console.log(delta)

//   e.preventDefault ? e.preventDefault() : (e.returnValue = false);
// }


$('#homePage').append(renderPage(textData));
redrawBackgrounds();
checkForAdditionData();

$(window).on('resize', function(e) {
	redrawBackgrounds();
});

let semiScroll = 0;
$(window).on('scroll', function(e) {
	let box = $('.infiniteBox');
	semiScroll++;
	firstLine = $('.infirow:first-child');
	box.css('margin-top', -semiScroll)
	// let w = $(this);
	// let firstLine = $('.infirow:first-child');
	// let lastLine = $('.infirow:last-child');

	// if (w.scrollTop() > (lastLine.offset().top - w.height())) {
	// 	// footer в окне
	// 	// $('.infiniteBox').append(firstLine.clone())
	// } else {
	// 	// footer вне окна
	// }
});




function checkForAdditionData() {
	let box = $('.infiniteBox');
	let w = $(window);
	let lastLine = $('.infirow:last-child');
	// console.log(lastLine.offset().top - w.height())
	while( $('.infirow:last-child').offset().top - w.height() < 0 ) {
	// while( box.outerHeight() < w.height() ) {
		try {
			console.log('computedLines:before:', computedLines)
			let forDraw = computedLines.splice(0,1);
			if ( forDraw.length == 2 ) {
				box.append(doubleLine(forDraw));
			} else {
				box.append(forDraw[0].lineType(forDraw[0].data));
			}
			computedLines = computedLines.concat(forDraw);
			redrawBackgrounds();
			console.log('computedLines:after:', computedLines)
		} catch(e) {console.log(e)}
	}
	/*if ( box.outerHeight() < windowObj.height() ) {
		console.log('computedLines:before:', computedLines)
		let forDraw = computedLines.splice(0,1);
		if ( forDraw.length == 2 ) {
			box.append(doubleLine(forDraw));
		} else {
			box.append(forDraw[0].lineType(forDraw[0].data));
		}
		computedLines = computedLines.concat(forDraw);
		redrawBackgrounds();
		console.log('computedLines:after:', computedLines)
	}
	if ( box.outerHeight() < windowObj.height() ) {
		checkForAdditionData()
	}*/
}

function renderPage(data) {
	let tmpData = data;
	let result = document.createElement('div');
	$(result).addClass('infiniteBox');
	let linesCount = data.length;
	console.log('linesCount:',linesCount)

	// Вычисляем какие плитки будут
	let lines = calcView(linesCount);
	console.log('lines:',lines)

	// Отбираем данные для тройной плитки
	let tripleLines = lines.filter(length => length == 3);
	let tripleData = [];
	let lineTypes = [];

	if (tripleLines.length) {
		// Для линий с тремя объектами вычисляем тип плитки
		for (item of tripleLines) {
			lineTypes.push(autoSelectType())
		}
		console.log('lineTypes:',lineTypes)

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
		for (item of doubleLines) {
			doubleData.push(tmpData.splice(0, item));
		}
	}

	// Собираем все плитки воедино
	// let resultLines = doubleData.concat(tripleData);
	// console.log('resultLines:',resultLines)
	// resultLines.shuffle(); // Задаем случайное положение
	// console.log('resultLines:',resultLines)
	computedLines = doubleData.concat(tripleData);
	computedLines.shuffle(); // Задаем случайное положение
	console.log('computedLines:',computedLines)

	// Собираем данные для отрисовки
	for ( item of computedLines ) {
		console.log('line:', item)
		if ( item.length == 2 ) {
			$(result).append(doubleLine(item));
		} else {
			$(result).append(item.lineType(item.data));
		}
	}
	console.log('result:',result)


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
	$(itemLauchDate).text('Lauch');
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

