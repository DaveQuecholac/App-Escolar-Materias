import { Component, Input, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FacadeService } from 'src/app/services/facade.service';
import { Location } from '@angular/common';
import { MateriasService } from 'src/app/services/materias.service';
import { MaestrosService } from 'src/app/services/maestros.service';
import { MatDialog } from '@angular/material/dialog';
import { AdvertenciaActualizarMateriaModalComponent } from 'src/app/modals/advertencia-actualizar-materia-modal/advertencia-actualizar-materia-modal.component';

@Component({
  selector: 'app-registro-materias',
  templateUrl: './registro-materias.component.html',
  styleUrls: ['./registro-materias.component.scss']
})
export class RegistroMateriasComponent implements OnInit, OnChanges {

  @Input() datos_materia: any = {};
  @Input() editarMode: boolean = false;
  @Input() materiaId: number = 0;

  public materia:any = {};
  public errors:any = {};
  public editar:boolean = false;
  public token: string = "";
  public idMateria: Number = 0;
  public lista_maestros: any[] = [];

  // Días de la semana
  public dias_semana: any[] = [
    {value: 'Lunes', nombre: 'Lunes'},
    {value: 'Martes', nombre: 'Martes'},
    {value: 'Miércoles', nombre: 'Miércoles'},
    {value: 'Jueves', nombre: 'Jueves'},
    {value: 'Viernes', nombre: 'Viernes'},
  ];

  // Programas educativos
  public programas_educativos: any[] = [
    {value: 'Ingeniería en Ciencias de la Computación', nombre: 'Ingeniería en Ciencias de la Computación'},
    {value: 'Licenciatura en Ciencias de la Computación', nombre: 'Licenciatura en Ciencias de la Computación'},
    {value: 'Ingeniería en Tecnologías de la Información', nombre: 'Ingeniería en Tecnologías de la Información'},
  ];

  constructor(
    private router: Router,
    private location : Location,
    public activatedRoute: ActivatedRoute,
    private facadeService: FacadeService,
    private materiasService: MateriasService,
    private maestrosService: MaestrosService,
    public dialog: MatDialog
  ) { }

  ngOnInit(): void {
    // SIEMPRE inicializar el formulario primero
    this.materia = this.materiasService.esquemaMateria();
    
    // Obtener lista de maestros para el select
    this.obtenerMaestros();
    
    //Detectar si estamos editando (desde URL o desde Input)
    if(this.activatedRoute.snapshot.params['id'] != undefined || this.editarMode){
      this.editar = true;
      //Asignamos a nuestra variable global el valor del ID que viene por la URL o del Input
      if(this.activatedRoute.snapshot.params['id'] != undefined){
        this.idMateria = this.activatedRoute.snapshot.params['id'];
      } else if(this.materiaId > 0){
        this.idMateria = this.materiaId;
      }
      console.log("ID Materia: ", this.idMateria);
      //Al iniciar la vista asignamos los datos de la materia si ya están disponibles
      if(this.datos_materia && Object.keys(this.datos_materia).length > 0){
        this.materia = { ...this.datos_materia };
        // Asegurar que dias_semana sea un array
        if(this.materia.dias_semana){
          if(typeof this.materia.dias_semana === 'string'){
            try {
              this.materia.dias_semana = JSON.parse(this.materia.dias_semana);
            } catch(e) {
              this.materia.dias_semana = [];
            }
          }
          if(!Array.isArray(this.materia.dias_semana)){
            this.materia.dias_semana = [];
          }
        } else {
          this.materia.dias_semana = [];
        }
        // Convertir profesor_asignado a profesor_asignado_id si es necesario
        if(this.materia.profesor_asignado && !this.materia.profesor_asignado_id){
          this.materia.profesor_asignado_id = this.materia.profesor_asignado.id;
        }
        // Convertir formato de hora de HH:mm:ss a HH:mm para el timepicker
        if(this.materia.hora_inicio && this.materia.hora_inicio.length > 5){
          this.materia.hora_inicio = this.materia.hora_inicio.substring(0, 5);
        }
        if(this.materia.hora_fin && this.materia.hora_fin.length > 5){
          this.materia.hora_fin = this.materia.hora_fin.substring(0, 5);
        }
        // Convertir créditos a string si viene como número
        if(this.materia.creditos !== undefined && this.materia.creditos !== null){
          this.materia.creditos = String(this.materia.creditos).trim();
        }
      }
    }else{
      // Si no va a editar, entonces es registro nuevo
      this.token = this.facadeService.getSessionToken();
    }
    //Imprimir datos en consola
    console.log("Datos materia: ", this.materia);
  }

  ngOnChanges(changes: SimpleChanges): void {
    // Detecta cambios en datos_materia cuando llegan de forma asíncrona
    if(changes['datos_materia'] && changes['datos_materia'].currentValue){
      if(this.editar && this.datos_materia && Object.keys(this.datos_materia).length > 0){
        // Copiar todos los datos de la materia
        this.materia = { ...this.datos_materia };
        // Asegurar que dias_semana sea un array
        if(this.materia.dias_semana){
          if(typeof this.materia.dias_semana === 'string'){
            try {
              this.materia.dias_semana = JSON.parse(this.materia.dias_semana);
            } catch(e) {
              this.materia.dias_semana = [];
            }
          }
          if(!Array.isArray(this.materia.dias_semana)){
            this.materia.dias_semana = [];
          }
        } else {
          this.materia.dias_semana = [];
        }
        // Convertir profesor_asignado a profesor_asignado_id si es necesario
        if(this.materia.profesor_asignado && !this.materia.profesor_asignado_id){
          this.materia.profesor_asignado_id = this.materia.profesor_asignado.id;
        }
        console.log("Datos materia actualizados: ", this.materia);
      }
    }
  }

  // Obtener lista de maestros
  public obtenerMaestros() {
    this.maestrosService.obtenerListaMaestros().subscribe(
      (response) => {
        this.lista_maestros = response;
        console.log("Lista maestros: ", this.lista_maestros);
      },
      (error) => {
        console.error("Error al obtener la lista de maestros: ", error);
      }
    );
  }

  public regresar(){
    this.location.back();
  }

  public registrar(){
    //Validamos si el formulario está lleno y correcto
    this.errors = {};
    this.errors = this.materiasService.validarMateria(this.materia, this.editar);
    if(Object.keys(this.errors).length > 0){
      return false;
    }
    
    // Convertir formato de hora a HH:mm:ss para el backend
    const materiaToSend = { ...this.materia };
    
    // Asegurar que las horas estén en formato 24 horas antes de agregar segundos
    if(materiaToSend.hora_inicio) {
      materiaToSend.hora_inicio = this.convertirHora24Horas(materiaToSend.hora_inicio);
      if(materiaToSend.hora_inicio.length === 5){
        materiaToSend.hora_inicio = materiaToSend.hora_inicio + ':00';
      }
    }
    if(materiaToSend.hora_fin) {
      materiaToSend.hora_fin = this.convertirHora24Horas(materiaToSend.hora_fin);
      if(materiaToSend.hora_fin.length === 5){
        materiaToSend.hora_fin = materiaToSend.hora_fin + ':00';
      }
    }
    
    this.materiasService.registrarMateria(materiaToSend).subscribe(
      (response) => {
        // Redirigir o mostrar mensaje de éxito
        alert("Materia registrada exitosamente");
        console.log("Materia registrada: ", response);
        if(this.token && this.token !== ""){
          this.router.navigate(["materias"]);
        }else{
          this.router.navigate(["/"]);
        }
      },
      (error) => {
        // Manejar errores de la API
        if(error.error && error.error.message){
          alert(error.error.message);
        } else {
          alert("Error al registrar materia");
        }
        console.error("Error al registrar materia: ", error);
      }
    );
  }

  public actualizar(){
    //Validamos si el formulario está lleno y correcto
    this.errors = {};
    this.errors = this.materiasService.validarMateria(this.materia, this.editar);
    if(Object.keys(this.errors).length > 0){
      return false;
    }
    
    // Abrir modal de advertencia antes de actualizar
    const dialogRef = this.dialog.open(AdvertenciaActualizarMateriaModalComponent, {
      data: {},
      height: '288px',
      width: '328px',
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result && result.confirm){
        //Agregar el ID al objeto materia
        this.materia.id = this.idMateria;
        
        // Convertir formato de hora a HH:mm:ss para el backend
        const materiaToSend = { ...this.materia };
        
        // Asegurar que las horas estén en formato 24 horas antes de agregar segundos
        if(materiaToSend.hora_inicio) {
          materiaToSend.hora_inicio = this.convertirHora24Horas(materiaToSend.hora_inicio);
          if(materiaToSend.hora_inicio.length === 5){
            materiaToSend.hora_inicio = materiaToSend.hora_inicio + ':00';
          }
        }
        if(materiaToSend.hora_fin) {
          materiaToSend.hora_fin = this.convertirHora24Horas(materiaToSend.hora_fin);
          if(materiaToSend.hora_fin.length === 5){
            materiaToSend.hora_fin = materiaToSend.hora_fin + ':00';
          }
        }
        
        this.materiasService.actualizarMateria(materiaToSend).subscribe(
          (response) => {
            alert("Materia actualizada exitosamente");
            console.log("Materia actualizada: ", response);
            this.router.navigate(["materias"]);
          },
          (error) => {
            if(error.error && error.error.message){
              alert(error.error.message);
            } else {
              alert("Error al actualizar materia");
            }
            console.error("Error al actualizar materia: ", error);
          }
        );
      }
    });
  }

  // Funciones para los checkbox de días
  public checkboxChange(event:any){
    console.log("Evento: ", event);
    if(event.checked){
      this.materia.dias_semana.push(event.source.value)
    }else{
      console.log(event.source.value);
      this.materia.dias_semana.forEach((dia, i) => {
        if(dia == event.source.value){
          this.materia.dias_semana.splice(i,1)
        }
      });
    }
    console.log("Array dias: ", this.materia.dias_semana);
  }

  public revisarSeleccion(nombre: string){
    if(this.materia.dias_semana){
      var busqueda = this.materia.dias_semana.find((element)=>element==nombre);
      if(busqueda != undefined){
        return true;
      }else{
        return false;
      }
    }else{
      return false;
    }
  }

  // Función para convertir formato 12 horas (AM/PM) a 24 horas (HH:mm)
  private convertirHora24Horas(time12h: string): string {
    if (!time12h) return '';
    
    // Si ya está en formato 24 horas (contiene : y no tiene AM/PM), devolverlo
    if (time12h.includes(':') && !time12h.toUpperCase().includes('AM') && !time12h.toUpperCase().includes('PM')) {
      return time12h.length === 5 ? time12h : time12h.substring(0, 5);
    }
    
    // Convertir de formato 12 horas a 24 horas
    // El formato puede ser: "1:00 PM", "1:00PM", "1:00 pm", etc.
    const upperTime = time12h.toUpperCase().trim();
    const hasPM = upperTime.includes('PM');
    const hasAM = upperTime.includes('AM');
    
    // Extraer solo la parte numérica (remover AM/PM)
    const timeOnly = upperTime.replace(/[AP]M/g, '').trim();
    const [hours, minutes] = timeOnly.split(':');
    
    if (!hours || !minutes) return time12h; // Si no se puede parsear, devolver original
    
    let hour24 = parseInt(hours, 10);
    const mins = minutes || '00';
    
    if (hasPM && hour24 !== 12) {
      hour24 += 12;
    } else if (hasAM && hour24 === 12) {
      hour24 = 0;
    }
    
    return `${hour24.toString().padStart(2, '0')}:${mins.padStart(2, '0')}`;
  }

  // Función para detectar el cambio de hora desde el timepicker
  public changeHoraInicio(event: any){
    // El timepicker devuelve el tiempo en el evento, puede ser un string o un objeto
    let time: string = '';
    if (typeof event === 'string') {
      time = event;
    } else if (event && event.time) {
      time = event.time;
    } else if (event && event.target && event.target.value) {
      time = event.target.value;
    }
    
    // Convertir a formato 24 horas si viene en formato 12 horas
    if (time) {
      this.materia.hora_inicio = this.convertirHora24Horas(time);
    }
  }

  public changeHoraFin(event: any){
    // El timepicker devuelve el tiempo en el evento, puede ser un string o un objeto
    let time: string = '';
    if (typeof event === 'string') {
      time = event;
    } else if (event && event.time) {
      time = event.time;
    } else if (event && event.target && event.target.value) {
      time = event.target.value;
    }
    
    // Convertir a formato 24 horas si viene en formato 12 horas
    if (time) {
      this.materia.hora_fin = this.convertirHora24Horas(time);
    }
  }

  // Función para solo letras y espacios (nombre de materia)
  public soloLetras(event: KeyboardEvent) {
    const charCode = event.key.charCodeAt(0);
    // Permitir solo letras (mayúsculas y minúsculas) y espacio
    if (
      !(charCode >= 65 && charCode <= 90) &&  // Letras mayúsculas
      !(charCode >= 97 && charCode <= 122) && // Letras minúsculas
      charCode !== 32 &&                       // Espacio
      charCode !== 209 &&                      // Ñ mayúscula
      charCode !== 241                        // ñ minúscula
    ) {
      event.preventDefault();
    }
  }

  // Función para solo alfanuméricos y espacios (salón)
  public soloAlfanumerico(event: KeyboardEvent) {
    const charCode = event.key.charCodeAt(0);
    // Permitir letras, números y espacio
    if (
      !(charCode >= 65 && charCode <= 90) &&  // Letras mayúsculas
      !(charCode >= 97 && charCode <= 122) && // Letras minúsculas
      !(charCode >= 48 && charCode <= 57) &&  // Números
      charCode !== 32                         // Espacio
    ) {
      event.preventDefault();
    }
  }
}

