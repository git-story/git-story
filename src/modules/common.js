import EventBus from './event-bus.js';


// 태그 이름으로 하위 컴포넌트에서 가장 먼저 찾은 것을 반환.
const searchChildByTagName = (target, tagName, result) => {

	if ( result ) {
		return result;
	}
	if ( target && tagName ) {
		if ( Array.isArray(target.$children) ) {
			let childs = target.$children;
			childs.some(c => {
				if ( c.$options && c.$options._componentTag == tagName ) {
					result = c;
					return true;
				} else {
					result = searchChildByTagName(c, tagName);
				}
			});
		}
	}
	return result;
};

// refs 에 등록된 컴포넌트를 찾고, 못 찾으면 탐색
export const findChildByTagName = (target, name) => {
	let dom = target.$refs[name];
	if ( dom ) {
		return dom;
	}

	return searchChildByTagName(target, name);
};

const findRootComponent = (com) => {
	if ( com ) {
		let options = com.$options;
		if ( options ) {
			if ( !options._componentTag ) {
				return com;
			} else {
				let parent = options.parent;
				return findRootComponent(parent);
			}
		}
	}
};

// 새로운 탭으로 URL 열기
export const openNewTabUrl = function(url) {
	if ( typeof url === "string" ) {
		window.open(url);
	}
}

// 랜덤 숫자 생성
export const randomNumber = function(end, start = 0) {
	return Math.floor(Math.random() * end) + start;
}

// posts.json 에서 블로그 글 리스트를 만든다.
export const getSubposts = (obj) => {
    let rtn = [];

    let target = obj;
    if ( typeof obj.sub === "object" ) {
        target = obj.sub;
    }

    let keys = Object.keys(target);
    keys.forEach(k => {
        if ( typeof target[k] === "object" ) {
            rtn = rtn.concat(getSubposts(target[k]));                                                                                                                                               
        }
    });

    if ( Array.isArray(obj.posts) ) {
        rtn = rtn.concat(obj.posts);
    }
    return rtn;
};


/** date formating function **/
Date.prototype.format = function(f) {
	if (!this.valueOf()) return " ";

	let d = this;

	return f.replace(/(yyyy|yy|MM|dd|E|hh|mm|ss|a\/p)/gi, function($1) {
		switch ($1) {
			case "yyyy": return d.getFullYear();
			case "yy": return (d.getFullYear() % 1000).zf(2);
			case "MM": return (d.getMonth() + 1).zf(2);
			case "dd": return d.getDate().zf(2);
			case "HH": return d.getHours().zf(2);
			case "hh": return ((d.getHours() % 12) ? (d.getHours() % 12) : 12).zf(2);
			case "mm": return d.getMinutes().zf(2);
			case "ss": return d.getSeconds().zf(2);
			default: return $1;
		}
	});
};
String.prototype.string = function(len){var s = '', i = 0; while (i++ < len) { s += this; } return s;};
String.prototype.zf = function(len){return "0".string(len - this.length) + this;};
Number.prototype.zf = function(len){return this.toString().zf(len);};

export const genNowDate = function() {
	return new Date().format('yyyy-MM-dd-HH-mm-ss');
}

const searchObject = (obj, key, value, p = false) => {
    let keys = Object.keys(obj);
    let len = keys.length;

    if ( !value ) return obj;

    for ( let i=0;i<len;i++ ) {
        let k = keys[i];
        if ( k === key ) {
            if ( obj[k] == value ) {
				if ( p === true ) {
					return "parent-rtn";
				}
                return obj;
            }
        }
        if ( typeof obj[k] === "object" ) {
            let rtn = searchObject(obj[k], key, value, p);
			if ( rtn === "parent-rtn" ) {
				return obj;
			}
            if ( typeof rtn === "object" ) {
                return rtn;
            } 
        }
    }
};

export const removePost = function(post, _this = this, commit = true) {
	return new Promise((resolve, reject) => {
		let commitMsg = `📚 [GITSTORY]: ⛔ REMOVE POSTING : [${post.title}]`;

		// delete posts.json
		let posts = searchObject(_this.posts, 'href', post.href, true);
		let pidx = posts.findIndex(p => {
			if ( p.href === post.href ) return true;
		});
		if ( pidx === -1 ) {
			reject(new Error('can not find post'));	
		}

		posts.splice(pidx, 1);
		
		if (commit) {
			let gitApi = _this.$store.getters.api;
			gitApi.repo.commitFiles(commitMsg, [{
				"path": "posts.json",
				"content": _this.posts
			}]).then(() => {
				resolve(_this.posts);
			}).catch((err) => {
				reject(err);
			});
		}

	});
}

/**
 * @function getObject
 * @param {String} key
 * '.' 를 기준으로 key 하위 오브젝트를 한 번에 반환한다.
 * 특수상황 ( posts 파싱 ) 시의 예외도 둔다.
 */
export const getObject = (obj, key, midx=0, rtn = obj) => {
	if ( Array.isArray(key) ) {
		if ( rtn === undefined || key.length-midx <= 0 ) {
			if ( key.length > 0 ) {
				return {d: rtn, k: key[0]};
			}
			return rtn;
		} else {
			rtn = rtn[key.shift()];
			if ( rtn === undefined ) {
				return undefined;
			}
		}
	} else if ( typeof key === "string" ) {
		key = key.split('.');
	}
	return getObject(obj, key, midx, rtn);
};

export const mobileCheck = function() {
	let check = false;
	// eslint-disable-next-line
	(function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))) check = true;})(navigator.userAgent||navigator.vendor||window.opera);
	return check;
};
