import { Component, OnInit } from '@angular/core';
import { DocumentData } from '@angular/fire/firestore';
import { ActivatedRoute, Router } from '@angular/router';
import { EN_PROCESO, OPERADOR } from 'src/app/common/constant/constantes';
import { ReportesI } from 'src/app/common/interfaces/reportes.interface';
import { UsuarioI } from 'src/app/common/interfaces/usuarios.interface';
import { FireStorageService } from 'src/app/common/services/fire-storage.service';
import { FireStoreService } from 'src/app/common/services/fire-store.service';
import { AuthServices } from 'src/app/common/services/auth.service';
import { FotoI } from 'src/app/common/interfaces/fotos.interface';
import { InteractionService } from 'src/app/common/services/interaction.service';
import { Camera, CameraResultType } from '@capacitor/camera';

import { Geolocation } from '@capacitor/geolocation';



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
  usuarioOperarioAsignar:UsuarioI;



  //----------------VARIABLES
  cargando:boolean=false;
  numeroActualReportes:number;
  asignableNuevo:number;
  idPresenteDeReporte:string;
  idPresenteDeUsuario:string;
  enlacesFotos:string[] =[];
  idsFotosSeleccionadas:string[]=[];
  contadorFotosNombre=0;
  idOperadorElegidoMenorAsignciones:string="";

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



    //TODO cambiar la consulta por el localStorage para el usuario login
    //OBTENCION DE ID USUARIO
    this.serviciosAuth.estadoLogUsuario().subscribe(res =>{
      if(res){
        this.usuarioLog.idUsuario=res.uid;
        this.idPresenteDeUsuario=res.uid;
        this.nuevoReporte.idUsuario=res.uid;
        this.getUsuarioPorID();
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

  //INICIALIZAR FOTO EN VACIO
  inicializarFotoVacio(){
    this.nuevaFotoI={
      idFoto:'',
      idReporte: '',
      idUsuario: '',
      fechaFoto:'',
      nombreFoto: '',
      urlFoto:''
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
      idUsuario: '',
      idOperador:  '',
      idEmpresa: '',
      idFoto:  '',
      estado: ''
    }
  }

  //INICIALIZACION PARA CREAR CON DATOS BASICOS
  inicializarNuevoReporteDatosBasicos(){
    this.getOperarioAsignar();
    let fechaHoyString: string = `${this.fechaHoy.getDate()}/${this.fechaHoy.getMonth() + 1}/${this.fechaHoy.getFullYear()} ${this.fechaHoy.getHours()}:${this.fechaHoy.getMinutes()}`;
    this.nuevoReporte={
      idReporte: this.serviciosFireStore.crearIDUnico(),
      numeroReporte: this.asignableNuevo,
      descripcion: "",
      ubicacion: "Sin ubicacion",
      fechaRegistroReporte: fechaHoyString,
      fechaAtencionReporte: "",
      fechaFinReporte: "",
      idUsuario: '',
      idOperador: '',
      idEmpresa: '',
      idFoto: '',
      estado:EN_PROCESO
    }
  }

  //FUNCION CREAR - GUARDAR
  async guardarRegistro(){
    try{
      this.cargando=true;
      this.serviciosInteraccion.cargandoConMensaje("Guardando Reportes")//Interacciones del proceso
      //VEALO
      this.getOperarioAsignar();
      this.nuevoReporte.idOperador=this.idOperadorElegidoMenorAsignciones;
      //Crea y guarda el objeto de reporte
      await this.serviciosFireStore.crearDocumentoGeneralPorID(this.nuevoReporte,'Reportes',this.nuevoReporte.idReporte);
      this.cargando=false;
      this.serviciosInteraccion.mensajeGeneral("Reporte enviado");
      this.serviciosInteraccion.cerrarCargando();
      await this.router.navigate(["/reportes",this.idPresenteDeUsuario]);
    }
    catch(err){
      console.log("Error al crear el reporte",err);
    }
  }

  //EDITAR O CREAR SEGUN DEFINICION DE ID
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
      this.inicializarNuevoReporteDatosBasicos();
      this.inicializarDatosFoto();
    }
  }

  //CONSUMO DE SERVICIO SUBIR FOTOS AL STORAGE MIENTRAS SE CREA EL REPORTE
  async subirFotoCrearReporte(event:any){
    const nombreRutaCarpetaStorage=this.usuarioLog.correoUsuario;
    const nombreFotoEnStorage="fotoReporte"+this.nuevoReporte.numeroReporte+this.contadorFotosNombre.toString();
    const archivo= event.target.files[0];
    this.serviciosInteraccion.cargandoConMensaje("Cargando foto.")
    const res = await this.servicioFireStorage.cargarFotoFireStorage(archivo, nombreRutaCarpetaStorage, nombreFotoEnStorage );
    this.nuevaFotoI.urlFoto=res;
    this.enlacesFotos.push(res)
    this.idsFotosSeleccionadas.push(this.nuevaFotoI.idFoto);
    this.nuevaFotoI.idFoto=this.serviciosFireStore.crearIDUnico();
    await this.serviciosFireStore.crearDocumentoGeneralPorID(this.nuevaFotoI,'Fotos',this.nuevaFotoI.idFoto);
    this.contadorFotosNombre++;
    this.serviciosInteraccion.mensajeGeneral("Listo");
    this.serviciosInteraccion.cerrarCargando();
    console.log("arreglo enlaces",this.enlacesFotos)
  }

  //ELIMINAR FOTO SELECCIONADA
  eliminarFoto(url: string, fotoID?:string) {
    //ELIMINANDO LA FOTO DEL STORAGE
    this.servicioFireStorage.eliminarFotoFireStorage(url).then(() => {
      console.log('Foto eliminada con éxito');
    }).catch(error => {
      console.error('Error al eliminar la foto', error);
    });
    //ELIMINANDO LA FOTO DE LA COLECCION
    // this.serviciosFireStore.eliminarDocPorID("Fotos", this.nuevaFotoI)
    if(url==this.nuevaFotoI.urlFoto){
      this.serviciosFireStore.eliminarDocPorID("Fotos", this.nuevaFotoI.idFoto);
      console.log(this.nuevaFotoI.idFoto);
    }
    //ELIMINANDO LA FOTO DEL ARREGLO
    //const valorAEliminar = 'valor'; // El valor que deseas eliminar
    const indice = this.enlacesFotos.indexOf(url);
    if (indice !== -1) {
        this.enlacesFotos.splice(indice, 1); // Elimina un elemento en el índice encontrado
    }
    this.serviciosInteraccion.mensajeGeneral("Eliminada.");
    this.serviciosInteraccion.cerrarCargando();

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
      urlFoto:''
    }
  }

  //TOMA LA UBICACION DE QUIEN REALIZA EL REPORTE
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

  //METODO PARA USAR LA CAMARA DEL DISPOSITIVO
  async tomarFoto(){
    const foto =await Camera.getPhoto({
      quality: 90,
      allowEditing: true,
      resultType: CameraResultType.Uri
    });
    let fotoUrl = foto.webPath;
    console.log("fotoUrl",fotoUrl);
    console.log("foto",fotoUrl);
  }

  //OBTENER USUARIO QUE HACE REGISTRO
  async getUsuarioPorID(){
    this.serviciosInteraccion.cargandoConMensaje("Cargando");
    const response = await this.serviciosFireStore.getDocumentSolo('Usuarios',this.usuarioLog.idUsuario);
    const usuarioData: DocumentData = response.data();
    this.usuarioLog = {
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
      disponibleOperario:usuarioData['esActivo'] || true,
      esActivo: usuarioData['esActivo'] || true,
      asignacionesActivas: usuarioData['esActivo'] || 0,
      fechaRegistro: usuarioData['fechaRegistro'] || ''
    }
    this.serviciosInteraccion.cerrarCargando();
  }

  //TODO
  // ASIGNACION AUTOMATICA DE OPERARIOS
  async getOperarioAsignar(){
    try{
      const operadoresAsignaciones= await this.serviciosFireStore.getUsuariosOperariosParaAsignaciones();
      let operadoresConMenosAsignaciones= operadoresAsignaciones[0];
      operadoresAsignaciones.forEach((operador)=>{
        if(operador.asignacionesActivas<operadoresConMenosAsignaciones.asignacionesActivas){
          operadoresConMenosAsignaciones=operador;
        }
      });
      this.idOperadorElegidoMenorAsignciones=operadoresConMenosAsignaciones.idUsuario;
      console.log("vea: ",this.idOperadorElegidoMenorAsignciones,  "rol ", operadoresConMenosAsignaciones.idRol);
      return operadoresConMenosAsignaciones;
    }catch(error){
      console.log("error al buscar con menor asignaciones: ", error);
      return error;
    }

  }

  //TODO
  //CATEGORIZAR REPORTE DESDE LA EMPRESA DE 1 A 5

  //TODO
  //EN EDITAR, VOLVER A PONER LA FOTO ASIGNADA AL REPORTE AL EDITAR
}
