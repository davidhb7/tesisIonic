import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { DocumentData } from 'firebase/firestore';
import { EN_PROCESO, SOLUCIONADO, SIN_REVISION, INFRAESTRUCTURA_DOMICILIO, INFRAESTRUCTURA_EXTERIOR, INFRAESTRUCTURA_INTERIOR, CONTADOR_DOMICILIO,  MANTENIMIENTO_DOMICILIO, MANTENIMIENTO_EXTERIOR, MANTENIMIENTO_INTERIOR, OTRO_ASUNTO } from 'src/app/common/constant/constantes';
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
  operarioAsignar="";

  retroalimentacion="";
  solucionSeleccionada: string = SIN_REVISION;

  opcionesSolucion = [
    SIN_REVISION,
    INFRAESTRUCTURA_DOMICILIO,
    INFRAESTRUCTURA_EXTERIOR,
    INFRAESTRUCTURA_INTERIOR,
    CONTADOR_DOMICILIO,
    MANTENIMIENTO_DOMICILIO,
    MANTENIMIENTO_EXTERIOR,
    MANTENIMIENTO_INTERIOR,
    OTRO_ASUNTO
  ];


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
      fechaRegistro: '',
      fotoAvatar:'',
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
      fechaRegistro: usuarioData['fechaRegistro'] || '',
      fotoAvatar:usuarioData['fotoAvatar'] || '',
    }
    this.operarioAsignar=this.usuarioLog.idUsuario;
    this.getReportesAsignados();
    this.getReportesSolucionados();
  }

  //TRAE REPORTES ASIGNADOS AL OPERADOR
  getReportesAsignados(){
    this.serviciosFireStoreDatabase.getReportesSegunEstado(EN_PROCESO, this.operarioAsignar).subscribe({
      next:documento=>{
        this.reportesAsignadosPendientes=documento;
      }
    });
  }

  //TRAE REPORTES SOLUCIONADOS
  getReportesSolucionados(){
    this.serviciosFireStoreDatabase.getReportesSegunEstado(SOLUCIONADO, this.operarioAsignar).subscribe({
      next: documentoPorEstado=>{
        this.reportesSolucionados=documentoPorEstado;
      }
    });
  }

  //VER REPORTE EN CONCRETO
  verReporte(idReporte:string){
    this.router.navigate(['/reporte',idReporte]);
  }

  //ALLERT DE SELECCION DE SOLUCION
  // Método para abrir el alert con el desplegable
  async presentAlertConDesplegable(idReporte: string) {

    const alert = await this.alertController.create({
      header: 'Seleccione la solución de reporte',
      inputs: this.opcionesSolucion.map(opcion => ({
        type: 'radio',
        label: opcion,
        value: opcion,
        // "Sin revisión" siempre será la opción seleccionada por defecto
        checked: opcion === 'Sin revisión' || opcion === this.solucionSeleccionada
      })),
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          handler: () => {
            console.log('Selección cancelada');
          }
        },
        {
          text: 'Guardar',
          handler: (data) => {
            this.solucionSeleccionada = data;
            console.log('Solución seleccionada: ', this.solucionSeleccionada);
            // Actualiza el campo "tipoAsuntoPorOperario" en el reporte correspondiente
            this.serviciosFireStoreDatabase.actualizarCampoDocumento("Reportes", idReporte, "tipoAsuntoPorOperario", this.solucionSeleccionada).subscribe(() => {
              console.log("Solución guardada...");
            });
            // Presenta el siguiente alert con un campo obligatorio
            this.presentAlertConCampoObligatorio(idReporte);
          }
        }
      ]
    });
    await alert.present();
  }

  //ALLERT DE RETROALIMENTACION
  async presentAlertConCampoObligatorio(idReporte:string) {
    const alert = await this.alertController.create({
      header: 'Comentario de Operario',
      inputs: [
        {
          name: 'inputTexto',
          type: 'text',
          placeholder: 'Escribir',
        }
      ],
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          handler: () => {
            console.log('Operación cancelada');
            return true; // Se debe devolver un valor
          }
        },
        {
          text: 'Guardar',
          handler: (data) => {
            if (!data.inputTexto || data.inputTexto.trim() === '') {
              // Validar si el campo está vacío
              console.log('Campo de texto vacío, no se puede guardar');
              return false; // Mantiene el alert abierto
            } else {
              // Guardar si el campo tiene contenido
              console.log('Texto ingresado: ', data.inputTexto);
              this.retroalimentacion= data.inputTexto;
              this.serviciosFireStoreDatabase.actualizarCampoDocumento("Reportes", idReporte,"comentarioOperario",this.retroalimentacion).subscribe(()=>{
                console.log("Solución guardada...");
              });
              return this.presentAlertConfirm(idReporte);; // Cierra el alert

            }
          }
        }
      ]
    });
    await alert.present();

  }

  // ALLERT DE CONFIRMACION DE TERMINACION DE REPORTE
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
              console.log("Actualizado...");
            });
            this.serviciosFireStoreDatabase.actualizarCampoDocumento("Reportes", idReporte,"fechaFinReporte",fechaHoyString).subscribe(()=>{
              console.log("Fecha fin...");
            });
            this.usuarioLog.asignacionesActivas--;
          }
        }
      ]
    });
    await alert.present();

  }







}
