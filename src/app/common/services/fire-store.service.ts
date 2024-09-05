import { Injectable, inject } from '@angular/core';
import { Firestore, collectionData, deleteDoc, doc, getDocFromServer, getDocs, onSnapshot, setDoc, updateDoc } from '@angular/fire/firestore';
import { collection, getCountFromServer, query, where } from 'firebase/firestore';

import { Observable } from 'rxjs';

//DECLARACION UNICA DE ID PARA FIRESTORE
import { v4 as uuidv4 } from 'uuid';


import { ReportesI } from '../interfaces/reportes.interface';
import { FotoI } from '../interfaces/fotos.interface';
import { UsuarioI } from '../interfaces/usuarios.interface';
import { OPERADOR } from '../constant/constantes';

@Injectable({
  providedIn: 'root'
})



export class FireStoreService {
  private firestore: Firestore = inject(Firestore);

  constructor(

  ) {
  }

  //CREAR ID ALEATORIO
  crearIDUnico(){
    const uuid = uuidv4();
    console.log("El idUnico", uuid);
    return uuid;
  }

  //EL GET DOCUMENTO SOLO
  async getDocumentSolo(enlace: string, idDoc:string) {
    const documento = doc(this.firestore, `${enlace}/${idDoc}`);
    return await getDocFromServer(documento);
  }


  //GET
  //TRAE TODOS LOS DOCUMENTOS DE ESA COLECCION?
  //TRAER Y OBTENER LOS CAMBIOS DE LA COLECCION.
  //LEE CUALQUEIR COLECCION. ESTA PENDIENTE DE LOS CAMBIOS
  getDocumentosGeneralAtentoCambios<tipo>(path: string){//tipo: es el campo o variable a leer. Argumento. Path es la ruta a la BDD de firestore
    const itemColection = collection(this.firestore, path);//path: es la ruta de la coleccion
    return collectionData(itemColection) as Observable<tipo[]>;//observable: pendiente de los cambios, segun el <tipo> de variable
  }

  //CREATE EN GENERAL
  crearDocumentoGeneral(data: any, enlace: string){
    const documento = doc(this.firestore, enlace);
    return setDoc(documento,data);
  }

  //CREATE BY ID. CREAR DOCUMENTO CON UN ID PREDISEÑADO
  async crearDocumentoGeneralPorID(data: any, enlace: string, idDoc: string){
    const documento = doc(this.firestore, `${enlace}/${idDoc}`);
    return await setDoc(documento,data);//setDoc, es el encargado de ordenar la creacion del documento en Firestore
  }

  //UPDATE DOCUMENTO. ACTUALIZAR DOCUMENTO COMPLETO TENIENDO UN ID DE REFERENCIA
  async actualizarDocumentoPorID(data:any, enlace:string, idDoc:number){
    const documento = doc(this.firestore, `${enlace}/${idDoc}`);
    return updateDoc(documento,data);
  }

  //UPDATE CAMPO DE DOCUMENTO. ACTUALIZA UN CAMPO EN ESPECIFICO DE UN DOCUMENTO ESPECIFICO POR ID
  actualizarCampoDocumento(coleccion:string, idDocumento:string, campo:string, nuevovalor:any):Observable<void>{
    const referenciaColeccion = doc(this.firestore,`${coleccion}/${idDocumento}`);
    return new Observable<void>((observable)=>{
      updateDoc(referenciaColeccion,{
        [campo]:nuevovalor
      }).then(()=>{
        console.log("docID",referenciaColeccion)
        console.log("Campo actualizado, nuevo valor: ", nuevovalor);
        observable.next();
        observable.complete();
      }).catch(e=>{
        console.log("Erro al actualizar campo: ", e);
        observable.error();
      })
    });
  }
  //DELETE
  eliminarDocPorID( enlace:string, idDoc:string){
    const documento = doc(this.firestore, `${enlace}/${idDoc}`);
    return deleteDoc(documento);
  }

  //OBTENER NUMERO TOTAL DE DATOS REGITRADO-CONTEO. DEFINITIVO
  async contarNumeroDocumentosTotal(path:string){
    const consulta=collection(this.firestore,path);//REFERENCIA DE LA COLECCION
    const snapshot= await getCountFromServer(consulta);
    let totalCuenta=snapshot.data().count;
    return totalCuenta;
  }


  // ************************************************************* CONSULTAS COMPUESTAS ************************************************************************
  // ***********************************************************************************************************************************************************

  // ************************************************************* USUARIOS
  //CONSULTA COMPUESTA. TRAER USUARIOS CON ROL DE OPERADORES
  getUsuariosSegunRol<tipoModeloObjeto>(rol:  string): Observable<tipoModeloObjeto[]>{
    const coleccionBuscar = collection(this.firestore, "Usuarios");
    const consulta = query(coleccionBuscar, where("idRol", "==", rol));
    return new Observable<tipoModeloObjeto[]>((observador)=>{
      const unsubscribe = onSnapshot(consulta,( querySnapshot)=>{
        const documentosPorRol: tipoModeloObjeto[] = [];
        querySnapshot.forEach((doc)=>{
          documentosPorRol.push(doc.data() as tipoModeloObjeto);
        });
        observador.next(documentosPorRol);
      });
      return unsubscribe;
    });
  }

  //CONSULTA COMPUESTA. TRAER USUARIO POR CORREO
  getUsuarioPorCorreoEnLogin<tipoModeloUs>(correoLogin:string):Observable<tipoModeloUs>{
    const coleccionBuscar = collection(this.firestore, "Usuarios");
    const consulta = query(coleccionBuscar, where("correoUsuario", "==", correoLogin));
    return new Observable<tipoModeloUs>((observador)=>{
      const unsubscribe = onSnapshot(consulta,(querySnapshot)=>{
        if(!querySnapshot.empty){
          const docCorreo = querySnapshot.docs[0];
          const resultadoDocumentoCorreo = docCorreo.data() as tipoModeloUs;
          observador.next(resultadoDocumentoCorreo);
          observador.complete();
        }
        else {
          observador.next(null);
          observador.complete();
        }
      });
      return unsubscribe;
    });
  }

  //CONSULTA COMPUESTA. TRAER OPERARIOS PARA ASIGNACIONES
  //ARREGLO DE OPERADORES
  async getUsuariosOperariosParaAsignaciones():Promise<UsuarioI[]>{
    const coleccionUsuarios = collection(this.firestore, 'Usuarios');
    const consulta = query(coleccionUsuarios, where('idRol', '==', OPERADOR));
    const querySnapshot = await getDocs(consulta);
    const operadores:UsuarioI[]=[];
    querySnapshot.forEach((doc)=>{
      operadores.push(doc.data() as UsuarioI);
    });
    return operadores;
  }

  // ************************************************************* REPORTES

  //CONSULTA COMPUESTA. TRAE LOS REPORTES ASIGNADOS AL OPERADOR PRESENTE/LOGEUADO
  getReportesAsignadosAlOperador(idUsuarioOperadorPresente:string): Observable<ReportesI[]> {
    const coll =  collection(this.firestore, "Reportes");
    const q = query(coll, where("idOperador", "==", idUsuarioOperadorPresente));
    return new Observable<ReportesI[]>((observer) => {
      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const documentosReportes: ReportesI[] = [];
        querySnapshot.forEach((doc)=>{
          documentosReportes.push(doc.data() as ReportesI);
        });
        observer.next(documentosReportes);
      });
      return unsubscribe;
    });
  }

  //CONSULTA COMPUESTA. TRAER FOTOS, SEGUN ID DEL REPORTE
  //TRAE LAS FOTOS PERTENECIENTES AL REPORTE SELECCIONADO.
  getFotosSegunReporteObservable(idReportePresente: string): Observable<FotoI[]>{
    const coleccionNecesaria = collection(this.firestore, "Fotos");
    const consulta = query(coleccionNecesaria, where("idReporte", "==", idReportePresente));
    return new Observable<FotoI[]>((observer)=>{
      const unsubscribe = onSnapshot(consulta, (querySnapshot)=>{
        const documentoFotos: FotoI[]=[];
        querySnapshot.forEach((doc)=>{
          documentoFotos.push(doc.data() as FotoI);
        });
        observer.next(documentoFotos);
      });
      return unsubscribe;
    });
  }

  //CONSULTA COMPUESTA. TRAER REPORTES SEGUN ID DE USUARIO
  //TRAE LOS REPORTES REALIZADOS POR EL USUARIO QUE INICIÓ SESION
  //ES PARA TRAER REPORTES REALIZADOS POR EL USUARIO LOGUEADO
  getReportesParaUsuariosObservable(idUsuarioPresente:string): Observable<ReportesI[]> {
    const coll =  collection(this.firestore, "Reportes");
    const q = query(coll, where("idUsuario", "==", idUsuarioPresente));
    return new Observable<ReportesI[]>((observer) => {
      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const documentosReportes: ReportesI[]=[];
        querySnapshot.forEach((doc)=>{
          documentosReportes.push(doc.data() as ReportesI);
        });
        observer.next(documentosReportes);
      });
      return unsubscribe;
    });
  }

  //CONSULTA COMPUESTA. TRAE LOS REPORTES SEGUN SU ESTADO
  getReportesSegunEstado(estado:string, idOperario:string):Observable<ReportesI[]>{
    const colleccion = collection(this.firestore, "Reportes");
    const consulta = query(colleccion, where("estado", "==", estado), where("idOperador", "==",idOperario ));
    return new Observable<ReportesI[]>((observador)=>{
      const unsubscribe=onSnapshot(consulta,(querySnapShot)=>{
        const documentoSegunEstado: ReportesI[]=[];
        querySnapShot.forEach((documento)=>{
          documentoSegunEstado.push(documento.data() as ReportesI);
        });
        observador.next(documentoSegunEstado);
      });
      return unsubscribe;
    });
  }

  //CONSULTA COMPUESTA. TRAE LOS REPORTES SEGUN SU ESTADO PARA EL USUARIO CONSUMIDOR
  getReportesSegunEstadoUsuarioConsumidor(estado:string, idOperario:string):Observable<ReportesI[]>{
    const colleccion = collection(this.firestore, "Reportes");
    const consulta = query(colleccion, where("estado", "==", estado), where("idUsuario", "==",idOperario ));
    return new Observable<ReportesI[]>((observador)=>{
      const unsubscribe=onSnapshot(consulta,(querySnapShot)=>{
        const documentoSegunEstado: ReportesI[]=[];
        querySnapShot.forEach((documento)=>{
          documentoSegunEstado.push(documento.data() as ReportesI);
        });
        observador.next(documentoSegunEstado);
      });
      return unsubscribe;
    });
  }










}
