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
import { usuarioFormModel, usuario,usuarioUpdateDto, RegisterRequest } from '../../../../core/models/usuario.model';
import { UsuarioService } from '../../../../core/services/usuario.service';
import { ImageService } from '../../../../core/services/image.service';
import { RoleService } from '../../../../core/services/role.service';
import { Role, RoleOption } from '../../../../core/models/role.model';

@Component({
  selector: 'app-register-form',
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
  templateUrl: './register-form.html',
  styleUrl: './register-form.css',
})
export class RegisterForm {
  private readonly userService = inject(UsuarioService);
  private readonly imageService = inject(ImageService);
  private readonly rolServ = inject(RoleService);

  uploadingImage = signal(false)
  imagePreview = signal<string | null>(null)
  selectedImageFile = signal<File | null>(null)
  roles = signal<RoleOption[] | null>(null)

  userActual = input<usuario | null>(null);
  saving = input<boolean>(false);

  guardar = output<RegisterRequest>();
  cancelar = output<void>();

  usuarioModel = signal<RegisterRequest>({
    nombre: '',
    apellido: '',
    email: '',
    password: '',
    isActive: true,
    role: Role.USER,
    foto: '',
  });

  userForm = form(this.usuarioModel, (path) => {
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
    required(path.password, { message: 'La contraseña es obligatoria' })
    pattern(path.password, /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>_\-\\[\]\/+=~`]).{8,}$/,{message: 'Debe incluir una mayúscula, una minúscula, un número y un carácter especial'})
    required(path.foto, { message: 'Seleccione una imagen' })
  })
  isEdit = computed(() => this.userActual() !== null);
  isSubmitting = computed(() => this.saving())

constructor() {}
private resetForm() {
    this.usuarioModel.set({
      nombre: '',
        apellido: '',
        email: '',
        password: '',
        isActive: true,
        role: Role.USER,
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
        const fileName = response.fileName;
        this.usuarioModel.update((value) => ({ ...value, foto: fileName, }));
        this.selectedImageFile.set(null);
        const dto = this.buildDto(fileName);
        dto.foto = response.fileName;
        console.log('JSON de usuario a guardar (con foto nueva):', dto)
        this.guardar.emit(dto) },
      error: (err) => {console.error('Error al subir imagen:', err); alert('No se pudo subir la imagen') },
      complete: () => { this.uploadingImage.set(false) },
    })
  }
  private emitirGuardar() {
    const dto = this.buildDto()
    console.log('JSON enviado al API:', dto)
    this.guardar.emit(dto)
  }

  private marcarCamposComoTocados() {
    this.userForm.nombre().markAsTouched()
    this.userForm.apellido().markAsTouched()
    this.userForm.email().markAsTouched()
    this.userForm.password().markAsTouched()
    this.userForm.isActive().markAsTouched()
    this.userForm.role().markAsTouched()
    this.userForm.foto().markAsTouched()
  }
  private formularioInvalido(): boolean {
    const fotoValida = !!this.usuarioModel().foto || !!this.selectedImageFile() || !!this.userActual()?.foto;
    return (
      this.userForm.nombre().invalid() ||
      this.userForm.apellido().invalid() ||
      this.userForm.email().invalid() ||
      this.userForm.password().invalid() ||
      this.userForm.isActive().invalid() ||
      this.userForm.role().invalid() ||
      !fotoValida
    );
  }
private buildDto(fotoNombre?: string): RegisterRequest {
    const value = this.usuarioModel()
    const fotoFinal = fotoNombre || value.foto || this.userActual()?.foto || '';
    return {
      nombre: value.nombre.trim(),
      apellido: value.apellido.trim(),
      email: value.email.trim(),
      password: value.password,
      isActive: value.isActive,
      foto: fotoFinal,
      role: value.role,
    }
  }
}
