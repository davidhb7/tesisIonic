import { Component } from '@angular/core';
import { UsuarioI } from '../commonFS/models-interfaceFS/usuarios.interface';
import { FireStoreService } from '../commonFS/servicesFS/fire-store.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomeComponent {


  usuarios: UsuarioI[]=[];


  constructor(
    private fireStoreService: FireStoreService//INYECTANDO DEPENDENCIA DE FIREBASE
    ) {
    this.cargarUsuarios();
  }

  //GET USUARIOS GENERAL
  cargarUsuarios(){
    this.fireStoreService.getCambiosYListar<UsuarioI>('Usuarios').subscribe(
      data=>{
        if(data){
          this.usuarios= data;
        }
      }
    );
  }


}
