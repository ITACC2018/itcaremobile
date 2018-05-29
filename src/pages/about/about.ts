import { Component, ViewChild } from '@angular/core';
import { Platform, NavController, NavParams, ToastController, AlertController, LoadingController, Content } from 'ionic-angular';
import { SelectSearchable } from 'ionic-select-searchable';
import { Coa, CoaKategoriProvider } from '../../providers/coa-kategori/coa-kategori';
import { FormControl, FormGroup, FormBuilder, FormArray, Validators } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { DetailTicketPage } from '../detail-ticket/detail-ticket';


@Component({
  selector: 'page-about',
  templateUrl: 'about.html'
})

export class AboutPage {
	@ViewChild(Content) content: Content;
	/**Create Ticket */
	form: FormGroup;
	myGroup: FormGroup;
	coas: Coa[] = [];
	selectCoa: Coa;
	pet: string;
	os: string;
	isAndroid: boolean = false;
	flexibleInput: any;
	tmpSelect: any;
	isReadonly: boolean;
	formFlex: any;
	baseURI: string;
	/**End Create Ticket */

	/** Tracking Ticket */
	data: any;
	trackingList: string[];
	errorMessage: string;
	page = 1;
	perPage = 0;
	totalData = 1;
	totalPage = 0;
	/**End Tracking Ticket */
	loadingContent = true;
	loading: any;
	goPage: string = '';

	constructor(
		public platform: Platform,
		public CoaKategoriProvider: CoaKategoriProvider,
		public navCtrl    : NavController,
		public http       : HttpClient,
		public NP         : NavParams,
		public fb         : FormBuilder,
		public toastCtrl  : ToastController,
		public alertCtrl  : AlertController,
		public loadingCtrl: LoadingController
	) {
		this.createLoading('Please wait ..', '');
		this.baseURI = this.CoaKategoriProvider.getBaseUri();
		this.flexibleInput = [];
		this.tmpSelect = {};
		this.isReadonly = true;
			
		this.pet = "puppies";
		this.isAndroid = platform.is('android');
		this.formFlex =
		{
			selectcoa                  : ["", Validators.required],
			sourceID                   : [""],
			isTicket                   : [""],
			groupid                    : [""],
			inputpicapproval           : [""],
			inputpicbucket             : [""],
			inputpicbcdetail           : [""],
			isapproval                 : [""],
			inputpicbackdesk           : [""],
			inputPIR                   : [""],
			isRroh                     : [""],
			inputnpk                   : [""],
			inputbranch                : [""],
			inputext                   : [""],
			inputemail                 : [""],
			inputposition              : [""],
			optsource                  : [""],
			inputagentanswer           : [""],
			inputcallerphone           : [""],
			inputapproveby             : [""],
			optaddapproval             : [""],
			pic                        : [""],
			description                : ["", Validators.required],
			//"fldNPK:"                : ["", Validators.required],
			// fldNamaDatabase			   : [""],
			// fldBatasanWaktu			   : [""],
			addresses: this.fb.array([
				this.getInitialAddress()
			])
		}
		let fixForm = this.formFlex;
		this.form = this.fb.group(fixForm);
	}

	setDataUser() {
		const data = JSON.parse(localStorage.getItem('userData'));
		this.form.controls.inputnpk.setValue(data.userData.npk);
		this.form.controls.inputemail.setValue(data.userData.name);
		this.form.controls.groupid.setValue(data.userData.group_id);
		this.form.controls.inputbranch.setValue(data.userData.branch);
		//this.form.controls.email.setValue(data.userData.email);
		this.form.controls.inputposition.setValue(data.userData.position);
		this.form.controls.inputapproveby.setValue(data.userData.spv);
	}

	ionViewDidLoad(): void {
		this.getKategori(true);
		this.pet = "puppies";
		// this.myGroup = new FormGroup({
		// 	firstName: new FormControl()
		// });
		this.setDataUser();
		console.log('ionViewDidLoad');
	}

	ionViewWillEnter() : void
	{   
		//this.getKategori();
		this.flexibleInput = [];
		//this.setDataUser();
		//console.log(this.form.controls.selectcoa.value.id, this.tmpSelect);
		if(this.tmpSelect['value']){
			//console.log(this.form.controls.selectcoa.value.id, this.tmpSelect['value'].id);
			if(this.form.controls.selectcoa.value.id !== this.tmpSelect['value'].id){
				//this.presentAlert('Ops','Silahkan pilih kategori dengan benar');
				this.portChange(this.tmpSelect, 'ionViewWillEnter');
			}
		}
		console.log('ionViewWillEnter');
	}

	ionViewDidEnter() : void
	{
		//this.getKategori();
		//this.flexibleInput = [];
		this.setDataUser();
		console.log('ionViewDidEnter');
	}

	ionViewWillLeave() : void
	{
		//this.loading.dismiss();
		//this.flexibleInput = [];
		this.tmpSelect= {};
		//this.page = 1;
		//this.totalData = 1;
		//this.setDataUser();
		this.resetFields();
		this.form.controls.selectcoa.setValue({id: "0000000000", name: "KETIK / PILIH KATEGORI"});
		console.log('ionViewWillLeave');
	}

	ionViewDidLeave() : void
	{
		//if(this.goPage == ''){
		//this.getKategori(false);
		//}
		this.loading.dismiss();
		this.createLoading('Please wait ..', '');
		//this.flexibleInput = [];
		console.log('ionViewDidLeave');
	}

	ionViewWillUnload() : void
	{
		//console.log('ionViewWillLeave');
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

	getInitialAddress() {
		return this.fb.group({
			// "fldNPK:"       : ["", Validators.required],
			// fldNamaDatabase : [""],
			// fldBatasanWaktu : [""]
		});
	}

	addAddress() {
		const control = <FormArray>this.form.controls['addresses'];
		control.push(this.getInitialAddress());
	}


	getKategori(loading) {
		if(loading){
			this.loading.present();
		}
		return this.CoaKategoriProvider.getKategoriData().subscribe(res => {
			if(res){
				this.coas = res['coa'];	  		
				this.form.controls.selectcoa.setValue(this.coas[0]);
				let flexiForm = res['flexibleInput'];
				if(flexiForm){
					var arr = Object();
					for (let k of flexiForm) {
						arr[k] = [''];
					}
					const object2 = Object.assign(arr, this.formFlex);
					this.formFlex = object2;
				}
				if(loading){
					this.loading.dismiss();
					this.createLoading('Please wait ..', '');
				}
			}
		});
	}

    /**
	* change select coa
	*
	* @public
	* @method portChange
	* @param event 			{any} 			Name value from form field
	* @return {None}
	*/
	portChange(event: { component: SelectSearchable, value: any }, type: string) {		
		let idParam = '';
		if(type == 'portChange'){ idParam = event.value.id;}
		if(type == 'ionViewWillEnter'){ idParam = event['id'];}	
		//console.log(type,'idParam',idParam, event);
		
		if(idParam === '0000000000'){
			this.form.controls.optaddapproval.setValue('');
			this.form.controls.inputpicapproval.setValue('');
			this.form.controls.inputpicbucket.setValue('');
			//this.form.controls.inputPicbc.setValue(res.listCheckData[0].bucket);
			this.form.controls.inputpicbcdetail.setValue('');
			this.form.controls.isapproval.setValue('');
			this.form.controls.inputpicbackdesk.setValue('');
			//this.form.controls.inputPicbd.setValue(res.listCheckData[0].bucket_name);
			this.form.controls.pic.setValue('');
			for (var key in this.formFlex) {
				if (this.formFlex.hasOwnProperty(key)) {
    				var res = key.substring(0, 3);
					if (res == 'fld') {
						this.formFlex[key] = [''];
					}
				}
			 }
			this.flexibleInput = [];		
		}else{
			if(idParam !== undefined){
				this.callCoa(idParam, event);
			}else{
				this.callCoa(event.value.id, event);
			}
		}
	}

    /**
	* call rest coa
	* @public
	* @method callCoa
	* @param idParam 	{string} 			Name value from form field
	* @param event 	{any} 			Name value from form field
	* @return {None}
	*/
	callCoa(idParam: string, event: any) {
		this.loading.present();
		for (var keye in this.formFlex) {
			if (this.formFlex.hasOwnProperty(keye)) {
				var rese = keye.substring(0, 3);
				if (rese == 'fld') {
					this.formFlex[keye] = [''];
				}
			}
		}
		this.tmpSelect = event;
		//this.form.controls.selectcoa.setValue(idParam);
		return this.CoaKategoriProvider.getCoaDetail(idParam).subscribe(res => {
			if(res.listCheckData[0]){
				// replace this.formFlex menjadi required
				if(res.listgetFlexibleField){
					//CLEANSING THIS.FORMLEX FROM VALIDATION
					for (let key in this.formFlex) {
						if (this.formFlex.hasOwnProperty(key)) {
							if(key =='selectcoa'){
								this.formFlex[key] = [idParam], Validators.required;
							}else{
								let xxx = key.substring(0, 3);
								if(xxx == 'fld'){
									for (let k of res.listgetFlexibleField) {
										//console.log(key == k.input, key, k.input);
										if (key == k.input) {
											this.formFlex[key] = ['', Validators.required];
										}
									}
								}
							}
						}
					}
				}
				//console.log(this.formFlex);
				//SET FORM LAGI
				this.form = this.fb.group(this.formFlex);

				this.setDataUser();
				this.form.controls.optaddapproval.setValue(res.listcheckDataApprovalDetail);
				this.form.controls.inputpicapproval.setValue(res.listCheckData[0].approval);
				this.form.controls.inputpicbucket.setValue(res.listCheckData[0].bucket);
				//this.form.controls.inputPicbc.setValue(res.listCheckData[0].bucket);
				this.form.controls.inputpicbcdetail.setValue(res.listCheckData[0].bucket_name);
				this.form.controls.isapproval.setValue(res.listCheckData[0].isApproval);
				this.form.controls.inputpicbackdesk.setValue(res.listCheckData[0].backdesk);
				//this.form.controls.inputPicbd.setValue(res.listCheckData[0].bucket_name);
				this.form.controls.pic.setValue(res.listCheckData[0].bucket_name);
				this.form.controls.selectcoa.setValue(event.value);
				this.flexibleInput = res.listgetFlexibleField;
				
			}
			this.loading.dismiss();
			this.createLoading('Please wait ..', '');
		});
	}


    /**
	* Save a new record that has been added to the page's HTML form
	* Use angular's http post method to submit the record data
	*
	* @public
	* @method createEntry
	* @param name 			{String} 			Name value from form field
	* @param description 	{String} 			Description value from form field
	* @return {None}
	*/
   saveTicket({ value, valid }: { value: Ticket, valid: boolean }) {  
		if(value.selectcoa.id === '0000000000'){
			this.presentAlert('Ops','Silahkan Pilih Kategori');
		}

		if (valid) {
			console.log('form submitted');
			this.loading.present();
			this.CoaKategoriProvider.getBaseUri();
			let headers 	: any		= new HttpHeaders({ 'Content-Type': 'application/json' }),
			options 	: any		= value,//form.form.value,//{ "key" : "create", "name" : '', "description" : '' },
			url       : any   = this.baseURI + "saveticket";
  
			this.http.post(url, JSON.stringify(options), headers)
			.subscribe((data : any) => {
				// If the request was successful notify the user
				this.loading.dismiss();
				this.createLoading('Please wait ..', '');
				this.presentAlert('Info','Ticker Berhasil Di buat ..');
				//form.reset;
			},(error : any) =>{
				this.loading.dismiss();
				this.createLoading('Please wait ..', '');
				this.presentAlert('Ops','Terjadi Kesalahan!');
				//form.reset;
			});
		} else {
			this.validateAllFormFields(this.form);
		}
   }

   /**
	* Manage notifying the user of the outcome of remote operations
	*
	* @public
	* @method sendNotification
	* @param message 	{String} 			Message to be displayed in the notification
	* @return {None}
	*/
	sendNotification(message : string)  : void {
		let notification = this.toastCtrl.create({
			message       : message,
			duration      : 3000
		});
		notification.present();
	}

	  /**
	* Manage notifying the user of the outcome of remote operations
	*
	* @public
	* @method presentAlert
	* @param message 	{String} 			Message to be displayed in the notification
	* @return {None}
	*/
	presentAlert(info : string, message : string)  : void {
		let alert = this.alertCtrl.create({
			title: info,
			subTitle: message,
			buttons: [
				{
					text: 'OK',
					handler: () => {
						this.resetFields();
						this.form.controls.selectcoa.setValue({id: "0000000000", name: "KETIK / PILIH KATEGORI"});
						this.flexibleInput = [];
					}
				}
			]
		});
		alert.present();
	}

	getTracking() {
		// let loading = this.loadingCtrl.create({
		// 	content: 'Please wait...'
		// });
		// loading.present();
		this.loadingContent = true;
		const data = JSON.parse(localStorage.getItem('userData'));
		this.CoaKategoriProvider.getTrackingTicket(this.page, data.userData.npk_crypt)
		.subscribe((res : any) => {
				this.data = res;
				this.trackingList = this.data.data;
				this.perPage = this.data.per_page;
				this.totalData = this.data.total;
				this.totalPage = this.data.last_page;
				//loading.dismiss();
				this.loadingContent = false;
			},(error : any) =>{
				//loading.dismiss();
				this.loadingContent = false;
				error =>  this.errorMessage = <any>error
			});
	}

	doInfinite(infiniteScroll) {
		const data = JSON.parse(localStorage.getItem('userData'));
		this.page = this.page+1;
		setTimeout(() => {
		  this.CoaKategoriProvider.getTrackingTicket(this.page, data.userData.npk_crypt)
			.subscribe((res : any) => {
				this.data = res;
				this.perPage = this.data.per_page;
				this.totalData = this.data.total;
				this.totalPage = this.data.last_page;
				for(let i=0; i<this.data.data.length; i++) {
					this.trackingList.push(this.data.data[i]);
				}
				//this.loading.dismiss();
				//this.createLoading('Please wait ..', '');
				//this.scrollToBottom();
			},(error : any) =>{
				//this.loading.dismiss();
				//this.createLoading('Please wait ..', '');
				error =>  this.errorMessage = <any>error
			});
		  infiniteScroll.complete();
		}, 1000);
	}

	/** 
	 * Click tabs call tracking
	*/
	changeTab(type: string): void {
		
		this.resetFields();
		this.form.controls.selectcoa.setValue({id: "0000000000", name: "KETIK / PILIH KATEGORI"});
		this.flexibleInput = [];
		this.page = 1;
		if(type == 'showImage'){
			this.loading.dismiss();
			this.createLoading('Please wait ..', '');
			this.getTracking();
		}
		
	}


	scrollToBottom() {
		setTimeout(() => {
			if (this.content.scrollToBottom) {
				this.content.scrollToBottom(0);
			}
		}, 600)
	}


	pushDetailTicket(ticket) {
		this.goPage = 'getTracking';
		this.navCtrl.push(DetailTicketPage, {
			idTicket: ticket.ticket_id
		});
	}

	createLoading(text, close) {
		this.loading = this.loadingCtrl.create({
			content: text,
			cssClass:'loading-itcare'
		});
		// if(close == false){
		// 	this.loading.present();
		// }
		// if(close == true){
		// 	this.loading.dismiss();
		// }	
	}


	doRefreshCoa(refresher) {
		setTimeout(() => {
			this.getKategori(true);
		  	refresher.complete();
		}, 2000);
	}


	doRefreshTracking(refresher) {
		setTimeout(() => {
			this.page = 1;
			this.getTracking();
		  	refresher.complete();
		}, 2000);
	}


}
export interface Ticket {
	selectcoa                  : any,
	sourceID                   : string,
	isTicket                   : string,
	groupid                    : string,
	inputpicapproval           : string,
	inputpicbucket             : string,
	inputpicbcdetail           : string,
	isapproval                 : string,
	inputpicbackdesk           : string,
	inputPIR                   : string,
	isRroh                     : string,
	inputnpk                   : string,
	inputbranch                : string,
	inputext                   : string,
	inputemail                 : string,
	inputposition              : string,
	optsource                  : string,
	inputagentanswer           : string,
	inputcallerphone           : string,
	inputapproveby             : string,
	optaddapproval             : string,
	pic                        : string,
	description                : string,
	"fldNPK:"                  : string,
	fldNamaDatabase			   : string,
	fldBatasanWaktu			   : string
}