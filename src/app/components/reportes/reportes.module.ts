import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ReportesRoutingModule } from './reportes-routing.module';
import { IonContent, IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { ReportesComponent } from './reportes.component';
import { CrearReporteComponent } from '../crear-reporte/crear-reporte.component';


@NgModule({
  declarations: [
    ReportesComponent
  ],
  imports: [
    CommonModule,
    ReportesRoutingModule,
    IonicModule,
    FormsModule,
  ]
})
export class ReportesPageModule { }
