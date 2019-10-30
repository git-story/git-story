// 태그 이름으로 하위 컴포넌트에서 가장 먼저 찾은 것을 반환.
export const findChildByTagName = (target, tagName, result) => {
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
					result = findChildByTagName(c, tagName);
				}
			});
		}
	}
	return result;
}

// Vue route 이동
export const routeAssignUrl = function(url, _this) {
	let router = (this && this.$router) || (_this && _this.$router);
	if ( typeof url === "string" && router ) {
		if ( router.history.current.path !== url ) {
			router.push({ path: url });
		}
	}
}

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

export const getGitData = function(_this = this, axios, path="") {
	//GET /repos/:owner/:repo/contents/:path
	let userName = _this.$store.getters.user.name;
	let apiUrl = _this.$store.getters.config.api;
	let reqUrl = `${apiUrl}/repos/${userName}/${userName}.github.io/contents/${path}`;

	return new Promise((resolve, reject) => {
		axios({
			url: reqUrl,
			method: 'get',
			headers: {
				'Authorization': `Token ${_this.$store.getters.token}`,
				'Accept': 'application/vnd.github.baptiste-preview+json'
			},
		}).then(res => {
			let data = res.data;
			data.decodeData = Buffer.from(data.content, 'base64').toString('utf8');
			resolve(data);
		}).catch(err => {
			reject(err);
		});
	});
}

// posts.json 정보 가져오기 axios 인자 필요
export const getGitJsonData = function(_this = this, axios, path="") {
	//GET /repos/:owner/:repo/contents/:path
	return new Promise((resolve, reject) => {
		getGitData(_this, axios, path).then(data => {
			try {
				data.json = JSON.parse(data.decodeData);
				resolve(data);
			}catch(err) {
				reject(err);
			}
		}).catch(err => {
			reject(err);
		});
	});
}


// posts.json 에서 블로그 글 리스트를 만든다.
export const getSubposts = (obj) => {
	let rtn = [];
	if ( Array.isArray(obj.posts) ) {
		return obj.posts;
	}

	let target = obj;
	if ( typeof obj.posts === "object" ) {
		target = obj.posts;
	}

	let keys = Object.keys(target);
	keys.forEach(k => {
		if ( typeof target[k] === "object" ) {
			rtn = rtn.concat(getSubposts(target[k]));
		}
	});
	return rtn;
}


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

// 레포지토리 삭제. "유저/레포지토리" 형식으로 매개변수를 받음 그리고 store 정보를 받음
export const removeRepository = function(repoFullPath, store, axios) {
	return new Promise((resolve, reject) => {
		if ( repoFullPath && store ) {
			axios({
				url: `${store.getters.config.api}/repos/${repoFullPath}`,
				method: 'delete',
				headers: {
					'Authorization': `Token ${store.getters.token}`
				}
			}).then(res => {
				if ( res.status === 204 ) {
					resolve();
				} else {
					reject();
				}
			}).catch(err => {
				reject(err);
			});
		} else {
			reject();
		}
	});
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

export const removePost = function(post, axios, _this = this) {
	return new Promise((resolve, reject) => {
		let user = _this.$store.getters.user;
		let config = _this.$store.getters.config;
		//let url = post.href.replace(/\/$/, "");
		let apiUrl = `${config.api}/repos/${user.name}/${user.name}.github.io/contents`;
		let commitMsg = `[GITSTORY]: ${new Date().toLocaleString()} ${post.title} posting remove.`;


		// delete posts.json
		let posts = searchObject(_this.posts, 'href', post.href, true);
		let pidx = posts.findIndex(p => {
			if ( p.href === post.href ) return true;
		});
		if ( pidx === -1 ) {
			reject(new Error('can not find post'));	
		}
		posts.splice(pidx, 1);

		let postsString = JSON.stringify(_this.posts, null, '\t');
		let postsBase64 = Buffer.from(postsString, 'utf8').toString('base64');

		axios({
			url: `${apiUrl}/posts.json`,
			method: 'put',
			headers: {
				'Authorization': `Token ${_this.$store.getters.token}`,
			},
			data: {
				'message': commitMsg,
				'content': postsBase64,
				'sha': _this.posts.sha
			}
		}).then(res => {
			resolve(res);
			/* 파일 백업 차원으로, posts.json 에서만 지워서 글이 보이지 않게끔 만든다.
			// get in directory files
			let reqUrl = `${config.api}/repos/${user.name}/${user.name}.github.io/contents${url}`;
			axios({
				url: reqUrl,
				method: 'get',
				headers: {
					'Authorization': `Token ${this.$store.getters.token}`,
				}
			}).then(res => {
				// 이미 posts.json 에서 지웠기 때문에 파일이 남아있어도 상관 없음.
				// 삭제요청만 시행하고 결과는 상관 안 함.
				res.forEach(file => {
					let reqUrl_d = reqUrl+"/"+file.name;
					if ( file.type === "file" ) {
						axios({
							url: reqUrl_d,
							method: 'delete',
							headers: {
								'Authorization': `Token ${this.$store.getters.token}`,
							},
							data: {
								message: commitMsg,
								sha: file.sha
							}
						}).catch(() => {});
					} else {
						// TODO: 디렉토리일 때 하위 파일까지 탐색하여 지울 필요가 있음.
					}
				});
			}).catch(reject);
			*/
		});
	});
}

