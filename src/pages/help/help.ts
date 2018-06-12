import { Component, ViewChild} from '@angular/core';
import { FormControl } from '@angular/forms';
import { NavController, Content, LoadingController } from 'ionic-angular';
import { Chat } from '../chat/chat';
import { HelpCategoryProvider } from '../../providers/help-category/help-category';
import { DetailHelpAnswerQuestionPage } from '../detail-help-answer-question/detail-help-answer-question';
import { DetailHelpPage } from '../detail-help/detail-help';
import 'rxjs/add/operator/debounceTime';

//@IonicPage()
@Component({
  selector: 'page-help',
  templateUrl: 'help.html',
})
export class HelpPage {
    @ViewChild(Content) content: Content;
    
    searchTerm: string = '';
    searchControl: FormControl;
    items: any;
    itemsSearch: any;
    searching: any = false;
    contentAnswer: any = true;
    listSearching: any = false;
    toUser : {sender: string, toUserName: string, typeChat: string};
    

    constructor(public navCtrl: NavController, public dataService: HelpCategoryProvider, public loadingCtrl: LoadingController) {
        this.searchControl = new FormControl();
        this.toUser = {
            sender:'00000',
            toUserName:'BOT',
            typeChat:'chatbot',
        }
    }

    ionViewDidLoad() {
        this.setFilteredItems('loading');
        this.searchControl.valueChanges.debounceTime(700).subscribe(search => {
            this.searching = false; 
            if(this.searchTerm.length > 0){
                this.contentAnswer = false;
                this.listSearching = true;
                this.setSearchItems();
            }else{
                this.contentAnswer = true;
                this.listSearching = false;
                //this.setFilteredItems('nonLoading');
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

    setFilteredItems(type) {
        // let loading = this.loadingCtrl.create({
        //     content: 'Please wait...'
        // });
        // if(type == 'loading'){
        //     loading.present();
        // }
        return this.dataService.getDataHelpCategory().subscribe(res => {
			if(res){
                this.items = res;
                // if(type == 'loading'){
                //     loading.dismiss();
                // }
            }
		});
    }

    pushToChatbot() {
		this.navCtrl.push(Chat, this.toUser);
    }

    answerFaq(helpItem) {
        this.navCtrl.push(DetailHelpPage, {
            sub_category_id: helpItem.sub_category_id
        });
    }

    answerQuestion(helpItem) {
        this.navCtrl.push(DetailHelpAnswerQuestionPage, {
          id: helpItem.id
        });
    }
}
