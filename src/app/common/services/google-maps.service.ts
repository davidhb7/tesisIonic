import { Injectable } from '@angular/core';

declare var google: any;

@Injectable({
  providedIn: 'root'
})


export class GoogleMapsService {

  private map: any;
  private directionsService = new google.maps.DirectionsService();
  private directionsRenderer = new google.maps.DirectionsRenderer();
  private currentPositionMarker: any;


  constructor() { }






}
