import { Injectable } from '@angular/core';
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { getDownloadURL } from '@angular/fire/storage';
import { finalize } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FireStorageService {

  constructor(
    private angStorage: AngularFireStorage,
  ) { }



  //SELECCIONAR FOTOS DEL DISPOSITIVO, SUBIR FOTOS Y OBTENCION DE ENLACES EN FIRE STORAGE
  cargarFotoFireStorage(archivo:any, ruta:any, nombreFoto:string): Promise<string>{
    return new Promise(resolve=>{
      const rutaArchivo= ruta+'/'+ nombreFoto;
      const referencia = this.angStorage.ref(rutaArchivo);
      const task= referencia.put(archivo);
      task.snapshotChanges().pipe(
        finalize(()=>{
          // const downloadURL = referencia.getDownloadURL();
          //OBTENCION ENLACE PARA ABRIR IMAGEN
          referencia.getDownloadURL().subscribe(res=>{
            const downloadURL = res;
            resolve(downloadURL);
            return;
          });
        })
      ).subscribe();
    })
  }


  //ELIMINAR FOTO POR URL
  eliminarFotoFireStorage(urlFoto: string): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      // Obtener referencia al archivo en Fire Storage a partir del URL
      const referencia = this.angStorage.storage.refFromURL(urlFoto);
      // Eliminar archivo
      referencia.delete().then(() => {
        resolve();
      }).catch(error => {
        reject(error);
      });
    });
  }



}


