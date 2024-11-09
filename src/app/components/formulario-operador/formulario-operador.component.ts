import { Component, OnInit } from '@angular/core';
import { DocumentData } from '@angular/fire/firestore';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { OPERADOR } from 'src/app/common/constant/constantes';
import { OperarioI } from 'src/app/common/interfaces/operario.interface';
import { UsuarioI } from 'src/app/common/interfaces/usuarios.interface';
import { AuthServices } from 'src/app/common/services/auth.service';
import { FireStoreService } from 'src/app/common/services/fire-store.service';
import { InteractionService } from 'src/app/common/services/interaction.service';

@Component({
  selector: 'app-formulario-operador',
  templateUrl: './formulario-operador.component.html',
  styleUrls: ['./formulario-operador.component.scss'],
})
export class FormularioOperadorComponent  implements OnInit {

  //OBJETOS
  nuevoUsuarioOperario:OperarioI
  formGroupOperador: FormGroup;
  fechaHoy: Date = new Date();

  //VARIABLES
  cargando:boolean=false;
  idPresenteOperario:string;

  constructor(
    private formBuilderOperador: FormBuilder,
    private serviciosAuthentication: AuthServices,
    private servicioFireStore:FireStoreService,
    private serviciosInteraccion: InteractionService,
    private router: Router,
    private routerActivate: ActivatedRoute,

  ) {
    this.idPresenteOperario=routerActivate.snapshot.params['idUsuario'];
    this.inicializarOperadorVacioValidaciones();
    this.iniciaizarOperadorBase();
    this.editar_o_crear();
  }

  ngOnInit() {
    return;
  }


  //INICIALIZAR OPERADOR VACIO Y VALIDACIONES
  inicializarOperadorVacioValidaciones(){
    this.nuevoUsuarioOperario = {
      idUsuario: '',
      identificacionUsuario:'',
      numeroReferenciaUsuarioConsumidor: 0,
      nombreUsuario: '',
      correoUsuario: '',
      celularUsuario: '',
      direccionUsuario: '',
      telefonoUsuario: '',
      clave: '',
      idRol: OPERADOR,
      disponibleOperario:true,
      esActivo: true,
      asignacionesActivas:0,
      fechaRegistro: ''
    };
    this.formGroupOperador = this.formBuilderOperador.group({
      nombreUsuario: ['', Validators.required],
      correoUsuario: ['', [Validators.required, Validators.email]],
      celularUsuario: ['', (Validators.required, Validators.pattern('[0-9]*'))],
      identificacionUsuario: ['', (Validators.required, Validators.pattern('[0-9]*'))],
    });
  }

  //USUARIO OPERADOR BASE CON ALGUNOS DATOS:
  iniciaizarOperadorBase(){
    let fechaHoyString: string = `${this.fechaHoy.getDate()}/${this.fechaHoy.getMonth() + 1}/${this.fechaHoy.getFullYear()} ${this.fechaHoy.getHours()}:${this.fechaHoy.getMinutes()}`;
    this.nuevoUsuarioOperario = {
      idUsuario: '',
      identificacionUsuario:'',
      numeroReferenciaUsuarioConsumidor: 0,
      nombreUsuario: '',
      correoUsuario: '',
      celularUsuario: '',
      direccionUsuario: '',
      telefonoUsuario: '',
      clave: '',
      idRol: OPERADOR,
      disponibleOperario:true,
      asignacionesActivas:0,
      esActivo: true,
      fechaRegistro: fechaHoyString
    };
  }

  //GUARDAR OPERARIO
  async guardarOperador(){
    try{
      this.cargando=true;
      this.nuevoUsuarioOperario.clave=this.nuevoUsuarioOperario.identificacionUsuario;
      const resp= await this.serviciosAuthentication.registrarUsuarioRegistroAuthServices(this.nuevoUsuarioOperario.correoUsuario, this.nuevoUsuarioOperario.clave);
      if(resp){
        this.nuevoUsuarioOperario.idUsuario=resp.user.uid;
        await this.servicioFireStore.crearDocumentoGeneralPorID(this.nuevoUsuarioOperario,'Usuarios', resp.user.uid.toString());
        this.inicializarOperadorVacioValidaciones();
        this.formGroupOperador.reset();
      }
      this.router.navigate(['/operarios']);
      this.cargando=false;

    }catch(err){
      console.log("No guardó: "+err)
    }
  }


  //EDITAR O CREAR SEGUN ID
  async editar_o_crear(){
    if(this.idPresenteOperario!=null || this.idPresenteOperario!=undefined || this.idPresenteOperario==""){
      this.cargando=true;
      const response= await this.servicioFireStore.getDocumentSolo("Usuarios", this.idPresenteOperario);
      const usuarioData: DocumentData = response.data();
      console.log("EDITAR");
      this.nuevoUsuarioOperario={
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
        asignacionesActivas: usuarioData['esActivo'] || true,
        fechaRegistro: usuarioData['fechaRegistro'] || ''
      }
      this.cargando=false;
    }else{
      console.log("CREAR: ", this.idPresenteOperario)
      this.iniciaizarOperadorBase();
    }
  }



}
