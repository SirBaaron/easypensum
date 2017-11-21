var db = require('./../db.js');
var klass = require('./klass.js');

findUserName = (uuid, cache = {}) => {
	return new Promise((resolve) => {
		if(uuid in cache) {
			resolve(cache[uuid]);
		}

		db.query(`SELECT \`forename\` FROM users WHERE \`uuid\` = '${uuid}'`).then(res => {
			cache[uuid] = res[0].forename;
			resolve(res[0].forename);
		}).catch(err => {
			resolve("anonym");
		});
	});
}

formatEntries = async (entries, subjects, nameMemory = {}) => {
	return new Promise(async resolve => {
		let res = [];
		for(i in entries) {
			entry = entries[i];
			let obj = {
				subject: entry.subject || "",
				detail: entry.detail || "",
				content: entry.content || "",
				date: entry.date || "",
				uuid: entry.uuid || ""
			}
			let creator = entry.creator || "";
			let changed = JSON.parse(entry.changed) || [];
			let created = entry.created || "";

			creator = await findUserName(creator, nameMemory);
			
			await changed.map(async change => {
				let real = change
				real.user = await findUserName(change.user, nameMemory);
				return real;
			});

			obj.interactions = {
				creator: creator,
				created: created,
				changed: changed
			}

			let color = "";
			let subjectid = obj.subject + "§" + obj.detail;
			if(subjectid in subjects) {
				color = subjects[subjectid].color
			}
			obj.color = color;

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
				res.scopes.forEach(scope => {
					response[scope.name] = [];
				});
				let subjects = {};
				res.subjects.forEach(subject => {
					subjects[subject.name + "§" + subject.detail] = {
						color: subject.color
					}
				});

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
						promises.push(formatEntries(response[Object.keys(response)[i]], subjects, sharedCache));
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