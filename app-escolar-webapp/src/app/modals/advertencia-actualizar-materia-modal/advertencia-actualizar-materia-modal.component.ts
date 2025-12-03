import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-advertencia-actualizar-materia-modal',
  templateUrl: './advertencia-actualizar-materia-modal.component.html',
  styleUrls: ['./advertencia-actualizar-materia-modal.component.scss']
})
export class AdvertenciaActualizarMateriaModalComponent implements OnInit {

  constructor(
    private dialogRef: MatDialogRef<AdvertenciaActualizarMateriaModalComponent>,
    @Inject (MAT_DIALOG_DATA) public data: any
  ) { }

  ngOnInit(): void {
  }

  public cerrar_modal(){
    this.dialogRef.close({confirm:false});
  }

  public confirmarActualizacion(){
    this.dialogRef.close({confirm:true});
  }
}

