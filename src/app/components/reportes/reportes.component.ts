import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { ReportesI } from 'src/app/common/interfaces/reportes.interface';
import { UsuarioI } from 'src/app/common/interfaces/usuarios.interface';
import { FireStoreService } from 'src/app/common/services/fire-store.service';
import { InteractionService } from 'src/app/common/services/interaction.service';
import { DocumentData } from '@angular/fire/firestore';
import { EN_PROCESO, SOLUCIONADO } from 'src/app/common/constant/constantes';
import { LocalStorageService } from 'src/app/common/services/local-storage.service';

@Component({
  selector: 'app-reportes',
  templateUrl: './reportes.component.html',
  styleUrls: ['./reportes.component.scss'],
})
export class ReportesComponent implements OnInit {

  //OBJETOS
  reportesGenerales: ReportesI[] = [];
  usuarioPresente: UsuarioI;

  //  - CUANDO ES-CLI
  reportresUsuarioPendientes: ReportesI[] = [];
  reportresUsuarioSolucionado: ReportesI[] = [];


  //VARIABLES
  hayReportes: boolean;
  cargando: boolean = false;
  ascendente: boolean = true;
  avisoSinReportes:string="Por el momento no hay reportes."



  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private serviciosFireStoreDatabase: FireStoreService,//INYECTANDO DEPENDENCIA
    private serviciosInteraccion: InteractionService,
    private servicioLocalStorage: LocalStorageService
  ) {
    this.inicializarUSVacio()
    //CONDICIONAL PARA ESTOS...
    this.usuarioLogueado();


  }

  ngOnInit() {
    return;
  }

  //INICIALIZAR USUARIO VACIO
  inicializarUSVacio() {
    this.usuarioPresente = {
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
      fotoAvatar: '',
    };
  }

  //SI ES EMPRESA U OPERARIO, TRAER TODOS LOS REPORTES
  // getReportesGeneralesEmpresaOperario(){
  //   this.serviciosFireStoreDatabase.getDocumentosGeneralAtentoCambios<ReportesI>("Reportes").subscribe(
  //     data=>{
  //       if(data){
  //         this.reportesGenerales=data;
  //       }
  //     }
  //   )
  // }
  getReportesGeneralesEmpresaOperario() {
    this.serviciosFireStoreDatabase.getDocumentosGeneralAtentoCambios<ReportesI>("Reportes").subscribe(
      data => {
        if (data) {
          this.reportesGenerales = data.sort((a, b) => a.numeroReporte - b.numeroReporte);
        }
      }
    );
  }


  //GET REPORTES PENDIENTES POR ID DEL USUARIO CLIENTE LOGUIEADO - ROL 4
  // getReportesPendientesPorIDUsuario(){
  //   this.serviciosFireStoreDatabase.getReportesSegunEstadoUsuarioConsumidor(EN_PROCESO,this.usuarioPresente.idUsuario).subscribe({
  //     next:documentoPendiente=>{
  //       this.reportresUsuarioPendientes=documentoPendiente;
  //     }
  //   });
  // }
  getReportesPendientesPorIDUsuario() {
    this.serviciosFireStoreDatabase.getReportesSegunEstadoUsuarioConsumidor(EN_PROCESO, this.usuarioPresente.idUsuario).subscribe({
      next: documentoPendiente => {
        this.reportresUsuarioPendientes = documentoPendiente.sort((a, b) => a.numeroReporte - b.numeroReporte);
      }
    });
  }


  // getReportesSolucionadoPorIDUsuario(){
  //   this.serviciosFireStoreDatabase.getReportesSegunEstadoUsuarioConsumidor(SOLUCIONADO,this.usuarioPresente.idUsuario).subscribe({
  //     next:documentoSolucionado=>{
  //       this.reportresUsuarioSolucionado=documentoSolucionado;
  //     }
  //   });
  // }
  getReportesSolucionadoPorIDUsuario() {
    this.serviciosFireStoreDatabase.getReportesSegunEstadoUsuarioConsumidor(SOLUCIONADO, this.usuarioPresente.idUsuario).subscribe({
      next: documentoSolucionado => {
        this.reportresUsuarioSolucionado = documentoSolucionado.sort((a, b) => a.numeroReporte - b.numeroReporte);
      }
    });
  }




  //ELIMINA EL REPORTE SELECCIONADO
  async eliminarReporte(idRep: string) {
    this.cargando = true;
    try {
      await this.serviciosFireStoreDatabase.eliminarDocPorID('Reportes', idRep);
    } catch (e) {
      console.log(e)
      console.error("No se pudo eliminar.")
      throw new Error("No se pudo eliminar.")
    }
    this.cargando = false;
  }

  //CONSULTAR USUARIO
  async usuarioLogueado() {
    const response = await this.servicioLocalStorage.getDatosDeLocalStorage();
    const usuarioData: DocumentData = response;
    this.usuarioPresente = {
      idUsuario: usuarioData['idUsuario'] || '',
      identificacionUsuario: usuarioData['cedulausuario'] || '',
      numeroReferenciaUsuarioConsumidor: usuarioData['numeroReferenciaUsuario'] || 0,
      nombreUsuario: usuarioData['nombreUsuario'] || '',
      correoUsuario: usuarioData['correoUsuario'] || '',
      celularUsuario: usuarioData['celularUsuario'] || '',
      direccionUsuario: usuarioData['direccionUsuario'] || '',
      telefonoUsuario: usuarioData['telefonoUsuario'] || '',
      clave: usuarioData['clave'] || '',
      idRol: usuarioData['idRol'] || '',
      disponibleOperario: usuarioData['esActivo'] || true,
      esActivo: usuarioData['esActivo'] || true,
      asignacionesActivas: usuarioData['esActivo'] || 0,
      fechaRegistro: usuarioData['fechaRegistro'] || '',
      fotoAvatar: usuarioData['fotoAvatar'] || '',
    }
    console.log(this.usuarioPresente.idRol);
    this.serviciosInteraccion.cerrarCargando();
    this.cargarReportesSegunUsuario(this.usuarioPresente.idRol);
  }

  //MUESTRA REPORTES SEGUN EL USUARIO. TODOS O LOS DE LOS DEL USUARIO EN PARTICULAR
  cargarReportesSegunUsuario(idUs:string) {
    switch (idUs) {
      case "1":
        break;

      case "2":
        this.getReportesPendientesPorIDUsuario();
        this.getReportesSolucionadoPorIDUsuario();
        this.getReportesGeneralesEmpresaOperario();
        break;

      case "3":
        this.getReportesPendientesPorIDUsuario();
        this.getReportesSolucionadoPorIDUsuario();
        this.getReportesGeneralesEmpresaOperario();
        break;

      case "4":
        this.getReportesPendientesPorIDUsuario();
        this.getReportesSolucionadoPorIDUsuario();
        break;

      default:
        this.hayReportes = false;
    }
  }

  //CREAR REPORTE CON ID DE PARAMETRO EN RUTA
  navegarFormularioCrearReporte() {
    this.router.navigate(['/crear-reporte']);
    console.log("sin id")
  }

  //REDIRECCION A EDITAR REPORTE
  async navegarConIDEditarReporte(idRep: string) {
    this.router.navigate(['/crear-reporte', idRep]);
  }

  //REDIRECCIONAR A GET REPORTE CON ID
  navegarConIDVerReporte(idRep: string) {
    this.router.navigate(['/reporte', idRep]);
  }

  //REDIRECCIONAR A GET REPORTE CON ID
  navegarMenu() {
    this.router.navigate(['/menu']);
  }

}
