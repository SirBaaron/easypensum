Object.defineProperties(cardManager.prototype, {
	"insertSingle": {
		value: function insertSingle(card, scope) {
			let index = this.tabs.map(v => {
				return v.getAttribute("name");
			}).indexOf(scope);

			if(this.tabs[index].firstChild.classList == classid("noContent")) {
				this.tabs[index].removeChild(this.tabs[index].firstChild);
			}

			let cards = [].slice.call(this.tabs[index].childNodes);
			let comeBefore = this._findAddBefore(card.date, cards);
			let cardEl = new entryCard(card);
			this.tabs[index].insertBefore(cardEl, comeBefore);

			this.overview.setButtonCount(index, cardEl.parentNode.childNodes.length);

			try {
				cardEl.followingSiblings.forEach(n => {
					n.fakeMove(-55, 0, cardEl.closeAnimationDuration);
				});
			}
			catch(err) {}
		}
	},
	"_findAddBefore": {
		value: function _findAddBefore(date, cards) {
			let p = date.split(/[^0-9]/);
			let insert = new Date(p[0],p[1]-1,(p[2] || 0),(p[3] || 0),(p[4] || 0));
			for(let i = 0; i < cards.length; i++) {
				let d = cards[i].data.date.split(/[^0-9]/);
				let cardDate = new Date(d[0],d[1]-1,(d[2] || 0),(d[3] || 0),(d[4] || 0));
				if(insert.getTime() - cardDate.getTime() < 0) {
					return cards[i];
				}
			}
		}
	}
});