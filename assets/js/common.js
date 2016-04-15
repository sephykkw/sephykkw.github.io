$(function() {
	$(window).on( 'orientationchange', function(e){
		orient();
	});
});
function orient() {
	if (window.orientation == 0 || window.orientation == 180) {
		$("body").attr("class", "portrait");
		orientation = 'portrait';
		return false;
	}
	else if (window.orientation == 90 || window.orientation == -90) {
		$("body").attr("class", "landscape");
		orientation = 'landscape';
		return false;
	}
	console.log(window.orientation);
}	