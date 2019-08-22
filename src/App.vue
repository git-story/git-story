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
			<HelloWorld/>
		</v-content>
	</v-app>
</template>

<script>
import HelloWorld from './components/HelloWorld';
import axios from 'axios';
import firebase from 'firebase';

// Github 계정으로 로그인
const signInGithub = () => {
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
			console.log(result);
			console.log(token, user);
		})
		.catch((err) => {
			// 로그인 실패시
			console.log(err);
		});
};

export default {
	name: 'App',
	components: {
		HelloWorld,
	},
	methods: {
		signIn: signInGithub
	},
	data: () => ({
		//
	}),
};
</script>
