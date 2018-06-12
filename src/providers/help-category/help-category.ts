import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';


@Injectable()
export class HelpCategoryProvider {

  //baseURI: string  = "http://itcmobilebot.local/api/";
  baseURI: string  = 'http://8448b311.ngrok.io/api/';
  helpItems: any;
  helpItemsCategory: any;
  
  constructor(public http: Http) {
  }

  filterItems(searchTerm){
      return this.helpItems.filter((item) => {
          return item.title.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1;
      });    
  }

  getHelpItemsCategory(searchTerm) {
      return this.helpItemsCategory.filter((item) => {
          return item.title.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1;
      });  
  }

  getDataHelpCategory(): Observable<any> {
    return this.http.get(this.baseURI+"get_help_category")
		.map(res => res.json()).map(data => {
			return data;
		});
  }

  getSubDataHelpCategory(sub_category_id): Observable<any> {    
    return this.http.get(this.baseURI+"get_help_sub_category/"+sub_category_id)
		.map(res => res.json()).map(data => {
			return data;
		});
  }

  getSubSubDataHelpCategory(sub_sub_category_id): Observable<any> {
    return this.http.get(this.baseURI+"get_help_sub_sub_category/"+sub_sub_category_id)
		.map(res => res.json()).map(data => {
			return data;
		});
  }

  getAnswerQuestionHelpCategory(sub_sub_category_id): Observable<any> {
    return this.http.get(this.baseURI+"get_help_answer_question_category/"+sub_sub_category_id)
		.map(res => res.json()).map(data => {
			return data;
		});
  }

  getAllAnswerCategory(keyword): Observable<any> {
    return this.http.get(this.baseURI+"get_all_answer?keyword="+keyword)
		.map(res => res.json()).map(data => {
			return data;
		});
  }

}
