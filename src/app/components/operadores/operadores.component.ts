import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { OPERADOR } from 'src/app/common/constant/constantes';
import { OperarioI } from 'src/app/common/interfaces/operario.interface';
import { UsuarioI } from 'src/app/common/interfaces/usuarios.interface';
import { AuthServices } from 'src/app/common/services/auth.service';
import { FireStoreService } from 'src/app/common/services/fire-store.service';

@Component({
  selector: 'app-operadores',
  templateUrl: './operadores.component.html',
  styleUrls: ['./operadores.component.scss'],
})
export class OperariosComponent  implements OnInit {

  //OBJETOS
  operariosRegistrdos:UsuarioI[]=[];


  //VARIABLES
  cargando:boolean=false;
  mensajeNoHay:string;



  constructor(
    private router: Router,
    private serviciosFireStore: FireStoreService,//INYECTANDO DEPENDENCIA
    private serviciosAuthFirebase: AuthServices
  ) {
    //this.getOperariosRegistrados();
    this.getUsuariosRolOperario();
  }

  ngOnInit() {
    return;
  }

  //TRAER LOS USUARIOS CON ROL OPERARIO
  getUsuariosRolOperario(){
    this.serviciosFireStore.getUsuariosSegunRol<UsuarioI>(OPERADOR).subscribe({
      next:documentosRolOperario=>{
        this.operariosRegistrdos=documentosRolOperario;
        if(this.operariosRegistrdos.length<=0){
          this.mensajeNoHay ="NO HAY OPERARIOS"
        }
        else if(this.operariosRegistrdos.length>0){
          this.mensajeNoHay =""
        }
      }
    });
  }

  //TRAER TODOS LOS OPERARIOS REGISTRADOS EN LA EMPRESA
  getOperariosRegistrados(){
    this.serviciosFireStore.getDocumentosGeneralAtentoCambios<UsuarioI>("Usuarios").subscribe(
      data=>{
        if(data){
          this.operariosRegistrdos=data;
          console.log("Respuesta general: ",data)
        }
      }
    )
  }

  //CREAR
  //REDIRECCION A FORMULARIO, CREAR OPERARIO DESDE LA EMPRESA
  irFormularioOperador(){
    this.router.navigate(['/formulario-operador'])
  }

  //ELIMINAR OPERARIO POR ID
  async eliminarUsuario(operarioEliminar: UsuarioI){
    this.cargando=true;
    console.log(operarioEliminar.idUsuario)
    await this.serviciosFireStore.eliminarDocPorID( 'Usuarios',operarioEliminar.idUsuario);
    this.cargando=false;
  }

  //VER OPERARIO POR ID. REDIRECCIONAR
  //REDIRECCIONAR A VER USUARIO POR ID
  navegarConIDVerOperario(idOperario?:string){
    this.router.navigate(['/operario',idOperario]);
    console.log("enviando id",idOperario)
  }

  //EDITAR OPERARIO POR ID
  redireccionarParaEditar(idOperador:string){
    this.router.navigate(['/formulario-operador',idOperador])
    console.log("Para editar:", idOperador);
  }

}
