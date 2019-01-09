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
];

function render(data) {
	let result = document.createElement
}

function addRow(data, type) {
	
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
	let item = `
		<div class="boxItem">
			<div class="itemBack"></div>
			<a href="works.html" class="itemContent">
				<p class="itemTitle"></p>
				<p class="itemLauchDate"></p>
				<p class="itemCategory"></p>
				<div class="itemPreview">
					<div class="itemPreview__box"></div>
					<div class="itemPreview__btn"></div>
				</div>
			</a>
		</div>
	`
}