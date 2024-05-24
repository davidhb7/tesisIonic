import { Component, OnInit } from '@angular/core';
import { DocumentData } from '@angular/fire/firestore';
import { ActivatedRoute, Router } from '@angular/router';
import { UsuarioI } from 'src/app/common/interfaces/usuarios.interface';
import { FireStoreService } from 'src/app/common/services/fire-store.service';
import { InteractionService } from 'src/app/common/services/interaction.service';

@Component({
  selector: 'app-usuario',
  templateUrl: './usuario.component.html',
  styleUrls: ['./usuario.component.scss'],
})
export class UsuarioComponent  implements OnInit {

  //OBJETOS
  usuario: UsuarioI;

  //VARIABLES
  idPresenteDeUsuario:string="";//VARIABLE A USAR ÁRA EL ID DEL USUARIO
  nombrePresente:string="";

  constructor(
    private fireStoreService: FireStoreService,//INYECTANDO DEPENDENCIA
    private route: ActivatedRoute,
    private serviciosInteraccion: InteractionService,
  ) {
    //RECIBE EL ID DEL USUARIO POR PARAMETRO DE ROUTE
    this.idPresenteDeUsuario=route.snapshot.params['idUsuario'];

    this.inicializarUsuarioVacio();
    this.getUsuarioPorID();


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

  async getUsuarioPorID(){
    this.serviciosInteraccion.cargandoConMensaje("Cargando");
    const response = await this.fireStoreService.getDocumentSolo('Usuarios',this.idPresenteDeUsuario);
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
    this.serviciosInteraccion.cerrarCargando();
  }

}
