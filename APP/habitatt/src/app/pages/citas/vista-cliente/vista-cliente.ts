import { Component, computed, input, output, signal, inject } from '@angular/core';
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
    MatInputModule,
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

  bloquesHorarios = ['08:00', '09:00', '10:00', '11:00', '13:00', '14:00', '15:00', '16:00'];
  citasDelProfesional = signal<Cita[]>([]);
  cargandoHorarios = signal(false);

  nuevaFecha = signal<Date | null>(null);
  horaNueva = signal<string | null>(null);

  descripcionControl = new FormControl('');
  mostrarPopover = signal<boolean>(false);
  descripcionNueva = '';

  horasOcupadas = computed(() => {
    const citas = this.citasDelProfesional();
    const targetDate = this.nuevaFecha();
    const citaActual = this.cita();
    if (!targetDate || citas.length === 0) return [];
    const fechaTargetStr = new Date(targetDate).toISOString().split('T')[0];
    return citas.filter(c => {if (citaActual && c.id === citaActual.id) return false;
        const fechaCitaStr = new Date(c.fecha).toISOString().split('T')[0];
        return fechaCitaStr === fechaTargetStr;
      }).map(c => {if (typeof c.hora === 'string' && c.hora.includes(':')) {return c.hora.slice(0, 5);}
        const dateObj = new Date(c.fecha);
        const h = dateObj.getHours().toString().padStart(2, '0');
        const m = dateObj.getMinutes().toString().padStart(2, '0');
        return `${h}:${m}`;
      });
  });

  onCancelarCita() {
    const citaActual = this.cita();
    if (!citaActual) { console.warn('No hay una cita activa para cancelar.');
      return; }
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {width: '400px',
      data: { titulo: 'Confirmar cancelación', mensaje: '¿Estás seguro de que deseas cancelar esta cita?'},
    });
    dialogRef.afterClosed().subscribe((confirmado: boolean) => {
      this.noti.warning('Cita cancelada exitosamente');
      if (confirmado) {this.cambiarEstado(citaActual, Status.CANCELLED);}
    });
  }
  onAceptarCita() {
    const citaActual = this.cita();
    if (!citaActual) { console.warn('No hay una cita activa para cancelar.');
      return; }
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {width: '400px',
      data: { titulo: 'Aceptar cita', mensaje: '¿Estás seguro de que deseas confirmar esta cita?'},
    });
    dialogRef.afterClosed().subscribe((confirmado: boolean) => {
      this.noti.success('Cita confirmada correctamente');
      if (confirmado) {this.cambiarEstado(citaActual, Status.CONFIRMED);}
    });
  }
  onFechaReagendada(nuevaFecha: Date | null): void {
    if (!nuevaFecha) return;
    this.nuevaFecha.set(nuevaFecha);
    this.horaNueva.set(null);
  }
  seleccionarHora(hora: string): void {
    if (this.horasOcupadas().includes(hora)) return;
    this.horaNueva.set(hora);
  }
  togglePopover() { this.mostrarPopover.update(v => !v); }
  cerrarPopover() { 
    const valorNuevo = this.descripcionControl.value?.trim() || '';
    if(this.cita()?.descripcion !== valorNuevo){
      this.descripcionNueva = valorNuevo;
  }this.mostrarPopover.set(false);}

  botonActualizar() {
    const citaActual = this.cita();
    const userId = this.usuario?.id;
    if (!citaActual) return;
    if (!userId) {
      console.error('No se pudo determinar el usuario actual');
      return;
    }
    this.cambiarEstado(citaActual, Status.RESCHEDULED);
    this.actualizarCita(
      citaActual,
      this.descripcionNueva || citaActual.descripcion,
      this.nuevaFecha() || citaActual.fecha,
      this.horaNueva() || citaActual.hora
    );
  }

  onCompletarCita() {
    const citaActual = this.cita();
    if (!citaActual) { console.warn('No hay una cita activa para completar.');
      return; }
    const hoy = new Date();
    const fechaCita = new Date(citaActual.fecha);

    if (hoy < fechaCita) {
    this.dialog.open(ConfirmDialogComponent, { width: '400px',
      data: { titulo: 'Acción no permitida', mensaje: 'No se puede marcar como completada una cita cuya fecha aún no ha transcurrido.' }
    });
    return;
  }

    const dialogRef = this.dialog.open(ConfirmDialogComponent, {width: '400px',
      data: { titulo: 'Completar cita', mensaje: '¿Estás seguro de que deseas marcar esta cita como completada?'},
    });
    dialogRef.afterClosed().subscribe((confirmado: boolean) => {
      this.noti.success('Cita completada correctamente');
      if (confirmado) {this.cambiarEstado(citaActual, Status.COMPLETED);}
    });
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
        this.cargarCitasProfesional(response.data.profesionalId);
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
  private cargarCitasProfesional(profesionalId: number): void {
    this.cargandoHorarios.set(true);
    this.citaService.getByProfessional(profesionalId).subscribe({
      next: (response) => {
        this.citasDelProfesional.set(response.data || []);
        this.cargandoHorarios.set(false);
      },
      error: () => this.cargandoHorarios.set(false)
    });
  }
  private cargarNombreProfesional(id: number): void{
    this.profService.obtenerPorId(id).subscribe({
      next: (response) => {this.nombreProfesional.set(`${response.data.nombre} ${response.data.apellido}`);}
    })
  }
  private cargarNombrecliente(id: number): void{
    this.usuarioService.obtenerPorId(id).subscribe({
      next: (response) => {this.nombreCliente.set(`${response.data.nombre} ${response.data.apellido}`);}
    })
  }
  private cargarNombreServicio(id: number): void{
    this.servService.obtenerPorId(id).subscribe({
      next: (response) => {this.nombreServicio.set(response.data.nombre);}
    })
  }
  private cargarNombreModality(id: string): void {
    this.modService.listar().subscribe({
      next: (response) => {
        const lista = response.data || [];
        const mod = lista.find((m: Modality) => m.value.toLowerCase() === id.toLowerCase());
        if (mod) this.nombreModalidad.set(mod.label);
      }
    });
  }
  private cargarNombreEstado(id: string): void {
    this.statusService.listar().subscribe({
      next: (response) => {
        const lista = response.data || [];
        const est = lista.find((e: Estado) => e.value.toLowerCase() === id.toString().toLowerCase());
        if (est) this.estado.set(est);
      }
    });
  }
  
  cambiarEstado(cita: Cita, status: Status): void {
    const userId = this.usuario?.id;
    if (!userId) { console.error('No se pudo determinar el usuario actual'); return; }
    const datosActualizados: Partial<updateCitaDto> = { status: status };
    this.citaService.actualizar(cita.id, datosActualizados, userId, "Cambio de estado").subscribe({
      next: () => {
        cita.status = status;
        if (this.usuario?.role === 'PROFESIONAL') { this.router.navigate(['/citasProfesional']);
        } else if (this.usuario?.role === 'USER') { this.router.navigate(['/citas']); }
      },
      error: (err) => console.error('Error al actualizar estado:', err)
    });
  }

  actualizarCita(cita: Cita, descripcion?: string, nuevaFecha?: Date, nuevaHora?: string): void {
    const userId = this.usuario?.id;
    if (!userId) { console.error('No se encontró el ID del usuario actual'); return; }
    const datosActualizados: Partial<updateCitaDto> = {
      descripcion: descripcion || cita.descripcion,
      fecha: nuevaFecha || cita.fecha,
      hora: nuevaHora || cita.hora
    };
    this.citaService.actualizar(cita.id, datosActualizados, userId, "Reagendamiento/Actualización de cita").subscribe({
      next: () => {
        cita.descripcion = descripcion || cita.descripcion;
        cita.fecha = nuevaFecha || cita.fecha;
        cita.hora = nuevaHora || cita.hora;
        this.noti.success('Cita actualizada correctamente');
        this.router.navigate(['/citas']);
      },
      error: (err) => console.error('Error al actualizar cita:', err)
    });
  }
     
}
