__USE("cardmanager-insert-single.js");

__USE("storagemanager.js");

Object.defineProperties(cardManager.prototype, {
	"dispatch": {
		value: function dispatch(card) {
			if(card.parentNode.childNodes.length == 1) {
				card.parentNode.insertBefore(this.renderNoContentNotice(card.parentNode.getAttribute("name")), card.parentNode.firstChild);
			}
			card.remove();
			let tempsave = card.data;
			tempsave.scope = card.parentNode.getAttribute("name");
			let dispatched = window.storagemanager.retrieve("dispatch", []);
			dispatched.push(tempsave.uuid);
			window.storagemanager.set("dispatch", dispatched);
			new Toast("Erledigt!", 1500, false, false, "Rückgängig", _ => {
				dispatched.splice(dispatched.indexOf(tempsave.uuid), 1);
				window.storagemanager.set("dispatch", dispatched);
				this.insertSingle(tempsave, tempsave.scope);
			});


		}
	}
});

document.body.setAttribute("feature-dispatch", "");