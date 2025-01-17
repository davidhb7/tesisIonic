import { Injectable } from '@angular/core';
import { LoadingController, ToastController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class InteractionService {

  private cargando: HTMLIonLoadingElement | null = null;

  constructor(
    public toastController: ToastController,
    public loadingController: LoadingController
  ) { }

  async mensajeGeneral(mensaje: string) {
    const toast = await this.toastController.create({
      message: mensaje,
      duration: 2000
    });
    toast.present();
  }

  async cargandoConMensaje(mensaje: string) {
    this.cargando = await this.loadingController.create({
      cssClass: 'my-custom-class',
      message: mensaje,
    });
    await this.cargando.present();
  }

  async cerrarCargando() {
    if (this.cargando) {
      await this.cargando.dismiss();
      this.cargando = null;
    }
  }
}
