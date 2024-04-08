import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DocumentData } from 'firebase/firestore';
import { UsuarioI } from 'src/app/commonFS/models-interfaceFS/usuarios.interface';
import { AuthServices } from 'src/app/commonFS/servicesFS/auth.service';
import { FireStoreService } from 'src/app/commonFS/servicesFS/fire-store.service';
import { InteractionService } from 'src/app/commonFS/servicesFS/interaction.service';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
})
export class MenuComponent  implements OnInit {

  usuarioLog:UsuarioI;
  visibleReportes: boolean= true;
  visibleOperarios: boolean= true;
  visibleUsuarios: boolean= true;

  idLog:string ="";

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
        console.log("SI LOG")
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

  //DIRECTO DE MENU
  redirectMenu(nuevaRuta: any){
    this.router.navigate([nuevaRuta]);
  }

  cerrar(){
    this.serviciosUsAth.salida();
    this.serviciosInteracion.cerrarCargando();
    this.serviciosInteracion.mensajeGeneral("Salió correctamente");
    this.router.navigate(['/login']);
  }

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
    if(this.usuarioLog.idRol=="4"){
      this.visibleReportes=false;
      this.visibleOperarios=false;
      this.visibleUsuarios=false;
    }
    else if(this.usuarioLog.idRol=="1" || this.usuarioLog.idRol=="2" || this.usuarioLog.idRol=="3"){
      console.log("TIENE PERMISOS")
    }




  }











}
