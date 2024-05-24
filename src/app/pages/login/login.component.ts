import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Route, Router } from '@angular/router';
import { UsuarioI } from 'src/app/common/interfaces/usuarios.interface';
import { AuthServices } from 'src/app/common/services/auth.service';
import { InteractionService } from 'src/app/common/services/interaction.service';

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

  //INICIALIZAR CAMPOS
  inicializarCamposLogin(){
    this.formLogin = this.formBuilderLogin.group({
      correoUsuarioLogin: ['', [Validators.required, Validators.email]],
      paseUsuarioLogin:['', Validators.required]
    });
  }


  //CONSUMIENDO SERVICIOS AUTH INICIO DE SESION
  async iniciarSesion(){
    this.serviciosInteraccion.cargandoConMensaje("Ingresando")
    if(this.formLogin.valid){
      const resp= await this.llamaServiciosAut.iniciarSesionAuthServices(this.correoUsuarioLogin, this.paseUsuarioLogin)
      .catch((er)=>{
        const errorCode = er.code;
        const errorMessage = er.message;
        console.log("Error auth")
        this.serviciosInteraccion.mensajeGeneral("Inicio incorrecto. Correo o constraseña invalido");
        this.serviciosInteraccion.cerrarCargando();
        this.correoUsuarioLogin=""
        this.paseUsuarioLogin=""
      });
      if(resp){
        this.goToMenu();
        this.serviciosInteraccion.mensajeGeneral("Inicio correcto");
        this.serviciosInteraccion.cerrarCargando();
        this.inicializarCamposLogin();
        this.goToMenu();
      }


    }
  }

  //REDIRECCION A MENU
  goToMenu(){
    this.router.navigate(['/menu']);
    console.log("Autenticado")
  }



}
