import { Component, inject, signal } from '@angular/core'
import { ActivatedRoute, Router } from '@angular/router'
import { forkJoin } from 'rxjs'
import { CategoriaService } from '../../../../core/services/categoria.service'
import { Servicio, ServicioUpdateDto, ServicioCreateDto, ServicioFormModel } from '../../../../core/models/servicio.model';
import { categoria } from '../../../../core/models/categoria.model'
import { ServiciosForm } from '../../../shared/components/servicios-form/servicios-form'
import { ServicioService } from '../../../../core/services/servicio.service'
import { ProfesionalService } from '../../../../core/services/profesional.service';
import { profesional } from '../../../../core/models/profesional.model';

@Component({
  selector: 'app-servicios-admin-create',
  imports: [ServiciosForm],
  templateUrl: './servicios-admin-create.html',
  styleUrl: './servicios-admin-create.css',
})
export class ServiciosAdminCreate {private readonly route = inject(ActivatedRoute)
  private readonly router = inject(Router)
  private readonly serviceService = inject(ServicioService)
  private readonly categoriaService = inject(CategoriaService)
 private readonly profService = inject(ProfesionalService)

    servicio = signal<Servicio | null>(null)
    categoria = signal<categoria | null>(null)
    categorias = signal<categoria[]>([])
    profesionales = signal<profesional[] | null>(null)
    loading = signal(true)
    saving = signal(false)
    error = signal<string | null>(null)
    constructor() {
        this.cargarDatosFormulario()
    }
    cargarDatosFormulario() {
      this.error.set(null)
      this.loading.set(true)
      forkJoin({
        categorias: this.categoriaService.listar(),
        profesionales: this.profService.listar()
        }).subscribe({
            next: ({ categorias, profesionales}) => {
                this.categorias.set(categorias.data??[])
                this.profesionales.set(profesionales.data??[])
            },
            error: () => { this.error.set('No se pudo cargar la información del servicio') },
            complete: () => { this.loading.set(false) },
        })
    }
    guardar(data: ServicioCreateDto | ServicioUpdateDto) {
        this.saving.set(true)
        this.error.set(null)
        console.log("Data: ", data)
        this.serviceService.crear(data as ServicioCreateDto).subscribe({
                next: () => {  this.router.navigate(['/admin/servicios']) },
                error: () => { this.error.set('No se pudo crear el servicio') },
                complete: () => { this.saving.set(false) },
            })
    } cancelar() {  this.router.navigate(['/admin/servicios']) }
  }
