import { Component, AfterViewInit } from '@angular/core';
import { ReportesI } from 'src/app/common/interfaces/reportes.interface';
import { FireStoreService } from 'src/app/common/services/fire-store.service';

import { MarkerClusterer } from '@googlemaps/markerclusterer';

declare var google: any;

@Component({
  selector: 'app-heatmap',
  templateUrl: './heatmap.component.html',
  styleUrls: ['./heatmap.component.scss'],
})
export class HeatmapComponent implements AfterViewInit {

  map: any;
  heatmap: any;
  markerCluster: any;

  localizaciones: {
    lat: number,
    lng: number,
    tipoAsuntoPorOperario: string,
    comentarioOperario: string }[] = [];

  marcadores:any[]=[];

  reportes: ReportesI[] = [];

  constructor(private serviciosFireStoreDatabase: FireStoreService) { }

  ngAfterViewInit() {
    this.inicializarMapa();
    this.getReportesGeneralesEmpresaOperario();

    // Listener para redibujar el mapa cuando la pantalla cambie de tamaño
    window.addEventListener('resize', () => {
      google.maps.event.trigger(this.map, 'resize');
    });
  }

  //INICIALIZAR MAPA
  async inicializarMapa() {
    const mapRef = document.getElementById('map');
    //CREA EL MAPA Y LE DA UNA UBICACION INICIAL
    this.map = new google.maps.Map(mapRef, {
      center: { lat: 3.522996, lng: -76.711889 },
      zoom: 15,
      scaleControl: true,
    });
    //DECLARA MAPA DE CALOR
    this.heatmap = new google.maps.visualization.HeatmapLayer({
      data: this.getPoints(),
      map: this.map,
    });

    // Agregar leyenda personalizada al mapa
    const legend = document.getElementById('heatmap-legend');
    this.map.controls[google.maps.ControlPosition.LEFT_BOTTOM].push(legend);
  }

  //OBTIENE LAS UBICACIONES DE LOS REPORTS
  getPoints() {
    return this.localizaciones.map(
      loc => new google.maps.LatLng(loc.lat, loc.lng));
  }

  //TRAE LOS REPORTES Y GUARA LAS UBICACIONES
  getReportesGeneralesEmpresaOperario() {
    this.serviciosFireStoreDatabase.getDocumentosGeneralAtentoCambios<ReportesI>("Reportes").subscribe(data => {
      if (data) {
        this.reportes = data;
        this.reportes.forEach(reporte => {
          if (reporte.ubicacion && reporte.tipoAsuntoPorOperario && reporte.comentarioOperario) {
            this.separadorUbicacion(reporte.ubicacion, reporte.tipoAsuntoPorOperario, reporte.comentarioOperario);
          }
        });
        this.updateHeatmap();
        this.addMarkers();
      }
    });
  }

  //SEPARA LAS UBICACIONES
  separadorUbicacion(coordenadas: string, tipoAsuntoPorOperario: string, comentarioOperario: string) {
    const [latStr, lngStr] = coordenadas.split(' ');
    const lat = parseFloat(latStr);
    const lng = parseFloat(lngStr);
    this.localizaciones.push({ lat, lng, tipoAsuntoPorOperario, comentarioOperario });
  }
  //CARGA EL MAPA DE CALOR Y LO MANTIENE ACTUALIZADO
  updateHeatmap() {
    const points = this.getPoints();
    this.heatmap.setData(points);
  }

  //AGREGAR MARCADORES SEGUN LAS COORDENADAS
  addMarkers() {
    this.localizaciones.forEach(loc => {
      const marker = new google.maps.Marker({
        position: { lat: loc.lat, lng: loc.lng },
        map: this.map,

      });

      // Verificar que tipoAsuntoPorOperario y comentarioOperario no estén vacíos o nulos
      const contentString = `
        <div style="color: black;">
          <strong>Tipo Asunto:</strong> ${loc.tipoAsuntoPorOperario || 'Sin datos disponibles'}<br>
          <strong>Comentario Operario:</strong> ${loc.comentarioOperario || 'Sin comentarios'}
        </div>`;

      const infoWindow = new google.maps.InfoWindow({
        content: contentString
      });

      marker.addListener('click', () => {
        infoWindow.open(this.map, marker);
      });
      this.marcadores.push(marker)
    });
    // Inicializar MarkerClusterer y pasar los marcadores
    this.markerCluster = new MarkerClusterer({
      markers: this.marcadores,
      map: this.map, // El mapa donde quieres mostrar los clústeres
      // Opcional: Puedes personalizar las opciones de clúster aquí
    });
  }
}
