import { Component, Input, OnInit } from '@angular/core';
import { DocumentData } from '@angular/fire/firestore';
import { ActivatedRoute, Router } from '@angular/router';
import { EN_PROCESO } from 'src/app/commonFS/constantes/constantes';
import { ReportesI } from 'src/app/commonFS/models-interfaceFS/reportes.interface';
import { UsuarioI } from 'src/app/commonFS/models-interfaceFS/usuarios.interface';
import { FireStoreService } from 'src/app/commonFS/servicesFS/fire-store.service';



@Component({
  selector: 'app-crear-reporte',
  templateUrl: './crear-reporte.component.html',
  styleUrls: ['./crear-reporte.component.scss'],
})
export class CrearReporteComponent  implements OnInit {


  //------------------OBJETOS
  reportes: ReportesI[]=[];
  nuevoReporte:ReportesI;


  //----------------VARIABLES
  fechaHoy: Date = new Date();
  cargando:boolean=false;
  numeroActualReportes:number;
  asignableNuevo:number;
  idPresente:string

  constructor(
    private fireStroreService: FireStoreService,
    private router: Router,
    route: ActivatedRoute
  ) {
    //LLAMAR SERVICIO DE CONTEO DE REPORTES Y CONVERSION DE NUMERO A LA VARIABLE A MANEJAR
    this.fireStroreService.contarNumeroDocumentosTotal("Reportes").then((numero: number) => {
    this.numeroActualReportes = numero;
    this.asignableNuevo=this.numeroActualReportes+1
    this.nuevoReporte.numeroReporte=this.asignableNuevo
    });
    //FIN CONTEO REPORTES

    this.inicializarEnVacio();
    this.cargando=false;
    this.idPresente=route.snapshot.params['idReporte'];
    this.editarOcrear();
  }

  ngOnInit() {
    return;
  }

  //INICIALIZAR CON VACIO
  inicializarEnVacio(){
    this.nuevoReporte ={
      idReporte: '',
      numeroReporte:  0,
      descripcion:  '',
      ubicacion: '',
      fechaRegistroReporte:'',
      fechaAtencionReporte: '',
      fechaFinReporte:'',
      idUsuario:  0,
      idOperador:  0,
      idEmpresa: 0,
      idFoto:  0,
      estado: ''
    }
  }

  //INICIALIZACION PARA CREAR
  inicializarNuevoReporte(){
    let fechaHoyString: string = `${this.fechaHoy.getDate()}/${this.fechaHoy.getMonth() + 1}/${this.fechaHoy.getFullYear()} ${this.fechaHoy.getHours()}:${this.fechaHoy.getMinutes()}`;
    //this.nuevoReporte.idReporte= this.fireStroreService.crearIDUnico();
    this.nuevoReporte={
      idReporte: this.fireStroreService.crearIDUnico(),
      numeroReporte: this.asignableNuevo,
      descripcion: "",
      ubicacion: "Lat: 0, Long: 0",
      fechaRegistroReporte: fechaHoyString,
      fechaAtencionReporte: "",
      fechaFinReporte: "",
      idUsuario: null,
      idOperador: null,
      idEmpresa: null,
      idFoto: null,
      estado:EN_PROCESO
    }
  }

  //FUNCION GUARDAR
  async guardarRegistro(){
    this.cargando=true;
    await this.fireStroreService.crearDocumentoGeneralPorID(this.nuevoReporte,'Reportes',this.nuevoReporte.idReporte);
    this.cargando=false;
    this.router.navigate(["/reportes"]);
  }

  //EDITAR SEGUN DEFINICION DE ID
  async editarOcrear(){
    if(this.idPresente!=null || this.idPresente!=undefined ){
      console.log("idpres para editar: ",this.idPresente)
      const response = await this.fireStroreService.getDocumentSolo( 'Reportes',this.idPresente);
      const reporteData: DocumentData = response.data();
      this.nuevoReporte ={
        idReporte: reporteData['idReporte'] || '',
        numeroReporte: reporteData['numeroReporte'] || 0,
        descripcion: reporteData['descripcion'] || '',
        ubicacion: reporteData['ubicacion'] || '',
        fechaRegistroReporte: reporteData['fechaRegistroReporte'] || '',
        fechaAtencionReporte: reporteData['fechaAtencionReporte'] || '',
        fechaFinReporte: reporteData['fechaFinReporte'] || '',
        idUsuario: reporteData['idUsuario'] || 0,
        idOperador: reporteData['idOperador'] || 0,
        idEmpresa: reporteData['idEmpresa'] || 0,
        idFoto: reporteData['idFoto'] || 0,
        estado: reporteData['estado'] || ''
      }
    }
    else{
      console.log("para creear: ",this.idPresente)
      this.inicializarNuevoReporte();
    }
  }

}
