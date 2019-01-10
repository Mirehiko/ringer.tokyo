var textData = [
	{
		title: 'testTitle',
		lauch: '',
		categoty: '',
		preview: {
			type: 'image',
			src: 'images/works/deki2_2.jpg',
		},
		src: 'images/works/deki2_2.jpg',
		link: 'works.html',
	},
	{
		title: 'testTitle',
		lauch: '',
		categoty: '',
		preview: {
			type: 'image',
			src: 'images/works/deki2_4.jpg',
		},
		src: 'images/works/deki2_4.jpg',
		link: 'works.html',
	},
	{
		title: 'testTitle',
		lauch: '',
		categoty: '',
		preview: {
			type: 'image',
			src: 'images/works/deki2_6.jpg',
		},
		src: 'images/works/deki2_6.jpg',
		link: 'works.html',
	},
	{
		title: 'testTitle',
		lauch: '',
		categoty: '',
		preview: {
			type: 'image',
			src: 'images/works/deki2_8.jpg',
		},
		src: 'images/works/deki2_8.jpg',
		link: 'works.html',
	},
	{
		title: 'testTitle',
		lauch: '',
		categoty: '',
		preview: {
			type: 'image',
			src: 'images/works/victas_iamnext_03.jpg',
		},
		src: 'images/works/victas_iamnext_03.jpg',
		link: 'works.html',
	},
	{
		title: 'testTitle',
		lauch: '',
		categoty: '',
		preview: {
			type: 'image',
			src: 'images/works/iamnext.jpg',
		},
		src: 'images/works/iamnext.jpg',
		link: 'works.html',
	},
];

Array.prototype.shuffle = function() {
  for (var i = this.length - 1; i > 0; i--) {
    var num = Math.floor(Math.random() * (i + 1));
    var d = this[num];
    this[num] = this[i];
    this[i] = d;
  }
  return this;
}


$('#homePage').append(renderPage(textData));

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
	let resultLines = doubleData.concat(tripleData);
	console.log('resultLines:',resultLines)
	resultLines.shuffle(); // Задаем случайное положение
	console.log('resultLines:',resultLines)

	// Собираем данные для отрисовки
	for ( item of resultLines ) {
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
	let line = document.createElement('div');
	$(line).addClass('infirow');

	let big = document.createElement('div');
	$(big).addClass('col-8');
	$(big).append( drawItem(data[0]) );
	data.splice(0,1);

	let small = document.createElement('div');
	$(small).addClass('col-4');
	do {
		$(small).append(drawItem(data[0]));
		data.splice(0,1);
	}
	while(data.length)

	$(line).append(small);
	$(line).append(big);

	return line;
}

function obtsLine(data){
	let line = document.createElement('div');
	$(line).addClass('infirow');

	let big = document.createElement('div');
	$(big).addClass('col-8');
	$(big).append( drawItem(data[0]) );
	data.splice(0,1);

	let small = document.createElement('div');
	$(small).addClass('col-4');
	do {
		$(small).append(drawItem(data[0]));
		data.splice(0,1);
	}
	while(data.length)

	$(line).append(big);
	$(line).append(small);

	return line;
}

function tripleLine(data) {
	let line = document.createElement('div');
	$(line).addClass('infirow');

	do {
		let item = document.createElement('div');
		$(item).addClass('col-4');
		$(item).append( drawItem(data[0]) );
		$(line).append(item);
		data.splice(0,1);
	}
	while(data.length)

	return line;
}

function doubleLine(data) {
	let line = document.createElement('div');
	$(line).addClass('infirow');

	do {
		let item = document.createElement('div');
		$(item).addClass('col-6');
		$(item).append( drawItem(data[0]) );
		$(line).append(item);
		data.splice(0,1);
	}
	while(data.length)

	return line;
}

function drawItem(data) {
	let item = document.createElement('a');
	item.href = data.link;
	$(item).addClass('boxItem');

	let back = document.createElement('div');
	$(back).addClass('itemBack');
	$(back).css('background-image', 'url('+data.src+')');
	$(back).css('background-size', 'cover');
	$(back).css('background-repeat', 'no-repeat');
	$(item).append(back);

	let itemContent = document.createElement('div');
	$(itemContent).addClass('itemContent');
	$(item).append(itemContent);


	let itemTitle = document.createElement('div');
	$(itemTitle).addClass('itemTitle');
	$(itemTitle).text(data.title);
	$(itemContent).append(itemTitle);

	let itemLauchDate = document.createElement('div');
	$(itemLauchDate).addClass('itemLauchDate');
	$(itemLauchDate).text(data.lauch);
	$(itemContent).append(itemLauchDate);

	let itemCategory = document.createElement('div');
	$(itemCategory).addClass('itemCategory');
	$(itemCategory).text(data.category);
	$(itemContent).append(itemCategory);


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
