import { Component, inject, signal } from '@angular/core'
import { ActivatedRoute, Router } from '@angular/router'
import { UsersForm } from '../../../shared/components/users-form/users-form';
import { UsuarioService } from '../../../../core/services/usuario.service';
import { AuthService } from '../../../../core/services/auth.service'
import { usuarioUpdateDto } from '../../../../core/models/usuario.model';
import { NotificationService } from '../../../../core/services/notification.service'

@Component({
  selector: 'app-edit-perfil',
  imports: [UsersForm ],
  templateUrl: './edit-perfil.html',
  styleUrl: './edit-perfil.css',
})
export class EditPerfil {
  noti = inject(NotificationService)
  private readonly route = inject(ActivatedRoute)
  private readonly router = inject(Router)
  private readonly authService = inject(AuthService)
  readonly usuario = this.authService.usuario()
  private readonly usuarioService = inject(UsuarioService)

    loading = signal(true)
    saving = signal(false)
    error = signal<string | null>(null)
    private readonly id = Number(this.usuario?.id)

    constructor() {
      if (this.usuario) { this.loading.set(false)
      } else {
        this.error.set('No se pudo cargar la información del usuario')
        this.loading.set(false)
      }
    }
    guardar(data: usuarioUpdateDto) {
        if (!this.id) return
        this.saving.set(true)
        this.error.set(null)
        console.log("Data: ", data)
        this.usuarioService.actualizar(this.id, data as usuarioUpdateDto)
            .subscribe({
                next: () => { this.noti.success('¡Cambios guardados exitosamente!', undefined, 5000);
                              this.router.navigate(['']) },
                error: () => { this.noti.error('¡No se pudo actualizar el usuario!', undefined, 5000);
                                this.error.set('No se pudo actualizar el usuario') },
                complete: () => { this.saving.set(false) },
            })
    }
    cancelar() { this.router.navigate(['']) }
}
