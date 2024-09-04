import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Route, Router } from '@angular/router';
import { UsuarioI } from 'src/app/common/interfaces/usuarios.interface';
import { AuthServices } from 'src/app/common/services/auth.service';
import { FireStoreService } from 'src/app/common/services/fire-store.service';
import { InteractionService } from 'src/app/common/services/interaction.service';
import { LocalStorageService } from 'src/app/common/services/local-storage.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent  implements OnInit {

  //OBJETOS Y CLASES
  formLogin: FormGroup;


  //VARIABVLES
  correoUsuarioLogin:string="";
  paseUsuarioLogin:string="";
  alertarError: boolean=false;
  //documentoLocal:UsuarioI;


  constructor(
    //FORMULARIO
    private formBuilderLogin: FormBuilder,
    //CONSULTAS
    private llamaServiciosAut: AuthServices,
    private servicioFireStore: FireStoreService,
    //LOCAL STORAGE
    private servicioLocalStorage: LocalStorageService,
    //INTERACCION CON USUARIO
    private serviciosInteraccion: InteractionService,
    //INYECCION DE ROUTER. NAVEGACIONES
    private router: Router
  ) {

    this.inicializarCamposLogin();
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
        console.log("Error autenticacion: ", er)
        this.serviciosInteraccion.mensajeGeneral("Inicio incorrecto. Correo o constraseña invalido");
        this.serviciosInteraccion.cerrarCargando();
        this.formLogin.reset();
      });
      if(resp){
        this.servicioFireStore.getUsuarioPorCorreoEnLogin<UsuarioI>(this.correoUsuarioLogin).subscribe({
          next:async documentoCorreo=>{
            this.servicioLocalStorage.limpiarTodoLocalStorage();
            this.servicioLocalStorage.guardarDatosEnLocalStorage(documentoCorreo);
            this.serviciosInteraccion.mensajeGeneral("Inicio correcto");
            this.serviciosInteraccion.cerrarCargando();
            this.inicializarCamposLogin();
            this.servicioLocalStorage.cargarLocalStorage();
            this.goToMenu();
          }
        })

      }


    }
  }

  //REDIRECCION A MENU
  goToMenu(){
    this.router.navigate(['/menu']);
  }





}
