import { Component, inject, signal } from '@angular/core'
import { ActivatedRoute, Router } from '@angular/router'
import { CitasForm } from '../../../shared/components/citas-form/citas-form';
import { Cita, createCitaDto, updateCitaDto } from '../../../../core/models/cita.model';
import { CitasService } from '../../../../core/services/cita.service';
import { NotificationService } from '../../../../core/services/notification.service'

@Component({
  selector: 'app-citas-admin-create',
  imports: [CitasForm],
  templateUrl: './citas-admin-create.html',
  styleUrl: './citas-admin-create.css',
})
export class CitasAdminCreate {
    noti = inject(NotificationService)
  private readonly router = inject(Router)
  private readonly citaService = inject(CitasService)

    citas = signal<Cita[] | null>(null);
    loading = signal(true)
    saving = signal(false)
    error = signal<string | null>(null)
    
    constructor() {
        this.cargarDatosFormulario()
    }
    cargarDatosFormulario() {
      this.error.set(null)
      this.loading.set(true)
      citas: this.citaService.listar().subscribe({
            next: ( citas) => {
                this.citas.set(citas.data??[])
            },
            error: () => { this.error.set('No se pudo cargar la información de la Cita') },
            complete: () => { this.loading.set(false) },
        })
    }
    guardar(data: createCitaDto | updateCitaDto) {
        this.saving.set(true)
        this.error.set(null)
        console.log("Data: ", data)
        this.citaService.crear(data as createCitaDto).subscribe({
                next: () => {  this.noti.success('¡Cita creada exitosamente!', undefined, 5000);
                                this.router.navigate(['/citas']) },
                error: () => { this.noti.error('¡No se pudo crear la cita!', undefined, 5000);
                                    this.error.set('No se pudo crear la cita') },
                complete: () => { this.saving.set(false) },
            })
    } cancelar() {  this.router.navigate(['/admin/citas']) }}
