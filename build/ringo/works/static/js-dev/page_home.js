class WorkItem {
	constructor(data, type) {
		this.html;
		
		if (type == 'mobile') {
			this._createMobile(data);
		}
		else {
			this._create(data);
		}
	}

	_create(data) {
		this.html = document.createElement('div');

	}

	_createMobile(data) {
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
}
