import { Injectable } from '@angular/core';
import { Events } from 'ionic-angular';
import { map } from 'rxjs/operators/map';
import { HttpClient } from "@angular/common/http";
import {Observable} from "rxjs/Observable";
import { AngularFireDatabase, AngularFireList } from 'angularfire2/database';
import 'rxjs/add/operator/map';

export class ChatMessage {
	driver: string;
	messageKey: string;
	message: string;
	userId: string;
	sender: string;
	senderName: string;
	messageId: string;
	userName: string;
	userAvatar: string;
	time: string;
	status: string;
	takeOver: string;
}

export class UserInfo {
	id: string;
	name?: string;
	avatar?: string;
	typeChat?: string;
}

@Injectable()
export class ChatService {
	itemsRef: AngularFireList<any>;
	items: Observable<ChatMessage[]>;
	fbTakeOverChats: AngularFireList<any>;
	constructor(
		private fdb: AngularFireDatabase,
		private http: HttpClient,
		private events: Events) {
	this.fbTakeOverChats = fdb.list('/chatsTakeOver');
}

	mockNewMsg(msg) {
		const data = JSON.parse(localStorage.getItem('userData'));
		//console.log(data.userData);
		const mockMsg: ChatMessage = {
			driver: 'web',
			messageKey: data.userData.npk +'_00000',
			message: msg.message,
			userId: '00000',
			sender: data.userData.npk,
			senderName: data.userData.name,
			messageId: Date.now().toString(),
			userName: 'BOT',
			userAvatar: './assets/robot.jpg',
			time: new Date().toLocaleDateString() +'  '+ new Date().toLocaleTimeString(),
			status: 'success',
			takeOver: 'chatbot-success'
			
		};

		setTimeout(() => {
			this.events.publish('chat:received', mockMsg, Date.now())
		}, Math.random() * 1800)
	}

	getMsgList(): Observable<ChatMessage[]> {
		const msgListUrl = './assets/mock/msg-list.json';
		return this.http.get<any>(msgListUrl)
		  .pipe(map(response => response.array));
	}

	sendMsg(msg: ChatMessage) {
		return new Promise(resolve => setTimeout(() => resolve(msg), Math.random() * 1000))
		.then(() => this.mockNewMsg(msg));
	}

	getUserInfo(): Promise<UserInfo> {
		const data = JSON.parse(localStorage.getItem('userData'));
		const userInfo: UserInfo = {
		   id: data.userData.npk,
		   name: data.userData.name,
		   avatar: './assets/user.jpg'
		};
		return new Promise(resolve => resolve(userInfo));
	}

	getMsgListFirebase(userId: string) {  
		this.itemsRef = this.fdb.list('chats' , 
						    ref => ref.orderByChild('messageKey').equalTo(userId+'_00000')//.startAt("10169").endAt('00000')
					    );

		this.items = this.itemsRef.snapshotChanges().map(changes => {
		  return changes.map(c => ({ key: c.payload.key, ...c.payload.val() }));
		});
	    return this.items;
	}

    /**
	 * Jika dialog tdak bisa menjawab maka di ambil alih oleh manusia
	 * @param data 
	 */
	insertIntoTakeOver(data){	
		this.itemsRef = this.fdb.list('chatsTakeOver' , 
		    ref => ref.orderByChild('sender').equalTo(data.sender)//.startAt("10169").endAt('00000')
	    );
			
		this.items = this.itemsRef.snapshotChanges().map(changes => {
			return changes.map(c => ({ key: c.payload.key, ...c.payload.val() }));
		});
		
		this.items.subscribe(res => {
			  if(Object.keys(res).length === 0){
				//console.log('data masih kosong');
				this.fbTakeOverChats.push(data);
			  }else{
				Object.keys(res).forEach(function(key) {
					if (res[key].sender == data.sender) {
						console.log('exists');
					}else{
						console.log('not exist');
						this.fbTakeOverChats.push(data);
					}
				});
			  }
		});
	}

}
