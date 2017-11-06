function cssinject(css) {
	var el = document.createElement("style");
	el.innerHTML = css;
	document.head.appendChild(el);
}