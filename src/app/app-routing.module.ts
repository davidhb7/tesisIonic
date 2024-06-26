import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { MenuComponent } from './pages/menu/menu.component';
import { LoginComponent } from './pages/login/login.component';
import { UsuarioComponent } from './components/usuario/usuario.component';
import { UsuariosComponent } from './components/usuarios/usuarios.component';
import { FormularioUsuarioComponent } from './components/formulario-usuario/formulario-usuario.component';
import { RegistroComponent } from './pages/registro/registro.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path:'login',
    loadChildren:() => import('./pages/login/login.module').then(m=>m.LoginPageModule)
  },
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then( m => m.HomePageModule)
  },
  {
    path:'menu',
    loadChildren: () => import('./pages/menu/menu.module').then( m => m.MenuPageModule)
  },
  {
    path:'reportes',
    loadChildren: () => import('./components/reportes/reportes.module').then( m => m.ReportesPageModule)
  },
  {
    path:'reportes/:idUsuario',
    loadChildren: () => import('./components/reportes/reportes.module').then( m => m.ReportesPageModule)
  },
  {
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
    path:'usuarios',
    component: UsuariosComponent
  },
  {
    path:'usuario/:idUsuario',
    component: UsuarioComponent
  },
  // {
  //   path:'usuario',
  //   component: UsuarioComponent
  // },
  {
    path:'formulario-usuario',
    component: FormularioUsuarioComponent
  },
  {
    path:'formulario-registro',
    loadChildren: ()=> import('./pages/registro/registro.module').then(m=> m.RegistroModule)
  }


];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
