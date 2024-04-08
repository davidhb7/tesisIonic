import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CrearReporteRoutingModule } from './crear-reporte-routing.module';
import { CrearReporteComponent } from './crear-reporte.component';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';


@NgModule({
  declarations: [
    CrearReporteComponent
  ],
  imports: [
    CommonModule,
    CrearReporteRoutingModule,
    IonicModule,
    FormsModule
  ]
})
export class CrearReportePageModule { }
