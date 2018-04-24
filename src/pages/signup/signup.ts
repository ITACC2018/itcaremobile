import { Component } from '@angular/core';
import { NavController, ToastController } from 'ionic-angular';

import { TabsPage } from '../tabs/tabs';
import { LoginPage } from '../login/login';
import { AuthServiceProvider } from '../../providers/auth-service/auth-service';

@Component({
  selector: 'page-signup',
  templateUrl: 'signup.html',
})
export class SignupPage {

  responseData : any;
  userData = {"npk": "","password": "", "name": "","email": ""};

  constructor(
     public navCtrl: NavController,
     public authService:AuthServiceProvider,
     public toastCtrl:ToastController ) {
  }

  signup(){
    this.authService.postData(this.userData,'signup').then((result) => {
      this.responseData = result;
      if(this.responseData.userData){
        //console.log(this.responseData);
        localStorage.setItem('userData', JSON.stringify(this.responseData));
        this.navCtrl.push(TabsPage);
      }else{ 
        //console.log("User already exists"); 
        this. presentToast("Give valid details");
      }
    }, (err) => {
     // Error log
     this. presentToast("Give valid details");
    });
  }

  presentToast(msg) {
    let toast = this.toastCtrl.create({
      message: msg,
      duration: 2000
    });
    toast.present();
  }

  login(){
    //Login page link
    this.navCtrl.push(LoginPage);
  }
}
