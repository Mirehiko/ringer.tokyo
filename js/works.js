var textData = [
	{
		type: 'info',
		title: 'Work preview',
		category: 'test',
		client: 'SuperSonic Co.',
		launch: '2019.12.01',
	},
	// {
	// 	type: 'integrated_video',
	// 	// src: '<iframe frameborder="0" width="480" height="270" src="https://www.dailymotion.com/embed/video/k2vFjUZvXsWMd0s8ina" allowfullscreen allow="autoplay"></iframe>',
	// 	src: 'alsjkdjasd',
	// 	title: 'video1',
	// },
	// {
	// 	type: 'video',
	// 	src: 'images/works/victas_iamnext_03.jpg',
	// 	alt: 'image2',
	// },
	{
		type: 'image',
		src: 'images/works/iamnext.jpg',
		alt: 'image3',
	},
	{
		type: 'image',
		src: 'images/works/deki2_4.jpg',
		alt: 'image4',
	}
];

var firstID = '';
var lastID = '';


$('#workPage').append(drawContent(textData));
// redrawBackgrounds();
// checkForAdditionData();z


// $(window).on('resize', function(e) {
// 	redrawBackgrounds();
// });


function redrawBackgrounds() {
	let items = $('.boxItem');

	$.each(items, function(key, val){
		$(this).outerHeight($(this).outerWidth() / SCREEN_RATIO);
	});
}



function drawContent(data) {
	let results = document.createElement('div');
	$(results).addClass('workInfo');

	for (let item of data) {
		// if (item.type == 'info') {
		// 	$(results).append(drawInfoItem(item));
		// } else if (item.type == 'video') {
		// 	$(results).append(drawVideoItem(item));
		// } else if (item.type == 'integrated_video') {
		// 	$(results).append(drawIntegratedVideoItem(item));
		// } else {
		// 	$(results).append(drawImageItem(item));
		// }
		$(results).append(selectDrawModeAndDraw(item));
	}

	return results;
}

function drawImageItem(data) {
	let item = document.createElement('div');
	$(item).addClass('workItem');

	let img = document.createElement('img');
	$(img).addClass('workImage workContent');
	img.src = data.src;
	$(img).attr('alt', data.alt);

	$(item).append(img);

	return item;
}
function drawVideoItem(data) {
	let item = document.createElement('div');
	$(item).addClass('workItem');
	let video = document.createElement('img');
	$(item).append(video);
	return item;
}
function drawIntegratedVideoItem(data) {
	let item = document.createElement('div');
	$(item).addClass('workItem');
	$(item).append(data.src);
	return item;
}
function drawInfoItem(data) {
	let item = document.createElement('div');
	$(item).addClass('workItem');

	let workTitle = document.createElement('h1');
	$(workTitle).addClass('workTitle withValue');
	$(workTitle).text('Title');
	let workTitle__value = document.createElement('span');
	$(workTitle__value).text(data.title);
	$(workTitle).append(workTitle__value);

	let workLaunch = document.createElement('div');
	$(workLaunch).addClass('workLaunch withValue');
	$(workLaunch).text('Launch');
	let workLaunch__value = document.createElement('span');
	$(workLaunch__value).text(data.launch);
	$(workLaunch).append(workLaunch__value);

	let workCategory = document.createElement('div');
	$(workCategory).addClass('workCategory withValue');
	$(workCategory).text('Category');
	let workCategory__value = document.createElement('span');
	$(workCategory__value).text(data.category);
	$(workCategory).append(workCategory__value);

	let workClient = document.createElement('div');
	$(workClient).addClass('workClient withValue');
	$(workClient).text('Client');
	let workClient__value = document.createElement('span');
	$(workClient__value).text(data.client);
	$(workClient).append(workClient__value);

	$(item).append(workTitle);
	$(item).append(workLaunch);
	$(item).append(workCategory);
	$(item).append(workClient);


	return item;
}

function selectDrawModeAndDraw(elem) {
	let item = null;
  
	if (elem.type == 'info') {
		item = drawInfoItem(elem);
	} else if (elem.type == 'video') {
		item = drawVideoItem(elem);
	} else if (elem.type == 'integrated_video') {
		item = drawIntegratedVideoItem(elem);
	} else {
		item = drawImageItem(elem);
	}

	return item;
}

var motionObj = new Motion( $('.workInfo'), textData, {
	direction: 'left',
} );

motionObj.appendToEnd = function() {
	let elem = this.data.splice(0,1);
	let item = null;

	item = selectDrawModeAndDraw(elem[0]);
	$(item).addClass(this.hoverAction);
	this.container.append(item);

	this.data = this.data.concat(elem);
	// redrawBackgrounds();
};

motionObj.prependToStart = function() {
	let elem = this.data.splice(-1,1);
	let item = null;
  
	item = selectDrawModeAndDraw(elem[0]);
	$(item).addClass(this.hoverAction);
	this.container.prepend(item);
  
	//
	this.data = elem.concat(this.data);
}

motionObj.replaceHorizontal = function(way) {
	let first = this.container.children().first();
	let last = this.container.children().last();
	this.isCanReplace = false;
	// console.log('replaceHorizontal');
	console.log(way)
  
	if (way == 'left') {
		if ( this.isLastOnScreen() ) {
			this.appendToEnd();
			// redrawBackgrounds();
		}
  
		if ( this.isFirstLeaveScreen() ) {
			this.firstSize = first.width();
			this.removeElem(first);
			this.setPropsToFirst(this.container.children().first());
		}
  
	} else {
		if ( this.isFirstOnScreen() ) {
			this.prependToStart();
			// redrawBackgrounds();
  
			this.container.children().css('margin-'+this.needSide, 0);
			first = this.container.children().first();
			first.css('margin-'+this.needSide, this.currentMargin - first.width());
		}
  
		if ( this.isLastLeaveScreen() ) {
			this.removeElem(last);
		}
	}
  
	this.isCanReplace = true;
};

motionObj.init();
