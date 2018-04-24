import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController } from 'ionic-angular';
import { CoaKategoriProvider } from '../../providers/coa-kategori/coa-kategori';

@IonicPage()
@Component({
  selector: 'page-detail-ticket',
  templateUrl: 'detail-ticket.html',
})
export class DetailTicketPage {

	idTicket: string;
	detailTicket: any;
	detailApproval: any;
	errorMessage: string;

	constructor(
		public navCtrl: NavController,
		public navParams: NavParams,
		public CoaKategoriProvider: CoaKategoriProvider,
		public loadingCtrl: LoadingController
	) {
		this.idTicket = navParams.get("idTicket");
		this.getDetailTicketById(this.idTicket);
		
	}

	ionViewDidLoad(): void {
		//this.getDetailTicketById(this.idTicket);
		//console.log('ionViewDidLoad');
	}

	getDetailTicketById(idTicket) {
		let loading = this.loadingCtrl.create({
			content: 'Please wait...'
		});
		loading.present();
		this.CoaKategoriProvider.getDetailTik(idTicket)
		.subscribe((res : any) => {
				this.detailTicket = res.detailTicket;
				this.detailApproval = res.detailApproval;
				loading.dismiss();
			},(error : any) =>{
				loading.dismiss();
				error =>  this.errorMessage = <any>error
			});
	}

	goBack() {
		console.log("popping");
		this.navCtrl.pop();
	}

}
