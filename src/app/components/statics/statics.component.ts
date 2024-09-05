import { Component, OnInit, ViewChild } from '@angular/core';
import {
  ApexChart,
  ApexAxisChartSeries,
  ChartComponent,
  ApexDataLabels,
  ApexPlotOptions,
  ApexYAxis,
  ApexLegend,
  ApexGrid
} from "ng-apexcharts";
import { ARREGLO_CONSTANTES, ARREGLO_CONSTANTES_ABREVIADO, CONTADOR_DOMICILIO_A, INFRAESTRUCTURA_DOMICILIO_A, INFRAESTRUCTURA_INTERIOR_A, MANTENIMIENTO_DOMICILIO_A, MANTENIMIENTO_EXTERIOR_A, MANTENIMIENTO_INTERIOR_A, OTRO_ASUNTO_A, SIN_REVISION, SIN_REVISION_A } from 'src/app/common/constant/constantes';

type ApexXAxis = {
  type?: "category" | "datetime" | "numeric";
  categories?: any;
  labels?: {
    style?: {
      colors?: string | string[];
      fontSize?: string;
    };
  };
};

export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  dataLabels: ApexDataLabels;
  plotOptions: ApexPlotOptions;
  yaxis: ApexYAxis;
  xaxis: ApexXAxis;
  grid: ApexGrid;
  colors: string[];
  legend: ApexLegend;
};

@Component({
  selector: 'app-statics',
  templateUrl: './statics.component.html',
  styleUrls: ['./statics.component.scss'],
})
export class StaticsComponent {
  @ViewChild("chart") chart: ChartComponent;
  public chartOptions: Partial<ChartOptions>;

  arregloProblemasFull:any[]=ARREGLO_CONSTANTES
  arregloProblemasAbreviado:any[]=ARREGLO_CONSTANTES_ABREVIADO


  constructor() {
    this.graficoDeTiposSoluciones()
  }

  //PRIMER GRAFICO
  graficoDeTiposSoluciones(){
    this.chartOptions = {
      series: [
        {
          name: "distibuted",
          data: [21, 22, 10, 28, 16, 21, 13, 30] //TODO cambiar valores por la cantidad de tipos problema resueltos
        }
      ],
      chart: {
        height: 350,
        type: "bar",
        events: {
          click: function(chart, w, e) {
            // console.log(chart, w, e)
          }
        }
      },
      colors: [
        "#008FFB",
        "#00E396",
        "#FEB019",
        "#FF4560",
        "#775DD0",
        "#546E7A",
        "#26a69a",
        "#D10CE8"
      ],
      plotOptions: {
        bar: {
          columnWidth: "45%",
          distributed: true
        }
      },
      dataLabels: {
        enabled: false
      },
      legend: {
        show: false
      },
      grid: {
        show: true
      },
      xaxis: {
        categories: [
          SIN_REVISION_A,
          INFRAESTRUCTURA_DOMICILIO_A,
          INFRAESTRUCTURA_INTERIOR_A,
          CONTADOR_DOMICILIO_A,
          MANTENIMIENTO_DOMICILIO_A,
          MANTENIMIENTO_EXTERIOR_A,
          MANTENIMIENTO_INTERIOR_A,
          OTRO_ASUNTO_A
        ],
        labels: {
          style: {
            colors: [
              "#008FFB",
              "#00E396",
              "#FEB019",
              "#FF4560",
              "#775DD0",
              "#546E7A",
              "#26a69a",
              "#D10CE8"
            ],
            fontSize: "12px"
          }
        }
      }
    };

  }

  //SEGUNDO GRAFICO




}
