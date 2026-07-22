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
import { usuario } from '../../../../core/models/usuario.model';
import { Servicio } from '../../../../core/models/servicio.model';
import { profesional } from '../../../../core/models/profesional.model';
import { Estado } from '../../../../core/models/estado.model';
import { especialidad } from '../../../../core/models/especialidad.model';
import { EspecialidadService } from '../../../../core/services/especialidad.service';
import { FormsModule } from '@angular/forms';
import { UsuarioService } from '../../../../core/services/usuario.service';
import { ModalityService } from '../../../../core/services/modality.service';
import { Modality } from '../../../../core/models/modality.model';
import { A11yModule } from "@angular/cdk/a11y";

@Component({
  selector: 'app-citas-form',
  imports: [CommonModule,
    FormField,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatSelectModule,
    MatCheckboxModule,
    MatProgressSpinnerModule, FormsModule, A11yModule],
  templateUrl: './citas-form.html',
  styleUrl: './citas-form.css',
})
export class CitasForm {
  private readonly profService = inject(ProfesionalService);
  private readonly especialS = inject(EspecialidadService);
  private readonly clientsService = inject(UsuarioService);
  private readonly modService = inject(ModalityService);

  citas = signal<Cita[]>([]);

  cita = input<Cita | null>(null);
  saving = input<boolean>(false);

  guardar = output<createCitaDto | updateCitaDto>();
  cancelar = output<void>();

  usuario = signal<usuario | null> (null);
  servicio = signal<Servicio | null>(null);
  profesional = signal<profesional | null>(null);
  estado = signal<Estado | null>(null);

  modId = signal<string | null>(null);
  especialidadId = signal<number | null>(null);
  listaEspecialidades = signal<especialidad[] | null>(null);
  listaProfesionales = signal<profesional[] | null>(null);
  listaClientes = signal<usuario[] | null>(null);
  listaModalidades = signal<Modality[] | null>(null);

  citaModel = signal<citaFormModel>({
    fecha: new Date(),
    hora: '',
    modalidad: '',
    descripcion: '',
    status: '',
    clienteId: 0,
    profesionalId: 0,
    servicioId: 0,
    nombreCliente: '',
    nombreProfesional: '',
    nombreServicio:''
  });

citaForm = form(this.citaModel, (path) => {
    required(path.clienteId, { message: 'Debe Seleccionar un cliente de la lista' })
    min(path.clienteId, 1, { message: 'Debe Seleccionar un cliente de la lista' })
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
  this.cargarEspecialidades();
  this.cargarTodosLosProfesionales();
  this.cargarTodosLosClientes();
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
      status: 'PENDING',
      clienteId: Number(value.clienteId),
      profesionalId: Number(value.profesionalId),
      servicioId: Number(1),
    }
  }

  private cargarModalidades(): void {
    this.modService.listar().subscribe({
      next: (response) => this.listaModalidades.set(response.data || [])
    });
  }

  private cargarTodosLosClientes(): void {
    this.clientsService.listar().subscribe({
      next: (response) => this.listaClientes.set(response.data || [])
    });
  }

  private cargarEspecialidades(): void{
    this.especialS.listar().subscribe({
      next: (response) =>
        this.listaEspecialidades.set(response.data || [])
    })
  }

  private cargarTodosLosProfesionales(): void {
    this.profService.listar().subscribe({
      next: (response) => this.listaProfesionales.set(response.data || [])
    });
  }

  profesionalesFiltrados = computed(() => {
    const spcId = this.especialidadId();
    const profes = this.listaProfesionales();

    if (!spcId || !profes) return [];
    return profes.filter(profe => profe.especialidades?.some((esp:any) => esp.id === spcId));
  })
}
