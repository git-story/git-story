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

// posts.json 정보 가져오기 axios 인자 필요
export const getPostsData = function(_this = this, axios) {
	//GET /repos/:owner/:repo/contents/:path
	let userName = _this.$store.getters.user.name;
	let apiUrl = _this.$store.getters.config.api;
	let reqUrl = `${apiUrl}/repos/${userName}/${userName}.github.io/contents/posts.json`;

	return new Promise((resolve, reject) => {
		axios({
			url: reqUrl,
			method: 'get',
			headers: {
				'Authorization': `Token ${_this.$store.getters.token}`,
				'Accept': 'application/vnd.github.baptiste-preview+json'
			},
		}).then(res => {
			try {
				let data = res.data;
				let postsStr = Buffer.from(data.content, 'base64').toString('utf8');
				data.posts = JSON.parse(postsStr);
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
