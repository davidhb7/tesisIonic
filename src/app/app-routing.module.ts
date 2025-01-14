import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { UsuarioComponent } from './components/usuario/usuario.component';
import { UsuariosComponent } from './components/usuarios/usuarios.component';
import { FormularioUsuarioComponent } from './components/formulario-usuario/formulario-usuario.component';
import { OperariosComponent } from './components/operadores/operadores.component';
import { OperarioComponent } from './components/operador/operador.component';
import { AsignacionesOperadorComponent } from './components/asignaciones-operador/asignaciones-operador.component';
import { StaticsComponent } from './components/statics/statics.component';
import { InformacionEmpresaComponent } from './components/informacion-empresa/informacion-empresa.component';
import { RepetidorReportesComponent } from './components/repetidor-reportes/repetidor-reportes.component';
import { FormularioRecuperarPassComponent } from './components/formulario-recuperar-pass/formulario-recuperar-pass.component';
import { CambiarPassComponent } from './components/cambiar-pass/cambiar-pass.component';

const routes: Routes = [
  //CUANDO EL COMPONENTE TIENE MODULE INDIVIDUAL, USAR LOADCHILDREN
  //CUANDO NO TIENE MODULE, SOLO USAR COMPONENT. DECLARAR Y EXPORTAR EN MODULE COMUNITARIO



  //PARA INICIAR SESION
  {
    path:'login',
    loadChildren:() => import('./pages/login/login.module').then(m=>m.LoginPageModule)
  },
  {
    path:'menu',
    loadChildren: () => import('./pages/menu/menu.module').then( m => m.MenuPageModule)
  },

  {
    //VER REPORTE GENERALES
    path:'reportes',
    loadChildren: () => import('./components/reportes/reportes.module').then( m => m.ReportesPageModule)
  },

  {
    //PARA VER LOS REPORTES REALIZADOS POR EL USUARIO
    path:'reportes/:idUsuario',
    loadChildren: () => import('./components/reportes/reportes.module').then( m => m.ReportesPageModule)
  },

  {
    //VER UN REPORTE EN CONCRETO POR ID
    path:'reporte/:idReporte',
    loadChildren: () => import('./components/reporte/reporte.module').then( m => m.ReportePageModule)
  },

  {
    //SE UTILIZA PARA CREAR
    path:'crear-reporte',
    loadChildren: () => import('./components/crear-reporte/crear-reporte.module').then( m => m.CrearReportePageModule)
  },

  {
    //SE UTILIZA PARA EDITAR
    path:'crear-reporte/:idReporte',
    loadChildren: () => import('./components/crear-reporte/crear-reporte.module').then( m => m.CrearReportePageModule)
  },

  {
    //VER TODOS LOS USUARIOS REGISTRADOS
    path:'usuarios',
    component: UsuariosComponent
  },

  //PARA VER EL PERFIL DEL LOGEADO
  {
    path:'usuario/:idUsuario',
    component: UsuarioComponent
  },

  {
    //VER LOS OPERARIOS PERTENECIENTES A LA EMPRESA
    path:'operarios',
    component: OperariosComponent
  },

  //PARA VER OPERARIO POR ID
  {
    path:'operario/:idOperador',
    component: OperarioComponent
  },

  //PARA CREAR USUARIOS DESDE LA INTERFAZ DE LA EMPRESA
  {
    path:'formulario-usuario',
    component: FormularioUsuarioComponent
  },

  //PARA CREAR EL USUARIO GENERAL
  {
    path:'formulario-registro',
    loadChildren: ()=> import('./pages/registro/registro.module').then(m=> m.RegistroModule)
  },

  //PARA EDITAR EL USUARIO CON ID
  {
    path:'formulario-registro/:idUsuario',
    loadChildren: ()=> import('./pages/registro/registro.module').then(m=> m.RegistroModule)
  },

  //PARA CREAR OPERADOR DESDE INTERFAZ DE EMPRESA
  {
    path: 'formulario-operador',
    loadChildren: ()=> import('./components/formulario-operador/formulario-operador.module').then(m=>m.FormularioOperadorModule)
  },
  {
    path: 'formulario-operador/:idUsuario',
    loadChildren: ()=> import('./components/formulario-operador/formulario-operador.module').then(m=>m.FormularioOperadorModule)
  },
  //RUTA PARA QUE EL OPERADOR VEA SUS REPORTES ASIGNADOS
  {
    path:'asignaciones-operador',
    component: AsignacionesOperadorComponent
  },
  //RUTA PARA VER ESTADISTICAS DE LOS OPERARIOS
  {
    path:'estadisticas',
    component: StaticsComponent
  },
  //QUIENES SOMOS - INFORMACION DE EMPRESA
  {
    path:'infor-empresa',
    component:InformacionEmpresaComponent
  },
  //CREAR REPORTES EN MASA
  {
    path:'repetidor',
    component:RepetidorReportesComponent
  },
  {
    path:'recuperar-pass',
    component:FormularioRecuperarPassComponent
  },
  {
    path:'cambiar-pass',
    component:CambiarPassComponent
  },
  //VACIO Y POR DEFECTO A LOGIN
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },


];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
