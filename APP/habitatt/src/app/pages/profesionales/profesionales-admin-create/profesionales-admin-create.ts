import { Component, inject, signal } from '@angular/core'
import { ActivatedRoute, Router } from '@angular/router'
import { ProfesionalService } from '../../../../core/services/profesional.service';
import { ProfesionaCreateDto, profesional, ProfesionalUpdateDto } from '../../../../core/models/profesional.model';
import { ProfesionalesForm } from '../../../shared/components/profesionales-form/profesionales-form';
@Component({
  selector: 'app-profesionales-admin-create',
  imports: [ProfesionalesForm],
  templateUrl: './profesionales-admin-create.html',
  styleUrl: './profesionales-admin-create.css',
})
export class ProfesionalesAdminCreate {
  private readonly route = inject(ActivatedRoute)
  private readonly router = inject(Router)
 private readonly profService = inject(ProfesionalService)

    profesionales = signal<profesional[] | null>(null);
    loading = signal(true)
    saving = signal(false)
    error = signal<string | null>(null)
    
     constructor() {
        this.cargarDatosFormulario()
    }
    cargarDatosFormulario() {
      this.error.set(null)
      this.loading.set(true)
      profesionales: this.profService.listar().subscribe({
            next: ( profesionales) => {
                this.profesionales.set(profesionales.data??[])
            },
            error: () => { this.error.set('No se pudo cargar la información del servicio') },
            complete: () => { this.loading.set(false) },
        })
    }
    guardar(data: ProfesionaCreateDto | ProfesionalUpdateDto) {
        this.saving.set(true)
        this.error.set(null)
        console.log("Data: ", data)
        this.profService.crear(data as ProfesionaCreateDto).subscribe({
                next: () => {  this.router.navigate(['/admin/profesionales']) },
                error: () => { this.error.set('No se pudo crear el profesional') },
                complete: () => { this.saving.set(false) },
            })
    } cancelar() {  this.router.navigate(['/admin/profesionales']) }
}
