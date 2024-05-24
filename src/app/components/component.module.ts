import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';

import { EmpresaComponent } from './empresa/empresa.component';
import { EmpresasComponent } from './empresas/empresas.component';
import { OperadorComponent } from './operador/operador.component';
import { OperadoresComponent } from './operadores/operadores.component';
import { UsuarioComponent } from './usuario/usuario.component';
import { UsuariosComponent } from './usuarios/usuarios.component';
import { FormularioUsuarioComponent } from './formulario-usuario/formulario-usuario.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { GoogleMapsComponent } from './google-maps/google-maps.component';




@NgModule({
  declarations: [
    //EMPRESA
    EmpresaComponent,
    EmpresasComponent,
    //OPERADOR
    OperadorComponent,
    OperadoresComponent,
    //USUARIO
    UsuarioComponent,
    UsuariosComponent,
    //FORMULARIO-USUARIO
    FormularioUsuarioComponent,
    //MAPA
    GoogleMapsComponent,
  ],

  exports:[
    //EMPRESA
    EmpresaComponent,
    EmpresasComponent,
    //OPERADOR
    OperadorComponent,
    OperadoresComponent,
    //USUARIO
    UsuarioComponent,
    UsuariosComponent,
    //FORMULARIO COMPONENT
    FormularioUsuarioComponent,
    //MAPA
    GoogleMapsComponent,




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
