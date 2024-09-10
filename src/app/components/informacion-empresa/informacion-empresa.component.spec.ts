import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { InformacionEmpresaComponent } from './informacion-empresa.component';

describe('InformacionEmpresaComponent', () => {
  let component: InformacionEmpresaComponent;
  let fixture: ComponentFixture<InformacionEmpresaComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ InformacionEmpresaComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(InformacionEmpresaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
