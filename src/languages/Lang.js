const defaultLang = "ko";
const debugLang = "ko";
const contryCode = navigator.language.substr(0, 2);

var languagePack = null;

if ( debugLang != null ) {
	languagePack = require("./" + debugLang + ".json");
} else {
	switch ( contryCode ) {
		case "ko": languagePack = require('./ko.json'); break;
		default: languagePack = require("./" + defaultLang + ".json");
	}
}

module.exports = (key = "") => {
	let val = "Unkown";
	if ( typeof languagePack === "object" ) {
		val = languagePack[key] || "Unkown";
		val = val.replace(/\r\n/g, "<br>");
	}
	return val;
};
