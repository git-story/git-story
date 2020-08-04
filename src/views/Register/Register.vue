<!--
 * Register.vue
 * Created on Tue Aug 04 2020
 *
 * Copyright (c) git-story. Licensed under the GPL 3.0 License.
-->
<template>
	<v-main>
		<RegisterHeader />

		<!-- S:Introduce -->
		<v-row align="center" class="mt-12 mx-0">
			<v-col cols="0" sm="1" md="2"></v-col>
			<v-col cols="0" sm="10" md="8" align="center" class="px-12">
				<p>Join GIT STORY</p>
				<h1 class="indigo--text text--darken-3" style="word-break: keep-all;">{{ $t('register.doit') }}</h1>

				<v-row align="center" class="mt-12 mx-0">
					<v-col cols="0" sm="1" md="2"></v-col>
					<v-col cols="12" sm="10" md="8">
						<v-form
							ref="from"
							lazy-validation>

							<v-row align="center" class="ma-0 mb-6">
								<v-col cols="9" class="px-0">
									<v-text-field
										v-model="form.email"
										class="mb-0"
										color="indigo"
										@keydown="form.emailAssign = false"
										spellcheck="false"
										:label="$t('register.email')"
										required></v-text-field>
								</v-col>
								<v-col cols="3" align="right" class="px-0">
									<v-btn
										:color="form.emailAssign ? 'success' : 'indigo'"
										tile
										@click="checkEmailOverlap"
										:loading="loading.email"
										:disabled="loading.email"
										:text="!form.emailAssign"
										>
										{{ $t('register.check-email') }}
									</v-btn>
								</v-col>
							</v-row>

							<v-text-field
								v-model="form.passwd"
								class="mb-3"
								color="indigo"
								type="password"
								counter
								:label="$t('register.password')"
								required></v-text-field>


							<v-text-field
								v-model="form.passwdCheck"
								class="mb-3 mt-6"
								color="indigo"
								type="password"
								counter
								:label="$t('register.password-check')"
								required></v-text-field>


							<v-btn
								v-if="!github"
								color="black"
								left
								x-large
								class="mb-6"
								@click="connectGithub"
								dark>
								<v-icon left>mdi-github</v-icon>
								{{ $t('register.connect-github') }}
							</v-btn>
							<Picture
								v-else
								:src="github.additionalUserInfo.profile.avatar_url"
								:caption="github.additionalUserInfo.profile.login" />


								<v-divider class="my-6"></v-divider>

								<v-btn
									color="indigo"
									block tile x-large
									class="mb-2"
									:loading="loading.create"
									:disabled="loading.create"
									@click="createAccount"
									dark>
									{{ $t('register.create-account') }}
								</v-btn>
								<p class="text-left overline font-weight-light" style="line-height: 1.2rem;" v-html="$t('register.agree-terms')"></p>

						</v-form>
					</v-col>
					<v-col cols="0" sm="1" md="2"></v-col>
				</v-row>
			</v-col>
			<v-col cols="0" sm="1" md="2"></v-col>
		</v-row>
		<!-- E:Introduce -->

	</v-main>
</template>
<script lang="ts">
import { Component, Mixins } from 'vue-property-decorator';
import GlobalMixins from '@/plugins/mixins';
import { Imgs } from 'types/index';
import RegisterHeader from './RegisterHeader.vue';

interface InputForm {
	email: string;
	emailAssign: boolean;
	passwd: string;
	passwdCheck: string;
}

@Component({
	components: {
		RegisterHeader,
	},
})
export default class Register extends Mixins(GlobalMixins) {
	private imgs: Imgs = {
	};

	private github: any = null;

	private loading: any = {
		email: false,
		create: false,
	};

	private form: InputForm = {
		email: '',
		emailAssign: false,
		passwd: '',
		passwdCheck: '',
	};

	private checkEmailOverlap() {
		// empty
	}

	private connectGithub() {
		// empty
	}

	private createAccount() {
		// empty
	}
}
</script>
