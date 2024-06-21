import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UsuarioI } from 'src/app/common/interfaces/usuarios.interface';
import { FireStoreService } from 'src/app/common/services/fire-store.service';

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styleUrls: ['./usuarios.component.scss'],
})
export class UsuariosComponent  implements OnInit {

  //OBJETOS
  usuarios: UsuarioI[]=[];


  //VARIABLES
  numeroActualReportes:number;
  cargando:boolean=false;

  constructor(
    private serviciosFireStore: FireStoreService,
    private router: Router,
  ) {
    //LLAMAR SERVICIO DE CONTEO DE REPORTES Y CONVERSION DE NUMERO A LA VARIABLE A MANEJAR
    this.serviciosFireStore.contarNumeroDocumentosTotal("Usuarios").then((numero: number) => {
      this.numeroActualReportes = numero;
    });
    this.getusUariosParaEmpresa();
  }

  ngOnInit() {
    return;
  }

  //VER TODOS LOS USUARIOS REGISTRADOS EN EL SISTEMA.
  getusUariosParaEmpresa(){
    this.serviciosFireStore.getDocumentosGeneralAtentoCambios<UsuarioI>('Usuarios').subscribe(//SUBSCRIE, muestra los cambios en tiempo real
      data=>{
        if(data){
          this.usuarios=data;
          console.log("DATA",data)
        }
      }
    );
  }

  //REDIRECCIONAR A VER USUARIO POR ID
  navegarConIDVerReporte(idUsuario:string){
    this.router.navigate(['/usuario',idUsuario]);
    console.log("enviando id",idUsuario)
  }

  //ELIMINAR DOCUMENTO CON ID
  async eliminarUsuario(usuarioEliminar: UsuarioI){
    this.cargando=true;
    await this.serviciosFireStore.eliminarDocPorID( 'Usuarios',usuarioEliminar.idUsuario);
    this.cargando=false;
  }

  //REDIRECCIONAR A FORMULARIO CREAR USUARIO
  navegarFormulario(){
    this.router.navigate(['/formulario-usuario']);
  }

  redireccionarParaEditar(idUsuario:string){
    console.log("Para editar", idUsuario);
    this.router.navigate(['/formulario-registro',idUsuario])
  }







}
