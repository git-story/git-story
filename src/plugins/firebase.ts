/*
 * firebase.ts
 * Created on Mon Jun 07 2021
 *
 * Copyright (c) git-story. Licensed under the GPL 3.0 License.
 */
import axios from 'axios';

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

export class Firebase {

	private req: any;
	private token: string = '';

	constructor(private firebase: any, private baseUrl: string) {
	}

	get user() {
		return this.firebase.auth().currentUser;
	}

	get userInfo() {
		const u = this.user;
		if ( u ) {
			return u.toJSON();
		}
	}

	public async init() {
		let user: any;
		do {
			user = this.user;
			await sleep(50);
		} while ( !user );

		this.token = await this.user.getIdToken();

		this.req = axios.create({
			baseURL: this.baseUrl,
			headers: {
				authorization: this.token,
			},
		});

		return user;
	}

	// deprecated function
	public async imgur() {
		try {
			const { data } = this.req.get(`/imgur/${this.userInfo.uid}`);
			return data;
		} catch (err) {
			if ( err.response ) {
				return err.response.toJSON();
			}
		}
	}

	public signOut() {
		return this.firebase.auth().signOut();
	}

}
