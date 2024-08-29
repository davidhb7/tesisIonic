import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ReportesI } from 'src/app/common/interfaces/reportes.interface';
import { FireStoreService } from 'src/app/common/services/fire-store.service';
import { ReportesComponent } from '../reportes/reportes.component';
import { DocumentData } from '@angular/fire/firestore';
import { FotoI } from 'src/app/common/interfaces/fotos.interface';
import { InteractionService } from 'src/app/common/services/interaction.service';

@Component({
  selector: 'app-reporte',
  templateUrl: './reporte.component.html',
  styleUrls: ['./reporte.component.scss'],
})
export class ReporteComponent  implements OnInit {

  //OBJETOS
  reporte: ReportesI;
  fotosDeReporte:FotoI[]=[]

  //VARIABLES
  idPresenteReporte:string;
  destinationLocation: { lat: number; lng: number; };


  constructor(
    private servicioFireStore: FireStoreService,//INYECTANDO DEPENDENCIA
    private route: ActivatedRoute,
    private serviciosInteraccion: InteractionService,
  ) {
    //RECIBE EL ID QUE TRAE EL NAVEGADOR DE COMPONENTE: poner el id tal cual la interfazS
    this.idPresenteReporte=route.snapshot.params['idReporte'];
    this.inicializarEnVacio();
    this.getReporteSoloVer();
    this.getFotosPorIdReporte();

  }

  ngOnInit() {
    return;
  }

  //INICIALIZAR REPORTE VACIO
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

  //TRAER REPORTE POR ID
  async getReporteSoloVer(){
    const response = await this.servicioFireStore.getDocumentSolo( 'Reportes',this.idPresenteReporte);
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
    this.actualizarUbicacionReporte(this.reporte.ubicacion);
  }


  //TRAER FOTOS POR ID DE REPORTE
  getFotosPorIdReporte(){
    this.servicioFireStore.getFotosSegunReporteObservable(this.idPresenteReporte).subscribe({
      next: documentosFotos=>{
        this.fotosDeReporte=documentosFotos;
      }
    });
  }

  //TOMA LA UBICACION DEL REPORTE, LA SEPARA A COORDENADAS LEGIBLES
  actualizarUbicacionReporte(coordenadas:string){
    const [latStr, lngStr] = coordenadas.split(' ');
    const lat = parseFloat(latStr);
    const lng = parseFloat(lngStr);
    console.log("Destino desde reporte",lat, lng);
    this.destinationLocation = { lat, lng };
  }


}
