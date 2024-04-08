import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Route, Router } from '@angular/router';
import { UsuarioI } from 'src/app/commonFS/models-interfaceFS/usuarios.interface';
import { AuthServices } from 'src/app/commonFS/servicesFS/auth.service';
import { InteractionService } from 'src/app/commonFS/servicesFS/interaction.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent  implements OnInit {

  formLogin: FormGroup;
  usuario:UsuarioI



  correoUsuarioLogin:string="";
  paseUsuarioLogin:string="";
  alertarError: boolean=false;


  constructor(
    private formBuilderLogin: FormBuilder,
    private llamaServiciosAut: AuthServices,
    private serviciosInteraccion: InteractionService,


    //INYECCION DE ROUTER. NAVEGACIONES
    private router: Router
  ) {
    this.inicializarCamposLogin()
  }

  ngOnInit() {
    return;
  }






  inicializarCamposLogin(){
    this.formLogin = this.formBuilderLogin.group({
      correoUsuarioLogin: ['', [Validators.required, Validators.email]],
      paseUsuarioLogin:['', Validators.required]
    });
  }


  async iniciarSesion(){
    this.serviciosInteraccion.cargandoGeneral("Ingresando")
    if(this.formLogin.valid){
      const resp= await this.llamaServiciosAut.credValUno(this.correoUsuarioLogin, this.paseUsuarioLogin)
      .catch((er)=>{
        const errorCode = er.code;
        const errorMessage = er.message;
        console.log("Error auth")
        this.serviciosInteraccion.mensajeGeneral("Inicio incorrecto. Correo o constraseña invalido");
        this.serviciosInteraccion.cerrarCargando();
        this.correoUsuarioLogin=""
        this.paseUsuarioLogin=""
      })
      ;
      if(resp){
        this.goToMenu();
        this.serviciosInteraccion.mensajeGeneral("Inicio correcto");
        this.serviciosInteraccion.cerrarCargando();
        this.inicializarCamposLogin();
        this.goToMenu();
      }


    }
  }

  goToMenu(){
    this.router.navigate(['/menu']);
    console.log("autenticado")
  }



}
