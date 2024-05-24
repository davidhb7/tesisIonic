import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CrearReporteRoutingModule } from './crear-reporte-routing.module';
import { CrearReporteComponent } from './crear-reporte.component';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { Camera, CameraResultType } from '@capacitor/camera';



@NgModule({
  declarations: [
    CrearReporteComponent
  ],
  imports: [
    CommonModule,
    CrearReporteRoutingModule,
    IonicModule,
    FormsModule,
  ],
  providers:[
    Geolocation,
    // Camera,
    // CameraResultType,

  ]
})
export class CrearReportePageModule { }
