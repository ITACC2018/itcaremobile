import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController } from 'ionic-angular';
import { BlogsBlogsProvider } from '../../providers/blogs-blogs/blogs-blogs';
import { GhostProvider } from '../../providers/ghost/ghost';

/**
 * Generated class for the HomeDetailPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-home-detail',
  templateUrl: 'home-detail.html',
})
export class HomeDetailPage {

  idBlog: string;
  idTitle: any;
  errorMessage: string;
  detailBlog: any;
  loading = true;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public loadingCtrl: LoadingController,
    public BlogsBlogsProvider: BlogsBlogsProvider,
    private ghostProvider: GhostProvider
  ) {
    this.idBlog = navParams.get("idBlog");
    this.idTitle = navParams.get("idTitle");
    this.getDetailBlogById(this.idBlog);
  }

  ionViewDidLoad() {
    console.log(this.idTitle.title);
  }

  reload() {
		this.ghostProvider.setLoading(true)
		this._setLoaded()
	}

	private _setLoaded() {
		//setTimeout(() => {
		this.ghostProvider.setLoading(false)
		//}, 1000);
	}

  getDetailBlogById(idBlog) {
		// let loading = this.loadingCtrl.create({
		// 	content: 'Please wait...'
		// });
    // loading.present();
    this.ghostProvider.setLoading(true);
		this.BlogsBlogsProvider.getDetailBlogById(idBlog)
		.subscribe((res : any) => {      
				this.detailBlog = res;        
        this.ghostProvider.setLoading(false);
        this.loading = false;
			},(error : any) =>{
				this.ghostProvider.setLoading(false);
				error =>  this.errorMessage = <any>error
			});
  }

}
