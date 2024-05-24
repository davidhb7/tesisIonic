import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ACTIVO, USUARIO } from 'src/app/common/constantes/constantes';
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

  formGroupRegistro: FormGroup;
  nuevoUsuario:UsuarioI;
  pase:string=""

  //----------------VARIABLES
  fechaHoy: Date = new Date();
  cargando:boolean=false;


  constructor(
    private fireStroreService:FireStoreService,
    private formBuilderRegistro: FormBuilder,
    private serviciosAuthe: AuthServices,
    private serviciosInteraccion: InteractionService,
    private router: Router,
  ) {
    this.inicializarVacio();
    this.inicializarUsuarioBase();

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
    this.formGroupRegistro = this.formBuilderRegistro.group({
      cedulausuario:['', (Validators.required, Validators.pattern('[0-9]*'))],
      nombreUsuario: ['', [Validators.required]],
      correoUsuario: ['', [Validators.required, Validators.email]],
      celularUsuario: ['', [Validators.required, Validators.pattern('[0-9]*')]],
      direccionUsuario: ['',[ Validators.required]],
      telefonoUsuario: ['', [Validators.pattern('[0-9]*')]],
    });
  }


  inicializarUsuarioBase(){
    let fechaHoyString: string = `${this.fechaHoy.getDate()}/${this.fechaHoy.getMonth() + 1}/${this.fechaHoy.getFullYear()} ${this.fechaHoy.getHours()}:${this.fechaHoy.getMinutes()}`;
    this.nuevoUsuario = {
      idUsuario: '',
      cedulausuario:'',
      numeroReferenciaUsuario: null,
      nombreUsuario: '',
      correoUsuario: '',
      celularUsuario: '',
      direccionUsuario: '',
      telefonoUsuario: '',
      clave: '',
      idRol: USUARIO,
      esActivo: ACTIVO,
      fechaRegistro: fechaHoyString
    };
  }

  async guardarUsuarioRegistro(){
    this.cargando=true;
    this.nuevoUsuario.clave=this.nuevoUsuario.cedulausuario;
    console.log("si sirve")
    console.log(this.nuevoUsuario)

    const resp= await this.serviciosAuthe.registrarUsuarioRegistroAuthServices(this.nuevoUsuario);
    if(resp){
      this.serviciosInteraccion.mensajeGeneral("Usuario registrado correctamente");
      this.nuevoUsuario.idUsuario=resp.user.uid;
      await this.fireStroreService.crearDocumentoGeneralPorID(this.nuevoUsuario,'Usuarios', resp.user.uid.toString());
      console.log( resp.user.uid)
      console.log(resp.user.uid.toString())
    }

    this.router.navigate(['/login']);
    this.cargando=false;

  }



}
