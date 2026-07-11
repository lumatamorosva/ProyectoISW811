import { Component, inject, signal } from '@angular/core'
import { ActivatedRoute, Router } from '@angular/router'
import { forkJoin } from 'rxjs'
import { CategoriaService } from '../../../../core/services/categoria.service'
import { Servicio, ServicioUpdateDto, ServicioCreateDto, ServicioFormModel } from '../../../../core/models/servicio.model';
import { categoria } from '../../../../core/models/categoria.model'
import { ServiciosForm } from '../../../shared/components/servicios-form/servicios-form'
import { ServicioService } from '../../../../core/services/servicio.service'

@Component({
  selector: 'app-servicios-admin-edit',
  imports: [ServiciosForm],
  templateUrl: './servicios-admin-edit.html',
  styleUrl: './servicios-admin-edit.css',
})
export class ServiciosAdminEdit {
  private readonly route = inject(ActivatedRoute)
  private readonly router = inject(Router)
  private readonly serviceService = inject(ServicioService)
  private readonly categoriaService = inject(CategoriaService)

    servicio = signal<Servicio | null>(null)
    categoria = signal<categoria | null>(null)
    loading = signal(true)
    saving = signal(false)
    error = signal<string | null>(null)
    private readonly id = Number(this.route.snapshot.paramMap.get('id'))
    constructor() {
        this.cargarDatosFormulario()
    }
    cargarDatosFormulario() {
        if (!this.id) {
            this.error.set('El identificador del servicio no es válido')
            this.loading.set(false)
            return
        }
        this.loading.set(true)
        this.error.set(null)
        forkJoin({
            servicio: this.serviceService.obtenerPorId(this.id),
        }).subscribe({
            next: ({ servicio: serv}) => {
                this.servicio.set(serv.data)
                this.categoriaService.obtenerPorId(serv.data?.categoriaId);
            },
            error: () => {
                this.error.set('No se pudo cargar la información del servicio')
            },
            complete: () => {
                this.loading.set(false)
            },
        })
    }
    guardar(data: ServicioCreateDto | ServicioUpdateDto) {
        if (!this.id) return
        this.saving.set(true)
        this.error.set(null)
        console.log("Data: ", data)
        this.serviceService
            .actualizar(this.id, data as ServicioUpdateDto)
            .subscribe({
                next: () => {  this.router.navigate(['/admin/servicios']) },
                error: () => { this.error.set('No se pudo actualizar el servicio') },
                complete: () => { this.saving.set(false) },
            })
    }
    cancelar() {
        this.router.navigate(['/admin/servicios'])
    }
}
