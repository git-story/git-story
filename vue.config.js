const path = require('path');
const MonacoEditorPlugin = require('monaco-editor-webpack-plugin');

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
		},
		"plugins": [
			new MonacoEditorPlugin({
				languages: ['json', 'yaml'],
			}),
		],
	},
	"runtimeCompiler": true,
	"transpileDependencies": [
		"vuetify"
	]
}
