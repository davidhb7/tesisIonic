import { Injectable } from '@angular/core';
import { FireStoreService } from './fire-store.service';
import {AngularFireAuth} from '@angular/fire/compat/auth'
import { UsuarioI } from '../models-interfaceFS/usuarios.interface';

@Injectable({
  providedIn: 'root'
})
export class AuthServices {

  constructor(
    private angularFireAuth: AngularFireAuth,
  ) {

  }



  async credValUno(usCorr: string, paseUs:string){
    return await this.angularFireAuth.signInWithEmailAndPassword(usCorr,paseUs);
  }

  async salida(){
    return await this.angularFireAuth.signOut();
  }

  async registrarUsuarioRegistro(nuevoUsDatos: UsuarioI){
    return await this.angularFireAuth.createUserWithEmailAndPassword(nuevoUsDatos.correoUsuario, nuevoUsDatos.clave).catch((error)=>{
      console.log("ERROR DE REGISTRO S")
    });
  }


  estadoLogUsuario(){
    return this.angularFireAuth.authState;
  }
}
