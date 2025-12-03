import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { EliminarMateriaModalComponent } from 'src/app/modals/eliminar-materia-modal/eliminar-materia-modal.component';
import { FacadeService } from 'src/app/services/facade.service';
import { MateriasService } from 'src/app/services/materias.service';

@Component({
  selector: 'app-materias-screen',
  templateUrl: './materias-screen.component.html',
  styleUrls: ['./materias-screen.component.scss']
})
export class MateriasScreenComponent implements OnInit, AfterViewInit {

  public name_user: string = "";
  public rol: string = "";
  public token: string = "";
  public lista_materias: any[] = [];

  //Para la tabla
  displayedColumns: string[] = ['nrc', 'nombre_materia', 'seccion', 'dias_semana', 'hora_inicio', 'hora_fin', 'salon', 'programa_educativo', 'profesor', 'creditos', 'editar', 'eliminar'];
  dataSource = new MatTableDataSource<DatosMateria>(this.lista_materias as DatosMateria[]);

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  ngAfterViewInit() {
    // No asignar aquí, se asignará después de cargar los datos
  }

  constructor(
    public facadeService: FacadeService,
    public materiasService: MateriasService,
    private router: Router,
    public dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.name_user = this.facadeService.getUserCompleteName();
    this.rol = this.facadeService.getUserGroup();
    //Validar que haya inicio de sesión
    //Obtengo el token del login
    this.token = this.facadeService.getSessionToken();
    console.log("Token: ", this.token);
    if(this.token == ""){
      this.router.navigate(["/"]);
    }
    //Obtener materias
    this.obtenerMaterias();
  }

  // Consumimos el servicio para obtener las materias
  public obtenerMaterias() {
    this.materiasService.obtenerListaMaterias().subscribe(
      (response) => {
        this.lista_materias = response;
        console.log("Lista materias: ", this.lista_materias);
        if (this.lista_materias.length > 0) {
          // Procesar datos para mostrar en la tabla
          this.lista_materias.forEach(materia => {
            // Convertir dias_semana si es string
            if(typeof materia.dias_semana === 'string'){
              try {
                materia.dias_semana = JSON.parse(materia.dias_semana);
              } catch(e) {
                materia.dias_semana = [];
              }
            }
            // Obtener nombre del profesor
            if(materia.profesor_asignado){
              materia.profesor_nombre = `${materia.profesor_asignado.user.first_name} ${materia.profesor_asignado.user.last_name}`;
            } else {
              materia.profesor_nombre = 'Sin asignar';
            }
            // Formatear días para mostrar
            if(Array.isArray(materia.dias_semana)){
              materia.dias_display = materia.dias_semana.join(', ');
            } else {
              materia.dias_display = '';
            }
          });
          console.log("Materias procesadas: ", this.lista_materias);

          this.dataSource = new MatTableDataSource<DatosMateria>(this.lista_materias as DatosMateria[]);
          // Configurar sorting para columna NRC y nombre
          this.dataSource.sortingDataAccessor = (item, property) => {
            switch(property) {
              case 'nrc': return item.nrc || '';
              case 'nombre_materia': return item.nombre_materia || '';
              default: return item[property];
            }
          };
          // Configurar filterPredicate para buscar por NRC y nombre
          this.dataSource.filterPredicate = (data: any, filter: string) => {
            const nrc = (data.nrc || '').toLowerCase();
            const nombre = (data.nombre_materia || '').toLowerCase();
            return nrc.includes(filter) || nombre.includes(filter);
          };
          // Reasignar paginator y sort después de actualizar dataSource
          setTimeout(() => {
            this.dataSource.paginator = this.paginator;
            this.dataSource.sort = this.sort;
          });
        }
      }, (error) => {
        console.error("Error al obtener la lista de materias: ", error);
        alert("No se pudo obtener la lista de materias");
      }
    );
  }

  // Método para filtrar
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  public goEditar(idMateria: number) {
    this.router.navigate(["registro-materias/" + idMateria]);
  }

  public delete(idMateria: number) {
    // Solo administrador puede eliminar
    if (this.rol === 'administrador') {
      const dialogRef = this.dialog.open(EliminarMateriaModalComponent,{
        data: {id: idMateria},
        height: '288px',
        width: '328px',
      });

      dialogRef.afterClosed().subscribe(result => {
        if(result.isDelete){
          console.log("Materia eliminada");
          alert("Materia eliminada correctamente.");
          //Recargar página
          window.location.reload();
        }else{
          alert("Materia no se ha podido eliminar.");
          console.log("No se eliminó la materia");
        }
      });
    }else{
      alert("No tienes permisos para eliminar esta materia.");
    }
  }

  // Verificar si el usuario puede editar/eliminar (solo admin)
  public canEditDelete(): boolean {
    return this.rol === 'administrador';
  }

  public getDisplayedColumns(): string[] {
    if (this.canEditDelete()) {
      return this.displayedColumns;
    } else {
      // Remover 'editar' y 'eliminar' si no es admin
      return this.displayedColumns.filter(col => col !== 'editar' && col !== 'eliminar');
    }
  }

}
//Esto va fuera de la llave que cierra la clase
export interface DatosMateria {
  id: number,
  nrc: string;
  nombre_materia: string;
  seccion: string;
  dias_semana: string[];
  dias_display: string;
  hora_inicio: string;
  hora_fin: string;
  salon: string;
  programa_educativo: string;
  profesor_asignado: any;
  profesor_nombre: string;
  creditos: number;
}

