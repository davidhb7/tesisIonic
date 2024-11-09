import { Injectable } from '@angular/core';
import {AngularFireAuth, } from '@angular/fire/compat/auth'
import { FireStoreService } from './fire-store.service';
import { EmailAuthProvider, getAuth, reauthenticateWithCredential, updatePassword } from 'firebase/auth';
import { throwError } from 'rxjs';

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
    return await this.servicioAngularFireAuth.createUserWithEmailAndPassword(correo, contraPase);
  }

  //REAUTENTICARSE AUTOMATICAMENTE
  async reIngresar(passActual:string){
    const auth = getAuth();
    const user = auth.currentUser;
    if (!user) return throwError('No hay usuario autenticado.');
    const credential = EmailAuthProvider.credential(user.email, passActual);
    return reauthenticateWithCredential(user, credential)
      .catch(error => {
        console.error("Error en la reautenticación:", error);
        return throwError(error);
      });
  }

  //PARA CAMBIAR CONTRASEÑA
  async cambiarPass(nuevaPass:string){
    const auth = getAuth();
    const user = auth.currentUser;
    console.log("usuario actual: ", user);
    console.log("nueva contra: ", nuevaPass);
    return await updatePassword(user,nuevaPass);
  }

  //OBTENCION DE LINK PARA RECUPERAR CONTRASEÑA
  recuperarPass(correo:string){
    return this.servicioAngularFireAuth.sendPasswordResetEmail(correo);
  }

  //CONECTADO O NO
  estadoLogUsuario(){
    return this.servicioAngularFireAuth.authState;
  }



}
