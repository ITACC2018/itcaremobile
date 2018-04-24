import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';

export class Coa {
	public id: number;
	public name: string;
}

@Injectable()
export class CoaKategoriProvider {
	//baseURI: string  = "https://5558e4a3.ap.ngrok.io/api/";
	baseURI: string  = "http://itcmobilebot.local/api/";

	
	constructor(public http: Http) {

	}

	private extractData(res: Response) {
		let body = res.json();
		return body || { };
	}

	private handleError (error: Response | any) {
		let errMsg: string;
		if (error instanceof Response) {
			const body = error.json() || '';
			const err = body.error || JSON.stringify(body);
			errMsg = `${error.status} - ${error.statusText || ''} ${err}`;
		} else {
			errMsg = error.message ? error.message : error.toString();
		}
		console.error(errMsg);
		return Observable.throw(errMsg);
	}

	getBaseUri(){
		return this.baseURI;
	}

	getKategoriData() : Observable<Coa[]>  {
		return this.http.get(this.baseURI+"coa")
		.map(res => res.json()).map(data => {
			// var result = [];
			// for(let obj of data.result){
			//   result.push(obj.id);
			// }
			return data;
		});
	}

	getCoaDetail(id : string): Observable<any> {
		return this.http.get(this.baseURI+"coadetail/"+id)
		.map(res => res.json()).map(data => {
			return data;
		});
	}

	getTrackingTicket(page, npk): Observable<string[]> {
		return this.http.get(this.baseURI+"get_ticket/"+npk+"?page="+page)
		.map(this.extractData)
		.catch(this.handleError);
	}

	getDetailTik(idTicket): Observable<string[]> {
		return this.http.get(this.baseURI+"get_detail_ticket/"+idTicket)
		.map(this.extractData)
		.catch(this.handleError);
	}

	getDetailApp(idTicket): Observable<string[]> {
		return this.http.get(this.baseURI+"get_detail_approval/"+idTicket)
		.map(this.extractData)
		.catch(this.handleError);
	}

	getApproval(page, npk): Observable<string[]> {
		return this.http.get(this.baseURI+"get_approval/"+npk+"?page="+page)
		.map(this.extractData)
		.catch(this.handleError);
	}
}
