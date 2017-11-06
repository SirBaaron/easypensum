Object.defineProperties(cardManager.prototype, {
	"dispatch": {
		value: function dispatch(card) {
			console.log("dispatch ", card);
			card.remove();
			setTimeout(_ => {new Toast("Erledigt!", 1500, false, false, "Rückgängig", _ => {

			})}, 50);
		}
	}
});

document.body.setAttribute("feature-dispatch", "");