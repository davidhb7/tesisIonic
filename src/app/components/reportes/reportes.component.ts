import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { ReportesI } from 'src/app/common/interfaces/reportes.interface';
import { UsuarioI } from 'src/app/common/interfaces/usuarios.interface';
import { FireStoreService } from 'src/app/common/services/fire-store.service';
import { InteractionService } from 'src/app/common/services/interaction.service';
import { DocumentData } from '@angular/fire/firestore';
import { MenuComponent } from 'src/app/pages/menu/menu.component';
import { EN_PROCESO } from 'src/app/common/constant/constantes';
import { LocalStorageService } from 'src/app/common/services/local-storage.service';

@Component({
  selector: 'app-reportes',
  templateUrl: './reportes.component.html',
  styleUrls: ['./reportes.component.scss'],
})
export class ReportesComponent  implements OnInit {

  //OBJETOS
  documentosReportes:ReportesI[]=[];
  documentosGeneralesReportes: ReportesI[]=[];
  usuarioPresente:UsuarioI;
  //CUANDO ES-CLI
  reportresUsuarioPendientes:ReportesI[]=[];
  reportresUsuarioSolucionado:ReportesI[]=[];


  //VARIABLES
  hayReportes:boolean;
  cargando:boolean=false;
  idUsuarioPresente:string;



  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private serviciosFireStoreDatabase: FireStoreService,//INYECTANDO DEPENDENCIA
    private serviciosInteraccion: InteractionService,
    private servicioLocalStorage: LocalStorageService
  ) {
    this.inicializarUSVacio()
    this.idUsuarioPresente=route.snapshot.params['idUsuario'];//DECLARAR EL PASO DE ID EN EL ROUTING


    this.avisoExisteReporte();

    //CONDICIONAL PARA ESTOS...
    this.tipoUsuario();


  }

  ngOnInit() {
    return;
  }
  //INICIALIZAR USUARIO VACIO
  inicializarUSVacio(){
    this.usuarioPresente = {
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
      fotoAvatar:''
    };

  }


  //SI ES EMPRESA U OPERARIO, TRAER TODOS LOS REPORTES
  getReportesGeneralesEmpresaOperario(){
    this.serviciosFireStoreDatabase.getDocumentosGeneralAtentoCambios<ReportesI>("Reportes").subscribe(
      data=>{
        if(data){
          this.documentosGeneralesReportes=data;
          console.log("Respuesta general: ",data)
        }
      }
    )
  }

  //MENSAJE QUE AVISA AL USUARIO LA EXISTENCIA O NO DE REPORTES EN LA PANTALLA
  avisoExisteReporte(){
    if(this.documentosReportes.length>=0 || this.documentosGeneralesReportes.length>=0){
      this.hayReportes=true;
    }
    else{
      this.hayReportes=false;
    }
  }

  //GET REPORTES ESPECIFICOS CREADOS POR EL USUARIO QUE INICIA SESION. ROL DE USUARIO
  async getReportesParaUsuariosObservable() {
    this.serviciosFireStoreDatabase.getReportesParaUsuariosObservable(this.idUsuarioPresente).subscribe({
      next: documentos => {
        this.documentosReportes=documentos;
      },
    })
  }


  //CREAR REPORTE CON ID DE PARAMETRO EN RUTA
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

  //CONSULTAR USUARIO
  async tipoUsuario(){
    const response= await this.servicioLocalStorage.getDatosDeLocalStorage();
    const usuarioData: DocumentData = response;
    this.usuarioPresente= {
      idUsuario: usuarioData['idUsuario'] ||'',
      identificacionUsuario: usuarioData['cedulausuario'] ||'',
      numeroReferenciaUsuarioConsumidor: usuarioData['numeroReferenciaUsuario'] || 0,
      nombreUsuario: usuarioData['nombreUsuario'] ||'',
      correoUsuario: usuarioData['correoUsuario'] || '',
      celularUsuario: usuarioData['celularUsuario'] ||'',
      direccionUsuario: usuarioData['direccionUsuario'] ||'',
      telefonoUsuario: usuarioData['telefonoUsuario'] ||'',
      clave: usuarioData['clave'] ||'',
      idRol: usuarioData['idRol'] ||'',
      disponibleOperario: usuarioData['esActivo'] || true,
      esActivo: usuarioData['esActivo'] ||true,
      asignacionesActivas:usuarioData['esActivo'] || 0,
      fechaRegistro: usuarioData['fechaRegistro'] || '',
      fotoAvatar:usuarioData['fotoAvatar'] || ''
    }
    console.log(this.usuarioPresente);
    this.serviciosInteraccion.cerrarCargando();
    this.mostrarReportesSegunUsuario();
  }


  //MUESTRA REPORTES SEGUN EL USUARIO. TODOS O LOS DE LOS DEL USUARIO EN PARTICULAR
  mostrarReportesSegunUsuario(){
    if(this.usuarioPresente.idRol=="1" || this.usuarioPresente.idRol=="2" || this.usuarioPresente.idRol=="3"){
      this.getReportesGeneralesEmpresaOperario();
    }
    else if(this.usuarioPresente.idRol=="4"){
      this.getReportesParaUsuariosObservable();
    }
    else{
      this.hayReportes=false;
    }
  }





}
