var textData = [
	{
		title: 'testTitle',
		lauch: '',
		categoty: '',
		preview: {
			type: 'image',
			src: 'image/deki2_2.jpg',
		},
		src: 'image/deki2_2.jpg',
		link: 'works.html',
	},
	{
		title: 'testTitle',
		lauch: '',
		categoty: '',
		preview: {
			type: 'image',
			src: 'image/deki2_2.jpg',
		},
		src: 'image/deki2_2.jpg',
		link: 'works.html',
	},
	{
		title: 'testTitle',
		lauch: '',
		categoty: '',
		preview: {
			type: 'image',
			src: 'image/deki2_2.jpg',
		},
		src: 'image/deki2_2.jpg',
		link: 'works.html',
	},
	{
		title: 'testTitle',
		lauch: '',
		categoty: '',
		preview: {
			type: 'image',
			src: 'image/deki2_2.jpg',
		},
		src: 'image/deki2_2.jpg',
		link: 'works.html',
	},
	{},
	{},
	{},
	{},
	{},
	{},
	{},
	{},
	{},
	{},
	{},
	{},
	{},
	{},
	{},
];

renderPage(textData)

function renderPage(data) {
	let tmpData = data;
	let result = document.createElement('div');
	let linesCount = data.length;
	console.log('linesCount',linesCount)

	let lines = calcView(linesCount);
	console.log('lines',lines)

	let tripleLines = lines.filter(length => length == 3);
	console.log('tripleLines',tripleLines)
	let lineTypes = [];
	for (item of tripleLines) {
		lineTypes.push(autoSelectType())
	}
	console.log('lineTypes',lineTypes)

	let resultLines = [];
	
}

function autoSelectType() {
	let typeID = randomInteger(1,3);
	let type = null;
	switch (typeID) {
		case 1: {
			type = 'triple';
			break;
		}
		case 2: {
			type = 'tsob';
			break;
		}
		case 3: {
			type = 'obts';
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
	$(back).css('background-image', data.src);
	$(back).css('background-size', 'cover');
	$(back).css('background-repeate', 'no-repeat');
	$(item).append(back);

	let itemContent = document.createElement('div');
	$(itemContent).addClass('itemContent');
	$(item).append(itemContent);


	let itemTitle = document.createElement('div');
	$(itemTitle).addClass('itemTitle');
	$(itemContent).append(itemContent);

	let itemLauchDate = document.createElement('div');
	$(itemLauchDate).addClass('itemLauchDate');
	$(itemContent).append(itemContent);

	let itemCategory = document.createElement('div');
	$(itemCategory).addClass('itemCategory');
	$(itemContent).append(itemContent);


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
