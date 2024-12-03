import { Component, OnInit } from '@angular/core';
import { DocumentData } from '@angular/fire/firestore';
import { ActivatedRoute, Router } from '@angular/router';
import { UsuarioI } from 'src/app/common/interfaces/usuarios.interface';
import { FireStoreService } from 'src/app/common/services/fire-store.service';
import { InteractionService } from 'src/app/common/services/interaction.service';
import { FireStorageService } from 'src/app/common/services/fire-storage.service';
import { LocalStorageService } from 'src/app/common/services/local-storage.service';

@Component({
  selector: 'app-usuario',
  templateUrl: './usuario.component.html',
  styleUrls: ['./usuario.component.scss'],
})
export class UsuarioComponent  implements OnInit {

  //OBJETOS
  usuario: UsuarioI;
  usuarioLocal: UsuarioI;

  //VARIABLES
  idPresenteDeUsuario:string="";//VARIABLE A USAR ÁRA EL ID DEL USUARIO
  nombrePresente:string="";
  urlFotoAvatar="";
  verPerfil:boolean=false;

  constructor(
    private servicioFireStore: FireStoreService,//INYECTANDO DEPENDENCIA
    private servicioFireStorage: FireStorageService,
    private route: ActivatedRoute,
    private serviciosInteraccion: InteractionService,
    private servicioLocalStorage: LocalStorageService,
    private router: Router,
  ) {
    //RECIBE EL ID DEL USUARIO POR PARAMETRO DE ROUTE
    this.idPresenteDeUsuario=route.snapshot.params['idUsuario'];
    this.traerUSLocal();
    this.getUsuarioPorID();
    this.inicializarUsuarioVacio();



  }

  ngOnInit() {
    return;
  }

  //INICIALIZACION VACIA DE USUARIO
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
      fotoAvatar:'',
    }

    this.usuarioLocal = {
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
      fotoAvatar:'',
    }


  }


  //TRAE USUARIO POR ID
  async getUsuarioPorID(){
    const response = await this.servicioFireStore.getDocumentSolo('Usuarios',this.idPresenteDeUsuario);
    const usuarioData: DocumentData = response.data();
    this.usuario = {
      idUsuario: usuarioData['idUsuario'] || '',
      identificacionUsuario:  usuarioData['identificacionUsuario'] ||'',
      numeroReferenciaUsuarioConsumidor: usuarioData['numeroReferenciaUsuarioConsumidor'] || 0,
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
      fotoAvatar:usuarioData['fotoAvatar'] || '',
    }
  }

  //CONSULTA EL USUARIO Y OTORGA/QUITA PERMISOS DE ROL
  async traerUSLocal() {
    try {
      const response = await this.servicioLocalStorage.getDatosDeLocalStorage();
      if (response) {
        const usuarioData: DocumentData = response;
        this.usuarioLocal = {
          idUsuario: usuarioData['idUsuario'] || '',
          identificacionUsuario: usuarioData['identificacionUsuario'] || '',
          numeroReferenciaUsuarioConsumidor: usuarioData['numeroReferenciaUsuarioConsumidor'] || 0,
          nombreUsuario: usuarioData['nombreUsuario'] || '',
          correoUsuario: usuarioData['correoUsuario'] || '',
          celularUsuario: usuarioData['celularUsuario'] || '',
          direccionUsuario: usuarioData['direccionUsuario'] || '',
          telefonoUsuario: usuarioData['telefonoUsuario'] || '',
          clave: usuarioData['clave'] || '',
          idRol: usuarioData['idRol'] || '',
          disponibleOperario: usuarioData['disponibleOperario'] || true,
          esActivo: usuarioData['esActivo'] || true,
          asignacionesActivas: usuarioData['asignacionesActivas'] || 0,
          fechaRegistro: usuarioData['fechaRegistro'] || '',
          fotoAvatar:usuarioData['fotoAvatar'] || '',
        };
      }
    } catch (error) {
      console.error('Error al traer el usuario del LocalStorage:', error);
    }
    this.paraVerPerfil();
  }

  //CAMBIO FOTO AVATAR
  async subirFotoAvatar(event:any){
    const nombreRutaCarpetaStorage=this.usuario.correoUsuario;
    const nombreFotoEnStorage="fotoAvatar"+this.usuario.nombreUsuario;
    const archivo= event.target.files[0];
    this.serviciosInteraccion.cargandoConMensaje("Cargando foto.")
    const res = await this.servicioFireStorage.cargarFotoFireStorage(archivo, nombreRutaCarpetaStorage, nombreFotoEnStorage );
    this.usuario.fotoAvatar=res;
    this.urlFotoAvatar=res.toString();
    this.servicioFireStore.actualizarCampoDocumento("Usuarios", this.idPresenteDeUsuario,"fotoAvatar",this.urlFotoAvatar).subscribe(()=>{
      console.log("Foto guardada...");
    });
    this.serviciosInteraccion.mensajeGeneral("Listo");
    this.serviciosInteraccion.cerrarCargando();
  }

  paraVerPerfil(){
    if(this.idPresenteDeUsuario===this.usuarioLocal.idUsuario){
      this.verPerfil=true;
    }
    else{
      this.verPerfil=false;
    }
  }

  //EDITAR
  redireccionarParaEditar(idUsuario:string){
    this.router.navigate(['/formulario-registro',idUsuario])
  }

  //CAMBIAR PASSWORD
  redireccionarParaCambiarPass(){
    this.router.navigate(['/cambiar-pass'])
  }



}
