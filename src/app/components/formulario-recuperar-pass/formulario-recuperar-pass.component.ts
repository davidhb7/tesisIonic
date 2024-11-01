import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthServices } from '../../common/services/auth.service';
import { InteractionService } from 'src/app/common/services/interaction.service';

@Component({
  selector: 'app-formulario-recuperar-pass',
  templateUrl: './formulario-recuperar-pass.component.html',
  styleUrls: ['./formulario-recuperar-pass.component.scss'],
})
export class FormularioRecuperarPassComponent  implements OnInit {

  //OBJETOS-CLASES
  formGroupPass: FormGroup;

  //VARIABLES
  correoUsuario:string="";


  constructor(
    private formBuilderPass: FormBuilder,
    private serviciosAuth: AuthServices,
    private serviciosInteracion: InteractionService,

  ) {
    this.inicializar();
  }

  ngOnInit() {
    return;
  }

  inicializar(){
    this.formGroupPass = this.formBuilderPass.group({
      correoUsuario: ['', [Validators.required, Validators.email]],
    })
  }


  enviarRestarPass(){
    const correo = this.formGroupPass.get('correoUsuario')?.value;
    if(this.correoUsuario!="" || this.correoUsuario!=null || this.correoUsuario!=undefined ){
      this.serviciosAuth.recuperarPass(correo).then(()=>{
        this.serviciosInteracion.mensajeGeneral("Link enviado a tu correo.");
      }).catch(()=>{
        this.serviciosInteracion.mensajeGeneral("Error al enviar.");
      });
    }
  }



}
