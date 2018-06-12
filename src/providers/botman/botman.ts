//import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import 'rxjs/add/operator/map';

/*
	Generated class for the BotmanProvider provider.

	See https://angular.io/guide/dependency-injection for more info on providers
	and Angular DI.
*/

//let apiUrl = 'https://young-caverns-76262.herokuapp.com/botman';
let apiUrl = 'http://8448b311.ngrok.io/api/';

@Injectable()
export class BotmanProvider {

	constructor(public http: Http) {
		console.log('Hello BotmanProvider Provider');
	}

	postData(msg) {
		return new Promise((resolve, reject) => {
			let headers = new Headers();
			let form_data = new FormData();
			for ( var key in msg ) {
					form_data.append(key, msg[key]);
			}
			
			this.http.post(apiUrl, form_data, {headers: headers})
				.subscribe(res => {
					resolve(res.json());
				}, (err) => {
					reject(err);
				});
		});
	}



}
