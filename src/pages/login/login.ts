import { Component } from '@angular/core';
import { NavController, LoadingController } from 'ionic-angular';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { TabsPage } from '../tabs/tabs';
import { AuthServiceProvider } from '../../providers/auth-service/auth-service';
import { AngularFireDatabase, AngularFireList } from 'angularfire2/database';
import { ToastService } from '../../providers/util/toast.service';

@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {
  
  loginForm : FormGroup;
  fbUsers: AngularFireList<any>;
  resposeData : any;
  userData = {"npk":"", "password":""};
  backgroundImage = 'assets/img/background/background-5.jpg';
  backgrounds = [
    'assets/img/background/background-7.jpg',
    'assets/img/background/background-10.jpg'
  ];

  constructor(
    private fdb: AngularFireDatabase,
    public navCtrl: NavController,
    public authService: AuthServiceProvider,
    public loadingCtrl: LoadingController,
    public formBuilder: FormBuilder,
    public toastCtrl: ToastService
  ) {

    this.fbUsers = this.fdb.list('/users');
    this.loginForm = this.formBuilder.group({
      npk: ['', Validators.required],
      password: ['', Validators.required]
    });
    
  }

  ionViewDidLoad() {
    this.loginForm = this.formBuilder.group({
      npk: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  doLogin() {
    let loading = this.loadingCtrl.create({
      content: 'Please wait...'
    });
    loading.present();
    
    if (!this.loginForm.valid) {
      this.toastCtrl.create('Please check you npk and password');
      loading.dismiss();
    } else {
      this.userData.npk = this.loginForm.value.npk;
      this.userData.password = this.loginForm.value.password;

      this.authService.postData(this.userData, "login").then((result) =>{
        this.resposeData = result;
        
        if(this.resposeData.userData){
          localStorage.setItem('userData', JSON.stringify(this.resposeData));
          loading.dismiss();
          this.fbUsers.push(this.resposeData.userData);
          this.navCtrl.push(TabsPage);
        }else{
          loading.dismiss();
          this.toastCtrl.create("Please check you npk and password");
        }
      }, (err) => {
       console.log('error');
      });

    }
  }

  login(){
    if(this.userData.npk && this.userData.password){
      let loading = this.loadingCtrl.create({
        content: 'Please wait...'
      });
      loading.present();
      this.authService.postData(this.userData, "login").then((result) =>{
        this.resposeData = result;
        
        if(this.resposeData.userData){
          localStorage.setItem('userData', JSON.stringify(this.resposeData));
          //get key
          //https://stackoverflow.com/questions/16637035/in-firebase-when-using-push-how-do-i-pull-the-unique-id
          loading.dismiss();
          this.fbUsers.push(this.resposeData.userData);
          this.navCtrl.push(TabsPage);
        }else{
          loading.dismiss();
          this.toastCtrl.create("Please give valid npk and password");
        }
      }, (err) => {
       console.log('error');
      });
    }else{
      this.toastCtrl.create("Give npk and password");
    } 
  }


}