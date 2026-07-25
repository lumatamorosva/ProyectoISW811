import { Component, computed, inject, signal } from '@angular/core';
import { ServicioService } from '../../../core/services/servicio.service';
import { Servicio } from '../../../core/models/servicio.model'
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
import { ProfesionalService } from '../../../core/services/profesional.service';
import { UsuarioService } from '../../../core/services/usuario.service';
import { CitasService } from '../../../core/services/cita.service';
import { usuario } from '../../../core/models/usuario.model';
import { profesional } from '../../../core/models/profesional.model';
import { StatusService } from '../../../core/services/estado.service';
import { Estado } from '../../../core/models/estado.model';
import { Cita } from '../../../core/models/cita.model';
import { forkJoin } from 'rxjs';
import { AuthService } from '../../../core/services/auth.service'

@Component({
  selector: 'app-citas',
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
  templateUrl: './citas.html',
  styleUrl: './citas.css',
})
export class Citas {
  private readonly authService = inject(AuthService)
  readonly usuario = this.authService.usuario()
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

  displayedColumns = [ 'fecha', 'hora', 'profesional', 'estado', 'acciones', ];

  ngOnInit(): void {
  this.cargarTodoElSistema();
}

cargarTodoElSistema(): void {
  this.loading.set(true);
  this.error.set(null);
  let clienteActual = this.usuario;
  const idCliente = clienteActual? clienteActual.id : 1;
  forkJoin({
    usuarios: this.usuarioService.listar(),
    servicios: this.servService.listar(),
    estados: this.statusService.listar(),
    profesionales: this.profService.listar(),
    citas: this.appoService.getByClient(idCliente)
  }).subscribe({
    next: (resultado) => {
      this.usuariosLista.set(resultado.usuarios.data);
      this.serviciosLista.set(resultado.servicios.data);
      this.estados.set(resultado.estados.data);
      this.profesionalesLista.set(resultado.profesionales.data);

      const listaCitasRaw = resultado.citas.data;
      const profesionales = resultado.profesionales.data;
      const servicios = resultado.servicios.data;
      const usuarios = resultado.usuarios.data;

      const citasProcesados = listaCitasRaw.map((appoint: any) => {
        const profesionalEncontrado = profesionales.find((p: any) => p.id === appoint.profesionalId);
        const servicioEncontrado = servicios.find((c: any) => c.id === appoint.servicioId);
        const usuarioEncontrado = usuarios.find((u: any) => u.id === appoint.clienteId);

        return {
          ...appoint,
          nombreProfesional: profesionalEncontrado ? `${profesionalEncontrado.nombre} ${profesionalEncontrado.apellido}` : 'No asignado',
          nombreServicio: servicioEncontrado ? `${servicioEncontrado.nombre}` : 'No encontrada',
          nombreCliente: usuarioEncontrado ? `${usuarioEncontrado.nombre} ${usuarioEncontrado.apellido}` : 'No encontrado'
        };
      });
      this.citas.set(citasProcesados);
      this.loading.set(false);
    },
    error: (err) => {
      console.error(err);
      this.error.set('No se pudieron cargar los datos del sistema.');
      this.loading.set(false);
    }
  });
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

  total = computed(() => this.Filtrados().length);}
