import { Component, OnInit } from '@angular/core';
import { DocumentData } from '@angular/fire/firestore';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ARREGLO_CONSTANTES, ARREGLO_CONSTANTES_MASIVO, SOLUCIONADO } from 'src/app/common/constant/constantes';
import { ReportesI } from 'src/app/common/interfaces/reportes.interface';
import { UsuarioI } from 'src/app/common/interfaces/usuarios.interface';
import { FireStoreService } from 'src/app/common/services/fire-store.service';
import { InteractionService } from 'src/app/common/services/interaction.service';
import { LocalStorageService } from 'src/app/common/services/local-storage.service';

@Component({
  selector: 'app-repetidor-reportes',
  templateUrl: './repetidor-reportes.component.html',
  styleUrls: ['./repetidor-reportes.component.scss'],
})
export class RepetidorReportesComponent  implements OnInit {

  //OBJETOS Y CLASES
  usuarioLog:UsuarioI;
  formGroupCrearReportes: FormGroup;
  nuevoReporte:ReportesI;
  nuevosReportes:ReportesI[]=[];
  fechaHoy: Date = new Date();



  //VARIABLES
  asignableNuevo:number;
  idUsuarioReporta:string=""
  idOperadorElegidoMenorAsignciones:string="";
  cantidadReportes=0;
  localizaciones: { lat: number, lng: number};
  contadorAsignaciones=0;
  numeroActualReportes:number;

  xnuevoNumRep=0;


  constructor(
    private formBuilder: FormBuilder,
    private serviciosFireStore: FireStoreService,
    private serviciosInteraccion: InteractionService,
    private router: Router,
    private servicioLocalStorage: LocalStorageService
  ) {
    this.formGroupCrearReportes=this.formBuilder.group({
      cantidadReportes:['', [Validators.required, Validators.pattern('[0-9]*'), Validators.min(1)]],
      latitud:['', Validators.required],
      longitud: ['', Validators.required],
    });
    this.inicializarReporteEnVacio();
  }

  ngOnInit() {
    return;
  }

  //CONSULTA EL USUARIO Y OTORGA/QUITA PERMISOS DE ROL
  async traerUS() {
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
        this.idUsuarioReporta = this.usuarioLog.idUsuario;
      }
  }

  //INICIALIZAR CON VACIO
  inicializarReporteEnVacio(){
    this.nuevoReporte = {
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

  //this.formGroupCrearReportes.get("latitud").value.toString()+this.formGroupCrearReportes.get("longitud").value.toString(),
  //INICIALIZACION PARA CREAR CON DATOS BASICOS
  inicializarNuevoReporteDatosBasicos(){
    this.getOperarioAsignar();
    let fechaHoyString: string = `${this.fechaHoy.getDate()}/${this.fechaHoy.getMonth() + 1}/${this.fechaHoy.getFullYear()} ${this.fechaHoy.getHours()}:${this.fechaHoy.getMinutes()}`;
    this.nuevoReporte={
      idReporte: '',
      numeroReporte: 0,
      descripcion: "",
      ubicacion: "",
      fechaRegistroReporte: fechaHoyString,
      fechaAtencionReporte: fechaHoyString,
      fechaFinReporte: fechaHoyString,
      idUsuario: this.idUsuarioReporta,
      idOperador: '',
      idEmpresa: '',
      idFoto: '',
      estado:SOLUCIONADO,
      comentarioOperario:'',
      tipoAsuntoPorOperario:''
    }
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
      this.serviciosFireStore.actualizarCampoDocumento("Usuarios",this.idOperadorElegidoMenorAsignciones,"asignacionesActivas",operadoresConMenosAsignaciones.asignacionesActivas+1);
      this.nuevoReporte.idOperador=this.idOperadorElegidoMenorAsignciones;
      return operadoresConMenosAsignaciones;
    }catch(error){
      console.log("Error al buscar con menor asignaciones: ", error);
      return error;
    }
  }

  //SUMA DE ASIGNACIONES DE OPERARIO
  // sumarAsignacion(idOp:string, cant:number){
  //   this.serviciosFireStore.actualizarCampoDocumento(
  //     "Usuarios",
  //     idOp,
  //     "asignacionesActivas",
  //     cant+1).subscribe(()=>{
  //       console.log("Aumentó asignacion", idOp);
  //     });
  // }




  //CUENTA NUMERO REPORTES EXISTENTES
  conteoNumeroRep(){
    //LLAMAR SERVICIO DE CONTEO DE REPORTES Y CONVERSION DE NUMERO A LA VARIABLE A MANEJAR
    this.serviciosFireStore.contarNumeroDocumentosTotal("Reportes").then((numero: number) => {
      this.numeroActualReportes = numero;
      this.asignableNuevo=this.numeroActualReportes+1
      this.nuevoReporte.numeroReporte=this.asignableNuevo
    });
    this.xnuevoNumRep=this.asignableNuevo;
    return this.xnuevoNumRep
  }

  //ASIGNACION ALEATORIA DEL ESTADO DEL REPORTE
  getEstadoAleatorioOperarioAReporte(){
    const items = ARREGLO_CONSTANTES_MASIVO
    const randomIndex = Math.floor(Math.random() * items.length);
    const randomItem = items[randomIndex];
    return randomItem;
    // console.log(randomItem);
  }

  //CREAR REPORTES EN MASA SEGUN LA CANTIDAD Y UBICACION OTORGADOS EN EL FORMULARIO
  async crearReportes() {
    let cnt=this.formGroupCrearReportes.get("cantidadReportes").value;
    let ub=this.formGroupCrearReportes.get("latitud").value.toString()+", "+this.formGroupCrearReportes.get("longitud").value.toString()
    let cantInicioMasivo=1;
    while(cnt>0){
      let analisisAleatorio=this.getEstadoAleatorioOperarioAReporte();
      console.log("cantidad: ",cnt);
      console.log("ubicacion: ",ub);
      console.log("repo: ",analisisAleatorio);
      this.inicializarNuevoReporteDatosBasicos();
      this.conteoNumeroRep();
      this.nuevoReporte.comentarioOperario= "Reporte masivo #",cantInicioMasivo.toString();
      this.nuevoReporte.descripcion="Descripcion basica de reporte masivo #", cantInicioMasivo.toString();
      this.nuevoReporte.tipoAsuntoPorOperario=analisisAleatorio;
      this.nuevoReporte.ubicacion=ub;
      this.nuevoReporte.idReporte=this.serviciosFireStore.crearIDUnico();
      this.serviciosFireStore.crearDocumentoGeneralPorID(this.nuevoReporte,"Reportes",this.nuevoReporte.idReporte);
      cnt--;
      cantInicioMasivo++;
    }
    console.log("terminó en ", cnt)
    // this.formGroupCrearReportes.reset();
    this.router.navigate(['/menu']);
  }

}
