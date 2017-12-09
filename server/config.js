module.exports = {
	"entryPoints": {
		"/": {
			"name": "Übersicht",
			"bundles": [
				"overview.js",
				"overview-stage-1.js",
				"overview-stage-2.js",
				"overview-stage-3.js"
			],
			"headerColor": "#d68800",
			"headerHeight": 104,
			"primarySection": true
		},
		"/settings": {
			"name": "Einstellungen",
			"bundles": [
				"settings.js",
				"settings-stage-1.js",
				"settings-stage-2.js",
				"settings-stage-3.js"
			],
			"headerColor": "#00BCD4",
			"headerHeight": 50,
			"primarySection": true
		},
		"/info": {
			"name": "Info",
			"bundles": [
				"info.js"
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