<template>
	<v-app>
		<!-- v-app-bar -->
		<v-app-bar 
			:dark="true"
			:flat="true"
			:app="true">
			<v-toolbar-title class="headline text-uppercase">
				<span class="font-weight-light">Git Story</span>
			</v-toolbar-title>
			<v-spacer></v-spacer>
			<v-btn
				text
				@click="signIn"
				>
				<span class="mr-2">Sign in as github</span>
			</v-btn>
		</v-app-bar>

		<v-content>
			<v-btn @click="test">TEST</v-btn>
			<a href="/">test</a>
		</v-content>
	</v-app>
</template>

<script>
import axios from 'axios';
import firebase from 'firebase';

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
			let token = result.credential.accessToken;
			let user = result.user;

			console.log(this.$store);
			this.$store.commit('token', token); // 토큰 저장
			//this.$store.state.userToken = token;
		})
		.catch((err) => {
			// 로그인 실패시
			console.log(err);
		});
};

export default {
	name: 'App',
	components: {
	},
	methods: {
		signIn: signInGithub,
		test: function(e) {
			console.log(this.$store.getters.token);
			console.log(this.$store.state.userToken);
		},
	},
	data: () => ({
		//
	}),
};
</script>
