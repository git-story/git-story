
type LocalReturnType = string|undefined|Record<string, unknown>|null;

const localRead = <T extends object>(key: string, convert?: (s: string) => T): T|LocalReturnType => {
	if ( typeof window.localStorage !== 'undefined' ) {
		let ret: T|LocalReturnType = window.localStorage.getItem(`GS_${key}`);

		if ( !ret ) {
			return;
		}

		if ( typeof convert === 'function' ) {
			ret = convert(ret) as T;
		}

		return ret;
	} else {
		console.error('Do not support localStorage');
	}
};

const localWrite = (key: string, val: any): void => {
	if ( typeof window.localStorage !== 'undefined' ) {
		switch ( typeof val ) {
			case 'object':
				val = JSON.stringify(val);
				break;
			default:
				val = val.toString();
		}

		window.localStorage.setItem(`GS_${key}`, val as string);
	} else {
		console.error('Do not support localStorage');
	}
};

export interface Local {
	read: <T extends object>(key: string, type: (s: string) => T) => T|LocalReturnType;
	write: (key: string, val: any) => void;
}

export default {
	install(Vue) {
		Vue.prototype.$local = {
			read: localRead,
			write: localWrite,
		};
	},
	read: localRead,
	write: localWrite,
};
