import { Injectable } from '@angular/core';
import {AngularFireAuth} from '@angular/fire/compat/auth'
import { UsuarioI } from '../interfaces/usuarios.interface';

@Injectable({
  providedIn: 'root'
})
export class AuthServices {

  constructor(
    private angularFireAuth: AngularFireAuth,
  ) {
  }

  async iniciarSesionAuthServices(usCorr: string, paseUs:string){
    return await this.angularFireAuth.signInWithEmailAndPassword(usCorr,paseUs);
  }

  async salida(){
    return await this.angularFireAuth.signOut();
  }

  async registrarUsuarioRegistroAuthServices(nuevoUsDatos: UsuarioI){
    return await this.angularFireAuth.createUserWithEmailAndPassword(nuevoUsDatos.correoUsuario, nuevoUsDatos.clave).catch((error)=>{
      console.log("ERROR DE REGISTRO: ", error)
    });
  }

  estadoLogUsuario(){
    return this.angularFireAuth.authState;
  }
}
