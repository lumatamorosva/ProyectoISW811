import { Component, computed, inject, signal } from '@angular/core';
import { ServicioService } from '../../../../core/services/servicio.service';
import { Servicio } from '../../../../core/models/servicio.model'
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTableModule } from '@angular/material/table';
import { MatChipsModule } from '@angular/material/chips';
import { CommonModule } from '@angular/common';
import { MatSelectModule } from '@angular/material/select';
import { ProfesionalService } from '../../../../core/services/profesional.service';
import { UsuarioService } from '../../../../core/services/usuario.service';
import { CitasService } from '../../../../core/services/cita.service';
import { usuario } from '../../../../core/models/usuario.model';
import { profesional } from '../../../../core/models/profesional.model';
import { StatusService } from '../../../../core/services/estado.service';
import { Estado } from '../../../../core/models/estado.model';
import { Cita } from '../../../../core/models/cita.model';


@Component({
  selector: 'app-citas-admin-list',
  imports: [FormsModule,
    RouterLink,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatTableModule,
    MatProgressSpinnerModule,
    MatFormFieldModule,
    CommonModule,
    MatInputModule,
    MatSelectModule],
  templateUrl: './citas-admin-list.html',
  styleUrl: './citas-admin-list.css',
})
export class CitasAdminList {
  private readonly appoService = inject(CitasService);
  private readonly servService = inject(ServicioService);
  private readonly usuarioService = inject(UsuarioService);
  private readonly profService = inject(ProfesionalService);
  private readonly statusService = inject(StatusService);
  //Listar:
  citas = signal<Cita[]>([]);
  usuariosLista = signal<usuario[] | null> (null);
  serviciosLista = signal<Servicio[] | null>(null);
  profesionalesLista = signal<profesional[] | null>(null);
  estados = signal<Estado[] | null>(null);
  //Filtro de busqueda
  estadoId = signal<string | null>(null)
  profId = signal<number | null> (null)
  fecha1 = signal<Date | null>(null)
  fecha2 = signal<Date | null>(null)
  //Indicador de carga
  loading = signal(false);
  //Error
  error = signal<string | null>(null);

  displayedColumns = [ 'cliente', 'fecha', 'hora', 'profesional', 'estado', 'acciones', ];

  ngOnInit(): void {
    this.listarUsuarios();
    this.listarServicios();
    this.listarEstado();
    this.listarProfesionales();
    this.loadcitas();
  }
  listarEstado(): void {
    this.statusService.listar().subscribe({
      next: (response) => {
        this.estados.set(response.data);
      }
    })
  }
  listarUsuarios(): void {
    this.usuarioService.listar().subscribe({
      next: (response) => {
        this.usuariosLista.set(response.data);
      }
    })
  }
  listarServicios(): void {
    this.servService.listar().subscribe({
      next: (response) => {
        this.serviciosLista.set(response.data);
      }
    })
  }
  listarProfesionales(): void {
    this.profService.listar().subscribe({
      next: (response) => {
        this.profesionalesLista.set(response.data);
      }
    })
  }

  loadcitas(): void {
  this.loading.set(true);
  this.error.set(null);
  this.appoService.listar().subscribe({
    next: (citaResponse) => {
      const citasProcesados: any[] = [];
      const listaCitasRaw = citaResponse.data;
      const profesionales = this.profesionalesLista();
      const servicios = this.serviciosLista();
      const usuarios = this.usuariosLista();
      if (!profesionales || !servicios || !usuarios) {
        this.loading.set(false);
        return;
      }
      listaCitasRaw.forEach((appoint: any) => {
        const profesionalEncontrado = profesionales.find((p: any) => p.id === appoint.profesionalId);
        const servicioEncontrado = servicios.find((c: any) => c.id === appoint.servicioId);
        const usuarioEncontrado = usuarios.find((u: any) => u.id === appoint.clienteId);
        const citaConDatosExtra = {...appoint,
          nombreProfesional: profesionalEncontrado? `${profesionalEncontrado.nombre} ${profesionalEncontrado.apellido}`: 'No asignado',
          nombreServicio: servicioEncontrado? `${servicioEncontrado.nombre}` : 'No encontrada',
          nombreCliente: usuarioEncontrado? `${usuarioEncontrado.nombre} ${usuarioEncontrado.apellido}` : 'No encontrado'};
        citasProcesados.push(citaConDatosExtra);
      });
      this.citas.set(citasProcesados);
      this.loading.set(false);
      console.log('Citas para la lista:', citasProcesados);
    },error: () => {this.error.set('No se pudieron cargar los servicios.');
    this.loading.set(false);
    },});
  }

  Filtrados = computed(() => {
    const selectedEstado = this.estadoId();
    const selectedProf = this.profId();
    const fechaInicio = this.fecha1();
    const fechaFinal = this.fecha2();
    return this.citas().filter((cita) => {
      const coincideEstado = !selectedEstado || cita.status === selectedEstado;
      const coincideProf = !selectedProf || cita.profesionalId === selectedProf;
      let coincideRango = true;
        if (fechaInicio && fechaFinal) {coincideRango = cita.fecha >= fechaInicio && cita.fecha <= fechaFinal;
        } else if (fechaInicio) {coincideRango = cita.fecha >= fechaInicio;
        } else if (fechaFinal) {  coincideRango = cita.fecha <= fechaFinal;}
      return coincideEstado && coincideProf && coincideRango;
    });
  })

  total = computed(() => this.Filtrados().length);
}
