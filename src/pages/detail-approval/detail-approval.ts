import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController, AlertController } from 'ionic-angular';
import { CoaKategoriProvider } from '../../providers/coa-kategori/coa-kategori';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';

/**
 * Generated class for the DetailApprovalPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

//@IonicPage()
@Component({
  selector: 'page-detail-approval',
  templateUrl: 'detail-approval.html',
})
export class DetailApprovalPage {

	form: FormGroup;
	formApp: any;
	idTicket: string;
	npkUserId: string;
	groupId: string;
	detailTicket: any;
	flexibleInput: any;
	detailApproval: any;
	errorMessage: string;
	loadingStatus = true;
	private loading;
	baseURI: string;

	constructor(
		public navCtrl : NavController,
		public navParams : NavParams,
		public CoaKategoriProvider : CoaKategoriProvider,
		public loadingCtrl : LoadingController,
		public fb : FormBuilder,
		public http       : HttpClient,
		public alertCtrl  : AlertController
	) {
		const data = JSON.parse(localStorage.getItem('userData'));
		this.idTicket = navParams.get("idTicket");
		this.npkUserId = data.userData.npk;
		this.groupId = data.userData.group_id;
		this.getDetailApprovalById(this.idTicket);
		this.baseURI = this.CoaKategoriProvider.getBaseUri();
		this.formApp = {
				groupId					  : [""],
			    npkUserId				  : [""],
				ticketID                  : ["", Validators.required],
				optResponse               : ["", Validators.required],
				inputDescription          : [""]
		}
		this.form = this.fb.group(this.formApp);
		this.form.controls.ticketID.setValue(this.idTicket);
		this.form.controls.npkUserId.setValue(this.npkUserId);
		this.form.controls.groupId.setValue(this.groupId);
	}

	ionViewDidLoad(): void {
		//this.getDetailTicketById(this.idTicket);
		//console.log('ionViewDidLoad');
	}

	ionViewDidLeave() : void
	{

	}

	getDetailApprovalById(idTicket) {
		this.loading = this.loadingCtrl.create({
			content: 'Please wait ..',
			cssClass: 'detail-approval-loading'
		});

		this.loading.present();
		this.CoaKategoriProvider.getDetailApp(idTicket)
		.subscribe((res : any) => {
				this.detailTicket = res.detailTicket;
        		this.flexibleInput = res.flexibleInput;
				this.detailApproval = res.detailApproval;
				this.loadingStatus = false;
				this.loading.dismiss();
			},(error : any) =>{
				this.loading.dismiss();
				error =>  this.errorMessage = <any>error
			});
  }

  
	saveTicket({ value, valid }: { value: DetailApprovalForm, valid: boolean }) {  
		if (valid) {
			this.loading = this.loadingCtrl.create({
				content: 'Please wait ..',
				cssClass: 'detail-approval-loading'
			});
	
			this.loading.present();

			this.CoaKategoriProvider.getBaseUri();
			let headers 	: any		= new HttpHeaders({ 'Content-Type': 'application/json' }),
			options 	: any		= value,//form.form.value,//{ "key" : "create", "name" : '', "description" : '' },
			url       : any   = this.baseURI + "updateticket";

			this.http.post(url, JSON.stringify(options), {headers, responseType: 'text'})
			.subscribe((data : any) => {
				// If the request was successful notify the user
				this.loading.dismiss();
				this.presentAlert('Info','Ticker Berhasil Di buat ..');
				//form.reset;
			},(error : any) =>{
				this.loading.dismiss();
				this.presentAlert('Ops', 'Terjadi Kesalahan');
				//form.reset;
			});

		} else {
			this.validateAllFormFields(this.form);     
		}
	}

	isFieldValid(field: string) {
		if(this.form.get(field)){
			return !this.form.get(field).valid && this.form.get(field).touched;
		}
	}

	displayFieldCss(field: string) {
		return {
			'has-error': this.isFieldValid(field),
			'has-feedback': this.isFieldValid(field)
		};
	}

	validateAllFormFields(formGroup: FormGroup) {
		Object.keys(formGroup.controls).forEach(field => {
			//console.log(field);
			const control = formGroup.get(field);
			if (control instanceof FormControl) {
				control.markAsTouched({ onlySelf: true });
			} else if (control instanceof FormGroup) {
				this.validateAllFormFields(control);
			}
		});
	}

	goBack() {
		console.log("popping");
		this.navCtrl.pop();
	}

	presentAlert(info : string, message : string)  : void {
		let alert = this.alertCtrl.create({
			title: info,
			subTitle: message,
			buttons: [
				{
					text: 'OK',
					handler: () => {
						this.resetFields();
					}
				}
			]
		});
		alert.present();
	}

	resetFields() : void {
		this.form.reset();
	}

}
export interface DetailApprovalForm {
	groupId					   : string,
	npkUserId				   : string,
	ticketID                   : string,
	optResponse                : string,
	inputDescription           : string,
}