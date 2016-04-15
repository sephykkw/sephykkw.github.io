function orient(fn1, fn2) {
	if (!window.orientation || window.orientation == 0 || window.orientation == 180) {
		$("body").attr("class", "portrait");
		orientation = 'portrait';
		fn1();
		return false;
	}
	else if (window.orientation == 90 || window.orientation == -90) {
		$("body").attr("class", "landscape");
		orientation = 'landscape';
		fn2();
		return false;
	}
}	