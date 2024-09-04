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
    console.log("Dato guardado en Local storage.", valor);
  }

  async getDatosDeLocalStorage(){
    try{
      const item = await this.localStorage.get("USUARIO");
      console.log("Item obtenido: ", item)
      return item;
    }catch(e){
      console.log("Error get local storage",e)
    }
  }

  eliminarDatoEnLocalStorage(){
    console.log("Dato eliminado del Local storage.");
    this.localStorage.remove("USUARIO");
  }

  limpiarTodoLocalStorage(){

    console.log("Local storage limpia.");
    this.localStorage.clear();
    // window.location.reload();
  }




}
