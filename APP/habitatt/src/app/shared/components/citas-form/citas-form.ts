import { MatSelectModule } from '@angular/material/select'
import { MatCheckboxModule } from '@angular/material/checkbox'
import { Component, computed, input, output, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common'
import { FormField, form, required, min, minLength, maxLength, pattern, max, validate, minDate } from '@angular/forms/signals';
import { MatCardModule } from '@angular/material/card'
import { MatFormFieldModule } from '@angular/material/form-field'
import { MatInputModule } from '@angular/material/input'
import { MatButtonModule } from '@angular/material/button'
import { MatIconModule } from '@angular/material/icon'
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner'
import { effect } from '@angular/core'
import { Cita, citaFormModel, createCitaDto, updateCitaDto } from '../../../../core/models/cita.model';
import { ProfesionalService } from '../../../../core/services/profesional.service';
import { Servicio } from '../../../../core/models/servicio.model';
import { profesional } from '../../../../core/models/profesional.model';
import { Estado } from '../../../../core/models/estado.model';
import { Especialidad } from '../../../../core/models/especialidad.model';
import { EspecialidadService } from '../../../../core/services/especialidad.service';
import { FormsModule } from '@angular/forms';
import { ModalityService } from '../../../../core/services/modality.service';
import { Modality } from '../../../../core/models/modality.model';
import { A11yModule } from "@angular/cdk/a11y";
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ServicioService } from '../../../../core/services/servicio.service';
import { AuthService } from '../../../../core/services/auth.service'
import { CitasService } from '../../../../core/services/cita.service';
import { MatDatepicker, MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';

@Component({
  selector: 'app-citas-form',
  imports: [CommonModule,RouterLink,
    FormField,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatSelectModule,
    MatCheckboxModule,
    MatProgressSpinnerModule, 
    FormsModule, 
    A11yModule, 
    MatDatepickerModule, 
    MatNativeDateModule],
  templateUrl: './citas-form.html',
  styleUrl: './citas-form.css',
})
export class CitasForm {
  private readonly profService = inject(ProfesionalService);
  private readonly especialS = inject(EspecialidadService);
  private readonly modService = inject(ModalityService);
  private readonly servService = inject(ServicioService);
  private readonly appoService = inject(CitasService);
  private readonly route = inject(ActivatedRoute);
  readonly authService = inject(AuthService);

  citas = signal<Cita[]>([]);

  cita = input<Cita | null>(null);
  saving = input<boolean>(false);

  guardar = output<createCitaDto | updateCitaDto>();
  cancelar = output<void>();

  servicio = signal<Servicio | null>(null);
  profesional = signal<profesional | null>(null);
  estado = signal<Estado | null>(null);

  modId = signal<string | null>(null);
  especialidadId = signal<number | null>(null);
  listaEspecialidades = signal<Especialidad[] | null>(null);
  listaProfesionales = signal<profesional[] | null>(null);
  listaModalidades = signal<Modality[] | null>(null);

  bloquesHorarios = ['08:00', '09:00', '10:00', '11:00', '13:00', '14:00', '15:00', '16:00'];
  todasLasCitasDelProfesional = signal<Cita[]>([]);
  cargandoHorarios = signal(false);
  horasOcupadas = computed(() => {
    const citas = this.todasLasCitasDelProfesional();
    const fechaSeleccionada = this.citaModel().fecha;
    if (!fechaSeleccionada || citas.length === 0) return [];
    const fechaStrTarget = new Date(fechaSeleccionada).toISOString().split('T')[0];
    return citas.filter(cita => {
      const fechaCitaStr = new Date(cita.fecha).toISOString().split('T')[0];
      return fechaCitaStr === fechaStrTarget;
    }).map(cita => {if (typeof cita.hora === 'string' && cita.hora.includes(':')) {return cita.hora.slice(0, 5);}
      const dateObj = new Date(cita.fecha);
      const h = dateObj.getHours().toString().padStart(2, '0');
      const m = dateObj.getMinutes().toString().padStart(2, '0');
      return `${h}:${m}`;
    });
  })
  onProfesionalChange(): void {const profId = this.citaModel().profesionalId;
  if (profId > 0) {
    this.cargandoHorarios.set(true);
    this.appoService.getByProfessional(profId).subscribe({
      next: (response) => {
        this.todasLasCitasDelProfesional.set(response.data);
        this.cargandoHorarios.set(false);
      },
      error: (err) => {
        console.error(err);
        this.todasLasCitasDelProfesional.set([]);
        this.cargandoHorarios.set(false);
      }
    });
  } else {
    this.todasLasCitasDelProfesional.set([]);
  }
}
seleccionarHora(hora: string): void {
  if (this.horasOcupadas().includes(hora)) return; 
  this.citaModel.update(m => ({ ...m, hora }));
  this.citaForm.hora().markAsTouched();
}
 
  citaModel = signal<citaFormModel>({
    fecha: new Date(),
    hora: '',
    modalidad: '',
    descripcion: '',
    cobro: 0,
    status: '',
    clienteId: 0,
    profesionalId: 0,
    servicioId: 0,
    nombreCliente: '',
    nombreProfesional: '',
    nombreServicio:''
  });

citaForm = form(this.citaModel, (path) => {
    required(path.profesionalId, { message: 'El profesional debe ser seleccionado de la lista' })
    min(path.profesionalId, 1, { message: 'El profesional debe ser seleccionado de la lista' })
    required(path.fecha, { message: 'La fecha debe es necesaria' })
    minDate(path.fecha, new Date(), { message: 'La fecha no puede ser anterior a hoy' })
    required(path.hora, { message: 'La hora no puede quedar en blanco' })
    pattern(path.hora, /^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/, { message: 'Formato de hora inválido' })
    required(path.modalidad, { message: 'Seleccione una modalidad de la lista' })
    required(path.descripcion, { message: 'La descripción es requerida' })
    maxLength(path.descripcion, 500, { message: 'Máximo 500 caracteres' })
  })
  especialidadInvalida = computed(() => {
  const id = this.especialidadId();
  return id === null || id === undefined || id <= 0;
});
especialidadTouched = signal(false);

  isEdit = computed(() => this.cita() !== null);
  isSubmitting = computed(() => this.saving())

constructor() {
  const idServicio = Number(this.route.snapshot.paramMap.get('id'));
  this.cargarServicio(idServicio);
  this.cargarEspecialidades();
  this.cargarTodosLosProfesionales();
  this.cargarModalidades();

    
    effect(() => { const cita = this.cita();
      if (!cita) { this.resetForm();
        return;
      }
      
      console.log("Cita a modificar:" + cita.id);
 
      this.citaModel.set({
        fecha: cita.fecha ?? new Date(),
        hora: cita.hora ?? '',
        modalidad: cita.modalidad ?? '',
        descripcion: cita.descripcion ?? '',
        cobro: cita.cobro ?? 0,
        profesionalId: cita.profesionalId ?? 0,
        status: cita.status ?? '',
        clienteId: cita.clienteId,
        servicioId: cita.servicioId,
        nombreCliente: cita.nombreCliente ?? 'Cargando...',
        nombreProfesional: cita.nombreProfesional ?? 'Cargando...',
        nombreServicio: cita.nombreServicio ?? 'Cargando...'
      });
  });
}
private resetForm() {
    this.citaModel.set({
    fecha: new Date(),
    hora: '',
    modalidad: '',
    descripcion: '',
    status: '',
    clienteId: 0,
    profesionalId: 0,
    servicioId: 0,
    cobro: 0,

    nombreCliente: '',
    nombreProfesional: '',
    nombreServicio: ''
    })
  }

  submit() {
    if (this.isSubmitting()) return
    this.marcarCamposComoTocados()
    if (this.formularioInvalido()) return;
    this.emitirGuardar();
  }
  private emitirGuardar() {
    const dto = this.buildDto()
    console.log('JSON enviado al API:', dto)
    this.guardar.emit(dto)
  }

  private marcarCamposComoTocados() {
    this.citaForm.fecha().markAsTouched()
    this.citaForm.hora().markAsTouched()
    this.citaForm.descripcion().markAsTouched()
    this.citaForm.clienteId().markAsTouched()
    this.citaForm.profesionalId().markAsTouched()
    this.citaForm.modalidad().markAsTouched()
  }
  private formularioInvalido(): boolean {
    this.especialidadTouched.set(true);
    return (
      this.citaForm.fecha().invalid() ||
      this.citaForm.hora().invalid() ||
      this.citaForm.descripcion().invalid() ||
      this.citaForm.clienteId().invalid() ||
      this.citaForm.profesionalId().invalid() ||
      this.citaForm.modalidad().invalid() ||
      this.especialidadInvalida()
    );
  }
private buildDto(): createCitaDto | updateCitaDto {
    const value = this.citaModel()
    return {
      fecha: value.fecha,
      hora: value.hora.trim(),
      descripcion: value.descripcion.trim(),
      modalidad: value.modalidad.trim(),
      cobro: Number(this.servicio()?.precio || 0),
      status: 'PENDING',
      clienteId: Number(this.authService.usuario()?.id || 1),
      profesionalId: Number(value.profesionalId),
      servicioId: this.servicio()?.id || 1,
    }
  }

  private cargarModalidades(): void {
    this.modService.listar().subscribe({
      next: (response) => this.listaModalidades.set(response.data || [])
    });
  }

  private cargarEspecialidades(): void {
  this.especialS.listar().subscribe({
    next: (response) => {
      const activas = (response.data || []).filter((esp) => esp.isActive);
      this.listaEspecialidades.set(activas);
    }
  });
}

  private cargarTodosLosProfesionales(): void {
    this.profService.listar().subscribe({
      next: (response) => this.listaProfesionales.set(response.data || [])
    });
  }

  private cargarServicio(id: number): void {
    this.servService.obtenerPorId(id).subscribe({
      next: (response) => this.servicio.set(response.data || null)
    });
  }

  profesionalesFiltrados = computed(() => {
    const spcId = this.especialidadId();
    const profes = this.listaProfesionales();

    if (!spcId || !profes) return [];
    return profes.filter(profe => profe.especialidades?.some((esp:any) => esp.id === spcId));
  })
}
