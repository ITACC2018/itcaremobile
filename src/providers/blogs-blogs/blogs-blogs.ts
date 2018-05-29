import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';


/*
  Generated class for the BlogsBlogsProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class BlogsBlogsProvider {

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

  getBlog(page): Observable<any> {
    return this.http.get(this.baseURI+"list_blog?page="+page)
		.map(res => res.json()).map(data => {
			return data;
		});
  }

  getDetailBlogById(idBlog): Observable<string[]> {
		return this.http.get(this.baseURI+"get_detail_blog/"+idBlog)
		.map(this.extractData)
		.catch(this.handleError);
	}

}
