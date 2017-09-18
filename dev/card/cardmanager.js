class cardManager {
	constructor() {
		this.tabs = [].slice.call(document.getElementById(classid("tabhost")).childNodes);
		this.smileys = ["\(*o*)/", "(¬º-°)¬", "¯_(ツ)_/¯", "ʕ•ᴥ•ʔ", "(ᗒᗣᗕ)՞", "ヽ༼ຈل͜ຈ༽ﾉ", "ヽ(ﾟДﾟ)ﾉ", "(•̀ᴗ•́)و", "•ᴗ•", "(　＾∇＾)", "(✌ﾟ∀ﾟ)✌", "ヽ(´▽｀)ノ", "( ￣▽￣)/", "(っ˘ڡ˘ς)", "＼(☆o◎)／", "( ͡° ͜ʖ ͡°)", "（〜^∇^)〜", "- =͟͟͞͞ ( ꒪౪꒪)ฅ✧", "(o^^)o", "\(o_o)/", "(r*-*)r", "シ", "=^.^=", ":->", "(ღ˘⌣˘ღ) ♫･*:.｡. .｡.:*･", "＼(^ω^＼)", "^o^", "(●´ω｀●)", "z(°-°)/"];
	}

	render(data) {
		for(var key in data) {
			var index = this.tabs.map(v => {
				return v.getAttribute("name");
			}).indexOf(key);

			if(index < 0) {
				break;
			}

			for(var i in data[key]) {
				let card = new entryCard(data[key][i]);
				card.style.animationDelay = (i * 3) / 100 + "s";
				this.tabs[index].appendChild(card);
			}

			if(data[key].length == 0) {
				let div = document.createElement("div");
				div.className = classid("noContent");
				div.innerHTML = `Es scheint keine ${key} zu geben ${
					this.smileys[Math.floor(Math.random() * this.smileys.length)]
				}`;
				this.tabs[index].appendChild(div);
			}
		}
	}
}

var cards = new cardManager();