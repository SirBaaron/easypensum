class cardManager {
	constructor() {
		this.tabHost = document.getElementById(classid("tabhost"));
	}

	render(data) {
		for(let i in data) {
			var card = new entryCard(data[i]);
			card.style.animationDelay = (i * 3) / 100 + "s";
			this.tabHost.childNodes[0].appendChild(card);
		}
	}
}

var cards = new cardManager();