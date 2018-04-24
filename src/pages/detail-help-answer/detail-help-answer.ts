import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';
import { IonicPage, NavController, NavParams, LoadingController } from 'ionic-angular';
import { Chat } from '../chat/chat';
import { HelpCategoryProvider } from '../../providers/help-category/help-category';
import { DetailHelpAnswerQuestionPage } from '../detail-help-answer-question/detail-help-answer-question';
import 'rxjs/add/operator/debounceTime';

/**
 * Generated class for the DetailHelpAnswerPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-detail-help-answer',
  templateUrl: 'detail-help-answer.html',
})
export class DetailHelpAnswerPage {

  searchTerm: string = '';
  searchControl: FormControl;
  items: any;
  itemsSearch: any;
  searching: any = false;
  contentAnswer: any = true;
  listSearching: any = false;
  toUser : {sender: string, toUserName: string, typeChat: string};
  sub_sub_category_id: string;

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
      this.sub_sub_category_id = navParams.get("sub_sub_category_id");
  }

  ionViewDidLoad() {
    this.setFilteredItems(this.sub_sub_category_id, 'loading');
    this.searchControl.valueChanges.debounceTime(700).subscribe(search => {
        this.searching = false;
        if(this.searchTerm.length > 0){
          this.contentAnswer = false;
          this.listSearching = true;
          this.setSearchItems();
        }else{
          this.contentAnswer = true;
          this.listSearching = false;
          this.setFilteredItems(this.sub_sub_category_id, 'loading');
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
              this.itemsSearch = res;
          }
      });
  }

  setFilteredItems(sub_sub_category_id, type) {
    let loading = this.loadingCtrl.create({
      content: 'Please wait...'
    });
    if(type == 'loading'){
      loading.present();
    }
    return this.dataService.getSubSubDataHelpCategory(sub_sub_category_id).subscribe(res => {
      if(res){
        this.items = res;
        if(type == 'loading'){
          loading.dismiss();
        }
      }
    });
}

  answerFaq(helpItem) {
    this.navCtrl.push(DetailHelpAnswerQuestionPage, {
      id: helpItem.id
    });
  }


  answerQuestion(helpItem) {
      this.navCtrl.push(DetailHelpAnswerQuestionPage, {
        id: helpItem.id
      });
  }

  pushToChatbot() {
    this.navCtrl.push(Chat, this.toUser);
  }

}
