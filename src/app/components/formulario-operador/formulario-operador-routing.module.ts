import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FormularioOperadorComponent } from './formulario-operador.component';

const routes: Routes = [
  {
    path:'',
    component:FormularioOperadorComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FormularioOperadorRoutingModule { }
