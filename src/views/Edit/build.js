const fs = require('fs');

// description.txt
// <template>
// <v-content>
// toolbar.vue
// vueditor.vue
// footer.vue
// </v-content>
// </template>
// <style>
// style.css
// </style>
// <script>
// script.js
// </script>

const readFile = (path) => fs.readFileSync(path, {encoding:'utf8'});
const writeFile = (path, val) => fs.writeFileSync(path, val, {encoding:'utf8'});

var mutex = false;

const files = [
	"description.txt",
	"toolbar.vue",
	"vueditor.vue",
	"footer.vue",
	"style.css",
	"script.js"
];

fs.watch('./', (eventType, filename) => {

	if ( files.indexOf(filename) === -1 ) {
		return;
	}

	if ( eventType !== "change" ) {
		return;
	}

	console.log(filename, eventType);
	if ( mutex === true ) {
		console.log('mutex lock');
		return;
	}
	console.log('mutex', 'on');

	mutex = true;

	setTimeout(() => {
		let fileString = '';

		let desc = readFile('./description.txt');
		let toolbar = readFile('./toolbar.vue');
		let vueditor = readFile('./vueditor.vue');
		let footer = readFile('./footer.vue');
		let style = readFile('./style.css');
		let script = readFile('./script.js');

		fileString += "<!-- " + new Date().toLocaleString() + "\n";
		fileString += desc + "-->\n";

		fileString += "<template>\n";
		fileString += "\t<v-content>\n";

		let sToolbar = toolbar.split('\n');
		sToolbar.forEach(s => {
			fileString += "\t\t" + s + "\n";
		});

		let sVueditor = vueditor.split('\n');
		sVueditor.forEach(s => {
			fileString += "\t\t" + s + "\n";
		});

		let sFooter = footer.split('\n');
		sFooter.forEach(s => {
			fileString += "\t\t" + s + "\n";
		});

		fileString += "\t</v-content>\n";
		fileString += "</template>\n";

		fileString += "<style>\n";
		fileString += style + "\n";
		fileString += "</style>\n";

		fileString += "<script>\n";
		fileString += script + "\n";
		fileString += "</script>";


		writeFile('../Edit.vue', fileString);

		console.log('write done.');
		console.log('mutex off');
		mutex = false;
	}, 10);
});
