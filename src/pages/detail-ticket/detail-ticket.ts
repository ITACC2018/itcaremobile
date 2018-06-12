import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController } from 'ionic-angular';
import { CoaKategoriProvider } from '../../providers/coa-kategori/coa-kategori';

//@IonicPage()
@Component({
  selector: 'page-detail-ticket',
  templateUrl: 'detail-ticket.html',
})
export class DetailTicketPage {

	idTicket: string;
	detailTicket: any;
	detailApproval: any;
	errorMessage: string;
	loadingStatus = true;
	loading: any;

	constructor(
		public navCtrl: NavController,
		public navParams: NavParams,
		public CoaKategoriProvider: CoaKategoriProvider,
		public loadingCtrl: LoadingController
	) {
		this.createLoading('Please wait ..');
		this.idTicket = navParams.get("idTicket");
		this.getDetailTicketById(this.idTicket);
		
	}

	ionViewDidLoad(): void {
		//this.getDetailTicketById(this.idTicket);
		//console.log('ionViewDidLoad');
	}

	ionViewDidLeave() : void
	{
		this.loading.dismiss();
		this.createLoading('Please wait ..');
	}

	getDetailTicketById(idTicket) {
		this.loading.present();
		this.CoaKategoriProvider.getDetailTik(idTicket)
		.subscribe((res : any) => {
				this.detailTicket = res.detailTicket;
				this.detailApproval = res.detailApproval;
				this.loadingStatus = false;
				this.loading.dismiss();
			},(error : any) =>{
				this.loading.dismiss();
				error =>  this.errorMessage = <any>error
			});
	}

	goBack() {
		console.log("popping");
		this.navCtrl.pop();
	}

	createLoading(text) {
		this.loading = this.loadingCtrl.create({
			content: text,
			cssClass: 'detail-approval-loading'
		});
	}


}
