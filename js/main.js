var SCREEN_RATIO = 16/9;
var maxScroll = 0;

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
	let target = $(this).attr('toggle-target');
	let toggleData = $(`.toggleContent[toggle-data="${ target }"]`);

	if ( $(this).hasClass('collapse') ) {
		$(this).removeClass('collapse');
		toggleData.animate({height: 0}, 0.5);
	} else {
		$(this).addClass('collapse');
		toggleData.animate({height: toggleData.find('.aliContent')[0].getBoundingClientRect().height+'px'}, 0.5);
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

$(window).on('resize', function(e){
	reDrawImages( $('.infiniteItem') );
});

// $('.infiniteBlock').scroll(function(e) {
// 	let scrollable = $('.infiniteList');

// 	console.log();
// 	console.log($(this).scrollLeft())

// 	// if () {
//   //
// 	// }
// });

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
