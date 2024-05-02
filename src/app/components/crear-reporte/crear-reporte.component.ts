import { Component, Input, OnInit } from '@angular/core';
import { DocumentData } from '@angular/fire/firestore';
import { ActivatedRoute, Router } from '@angular/router';
import { EN_PROCESO } from 'src/app/commonFS/constantes/constantes';
import { ReportesI } from 'src/app/commonFS/models-interfaceFS/reportes.interface';
import { UsuarioI } from 'src/app/commonFS/models-interfaceFS/usuarios.interface';
import { FireStorageService } from 'src/app/commonFS/servicesFS/fire-storage.service';
import { FireStoreService } from 'src/app/commonFS/servicesFS/fire-store.service';
import { AuthServices } from 'src/app/commonFS/servicesFS/auth.service';
import { FotoI } from 'src/app/commonFS/models-interfaceFS/fotos.interface';
import { InteractionService } from 'src/app/commonFS/servicesFS/interaction.service';

import { Geolocation, GeolocationPosition, GeolocationPermissionType } from '@capacitor/geolocation';



@Component({
  selector: 'app-crear-reporte',
  templateUrl: './crear-reporte.component.html',
  styleUrls: ['./crear-reporte.component.scss'],
})
export class CrearReporteComponent  implements OnInit {


  //------------------OBJETOS
  reportes: ReportesI[]=[];
  nuevaFotoI:FotoI;
  nuevoReporte:ReportesI;
  usuarioLog: UsuarioI;
  fechaHoy: Date = new Date();



  //----------------VARIABLES
  cargando:boolean=false;
  numeroActualReportes:number;
  asignableNuevo:number;
  idPresenteDeReporte:string;
  idPresenteDeUsuario:string;
  enlacesFotos:string[] =[];
  contadorFotosNombre=0;

  constructor(
    private serviciosFireStore: FireStoreService,
    private servicioFireStorage: FireStorageService,
    private serviciosInteraccion: InteractionService,
    private router: Router,
    private serviciosAuth: AuthServices,
    private route: ActivatedRoute,
    //private geolocation: Geolocation
  ) {
    //RECIBIENDO ID IDREPORTE
    this.idPresenteDeReporte=route.snapshot.params['idReporte'];
    this.inicializarUsuarioVacio();
    this.inicializarFotoVacio();


    //OBTENCION DE ID USUARIO
    this.serviciosAuth.estadoLogUsuario().subscribe(res =>{
      if(res){
        this.usuarioLog.idUsuario=res.uid;
        this.idPresenteDeUsuario=res.uid;
        this.nuevoReporte.idUsuario=res.uid;
      }
      else{
        console.log("NO LOG")
      }
    });

    //LLAMAR SERVICIO DE CONTEO DE REPORTES Y CONVERSION DE NUMERO A LA VARIABLE A MANEJAR
    this.serviciosFireStore.contarNumeroDocumentosTotal("Reportes").then((numero: number) => {
    this.numeroActualReportes = numero;
    this.asignableNuevo=this.numeroActualReportes+1
    this.nuevoReporte.numeroReporte=this.asignableNuevo
    });
    //FIN CONTEO REPORTES

    this.inicializarReporteEnVacio();
    this.cargando=false;
    this.editar_o_Crear();
  }

  ngOnInit() {
    return;
  }

  //INICIALIZAR USUARIO VACIO
  inicializarUsuarioVacio(){
    this.usuarioLog = {
      idUsuario: '',
      cedulausuario:'',
      numeroReferenciaUsuario: 0,
      nombreUsuario: '',
      correoUsuario: '',
      celularUsuario: '',
      direccionUsuario: '',
      telefonoUsuario: '',
      clave: '',
      idRol: '',
      esActivo: '',
      fechaRegistro: ''
    };
  }

  //INICIALIZAR FOTO EN VACIO
  inicializarFotoVacio(){
    this.nuevaFotoI={
      idFoto:'',
      idReporte: '',
      idUsuario: '',
      fechaFoto:'',
      nombreFoto: '',
      urlFoto:[]
    }

  }

  //INICIALIZAR CON VACIO
  inicializarReporteEnVacio(){
    this.nuevoReporte ={
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

  //INICIALIZACION PARA CREAR
  inicializarNuevoReporte(){
    let fechaHoyString: string = `${this.fechaHoy.getDate()}/${this.fechaHoy.getMonth() + 1}/${this.fechaHoy.getFullYear()} ${this.fechaHoy.getHours()}:${this.fechaHoy.getMinutes()}`;
    //this.nuevoReporte.idReporte= this.serviciosFireStore.crearIDUnico();
    this.nuevoReporte={
      idReporte: this.serviciosFireStore.crearIDUnico(),
      numeroReporte: this.asignableNuevo,
      descripcion: "",
      ubicacion: "Lat: 0, Long: 0",
      fechaRegistroReporte: fechaHoyString,
      fechaAtencionReporte: "",
      fechaFinReporte: "",
      idUsuario: this.idPresenteDeUsuario,
      idOperador: '',
      idEmpresa: '',
      idFoto: '',
      estado:EN_PROCESO
    }
  }

  //FUNCION GUARDAR
  async guardarRegistro(){
    this.cargando=true;
    this.serviciosInteraccion.cargandoConMensaje("Guardando Reportes")
    await this.serviciosFireStore.crearDocumentoGeneralPorID(this.nuevoReporte,'Reportes',this.nuevoReporte.idReporte);
    this.nuevaFotoI.urlFoto=this.enlacesFotos;
    await this.serviciosFireStore.crearDocumentoGeneralPorID(this.nuevaFotoI,'Fotos',this.nuevaFotoI.idFoto);
    this.cargando=false;
    this.serviciosInteraccion.mensajeGeneral("Reporte enviado");
    this.serviciosInteraccion.cerrarCargando();
    await this.router.navigate(["/reportes",this.idPresenteDeUsuario]);
  }

  //EDITAR SEGUN DEFINICION DE ID
  async editar_o_Crear(){
    if(this.idPresenteDeReporte!=null || this.idPresenteDeReporte!=undefined ){
      //PARA EDITAR
      const response = await this.serviciosFireStore.getDocumentSolo( 'Reportes',this.idPresenteDeReporte);
      const reporteData: DocumentData = response.data();
      this.nuevoReporte ={
        idReporte: reporteData['idReporte'] || '',
        numeroReporte: reporteData['numeroReporte'] || 0,
        descripcion: reporteData['descripcion'] || '',
        ubicacion: reporteData['ubicacion'] || '',
        fechaRegistroReporte: reporteData['fechaRegistroReporte'] || '',
        fechaAtencionReporte: reporteData['fechaAtencionReporte'] || '',
        fechaFinReporte: reporteData['fechaFinReporte'] || '',
        idUsuario: reporteData['idUsuario'] || '',
        idOperador: reporteData['idOperador'] || 0,
        idEmpresa: reporteData['idEmpresa'] || 0,
        idFoto: reporteData['idFoto'] || 0,
        estado: reporteData['estado'] || ''
      }
    }
    else{
      //PARA CREAR
      this.inicializarNuevoReporte();
      this.inicializarDatosFoto();
    }
  }




  //CONSUMO DE SERVICIO SUBIR FOTOS AL STORAGE AL CREAR EL REPORTE
  async subirFotoCrearReporte(event:any){
    const rutaPath="Fotos de Reportes";
    const nombre="fotoReporte"+this.nuevoReporte.numeroReporte+this.contadorFotosNombre.toString();
    const archivo= event.target.files[0];
    const res = await this.servicioFireStorage.cargarFotoFireStorage(archivo, rutaPath, nombre );
    console.log("ENLACE res ", res)
    this.enlacesFotos.push(res)
    this.contadorFotosNombre++;
    console.log("arreglo enlaces",this.enlacesFotos)
  }

  //CREA EL DOCUMENTO DE FOTOS, AGREGA LOS LINKS DE LAS FOTOS EN EL DOCUMENTO
  inicializarDatosFoto(){
    let fechaHoyStringFoto: string = `${this.fechaHoy.getDate()}/${this.fechaHoy.getMonth() + 1}/${this.fechaHoy.getFullYear()} ${this.fechaHoy.getHours()}:${this.fechaHoy.getMinutes()}`;
    this.nuevaFotoI={
      idFoto:this.serviciosFireStore.crearIDUnico(),
      idReporte: this.nuevoReporte.idReporte,
      idUsuario: this.usuarioLog.idUsuario,
      fechaFoto: fechaHoyStringFoto,
      nombreFoto: '',
      urlFoto:[]
    }
  }


  async tomarubicacion(){
    this.serviciosInteraccion.cargandoConMensaje("Tomando coordenadas")
    const parametrosUbicacion = {
      enableHighAccuracy: true, // Obtener coordenadas más precisas
      maximumAge: 5000 // No obtener coordenadas de caché mayores a 5 segundos
    };
    const localizacion = await Geolocation.getCurrentPosition(parametrosUbicacion);
    this.serviciosInteraccion.mensajeGeneral("Hecho!");
    this.serviciosInteraccion.cerrarCargando();
    console.log(localizacion.coords.latitude, localizacion.coords.longitude );
    this.nuevoReporte.ubicacion=localizacion.coords.latitude.toString() +" "+ localizacion.coords.longitude.toString()
  }




}
