function scroll_to(clicked_link, nav_height) {
	var element_class = clicked_link.attr('href').replace('#', '.');
	var scroll_to = 0;
	if(element_class != '.top-content') {
		element_class += '-container';
		scroll_to = $(element_class).offset().top - nav_height;
	}
	if($(window).scrollTop() != scroll_to) {
		$('html, body').stop().animate({scrollTop: scroll_to}, 1000);
	}
}

jQuery(document).ready(function() {
    $('a.scroll-link').on('click', function(e) {
		e.preventDefault();
		scroll_to($(this), $('nav').height());
	});
	// show/hide menu
	$('.show-menu a').on('click', function(e) {
		e.preventDefault();
		$(this).fadeOut(100, function(){ $('nav').slideDown(); });
	});
	$('.hide-menu a').on('click', function(e) {
		e.preventDefault();
		$('nav').slideUp(function(){ $('.show-menu a').fadeIn(); });
	});

});