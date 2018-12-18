$('#header-menu').on('click', function(e) {
	$('.side-header').toggleClass('open');
	$('.backlayer').toggleClass('-visible-');

	if ( $('.side-header').hasClass('open') ) {
		console.log('open')
		$('.side-header .line.is-b').css('display', 'none');
	} else {
		console.log('close')
		$('.side-header .line.is-b').css('display', 'block');
	}
});
