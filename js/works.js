$(document).ready(function(){
	console.log('entered');
	$('.infiniteList2').endless();
});



(function($) {
	$.fn.endless=function(options){
		var defaults = {
			direction: 'vertical',
			scrollbar: 'enable',
		};

		var content = $(this);
		var contentCopy = content.clone();
		console.log('content', content);
		console.log('contentCopy', contentCopy);

		$(this).on('scroll', function(e) {
			// e.scroll
		});
	}
})(jQuery);