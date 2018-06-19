import { Component, ViewChild } from '@angular/core';
import { Platform, Nav } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
//import { FCM } from '@ionic-native/fcm';


import { TabsPage } from '../pages/tabs/tabs';
import { LoginPage } from '../pages/login/login';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;
  public rootPage;

  constructor(
    public platform: Platform,
    public statusBar: StatusBar,
    public splashScreen: SplashScreen
    //public fcm: FCM

  ) {
    this.platform.ready().then(() => {
        // Okay, so the platform is ready and our plugins are available.
        // Here you can do any higher level native things you might need.
        this.statusBar.styleDefault();
        this.splashScreen.hide();
        if(localStorage.getItem('userData')){
          this.rootPage = TabsPage; 
        }else{
          this.rootPage = LoginPage;
        }
		//if (this.platform.is('cordova')) {
			// FIREBASE CLOUD MESSAGING
			// Notifications
			/*fcm.subscribeToTopic('all');
			fcm.getToken().then(token=>{
				console.log(token);
			})
			fcm.onNotification().subscribe(data=>{
			  if(data.wasTapped){
				console.log("Received in background");
			  } else {
				console.log("Received in foreground");
			  };
			})
			fcm.onTokenRefresh().subscribe(token=>{
			  console.log(token);
			});*/
		//} else {
		  // Cordova not accessible, add mock data if necessary
		//}
        //end notifications.
    });
  }
}
