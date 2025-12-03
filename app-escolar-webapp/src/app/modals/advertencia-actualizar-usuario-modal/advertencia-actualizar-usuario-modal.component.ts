import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-advertencia-actualizar-usuario-modal',
  templateUrl: './advertencia-actualizar-usuario-modal.component.html',
  styleUrls: ['./advertencia-actualizar-usuario-modal.component.scss']
})
export class AdvertenciaActualizarUsuarioModalComponent implements OnInit {

  constructor(
    private dialogRef: MatDialogRef<AdvertenciaActualizarUsuarioModalComponent>,
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
