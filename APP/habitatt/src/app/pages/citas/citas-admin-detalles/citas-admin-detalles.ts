import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { usuario } from '../../../../core/models/usuario.model';
import { UsuarioService } from '../../../../core/services/usuario.service';
import { CitasService } from '../../../../core/services/cita.service';
import { Cita } from '../../../../core/models/cita.model';
import { ServicioService } from '../../../../core/services/servicio.service';
import { ModalityService } from '../../../../core/services/modality.service';
import { ProfesionalService } from '../../../../core/services/profesional.service';
import { StatusService } from '../../../../core/services/estado.service';
import { Servicio } from '../../../../core/models/servicio.model';
import { Modality } from '../../../../core/models/modality.model';
import { profesional } from '../../../../core/models/profesional.model';
import { Estado } from '../../../../core/models/estado.model';


@Component({
  selector: 'app-citas-admin-detalles',
  imports: [
    RouterLink,
    MatButtonModule,
    MatCardModule,
    MatChipsModule,
    MatIconModule,
    MatProgressSpinnerModule,
    CommonModule],
  templateUrl: './citas-admin-detalles.html',
  styleUrl: './citas-admin-detalles.css',
})
export class CitasAdminDetalles {
  private readonly route = inject(ActivatedRoute);
  private readonly citaService = inject(CitasService);
    private readonly servService = inject(ServicioService);
    private readonly usuarioService = inject(UsuarioService);
    private readonly modService = inject(ModalityService);
    private readonly profService = inject(ProfesionalService);
    private readonly statusService = inject(StatusService);

  cita = signal<Cita | null>(null);
  loading = signal(false);
  error = signal<string | null>(null);

  usuario = signal<usuario[] | null> (null);
  servicio = signal<Servicio | null>(null);
  modality = signal<Modality | null> (null);
  profesional = signal<profesional | null>(null);
  estado = signal<Estado | null>(null);

  nombreProfesional = signal<string>('Cargando profesional...');
  nombreServicio = signal<string>('Cargando servicio...');
  nombreCliente = signal<string>('Nombre Cliente en carga...')
  nombreModalidad = signal<string>('Modalidad en carga...')

ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.loadCita(id);
  }

  loadCita(id: number): void {
    this.loading.set(true);
    this.error.set(null);
    this.citaService.obtenerPorId(id).subscribe({
      next: (response) => {
        this.cita.set(response.data);
        this.loading.set(false);
        console.log(response.data)
        this.cargarNombreProfesional(response.data.profesionalId);
        this.cargarNombreServicio(response.data.servicioId);
        this.cargarNombrecliente(response.data.clienteId);
        this.nombreModalidad.set(response.data.modalidad);
      },
      error: () => {
        this.error.set('Error al encontrar cita: ' + id);
        this.loading.set(false);
      },
    });
  }
  private cargarNombreProfesional(id: number): void{
    this.profService.obtenerPorId(id).subscribe({
      next: (response) => {
        const nombre = response.data.nombre+ " " + response.data.apellido;
          this.nombreProfesional.set(nombre);
      }
    })
  }
  private cargarNombrecliente(id: number): void{
    this.usuarioService.obtenerPorId(id).subscribe({
      next: (response) => {
        const nombre = response.data.nombre + " " + response.data.apellido;
          this.nombreCliente.set(nombre);
      }
    })
  }
  private cargarNombreServicio(id: number): void{
    this.servService.obtenerPorId(id).subscribe({
      next: (response) => {
        const nombre = response.data.nombre;
          this.nombreServicio.set(nombre);
      }
    })
  }
  private cargarNombreModality(id: string): void{
    this.modService.listar().subscribe({
      next: (response) => {
        const lista = response.data || [];
        const modalidadEncontrada = lista.find((mod: Modality) => mod.value.toLowerCase() === id.toLowerCase());
        console.log("Modalidades: " + modalidadEncontrada?.value);
          if(modalidadEncontrada){
            this.nombreModalidad.set(modalidadEncontrada.label);
          }
        }
    })
  }
}
