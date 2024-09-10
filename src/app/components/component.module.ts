import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';

import { EmpresaComponent } from './empresa/empresa.component';
import { EmpresasComponent } from './empresas/empresas.component';
import { OperarioComponent } from './operador/operador.component';
import { OperariosComponent } from './operadores/operadores.component';
import { UsuarioComponent } from './usuario/usuario.component';
import { UsuariosComponent } from './usuarios/usuarios.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FormularioUsuarioComponent } from './formulario-usuario/formulario-usuario.component';
import { AsignacionesOperadorComponent } from './asignaciones-operador/asignaciones-operador.component';
import { GoogleMapsComponent } from './google-maps/google-maps.component';
import { StaticsComponent } from './statics/statics.component';
import { NgApexchartsModule } from "ng-apexcharts";
import { HeatmapComponent } from './heatmap/heatmap.component';
import { InformacionEmpresaComponent } from './informacion-empresa/informacion-empresa.component';




@NgModule({
  schemas:[
    CUSTOM_ELEMENTS_SCHEMA
  ],
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
    //ASIGNACIONES
    AsignacionesOperadorComponent,
    //GOOGLE MAPS
    GoogleMapsComponent,
    //ESTADISTICAS
    StaticsComponent,
    //MAPA DE CALOR
    HeatmapComponent,
    //INFO EMPRESA
    InformacionEmpresaComponent
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
    //ASIGNACIONES
    AsignacionesOperadorComponent,
    //GOOGLE MAPS
    GoogleMapsComponent,
    //ESTADISTICAS
    StaticsComponent,
    //GRAFICOS
    NgApexchartsModule,
    //MAPA DE CALOR
    HeatmapComponent,
    //INFO EMPRESA
    InformacionEmpresaComponent



  ],

  imports: [
    CommonModule,
    IonicModule,
    FormsModule,
    ReactiveFormsModule,
    //GRAFICOS
    NgApexchartsModule

  ]

})
export class ComponentModule { }
