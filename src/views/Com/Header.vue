<!-- S: Header bar -->
<template>
	<!-- v-app-bar -->
	<v-app-bar 
		color="white"
		:flat="true"
		height="64px"
		style="border-bottom: 1px solid #dadada !important; z-index:10;"
		:app="true">
		<v-toolbar-title class="headline text-uppercase">
			<router-link to="#" @click.native="$assign('/')" class="font-weight-light" style="text-decoration:none; color:black;">Git Story</router-link>
			<v-app-bar-nav-icon v-if="isBlog" class="d-md-none" @click.stop="sideBarToggle()"></v-app-bar-nav-icon>
		</v-toolbar-title>
		<v-spacer></v-spacer>

		<!-- S:right menu -->
		<div v-if="isLoginCheck(true)">
			<v-btn v-if="isBlog" color="blue-grey darken-3" dark hover tile class="mr-2 d-md-none" @click.stop="$assign('/edit')">{{ $t('myblog.newpost') }}</v-btn>
			<v-menu
				v-model="menu"
				transition="slide-y-transition"
				bottom
				min-width="200px"
				:close-on-content-click="true"
				:offset-y="true">
				<!-- S:Avatar -->
				<template v-slot:activator="{ on }">
					<v-btn 
						class="mx-2 pa-0" 
						fab 
						text
						color="grey lighten-3"
						v-on="on">
						<v-avatar class="ma-0" size="50">
							<img :src="user().photoURL"/>
						</v-avatar>
					</v-btn>
				</template>
				<!-- E:Avatar -->
				<!-- S:Avatar Menu List -->
				<v-list class="text-start">
					<v-list-item @click="openNewTabUrl(github())">
						<v-list-item-content>
							<v-list-item-title>{{ user().displayName || user().name }}</v-list-item-title>
							<v-list-item-subtitle>{{ user().email }}</v-list-item-subtitle>
						</v-list-item-content>
					</v-list-item>
					<v-divider></v-divider>
					<v-list-item @click="$assign('/my-blog')" style="height:60px;">
						<v-list-item-content>
							<v-list-item-title>{{ $t('header.myblog') }}</v-list-item-title>
						</v-list-item-content>
						<v-list-item-action>
							<v-btn v-if="isBlog" @click.stop="$assign('/edit'); menu = false;" icon>
								<v-icon>mdi-border-color</v-icon>
							</v-btn>
						</v-list-item-action>
					</v-list-item>
					<v-divider></v-divider>
					<v-list-item>
						<v-list-item-content>
							<v-list-item-subtitle class="text-right">
								<v-btn text @click="logoutGithub">{{ $t('header.logout') }}</v-btn>
							</v-list-item-subtitle>
						</v-list-item-content>
					</v-list-item>
				</v-list>
				<!-- E:Avatar Menu List -->
			</v-menu>
		</div>
		<!-- S:right menu -->
		<v-btn
			text
			@click="signInGithub"
			v-else
			>
			<span class="mr-2">Sign in as github</span>
		</v-btn>
		<v-progress-linear
			:active="loading"
			:indeterminate="loading"
			absolute
			bottom
			color="cyan"
			></v-progress-linear>
	</v-app-bar>
</template>
<!-- E: Header bar -->

<script>
import { auth } from 'firebase';
import { openNewTabUrl } from '../../modules/common.js'


export default {
	name: 'Header',
	components: {
	},
	methods: {
		openNewTabUrl,
        // Github 계정으로 로그인
        signInGithub() {
            // github auth provider
            const provider = new auth.GithubAuthProvider();
            provider.addScope('user');
            provider.addScope('repo');
            provider.addScope('admin:org_hook');
            provider.addScope('delete_repo');

            // 실제 github 로그인 팝업창을 띄움
            auth().signInWithPopup(provider)
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
        },
        // 로그인 관련 Vuex 초기화. 홈으로 라우팅
        logoutGithub () {
            auth().signOut().then(() => {
                this.$store.commit('logout');
                this.$assign('/', this);
            });
        },
        // 현재 로그인이 된 상태인지 확인
        // redirect 가 true면, 비로그인 상태일 때 '/' 디렉토리로 리다이렉트
        isLoginCheck(redirect = false) {
            let isLogin = this.$store.getters.token !== null;
            if ( isLogin === false && redirect === true ) {
                this.$assign('/', this);
            }
            return isLogin;
        },
        // 현재 my-blog 페이지인지 검사
        isBlogCheck() {
            this.isBlog = this.$router.history.current.path == '/my-blog';
            return this.isBlog;
        },
        // 새 글 작성 클릭
        sideBarToggle() {
            this.$evt.$emit("sidebarToggle");
        },
	},
	created: function() {
		this.isBlogCheck();

		// browser width check
		let width = document.body.offsetWidth;
		let SMALL_CONTENT = 960;
		if ( width < SMALL_CONTENT ) {
			this.$store.commit('vMobile', true);
		} else {
			this.$store.commit('vMobile', false);
		}

		this.$evt.$on('page-loading-start', () => {
			this.loading = true;
		});
		this.$evt.$on('page-loading-end', () => {
			this.loading = false;
		});
	},
	watch: {
		'$route': 'isBlogCheck'
	},
	data() {
        return {
            user: () => this.$store.getters.user,
            github: () => this.$store.getters.github,
            isBlog: false,
            menu: false,
            loading: true,
            task: false,
        };
	},
};
</script>
