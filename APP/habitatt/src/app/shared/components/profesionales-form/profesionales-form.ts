import { MatSelectModule } from '@angular/material/select'
import { MatCheckboxModule } from '@angular/material/checkbox'
import { Component, computed, input, output, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common'
import { FormField, form, required, min, minLength, maxLength, pattern, max, validate } from '@angular/forms/signals';
import { MatCardModule } from '@angular/material/card'
import { MatFormFieldModule } from '@angular/material/form-field'
import { MatInputModule } from '@angular/material/input'
import { MatButtonModule } from '@angular/material/button'
import { MatIconModule } from '@angular/material/icon'
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner'
import { effect } from '@angular/core'
import { ProfesionalFormModel, profesional, ProfesionaCreateDto, ProfesionalUpdateDto } from '../../../../core/models/profesional.model';
import { ProfesionalService } from '../../../../core/services/profesional.service';
import { ImageService } from '../../../../core/services/image.service';
import { ModalityService } from '../../../../core/services/modality.service';
import { Modality } from '../../../../core/models/modality.model';

@Component({
  selector: 'app-profesionales-form',
  imports: [CommonModule,
    FormField,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatSelectModule,
    MatCheckboxModule,
    MatProgressSpinnerModule],
  templateUrl: './profesionales-form.html',
  styleUrl: './profesionales-form.css',
})
export class ProfesionalesForm {
  private readonly profService = inject(ProfesionalService);
  private readonly imageService = inject(ImageService);
  private readonly modServ = inject(ModalityService);

  uploadingImage = signal(false)
  imagePreview = signal<string | null>(null)
  selectedImageFile = signal<File | null>(null)
  mods = signal<Modality[] | null>(null)

  profesional = input<profesional | null>(null);
  saving = input<boolean>(false);

  guardar = output<ProfesionaCreateDto | ProfesionalUpdateDto>();
  cancelar = output<void>();

  profesionalModel = signal<ProfesionalFormModel>({
    nombre: '',
    apellido: '',
    email: '',
    telefono: '',
    titulo: '',
    expAnnos: 0,
    modalidad: 'MIXTA',
    ubicacion: '',
    tarifaBase: 0,
    isActive: true,
    isAvailable: true,
    foto: '',
  });

profesionalForm = form(this.profesionalModel, (path) => {
    required(path.nombre, { message: 'El nombre es obligatorio' })
    minLength(path.nombre, 3, { message: 'Mínimo 3 caracteres' })
    maxLength(path.nombre, 120, { message: 'Máximo 120 caracteres' })
    pattern(path.nombre, /^[a-zA-ZÁÉÍÓÚáéíóúÑñ0-9\s:'\-&.]+$/, { message: 'El nombre solo puede contener letras, números, espacios y signos básicos' })
    required(path.apellido, { message: 'El apellido es obligatorio' })
    minLength(path.apellido, 3, { message: 'Mínimo 3 caracteres' })
    maxLength(path.apellido, 120, { message: 'Máximo 120 caracteres' })
    pattern(path.apellido, /^[a-zA-ZÁÉÍÓÚáéíóúÑñ0-9\s:'\-&.]+$/, { message: 'El apellido solo puede contener letras, números, espacios y signos básicos' })
    required(path.email, { message: 'El email es obligatorio' })
    pattern(path.email, /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, { message: 'Formato incorrecto' })
    required(path.telefono, { message: 'El telefono es obligatorio' })
    pattern(path.telefono, /^\d{8}$/, { message: 'El teléfono solo acepta 8 dígitos numéricos' })
    required(path.titulo, { message: 'El título es obligatorio' })
    minLength(path.titulo, 3, { message: 'Mínimo 6 caracteres' })
    maxLength(path.titulo, 120, { message: 'Máximo 120 caracteres' })
    pattern(path.titulo, /^[a-zA-ZÁÉÍÓÚáéíóúÑñ0-9\s:'\-&.]+$/, { message: 'El nombre solo puede contener letras, números, espacios y signos básicos' })
    min(path.expAnnos, 1, { message: 'Debe tener al menos 1 año' })
    max(path.expAnnos, 99, { message: 'Cantidad demasiado elevada' })
    min(path.tarifaBase, 1, { message: 'Debe ser al menos 1' })
    required(path.modalidad, { message: 'Seleccione una categoría' })
    required(path.ubicacion, { message: 'Debe agregar una ubicación' })
    minLength(path.ubicacion, 3, { message: 'Mínimo 3 caracteres' })
    maxLength(path.ubicacion, 200, { message: 'Máximo 200 caracteres' })
    pattern(path.ubicacion, /^[a-zA-ZÁÉÍÓÚáéíóúÑñ0-9\s:'\-&.]+$/, { message: 'Solo puede contener letras, números y espacios' })
    required(path.foto, { message: 'Seleccione una imagen' })
  })

  isEdit = computed(() => this.profesional() !== null);
  isSubmitting = computed(() => this.saving())

constructor() {
  this.obtenerModalities(),
    effect(() => { const profesional = this.profesional()
      if (!profesional) { this.resetForm(); return}
      console.log("Profesional a editar:" + profesional.id);
      this.profesionalModel.set({
        nombre: profesional.nombre ?? '',
        apellido: profesional.apellido ?? '',
        email: profesional.email ?? '',
        telefono: profesional.telefono ?? '',
        titulo: profesional.titulo ?? '',
        ubicacion: profesional.ubicacion ?? '',
        tarifaBase: Number(profesional.tarifaBase ?? 0),
        expAnnos: Number(profesional.expAnnos ?? 0),
        isActive: profesional.isActive ?? false,
        isAvailable: profesional.isAvailable?? false,
        modalidad: profesional.modalidad,
        foto: profesional.foto ?? '',
      })
      this.selectedImageFile.set(null)
      this.imagePreview.set( profesional.foto ? this.imageService.getImageUrl(profesional.foto) : null )
    })
  }
private resetForm() {
    this.profesionalModel.set({
      nombre: '',
        apellido: '',
        email: '',
        telefono: '',
        titulo:  '',
        ubicacion: '',
        tarifaBase: Number(0),
        expAnnos: Number(0),
        isActive: true,
        isAvailable: true,
        modalidad: 'MIXTA',
        foto: '',
    })
    this.selectedImageFile.set(null)
    this.imagePreview.set(null)
  }

  onImageSelected(event: Event) { const input = event.target as HTMLInputElement; const file = input.files?.[0]
    if (!file) return
    this.selectedImageFile.set(file)
    this.imagePreview.set(URL.createObjectURL(file))
  }

  submit() {
    if (this.isSubmitting()) return
    this.marcarCamposComoTocados()
    if (this.formularioInvalido()) return;

    const file = this.selectedImageFile();
    if(file){ this.subirImagenYGuardar(file); 
      return; }
    this.emitirGuardar();
  }
  private subirImagenYGuardar(file: File) {
    this.uploadingImage.set(true)
    this.imageService.upload(file).subscribe({
      next: (response) => {
        this.profesionalModel.update((value) => ({ ...value, foto: response.fileName, }));
        this.profesionalForm.foto().value.set(response.fileName);
        this.selectedImageFile.set(null);
        const dto = this.buildDto();
        dto.foto = response.fileName;
        console.log("Json al enviar imagen: ",dto)
        this.guardar.emit(dto) },
      error: () => { alert('No se pudo subir la imagen') },
      complete: () => { this.uploadingImage.set(false) },
    })
  }
  private emitirGuardar() {
    const dto = this.buildDto()
    console.log('JSON enviado al API:', dto)
    this.guardar.emit(dto)
  }

  private marcarCamposComoTocados() {
    this.profesionalForm.nombre().markAsTouched()
    this.profesionalForm.apellido().markAsTouched()
    this.profesionalForm.email().markAsTouched()
    this.profesionalForm.telefono().markAsTouched()
    this.profesionalForm.titulo().markAsTouched()
    this.profesionalForm.ubicacion().markAsTouched()
    this.profesionalForm.isAvailable().markAsTouched()
    this.profesionalForm.tarifaBase().markAsTouched()
    this.profesionalForm.expAnnos().markAsTouched()
    this.profesionalForm.isActive().markAsTouched()
    this.profesionalForm.modalidad().markAsTouched()
    this.profesionalForm.foto().markAsTouched()
  }
  private formularioInvalido(): boolean {
    return (
      this.profesionalForm.nombre().invalid() ||
      this.profesionalForm.apellido().invalid() ||
      this.profesionalForm.email().invalid() ||
      this.profesionalForm.telefono().invalid() ||
      this.profesionalForm.titulo().invalid() ||
      this.profesionalForm.ubicacion().invalid() ||
      this.profesionalForm.isActive().invalid() ||
      this.profesionalForm.isAvailable().invalid() ||
      this.profesionalForm.tarifaBase().invalid() ||
      this.profesionalForm.expAnnos().invalid() ||
      this.profesionalForm.modalidad().invalid() ||
      this.profesionalForm.foto().invalid() && !this.selectedImageFile()
    );
  }
private buildDto(): ProfesionaCreateDto | ProfesionalUpdateDto {
    const value = this.profesionalModel()
    return {
      nombre: value.nombre.trim(),
      apellido: value.apellido.trim(),
      titulo: value.titulo.trim(),
      email: value.email.trim(),
      telefono: value.telefono.trim(),
      ubicacion: value.ubicacion.trim(),
      tarifaBase: Number(value.tarifaBase),
      expAnnos: Number(value.expAnnos),
      isActive: value.isActive,
      isAvailable: value.isAvailable,
      foto: this.profesionalForm.foto().value() ?? '',
      modalidad: value.modalidad,
    }
  }
  private obtenerModalities(): void{
    this.modServ.listar().subscribe({
      next: (response) => {
        this.mods.set(response.data);
      }
    })
  }
}
