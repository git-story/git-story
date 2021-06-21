<!--
 * SettingContribution.vue
 * Created on Tue Jun 15 2021
 *
 * Copyright (c) git-story. Licensed under the GPL 3.0 License.
-->
<template>
	<calendar-heatmap
		:values="heatmapData"
		:endDate="today"
		:range-color="color"/>
</template>
<script lang="ts">
import { Component, Mixins } from 'vue-property-decorator';
import GlobalMixins from '@/plugins/mixins';
import { CalendarHeatmap } from 'vue-calendar-heatmap/dist/vue-calendar-heatmap.common';
import moment from 'moment';

@Component({
	components: {
		CalendarHeatmap,
	},
})
export default class SettingContribution extends Mixins(GlobalMixins) {
	public config: any = {};
	public contributions!: any;
	public heatmapData: any = [];

	public get today() {
		return moment().format('YYYY-MM-DD');
	}

	public get color() {
		return this.$vuetify.theme.dark ?
			[ '2d333b', '264252', '386d8a', '3789b3', '30b9db' ] :
			[ 'ebedf0', 'd7e8f3', '97bdd2', '449ea9', '12838a' ];
	}

	public async mounted() {
		this.$logger.debug('app', 'SettingContribution mounted');

		let user = this.$store.getters.user;
		while ( !user ) {
			user = this.$store.getters.user;
			await this.$sleep(100);
		}

		const { data } = await this.$axios({
			url: 'https://api.github.com/graphql',
			method: 'post',
			headers: {
				authorization: 'token ' + user.accessToken,
			},
			data: {
				query: `query {
					user(login: "${user.userName}") {
						name
						contributionsCollection {
							contributionCalendar {
								colors
								totalContributions
								weeks {
									contributionDays {
										color
										contributionCount
										contributionLevel
										date
										weekday
									}
									firstDay
								}
							}
						}
					}
				}`,
			},
		});

		this.contributions = data.data.user.contributionsCollection.contributionCalendar;
		this.heatmapData = this.contributions.weeks.map((week: any) => {
			return week.contributionDays.map((day: any) => {
				return {
					date: day.date,
					count: day.contributionCount,
				};
			});
		}).flat();
	}

}
</script>
