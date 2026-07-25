import { Component, inject, signal } from '@angular/core'
import { ActivatedRoute, Router } from '@angular/router'
import { UsersForm } from '../../../shared/components/users-form/users-form';
import { UsuarioService } from '../../../../core/services/usuario.service';
import { AuthService } from '../../../../core/services/auth.service'
import { usuario, usuarioUpdateDto } from '../../../../core/models/usuario.model';
import { NotificationService } from '../../../../core/services/notification.service'

@Component({
  selector: 'app-admin-edit-perfil',
  imports: [UsersForm],
  templateUrl: './admin-edit-perfil.html',
  styleUrl: './admin-edit-perfil.css',
})
export class AdminEditPerfil {
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
            this.error.set('El identificador del cliente no es válido')
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
