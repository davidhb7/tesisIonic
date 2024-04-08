import { Injectable } from '@angular/core';
import { OperadorI } from 'src/app/commonFS/models-interfaceFS/operador.interface';

@Injectable({
  providedIn: 'root'
})
export class OperadorService {
  operadores: OperadorI[]=[
    {
      idOperador: 1,
      nombreOperador: 'Tulio Perez',
      correoOperador: 'tperez@correo.com',
      celularOperador: '33333333333',
      disponible: true,
      clave: 'segura',
      idRol: 3,
      esActivo: true,
      fechaRegistro: '2024-02-29'
    }

  ]

  constructor() { }

  //RETORNAR OPERADOR POR ID
  getOperadorPorId(idOperador: number){
    return this.operadores[idOperador];
  }

  //RETORNAR TODOS LOS OPERADORES REGISTRADOS
  getOperadores(){
    return this.operadores;
  }

}
