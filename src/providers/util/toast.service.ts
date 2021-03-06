import { Injectable } from '@angular/core';
import { Toast, ToastController } from 'ionic-angular';

@Injectable()
export class ToastService {

  toast: Toast;
  constructor(public toastCtrl: ToastController) { }

  create(message, ok = false, duration = 200000) {
    if (this.toast) {
      this.toast.dismiss();
    }

    this.toast = this.toastCtrl.create({
      message,
      duration: ok ? null : duration,
      position: 'bottom',
      showCloseButton: ok,
      closeButtonText: 'OK',
      cssClass: "utilToast"
    });
    this.toast.present();
  }
}
