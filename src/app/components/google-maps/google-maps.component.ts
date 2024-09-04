import { Component, Input } from '@angular/core';
import { InteractionService } from 'src/app/common/services/interaction.service';
import { Geolocation } from '@capacitor/geolocation';

declare var google: any;

@Component({
  selector: 'app-google-maps',
  templateUrl: './google-maps.component.html',
  styleUrls: ['./google-maps.component.scss'],
})
export class GoogleMapsComponent {

  @Input() coordinates: { lat: number; lng: number };

  map: any;
  directionsService = new google.maps.DirectionsService();
  directionsRenderer = new google.maps.DirectionsRenderer();
  userMarker: any;

  constructor(
    private serviciosInteraccion: InteractionService,
  ) { }

  ngAfterViewInit() {
    this.initMap();
    this.trackLocation();

  }


  async initMap() {
    const mapRef = document.getElementById('map');

    this.map = await new google.maps.Map(mapRef, {
      center: { lat: 3.523303, lng: -76.712034 },
      zoom: 14,
    });

    this.directionsRenderer.setMap(this.map);
  }

  async trackLocation() {
    // Obtener la ubicación inicial del usuario
    const position = await Geolocation.getCurrentPosition();
    const userLocation = {
      lat: position.coords.latitude,
      lng: position.coords.longitude,
    };

    // Agregar un marcador en la ubicación actual del usuario
    this.userMarker = new google.maps.Marker({
      position: userLocation,
      map: this.map,
      title: "Mi ubicación",
    });

    // Centrar el mapa en la ubicación actual del usuario
    this.map.setCenter(userLocation);

    // Calcular y mostrar la ruta desde la ubicación actual del usuario
    this.calculateAndDisplayRoute(userLocation);

    // Seguir actualizando la ubicación del usuario en tiempo real
    Geolocation.watchPosition({}, (position, err) => {
      if (position) {
        const updatedLocation = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };
        this.updateUserLocation(updatedLocation);
      }
    });
  }

  updateUserLocation(newLocation: { lat: number; lng: number }) {
    if (this.userMarker) {
      this.userMarker.setPosition(newLocation);
    }
    this.map.setCenter(newLocation);
    this.calculateAndDisplayRoute(newLocation);
  }

  calculateAndDisplayRoute(start: { lat: number; lng: number }) {
    if(this.coordinates){
      const end = { lat: this.coordinates.lat, lng: this.coordinates.lng };

    this.directionsService.route(
      {
        origin: start,
        destination: end,
        travelMode: google.maps.TravelMode.DRIVING,
        optimizeWaypoints: true,
      },
      (response: any, status: string) => {
        if (status === 'OK') {
          this.directionsRenderer.setDirections(response);
        } else {
          window.alert('La solicitud de direcciones falló debido a ' + status);
        }
      }
    );
    }
    // this.serviciosInteraccion.cargandoConMensaje("Cargando ruta").then(()=>{
    //   this.serviciosInteraccion.cerrarCargando();
    // });

  }

}
