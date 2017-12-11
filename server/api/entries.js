var db = require('./../db.js');
var klass = require('./klass.js');

findUserName = (uuid, cache = {}) => {
	return new Promise((resolve) => {
		if(uuid in cache) {
			resolve(cache[uuid]);
		}
		console.log("not in cache");
		db.query(`SELECT \`forename\` FROM users WHERE \`uuid\` = '${uuid}'`).then(res => {
			cache[uuid] = res[0].forename;
			resolve(res[0].forename);
		}).catch(err => {
			resolve("anonym");
		});
	});
}

formatEntries = async (entries, subjects, allowDispatch = false, nameMemory = {}) => {
	return new Promise(async resolve => {
		let res = [];
		for(i in entries) {
			entry = entries[i];

			let subjectuuid = entry.subject + "§" + entry.detail;

			let obj = {
				content: entry.content || "",
				date: entry.date || "",
				uuid: entry.uuid || "",
				subjectuuid: subjectuuid || "",
				allowDispatch: allowDispatch
			}

			let subjectMatch = subjects.find(v => (v.name + "§" + v.detail) == subjectuuid);

			obj.subject = subjectMatch.name || "";
			obj.detail = subjectMatch.detail || "";
			obj.color = subjectMatch.color || "";

			let creator = entry.creator || "";
			let changed = JSON.parse(entry.changed) || [];
			let created = entry.created || "";

			creator = await findUserName(creator, nameMemory);
			
			await Promise.all(changed.map(async change => {
				let real = change;
				real.user = await findUserName(change.user, nameMemory);
				return real;
			}));

			obj.interactions = {
				creator: creator,
				created: created,
				changed: changed
			}

			res.push(obj);
		}

		resolve(res);
	});
}

module.exports = {
	"access": (classuuid) => {
		return new Promise((resolve, reject) => {
						
			klass.getFields(classuuid, ["scopes", "link", "subjects"]).then(res => {
				let response = {};
				let allowDispatch = {};
				res.scopes.forEach(scope => {
					response[scope.name] = [];
					allowDispatch[scope.name] = scope.allowDispatch;
				});
				let subjects = res.subjects;

				let date = new Date();
				db.query(`SELECT subject, detail, content, date, uuid, created, creator, scope, changed FROM \`${res.link}\` WHERE date ${
					((date.getHours() < 14) ? ">= '" : "> '") + date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate()
				}' ORDER BY date ASC`).then(res => {

					res.forEach(v => {
						if(v.scope in response) {
							response[v.scope].push(v);
						}
					});

					let sharedCache = {};
					let promises = [];

					for(let i = 0; i < Object.keys(response).length; i++) {
						promises.push(formatEntries(response[Object.keys(response)[i]], subjects, allowDispatch[Object.keys(response)[i]], sharedCache));
					}

					Promise.all(promises).then(val => {
						for(let i = 0; i < val.length; i++) {
							response[Object.keys(response)[i]] = val[i];
						}
						resolve(response);
					});

				});

			}).catch(err => {
				reject(err);
			});

		});
	}
}