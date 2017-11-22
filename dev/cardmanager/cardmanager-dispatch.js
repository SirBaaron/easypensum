__USE("cardmanager-insert-single.js");

Object.defineProperties(cardManager.prototype, {
	"dispatch": {
		value: function dispatch(card) {
			card.remove();
			let tempsave = card.data;
			tempsave.scope = card.parentNode.getAttribute("name");
			console.log(tempsave);
			let dispatched = (JSON.parse(window.localStorage.getItem("dispatch"))) || [];
			dispatched.push(tempsave.uuid);
			window.localStorage.setItem("dispatch", JSON.stringify(dispatched));
			new Toast("Erledigt!", 1500, false, false, "Rückgängig", _ => {
				dispatched.splice(dispatched.indexOf(tempsave.uuid), 1);
				window.localStorage.setItem("dispatch", JSON.stringify(dispatched));
				this.insertSingle(tempsave, tempsave.scope);
			});
		}
	}
});

document.body.setAttribute("feature-dispatch", "");