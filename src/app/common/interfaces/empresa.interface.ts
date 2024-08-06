export interface EmpresaI {
  idUsuario: string,
  identificacionUsuario: string,
  numeroReferenciaUsuarioConsumidor: number,
  nombreUsuario: string,
  correoUsuario: string,
  celularUsuario: string,
  direccionUsuario: string,
  telefonoUsuario: string,
  clave: string,
  idRol: string,
  disponibleOperario:boolean,
  esActivo: boolean,
  asignacionesActivas: number,
  fechaRegistro: string
};