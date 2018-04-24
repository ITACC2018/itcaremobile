import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { DetailTicketPage } from './detail-ticket';

@NgModule({
  declarations: [
    DetailTicketPage,
  ],
  imports: [
    IonicPageModule.forChild(DetailTicketPage),
  ],
})
export class DetailTicketPageModule {}
