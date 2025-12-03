import { Component, OnInit } from '@angular/core';
import DatalabelsPlugin from 'chartjs-plugin-datalabels';
import { AdministradoresService } from 'src/app/services/administradores.service';
import { MateriasService } from 'src/app/services/materias.service';

@Component({
  selector: 'app-graficas-screen',
  templateUrl: './graficas-screen.component.html',
  styleUrls: ['./graficas-screen.component.scss']
})
export class GraficasScreenComponent implements OnInit{

  //Agregar chartjs-plugin-datalabels
  //Variables

  public total_user: any = {};
  public total_materias: any = {};

  //Histograma
  lineChartData = {
    labels: ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes"],
    datasets: [
      {
        data:[0, 0, 0, 0, 0],
        label: 'Materias por día de la semana',
        backgroundColor: '#F88406'
      }
    ]
  }
  lineChartOption = {
    responsive:false
  }
  lineChartPlugins = [ DatalabelsPlugin ];

  //Barras
  barChartData = {
    labels: ["Ingeniería en Ciencias de la Computación", "Licenciatura en Ciencias de la Computación", "Ingeniería en Tecnologías de la Información"],
    datasets: [
      {
        data:[0, 0, 0],
        label: 'Materias por programa educativo',
        backgroundColor: [
          '#F88406',
          '#FCFF44',
          '#82D3FB'
        ]
      }
    ]
  }
  barChartOption = {
    responsive:false
  }
  barChartPlugins = [ DatalabelsPlugin ];

  //Circular
  pieChartData = {
    labels: ["Administradores", "Maestros", "Alumnos"],
    datasets: [
      {
        data:[0, 0, 0],
        label: 'Registro de usuarios',
        backgroundColor: [
          '#FCFF44',
          '#F1C8F2',
          '#31E731'
        ]
      }
    ]
  }
  pieChartOption = {
    responsive:false
  }
  pieChartPlugins = [ DatalabelsPlugin ];

  // Doughnut
  doughnutChartData = {
    labels: ["Administradores", "Maestros", "Alumnos"],
    datasets: [
      {
        data:[0, 0, 0],
        label: 'Registro de usuarios',
        backgroundColor: [
          '#F88406',
          '#FCFF44',
          '#31E7E7'
        ]
      }
    ]
  }
  doughnutChartOption = {
    responsive:false
  }
  doughnutChartPlugins = [ DatalabelsPlugin ];

  constructor(
    private administradoresServices: AdministradoresService,
    private materiasService: MateriasService
  ) { }

  ngOnInit(): void {
    this.obtenerTotalUsers();
    this.obtenerTotalMaterias();
  }

  // Función para obtener el total de usuarios registrados
  public obtenerTotalUsers(){
    this.administradoresServices.getTotalUsuarios().subscribe(
      (response)=>{
        this.total_user = response;
        console.log("Total usuarios: ", this.total_user);
        
        // Actualizar gráficas con datos dinámicos
        this.pieChartData = {
          labels: ["Administradores", "Maestros", "Alumnos"],
          datasets: [
            {
              data:[response.admins || 0, response.maestros || 0, response.alumnos || 0],
              label: 'Registro de usuarios',
              backgroundColor: [
                '#FCFF44',
                '#F1C8F2',
                '#31E731'
              ]
            }
          ]
        };
        
        this.doughnutChartData = {
          labels: ["Administradores", "Maestros", "Alumnos"],
          datasets: [
            {
              data:[response.admins || 0, response.maestros || 0, response.alumnos || 0],
              label: 'Registro de usuarios',
              backgroundColor: [
                '#F88406',
                '#FCFF44',
                '#31E7E7'
              ]
            }
          ]
        };
      }, (error)=>{
        console.log("Error al obtener total de usuarios ", error);
        alert("No se pudo obtener el total de cada rol de usuarios");
      }
    );
  }

  // Función para obtener el total de materias y estadísticas
  public obtenerTotalMaterias(){
    this.materiasService.getTotalMaterias().subscribe(
      (response)=>{
        this.total_materias = response;
        console.log("Total materias: ", this.total_materias);
        
        // Actualizar gráfica de histograma (materias por día)
        if(response.por_dia){
          this.lineChartData = {
            labels: ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes"],
            datasets: [
              {
                data:[
                  response.por_dia.Lunes || 0,
                  response.por_dia.Martes || 0,
                  response.por_dia.Miércoles || 0,
                  response.por_dia.Jueves || 0,
                  response.por_dia.Viernes || 0
                ],
                label: 'Materias por día de la semana',
                backgroundColor: '#F88406'
              }
            ]
          };
        }
        
        // Actualizar gráfica de barras (materias por programa educativo)
        if(response.por_programa){
          const programas = [
            "Ingeniería en Ciencias de la Computación",
            "Licenciatura en Ciencias de la Computación",
            "Ingeniería en Tecnologías de la Información"
          ];
          const datos = programas.map(programa => response.por_programa[programa] || 0);
          
          this.barChartData = {
            labels: programas,
            datasets: [
              {
                data: datos,
                label: 'Materias por programa educativo',
                backgroundColor: [
                  '#F88406',
                  '#FCFF44',
                  '#82D3FB'
                ]
              }
            ]
          };
        }
      }, (error)=>{
        console.log("Error al obtener total de materias ", error);
        alert("No se pudo obtener el total de materias");
      }
    );
  }
}
