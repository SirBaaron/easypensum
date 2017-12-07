class StorageManager {
	constructor() {
		this.hooks = {};
	}

	get jsonType() {
		return ["dispatch", "subjectBlackList"];
	}

	addHook(name, callback) {
		let arr = this.hooks[name] || [];
		arr.push(callback);
		this.hooks[name] = arr;
	}

	retrieve(name, defaultval = null) {
		let res = window.localStorage.getItem(name) || defaultval;
		if(this.jsonType.indexOf(name) > -1) {
			try {
				return JSON.parse(res);
			}
			catch(err) {
				return defaultval;
			}
		}
		else {
			return res;
		}
	}

	set(name, value) {
		let put = value;
		if(this.jsonType.indexOf(name) > -1) {
			put = JSON.stringify(value);
		}
		window.localStorage.setItem(name, put);
		if(name in this.hooks) {
			this.hooks[name].forEach(hook => {
				hook(put);
			});
		}
	}
}

window.storagemanager = new StorageManager();