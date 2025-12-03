import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FacadeService } from 'src/app/services/facade.service';
import { MateriasService } from 'src/app/services/materias.service';
import { RegistroMateriasComponent } from 'src/app/partials/registro-materias/registro-materias.component';

@Component({
  selector: 'app-registro-materias-screen',
  templateUrl: './registro-materias-screen.component.html',
  styleUrls: ['./registro-materias-screen.component.scss']
})
export class RegistroMateriasScreenComponent implements OnInit {

  public rol: string = "";
  public token: string = "";
  public idMateria: number = 0;
  public datos_materia: any = {};
  public editarMode: boolean = false;

  constructor(
    private router: Router,
    public activatedRoute: ActivatedRoute,
    private facadeService: FacadeService,
    private materiasService: MateriasService
  ) { }

  ngOnInit(): void {
    this.rol = this.facadeService.getUserGroup();
    this.token = this.facadeService.getSessionToken();
    
    // Validar que solo administrador pueda registrar/editar materias
    if(this.rol !== 'administrador'){
      alert("No tienes permisos para acceder a esta sección");
      this.router.navigate(["/home"]);
      return;
    }

    if(this.token == ""){
      this.router.navigate(["/"]);
    }

    //Detectar si estamos editando
    if(this.activatedRoute.snapshot.params['id'] != undefined){
      this.editarMode = true;
      this.idMateria = this.activatedRoute.snapshot.params['id'];
      this.obtenerMateria();
    }
  }

  public obtenerMateria(){
    this.materiasService.obtenerMateriaPorID(this.idMateria).subscribe(
      (response) => {
        this.datos_materia = response;
        console.log("Datos materia: ", this.datos_materia);
      },
      (error) => {
        console.error("Error al obtener la materia: ", error);
        alert("No se pudo obtener la información de la materia");
        this.router.navigate(["/materias"]);
      }
    );
  }
}

