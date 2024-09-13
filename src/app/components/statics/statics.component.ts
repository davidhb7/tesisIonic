import { Component, OnInit, ViewChild } from '@angular/core';
import { FireStoreService } from 'src/app/common/services/fire-store.service';
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
import { ARREGLO_CONSTANTES, ARREGLO_CONSTANTES_ABREVIADO, CONTADOR_DOMICILIO_A, INFRAESTRUCTURA_DOMICILIO_A, INFRAESTRUCTURA_INTERIOR_A, MANTENIMIENTO_DOMICILIO_A, MANTENIMIENTO_EXTERIOR_A, MANTENIMIENTO_INTERIOR_A, OTRO_ASUNTO_A, SIN_REVISION_A, SIN_REVISION,
  INFRAESTRUCTURA_DOMICILIO, INFRAESTRUCTURA_EXTERIOR, INFRAESTRUCTURA_INTERIOR, CONTADOR_DOMICILIO, MANTENIMIENTO_DOMICILIO, MANTENIMIENTO_EXTERIOR, MANTENIMIENTO_INTERIOR,OTRO_ASUNTO,INFRAESTRUCTURA_EXTERIOR_A
} from 'src/app/common/constant/constantes';
import { ReportesI } from 'src/app/common/interfaces/reportes.interface';



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
export class StaticsComponent implements OnInit{
  @ViewChild("chart") chart: ChartComponent;
  public chartOptions: Partial<ChartOptions>;

  //OBJETOS
  reportes:ReportesI[]=[];

  arregloProblemasFull:any[]=ARREGLO_CONSTANTES
  arregloProblemasAbreviado:any[]=ARREGLO_CONSTANTES_ABREVIADO

  arregloLogrosTipos:{
    "sra":number,
    "ida":number,
    "iea":number,
    "iia":number,
    "cda":number,
    "mda":number,
    "mea":number,
    "mia":number,
    "oaa":number
  }
  in(){
    this.arregloLogrosTipos={
      "sra":0,
      "ida":0,
      "iea":0,
      "iia":0,
      "cda":0,
      "mda":0,
      "mea":0,
      "mia":0,
      "oaa":0
    }
  }

  nuevoArra:number[]=[];


  constructor(
    private serviciosFireStoreDatabase: FireStoreService
  ) {
    this.graficoDeTiposSoluciones();
    this.getReportesGeneralesEmpresaOperario();
    this.graficoDeTiposSoluciones();
  }
  async ngOnInit() {
    return;
  }


  //PRIMER GRAFICO
  graficoDeTiposSoluciones(){
    this.chartOptions = {
      series: [
        {

          name: "Cantidad de registros por situación",
          data:this.nuevoArra
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

        enabled: true,

      },
      legend: {

        show: true
      },
      grid: {
        show: true

      },
      xaxis: {
        categories: [
          SIN_REVISION_A,
          INFRAESTRUCTURA_DOMICILIO_A,
          INFRAESTRUCTURA_EXTERIOR_A,
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


  // Traer reportes de la base de datos y agregar las coordenadas
async getReportesGeneralesEmpresaOperario() {
  this.in();
  this.serviciosFireStoreDatabase.getDocumentosGeneralAtentoCambios<ReportesI>("Reportes").subscribe(data => {
    if (data) {
      this.reportes = data;
      this.reportes.forEach(reporte => {
        console.log("rep:",reporte.tipoAsuntoPorOperario);
      });
    }

    this.clasificacionTipoLogro();
  });

}




clasificacionTipoLogro(){
  this.reportes.forEach(reporte=>{
    let tipoLogro=reporte.tipoAsuntoPorOperario

    if(tipoLogro==SIN_REVISION || tipoLogro=="" || tipoLogro==undefined){
      this.arregloLogrosTipos.sra++;
    }
    else if(tipoLogro==INFRAESTRUCTURA_DOMICILIO){
      this.arregloLogrosTipos.ida++;
    }
    else if(tipoLogro==INFRAESTRUCTURA_EXTERIOR){
      this.arregloLogrosTipos.iea++;
    }
    else if(tipoLogro==INFRAESTRUCTURA_INTERIOR){
      this.arregloLogrosTipos.iia++;
    }
    else if(tipoLogro==CONTADOR_DOMICILIO){
      this.arregloLogrosTipos.cda++;
      console.log(this.arregloLogrosTipos.cda++)
    }
    else if(tipoLogro==MANTENIMIENTO_DOMICILIO){
      this.arregloLogrosTipos.mda++;
    }
    else if(tipoLogro==MANTENIMIENTO_EXTERIOR){
      this.arregloLogrosTipos.mea++;
    }
    else if(tipoLogro==MANTENIMIENTO_INTERIOR){
      this.arregloLogrosTipos.mia++;
    }
    else if(tipoLogro==OTRO_ASUNTO){
      this.arregloLogrosTipos.oaa++;
    }
    else{
      console.log("interr",this.nuevoArra);
    }
  });
  this.nuevoArra.push(
    this.arregloLogrosTipos.sra,
    this.arregloLogrosTipos.ida,
    this.arregloLogrosTipos.iea,
    this.arregloLogrosTipos.iia,
    this.arregloLogrosTipos.cda,
    this.arregloLogrosTipos.mda,
    this.arregloLogrosTipos.mea,
    this.arregloLogrosTipos.mia,
    this.arregloLogrosTipos.oaa
  )
  console.log("nuevo ar",this.nuevoArra);
  this.graficoDeTiposSoluciones();

}








}
