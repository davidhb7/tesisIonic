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

  usuarios: UsuarioI[]=[];

  numeroActualReportes:number;
  cargando:boolean=false;

  constructor(
    private fireStoreServices: FireStoreService,
    private router: Router,
  ) {
    //LLAMAR SERVICIO DE CONTEO DE REPORTES Y CONVERSION DE NUMERO A LA VARIABLE A MANEJAR
    this.fireStoreServices.contarNumeroDocumentosTotal("Usuarios").then((numero: number) => {
      this.numeroActualReportes = numero;
    });
    this.getusUariosParaEmpresa();
  }

  ngOnInit() {
    return;
  }

  //VER TODOS LOS USUARIOS REGISTRADOS EN EL SISTEMA.
  getusUariosParaEmpresa(){
    this.fireStoreServices.getCambiosYListar<UsuarioI>('Usuarios').subscribe(//SUBSCRIE, muestra los cambios en tiempo real
      data=>{
        if(data){
          this.usuarios=data;
          console.log("DATA",data)
        }
      }
    );
  }

  //REDIRECCIONAR CON ID
  navegarConIDVerReporte(idUsuario:string){
    this.router.navigate(['/usuario',idUsuario]);
    console.log("enviando id",idUsuario)
  }


  async eliminarUsuario(usuarioEliminar: UsuarioI){
    console.log(usuarioEliminar)
    this.cargando=true;
    await this.fireStoreServices.eliminarDocPorID( 'Usuarios',usuarioEliminar.idUsuario);
    this.cargando=false;
  }

  navegarFormulario(){
    this.router.navigate(['/formulario-usuario']);
  }




}
