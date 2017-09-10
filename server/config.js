module.exports = {
	"entryPoints": {
		"/": {
			"name": "Übersicht",
			"bundles": [
				"overview.js",
				"overview-stage-1.js",
				"overview-stage-2.js"
			],
			"headerColor": "#d68800",
			"headerHeight": 104,
			"primarySection": true
		},
		"/info": {
			"name": "Info",
			"bundles": [

			],
			"headerColor": "#F44336",
			"headerHeight": 50,
			"primarySection": true
		},
		"/impressum": {
			"name": "Impressum",
			"bundles": [
				"impressum.js"
			],
			"headerColor": "#FF9800",
			"headerHeight": 50,
			"primarySection": false
		},
		"/datenschutz": {
			"name": "Datenschutzerklärung",
			"bundles": [
				"datenschutz.js"
			],
			"headerColor": "#CDDC39",
			"headerHeight": 50,
			"primarySection": false
		}
	}
}