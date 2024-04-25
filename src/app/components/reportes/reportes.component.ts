import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { ReportesI } from 'src/app/commonFS/models-interfaceFS/reportes.interface';
import { FireStoreService } from 'src/app/commonFS/servicesFS/fire-store.service';
import { MenuComponent } from 'src/app/pages/menu/menu.component';

@Component({
  selector: 'app-reportes',
  templateUrl: './reportes.component.html',
  styleUrls: ['./reportes.component.scss'],
})
export class ReportesComponent  implements OnInit {

  //OBJETOS
  documentosReportes:ReportesI[]=[];
  idUsuarioPresente:string;

  //VARIABLES
  noHayReportes:boolean;
  cargando:boolean=false;



  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private serviciosFireStoreDatabase: FireStoreService,//INYECTANDO DEPENDENCIA
  ) {
    this.idUsuarioPresente=route.snapshot.params['idUsuario'];//DECLARAR EL PASO DE ID EN EL ROUTING
    this.avisoExisteReporte();
    this.getReportesParaUsuariosObservable();
  }

  ngOnInit() {
    return;
  }

  //MENSAJE QUE AVISA AL USUARIO LA EXISTENCIA O NO DE REPORTES EN LA PANTALLA
  avisoExisteReporte(){
    if(this.documentosReportes.length>=0){
      this.noHayReportes=true;
    }
    else{
      this.noHayReportes=false;
    }
  }

  //GET REPORTES ESPECIFICOS CREADOS POR EL USUARIO QUE INICIA SESION. ROL DE USUARIO
  async getReportesParaUsuariosObservable() {
    this.serviciosFireStoreDatabase.getReportesParaUsuariosObservable(this.idUsuarioPresente).subscribe({
      next: documentos => {
        //console.log("Documentos actualizados:");
        this.documentosReportes=documentos;
      },
    })
  }

  //CREAR REPORTE CON ID DE PAAMETRO EN RUTA
  navegarFormularioCrearReporte(){
    this.router.navigate(['/crear-reporte']);
    console.log("sin id")
  }

  //ELIMINA EL REPORTE SELECCIONADO
  async eliminarReporte(reporteEliminar: ReportesI){
    this.cargando=true;
    await this.serviciosFireStoreDatabase.eliminarDocPorID( 'Reportes',reporteEliminar.idReporte);
    this.cargando=false;
  }

  //REDIRECCIONAR A GET REPORTE CON ID
  navegarConIDVerReporte(idRep:string){
    this.router.navigate(['/reporte',idRep]);
    console.log("enviando id",idRep)
  }

  //REDIRECCION A EDITAR REPORTE
  async navegarConIDEditarReporte(idRep:string){
    this.router.navigate(['/crear-reporte',idRep]);
    console.log("enviando id editar",idRep)
  }





}
