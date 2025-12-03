import { Component, Input, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FacadeService } from 'src/app/services/facade.service';
import { Location } from '@angular/common';
import { MaestrosService } from 'src/app/services/maestros.service';
import { MatDialog } from '@angular/material/dialog';
import { AdvertenciaActualizarUsuarioModalComponent } from 'src/app/modals/advertencia-actualizar-usuario-modal/advertencia-actualizar-usuario-modal.component';

@Component({
  selector: 'app-registro-maestros',
  templateUrl: './registro-maestros.component.html',
  styleUrls: ['./registro-maestros.component.scss']
})
export class RegistroMaestrosComponent implements OnInit, OnChanges {

  @Input() rol: string = "";
  @Input() datos_user: any = {};
  @Input() editarMode: boolean = false;
  @Input() userId: number = 0;

  //Para contraseñas
  public hide_1: boolean = false;
  public hide_2: boolean = false;
  public inputType_1: string = 'password';
  public inputType_2: string = 'password';

  public maestro:any = {};
  public errors:any = {};
  public editar:boolean = false;
  public token: string = "";
  public idUser: Number = 0;

  //Para el select
  public areas: any[] = [
    {value: '1', viewValue: 'Desarrollo Web'},
    {value: '2', viewValue: 'Programación'},
    {value: '3', viewValue: 'Bases de datos'},
    {value: '4', viewValue: 'Redes'},
    {value: '5', viewValue: 'Matemáticas'},
  ];

  public materias:any[] = [
    {value: '1', nombre: 'Aplicaciones Web'},
    {value: '2', nombre: 'Programación 1'},
    {value: '3', nombre: 'Bases de datos'},
    {value: '4', nombre: 'Tecnologías Web'},
    {value: '5', nombre: 'Minería de datos'},
    {value: '6', nombre: 'Desarrollo móvil'},
    {value: '7', nombre: 'Estructuras de datos'},
    {value: '8', nombre: 'Administración de redes'},
    {value: '9', nombre: 'Ingeniería de Software'},
    {value: '10', nombre: 'Administración de S.O.'},
  ];

  constructor(
    private router: Router,
    private location : Location,
    public activatedRoute: ActivatedRoute,
    private facadeService: FacadeService,
    private maestrosService: MaestrosService,
    private dialog: MatDialog
  ) { }

  ngOnInit(): void {
    // SIEMPRE inicializar el formulario primero
    this.maestro = this.maestrosService.esquemaMaestro();
    this.maestro.rol = this.rol;
    
    //Detectar si estamos editando (desde URL o desde Input)
    if(this.activatedRoute.snapshot.params['id'] != undefined || this.editarMode){
      this.editar = true;
      //Asignamos a nuestra variable global el valor del ID que viene por la URL o del Input
      if(this.activatedRoute.snapshot.params['id'] != undefined){
        this.idUser = this.activatedRoute.snapshot.params['id'];
      } else if(this.userId > 0){
        this.idUser = this.userId;
      }
      console.log("ID User: ", this.idUser);
      //Al iniciar la vista asignamos los datos del user si ya están disponibles
      if(this.datos_user && Object.keys(this.datos_user).length > 0){
        this.maestro = { ...this.datos_user };
        // Asegurar que materias_json sea un array
        if(this.maestro.materias_json){
          if(typeof this.maestro.materias_json === 'string'){
            try {
              this.maestro.materias_json = JSON.parse(this.maestro.materias_json);
            } catch(e) {
              this.maestro.materias_json = [];
            }
          }
          if(!Array.isArray(this.maestro.materias_json)){
            this.maestro.materias_json = [];
          }
        } else {
          this.maestro.materias_json = [];
        }
      }
    }else{
      // Si no va a editar, entonces es registro nuevo
      this.token = this.facadeService.getSessionToken();
    }
    //Imprimir datos en consola
    console.log("Datos maestro: ", this.maestro);
  }

  ngOnChanges(changes: SimpleChanges): void {
    // Detecta cambios en datos_user cuando llegan de forma asíncrona
    if(changes['datos_user'] && changes['datos_user'].currentValue){
      if(this.editar && this.datos_user && Object.keys(this.datos_user).length > 0){
        // Copiar todos los datos del usuario
        this.maestro = { ...this.datos_user };
        // Asegurar que materias_json sea un array
        if(this.maestro.materias_json){
          if(typeof this.maestro.materias_json === 'string'){
            try {
              this.maestro.materias_json = JSON.parse(this.maestro.materias_json);
            } catch(e) {
              this.maestro.materias_json = [];
            }
          }
          if(!Array.isArray(this.maestro.materias_json)){
            this.maestro.materias_json = [];
          }
        } else {
          this.maestro.materias_json = [];
        }
        console.log("Datos maestro actualizados: ", this.maestro);
      }
    }
  }

  public regresar(){
    this.location.back();
  }

  public registrar(){
    //Validamos si el formulario está lleno y correcto
    this.errors = {};
    this.errors = this.maestrosService.validarMaestro(this.maestro, this.editar);
    if(Object.keys(this.errors).length > 0){
      return false;
    }
    //Validar la contraseña
    if(this.maestro.password == this.maestro.confirmar_password){
      this.maestrosService.registrarMaestro(this.maestro).subscribe(
        (response) => {
          // Redirigir o mostrar mensaje de éxito
          alert("Maestro registrado exitosamente");
          console.log("Maestro registrado: ", response);
          if(this.token && this.token !== ""){
            this.router.navigate(["maestros"]);
          }else{
            this.router.navigate(["/"]);
          }
        },
        (error) => {
          // Manejar errores de la API
          alert("Error al registrar maestro");
          console.error("Error al registrar maestro: ", error);
        }
      );
    }else{
      alert("Las contraseñas no coinciden");
      this.maestro.password="";
      this.maestro.confirmar_password="";
    }
  }

  public actualizar(){
    //Validamos si el formulario está lleno y correcto
    this.errors = {};
    this.errors = this.maestrosService.validarMaestro(this.maestro, this.editar);
    if(Object.keys(this.errors).length > 0){
      return false;
    }
    
    // Abrir modal de advertencia antes de actualizar
    const dialogRef = this.dialog.open(AdvertenciaActualizarUsuarioModalComponent, {
      data: {},
      height: '288px',
      width: '328px',
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result && result.confirm){
        //Agregar el ID al objeto maestro
        this.maestro.id = this.idUser;
        
        this.maestrosService.actualizarMaestro(this.maestro).subscribe(
          (response) => {
            alert("Maestro actualizado exitosamente");
            console.log("Maestro actualizado: ", response);
            this.router.navigate(["maestros"]);
          },
          (error) => {
            alert("Error al actualizar maestro");
            console.error("Error al actualizar maestro: ", error);
          }
        );
      }
    });
  }

  //Funciones para password
  showPassword()
  {
    if(this.inputType_1 == 'password'){
      this.inputType_1 = 'text';
      this.hide_1 = true;
    }
    else{
      this.inputType_1 = 'password';
      this.hide_1 = false;
    }
  }

  showPwdConfirmar()
  {
    if(this.inputType_2 == 'password'){
      this.inputType_2 = 'text';
      this.hide_2 = true;
    }
    else{
      this.inputType_2 = 'password';
      this.hide_2 = false;
    }
  }

  //Función para detectar el cambio de fecha
  public changeFecha(event :any){
    console.log(event);
    console.log(event.value.toISOString());

    this.maestro.fecha_nacimiento = event.value.toISOString().split("T")[0];
    console.log("Fecha: ", this.maestro.fecha_nacimiento);
  }

  // Funciones para los checkbox
  public checkboxChange(event:any){
    console.log("Evento: ", event);
    if(event.checked){
      this.maestro.materias_json.push(event.source.value)
    }else{
      console.log(event.source.value);
      this.maestro.materias_json.forEach((materia, i) => {
        if(materia == event.source.value){
          this.maestro.materias_json.splice(i,1)
        }
      });
    }
    console.log("Array materias: ", this.maestro);
  }

  public revisarSeleccion(nombre: string){
    if(this.maestro.materias_json){
      var busqueda = this.maestro.materias_json.find((element)=>element==nombre);
      if(busqueda != undefined){
        return true;
      }else{
        return false;
      }
    }else{
      return false;
    }
  }

  public soloLetras(event: KeyboardEvent) {
    const charCode = event.key.charCodeAt(0);
    // Permitir solo letras (mayúsculas y minúsculas) y espacio
    if (
      !(charCode >= 65 && charCode <= 90) &&  // Letras mayúsculas
      !(charCode >= 97 && charCode <= 122) && // Letras minúsculas
      charCode !== 32                         // Espacio
    ) {
      event.preventDefault();
    }
  }

}
