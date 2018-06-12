import { Component, ViewChild } from '@angular/core';
import { NavController, NavParams, LoadingController, Content } from 'ionic-angular';
import { CoaKategoriProvider } from '../../providers/coa-kategori/coa-kategori';
import { DetailApprovalPage } from '../detail-approval/detail-approval';
/**
 * Generated class for the NotifPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

//@IonicPage()
@Component({
  selector: 'page-notif',
  templateUrl: 'notif.html',
})
export class NotifPage {
	@ViewChild(Content) content: Content;
	/** Tracking Ticket */
	npkCrypt: string;
	data: any;
	approvalList: string[];
	errorMessage: string;
	page = 1;
	perPage = 0;
	totalData = 1;
	totalPage = 0;
	/**End Tracking Ticket */
	loadingContent = true;

	constructor(
		public navCtrl: NavController,
		public navParams: NavParams,
		public loadingCtrl: LoadingController,
		public CoaKategoriProvider: CoaKategoriProvider,
	) {
		const data = JSON.parse(localStorage.getItem('userData'));
		this.npkCrypt = data.userData.npk_crypt;
	}

	ionViewDidLoad(): void {
		console.log('ionViewDidLoad NotifPage');
	}

	ionViewWillEnter() : void
	{ 
		this.getApproval();
	}

	ionViewWillLeave() : void
	{
		this.page = 1;
	}

	getApproval() {
		// let loading = this.loadingCtrl.create({
		// 	content: 'Please wait...'
		// });
		// loading.present();
		this.CoaKategoriProvider.getApproval(this.page, this.npkCrypt)
		.subscribe((res : any) => {
				this.data = res;
				this.approvalList = this.data.data;
				this.perPage = this.data.per_page;
				this.totalData = this.data.total;
				this.totalPage = this.data.last_page;
				this.loadingContent = false;
				//loading.dismiss();
			},(error : any) =>{
				//loading.dismiss();
				this.loadingContent = false;
				error =>  this.errorMessage = <any>error
		});
	}

	doInfinite(infiniteScroll) {
		// let loading = this.loadingCtrl.create({
		// 	content: 'Please wait...'
		// });
		// loading.present();
		
		
		this.page = this.page+1;
		setTimeout(() => {
		  this.CoaKategoriProvider.getApproval(this.page, this.npkCrypt)
			.subscribe((res : any) => {
				this.data = res;
				this.perPage = this.data.per_page;
				this.totalData = this.data.total;
				this.totalPage = this.data.last_page;
				for(let i=0; i<this.data.data.length; i++) {
					this.approvalList.push(this.data.data[i]);
				}
				//loading.dismiss();
				//this.scrollToBottom();
			},(error : any) =>{
				//loading.dismiss();
				error =>  this.errorMessage = <any>error
			});
		  infiniteScroll.complete();
		}, 1000);
	}

	scrollToBottom() {
		setTimeout(() => {
			if (this.content.scrollToBottom) {
				this.content.scrollToBottom(0);
			}
		}, 600)
	}

	pushDetailApproval(approval) {
		this.navCtrl.push(DetailApprovalPage, {
			idTicket: approval.ticket_id
		});
	}

	doRefresh(refresher) {
		setTimeout(() => {
		  this.page = 1;
		  this.getApproval();
		  refresher.complete();
		}, 2000);
	}


}
