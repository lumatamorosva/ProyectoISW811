import { Component, inject, signal } from '@angular/core'
import { ActivatedRoute, Router } from '@angular/router'
import { ProfesionalService } from '../../../../core/services/profesional.service';
import { ProfesionaCreateDto, profesional, ProfesionalUpdateDto } from '../../../../core/models/profesional.model';
import { ProfesionalesForm } from '../../../shared/components/profesionales-form/profesionales-form';
import { CitasForm } from '../../../shared/components/citas-form/citas-form';
import { Cita, createCitaDto, updateCitaDto } from '../../../../core/models/cita.model';
import { CitasService } from '../../../../core/services/cita.service';

@Component({
  selector: 'app-citas-admin-create',
  imports: [CitasForm],
  templateUrl: './citas-admin-create.html',
  styleUrl: './citas-admin-create.css',
})
export class CitasAdminCreate {
  private readonly route = inject(ActivatedRoute)
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
                next: () => {  this.router.navigate(['/admin/citas']) },
                error: () => { this.error.set('No se pudo crear la cita') },
                complete: () => { this.saving.set(false) },
            })
    } cancelar() {  this.router.navigate(['/admin/citas']) }}
