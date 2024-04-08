import { Injectable } from '@angular/core';
import { Empresa } from 'src/app/interface/empresa.interface';

@Injectable({
  providedIn: 'root'
})
export class EmpresaService {

  empresas: Empresa[]=[
    {
      idEmpresa: 1,
      nombreEmpresa: 'Acueducto Queremal',
      nitEmpresa: '111222333',
      direccionEmpresa: 'Parque central',
      telefonoEmpresa: '5555555',
      celularEmpresa: '3333333333',
      correoEmpresa: 'acueducto@corre.com',
      clave: 'segura',
      idRol: 2,
      esActivo: false,
      fechaRegistro: ''
    },
  ]
  constructor() { }

  //SE RETORNA LA EMPRESA QUE TENGA EL ID POR PARAMETRO
  getEmpresaPorID(idEmpresa: number){
    return this.empresas[idEmpresa]
  }

  //SE RETORNA TODAS LAS EMPRESAS GUARDADAS LOCALMENTE
  getEmpresas(){
    return this.empresas;
  }


}
