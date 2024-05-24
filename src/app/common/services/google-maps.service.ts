import { ElementRef, Injectable, Input, ViewChild } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class GoogleMapsService {


  apikey= environment.ak;
  mapasCargado=false;

  @Input() parametro={
    //3.523244, -76.711980
    latitud:"3.523244",
    longitud: "-76.711980"
  };

  mapa:any;
  marca:any;
  infoVentana:any;
  posicionPuesta:any;


  //MUESTRA EL MAPA
  @ViewChild('map') divMap: ElementRef;



  constructor() {
    this.tomarMiUbicacion()
  }




  tomarMiUbicacion(){
    console.log("San Jose del Salado")
  }




  init(renderer:any, document:any): Promise<any>{
    return new Promise((resolve)=>{
      if(this.mapasCargado){
        console.log("Mapa cargado");
        resolve(true);
        return;
      }
      const script = renderer.crearElemento('script');
      script.id= 'googleMaps';

      // window[]=()=>{
      //   return;
      // }

      if(this.apikey){
        script.src='https://maps.googleapis.com/maps/api/js?key='+this.apikey+'&callback=mapInit';
        script.src=""
      }
      else{

      }

    });


  }




}
