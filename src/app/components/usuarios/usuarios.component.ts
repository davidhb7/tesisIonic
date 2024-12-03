import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { USUARIO_CONSUMIDOR } from 'src/app/common/constant/constantes';
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
    //this.getusUariosParaEmpresa();
    this.getUsuarioConsumidorDeEmpresaRolUsuario();
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

  //VER. REDIRECCIONAR A VER USUARIO POR ID
  navegarConIDVerReporte(idUsuario:string){
    this.router.navigate(['/usuario',idUsuario]);
  }

  //ELIMINAR DOCUMENTO CON ID
  async eliminarUsuario(usuarioEliminar: UsuarioI){
    this.cargando=true;
    await this.serviciosFireStore.eliminarDocPorID( 'Usuarios',usuarioEliminar.idUsuario);
    this.cargando=false;
  }

  //CREAR. REDIRECCIONAR A FORMULARIO CREAR USUARIO
  navegarFormulario(){
    this.router.navigate(['/formulario-usuario']);
  }

  //EDITAR
  redireccionarParaEditar(idUsuario:string){
    this.router.navigate(['/formulario-registro',idUsuario])
  }

  //TRAER USUARIO-CONSUMIDOR POR INTERFAZ DE EMPRESA
  getUsuarioConsumidorDeEmpresaRolUsuario(){
    this.serviciosFireStore.getUsuariosSegunRol<UsuarioI>(USUARIO_CONSUMIDOR).subscribe({
      next:documentoUsuarioConsumidor=>{
        this.usuarios=documentoUsuarioConsumidor;
      }
    });
  }






}
