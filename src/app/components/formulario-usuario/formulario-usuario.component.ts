import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ACTIVO, USUARIO_CONSUMIDOR } from 'src/app/common/constant/constantes';
import { UsuarioI } from 'src/app/common/interfaces/usuarios.interface';
import { FireStoreService } from 'src/app/common/services/fire-store.service';

@Component({
  selector: 'app-formulario-usuario',
  templateUrl: './formulario-usuario.component.html',
  styleUrls: ['./formulario-usuario.component.scss'],
})
export class FormularioUsuarioComponent  implements OnInit {


  form: FormGroup;
  nuevoUsuario:UsuarioI

  //----------------VARIABLES
  fechaHoy: Date = new Date();
  cargando:boolean=false;

  constructor(
    private fireStroreService:FireStoreService,
    private formBuilder: FormBuilder,
    private router: Router,
  ) {
    this.inicializarVacio();
    //DECLARACION DE CAMPOS REQUIERIDOS Y FORMATOS


  }

  ngOnInit() {
    return;
  }

  //INICIALIZAR USUARIO VACIO Y VALIDACIONES
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
      fotoAvatar:''
    };
    this.form = this.formBuilder.group({
      cedulausuario:['', Validators.required, Validators.pattern('[0-9]*')],
      nombreUsuario: ['', Validators.required],
      correoUsuario: ['', [Validators.required, Validators.email]],
      celularUsuario: ['', Validators.required, Validators.pattern('[0-9]*')],
      direccionUsuario: ['', Validators.required],
      telefonoUsuario: ['', Validators.pattern('[0-9]*')],
    });
  }

  //INICIALIZAR USUARIO BASE
  inicializarUsuarioBase(){
    let fechaHoyString: string = `${this.fechaHoy.getDate()}/${this.fechaHoy.getMonth() + 1}/${this.fechaHoy.getFullYear()} ${this.fechaHoy.getHours()}:${this.fechaHoy.getMinutes()}`;
    this.nuevoUsuario = {
      idUsuario: this.fireStroreService.crearIDUnico(),
      identificacionUsuario:'',
      numeroReferenciaUsuarioConsumidor: null,
      nombreUsuario: '',
      correoUsuario: '',
      celularUsuario: '',
      direccionUsuario: '',
      telefonoUsuario: '',
      clave: this.nuevoUsuario.identificacionUsuario,
      idRol: USUARIO_CONSUMIDOR,
      disponibleOperario:true,
      esActivo: true,
      asignacionesActivas:0,
      fechaRegistro: fechaHoyString,
      fotoAvatar:''
    };
  }

  //GUARDAR USUARIO
  async guardarUsuario(){
    this.cargando=true;
    //await this.fireStroreService.crearDocumentoGeneralPorID(this.nuevoUsuario,'Usuarios', this.nuevoUsuario.idUsuario);
    console.log("si sirve")
    this.cargando=false;
    //this.router.navigate(["/usuarios"]);
  }

  //GUARDAR?
  submitForm() {
    if (this.form.valid) {
      console.log("ES VALIDO");
      //this.guardarUsuario();
    }
  }


}
