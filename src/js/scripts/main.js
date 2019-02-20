export var SCREEN_RATIO = 16/9;
export var maxScroll = 0;
export var WINDOW = $(window);

reDrawImages( $('.infiniteItem') );
// moveInfinate();

$('#header-menu, #hideMenu').on('click', function(e) {
	// e.stopPropagation();

	$('.side-header').toggleClass('open');
	$('.backlayer').toggleClass('-visible-');

	if ( $('.side-header').hasClass('open') ) {
		// closeIcon($('.side-header .line.is-b'));
		$('.hmenu-text').html('Close');

	} else {
		// openIcon($('.side-header .line.is-b'));
		$('.hmenu-text').html('Menu');
	}
});

$('.side-header').on('click', function(e) {
	if ( $('.side-header').hasClass('open') ) {
		$('.side-header').removeClass('open');
		$('.backlayer').removeClass('-visible-');
		$('.side-header .line.is-b').css('display', 'block');
		$('.hmenu-text').html('Menu');
	}
});

// Toggle accordeon item
$('.toggleBtn').on('click', function(e) {
	var elemItem = $(this);
	var target = elemItem.attr('toggle-target');
	var toggleData = $(`.toggleList[toggle-data="${ target }"]`);

	elemItem.find('.toggleBtn__icon').empty();
	if ( elemItem.hasClass('collapse') ) {
		elemItem.removeClass('collapse');
		toggleData.addClass('-hidden-');
		// toggleData.animate({height: 0}, 0.5);
		elemItem.find('.toggleBtn__icon').append('<i class="fas fa-caret-down"></i>');
	} else {
		elemItem.addClass('collapse');
		toggleData.removeClass('-hidden-');
		// toggleData.animate({height: '300px'}, 0.5);
		elemItem.find('.toggleBtn__icon').append('<i class="fas fa-caret-up"></i>');
	}
});

$('.iconBtnBox').on('click', function(e){
	e.stopPropagation();

	$(this).toggleClass('open');
	if ( $(this).hasClass('open') ) {
		closeIcon( $(this).find('.line.is-b') );
	} else {
		openIcon( $(this).find('.line.is-b') );
	}
});

WINDOW.on('resize', function(e){
	reDrawImages( $('.infiniteItem') );
});



function moveInfinate() {
	let mar = 0;
	setInterval( () => {
		$('.infiniteList').css('margin', mar );
		mar -= 5;
	}, 100);
}
function reDrawImages(image) {
	image.width( image.height() * SCREEN_RATIO );
}

function openIcon(icon) {
	icon.css('display', 'block');
}
function closeIcon(icon) {
	icon.css('display', 'none');
}
