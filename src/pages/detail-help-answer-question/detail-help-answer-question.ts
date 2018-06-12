import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';
import { NavController, NavParams, LoadingController } from 'ionic-angular';
import { Chat } from '../chat/chat';
import { HelpCategoryProvider } from '../../providers/help-category/help-category';
import 'rxjs/add/operator/debounceTime';

/**
 * Generated class for the DetailHelpAnswerPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

//@IonicPage()
@Component({
  selector: 'page-detail-help-answer-question',
  templateUrl: 'detail-help-answer-question.html',
})
export class DetailHelpAnswerQuestionPage {

  searchTerm: string = '';
  searchControl: FormControl;
  items: any;
  searching: any = false;
  listSearching: any = false;
  contentAnswer: any = true;
  toUser : {sender: string, toUserName: string, typeChat: string};
  id: string;
  question: string = '';
  answer: string = '';
  loadingContent = true;

  constructor(
    public dataService: HelpCategoryProvider,
    public navCtrl: NavController,
		public navParams: NavParams,
		public loadingCtrl: LoadingController
  ) {
      this.searchControl = new FormControl();
      this.toUser = {
        sender:'00000',
        toUserName:'BOT',
        typeChat:'chatbot',
      }
      this.id = navParams.get("id");
  }

  ionViewDidLoad() {
    this.setFilteredItems(this.id, 'loading');
    this.searchControl.valueChanges.debounceTime(700).subscribe(search => {
        this.searching = false;
        if(this.searchTerm.length > 0){
          this.contentAnswer = false;
          this.listSearching = true;
          this.setSearchItems();
        }else{
          this.contentAnswer = true;
          this.listSearching = false;
        }

    });
  }

  onSearchInput(){
      this.searching = true;
      this.contentAnswer = false;
      this.listSearching = true;
  }

  setSearchItems() {
    return this.dataService.getAllAnswerCategory(this.searchTerm).subscribe(res => {
      if(res){
        this.items = res;
      }
    });
  }

  setFilteredItems(id, type) {
    // let loading = this.loadingCtrl.create({
    //   content: 'Please wait...'
    // });
    // if(type == 'loading'){
    //   loading.present();
    // }
    this.contentAnswer = false;
    return this.dataService.getAnswerQuestionHelpCategory(id).subscribe(res => {
      if(res){        
        this.question = res[0].question_category;
        this.answer = res[0].text_label;
        this.loadingContent = false;
        this.contentAnswer = true;

        // if(type == 'loading'){
        //   loading.dismiss();
        // }       
      }
    });
}

  pushToChatbot() {
    this.navCtrl.push(Chat, this.toUser);
  }

}
