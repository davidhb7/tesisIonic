import { Component } from '@angular/core';
import { UsuarioI } from '../common/interfaces/usuarios.interface';
import { FireStoreService } from '../common/services/fire-store.service';

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
    this.fireStoreService.getDocumentosGeneralAtentoCambios<UsuarioI>('Usuarios').subscribe(
      data=>{
        if(data){
          this.usuarios= data;
        }
      }
    );
  }


}
