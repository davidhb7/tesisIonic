import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { EN_PROCESO } from 'src/app/common/constant/constantes';
import { ReportesI } from 'src/app/common/interfaces/reportes.interface';
import { FireStoreService } from 'src/app/common/services/fire-store.service';
import { InteractionService } from 'src/app/common/services/interaction.service';

@Component({
  selector: 'app-repetidor-reportes',
  templateUrl: './repetidor-reportes.component.html',
  styleUrls: ['./repetidor-reportes.component.scss'],
})
export class RepetidorReportesComponent  implements OnInit {

  //OBJETOS Y CLASES
  formGroupCrearReportes: FormGroup;
  nuevoReporte:ReportesI;
  nuevosReportes:ReportesI[]=[];
  fechaHoy: Date = new Date();



  //VARIABLES
  asignableNuevo:number;
  idOperadorElegidoMenorAsignciones:string="";
  cantidadReportes=0;
  localizaciones: { lat: number, lng: number};
  contadorAsignaciones=0;
  numeroActualReportes:number;


  constructor(
    private formBuilder: FormBuilder,
    private serviciosFireStore: FireStoreService,
    private serviciosInteraccion: InteractionService,
    private router: Router,
  ) {



    this.formGroupCrearReportes=this.formBuilder.group({
      cantidadReportes:['', [Validators.required, Validators.pattern('[0-9]*'), Validators.min(1)]],
      latitud:['', Validators.required],
      longitud: ['', Validators.required],
    });
    this.inicializarReporteEnVacio();
    this.inicializarNuevoReporteDatosBasicos();


  }

  ngOnInit() {
    return;
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
      numeroReporte: this.asignableNuevo,
      descripcion: "",
      ubicacion: "",
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

      console.log(operadoresConMenosAsignaciones.asignacionesActivas+1);
      this.nuevoReporte.idOperador=this.idOperadorElegidoMenorAsignciones;
      return operadoresConMenosAsignaciones;
    }catch(error){
      console.log("Error al buscar con menor asignaciones: ", error);
      return error;
    }
  }

  sumarAsignacion(idOp:string, cant:number){
    this.serviciosFireStore.actualizarCampoDocumento(
      "Usuarios",
      idOp,
      "asignacionesActivas",
      cant+1).subscribe(()=>{
        console.log("Aumento asignacion", idOp);
      });
  }

  conteoNumeroRep(){
    //LLAMAR SERVICIO DE CONTEO DE REPORTES Y CONVERSION DE NUMERO A LA VARIABLE A MANEJAR
    this.serviciosFireStore.contarNumeroDocumentosTotal("Reportes").then((numero: number) => {
      this.numeroActualReportes = numero;
      this.asignableNuevo=this.numeroActualReportes+1
      this.nuevoReporte.numeroReporte=this.asignableNuevo
    });
  }

  async crearReportes() {



    let cnt=this.formGroupCrearReportes.get("cantidadReportes").value;
    let ub=this.formGroupCrearReportes.get("latitud").value.toString()+", "+this.formGroupCrearReportes.get("longitud").value.toString()


    while(cnt>0){
      this.conteoNumeroRep()

      this.nuevoReporte.descripcion="Reporte masivo #"+cnt.toString();
      this.nuevoReporte.ubicacion=ub;
      this.nuevoReporte.idReporte= this.serviciosFireStore.crearIDUnico(),

      this.getOperarioAsignar();
      try{
        this.sumarAsignacion(this.idOperadorElegidoMenorAsignciones,this.contadorAsignaciones);
      }catch(e){
        console.log("no se sumó: ",e)
      }

      //Crea y guarda el objeto de reporte
      await this.serviciosFireStore.crearDocumentoGeneralPorID(this.nuevoReporte,'Reportes',this.nuevoReporte.idReporte).catch((err)=>{
        console.log("no se guardo reporte #", cnt, "error: ",err)
      });
      console.log(cnt);
      cnt--;
      this.idOperadorElegidoMenorAsignciones="";
    }
    this.formGroupCrearReportes.reset();
    this.router.navigate(['menu']);
  }

}
