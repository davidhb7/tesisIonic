import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ACTIVO, USUARIO } from 'src/app/commonFS/constantes/constantes';
import { UsuarioI } from 'src/app/commonFS/models-interfaceFS/usuarios.interface';
import { FireStoreService } from 'src/app/commonFS/servicesFS/fire-store.service';

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

  inicializarVacio(){
    this.nuevoUsuario = {
      idUsuario: '',
      cedulausuario:'',
      numeroReferenciaUsuario: 0,
      nombreUsuario: '',
      correoUsuario: '',
      celularUsuario: '',
      direccionUsuario: '',
      telefonoUsuario: '',
      clave: '',
      idRol: '',
      esActivo: '',
      fechaRegistro: ''
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

  inicializarUsuarioBase(){
    let fechaHoyString: string = `${this.fechaHoy.getDate()}/${this.fechaHoy.getMonth() + 1}/${this.fechaHoy.getFullYear()} ${this.fechaHoy.getHours()}:${this.fechaHoy.getMinutes()}`;
    this.nuevoUsuario = {
      idUsuario: this.fireStroreService.crearIDUnico(),
      cedulausuario:'',
      numeroReferenciaUsuario: null,
      nombreUsuario: '',
      correoUsuario: '',
      celularUsuario: '',
      direccionUsuario: '',
      telefonoUsuario: '',
      clave: this.nuevoUsuario.cedulausuario,
      idRol: USUARIO,
      esActivo: ACTIVO,
      fechaRegistro: fechaHoyString
    };
  }

  async guardarUsuario(){
    this.cargando=true;
    //await this.fireStroreService.crearDocumentoGeneralPorID(this.nuevoUsuario,'Usuarios', this.nuevoUsuario.idUsuario);
    console.log("si sirve")
    this.cargando=false;
    //this.router.navigate(["/usuarios"]);
  }

  submitForm() {
    if (this.form.valid) {
      console.log("ES VALIDO");
      //this.guardarUsuario();
    }
  }


}
