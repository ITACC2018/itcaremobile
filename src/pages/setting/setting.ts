import { Component } from '@angular/core';
import { App, NavController, LoadingController } from 'ionic-angular';
import { ToastService } from '../../providers/util/toast.service';

/**
 * Generated class for the SettingPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

//@IonicPage()
@Component({
  selector: 'page-setting',
  templateUrl: 'setting.html',
})
export class SettingPage {

  user: any;

  constructor(
    public navCtrl: NavController, 
    public toastCtrl: ToastService,
    public app: App,
    public loadingCtrl: LoadingController
  ) {
    const data = JSON.parse(localStorage.getItem('userData'));
    this.user = {
      name: data.userData.name,
      profileImage: 'assets/img/avatar/acc.jpg',
      coverImage: 'assets/img/background/background-7.jpg',
      occupation: data.userData.position,
      location: 'Seattle, WA',
      description: '“ If something is important enough you should try. even if the probable outcome is failure. - Elon Musk “',
      followers: 456,
      following: 1052,
      posts: 35
    };
  
  }

  ionViewDidLoad() {
    console.log('Hello ProfileFour Page');
  }

  backToWelcome() {
    const root = this.app.getRootNav();
    root.popToRoot();
  }

  logout() {
    //Api Token Logout
    let loading = this.loadingCtrl.create({
			content: 'Please wait...'
		});
		loading.present();
    localStorage.clear();
    loading.dismiss();
    setTimeout(() => 
      this.backToWelcome()
    , 100);
  }

}
