import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';
import { IonicPage, NavController, NavParams, LoadingController } from 'ionic-angular';
import { Chat } from '../chat/chat';
import { HelpCategoryProvider } from '../../providers/help-category/help-category';
import { DetailHelpAnswerPage } from '../detail-help-answer/detail-help-answer';
import { DetailHelpAnswerQuestionPage } from '../detail-help-answer-question/detail-help-answer-question';
import 'rxjs/add/operator/debounceTime';

@IonicPage()
@Component({
  selector: 'page-detail-help',
  templateUrl: 'detail-help.html',
})
export class DetailHelpPage {

  searchTerm: string = '';
  searchControl: FormControl;
  items: any;
  itemsSearch: any;
  searching: any = false;
  contentAnswer: any = true;
  listSearching: any = false;
  toUser : {sender: string, toUserName: string, typeChat: string};
  sub_category_id: string;
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
      this.sub_category_id = 'default';//navParams.get("sub_category_id");
  }

  ionViewDidLoad() {
    this.setFilteredItems(this.sub_category_id, 'loading');
    this.searchControl.valueChanges.debounceTime(700).subscribe(search => {
        this.searching = false;
        if(this.searchTerm.length > 0){
          this.contentAnswer = false;
          this.listSearching = true;
          this.setSearchItems();
        }else{
          this.contentAnswer = true;
          this.listSearching = false;
          //this.setFilteredItems(this.sub_category_id, 'nonLoading');
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

  setFilteredItems(sub_category_id, type) {
      // let loading = this.loadingCtrl.create({
			//   content: 'Please wait...'
      // });
      // if(type == 'loading'){
      //   loading.present();
      // }
      return this.dataService.getSubDataHelpCategory(sub_category_id).subscribe(res => {
        if(res){
          this.items = res;
          this.loadingContent = false;
          // if(type == 'loading'){
          //   loading.dismiss();
          // }
        }
      });
  }

  pushToChatbot() {
      this.navCtrl.push(Chat, this.toUser);
  }

  answerFaq(helpItem) {
    this.navCtrl.push(DetailHelpAnswerPage, {
      sub_sub_category_id: helpItem.sub_sub_category_id
    });
  }

  answerQuestion(helpItem) {
      this.navCtrl.push(DetailHelpAnswerQuestionPage, {
        id: helpItem.id
      });
  }
}
