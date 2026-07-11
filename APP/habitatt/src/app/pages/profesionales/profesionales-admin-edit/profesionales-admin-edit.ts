import { Component, inject, signal } from '@angular/core'
import { ActivatedRoute, Router } from '@angular/router'
import { ProfesionalService } from '../../../../core/services/profesional.service'
import { ProfesionaCreateDto, profesional, ProfesionalUpdateDto } from '../../../../core/models/profesional.model';
import { ProfesionalesForm } from '../../../shared/components/profesionales-form/profesionales-form';

@Component({
  selector: 'app-profesional-detail',
    imports: [ ProfesionalesForm ],
  templateUrl: './profesionales-admin-edit.html',
  styleUrl: './profesionales-admin-edit.css',
})
export class ProfesionalesAdminEdit {
private readonly route = inject(ActivatedRoute)
private readonly router = inject(Router)
private readonly profService = inject(ProfesionalService);

    profesional = signal<profesional | null>(null)
    loading = signal(true)
    saving = signal(false)
    error = signal<string | null>(null)
    private readonly id = Number(this.route.snapshot.paramMap.get('id'))
    constructor() {
        this.cargarDatosFormulario()
    }
    cargarDatosFormulario() {
        if (!this.id) {
            this.error.set('El identificador del profesional no es válido')
            this.loading.set(false)
            return
        }
        this.loading.set(true)
        this.error.set(null)
        this.profService.obtenerPorId(this.id).subscribe({
            next: (prof) => { this.profesional.set(prof.data); },
            error: () => { this.error.set('No se pudo cargar la información del profesional') },
            complete: () => { this.loading.set(false) },
        })
    }
    guardar(data: ProfesionaCreateDto | ProfesionalUpdateDto) {
        if (!this.id) return
        this.saving.set(true)
        this.error.set(null)
        console.log("Data: ", data)
        this.profService.actualizar(this.id, data as ProfesionalUpdateDto)
            .subscribe({
                next: () => {  this.router.navigate(['/admin/profesionales']) },
                error: () => { this.error.set('No se pudo actualizar el profesional') },
                complete: () => { this.saving.set(false) },
            })
    }
    cancelar() { this.router.navigate(['/admin/profesionales']) }
}
