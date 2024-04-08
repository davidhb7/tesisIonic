import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { ReportesI } from 'src/app/commonFS/models-interfaceFS/reportes.interface';
import { FireStoreService } from 'src/app/commonFS/servicesFS/fire-store.service';
import { CrearReporteComponent } from '../crear-reporte/crear-reporte.component';

@Component({
  selector: 'app-reportes',
  templateUrl: './reportes.component.html',
  styleUrls: ['./reportes.component.scss'],
})
export class ReportesComponent  implements OnInit {

  reportes: ReportesI[]=[];
  reporte:ReportesI;

  cargando:boolean=false;



  constructor(
    private router: Router,
    private fireStoreService: FireStoreService,//INYECTANDO DEPENDENCIA

  ) {
    this.cargarReportesParaEmpresa();


  }

  ngOnInit() {
    return;
  }

//GET REPORTES GENERAL
  cargarReportesParaEmpresa(){
    this.fireStoreService.getCambiosYListar<ReportesI>('Reportes').subscribe(//SUBSCRIE, muestra los cambios en tiempo real
      data=>{
        if(data){
          this.reportes=data;
        }
      }
    );
  }

  navegarFormularioCrearReporte(){
    this.router.navigate(['/crear-reporte']);
  }

  async eliminarReporte(reporteEliminar: ReportesI){
    console.log(reporteEliminar)
    this.cargando=true;
    await this.fireStoreService.eliminarDocPorID( 'Reportes',reporteEliminar.idReporte);
    this.cargando=false;
  }

  // verReporte(){
  //   this.router.navigate(["/reporte"]);
  // }

  //REDIRECCIONAR CON ID
  async navegarConIDVerReporte(idRep:string){
    this.router.navigate(['/reporte',idRep]);
    console.log("enviando id",idRep)
  }

  //REDIRECCION A EDITAR REPORTE
  async navegarConIDEditarReporte(idRep:string){
    this.router.navigate(['/crear-reporte',idRep]);
    console.log("enviando id editar",idRep)
  }





}
