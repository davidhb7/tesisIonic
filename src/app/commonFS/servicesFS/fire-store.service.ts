import { Injectable, inject } from '@angular/core';
import { Firestore, collectionData, deleteDoc, doc, getDoc, getDocFromServer, getDocs, getDocsFromServer, onSnapshot, setDoc, updateDoc } from '@angular/fire/firestore';
import { DocumentReference, collection, getCountFromServer, query, where } from 'firebase/firestore';

import { Observable } from 'rxjs';
//import { v4 as uuidv4 } from 'uuid';

//DECLARACION UNICA DE ID PARA FIRESTORE
import { v4 as uuidv4 } from 'uuid';
import { ReportesI } from '../models-interfaceFS/reportes.interface';

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
  //TRAER Y OBTENER LOS CAMBIOS DE LA COLECCION.
  //LEE CUALQUEIR COLECCION. ESTA PENDIENTE DE LOS CAMBIOS
  getCambiosYListar<tipo>(path: string){//tipo: es el campo o variable a leer. Argumento. Path es la ruta a la BDD de firestore
    const itemColection = collection(this.firestore, path);//path: es la ruta de la coleccion
    return collectionData(itemColection) as Observable<tipo[]>;//observable: pendiente de los cambios, segun el <tipo> de variable
  }

  //CREATE
  crearDocumentoGeneral(data: any, enlace: string){
    const documento = doc(this.firestore, enlace);
    return setDoc(documento,data);
  }

  //CREATEBYID
  async crearDocumentoGeneralPorID(data: any, enlace: string, idDoc: string){
    const documento = doc(this.firestore, `${enlace}/${idDoc}`);
    return await setDoc(documento,data);//setDoc, es el encargado de ordenar la creacion del documento en Firestore
  }

  //UPDATE
  async actualizarDocumentoPorID(data:any, enlace:string, idDoc:number){
    const documento = doc(this.firestore, `${enlace}/${idDoc}`);
    return updateDoc(documento,data);
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

  //CONSULTA COMPUESTA DE REPORTES SEGUN ID DE USUARIO
  //TRAE LOS REPORTES REALIZADOS POR EL USUARIO QUE INICIÓ SESION
  getReportesParaUsuariosObservable(idUsuarioPresente:any): Observable<ReportesI[]> {
    const coll =  collection(this.firestore, "Reportes");
    const q = query(coll, where("idUsuario", "==", idUsuarioPresente));
    return new Observable<ReportesI[]>((observer) => {
      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const documentos: ReportesI[] = [];
        querySnapshot.forEach((doc) => {
          documentos.push(doc.data() as ReportesI);
        });
        observer.next(documentos);
      });
      return unsubscribe;
    });
  }


  //TODO
  //CREAR UN SERVICIO DONDE SE CONSULTEN TODOS LOS REPORTES CUANDO EL USUARIO ES EMPRESA





}
