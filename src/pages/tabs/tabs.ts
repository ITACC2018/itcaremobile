import { Component } from '@angular/core';

import { AboutPage } from '../about/about';
//import { ContactPage } from '../contact/contact';
import { HomePage } from '../home/home';
import { NotifPage } from '../notif/notif';
import { SettingPage } from '../setting/setting';
//import { HelpPage } from '../help/help';
import { DetailHelpPage } from '../detail-help/detail-help';

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {

  tabHomePage = HomePage;
  tabAboutPage = AboutPage; /* ITCare */
  /*tabContactPage = HelpPage;*/
  tabContactPage = DetailHelpPage;
  tabNotificationsPage = NotifPage;
  tabSettingPage = SettingPage;

  constructor() {

  }
}
