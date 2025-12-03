import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FacadeService } from './facade.service';
import { ErrorsService } from './tools/errors.service';
import { ValidatorService } from './tools/validator.service';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class MateriasService {

  constructor(
    private http: HttpClient,
    private validatorService: ValidatorService,
    private errorService: ErrorsService,
    private facadeService: FacadeService
  ) { }

  public esquemaMateria(){
    return {
      'nrc': '',
      'nombre_materia': '',
      'seccion': '',
      'dias_semana': [],
      'hora_inicio': '',
      'hora_fin': '',
      'salon': '',
      'programa_educativo': '',
      'profesor_asignado_id': '',
      'creditos': ''
    }
  }

  //Validación para el formulario
  public validarMateria(data: any, editar: boolean){
    console.log("Validando materia... ", data);
    let error: any = {};

    // NRC: Solo numérico, longitud fija (5 o 6 dígitos)
    if(!this.validatorService.required(data["nrc"])){
      error["nrc"] = this.errorService.required;
    } else if(!this.validatorService.numeric(data["nrc"])){
      error["nrc"] = this.errorService.numeric;
    } else if(!this.validatorService.min(data["nrc"], 5)){
      error["nrc"] = this.errorService.min(5);
    } else if(!this.validatorService.max(data["nrc"], 6)){
      error["nrc"] = this.errorService.max(6);
    }

    // Nombre de la materia: Solo letras y espacios
    if(!this.validatorService.required(data["nombre_materia"])){
      error["nombre_materia"] = this.errorService.required;
    } else if(!this.validatorService.words(data["nombre_materia"])){
      error["nombre_materia"] = "Solo se permiten letras y espacios";
    }

    // Sección: Solo numérico, máximo 3 dígitos
    if(!this.validatorService.required(data["seccion"])){
      error["seccion"] = this.errorService.required;
    } else if(!this.validatorService.numeric(data["seccion"])){
      error["seccion"] = this.errorService.numeric;
    } else if(!this.validatorService.max(data["seccion"], 3)){
      error["seccion"] = this.errorService.max(3);
    }

    // Días de la semana: Al menos uno debe estar seleccionado
    if(!data["dias_semana"] || data["dias_semana"].length === 0){
      error["dias_semana"] = "Debe seleccionar al menos un día";
    }

    // Hora inicio
    if(!this.validatorService.required(data["hora_inicio"])){
      error["hora_inicio"] = this.errorService.required;
    }

    // Hora fin
    if(!this.validatorService.required(data["hora_fin"])){
      error["hora_fin"] = this.errorService.required;
    }

    // Validar que hora_inicio < hora_fin
    if(data["hora_inicio"] && data["hora_fin"]){
      if(data["hora_inicio"] >= data["hora_fin"]){
        error["hora_fin"] = "La hora de finalización debe ser mayor que la hora de inicio";
      }
    }

    // Salón: Alfanumérico y espacios, máximo 15 caracteres
    if(!this.validatorService.required(data["salon"])){
      error["salon"] = this.errorService.required;
    } else if(!this.validatorService.max(data["salon"], 15)){
      error["salon"] = this.errorService.max(15);
    }

    // Programa educativo
    if(!this.validatorService.required(data["programa_educativo"])){
      error["programa_educativo"] = this.errorService.required;
    }

    // Profesor asignado
    if(!this.validatorService.required(data["profesor_asignado_id"])){
      error["profesor_asignado_id"] = this.errorService.required;
    }

    // Créditos: Enteros positivos, máximo 2 dígitos (valor máximo 99)
    const creditosStr = String(data["creditos"] || '').trim();
    if(!this.validatorService.required(creditosStr)){
      error["creditos"] = this.errorService.required;
    } else if(!this.validatorService.numeric(creditosStr)){
      error["creditos"] = this.errorService.numeric;
    } else {
      const creditosNum = parseInt(creditosStr);
      if(creditosNum <= 0){
        error["creditos"] = "Los créditos deben ser un número positivo";
      } else if(creditosNum > 99){
        error["creditos"] = "Los créditos no pueden ser mayores a 99";
      } else if(creditosStr.length > 2){
        error["creditos"] = this.errorService.max(2);
      }
    }

    return error;
  }

  //Aquí van los servicios HTTP
  //Servicio para registrar una nueva materia
  public registrarMateria (data: any): Observable <any>{
    const token = this.facadeService.getSessionToken();
    let headers: HttpHeaders;
    if (token) {
      headers = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token });
    } else {
      headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    }
    return this.http.post<any>(`${environment.url_api}/materias/`, data, { headers });
  }

  //Servicio para obtener la lista de materias
  public obtenerListaMaterias(): Observable<any>{
    const token = this.facadeService.getSessionToken();
    let headers: HttpHeaders;
    if (token) {
      headers = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token });
    } else {
      headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    }
    return this.http.get<any>(`${environment.url_api}/lista-materias/`, { headers });
  }

  //Servicio para obtener una materia por su ID
  public obtenerMateriaPorID(idMateria: number): Observable<any> {
    const token = this.facadeService.getSessionToken();
    let headers: HttpHeaders;
    if (token) {
      headers = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token });
    } else {
      headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    }
    return this.http.get<any>(`${environment.url_api}/materias/?id=${idMateria}`, { headers });
  }

  //Servicio para actualizar una materia
  public actualizarMateria(data: any): Observable<any> {
    const token = this.facadeService.getSessionToken();
    let headers: HttpHeaders;
    if (token) {
      headers = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token });
    } else {
      headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    }
    return this.http.put<any>(`${environment.url_api}/materias/`, data, { headers });
  }

  //Servicio para eliminar una materia
  public eliminarMateria(idMateria: number): Observable<any>{
    const token = this.facadeService.getSessionToken();
    let headers: HttpHeaders;
    if (token) {
      headers = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token });
    } else {
      headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    }
    return this.http.delete<any>(`${environment.url_api}/materias/?id=${idMateria}`, { headers });
  }

  //Servicio para obtener el total de materias y estadísticas
  public getTotalMaterias(): Observable<any>{
    const token = this.facadeService.getSessionToken();
    let headers: HttpHeaders;
    if (token) {
      headers = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token });
    } else {
      headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    }
    return this.http.get<any>(`${environment.url_api}/total-materias/`, { headers });
  }
}

