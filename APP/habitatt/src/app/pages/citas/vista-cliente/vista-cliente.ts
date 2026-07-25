import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Router } from '@angular/router';
import { UsuarioService } from '../../../../core/services/usuario.service';
import { CitasService } from '../../../../core/services/cita.service';
import { Cita, updateCitaDto } from '../../../../core/models/cita.model';
import { ServicioService } from '../../../../core/services/servicio.service';
import { ModalityService } from '../../../../core/services/modality.service';
import { ProfesionalService } from '../../../../core/services/profesional.service';
import { StatusService } from '../../../../core/services/estado.service';
import { Servicio } from '../../../../core/models/servicio.model';
import { Modality } from '../../../../core/models/modality.model';
import { profesional } from '../../../../core/models/profesional.model';
import { Estado, Status } from '../../../../core/models/estado.model';
import { AuthService } from '../../../../core/services/auth.service'
import { NotificationService } from '../../../../core/services/notification.service'
import { MatDivider } from "@angular/material/divider";
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatTooltipModule } from '@angular/material/tooltip';
import {ConfirmDialogComponent} from '../DialogConfirmation';
import { MatDialog } from '@angular/material/dialog';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { OverlayModule } from '@angular/cdk/overlay';

@Component({
  selector: 'app-vista-cliente',
  imports: [RouterLink,
    MatButtonModule,
    MatCardModule,
    OverlayModule,
    MatChipsModule,
    MatIconModule,
    MatProgressSpinnerModule,
    CommonModule,
    MatDivider,
    MatDatepickerModule, 
    MatTooltipModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    MatInputModule
  ],
  templateUrl: './vista-cliente.html',
  styleUrl: './vista-cliente.css',
})
export class VistaCliente {
  private readonly dialog = inject(MatDialog);
  noti = inject(NotificationService)
  private readonly authService = inject(AuthService)
  private readonly router = inject(Router);
  readonly usuario = this.authService.usuario()
  private readonly route = inject(ActivatedRoute);
  private readonly citaService = inject(CitasService);
  private readonly servService = inject(ServicioService);
  private readonly usuarioService = inject(UsuarioService);
  private readonly modService = inject(ModalityService);
  private readonly profService = inject(ProfesionalService);
  private readonly statusService = inject(StatusService);

  cita = signal<Cita | null>(null);
  loading = signal(false);
  error = signal<string | null>(null);

  servicio = signal<Servicio | null>(null);
  modality = signal<Modality | null> (null);
  profesional = signal<profesional | null>(null);
  estado = signal<Estado | null>(null);

  nombreProfesional = signal<string>('Cargando profesional...');
  nombreServicio = signal<string>('Cargando servicio...');
  nombreCliente = signal<string>('Nombre Cliente en carga...')
  nombreModalidad = signal<string>('Modalidad en carga...')
  nuevaFecha = signal<Date | null>(null);
  descripcionControl = new FormControl('');
  mostrarPopover = signal<boolean>(false);
  descripcionNueva = '';

  onCancelarCita() {
    const citaActual = this.cita();
    if (!citaActual) { console.warn('No hay una cita activa para cancelar.');
      return; }
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {width: '400px',
      data: { titulo: 'Confirmar cancelación', mensaje: '¿Estás seguro de que deseas cancelar esta cita?'},
    });
    dialogRef.afterClosed().subscribe((confirmado: boolean) => {
      if (confirmado) {this.cambiarEstado(citaActual, Status.CANCELLED);}
    });
  }
  onFechaReagendada(nuevaFecha: Date | null) {
    if (!nuevaFecha) return;
    this.nuevaFecha.set(nuevaFecha);
    console.log('Nueva fecha seleccionada para reagendar:', nuevaFecha);
  }
  togglePopover() { this.mostrarPopover.update(v => !v); }
  cerrarPopover() { 
    const valorNuevo = this.descripcionControl.value?.trim() || '';
    if(this.cita()?.descripcion !== valorNuevo){
      this.descripcionNueva = valorNuevo;
  }this.mostrarPopover.set(false);}
  botonActualizar(){
    this.actualizarCita(this.cita()!, this.descripcionNueva, this.nuevaFecha() || this.cita()?.fecha);
  }
ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.loadCita(id);
  }

  loadCita(id: number): void {
    this.loading.set(true);
    this.error.set(null);
    this.citaService.obtenerPorId(id).subscribe({
      next: (response) => {
        this.cita.set(response.data);
        this.loading.set(false);
        console.log(response.data)
        this.cargarNombreProfesional(response.data.profesionalId);
        this.cargarNombreServicio(response.data.servicioId);
        this.cargarNombrecliente(response.data.clienteId);
        this.cargarNombreModality(response.data.modalidad);
        this.cargarNombreEstado(response.data.status);
        if(this.cita()?.descripcion !== null && this.cita()?.descripcion !== undefined){
          const desc = this.cita()?.descripcion || '';
          this.descripcionControl.setValue(desc);
        }
      },
      error: () => {
        this.error.set('Error al encontrar cita: ' + id);
        this.loading.set(false);
      },
    });
  }
  private cargarNombreProfesional(id: number): void{
    this.profService.obtenerPorId(id).subscribe({
      next: (response) => {
        const nombre = response.data.nombre+ " " + response.data.apellido;
          this.nombreProfesional.set(nombre);
      }
    })
  }
  private cargarNombrecliente(id: number): void{
    this.usuarioService.obtenerPorId(id).subscribe({
      next: (response) => {
        const nombre = response.data.nombre + " " + response.data.apellido;
          this.nombreCliente.set(nombre);
      }
    })
  }
  private cargarNombreServicio(id: number): void{
    this.servService.obtenerPorId(id).subscribe({
      next: (response) => {
        const nombre = response.data.nombre;
          this.nombreServicio.set(nombre);
      }
    })
  }
  private cargarNombreModality(id: string): void{
    this.modService.listar().subscribe({
      next: (response) => {
        const lista = response.data || [];
        const modalidadEncontrada = lista.find((mod: Modality) => mod.value.toLowerCase() === id.toLowerCase());
        console.log("Modalidades: " + modalidadEncontrada?.value);
          if(modalidadEncontrada){
            this.nombreModalidad.set(modalidadEncontrada.label);
          }
        }
    })
  }
  private cargarNombreEstado(id: string): void{
    this.statusService.listar().subscribe({
      next: (response) => {
        const lista = response.data || [];
        const estadoEncontrado = lista.find((est: Estado) => est.value.toLowerCase() === id.toString().toLowerCase());
        console.log("Estados: " + estadoEncontrado?.value);
          if(estadoEncontrado){
            this.estado.set(estadoEncontrado);
          }
        }
    })}
    cambiarEstado(cita: Cita, status: Status): void {
        const datosActualizados: Partial<updateCitaDto> = { status: status };
        this.citaService.actualizar(cita.id, datosActualizados).subscribe({
            next: () => {cita.status = status;
              this.router.navigate(['/citas']);
            }, error: (err) => console.error('Error al actualizar:', err) });
      }
    actualizarCita(cita: Cita, descripcion?: string, nuevaFecha?: Date): void {
      const datosActualizados: Partial<updateCitaDto> = {descripcion: descripcion || cita.descripcion, fecha: nuevaFecha || cita.fecha};
      this.citaService.actualizar(cita.id, datosActualizados).subscribe({
          next: () => {
            cita.descripcion = descripcion || cita.descripcion;
            cita.fecha = nuevaFecha || cita.fecha;
            this.noti.success('Cita actualizada correctamente');
            this.router.navigate(['/citas']);
          },
          error: (err) => console.error('Error al actualizar:', err)
      });
    }  
}
