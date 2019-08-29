<!-- S: Header bar -->
<template>
	<!-- v-app-bar -->
	<v-app-bar 
		:dark="true"
		:flat="true"
		:app="true">
		<v-toolbar-title class="headline text-uppercase">
			<span class="font-weight-light">Git Story</span>
		</v-toolbar-title>
		<v-spacer></v-spacer>

		<div v-if="isLogin()">
			<span class="body-1" style="text-transform: none;">{{ user().displayName }}</span>
			<v-menu
				transition="slide-y-transition"
				bottom
				min-width="200px"
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
					<v-list-item @click="routeAssign('/my-blog')">
						<v-list-item-title>
							내 블로그
						</v-list-item-title>
					</v-list-item>
					<v-list-item @click="openNewTab(github())">
						<v-list-item-title>
							내 Github
						</v-list-item-title>
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


// 새로운 탭으로 URL 열기
const openNewTabUrl = function(url) {
	if ( typeof url === "string" ) {
		window.open(url);
	}
};

// Vue route 이동
const routeAssignUrl = function(url) {
	if ( typeof url === "string" ) {
		this.$router.push({ path: url });
	}
}

// Github 계정으로 로그인
const signInGithub = function() {
	// github auth provider
	const provider = new firebase.auth.GithubAuthProvider();
	provider.addScope('user');
	provider.addScope('repo');
	provider.addScope('admin:org_hook');

	// 실제 github 로그인 팝업창을 띄움
	firebase.auth().signInWithPopup(provider)
		.then((result) => {
			// 로그인 성공시
			this.$store.commit('login', result); // 토큰 저장
			this.$forceUpdate();
		})
		.catch(() => {
			// 로그인 실패시
		});
};

const isLoginCheck = function() {
	return this.$store.getters.token !== null;
};

export default {
	name: 'Header',
	components: {
	},
	methods: {
		signIn: signInGithub,
		isLogin: isLoginCheck,
		openNewTab: openNewTabUrl,
		routeAssign: routeAssignUrl,
	},
	data: () => ({
		user: function() { return this.$store.getters.user },
		github: function() { return this.$store.getters.github },
	}),
};
</script>
