import { Component, OnInit } from '@angular/core';
import { DocumentData } from '@angular/fire/firestore';
import { ActivatedRoute, Router } from '@angular/router';
import { UsuarioI } from 'src/app/commonFS/models-interfaceFS/usuarios.interface';
import { FireStoreService } from 'src/app/commonFS/servicesFS/fire-store.service';

@Component({
  selector: 'app-usuario',
  templateUrl: './usuario.component.html',
  styleUrls: ['./usuario.component.scss'],
})
export class UsuarioComponent  implements OnInit {

  usuario: UsuarioI;

  idPresente:string

  constructor(
    private fireStoreService: FireStoreService,//INYECTANDO DEPENDENCIA
    route: ActivatedRoute
  ) {
    this.idPresente=route.snapshot.params['idUsuario'];
    console.log(this.idPresente)
    this.inicializarUsuarioVacio();
    //this.getReporte();
    console.log(this.usuario);

  }

  ngOnInit() {
    return;
  }

  inicializarUsuarioVacio(){
    this.usuario = {
      idUsuario: "",
      cedulausuario:'',
      numeroReferenciaUsuario: 0,
      nombreUsuario: "",
      correoUsuario: "",
      celularUsuario: "",
      direccionUsuario: "",
      telefonoUsuario: "",
      clave: "",
      idRol: '',
      esActivo: "",
      fechaRegistro: ""
    }
  }

  async getReporte(){
    const response = await this.fireStoreService.getDocumentSolo('Usuarios',this.idPresente);
    const usuarioData: DocumentData = response.data();
    this.usuario = {
      idUsuario: usuarioData['idUsuario'] || '',
      cedulausuario:  usuarioData['cedulausuario'] ||'',
      numeroReferenciaUsuario: usuarioData['numeroReferenciaUsuario'] || 0,
      nombreUsuario: usuarioData['nombreUsuario'] || '',
      correoUsuario: usuarioData['correoUsuario'] || '',
      celularUsuario: usuarioData['celularUsuario'] || '',
      direccionUsuario: usuarioData['direccionUsuario'] || '',
      telefonoUsuario: usuarioData['telefonoUsuario'] || '',
      clave: usuarioData['clave'] || '',
      idRol: usuarioData['idRol'] || '',
      esActivo: usuarioData['esActivo'] || '',
      fechaRegistro: usuarioData['fechaRegistro'] || ''
    }
  }


}
