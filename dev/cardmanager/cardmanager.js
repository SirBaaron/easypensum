__USE("storagemanager.js");

class cardManager {
	constructor() {
		this.tabs = [].slice.call(document.getElementById(classid("tabhost")).childNodes);
		this.smileys = ["\(*o*)/", "(¬º-°)¬", "¯_(ツ)_/¯", "ʕ•ᴥ•ʔ", "(ᗒᗣᗕ)՞", "ヽ༼ຈل͜ຈ༽ﾉ", "ヽ(ﾟДﾟ)ﾉ", "(•̀ᴗ•́)و", "•ᴗ•", "(　＾∇＾)", "(✌ﾟ∀ﾟ)✌", "ヽ(´▽｀)ノ", "( ￣▽￣)/", "(っ˘ڡ˘ς)", "＼(☆o◎)／", "( ͡° ͜ʖ ͡°)", "（〜^∇^)〜", "- =͟͟͞͞ ( ꒪౪꒪)ฅ✧", "(o^^)o", "\(o_o)/", "(r*-*)r", "シ", "=^.^=", ":->", "(ღ˘⌣˘ღ) ♫･*:.｡. .｡.:*･", "＼(^ω^＼)", "^o^", "(●´ω｀●)", "z(°-°)/"];
		this.overview = document.getElementsByTagName("section-overview")[0];
	}

	render(data) {
		let dispatched = window.storagemanager.retrieve("dispatch", []);
		let blackList = window.storagemanager.retrieve("subjectBlackList", []);
		
		for(var key in data) {
			var index = this.tabs.map(v => {
				return v.getAttribute("name");
			}).indexOf(key);

			if(index < 0) {
				break;
			}

			data[key] = data[key].filter(card => {
				return (dispatched.indexOf(card.uuid) < 0 && blackList.indexOf(card.subjectuuid) < 0);
			});

			for(var i in data[key]) {
				let card = new entryCard(data[key][i]);
				card.style.animationDelay = (i * 3) / 100 + "s";
				this.tabs[index].appendChild(card);
			}

			if(data[key].length == 0) {
				this.tabs[index].appendChild(this.renderNoContentNotice(key));
			}
			this.overview.setButtonCount(index, data[key].length);
		}
	}

	renderNoContentNotice(name) {
		let div = document.createElement("div");
		div.className = classid("noContent");
		div.innerHTML = `Es scheint keine ${name} zu geben <font style="white-space:nowrap">${
			this.smileys[Math.floor(Math.random() * this.smileys.length)]
		}</font>`;
		return div;
	}
}

var cards = new cardManager();