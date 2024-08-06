import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DocumentData } from '@angular/fire/firestore';
import { FireStoreService } from 'src/app/common/services/fire-store.service';
import { UsuarioI } from 'src/app/common/interfaces/usuarios.interface';
import { OperarioI } from 'src/app/common/interfaces/operario.interface';

@Component({
  selector: 'app-operador',
  templateUrl: './operador.component.html',
  styleUrls: ['./operador.component.scss'],
})
export class OperarioComponent  implements OnInit {

  //OBJETOS
  operario:OperarioI;

  //VARIABLES
  idPresenteOperario: string="";
  cargando: boolean=false;


  constructor(
    private router: Router,
    private routerActivate: ActivatedRoute,
    private serviciosFireStore: FireStoreService,
  ) {
    this.idPresenteOperario= routerActivate.snapshot.params['idOperador'];
    this.inicializarOperarioVacio();
    this.getOperarioId();
  }

  ngOnInit() {
    return;
  }

  //INICIALIZAR VACIO
  inicializarOperarioVacio(){
    this.operario={
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
      fechaRegistro: ''
    }
  }


  //TRAER OPERARIO CON ID
  async getOperarioId(){
    this.cargando=true;
    const response= await this.serviciosFireStore.getDocumentSolo("Usuarios", this.idPresenteOperario);
    const usuarioData: DocumentData = response.data();
    this.operario={
      idUsuario: usuarioData['idUsuario'] || '',
      identificacionUsuario:  usuarioData['cedulausuario'] ||'',
      numeroReferenciaUsuarioConsumidor: usuarioData['numeroReferenciaUsuario'] || 0,
      nombreUsuario: usuarioData['nombreUsuario'] || '',
      correoUsuario: usuarioData['correoUsuario'] || '',
      celularUsuario: usuarioData['celularUsuario'] || '',
      direccionUsuario: usuarioData['direccionUsuario'] || '',
      telefonoUsuario: usuarioData['telefonoUsuario'] || '',
      clave: usuarioData['clave'] || '',
      idRol: usuarioData['idRol'] || '',
      disponibleOperario: usuarioData['esActivo'] || true,
      esActivo: usuarioData['esActivo'] || true,
      asignacionesActivas:usuarioData['esActivo'] || true,
      fechaRegistro: usuarioData['fechaRegistro'] || ''
    }
    this.cargando=false;
  }



}
