import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { OperarioI } from 'src/app/common/interfaces/operario.interface';
import { UsuarioI } from 'src/app/common/interfaces/usuarios.interface';
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



  constructor(
    private router: Router,
    private serviciosFireStore: FireStoreService,//INYECTANDO DEPENDENCIA
  ) {
    this.getOperariosRegistrados();
  }

  ngOnInit() {
    return;
  }

  //TODO usuarios de rol operario
  //TRAER LOS USUARIOS ROL OPERARIO

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
