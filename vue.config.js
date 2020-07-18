const path = require('path');

module.exports = {
	"configureWebpack": {
		"devServer": {
			"host": "0.0.0.0",
		},
		"resolve": {
			"alias": {
				"assets": path.join(__dirname, "src/assets"),
				"types": path.join(__dirname, "src/types"),
				"views": path.join(__dirname, "src/views"),
				"@": path.join(__dirname, "src"),
			}
		}
	},
	"runtimeCompiler": true,
	"transpileDependencies": [
		"vuetify"
	]
}
