import { Component, inject, signal } from '@angular/core'
import { ActivatedRoute, Router } from '@angular/router'
import { UsuarioService } from '../../../../core/services/usuario.service';
import { RegisterRequest, usuario } from '../../../../core/models/usuario.model';
import { NotificationService } from '../../../../core/services/notification.service'
import { RegisterForm } from '../../../shared/components/register-form/register-form';

@Component({
  selector: 'app-register',
  imports: [RegisterForm],
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class Register {
  noti = inject(NotificationService)
  private readonly route = inject(ActivatedRoute)
  private readonly router = inject(Router)
  usuario = signal<usuario | null>(null)
  private readonly usuarioService = inject(UsuarioService)

    loading = signal(true)
    saving = signal(false)
    error = signal<string | null>(null)
    private readonly id = Number(this.route.snapshot.paramMap.get('id'))

    constructor() {
      this.cargarDatosFormulario();
      this.loading.set(false)
    }

    cargarDatosFormulario() {
        if (!this.id) {
            this.loading.set(false)
            return
        }
        this.loading.set(true)
        this.error.set(null)
        this.usuarioService.obtenerPorId(this.id).subscribe({
            next: (usr) => { this.usuario.set(usr.data); },
            error: () => { this.error.set('No se pudo cargar la información del usuario') },
            complete: () => { this.loading.set(false) },
        })
    }

    guardar(data: RegisterRequest) {
        this.saving.set(true)
        this.error.set(null)
        console.log("Data: ", data)
        this.usuarioService.registrar(data as RegisterRequest).subscribe({
                next: () => { this.noti.success('¡Uusario registrado exitosamente!', undefined, 5000);
                              this.router.navigate(['/login']) },
                error: () => { this.noti.error('¡No se pudo registrar el usuario!', undefined, 5000);
                                this.error.set('No se pudo registrar el usuario') },
                complete: () => { this.saving.set(false) },
            })
    }
    cancelar() { this.router.navigate(['']) }
}
