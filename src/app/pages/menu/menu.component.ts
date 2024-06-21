import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DocumentData } from 'firebase/firestore';
import { OperarioI } from 'src/app/common/interfaces/operario.interface';
import { UsuarioI } from 'src/app/common/interfaces/usuarios.interface';
import { AuthServices } from 'src/app/common/services/auth.service';
import { FireStoreService } from 'src/app/common/services/fire-store.service';
import { InteractionService } from 'src/app/common/services/interaction.service';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
})
export class MenuComponent  implements OnInit {

  //OBJETOS
  usuarioLog:UsuarioI;
  operarioLog:OperarioI;


  //VARIABLES
  visibleReportes: boolean=true;
  visibleOperarios: boolean=true;
  visibleUsuarios: boolean=true;
  visibleAsignaciones: boolean=true;
  idQuienInicia:string ="";
  idLogOperario:string ="";
  otroId:string;

  x:any;

  //OBJETO DE RUTAS
  opcionesMenu: any[]=[
    {
      idMen:1,
      nombre: 'Reportes',
      url:'/reportes',
      permiso: true

    },
    {
      idMen:2,
      nombre: 'Usuarios',
      url:'/usuarios',
      permiso: true
    },
    {
      idMen:3,
      nombre: 'Operarios',
      url:'/operarios',
      permiso: true
    },
    {
      idMen:4,
      nombre: 'Perfil',
      url:'/usuario',
      permiso: true
    }



  ];

  constructor(
    private router: Router,
    private serviciosUsAth: AuthServices,
    private serviciosInteracion: InteractionService,
    private serviciosAuth: AuthServices,
    private serviciosFirestore: FireStoreService
  ) {
    this.inicializarUSVacioMen();

    //VERIFICA ESTADO DEL USUARIO
    this.serviciosAuth.estadoLogUsuario().subscribe(res =>{
      if(res){
        this.idQuienInicia=res.uid
        console.log("SI LOG: ", this.idQuienInicia);
        this.traerUS();
      }
      else{
        console.log("NO LOG");
        this.cerrarSesion();
      }
    });
  }

  ngOnInit() {
    return;
  }

  //DIRECTORIO DE MENU. REDIRECCIONA SEGUN LO ELEGIDO
  redirectMenu(nuevaRuta: string,elId?:string){
    this.router.navigate([nuevaRuta, elId] );
    console.log(elId);
  }

  //CERRAR SESION CON SERVICIO
  cerrarSesion(){
    this.serviciosUsAth.servicioCerrarSesion();
    this.serviciosInteracion.cerrarCargando();
    this.serviciosInteracion.mensajeGeneral("Salió correctamente");
    this.router.navigate(['/login']);
  }

  //INICIALIZAR USUARIO VACIO
  inicializarUSVacioMen(){
    this.usuarioLog = {
      idUsuario: '',
      identificacionUsuario:'',
      numeroReferenciaUsuarioConsumidor: 0,
      nombreUsuario: '',
      correoUsuario: '',
      celularUsuario: '',
      direccionUsuario: '',
      telefonoUsuario: '',
      clave: '',
      idRol: '',
      disponibleOperario:true,
      esActivo: true,
      fechaRegistro: ''
    };
  }

  //CONSULTA EL USUARIO Y OTORGA/QUITA PERMISOS DE ROL
  async traerUS(){
    const response= await this.serviciosFirestore.getDocumentSolo("Usuarios", this.idQuienInicia);
    const usuarioData: DocumentData = response.data();
    this.usuarioLog= {
      idUsuario: usuarioData['idUsuario'] ||'',
      identificacionUsuario: usuarioData['cedulausuario'] ||'',
      numeroReferenciaUsuarioConsumidor: usuarioData['numeroReferenciaUsuario'] || 0,
      nombreUsuario: usuarioData['nombreUsuario'] ||'',
      correoUsuario: usuarioData['correoUsuario'] || '',
      celularUsuario: usuarioData['celularUsuario'] ||'',
      direccionUsuario: usuarioData['direccionUsuario'] ||'',
      telefonoUsuario: usuarioData['telefonoUsuario'] ||'',
      clave: usuarioData['clave'] ||'',
      idRol: usuarioData['idRol'] ||'',
      disponibleOperario: usuarioData['esActivo'] ||true,
      esActivo: usuarioData['esActivo'] ||true,
      fechaRegistro: usuarioData['fechaRegistro'] ||''
    }


    this.idQuienInicia= this.usuarioLog.idUsuario
    console.log("ROL: ",this.usuarioLog.idRol);


    if(this.usuarioLog.idRol=="4"){
      console.log("Us-Cons");
      this.visibleReportes=false;
      this.visibleOperarios=false;
      this.visibleUsuarios=false;
      this.visibleAsignaciones=false;
    }
    else if(this.usuarioLog.idRol=="1" || this.usuarioLog.idRol=="2"){
      console.log("TIENE PERMISOS - Adm - Empr");

      this.visibleReportes=true;
      this.visibleOperarios=true;
      this.visibleUsuarios=true;
      this.visibleAsignaciones=false;
    }
    else if(this.usuarioLog.idRol=="3"){
      console.log("Op");
      this.visibleReportes=true;
      this.visibleOperarios=true;
      this.visibleUsuarios=false;
      this.visibleAsignaciones=true
    }
    else{
      console.log("ROL DESCONOCIDO");
      this.visibleReportes=false;
      this.visibleOperarios=false;
      this.visibleUsuarios=false;
      this.visibleAsignaciones=false;
    }
  }

  //PERFIL DEL USUARIO Y SU INFORMACION
  paraverPerfilconId(idUsuariorouter: string){
    this.router.navigate(['/usuario', idUsuariorouter])
  }

  //PERFIL DEL USUARIO Y SU INFORMACION
  irTodosLosUsuarios(){
    this.router.navigate(['/usuarios'])
  }

  //VER TODOS LOS OPERARIOS-CONTRATISTAS-FONTANEROS
  irTodosLosOperarios(){
    this.router.navigate(['/operarios'])
  }

  clasificarLog(){
  }


}
