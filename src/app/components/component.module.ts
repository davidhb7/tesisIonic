import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';

import { EmpresaComponent } from './empresa/empresa.component';
import { EmpresasComponent } from './empresas/empresas.component';
import { OperarioComponent } from './operador/operador.component';
import { OperariosComponent } from './operadores/operadores.component';
import { UsuarioComponent } from './usuario/usuario.component';
import { UsuariosComponent } from './usuarios/usuarios.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { GoogleMapsComponent } from './google-maps/google-maps.component';
import { FormularioUsuarioComponent } from './formulario-usuario/formulario-usuario.component';
import { AsignacionesOperadorComponent } from './asignaciones-operador/asignaciones-operador.component';




@NgModule({
  declarations: [
    //EMPRESA
    EmpresaComponent,
    EmpresasComponent,
    //OPERADOR
    OperarioComponent,
    OperariosComponent,
    //USUARIO
    UsuarioComponent,
    UsuariosComponent,
    //FORMULARIO-USUARIO
    FormularioUsuarioComponent,
    //MAPA
    GoogleMapsComponent,
    //ASIGNACIONES
    AsignacionesOperadorComponent
  ],

  exports:[
    //EMPRESA
    EmpresaComponent,
    EmpresasComponent,
    //OPERADOR
    OperarioComponent,
    OperariosComponent,
    //USUARIO
    UsuarioComponent,
    UsuariosComponent,
    //FORMULARIO COMPONENT
    FormularioUsuarioComponent,
    //MAPA
    GoogleMapsComponent,
    //ASIGNACIONES
    AsignacionesOperadorComponent




  ],

  imports: [
    CommonModule,
    IonicModule,
    FormsModule,
    ReactiveFormsModule,
    //MAPA
    //GoogleMapsComponent,

  ]

})
export class ComponentModule { }
