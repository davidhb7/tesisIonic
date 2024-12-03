import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ReportesI } from 'src/app/common/interfaces/reportes.interface';
import { FireStoreService } from 'src/app/common/services/fire-store.service';
import { ReportesComponent } from '../reportes/reportes.component';
import { DocumentData } from '@angular/fire/firestore';
import { FotoI } from 'src/app/common/interfaces/fotos.interface';
import { InteractionService } from 'src/app/common/services/interaction.service';
import { LocalStorageService } from 'src/app/common/services/local-storage.service';
import { UsuarioI } from 'src/app/common/interfaces/usuarios.interface';
import { OperarioI } from 'src/app/common/interfaces/operario.interface';

@Component({
  selector: 'app-reporte',
  templateUrl: './reporte.component.html',
  styleUrls: ['./reporte.component.scss'],
})
export class ReporteComponent  implements OnInit {

  //OBJETOS
  reporte: ReportesI;
  usuarioLocal:UsuarioI
  operarioAtiende:OperarioI
  fotosDeReporte:FotoI[]=[]

  //VARIABLES
  idPresenteReporte:string;
  destinationLocation: { lat: number; lng: number; };


  constructor(
    private servicioFireStore: FireStoreService,//INYECTANDO DEPENDENCIA
    private route: ActivatedRoute,
    private serviciosInteraccion: InteractionService,
    private serviciosLocalStorage: LocalStorageService

  ) {
    //RECIBE EL ID QUE TRAE EL NAVEGADOR DE COMPONENTE: poner el id tal cual la interfazS
    this.idPresenteReporte=route.snapshot.params['idReporte'];
    this.inicializarUsuarioLocalVacio();
    this.traerUSLocal();

    this.inicializarOperarioVacio();

    this.inicializarEnVacio();
    this.getReporteSoloVer();
    this.getFotosPorIdReporte();

  }

  ngOnInit() {
    return;
  }

  inicializarUsuarioLocalVacio(){
    this.usuarioLocal = {
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
    }
  }
  inicializarOperarioVacio(){
    this.operarioAtiende ={
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
    }
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
      estado: '',
      comentarioOperario:'',
      tipoAsuntoPorOperario:''
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
      estado: reporteData['estado'] || '',
      comentarioOperario:reporteData['comentarioOperario'] || '',
      tipoAsuntoPorOperario:reporteData['tipoAsuntoPorOperario'] || '',
    }
    this.actualizarUbicacionReporte(this.reporte.ubicacion);
    this.getUsuarioPorID();
    console.log(this.reporte)
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


  async traerUSLocal() {
    try {
      const response = await this.serviciosLocalStorage.getDatosDeLocalStorage();
      if (response) {
        const usuarioData: DocumentData = response;
        this.usuarioLocal = {
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
      }
    } catch (error) {
      console.error('Error al traer el usuario del LocalStorage:', error);
    }
  }


  async getUsuarioPorID(){
    const response= await this.servicioFireStore.getDocumentSolo("Usuarios", this.reporte.idOperador);
    const usuarioData: DocumentData = response.data();
    this.operarioAtiende={
      idUsuario: usuarioData['idUsuario'] || '',
      identificacionUsuario:  usuarioData['cedulausuario'] ||'',
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
      asignacionesActivas:usuarioData['esActivo'] || true,
      fechaRegistro: usuarioData['fechaRegistro'] || ''
    }
  }

}
