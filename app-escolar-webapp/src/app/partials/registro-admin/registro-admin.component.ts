import { Component, Input, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FacadeService } from 'src/app/services/facade.service';
import { Location } from '@angular/common';
import { AdministradoresService } from 'src/app/services/administradores.service';
import { MatDialog } from '@angular/material/dialog';
import { AdvertenciaActualizarUsuarioModalComponent } from 'src/app/modals/advertencia-actualizar-usuario-modal/advertencia-actualizar-usuario-modal.component';

@Component({
  selector: 'app-registro-admin',
  templateUrl: './registro-admin.component.html',
  styleUrls: ['./registro-admin.component.scss']
})
export class RegistroAdminComponent implements OnInit, OnChanges {

  @Input() rol: string = "";
  @Input() datos_user: any = {};
  @Input() editarMode: boolean = false;
  @Input() userId: number = 0;

  public admin:any = {};
  public errors:any = {};
  public editar:boolean = false;
  public token: string = "";
  public idUser: Number = 0;

  //Para contraseñas
  public hide_1: boolean = false;
  public hide_2: boolean = false;
  public inputType_1: string = 'password';
  public inputType_2: string = 'password';

  constructor(
    private location: Location,
    public activatedRoute: ActivatedRoute,
    private administradoresService: AdministradoresService,
    private facadeService: FacadeService,
    private router: Router,
    private dialog: MatDialog
  ) { }

  ngOnInit(): void {
    // SIEMPRE inicializar primero
    this.admin = this.administradoresService.esquemaAdmin();
    this.admin.rol = this.rol;
    
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
        this.admin = { ...this.datos_user };
      }
    }else{
      // Si no va a editar, entonces inicializamos el JSON para registro nuevo
      this.token = this.facadeService.getSessionToken();
    }
    //Imprimir datos en consola
    console.log("Admin: ", this.admin);
  }

  ngOnChanges(changes: SimpleChanges): void {
    // Detecta cambios en datos_user cuando llegan de forma asíncrona
    if(changes['datos_user'] && changes['datos_user'].currentValue){
      if(this.editar && this.datos_user && Object.keys(this.datos_user).length > 0){
        this.admin = { ...this.datos_user };
        console.log("Datos admin actualizados: ", this.admin);
      }
    }
  }

  //Funciones para password
  public showPassword()
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

  public showPwdConfirmar()
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

  public regresar(){
    this.location.back();
  }

  public registrar(){
    this.errors = {};
    this.errors = this.administradoresService.validarAdmin(this.admin, this.editar);
    if(Object.keys(this.errors).length > 0){
      return false;
    }
    //Validar la contraseña
    if(this.admin.password == this.admin.confirmar_password){
      // Ejecutamos el servicio de registro
      this.administradoresService.registrarAdmin(this.admin).subscribe(
        (response) => {
          // Redirigir o mostrar mensaje de éxito
          alert("Administrador registrado exitosamente");
          console.log("Administrador registrado: ", response);
          if(this.token && this.token !== ""){
            this.router.navigate(["administrador"]);
          }else{
            this.router.navigate(["/"]);
          }
        },
        (error) => {
          // Manejar errores de la API
          alert("Error al registrar administrador");
          console.error("Error al registrar administrador: ", error);
        }
      );
    }else{
      alert("Las contraseñas no coinciden");
      this.admin.password="";
      this.admin.confirmar_password="";
    }
  }

  public actualizar(){
    // Validación de los datos
    this.errors = {};
    this.errors = this.administradoresService.validarAdmin(this.admin, this.editar);
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
        //Agregar el ID al objeto admin
        this.admin.id = this.idUser;
        // Ejecutamos el servicio de actualización
        this.administradoresService.actualizarAdmin(this.admin).subscribe(
          (response) => {
            // Redirigir o mostrar mensaje de éxito
            alert("Administrador actualizado exitosamente");
            console.log("Administrador actualizado: ", response);
            this.router.navigate(["administrador"]);
          },
          (error) => {
            // Manejar errores de la API
            alert("Error al actualizar administrador");
            console.error("Error al actualizar administrador: ", error);
          }
        );
      }
    });
  }

  // Función para los campos solo de datos alfabeticos
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
