import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CrearReporteComponent } from './crear-reporte.component';

const routes: Routes = [
  {
    path:'',
    component: CrearReporteComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CrearReporteRoutingModule { }
