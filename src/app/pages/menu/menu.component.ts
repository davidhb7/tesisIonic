import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DocumentData } from 'firebase/firestore';
import { OperarioI } from 'src/app/common/interfaces/operario.interface';
import { UsuarioI } from 'src/app/common/interfaces/usuarios.interface';
import { AuthServices } from 'src/app/common/services/auth.service';
import { FireStoreService } from 'src/app/common/services/fire-store.service';
import { InteractionService } from 'src/app/common/services/interaction.service';
import { LocalStorageService } from 'src/app/common/services/local-storage.service';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
})
export class MenuComponent implements OnInit {
  //OBJETOS
  usuarioLog: UsuarioI;
  operarioLog: OperarioI;

  //VARIABLES
  visibleReportes: boolean = true;
  visibleOperarios: boolean = true;
  visibleUsuarios: boolean = true;
  visibleAsignaciones: boolean = true;
  visibleEstadisticas:boolean=true;
  visibleInfoEmpresa:boolean=true;
  visibleRepetidor:boolean=true;
  idQuienInicia: string = "";
  idLogOperario: string = "";



  constructor(
    private router: Router,
    private serviciosUsAth: AuthServices,
    private serviciosInteracion: InteractionService,
    private serviciosAuth: AuthServices,
    private serviciosFirestore: FireStoreService,
    private servicioLocalStorage: LocalStorageService
  ) {
    this.inicializarUSVacioMen();
    //VERIFICA ESTADO DEL USUARIO

    this.traerUS();
  }



  ngOnInit() {
    return;
  }

  //DIRECTORIO DE MENU. REDIRECCIONA SEGUN LO ELEGIDO
  redirectMenu(nuevaRuta: string, elId?: string) {
    this.router.navigate([nuevaRuta, elId]);
  }

  //CERRAR SESION CON SERVICIO
  cerrarSesion() {
    this.serviciosUsAth.servicioCerrarSesion();
    this.servicioLocalStorage.eliminarDatoEnLocalStorage();
    this.servicioLocalStorage.limpiarTodoLocalStorage();
    this.serviciosInteracion.mensajeGeneral("Salió correctamente");
    this.router.navigate(['/login']).then(()=>{
      window.location.reload();
    });


  }

  //INICIALIZAR USUARIO VACIO
  inicializarUSVacioMen() {
    this.usuarioLog = {
      idUsuario: '',
      identificacionUsuario: '',
      numeroReferenciaUsuarioConsumidor: 0,
      nombreUsuario: '',
      correoUsuario: '',
      celularUsuario: '',
      direccionUsuario: '',
      telefonoUsuario: '',
      clave: '',
      idRol: '',
      disponibleOperario: true,
      esActivo: true,
      asignacionesActivas: 0,
      fechaRegistro: '',
      fotoAvatar:'',
    };
  }

  //CONSULTA EL USUARIO Y OTORGA/QUITA PERMISOS DE ROL
  async traerUS() {
    try {
      const response = await this.servicioLocalStorage.getDatosDeLocalStorage();
      if (response) {
        const usuarioData: DocumentData = response;
        this.usuarioLog = {
          idUsuario: usuarioData['idUsuario'] || '',
          identificacionUsuario: usuarioData['identificacionUsuario'] || '',
          numeroReferenciaUsuarioConsumidor: usuarioData['numeroReferenciaUsuarioConsumidor'] || 0,
          nombreUsuario: usuarioData['nombreUsuario'] || '',
          correoUsuario: usuarioData['correoUsuario'] || '',
          celularUsuario: usuarioData['celularUsuario'] || '',
          direccionUsuario: usuarioData['direccionUsuario'] || '',
          telefonoUsuario: usuarioData['telefonoUsuario'] || '',
          clave: usuarioData['clave'] || '',
          idRol: usuarioData['idRol'] || '',
          disponibleOperario: usuarioData['disponibleOperario'] || true,
          esActivo: usuarioData['esActivo'] || true,
          asignacionesActivas: usuarioData['asignacionesActivas'] || 0,
          fechaRegistro: usuarioData['fechaRegistro'] || '',
          fotoAvatar:usuarioData['fotoAvatar'] || '',
        };
        this.idQuienInicia = this.usuarioLog.idUsuario;
        this.clasificarRolSegunStorage(this.usuarioLog.idRol);
      }
    } catch (error) {
      console.error('Error al traer el usuario del LocalStorage:', error);
      this.cerrarSesion();
    }
  }

  //PERFIL DEL USUARIO Y SU INFORMACION
  paraverPerfilconId(idUsuariorouter: string) {
    this.router.navigate(['/usuario', idUsuariorouter]);
  }

  //PERFIL DEL USUARIO Y SU INFORMACION
  irTodosLosUsuarios() {
    this.router.navigate(['/usuarios']);
  }

  //VER TODOS LOS OPERARIOS-CONTRATISTAS-FONTANEROS
  irTodosLosOperarios() {
    this.router.navigate(['/operarios']);
  }

  //VER LOS REPORTES ASIGNADOS AL OPERADOR LOGUEADO
  irAsignacionesDelOperador() {
    this.router.navigate(['/asignaciones-operador']);
  }

  //VER ESTADISTICAS DE OPERARIO
  irEstadisticasDeOperarios(){
    this.router.navigate(['/estadisticas']);
  }

  irInformacionEmpresa(){
    this.router.navigate(['/infor-empresa']);
  }

  //CREAR REPORTE CON ID DE PARAMETRO EN RUTA
  navegarFormularioCrearReporte() {
    this.router.navigate(['/crear-reporte']);
  }

  // irRepetidor(){
  //   this.router.navigate(['/repetidor']);
  // }


  //DISPONIBILIDAD DE VISTAS Y FUNCIONALIDADES SEGUN EL ROL
  clasificarRolSegunStorage(idRol: string) {
    if (idRol == "4") {
      this.visibleReportes = false;
      this.visibleOperarios = false;
      this.visibleUsuarios = false;
      this.visibleAsignaciones = false;
      this.visibleEstadisticas=false;
      this.visibleInfoEmpresa=true;
      this.visibleRepetidor=false;
    } else if (idRol == "1" || idRol == "2") {
      this.visibleReportes = true;
      this.visibleOperarios = true;
      this.visibleUsuarios = true;
      this.visibleEstadisticas=true;
      this.visibleAsignaciones = false;
      this.visibleInfoEmpresa= true;
      this.visibleRepetidor=true;

    } else if (idRol == "3") {
      this.visibleReportes = true;
      this.visibleOperarios = false;
      this.visibleUsuarios = false;
      this.visibleAsignaciones = true;
      this.visibleEstadisticas= false;
      this.visibleInfoEmpresa= true;
      this.visibleRepetidor=false;
    } else {
      this.visibleReportes = false;
      this.visibleOperarios = false;
      this.visibleUsuarios = false;
      this.visibleAsignaciones = false;
      this.visibleEstadisticas= false;
      this.visibleInfoEmpresa= false;
      this.visibleRepetidor=false;
    }
  }



}
