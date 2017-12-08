var klass = require('./../api/klass.js');

getSubjects = () => {
	return klass.getSubjects("27cfc064-714f-408d-adcd-d1747da75fc5").then(r => {
		return {
			"subjects": JSON.stringify(r)
		}
	});
}

module.exports = {
	"getSSR": () => {
		return {};
	},
	"getExtra": () => {
		return [getSubjects()];
	}
}