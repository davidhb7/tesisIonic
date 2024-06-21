import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FormularioOperadorRoutingModule } from './formulario-operador-routing.module';
import { FormularioOperadorComponent } from './formulario-operador.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';


@NgModule({
  declarations: [
    FormularioOperadorComponent
  ],
  imports: [
    CommonModule,
    FormularioOperadorRoutingModule,
    FormsModule,
    IonicModule,
    ReactiveFormsModule
  ]
})
export class FormularioOperadorModule { }
