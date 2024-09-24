import { Component, OnInit } from '@angular/core';
import { DocumentData } from '@angular/fire/firestore';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ACTIVO, USUARIO_CONSUMIDOR } from 'src/app/common/constant/constantes';
import { UsuarioI } from 'src/app/common/interfaces/usuarios.interface';
import { AuthServices } from 'src/app/common/services/auth.service';
import { FireStoreService } from 'src/app/common/services/fire-store.service';
import { InteractionService } from 'src/app/common/services/interaction.service';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.component.html',
  styleUrls: ['./registro.component.scss'],
})
export class RegistroComponent  implements OnInit {


  //OBJETOS-CLASES
  formGroupRegistro: FormGroup;
  nuevoUsuario:UsuarioI;


  //----------------VARIABLES
  fechaHoy: Date = new Date();
  cargando:boolean=false;
  pase:string=""
  idPresenteParaEditar:string="";
  paraEditarUsuario:boolean=false;


  constructor(

    private formBuilderRegistro: FormBuilder,
    private serviciosAuthe: AuthServices,
    private serviciosFireStore:FireStoreService,
    private serviciosInteraccion: InteractionService,
    private router: Router,
    private routerActivate: ActivatedRoute,
  ) {
    this.idPresenteParaEditar=routerActivate.snapshot.params['idUsuario'];
    this.editarO_Guardar();
    this.inicializarVacio();
    this.editar_o_crear();

  }

  ngOnInit() {
    return;
  }


  //INICIALIZAR USUARIO VACIO
  inicializarVacio(){
    this.nuevoUsuario = {
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
    };
    this.formGroupRegistro = this.formBuilderRegistro.group({
      cedulausuario:['', (Validators.required, Validators.pattern('[0-9]*'))],
      nombreUsuario: ['', [Validators.required]],
      correoUsuario: ['', [Validators.required, Validators.email]],
      celularUsuario: ['', [Validators.required, Validators.pattern('[0-9]*')]],
      direccionUsuario: ['',[ Validators.required]],
      telefonoUsuario: ['', [Validators.pattern('[0-9]*')]],
    });
  }

  //INICIALIZAR USUARIO CON DATOS BASICOS
  inicializarUsuarioBase(){
    let fechaHoyString: string = `${this.fechaHoy.getDate()}/${this.fechaHoy.getMonth() + 1}/${this.fechaHoy.getFullYear()} ${this.fechaHoy.getHours()}:${this.fechaHoy.getMinutes()}`;
    this.nuevoUsuario = {
      idUsuario: '',
      identificacionUsuario:'',
      numeroReferenciaUsuarioConsumidor: null,
      nombreUsuario: '',
      correoUsuario: '',
      celularUsuario: '',
      direccionUsuario: '',
      telefonoUsuario: '',
      clave: '',
      idRol: USUARIO_CONSUMIDOR,
      disponibleOperario:true,
      esActivo: true,
      asignacionesActivas:0,
      fechaRegistro: fechaHoyString,
      fotoAvatar:'',
    };
  }

  //EDITAR O CREAR SEGUN PARAMETRO ID USUARIO
  async editar_o_crear(){
    if(this.idPresenteParaEditar!=null || this.idPresenteParaEditar!=undefined){
      this.serviciosInteraccion.cargandoConMensaje("Cargando");
      const response = await this.serviciosFireStore.getDocumentSolo('Usuarios',this.idPresenteParaEditar);
      const usuarioData: DocumentData = response.data();
      this.nuevoUsuario = {
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
        disponibleOperario:usuarioData['esActivo'] || '',
        esActivo: usuarioData['esActivo'] || '',
        asignacionesActivas:usuarioData['esActivo'] || 0,
        fechaRegistro: usuarioData['fechaRegistro'] || '',
        fotoAvatar:usuarioData['fotoAvatar'] || '',

      }
      this.serviciosInteraccion.cerrarCargando();
    }
    else{
      this.inicializarUsuarioBase();
    }

  }

  //GUARDAR USUARIO NUEVO
  async guardarUsuarioRegistro(){
    this.cargando=true;
    this.nuevoUsuario.clave=this.nuevoUsuario.identificacionUsuario;
    const resp= await this.serviciosAuthe.registrarUsuarioRegistroAuthServices(this.nuevoUsuario.correoUsuario, this.nuevoUsuario.clave);
    if(resp){
      this.serviciosInteraccion.mensajeGeneral("Usuario registrado correctamente");
      this.nuevoUsuario.idUsuario=resp.user.uid;
      await this.serviciosFireStore.crearDocumentoGeneralPorID(this.nuevoUsuario,'Usuarios', resp.user.uid.toString());
      console.log( resp.user.uid)
      console.log(resp.user.uid.toString())
    }
    this.router.navigate(['/login']);
    this.cargando=false;
  }

  //EN ESTADO DE EDICION, SE MUESTRA Y EJECUTA EL BOTON GUARDAR EDICION
  async guardarEdicion(){
    this.cargando=true;
    this.serviciosInteraccion.cargandoConMensaje("Guardando datos de usuario")//Interacciones del proceso
    await this.serviciosFireStore.actualizarDocumentoPorID(this.nuevoUsuario,'Usuarios',this.idPresenteParaEditar);
    this.cargando=false;
    this.serviciosInteraccion.mensajeGeneral("Datos guardados.");
    this.serviciosInteraccion.cerrarCargando();
    await this.router.navigate(["/usuarios"]);
  }


  //RECTIFICA SI ES PARA EDITAR O CREAR
  editarO_Guardar(){
    if(this.idPresenteParaEditar!=null || this.idPresenteParaEditar!=undefined){
      this.paraEditarUsuario=true;
    }
    else{
      this.paraEditarUsuario=false;
    }
  }




}
