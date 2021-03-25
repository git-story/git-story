/* tslint:disable:max-line-length */
declare global {
	interface Window {
		logLevel: number;
		logRegex: RegExp;
		logGroup: string | string[];
		logFunc: (...args: any[]) => any;
	}
}

enum LogLevel {

	CRITICAL = 'critical',
	ALERT = 'alert',
	ERROR = 'err',
	WARNNING = 'warn',
	SUCCESS = 'success',
	INFO = 'info',
	DEBUG = 'debug',

}

const COLOR: any = {

	err: '#ed4b47',
	info: '#21a4c2',
	success: '#1eb05d',
	warn: '#de8914',
	debug: '#000',

};

const CHAR: any = {

	err: '❌',
	info: '❕',
	success: '✔',
	warn: '⚠',
	debug: '🔹',

};

const level = [
	'critical',
	'alert',
	'err',
	'warn',
	'success',
	'info',
	'debug',
];

const b = (group: string = 'any', type: string, ...args: any[]) => {
	let format = `${group} - %c${CHAR[type]} `;
	const argv = [
		`color: ${COLOR[type]}`,
	].concat(args);

	for ( let i = 1; i < argv.length; i++ ) {
		const arg = argv[i];

		switch ( typeof arg ) {
			case 'number':
				format += '%d ';
				break;
			case 'string':
				format += '%s ';
				break;
			default:
				format += '%o ';
		}
	}
	return [format].concat(argv);
};

const canLogging = (group: string, type: LogLevel) => {
	const logLevel = window.logLevel || -1;

	if ( logLevel < 0 ) {
		return false;
	}

	const fdLevel = level.indexOf(type);
	if ( fdLevel >= 0 && fdLevel <= logLevel ) {

		const logGroup = window.logGroup || 'all';
		if ( logGroup === 'all' ) {
			const regex = window.logRegex;
			if ( regex ) {
				if ( !group.match(regex) ) {
					return false;
				}
			}
			return true;
		}

		if ( typeof logGroup === 'string' ) {
			if ( logGroup === group ) {
				return true;
			}
		} else if ( typeof logGroup === 'object' && Array.isArray(logGroup) ) {
			if ( logGroup.indexOf(group) >= 0 ) {
				return true;
			}
		}
	}

	return false;
};

const critical = (group: string, ...args: any[]) => canLogging(group, LogLevel.CRITICAL) && console.error (...[group, ...args]);
const alert    = (group: string, ...args: any[]) => canLogging(group, LogLevel.ALERT)    && console.warn  (...[group, ...args]);
const error    = (group: string, ...args: any[]) => canLogging(group, LogLevel.ERROR)    && window.logFunc(...b(group, LogLevel.ERROR,    ...args));
const warn     = (group: string, ...args: any[]) => canLogging(group, LogLevel.WARNNING) && window.logFunc(...b(group, LogLevel.WARNNING, ...args));
const success  = (group: string, ...args: any[]) => canLogging(group, LogLevel.SUCCESS)  && window.logFunc(...b(group, LogLevel.SUCCESS,  ...args));
const info     = (group: string, ...args: any[]) => canLogging(group, LogLevel.INFO)     && window.logFunc(...b(group, LogLevel.INFO,     ...args));
const debug    = (group: string, ...args: any[]) => canLogging(group, LogLevel.DEBUG)    && window.logFunc(...b(group, LogLevel.DEBUG,    ...args));

// debug
window.logLevel = 7;
window.logRegex = /^((?!(emit)).)*$/g;

window.logFunc = console.log;

export interface Logger {
	critical: (group: string, ...args: any[]) => void;
	alert: (group: string, ...args: any[]) => void;
	error: (group: string, ...args: any[]) => void;
	warn: (group: string, ...args: any[]) => void;
	success: (group: string, ...args: any[]) => void;
	info: (group: string, ...args: any[]) => void;
	debug: (group: string, ...args: any[]) => void;
}

export default {
	install(Vue: any) {
		Vue.prototype.$logger = {
			critical,
			alert,
			error,
			warn,
			success,
			info,
			debug,
		};
	},
	critical,
	alert,
	error,
	warn,
	success,
	info,
	debug,
};
