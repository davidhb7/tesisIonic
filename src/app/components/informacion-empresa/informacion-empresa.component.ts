import { Component, OnInit } from '@angular/core';
import { DocumentData } from 'firebase/firestore';
import { EMPRESA, OPERADOR } from 'src/app/common/constant/constantes';
import { UsuarioI } from 'src/app/common/interfaces/usuarios.interface';

import { FireStoreService } from 'src/app/common/services/fire-store.service';
import { InteractionService } from 'src/app/common/services/interaction.service';

@Component({
  selector: 'app-informacion-empresa',
  templateUrl: './informacion-empresa.component.html',
  styleUrls: ['./informacion-empresa.component.scss'],
})
export class InformacionEmpresaComponent  implements OnInit {

  //OBJETOS
  usuario: UsuarioI;


  constructor(
    private servicioFireStore: FireStoreService,//INYECTANDO DEPENDENCIA
    private serviciosInteraccion: InteractionService,
  ) {
    this.inicializarUsuarioVacio();
    this.getUsusarioLocal();
  }

  ngOnInit() {
    return;
  }

  inicializarUsuarioVacio(){
    this.usuario = {
      idUsuario: '',
      identificacionUsuario:'',
      numeroReferenciaUsuarioConsumidor: 0,
      nombreUsuario: '',
      correoUsuario: '',
      celularUsuario: '',
      direccionUsuario: '',
      telefonoUsuario: '',
      clave: '',
      idRol: '',
      disponibleOperario:true,
      esActivo: true,
      asignacionesActivas:0,
      fechaRegistro: '',
      fotoAvatar:''
    }
  }

  // async getEmpresa(){
  //   // const response = await this.servicioFireStore.getDocumentSolo('Usuarios',this.idPresenteDeUsuario);
  //   const response = await this.servicioFireStore.getUsuarioSegunRol<UsuarioI>(EMPRESA)
  //   const usuarioData: DocumentData = response.data()
  //   this.usuario = {
  //     idUsuario: usuarioData['idUsuario'] || '',
  //     identificacionUsuario:  usuarioData['cedulausuario'] ||'',
  //     numeroReferenciaUsuarioConsumidor: usuarioData['numeroReferenciaUsuario'] || 0,
  //     nombreUsuario: usuarioData['nombreUsuario'] || '',
  //     correoUsuario: usuarioData['correoUsuario'] || '',
  //     celularUsuario: usuarioData['celularUsuario'] || '',
  //     direccionUsuario: usuarioData['direccionUsuario'] || '',
  //     telefonoUsuario: usuarioData['telefonoUsuario'] || '',
  //     clave: usuarioData['clave'] || '',
  //     idRol: usuarioData['idRol'] || '',
  //     disponibleOperario: usuarioData['esActivo'] || true,
  //     esActivo: usuarioData['esActivo'] || true,
  //     asignacionesActivas: usuarioData['esActivo'] || 0,
  //     fechaRegistro: usuarioData['fechaRegistro'] || '',
  //     fotoAvatar:usuarioData['fotoAvatar'] || ''
  //   }
  //   console.log(this.usuario);
  // }

  async getUsusarioLocal() {

    this.servicioFireStore.getUsuarioSegunRol<UsuarioI>(EMPRESA).subscribe({

      next: (doc: UsuarioI | null) => {
        this.usuario = doc; // Asigna el documento directamente a this.usuario
      },
      error: (err) => {
        console.error('Error al obtener el usuario:', err);
      },
    });
  }


}
