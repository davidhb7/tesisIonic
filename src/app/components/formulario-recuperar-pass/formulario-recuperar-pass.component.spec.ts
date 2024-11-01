import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { FormularioRecuperarPassComponent } from './formulario-recuperar-pass.component';

describe('FormularioRecuperarPassComponent', () => {
  let component: FormularioRecuperarPassComponent;
  let fixture: ComponentFixture<FormularioRecuperarPassComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ FormularioRecuperarPassComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(FormularioRecuperarPassComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
