import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpModule } from '@angular/http';
import { Network } from '@ionic-native/network';
import { HttpClientModule } from "@angular/common/http";
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen'
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';
import { IonicImageViewerModule } from 'ionic-img-viewer';
import { IonicImageLoader } from 'ionic-image-loader';
//import { FCM } from '@ionic-native/fcm';
import { OneSignal } from '@ionic-native/onesignal';


//page
import { WelcomePage } from '../pages/welcome/welcome';
import { LoginPage } from '../pages/login/login';
import { SignupPage } from '../pages/signup/signup';
import { AboutPage } from '../pages/about/about';
import { ContactPage } from '../pages/contact/contact';
import { HomePage } from '../pages/home/home';
import { HomeDetailPage } from '../pages/home-detail/home-detail';
import { TabsPage } from '../pages/tabs/tabs';
import { NotifPage } from '../pages/notif/notif';
import { DetailTicketPage } from '../pages/detail-ticket/detail-ticket';
import { DetailApprovalPage } from '../pages/detail-approval/detail-approval';
import { SettingPage } from '../pages/setting/setting';
import { HelpPage } from '../pages/help/help';
import { DetailHelpPage } from '../pages/detail-help/detail-help';
import { DetailHelpAnswerPage } from '../pages/detail-help-answer/detail-help-answer';
import { DetailHelpAnswerQuestionPage } from '../pages/detail-help-answer-question/detail-help-answer-question';
//end-page

import { LinkyModule } from 'angular-linky';
import { MomentModule } from 'angular2-moment';
import { EmojiProvider } from '../providers/emoji';
import { AuthServiceProvider } from '../providers/auth-service/auth-service';
import { BotmanProvider } from '../providers/botman/botman';
import { CoaKategoriProvider } from '../providers/coa-kategori/coa-kategori';
import { ToastService } from '../providers/util/toast.service';

import { ChatModule } from '../pages/chat/chat.module'; 
import { AboutPageModule } from '../pages/about/about.module'; 
import { AngularFireModule } from 'angularfire2';
import { AngularFireDatabaseModule } from 'angularfire2/database';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { SelectSearchableModule } from 'ionic-select-searchable';
import { HelpCategoryProvider } from '../providers/help-category/help-category';
import { BlogsBlogsProvider } from '../providers/blogs-blogs/blogs-blogs';
import { GhostProvider } from '../providers/ghost/ghost';
import { ComponentsModule } from '../components/components.module';

//// Initialize Firebase
 //https://github.com/angular/angularfire2/blob/master/docs/ionic/v3.md
var firebaseConfig = {
	apiKey: "AIzaSyCjZPMGjboesU0BtZwFJnH47XdSmkVkVdo",
	authDomain: "it-acc-c1970.firebaseapp.com",
	databaseURL: "https://it-acc-c1970.firebaseio.com",
	projectId: "it-acc-c1970",
	storageBucket: "it-acc-c1970.appspot.com",
	messagingSenderId: "365696269200"
};

@NgModule({
  declarations: [
		MyApp,
		//AboutPage,
		ContactPage,
		WelcomePage,
		HomePage,
		HomeDetailPage,
		LoginPage,
		SignupPage,
		TabsPage,
		NotifPage,
		DetailTicketPage,
		DetailApprovalPage,
		SettingPage,
		HelpPage,
		DetailHelpPage,
		DetailHelpAnswerPage,
		DetailHelpAnswerQuestionPage
  ],
  imports: [
		BrowserModule,
		HttpModule,
		HttpClientModule,
		LinkyModule,
		MomentModule,
		ComponentsModule,
		IonicModule.forRoot(MyApp, {
			iconMode: 'ios',
			modalEnter: 'modal-slide-in',
			modalLeave: 'modal-slide-out',
			tabsPlacement: 'bottom',
			pageTransition: 'ios-transition'
		}),
		AngularFireModule.initializeApp(firebaseConfig),
		AngularFireDatabaseModule,
		AngularFireAuthModule,
		ChatModule,
		AboutPageModule,
		SelectSearchableModule,
		IonicImageViewerModule,
		IonicImageLoader.forRoot()
  ],
  bootstrap: [IonicApp],
  entryComponents: [
		MyApp,
		AboutPage,
		ContactPage,
		WelcomePage,
		HomePage,
		HomeDetailPage,
		LoginPage,
		SignupPage,
		TabsPage,
		NotifPage,
		DetailTicketPage,
		DetailApprovalPage,
		SettingPage,
		HelpPage,
		DetailHelpPage,
		DetailHelpAnswerPage,
		DetailHelpAnswerQuestionPage
  ],
  providers: [
		StatusBar,
		SplashScreen,
		AuthServiceProvider,
		{provide: ErrorHandler, useClass: IonicErrorHandler},
		AuthServiceProvider,
		EmojiProvider,
		BotmanProvider,
		CoaKategoriProvider,
		ToastService,
		Network,
		HelpCategoryProvider,
		BlogsBlogsProvider,
		GhostProvider,
		OneSignal
		//FCM

  ]
})
export class AppModule {}
