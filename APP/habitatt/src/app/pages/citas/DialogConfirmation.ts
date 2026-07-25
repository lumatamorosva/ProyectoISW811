import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';

export interface ConfirmDialogData { titulo: string; mensaje: string; }

@Component({
  selector: 'app-confirm-dialog',
  imports: [MatDialogModule, MatButtonModule],
  template: ` <h2 mat-dialog-title>{{ data.titulo }}</h2>
    <mat-dialog-content> <p>{{ data.mensaje }}</p> </mat-dialog-content>
    <mat-dialog-actions align="end"> <button mat-button (click)="cancelar()">Mantener Cita</button>
        <button mat-flat-button color="warn" (click)="confirmar()">Confirmar Cancelación</button>
    </mat-dialog-actions> `
})
export class ConfirmDialogComponent {
  readonly dialogRef = inject(MatDialogRef<ConfirmDialogComponent>);
  readonly data = inject<ConfirmDialogData>(MAT_DIALOG_DATA);

  confirmar() {
    this.dialogRef.close(true);
  }

  cancelar() {
    this.dialogRef.close(false);
  }
}