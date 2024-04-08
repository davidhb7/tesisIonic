import { Injectable } from '@angular/core';
import { UsuarioI } from 'src/app/commonFS/models-interfaceFS/usuarios.interface';

@Injectable({
  providedIn: 'root'
})
export class UsuariosService {

  usuarios:UsuarioI[]=[
    {
      idUsuario: 1,
      numeroReferenciaUsuario: '1234567890',
      nombreUsuario: 'David Herrera Bermudez',
      correoUsuario: 'herrera@correo.com',
      celularUsuario: '3333333333',
      direccionUsuario: 'Cori San Jose',
      telefonoUsuario: '',
      clave: 'segura',
      idRol: 4,
      esActivo: true,
      fechaRegistro: ''
    },
    {
      idUsuario: 2,
      numeroReferenciaUsuario: '0987456321',
      nombreUsuario: 'Constanza Bermudez Arroyo',
      correoUsuario: 'bermudez@correo.com',
      celularUsuario: '3333333333',
      direccionUsuario: 'Cori San Jose',
      telefonoUsuario: '',
      clave: 'segura',
      idRol: 4,
      esActivo: true,
      fechaRegistro: ''
    },
    {
      idUsuario: 3,
      numeroReferenciaUsuario: '0987654321',
      nombreUsuario: 'Ricaurte Rodriguez',
      correoUsuario: 'rodriguez@correo.com',
      celularUsuario: '3333333333',
      direccionUsuario: 'Cori San Jose',
      telefonoUsuario: '',
      clave: 'segura',
      idRol: 4,
      esActivo: true,
      fechaRegistro: ''
    }

  ]
  constructor() { }


  //RETORNA EL USUARIO POR ID
  getUsuarioPorId(idUsuario:number){
    return this.usuarios[idUsuario];
  }

  //RETORNA TODOS LOS USUARIOS REGISTRADOS EN EL SECTOR
  getUsuariosRegistrados(){
    return this.usuarios;
  }


}
