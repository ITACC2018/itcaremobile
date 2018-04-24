import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController } from 'ionic-angular';
import { CoaKategoriProvider } from '../../providers/coa-kategori/coa-kategori';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';

/**
 * Generated class for the DetailApprovalPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-detail-approval',
  templateUrl: 'detail-approval.html',
})
export class DetailApprovalPage {

	form: FormGroup;
	formApp: any;
	idTicket: string;
	detailTicket: any;
	flexibleInput: any;
	detailApproval: any;
	errorMessage: string;

	constructor(
		public navCtrl : NavController,
		public navParams : NavParams,
		public CoaKategoriProvider : CoaKategoriProvider,
		public loadingCtrl : LoadingController,
		public fb : FormBuilder
	) {
		this.idTicket = navParams.get("idTicket");
		this.getDetailApprovalById(this.idTicket);
		
		this.formApp = {
				ticketID                  : ["", Validators.required],
				optResponse               : ["", Validators.required],
				inputDescription          : [""]
		}
		this.form = this.fb.group(this.formApp);
		this.form.controls.ticketID.setValue(this.idTicket);
	}

	ionViewDidLoad(): void {
		//this.getDetailTicketById(this.idTicket);
		//console.log('ionViewDidLoad');
	}

	getDetailApprovalById(idTicket) {
		let loading = this.loadingCtrl.create({
			content: 'Please wait...'
		});
		loading.present();
		this.CoaKategoriProvider.getDetailApp(idTicket)
		.subscribe((res : any) => {
				this.detailTicket = res.detailTicket;
        		this.flexibleInput = res.flexibleInput;
				this.detailApproval = res.detailApproval;
        
				loading.dismiss();
			},(error : any) =>{
				loading.dismiss();
				error =>  this.errorMessage = <any>error
			});
  }
  
  saveTicket({ value, valid }: { value: DetailApprovalForm, valid: boolean }) 
  {  
 


   if (valid) {
    //  console.log('form submitted');
    //  let loading = this.loadingCtrl.create({
    //    content: 'Please wait...'
    //  });
    //  loading.present();

    //  let headers 	: any		= new HttpHeaders({ 'Content-Type': 'application/json' }),
    //  options 	: any		= value,
    //  url       : any   = this.baseURI + "saveticket";
 
    //  this.http.post(url, JSON.stringify(options), headers)
    //  .subscribe((data : any) => {

    //    loading.dismiss();
    //    this.presentAlert('Info','Ticker Berhasil Di buat ..');

    //  },(error : any) =>{
    //    loading.dismiss();
    //    this.presentAlert('Ops','Terjadi Kesalahan!');

    //  });
   } else {
     this.validateAllFormFields(this.form);     
   }
  }


	resetFields() : void
	{
		this.form.reset();
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
}
export interface DetailApprovalForm {
	ticketID                   : string,
	optResponse                : string,
	inputDescription           : string,
}