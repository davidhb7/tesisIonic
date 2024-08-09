import { Component, AfterViewInit } from '@angular/core';
declare var google: any;

@Component({
  selector: 'app-google-maps',
  templateUrl: './google-maps.component.html',
  styleUrls: ['./google-maps.component.scss'],
})
export class GoogleMapsComponent implements AfterViewInit {
  map: any;
  directionsService = new google.maps.DirectionsService();
  directionsRenderer = new google.maps.DirectionsRenderer();

  constructor() {}

  ngAfterViewInit() {
    this.initMap();
  }

  initMap() {
    const mapRef = document.getElementById('map');

    this.map = new google.maps.Map(mapRef, {
      center: { lat: 3.523303, lng: -76.712034 },
      zoom: 14,
    });

    this.directionsRenderer.setMap(this.map);

    // Añadir marcadores
    const marker1 = new google.maps.Marker({
      position: { lat: 3.523303, lng: -76.712034 },
      map: this.map,
    });

    const marker2 = new google.maps.Marker({
      position: { lat: 3.524479, lng: -76.712030 },
      map: this.map,
    });

    // Crear una ruta entre los dos marcadores
    this.calculateAndDisplayRoute();
  }

  calculateAndDisplayRoute() {
    const start = { lat: 3.523303, lng: -76.712034 };
    const end = { lat: 3.524479, lng: -76.712030 };

    this.directionsService.route(
      {
        origin: start,
        destination: end,
        travelMode: google.maps.TravelMode.DRIVING,
      },
      (response: any, status: string) => {
        if (status === 'OK') {
          this.directionsRenderer.setDirections(response);
        } else {
          window.alert('Directions request failed due to ' + status);
        }
      }
    );
  }
}
