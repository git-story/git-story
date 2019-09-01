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
