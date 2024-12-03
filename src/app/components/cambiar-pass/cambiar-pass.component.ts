import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthServices } from 'src/app/common/services/auth.service';
import { InteractionService } from 'src/app/common/services/interaction.service';

@Component({
  selector: 'app-cambiar-pass',
  templateUrl: './cambiar-pass.component.html',
  styleUrls: ['./cambiar-pass.component.scss'],
})
export class CambiarPassComponent  implements OnInit {

  //OBJETOS-CLASES
  formGroupPass: FormGroup;

  //NUEVA PASS
  nuevaPass:string="";

  constructor(
    private formBuilderPass: FormBuilder,
    private serviciosAuth: AuthServices,
    private serviciosInteracion: InteractionService,
    private router: Router,
  ) {
    this.inicializar();
  }

  ngOnInit() {
    return;
  }

  inicializar(){
    this.formGroupPass = this.formBuilderPass.group({
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required]
    },  { validator: this.coincidenciaPass })
  }

  //METODO QUE VALIDA LAS CONTRASEÑAS Y SU COINCIDENCIA
  coincidenciaPass(formGroup: FormGroup) {
    const password = formGroup.get('password')?.value;
    const confirmPassword = formGroup.get('confirmPassword')?.value;

    return password === confirmPassword ? null : { mismatch: true };
  }


  guardarCambios(){
    if(this.formGroupPass.valid){
      this.nuevaPass=this.formGroupPass.get('password')?.value;
      if(this.nuevaPass!=""){
        this.serviciosAuth.reIngresar(this.nuevaPass).then(()=>{
          this.serviciosAuth.cambiarPass(this.nuevaPass).then(()=>{
            this.serviciosInteracion.mensajeGeneral("Contraseña Actualizada");
          }).catch((error)=>{
            this.serviciosInteracion.mensajeGeneral("La Contraseña no se guardó");
            console.log(error);
          });
        })

      }
      console.log("Cambios guardados");
      this.router.navigate(['/menu'])
    }
  }

}
