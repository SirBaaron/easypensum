__USE("cssinject.js");

cssinject(`//<-inject:../spinner/spinneranimation.css->`);

Object.defineProperties(spinnerElement.prototype, {
	"template": {
		value: `//<-inject:../spinner/spinneranimation.html->`
	},
	"_updateColor": {
		value: function _updateColor(color) {
			this.firstChild.style.borderColor = color;
			this.firstChild.lastElementChild.style.background = color;
		}
	},
	"_updateThickness": {
		value: function _updateThickness(value) {
			this.firstChild.childNodes[0].firstChild.style.borderWidth = value + "px";
			this.firstChild.childNodes[1].firstChild.style.borderWidth = value + "px";
			this.firstChild.lastElementChild.style.height = value + "px";
		}
	},
	"_progressiveConstructor": {
		value: function _progressiveConstructor() {
			this.innerHTML = this.template;
			this._updateThickness(this.getAttribute("thickness") || 5);
		}
	}
});

[].slice.call(document.getElementsByTagName("spinner-element")).forEach(n => {
	n._progressiveConstructor();
})