const path = require('path');
const MonacoEditorPlugin = require('monaco-editor-webpack-plugin');

module.exports = {
	"configureWebpack": {
		"devServer": {
			"host": "0.0.0.0",
		},
		"resolve": {
			"alias": {
				"assets": path.resolve(__dirname, "src/assets"),
				"types": path.resolve(__dirname, "src/types"),
				"views": path.resolve(__dirname, "src/views"),
				"@": path.resolve(__dirname, "src"),
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
