import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavParams } from 'ionic-angular';
import { LoadingController, NavController, Events, Content, TextInput } from 'ionic-angular';
import { ChatService, ChatMessage, UserInfo } from "../../providers/chat-service";
import { TabsPage } from '../tabs/tabs';
import { BotmanProvider } from '../../providers/botman/botman';
import { AngularFireDatabase, AngularFireList } from 'angularfire2/database';

@IonicPage()
@Component({
	selector: 'page-chat',
	templateUrl: 'chat.html',
})
export class Chat {

	@ViewChild(Content) content: Content;
	@ViewChild('chat_input') messageInput: TextInput;
	msgList: ChatMessage[] = [];
	user: UserInfo;
	toUser: UserInfo;
	editorMsg = '';
	showEmojiPicker = false;
	resposeData : any;
	fbChats: AngularFireList<any>;
	fbTakeOver: AngularFireList<any>;
	botChat: boolean;
	takeChat: boolean;
	tabBarElement: any;
	
	constructor(
		private fdb: AngularFireDatabase,
		private Botman: BotmanProvider,
		private loadingCtrl: LoadingController,
		private navCtrl: NavController,
		private navParams: NavParams,
		private chatService: ChatService,
		private events: Events
	){
		// Get the navParams sender parameter
		this.toUser = {
			id: this.navParams.get('sender'),
			name: this.navParams.get('toUserName'),
			typeChat: this.navParams.get('typeChat')
		};
		
		if(typeof(this.toUser.id) === "undefined" || this.toUser.id === null){
			let loading = this.loadingCtrl.create({
				content: 'Please wait...'
			  });
			
			  loading.present();
			  setTimeout(() => {
				loading.dismiss();
				this.navCtrl.push(TabsPage);
			  }, 400);
		}
		// Get mock user information
		this.chatService.getUserInfo()
		.then((res) => {
			this.user = res
		}); 
		//set database firebase

		this.fbChats = this.fdb.list('/chats');

		this.botChat = false;
		this.takeChat = false;

		if(this.toUser.typeChat == 'takeover'){
			this.takeChat = true;
		}
		if(this.toUser.typeChat == 'chatbot'){
			this.botChat = true;
		}
		this.tabBarElement = document.querySelector('.tabbar.show-tabbar');
	}


	ionViewWillEnter() {
		this.tabBarElement.style.display = 'none';
	}
	 
	ionViewWillLeave() {
		this.tabBarElement.style.display = 'flex';
		this.events.unsubscribe('chat:received');
	}
	 
	takeMeBack() {
		this.navCtrl.parent.select(0);
	}

	ionViewDidEnter() {
		//this.tabBarElement.style.display = 'none';
		//get message list
		//console.log(this.user.id, this.toUser);

		//check online / ofline takeOver chat

		//delete chatsTakeOver when IT APS open chat
		if(this.toUser.typeChat == 'takeover'){
			// this.fbTakeOver.remove(key); 
			this.fbTakeOver = this.fdb.list('chatsTakeOver' , 
		    	ref => ref.orderByChild('sender').equalTo(this.toUser.id)
			   );
			this.fbTakeOver.remove().then(_ => console.log('deleted!'));
			
			this.getMsgFireBase(this.toUser.id);
		}
		if(this.toUser.typeChat == 'chatbot'){
			this.getMsgFireBase(this.user.id);
		}
		//this.getMsg();

		// Subscribe to received  new message events
		this.events.subscribe('chat:received', msg => {
			this.pushNewMsg(msg);
		})
	}

	onFocus() {
		this.showEmojiPicker = false;
		this.content.resize();
		//this.scrollToBottom();
	}

	switchEmojiPicker() {
		this.showEmojiPicker = !this.showEmojiPicker;
		if (!this.showEmojiPicker) {
			this.messageInput.setFocus();
		}
		this.content.resize();
		//this.scrollToBottom();
	}
	
    /**
	 * @name getMsg
	 * @returns {Promise<ChatMessage[]>}
	 */
    getMsgFireBase(id){
		return this.chatService.getMsgListFirebase(id).subscribe(res => {
			this.msgList = res;
			//this.scrollToBottom();
		});
	}
	/**
	 * @name getMsg
	 * @returns {Promise<ChatMessage[]>}
	 */
	// private getMsg() {
	// 	// Get mock message list
	// 	return this.chatService
	// 	.getMsgList()
	// 	.subscribe(res => {
	// 		this.msgList = res;
	// 		this.scrollToBottom();
	// 	});
	// }

	/**
	 * @name sendMsg
	 */
	sendMsg() {
		if (!this.editorMsg.trim()) return;
		
		// Mock message
		
		if(this.toUser.typeChat == 'takeover'){
			const id = Date.now().toString();
			let newMsg: ChatMessage = {
				driver: 'web',
				messageKey: this.toUser.id +'_00000',
				message: this.editorMsg.replace(/\n/ig, ''),
				userId: '00000',
				sender: this.toUser.id,
				senderName: this.toUser.name,
				messageId: Date.now().toString(),
				userName: 'BOT',
				userAvatar: this.user.avatar,
				time: new Date().toLocaleDateString() +'  '+ new Date().toLocaleTimeString(),
				status: 'success',
				takeOver: 'chatbot-success'
			};
			this.pushNewMsgTakeOver(newMsg);
			this.editorMsg = '';

			if (!this.showEmojiPicker) {
				this.messageInput.setFocus();
			}
	
			this.chatService.sendMsg(newMsg)
			.then(() => {
				let index = this.getMsgIndexById(id);
				if (index !== -1) {
					this.msgList[index].status = 'success';
				}
			})
		}
		if(this.toUser.typeChat == 'chatbot'){
			const id = Date.now().toString();
			let newMsg: ChatMessage = {
				driver: 'web',
				messageKey: this.user.id +'_00000',
				message: this.editorMsg.replace(/\n/ig, ''),
				userId: this.user.id,
				sender: this.toUser.id,
				senderName: this.toUser.name,
				messageId: Date.now().toString(),
				userName: this.user.name,
				userAvatar: this.user.avatar,
				time: new Date().toLocaleDateString() +'  '+ new Date().toLocaleTimeString(),
				status: 'success',
				takeOver: 'chatbot-success'
			};

			this.pushNewMsg(newMsg);
			this.editorMsg = '';

			if (!this.showEmojiPicker) {
				this.messageInput.setFocus();
			}
	
			this.chatService.sendMsg(newMsg)
			.then(() => {
				let index = this.getMsgIndexById(id);
				if (index !== -1) {
					this.msgList[index].status = 'success';
				}
			})
		}

	}

	/**
	 * @name pushNewMsg
	 * @param msg
	 */
	pushNewMsg(msg: ChatMessage) {
		const userId = this.user.id,
			  sender = this.toUser.id;

		if (msg.userId === userId && msg.sender === sender) {
			this.msgList.push(msg);
			console.log();
			//this.fbChats.push(msg);

		} else if (msg.sender === userId && msg.userId === sender) {
			//this.msgList.push(msg);
			this.Botman.postData(msg).then((result) =>{
				this.resposeData = result;
				if(this.resposeData.messages[0]){
					this.scrollToBottom();
					//this.fbChats.push(this.resposeData.messages[0]);
					this.msgList.push(this.resposeData.messages[0]);
					//insert into takeOver database wheen takeOver Warning
					// if(this.resposeData.messages[0].takeOver == 'chatbot-warning'){
					// 	return this.chatService.insertIntoTakeOver(msg);
					// }
				}else{
					console.log('chat not response');
				}
			}, (err) => {
				console.log('chat not response', err);
			});
		}
		//this.scrollToBottom();
	}

	/**

	 * @name pushNewMsg
	 * @param msg
	 */
	pushNewMsgTakeOver(msg: ChatMessage) {
		this.msgList.push(msg);
		//this.fbChats.push(msg);

		//this.scrollToBottom();
	}

	getMsgIndexById(id: string) {
		return this.msgList.findIndex(e => e.messageId === id)
	}

	scrollToBottom() {
		setTimeout(() => {
			if (this.content.scrollToBottom) {
				this.content.scrollToBottom(0);
			}
		}, 400)
	}

	doConfirm(type: string) {
		if(type == 'ya'){
			let newMsg: ChatMessage = {
				driver: 'web',
				messageKey: this.user.id +'_00000',
				message: 'Sabar ya.. team IT Care akan segera merespon pesan anda :)',
				userId: this.toUser.id,
				sender: this.user.id,
				senderName: this.user.name,
				messageId: Date.now().toString(),
				userName: this.toUser.name,
				userAvatar: "./assets/robot.jpg",
				time: new Date().toLocaleDateString() +'  '+ new Date().toLocaleTimeString(),
				status: 'success',
				takeOver: 'chatbot-confirm'
			};
			//console.log(newMsg);
			this.pushNewMsgTakeOver(newMsg);
			return this.chatService.insertIntoTakeOver(newMsg);
		}
		if(type == 'tidak'){
			let newMsg: ChatMessage = {
				driver: 'web',
				messageKey: this.user.id +'_00000',
				message: 'Ok..yuk chat lagi dengan mr accbot agar mr accbot tambah pintar dalam menjawab pertanyaan :)',
				userId: this.toUser.id,
				sender: this.user.id,
				senderName: this.user.name,
				messageId: Date.now().toString(),
				userName: this.toUser.name,
				userAvatar: "./assets/robot.jpg",
				time: new Date().toLocaleDateString() +'  '+ new Date().toLocaleTimeString(),
				status: 'success',
				takeOver: 'chatbot-confirm'
			};
			this.pushNewMsgTakeOver(newMsg);
		}
	}
}
