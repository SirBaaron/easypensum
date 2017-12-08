var klass = require('./../api/klass.js');

getSettingsDBRelated = () => {
	return klass.getFields("27cfc064-714f-408d-adcd-d1747da75fc5", ["subjects", "name", "school"]).then((r) => {
		return {
			"totalSubjects": r.subjects.length,
			"className": r.name,
			"classSchool": r.school
		}
	});
}

module.exports = {
	"getSSR": () => {
		return {
			"classuuid": "27cfc064-714f-408d-adcd-d1747da75fc5"
		};
	},
	"getExtra": () => {
		return [getSettingsDBRelated()];
	}
}