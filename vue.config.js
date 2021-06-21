const path = require('path');
const MonacoEditorPlugin = require('monaco-editor-webpack-plugin');

const dist = process.env.PROD_TYPE || 'dist';

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
		"output": {
			filename: `${dist}/[name].js`,
			chunkFilename: `chunk/[name].js`,
		},
		"plugins": [
			new MonacoEditorPlugin({
				languages: ['json', 'yaml'],
			}),
		],
	},
	"outputDir": path.resolve(__dirname, dist),
	"runtimeCompiler": true,
	"transpileDependencies": [
		"vuetify"
	]
}
