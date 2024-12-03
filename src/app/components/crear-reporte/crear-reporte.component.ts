import { Component, OnInit } from '@angular/core';
import { DocumentData } from '@angular/fire/firestore';
import { ActivatedRoute, Router } from '@angular/router';
import { EN_PROCESO } from 'src/app/common/constant/constantes';
import { ReportesI } from 'src/app/common/interfaces/reportes.interface';
import { UsuarioI } from 'src/app/common/interfaces/usuarios.interface';
import { FireStorageService } from 'src/app/common/services/fire-storage.service';
import { FireStoreService } from 'src/app/common/services/fire-store.service';
import { AuthServices } from 'src/app/common/services/auth.service';
import { FotoI } from 'src/app/common/interfaces/fotos.interface';
import { InteractionService } from 'src/app/common/services/interaction.service';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { Geolocation } from '@capacitor/geolocation';
import { LocalStorageService } from 'src/app/common/services/local-storage.service';
import { Filesystem, Directory, Encoding } from '@capacitor/filesystem';
import { Plugins } from '@capacitor/core';
import { CapacitorConfig } from '@capacitor/cli';
import { finalize } from 'rxjs/operators';
import { Diagnostic } from '@ionic-native/diagnostic/ngx';


const { PermissionsAndroid } = Plugins;




@Component({
  selector: 'app-crear-reporte',
  templateUrl: './crear-reporte.component.html',
  styleUrls: ['./crear-reporte.component.scss'],
})
export class CrearReporteComponent  implements OnInit {


  //------------------OBJETOS
  reportes: ReportesI[]=[];
  nuevaFotoI:FotoI;
  fotosEditar:FotoI[]=[];
  nuevoReporte:ReportesI;
  usuarioLog: UsuarioI;
  fechaHoy: Date = new Date();
  usuarioOperarioAsignar:UsuarioI;



  //----------------VARIABLES
  cargando:boolean=false;
  numeroActualReportes:number;
  asignableNuevo:number;
  idPresenteDeReporte:string="";
  idPresenteDeUsuario:string="";
  enlacesFotos:string[] =[];
  idsFotosSeleccionadas:string[]=[];
  contadorFotosNombre=0;
  idOperadorElegidoMenorAsignciones:string="";
  contadorAsignaciones=0;
  paraEditar:boolean=false;

  constructor(
    private serviciosFireStore: FireStoreService,
    private servicioFireStorage: FireStorageService,
    private serviciosInteraccion: InteractionService,
    private router: Router,
    private serviciosAuth: AuthServices,
    private route: ActivatedRoute,
    private servicioLocalStorage: LocalStorageService,
    private diagnostic: Diagnostic
  ) {
    this.checkAndEnableGPS();
    //RECIBIENDO ID IDREPORTE
    this.idPresenteDeReporte=route.snapshot.params['idReporte'];
    this.paraEdit();
    this.inicializarUsuarioVacio();
    this.inicializarFotoVacio();

    //TODO cambiar la consulta por el localStorage para el usuario login
    //OBTENCION DE ID USUARIO
    this.serviciosAuth.estadoLogUsuario().subscribe(res =>{
      if(res){
        this.usuarioLog.idUsuario=res.uid;
        this.idPresenteDeUsuario=res.uid;
        this.nuevoReporte.idUsuario=res.uid;
        this.traerUS();
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
    Camera.requestPermissions();
    this.solicitarPermisos();
    Geolocation.requestPermissions();
    return;
  }

  //PREGUNTAR POR PERMISOS
  async solicitarPermisos() {
    const { granted } = await PermissionsAndroid['request'](
      PermissionsAndroid['PERMISSIONS']['WRITE_EXTERNAL_STORAGE']

    );
    return granted;
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
      fechaRegistro: '',
      fotoAvatar:'',
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
      estado: '',
      comentarioOperario:'',
      tipoAsuntoPorOperario:''
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
      estado:EN_PROCESO,
      comentarioOperario:'',
      tipoAsuntoPorOperario:''
    }
  }

  //FUNCION CREAR
  async guardarRegistro(){
    try{
      this.cargando=true;
      this.serviciosInteraccion.cargandoConMensaje("Guardando Reportes")//Interacciones del proceso
      //VEALO
      this.getOperarioAsignar();
      this.nuevoReporte.idOperador=this.idOperadorElegidoMenorAsignciones;
      this.sumarAsignacion(this.idOperadorElegidoMenorAsignciones,this.contadorAsignaciones)
      //Crea y guarda el objeto de reporte
      await this.serviciosFireStore.crearDocumentoGeneralPorID(this.nuevoReporte,'Reportes',this.nuevoReporte.idReporte);
      this.cargando=false;
      this.serviciosInteraccion.mensajeGeneral("Reporte enviado");
      this.serviciosInteraccion.cerrarCargando();
      await this.router.navigate(["/reportes",this.idPresenteDeUsuario]);
    }
    catch(err){
      console.log("Error al crear el reporte");
      console.log(err);
    }
  }

  //FUNCION EDITAR
  async guardarRegistroEditar(){
    try{
      this.cargando=true;
      this.serviciosInteraccion.cargandoConMensaje("Guardando Reportes")//Interacciones del proceso
      //Crea y guarda el objeto de reporte
      await this.serviciosFireStore.actualizarDocumentoPorID(this.nuevoReporte,'Reportes',this.idPresenteDeReporte);
      this.cargando=false;
      this.serviciosInteraccion.mensajeGeneral("Reporte enviado");
      this.serviciosInteraccion.cerrarCargando();
      await this.router.navigate(["/reportes",this.idPresenteDeUsuario]);
    }
    catch(err){
      console.log("Error al editar el reporte");
      console.log(err);
    }
  }

  //EDITAR O CREAR SEGUN DEFINICION DE ID
  async editar_o_Crear(){
    if(this.idPresenteDeReporte!=null || this.idPresenteDeReporte!=undefined ){
      //PARA EDITAR
      const response = await this.serviciosFireStore.getDocumentSolo('Reportes',this.idPresenteDeReporte);
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
        estado: reporteData['estado'] || '',
        comentarioOperario:reporteData['comentarioOperario'] || '',
        tipoAsuntoPorOperario:reporteData['tipoAsuntoPorOperario'] || ''
      };
      this.getFotosPorIdReporte();
    }
    else{
      //PARA CREAR
      this.inicializarNuevoReporteDatosBasicos();
      this.inicializarDatosFoto();
    }
  }

  //METODO EDITAR
  paraEdit(){
    if(this.idPresenteDeReporte=="" || this.idPresenteDeReporte==undefined){
      this.paraEditar=false;
    }
    else{
      this.paraEditar=true;
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
      this.contadorAsignaciones=operadoresConMenosAsignaciones.asignacionesActivas
      return operadoresConMenosAsignaciones;
    }catch(error){
      console.log("Error al buscar con menor asignaciones: ", error);
      return error;
    }
  }

  //AUMENTO AL NUMERO DE AASIGNACIONES AL OPERARIO
  sumarAsignacion(idOp:string, cant:number){
    this.serviciosFireStore.actualizarCampoDocumento(
      "Usuarios",
      idOp,
      "asignacionesActivas",
      cant+1).subscribe(()=>{
        console.log("Aumento asignacion", idOp);
      });
  }

  //TRAER FOTOS POR ID DE REPORTE
  getFotosPorIdReporte(){
    try{
      this.serviciosFireStore.getFotosSegunReporteObservable(this.idPresenteDeReporte).subscribe({
        next: documentosFotos=>{
          this.fotosEditar=documentosFotos;
        }
      });
    }
    catch(e){
      console.log("Error foto editar: ",e)
    }
  }

  //CONSULTA EL USUARIO Y OTORGA/QUITA PERMISOS DE ROL
  async traerUS() {
    try {
      const response = await this.servicioLocalStorage.getDatosDeLocalStorage();
      if (response) {
        const usuarioData: DocumentData = response;
        this.usuarioLog = {
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
        console.log("ROL: ", this.usuarioLog.idRol);
        this.idPresenteDeUsuario=this.usuarioLog.idUsuario
      }
    } catch (error) {
      console.error('Error al traer el usuario del LocalStorage:', error);
    }
  }

  //UTILIZAR CAMARA Y ACEPTA/CANCELA LA FOTO QUE SE TOMA
  async metodoTomarFoto(){
    const image = await Camera.getPhoto({
      quality: 90,
      allowEditing: false,
      resultType: CameraResultType.Base64,
      source:CameraSource.Camera,
    });
    if(image){
      this.guardarEnNubeBs64JPG(image.base64String);
      this.guardarFotoTomadaEnDispositivo(image.base64String);
    }

  }

  //GUARDA FOTO EN EL CELULAR
  async guardarFotoTomadaEnDispositivo(fotoTomada:string){
    await Filesystem.writeFile({
      path: 'Foto.jpg',
      data: fotoTomada,
      directory: Directory.Documents,
    });
  }

  //TOMA LA FOTO QUE REALIZÓ CON LA AMARA, LA CONVIERTE A JPG (ESTA EN BASE64) Y LA SUBE A LA NUBE
  async guardarEnNubeBs64JPG(bs64:string){
    const blob = this.convertidorBs64ToJPG(bs64);
    const nombreRutaCarpetaStorage=this.usuarioLog.correoUsuario;
    const nombreFotoEnStorage="fotoReporte"+this.nuevoReporte.numeroReporte+this.contadorFotosNombre.toString();
    this.serviciosInteraccion.cargandoConMensaje("Cargando foto.")
    const res = await this.servicioFireStorage.cargarFotoFireStorage(blob, nombreRutaCarpetaStorage, nombreFotoEnStorage )
    if(res){
      this.nuevaFotoI.urlFoto=res;
      this.enlacesFotos.push(res)
      this.idsFotosSeleccionadas.push(this.nuevaFotoI.idFoto);
      this.nuevaFotoI.idFoto=this.serviciosFireStore.crearIDUnico();
      await this.serviciosFireStore.crearDocumentoGeneralPorID(this.nuevaFotoI,'Fotos',this.nuevaFotoI.idFoto);
      this.contadorFotosNombre++;
    }
    else{
      this.serviciosInteraccion.mensajeGeneral("Error cargar FS");
    }
    this.serviciosInteraccion.mensajeGeneral("Listo");
    this.serviciosInteraccion.cerrarCargando();
  }

  //CONVERTIR DE BASE64 A JPG
  convertidorBs64ToJPG(base64: string, contentType = 'image/jpeg'): Blob {
    try {
      if (!base64.startsWith('data:image')) {
        base64 = `data:${contentType};base64,${base64}`;
      }

      const byteCharacters = atob(base64.split(',')[1]);
      const byteArrays = [];

      for (let offset = 0; offset < byteCharacters.length; offset += 512) {
        const slice = byteCharacters.slice(offset, offset + 512);
        const byteNumbers = new Array(slice.length);
        for (let i = 0; i < slice.length; i++) {
          byteNumbers[i] = slice.charCodeAt(i);
        }
        byteArrays.push(new Uint8Array(byteNumbers));
      }

      console.log('La conversión de Base64 a Blob se completó con éxito.');
      this.serviciosInteraccion.mensajeGeneral("Conversion exitosa");
      return new Blob(byteArrays, { type: contentType });

    } catch (error) {
      console.error('Error durante la conversión de Base64 a Blob:', error);
      this.serviciosInteraccion.mensajeGeneral("Error de conversion");
      this.serviciosInteraccion.mensajeGeneral("-"+error);
      return null;
    }
  }

  async checkAndEnableGPS() {
    try {
      const isEnabled = await this.diagnostic.isLocationEnabled();
      if (!isEnabled) {
        await this.diagnostic.switchToLocationSettings();
        this.serviciosInteraccion.mensajeGeneral("Activado");
      } else {
        console.log('El GPS ya está habilitado');
        this.serviciosInteraccion.mensajeGeneral("Ya se encuentra activado");
      }
    } catch (error) {
      this.serviciosInteraccion.mensajeGeneral("Error al activar ubicacion");
    }
  }


}
