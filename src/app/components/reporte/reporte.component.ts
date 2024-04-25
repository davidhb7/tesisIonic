import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ReportesI } from 'src/app/commonFS/models-interfaceFS/reportes.interface';
import { FireStoreService } from 'src/app/commonFS/servicesFS/fire-store.service';
import { ReportesComponent } from '../reportes/reportes.component';
import { DocumentData } from '@angular/fire/firestore';

@Component({
  selector: 'app-reporte',
  templateUrl: './reporte.component.html',
  styleUrls: ['./reporte.component.scss'],
})
export class ReporteComponent  implements OnInit {

  //OBJETOS
  reporte: ReportesI;

  //VARIABLES
  idPresenteReporte:string;


  constructor(
    private fireStoreService: FireStoreService,//INYECTANDO DEPENDENCIA
    private route: ActivatedRoute
  ) {
    //RECIBE EL ID QUE TRAE EL NAVEGADOR DE COMPONENTE: poner el id tal cual la interfazS
    this.idPresenteReporte=route.snapshot.params['idReporte'];
    this.inicializarEnVacio();
    this.getReporte()
  }

  ngOnInit() {
    return;
  }

  inicializarEnVacio(){
    this.reporte = {
      idReporte: '',
      numeroReporte:  0,
      descripcion:  '',
      ubicacion: '',
      fechaRegistroReporte:'',
      fechaAtencionReporte: '',
      fechaFinReporte:'',
      idUsuario:  '',
      idOperador:  '',
      idEmpresa: '',
      idFoto:  '',
      estado: ''
    }
  }

  async getReporte(){
    const response = await this.fireStoreService.getDocumentSolo( 'Reportes',this.idPresenteReporte);
    const reporteData: DocumentData = response.data();
    this.reporte ={
      idReporte: reporteData['idReporte'] || '',
      numeroReporte: reporteData['numeroReporte'] || 0,
      descripcion: reporteData['descripcion'] || '',
      ubicacion: reporteData['ubicacion'] || '',
      fechaRegistroReporte: reporteData['fechaRegistroReporte'] || '',
      fechaAtencionReporte: reporteData['fechaAtencionReporte'] || '',
      fechaFinReporte: reporteData['fechaFinReporte'] || '',
      idUsuario: reporteData['idUsuario'] || '',
      idOperador: reporteData['idOperador'] || '',
      idEmpresa: reporteData['idEmpresa'] || '',
      idFoto: reporteData['idFoto'] || '',
      estado: reporteData['estado'] || ''
    }
  }






}
