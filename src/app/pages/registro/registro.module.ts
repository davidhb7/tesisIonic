import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RegistroRoutingModule } from './registro-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { RegistroComponent } from './registro.component';


@NgModule({
  declarations: [
    RegistroComponent
  ],


  imports: [
    RegistroRoutingModule,
    CommonModule,
    FormsModule,
    IonicModule,
    ReactiveFormsModule
  ]
})
export class RegistroModule { }
