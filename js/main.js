$('#header-menu').on('click', function(e) {
	e.stopPropagation();

	$('.side-header').toggleClass('open');
	$('.backlayer').toggleClass('-visible-');

	if ( $('.side-header').hasClass('open') ) {
		// console.log('open')
		$('.side-header .line.is-b').css('display', 'none');
	} else {
		// console.log('close')
		$('.side-header .line.is-b').css('display', 'block');
	}
});

$('.side-header').on('click', function(e) {
	if ( $('.side-header').hasClass('open') ) {
		// console.log('close')
		$('.side-header').removeClass('open');
		$('.backlayer').removeClass('-visible-');
		$('.side-header .line.is-b').css('display', 'block');
	}
});


