function jsinject(src) {
	var el = document.createElement("script");
	el.src = src;
	document.body.appendChild(el);
}