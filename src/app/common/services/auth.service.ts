import { Injectable } from '@angular/core';
import {AngularFireAuth} from '@angular/fire/compat/auth'
import { FireStoreService } from './fire-store.service';

@Injectable({
  providedIn: 'root'
})
export class AuthServices {

  constructor(
    private servicioAngularFireAuth: AngularFireAuth,
    private servicioFirebase: FireStoreService
  ) {
  }

  //INICIAR SESION
  async iniciarSesionAuthServices(usCorr: string, paseUs:string){
    return await this.servicioAngularFireAuth.signInWithEmailAndPassword(usCorr,paseUs);
  }

  //CERRRAR SESION
  async servicioCerrarSesion(){
    return await this.servicioAngularFireAuth.signOut();
  }

  //REGISTRAR USUARIO CON CORREO Y CONTRASEÑA
  async registrarUsuarioRegistroAuthServices(correo:string, contraPase:string){//estaba pasando objeto usuarioI
    return await this.servicioAngularFireAuth.createUserWithEmailAndPassword(correo, contraPase).catch((error)=>{
      console.log("ERROR DE REGISTRO: ", error)
    });
  }

  //CONECTADO O NO
  estadoLogUsuario(){
    return this.servicioAngularFireAuth.authState;
  }
}
