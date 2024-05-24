import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DocumentData } from 'firebase/firestore';
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

  //VARIABLES
  visibleReportes: boolean=true;
  visibleOperarios: boolean=true;
  visibleUsuarios: boolean=true;
  idLog:string ="";
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
    this.serviciosAuth.estadoLogUsuario().subscribe(res =>{
      if(res){
        this.idLog=res.uid
        console.log("SI LOG", this.idLog);
        console.log(this.usuarioLog.idUsuario)
        this.traerUS();
      }
      else{
        console.log("NO LOG")
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
    console.log("LA RUTA:",nuevaRuta);
  }

  //CERRAR SESION CON SERVICIO
  cerrarSesion(){
    this.serviciosUsAth.salida();
    this.serviciosInteracion.cerrarCargando();
    this.serviciosInteracion.mensajeGeneral("Salió correctamente");
    this.router.navigate(['/login']);
  }

  //INICIALIZAR USUARIO VACIO
  inicializarUSVacioMen(){
    this.usuarioLog = {
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
  }

  //CONSULTA EL USUARIO Y OTORGA/QUITA PERMISOS DE ROL
  async traerUS(){
    const response= await this.serviciosFirestore.getDocumentSolo("Usuarios", this.idLog);
    const usuarioData: DocumentData = response.data();
    this.usuarioLog= {
      idUsuario: usuarioData['idUsuario'] ||'',
      cedulausuario: usuarioData['cedulausuario'] ||'',
      numeroReferenciaUsuario: usuarioData['numeroReferenciaUsuario'] || 0,
      nombreUsuario: usuarioData['nombreUsuario'] ||'',
      correoUsuario: usuarioData['correoUsuario'] || '',
      celularUsuario: usuarioData['celularUsuario'] ||'',
      direccionUsuario: usuarioData['direccionUsuario'] ||'',
      telefonoUsuario: usuarioData['telefonoUsuario'] ||'',
      clave: usuarioData['clave'] ||'',
      idRol: usuarioData['idRol'] ||'',
      esActivo: usuarioData['esActivo'] ||'',
      fechaRegistro: usuarioData['fechaRegistro'] ||''
    }
    this.idLog= this.usuarioLog.idUsuario


    if(this.usuarioLog.idRol=="4"){
      this.visibleReportes=false;
      this.visibleOperarios=false;
      this.visibleUsuarios=false;
    }
    else if(this.usuarioLog.idRol=="1" || this.usuarioLog.idRol=="2" || this.usuarioLog.idRol=="3"){
      console.log("TIENE PERMISOS");
      this.visibleReportes=true;
      this.visibleOperarios=true;
      this.visibleUsuarios=true;
    }
    else{
      console.log("ROL DESCONOCIDO");
      this.visibleReportes=false;
      this.visibleOperarios=false;
      this.visibleUsuarios=false;
    }
  }

  //PERFIL DEL USUARIO Y SU INFORMACION
  paraverPerfilconId(idUsuariorouter: string){
    console.log(idUsuariorouter);
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












}
