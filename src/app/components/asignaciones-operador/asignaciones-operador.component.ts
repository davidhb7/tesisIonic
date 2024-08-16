import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { DocumentData } from 'firebase/firestore';
import { EN_PROCESO, SOLUCIONADO } from 'src/app/common/constant/constantes';
import { ReportesI } from 'src/app/common/interfaces/reportes.interface';
import { UsuarioI } from 'src/app/common/interfaces/usuarios.interface';
import { FireStoreService } from 'src/app/common/services/fire-store.service';
import { InteractionService } from 'src/app/common/services/interaction.service';
import { LocalStorageService } from 'src/app/common/services/local-storage.service';

@Component({
  selector: 'app-asignaciones-operador',
  templateUrl: './asignaciones-operador.component.html',
  styleUrls: ['./asignaciones-operador.component.scss'],
})
export class AsignacionesOperadorComponent  implements OnInit {

  //OBJETOS
  usuarioLog:UsuarioI;
  reportesAsignadosPendientes: ReportesI[]=[];
  reportesSolucionados:ReportesI[]=[]
  fechaHoy: Date = new Date();

  //VARIABLES
  hayReportesPendientes:boolean=false;
  hayReportesSolucionados:boolean=false;
  cargando:boolean=false;
  contador:number=0;

  constructor(
    private serviciosFireStoreDatabase: FireStoreService,
    private serviciosInteraccion: InteractionService,
    private servicioLocalStorage: LocalStorageService,
    private router: Router,
    private route: ActivatedRoute,
    private alertController: AlertController
  ) {
    this.traeUsuarioStorage();//TRAE EL OPERADOR DEL STORAGE Y LO INICIALIZA
  }

  ngOnInit() {
    return;
  }

  //INICIALIZAR USUARIO VACIO
  inicializarUSVacio(){
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
      asignacionesActivas:0,
      fechaRegistro: ''
    };
  }

  //GUARDA EL OPERADOR DEL STORAGE
  async traeUsuarioStorage(){
    const response= await this.servicioLocalStorage.getDatosDeLocalStorage();
    const usuarioData: DocumentData = response;
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
      disponibleOperario: usuarioData['esActivo'] || true,
      esActivo: usuarioData['esActivo'] ||true,
      asignacionesActivas:usuarioData['esActivo'] || 0,
      fechaRegistro: usuarioData['fechaRegistro'] || ''
    }
    this.getReportesAsignados();
    this.getReportesSolucionados();
  }

  //TRAE REPORTES ASIGNADOS AL OPERADOR
  getReportesAsignados(){
    this.serviciosFireStoreDatabase.getReportesSegunEstado(EN_PROCESO, this.usuarioLog.idUsuario).subscribe({
      next:documento=>{
        this.reportesAsignadosPendientes=documento;
      }
    });
  }

  //TRAE REPORTES SOLUCIONADOS
  getReportesSolucionados(){
    this.serviciosFireStoreDatabase.getReportesSegunEstado(SOLUCIONADO, this.usuarioLog.idUsuario).subscribe({
      next: documentoPorEstado=>{
        this.reportesSolucionados=documentoPorEstado;
      }
    });
  }

  //VER REPORTE EN CONCRETO
  verReporte(idReporte:string){
    this.router.navigate(['/reporte',idReporte]);
  }

  //CONFIRMACION DE TERMINACION DE REPORTE
  async presentAlertConfirm(idReporte: string) {
    const alert = await this.alertController.create({
      header: 'Confirmar!',
      message: '¿Está seguro de que desea terminar este reporte?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            console.log('Confirm Cancel para: ',idReporte);
          }
        },
        {
          text: 'Terminar',
          handler: () => {
            let fechaHoyString: string = `${this.fechaHoy.getDate()}/${this.fechaHoy.getMonth() + 1}/${this.fechaHoy.getFullYear()} ${this.fechaHoy.getHours()}:${this.fechaHoy.getMinutes()}`;
            // Lógica para terminar el reporte
            this.serviciosFireStoreDatabase.actualizarCampoDocumento("Reportes", idReporte,"estado",SOLUCIONADO).subscribe(()=>{
              console.log("Actualziado...");
            });
            this.serviciosFireStoreDatabase.actualizarCampoDocumento("Reportes", idReporte,"fechaFinReporte",fechaHoyString).subscribe(()=>{
              console.log("Fecha fin...");
            });
          }
        }
      ]
    });
    await alert.present();
  }

}
