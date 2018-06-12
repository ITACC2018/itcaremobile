import { Component } from '@angular/core';
import { AlertController, NavController  } from 'ionic-angular';
import { AngularFireDatabase, AngularFireList } from 'angularfire2/database';
import { Chat } from '../chat/chat';
import {Observable} from "rxjs/Observable";
import 'rxjs/add/operator/map';

//@IonicPage()
@Component({
  selector: 'page-contact',
  templateUrl: 'contact.html'
})
export class ContactPage {
  public itemsRef: AngularFireList<any>;
  public items: Observable<any[]>;
  public toUser : {sender: string, toUserName: string, typeChat: string};
  public userDetails : any;
  public itAps: boolean;

  constructor(
	private fdb: AngularFireDatabase,
	public alerCtrl: AlertController,
	public navCtrl: NavController
  ) {
	this.toUser = {
	  sender:'00000',
	  toUserName:'BOT',
	  typeChat:'chatbot',
	}
	const data = JSON.parse(localStorage.getItem('userData'));
	this.userDetails = data.userData;
	this.itAps = false;
  }

  ionViewDidLoad() {
	
	
 	if(this.userDetails.group_id == 'IT-APS'){
		this.itemsRef = this.fdb.list('chatsTakeOver');
		this.items = this.itemsRef.snapshotChanges().map(changes => {
			return changes.map(c => ({ key: c.payload.key, ...c.payload.val() }));
		});
		this.itAps = true;
	}
  }

  doConfirm(item): void{
	let confirm = this.alerCtrl.create({
	  title: 'Info',
	  message: 'Apakah anda ingin membalas chat ini?',
	  buttons: [
		{
		  text: 'tidak',
		  handler: () => {
			console.log('Disagree clicked');
		  }
		},
		{
		  text: 'ya',
		  handler: () => {
 
			this.navCtrl.push(Chat, {
				sender: item.sender,
				toUserName: item.senderName,
				typeChat:'takeover',
			});
		  }
		}
	  ]
	});
	confirm.present()
  }



}
