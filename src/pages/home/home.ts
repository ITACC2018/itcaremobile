import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, Platform, /*LoadingController,*/ Content, ToastController  } from "ionic-angular";
//import { AuthServiceProvider } from '../../providers/auth-service/auth-service';
import { HomeDetailPage } from '../home-detail/home-detail';
import { BlogsBlogsProvider } from '../../providers/blogs-blogs/blogs-blogs';
import { GhostProvider } from '../../providers/ghost/ghost';
import { Network } from '@ionic-native/network';
import {ImageLoaderConfig } from "ionic-image-loader";

@IonicPage()
@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})

export class HomePage {
	@ViewChild(Content) content: Content;

	userDetails : any;
	responseData: any;
	status:any;
	dataSet: any;
	userPostData = {"user_id":"","token":""};
	data: any;
	blogsList: string[];
	errorMessage: string;
	page = 1;
	perPage = 0;
	totalData = 1;
	totalPage = 0;
	loading = true;
			
	constructor(
		private network: Network, 
		private platform: Platform,
		private toastCtrl: ToastController,
		private navCtrl: NavController,
		//private authService:AuthServiceProvider,
		//private loadingCtrl: LoadingController,
		private BlogsBlogsProvider: BlogsBlogsProvider,
		private ghostProvider: GhostProvider,
		private imageLoader : ImageLoaderConfig 
	) {
		this.platform.ready().then(() => {
			this.network.onDisconnect().subscribe(() => {
				this.status = 'Network was disconnected :-(';
				this.presentToast('Network was disconnected!', false);
			});
			this.network.onConnect().subscribe(() => {
				this.status = 'Network was Connected :-(';
				this.presentToast('Network was Connected!', false);
			});
			if(this.network.type !== 'none'){
				return true;
			}else if(this.network.type === 'none'){
				this.presentToast('Please Check your network and try again', false);
			}else{
				this.presentToast('Please Check your network and try again', false);
			}
		});
		const data = JSON.parse(localStorage.getItem('userData'));
		this.userDetails = data.userData;
		this.userPostData.user_id = this.userDetails.user_id;
		this.userPostData.token = this.userDetails.token;
		this.imageLoader.setFallbackUrl('assets/img/etc/image-not-found.jpg');
		this.imageLoader.setImageReturnType('base64');
		this.imageLoader.setSpinnerColor('secondary');
		this.imageLoader.setSpinnerName('bubbles');
		this.imageLoader.maxCacheSize = 2 * 1024 * 1024; // 2 MB
		this.imageLoader.maxCacheAge = 60 * 1000; // 1 minute
	}


	reload() {
		this.ghostProvider.setLoading(true);
		this._setLoaded()
	}

	private _setLoaded() {
		//setTimeout(() => {
		this.ghostProvider.setLoading(false);
		//}, 1000);
	}

	ionViewDidLoad() {
		this.getBlog();
	}

	// ionViewWillEnter() : void
	// { 
	// 	this.getBlog();
	// }

	// ionViewWillLeave() : void
	// {
	// 	this.page = 1;
	// }

	getBlog() {
		// let loading = this.loadingCtrl.create({
		// 	content: 'Please wait...'
		// });
		// loading.present();
		this.ghostProvider.setLoading(true);
		this.BlogsBlogsProvider.getBlog(this.page)
		.subscribe((res : any) => {
			this.data = res;
			this.blogsList = this.data.data;
			this.perPage = this.data.per_page;
			this.totalData = this.data.total;
			this.totalPage = this.data.last_page;
			this.loading = false;
			this.ghostProvider.setLoading(false);
			//this._setLoaded();
			//loading.dismiss();
		},(error : any) =>{
			//loading.dismiss();
			this.presentToast('Error: '+ error, true);
			error =>  this.errorMessage = <any>error
		});
	}

	doRefresh(refresher) {
		setTimeout(() => {
		  this.page = 1;
		  this.getBlog();
		  refresher.complete();
		}, 2000);
	}
 
	getContentAcc(blog){
		this.navCtrl.push(HomeDetailPage, {
			idBlog: blog.id,
			idTitle:  blog
		});
	}

	doInfinite(e): Promise<any> {
		return new Promise(resolve => {
		   	setTimeout(() => {
				this.page = this.page + 1;
				this.BlogsBlogsProvider.getBlog(this.page).subscribe((res : any) => {
					this.data = res;
					this.perPage = this.data.per_page;
					this.totalData = this.data.total;
					this.totalPage = this.data.last_page;
					for(let i=0; i<this.data.data.length; i++) {
						this.blogsList.push(this.data.data[i]);
					}
				},(error : any) =>{
					this.presentToast('Error: '+ error, true);
					error =>  this.errorMessage = <any>error
				});
			resolve();
			}, 500);
		});
	}

	private presentToast(text, close) {
		if(close == true){
			let toast = this.toastCtrl.create({
				message: text,
				//duration: 3000,
				position: 'bottom',
				cssClass: "toast-network",
				showCloseButton: true,
				closeButtonText: 'Ok',
				dismissOnPageChange: true
			});
			toast.present();
		}
		if(close == false){
			let toast = this.toastCtrl.create({
				message: text,
				duration: 3000,
				position: 'bottom',
				cssClass: "toast-network",
				dismissOnPageChange: true
			});
			toast.present();
		}	
	}
}
