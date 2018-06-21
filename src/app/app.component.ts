import { Component, ViewChild } from '@angular/core';
import { Platform, MenuController, Nav } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
//import { FCM } from '@ionic-native/fcm';


import { TabsPage } from '../pages/tabs/tabs';
import { LoginPage } from '../pages/login/login';

import { OneSignal, OSNotificationPayload } from '@ionic-native/onesignal';
import { isCordovaAvailable } from '../common/is-cordova-available';
import { oneSignalAppId, sender_id } from '../config';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;
  public rootPage;

  constructor(
    public platform: Platform,
    public statusBar: StatusBar,
    public menu: MenuController,
    public splashScreen: SplashScreen,
    public oneSignal: OneSignal
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


        //ONESIGNAL NOTIFICATION.

        if (isCordovaAvailable()){
          this.oneSignal.startInit(oneSignalAppId, sender_id);
          this.oneSignal.inFocusDisplaying(this.oneSignal.OSInFocusDisplayOption.Notification);
          this.oneSignal.handleNotificationReceived().subscribe(data => this.onPushReceived(data.payload));
          this.oneSignal.handleNotificationOpened().subscribe(data => this.onPushOpened(data.notification.payload));
          this.oneSignal.endInit();
        }
        //ENDONESIGNAL.
    });
  }

  private onPushReceived(payload: OSNotificationPayload) {
    alert('Push recevied:' + payload.body);
  }
  
  private onPushOpened(payload: OSNotificationPayload) {
    alert('Push opened: ' + payload.body);
  }

  openPage(page) {
    this.menu.close();
		this.nav.setRoot(page.component);
  }
}
