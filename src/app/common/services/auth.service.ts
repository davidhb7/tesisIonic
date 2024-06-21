import { Injectable } from '@angular/core';
import {AngularFireAuth} from '@angular/fire/compat/auth'
import { getAuth } from '@angular/fire/auth';

@Injectable({
  providedIn: 'root'
})
export class AuthServices {

  constructor(
    private servicioAngularFireAuth: AngularFireAuth,
  ) {
  }

  async iniciarSesionAuthServices(usCorr: string, paseUs:string){
    return await this.servicioAngularFireAuth.signInWithEmailAndPassword(usCorr,paseUs);
  }


  async servicioCerrarSesion(){
    return await this.servicioAngularFireAuth.signOut();
  }



  //POR SI SE DAÑA AUTH
  async registrarUsuarioRegistroAuthServices(correo:string, conttraPase:string){//estaba pasando objeto usuarioI
    return await this.servicioAngularFireAuth.createUserWithEmailAndPassword(correo, conttraPase).catch((error)=>{
      console.log("ERROR DE REGISTRO: ", error)
    });
  }

  //CONECTADO O NO
  estadoLogUsuario(){
    return this.servicioAngularFireAuth.authState;
  }
}
