import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { IonicModule } from "@ionic/angular";
import { ComponentModule } from "src/app/components/component.module";


import { LoginRoutingModule } from "./login-routing.module";
import { LoginComponent } from "./login.component";



@NgModule({
  declarations: [
    LoginComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    //ComponentModule,
    LoginRoutingModule

  ]
})
export class LoginPageModule { }
