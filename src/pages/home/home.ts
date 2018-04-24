import { Component } from '@angular/core';
import { NavController } from "ionic-angular";
import { AuthServiceProvider } from '../../providers/auth-service/auth-service';
import { HomeDetailPage } from '../home-detail/home-detail';
// import { AngularFireDatabase, AngularFireObject, AngularFireList } from 'angularfire2/database';
// import { Observable } from 'rxjs/Observable';
// import 'rxjs/add/operator/map';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})

export class HomePage {

	// fbName: AngularFireObject<any>;
	// //item: Observable<any>;
	// itemsRef: AngularFireList<any>;
	// items: Observable<any[]>;
	userDetails : any;
	responseData: any;
	dataSet: any;
	userPostData = {"user_id":"","token":""};
			
	constructor(
	public navCtrl: NavController,
	public authService:AuthServiceProvider,
	//public af: AngularFireDatabase
	) {
		const data = JSON.parse(localStorage.getItem('userData'));
		this.userDetails = data.userData;
		this.userPostData.user_id = this.userDetails.user_id;
		this.userPostData.token = this.userDetails.token;
		//this.getFeed();

		//test firebase
		// this.fbName = af.object('/item');
		// //this.item = this.fbName.valueChanges();
		// this.itemsRef = af.list('/messages');
		// this.items = this.itemsRef.snapshotChanges().map(changes => {
		// 	return changes.map(c => ({ key: c.payload.key, ...c.payload.val() }));
		// });
		 // Use snapshotChanges().map() to store the key
	}

	// setName(newName: string) {
	// 	this.fbName.set({ name: newName });
	// }

	// addItem(newName: string) {
	// 	this.itemsRef.push({ text: newName });
	// }
	// updateItem(key: string, newText: string) {
	// 	this.itemsRef.update(key, { text: newText });
	// }
	// deleteItem(key: string) {    
	// 	this.itemsRef.remove(key); 
	// }
	// deleteEverything() {
	// 	this.itemsRef.remove();
	// }

	// save(newName: string) {
	// 	this.itemsRef.set({ name: newName });
	// }
	// update(newSize: string) {
	// 	this.itemsRef.update({ size: newSize });
	// }
	// delete() {
	// 	this.itemsRef.remove();
	// }
 
	getFeed() {
		this.authService.postData(this.userPostData, 'feed')
		.then((result) => {
			this.responseData = result;
			if (this.responseData.feedData) {
			this.dataSet = this.responseData.feedData;
			} else {}
		}, (err) => {

		});
	}

	convertTime(created) {
		let date = new Date(created * 1000);
		return date;
	}

	getContentAcc(){
		this.navCtrl.push(HomeDetailPage, {});
	}

}
