import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AboutPage} from './about';
import { SelectSearchableModule } from 'ionic-select-searchable';

@NgModule({
    declarations: [AboutPage],
    imports: [
        IonicPageModule.forChild(AboutPage),
        SelectSearchableModule
    ],
})
export class AboutPageModule { }