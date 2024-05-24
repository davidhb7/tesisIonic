import { DOCUMENT } from '@angular/common';
import { Component, Inject, OnInit, Renderer2 } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { GoogleMapsService } from 'src/app/common/services/google-maps.service';

@Component({
  selector: 'app-google-maps',
  templateUrl: './google-maps.component.html',
  styleUrls: ['./google-maps.component.scss'],
})
export class GoogleMapsComponent  implements OnInit {


  document:any;
  constructor(
    private renderer2: Renderer2,
    private servicioGoogleMaps: GoogleMapsService,
    //@Inject(DOCUMENT) private document,
    private modalController: ModalController

  ) {

  }

  ngOnInit() {
    this.init();

  }
  async init(){
    this.servicioGoogleMaps.init(this.renderer2, this.document).then(()=>{
      this.initMap();
    });
  }



  tomarPunto(){
    this.servicioGoogleMaps.tomarMiUbicacion();
  }



  aceptado(){
    console.log("aceptado")
  }


  initMap(){

  }




}
