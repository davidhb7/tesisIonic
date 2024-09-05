import { Component, OnInit } from '@angular/core';
import { DocumentData } from '@angular/fire/firestore';
import { ActivatedRoute, Router } from '@angular/router';
import { UsuarioI } from 'src/app/common/interfaces/usuarios.interface';
import { FireStoreService } from 'src/app/common/services/fire-store.service';
import { InteractionService } from 'src/app/common/services/interaction.service';
import { FireStorageService } from 'src/app/common/services/fire-storage.service';

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
  urlFotoAvatar="";

  constructor(
    private servicioFireStore: FireStoreService,//INYECTANDO DEPENDENCIA
    private servicioFireStorage: FireStorageService,
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

  async getUsuarioPorID(){
    this.serviciosInteraccion.cargandoConMensaje("Cargando");
    const response = await this.servicioFireStore.getDocumentSolo('Usuarios',this.idPresenteDeUsuario);
    const usuarioData: DocumentData = response.data();
    this.usuario = {
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
      asignacionesActivas: usuarioData['esActivo'] || 0,
      fechaRegistro: usuarioData['fechaRegistro'] || '',
      fotoAvatar:usuarioData['fotoAvatar'] || ''
    }
    this.serviciosInteraccion.cerrarCargando();
  }

  async subirFotoAvatar(event:any){
    const nombreRutaCarpetaStorage=this.usuario.correoUsuario;
    const nombreFotoEnStorage="fotoAvatar"+this.usuario.nombreUsuario;
    const archivo= event.target.files[0];
    this.serviciosInteraccion.cargandoConMensaje("Cargando foto.")
    const res = await this.servicioFireStorage.cargarFotoFireStorage(archivo, nombreRutaCarpetaStorage, nombreFotoEnStorage );
    this.usuario.fotoAvatar=res;
    this.urlFotoAvatar=res.toString();
    console.log(this.usuario.fotoAvatar);
    console.log("link", res, "id: ", this.idPresenteDeUsuario)
    this.servicioFireStore.actualizarCampoDocumento("Usuarios", this.idPresenteDeUsuario,"fotoAvatar",this.urlFotoAvatar).subscribe(()=>{
      console.log("Foto guardada...");
    });
    this.serviciosInteraccion.mensajeGeneral("Listo");
    this.serviciosInteraccion.cerrarCargando();
  }

}
