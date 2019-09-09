<!-- S: Header bar -->
<template>
	<!-- v-app-bar -->
	<v-app-bar 
		:dark="true"
		:flat="true"
		:app="true">
		<v-toolbar-title class="headline text-uppercase">
			<router-link to="/" class="font-weight-light" style="text-decoration:none; color:white;">Git Story</router-link>
		</v-toolbar-title>
		<v-spacer></v-spacer>

		<div v-if="isLogin(true)">
			<span class="body-1" style="text-transform: none;">{{ user().displayName }}</span>
			<v-menu
				transition="slide-y-transition"
				bottom
				min-width="200px"
				:close-on-content-click="true"
				:offset-y="true">
				<!-- S:Avatar -->
				<template v-slot:activator="{ on }">
					<v-btn 
						class="mx-2" 
						fab 
						outlined 
						color="grey darken-3"
						v-on="on">
						<v-avatar>
							<img :src="user().photoURL"/>
						</v-avatar>
					</v-btn>
				</template>
				<!-- E:Avatar -->
				<!-- S:Avatar Menu List -->
				<v-list class="text-start">
					<v-list-item @click="openNewTab(github())">
						<v-list-item-content>
							<v-list-item-title>{{ user().displayName }}</v-list-item-title>
							<v-list-item-subtitle>{{ user().email }}</v-list-item-subtitle>
						</v-list-item-content>
					</v-list-item>
					<v-divider></v-divider>
					<v-list-item @click="routeAssign('/my-blog')" style="height:60px;">
						<v-list-item-content>
							<v-list-item-title>내 블로그</v-list-item-title>
						</v-list-item-content>
						<v-list-item-action>
							<v-btn v-if="isBlog" @click.stop="routeAssign('/edit')" icon>
								<v-icon>mdi-border-color</v-icon>
							</v-btn>
						</v-list-item-action>
					</v-list-item>
					<v-divider></v-divider>
					<v-list-item @click="routeAssign('/edit')" style="height:60px;">
						<v-list-item-content>
							<v-list-item-title>편집기</v-list-item-title>
						</v-list-item-content>
						<v-list-item-action>
							<v-btn @click.stop="createPost" icon>
								<v-icon>mdi-border-color</v-icon>
							</v-btn>
						</v-list-item-action>
					</v-list-item>
					<v-divider></v-divider>
					<v-list-item>
						<v-list-item-content>
							<v-list-item-subtitle class="text-right">
								<v-btn text @click="logout">로그아웃</v-btn>
							</v-list-item-subtitle>
						</v-list-item-content>
					</v-list-item>
				</v-list>
				<!-- E:Avatar Menu List -->
			</v-menu>
		</div>
		<v-btn
			text
			@click="signIn"
			v-else
			>
			<span class="mr-2">Sign in as github</span>
		</v-btn>
	</v-app-bar>
</template>
<!-- E: Header bar -->

<script>
import firebase from 'firebase';
import { openNewTabUrl, routeAssignUrl } from '../../modules/common.js'

// Github 계정으로 로그인
const signInGithub = function() {
	// github auth provider
	const provider = new firebase.auth.GithubAuthProvider();
	provider.addScope('user');
	provider.addScope('repo');
	provider.addScope('admin:org_hook');
	provider.addScope('delete_repo');

	// 실제 github 로그인 팝업창을 띄움
	firebase.auth().signInWithPopup(provider)
		.then((result) => {
			// 로그인 성공시
			// eslint-disable-next-line
			console.log(result);
			this.$store.commit('login', result); // 토큰 저장
			this.$forceUpdate();
		})
		.catch(() => {
			// 로그인 실패시
		});
};

// 로그인 관련 Vuex 초기화. 홈으로 라우팅
const logoutGithub = function() {
	this.$store.commit('logout');
	routeAssignUrl('/', this);
};

// 현재 로그인이 된 상태인지 확인
// redirect 가 true면, 비로그인 상태일 때 '/' 디렉토리로 리다이렉트
const isLoginCheck = function(redirect = false) {
	let isLogin = this.$store.getters.token !== null;
	if ( isLogin === false && redirect === true ) {
		routeAssignUrl('/', this);
	}
	return isLogin;
};

// 현재 my-blog 페이지인지 검사
const isBlogCheck = function(_this) {
	let realThis = this || _this;
	if ( realThis ) {
		realThis.isBlog = realThis.$router.history.current.path == '/my-blog';
	}
}

// 새 글 작성 클릭
const createPostClick = function(/*e*/) {
};

export default {
	name: 'Header',
	components: {
	},
	methods: {
		signIn: signInGithub,
		isLogin: isLoginCheck,
		isBlogCheck: isBlogCheck,
		openNewTab: openNewTabUrl,
		routeAssign: routeAssignUrl,
		createPost: createPostClick,
		logout: logoutGithub
	},
	created: function() {
		isBlogCheck(this);
	},
	watch: {
		'$route': 'isBlogCheck'
	},
	data: () => ({
		user: function() { return this.$store.getters.user },
		github: function() { return this.$store.getters.github },
		isBlog: false
	}),
};
</script>
