import { MatSelectModule } from '@angular/material/select'
import { MatCheckboxModule } from '@angular/material/checkbox'
import { Component, computed, input, output, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common'
import { FormField, form, required, min, minLength, maxLength, pattern, validate } from '@angular/forms/signals';
import { CategoriaService } from '../../../../core/services/categoria.service'
import { MatCardModule } from '@angular/material/card'
import { MatFormFieldModule } from '@angular/material/form-field'
import { MatInputModule } from '@angular/material/input'
import { MatButtonModule } from '@angular/material/button'
import { MatIconModule } from '@angular/material/icon'
import { categoria } from '../../../../core/models/categoria.model'
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner'
import { effect } from '@angular/core'
import { Servicio, ServicioUpdateDto, ServicioCreateDto, ServicioFormModel } from '../../../../core/models/servicio.model';
import { ModalityService } from '../../../../core/services/modality.service';
import { Modality } from '../../../../core/models/modality.model';
import { ProfesionalService } from '../../../../core/services/profesional.service';
import { profesional } from '../../../../core/models/profesional.model';
@Component({
  selector: 'app-servicio-form',
  standalone: true,
  imports: [
    CommonModule,
    FormField,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatSelectModule,
    MatCheckboxModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './servicios-form.html',
  styleUrl: './servicios-form.css'
})

export class ServiciosForm {
  private readonly catServ = inject(CategoriaService);
  private readonly modServ = inject(ModalityService);
  private readonly profService = inject(ProfesionalService);

  service = input<Servicio | null>(null);
  saving = input<boolean>(false);
  categoria = input<categoria | null>(null)
  categorias = signal<categoria[] | null>(null)
  mods = signal<Modality[] | null>(null)
  profesionals = signal<profesional[] | null> (null)

  guardar = output<ServicioCreateDto | ServicioUpdateDto>();
  cancelar = output<void>();

  serviceModel = signal<ServicioFormModel>({
    nombre: '',
    descripcion: '',
    precio: 0,
    duracionMinutos: 0,
    modality: 'MIXTA',
    isActive: true,
    categoriaId: 0,
    profesionalId: 0,
  });

serviceForm = form(this.serviceModel, (path) => {
    required(path.nombre, { message: 'El nombre es obligatorio' })
    minLength(path.nombre, 3, { message: 'Mínimo 3 caracteres' })
    maxLength(path.nombre, 120, { message: 'Máximo 120 caracteres' })
    pattern(path.nombre, /^[a-zA-ZÁÉÍÓÚáéíóúÑñ0-9\s:'\-&.]+$/, { message: 'El nombre solo puede contener letras, números, espacios y signos básicos' })
    required(path.descripcion, { message: 'La descripción es obligatoria' })
    minLength(path.descripcion, 20, { message: 'La descripción debe tener mínimo 20 caracteres' })
    maxLength(path.descripcion, 500, { message: 'Máximo 500 caracteres' })
    required(path.precio, { message: 'El precio es obligatorio' })
    min(path.precio, 1, { message: 'El precio debe ser mayor a 0' })
    required(path.duracionMinutos, {  message: 'El tiempo inicial es obligatorio'  })
    min(path.duracionMinutos, 1, { message: 'El tiempo inicial no puede ser negativo' })
    required(path.categoriaId, { message: 'Seleccione una categoría' })
    min(path.categoriaId, 1, {message: 'Debe seleccionar una categoría de la lista'})
    required(path.profesionalId, { message: 'Seleccione un profesional' })
    min(path.profesionalId, 1, {message: 'Debe seleccionar un profesional de la lista'})
  })

  isEdit = computed(() => this.service() !== null);
  isSubmitting = computed(() => this.saving())

constructor() {
  this.obtenerCats(),
  this.obtenerModalities(),
  this.obtenerProfesionales(),
    effect(() => { const service = this.service()
      if (!service) { this.resetForm()
        return
      }
      this.serviceModel.set({
        nombre: service.nombre ?? '',
        descripcion: service.descripcion ?? '',
        duracionMinutos: service.duracionMinutoss ?? true,
        precio: Number(service.precio ?? 0),
        isActive: service.isActive ?? 0,
        modality: service.modality,
        categoriaId: service.categoriaId ?? null,
        profesionalId: service.profesionalId,
      })
    })
  }
private resetForm() {
    this.serviceModel.set({
      nombre: '',
      descripcion: '',
      duracionMinutos: 0,
      precio: 0,
      isActive: true,
      categoriaId: 0,
      profesionalId: 0,
      modality: 'MIXTA',
    })
  }
submit() {
    if (this.isSubmitting()) return
    this.marcarCamposComoTocados()
    if (this.formularioInvalido()) return
    //const file = this.selectedImageFile() if (file) { this.subirImagenYGuardar(file) return }
    this.emitirGuardar()
  }
private emitirGuardar() {
    const dto = this.buildDto()
    console.log('JSON enviado al API:', dto)
    this.guardar.emit(dto)
  }


  private marcarCamposComoTocados() {
    this.serviceForm.nombre().markAsTouched()
    this.serviceForm.descripcion().markAsTouched()
    this.serviceForm.precio().markAsTouched()
    this.serviceForm.duracionMinutos().markAsTouched()
    this.serviceForm.categoriaId().markAsTouched()
    this.serviceForm.profesionalId().markAsTouched()
  }
  private formularioInvalido(): boolean {
    return (
      this.serviceForm.nombre().invalid() ||
      this.serviceForm.descripcion().invalid() ||
      this.serviceForm.precio().invalid() ||
      this.serviceForm.duracionMinutos().invalid() ||
      this.serviceForm.categoriaId().invalid() ||
      this.serviceForm.profesionalId().invalid()
    );
  }
private buildDto(): ServicioCreateDto | ServicioUpdateDto {
    const value = this.serviceModel()
    return {
      nombre: value.nombre.trim(),
      descripcion: value.descripcion.trim(),
      precio: Number(value.precio),
      duracionMinutos: Number(value.duracionMinutos),
      isActive: value.isActive,
      categoriaId: Number(value.categoriaId),
      profesionalId: Number(value.profesionalId),
      modality: value.modality,
    }
  }

  private obtenerCats(): void {
   this.catServ.listar().subscribe({
      next: (response) => {
        this.categorias.set(response.data);
      }
  })}
  private obtenerModalities(): void{
    this.modServ.listar().subscribe({
      next: (response) => {
        this.mods.set(response.data);
      }
    })
  }
  private obtenerProfesionales(): void{
    this.profService.listar().subscribe({
      next: (response) => {
        this.profesionals.set(response.data);
      }
    })
  }
}