import { Component, AfterViewInit } from '@angular/core';
import { ReportesI } from 'src/app/common/interfaces/reportes.interface';
import { FireStoreService } from 'src/app/common/services/fire-store.service';

declare var google: any;

@Component({
  selector: 'app-heatmap',
  templateUrl: './heatmap.component.html',
  styleUrls: ['./heatmap.component.scss'],
})
export class HeatmapComponent implements AfterViewInit {

  map: any;
  heatmap: any;

  localizaciones: { lat: number, lng: number, tipoAsuntoPorOperario: string, comentarioOperario: string }[] = [];

  reportes: ReportesI[] = [];

  constructor(private serviciosFireStoreDatabase: FireStoreService) { }

  ngAfterViewInit() {
    this.initMap();
    this.getReportesGeneralesEmpresaOperario();
  }

  async initMap() {
    const mapRef = document.getElementById('map');

    this.map = new google.maps.Map(mapRef, {
      center: { lat: 3.522996, lng: -76.711889 },
      zoom: 15,
      scaleControl: true,
    });

    this.heatmap = new google.maps.visualization.HeatmapLayer({
      data: this.getPoints(),
      map: this.map,
    });

    // Agregar leyenda personalizada al mapa
    const legend = document.getElementById('heatmap-legend');
    this.map.controls[google.maps.ControlPosition.LEFT_BOTTOM].push(legend);
  }

  getPoints() {
    return this.localizaciones.map(loc => new google.maps.LatLng(loc.lat, loc.lng));
  }

  getReportesGeneralesEmpresaOperario() {
    this.serviciosFireStoreDatabase.getDocumentosGeneralAtentoCambios<ReportesI>("Reportes").subscribe(data => {
      if (data) {
        this.reportes = data;
        this.reportes.forEach(reporte => {
          if (reporte.ubicacion && reporte.tipoAsuntoPorOperario && reporte.comentarioOperario) {
            this.separadorubicacion(reporte.ubicacion, reporte.tipoAsuntoPorOperario, reporte.comentarioOperario);
          }
        });

        this.updateHeatmap();
        this.addMarkers();
      }
    });
  }

  separadorubicacion(coordenadas: string, tipoAsuntoPorOperario: string, comentarioOperario: string) {
    const [latStr, lngStr] = coordenadas.split(' ');
    const lat = parseFloat(latStr);
    const lng = parseFloat(lngStr);
    this.localizaciones.push({ lat, lng, tipoAsuntoPorOperario, comentarioOperario });
  }

  updateHeatmap() {
    const points = this.getPoints();
    this.heatmap.setData(points);
  }

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
    });
  }
}
