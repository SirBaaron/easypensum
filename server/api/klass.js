var db = require('./../db.js');

module.exports = {
	"getScopes": (classuuid) => {
		return module.exports.getFields(classuuid, ["scopes"]).then(r => {
			return r.scopes;
		});
	},
	"getFields": (classuuid, fields) => {
		return new Promise((resolve, reject) => {
			db.query(`SELECT ${
				fields.map(field => `\`${field}\`, `).join("").slice(0, -2)
			} FROM \`classes\` WHERE \`uuid\` = '${classuuid}'`).then(res => {
				let raw = res[0];
				for(i in raw) {
					switch(i) {
						case "scopes":
						case "subjects":
							raw[i] = JSON.parse(raw[i]);
							break;
					}
				}
				resolve(raw);
			}).catch(err => {
				reject(err);
			})
		})
	}
}