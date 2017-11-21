module.exports = (file, regex, replace, extra = []) => {
	return new Promise(resolve => {
		Promise.all(Object.values(replace).concat(extra)).then(values => {
			map = {};
			for(i = 0; i < values.length; i++) {
				if(i < Object.keys(replace).length) {
					map[Object.keys(replace)[i]] = values[i]
				}
				else {
					Object.assign(map, values[i]);
				}
			}

			resolve(file.replace(regex, (m, str) => {
				if(str in map) {
					return map[str];
				}
				else {
					return "";
				}
			}));

		}).catch(err => {
			console.log("some generator didn't work: ", err);
		});

	})
}