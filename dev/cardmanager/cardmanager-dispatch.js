__USE("cardmanager-insert-single.js");

__USE("storagemanager.js");

Object.defineProperties(cardManager.prototype, {
	"dispatch": {
		value: function dispatch(card) {
			let index = this.tabs.indexOf(card.parentNode);
			this.overview.setButtonCount(index, card.parentNode.childNodes.length - 1);

			if(card.parentNode.childNodes.length == 1) {
				card.parentNode.insertBefore(this.renderNoContentNotice(card.parentNode.getAttribute("name")), card.parentNode.firstChild);
			}
			card.remove();
			let tempsave = card.data;
			tempsave.scope = card.parentNode.getAttribute("name");
			window.storagemanager.arradd("dispatch", tempsave.uuid);
			new Toast("Erledigt!", 1500, false, false, "Rückgängig", _ => {
				window.storagemanager.arrremove("dispatch", tempsave.uuid);
				this.insertSingle(tempsave, tempsave.scope);
			});
		}
	}
});

document.body.setAttribute("feature-dispatch", "");