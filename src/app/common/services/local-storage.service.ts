import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage-angular';

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService  {

  constructor(
    private localStorage: Storage,
  ) {
    this.cargarLocalStorage();
  }

  async  cargarLocalStorage(){
    await this.localStorage.create();
    console.log("Local storage guardado.")
  }

  async guardarDatosEnLocalStorage(valor:any ){
    await this.localStorage.set("USUARIO",valor);
    console.log("Dato guardado en Local storage.")
    console.log(valor);
  }

  async getDatosDeLocalStorage(){
    const item = await this.localStorage.get("USUARIO");
    console.log("Item obtenido: ", item)
    return item;
  }

  async eliminarDatoEnLocalStorage(){
    console.log("Dato eliminado del Local storage.")
    await this.localStorage.remove("USUARIO");
  }

  async limpiarTodoLocalStorage(){
    console.log("Local storage limpia.")
    await this.localStorage.clear();

  }




}
