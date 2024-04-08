import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MenuRoutingModule } from './menu-routing.module';
import { IonicModule } from '@ionic/angular';
import { MenuComponent } from './menu.component';
import { FormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    MenuComponent
  ],
  imports: [
    CommonModule,
    MenuRoutingModule,
    IonicModule,
    FormsModule,
  ]
})
export class MenuPageModule { }
