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
import { forkJoin } from 'rxjs';
import { AuthService } from '../../../../core/services/auth.service'

@Component({
  selector: 'app-lista-profesional',
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
  templateUrl: './lista-profesional.html',
  styleUrl: './lista-profesional.css',
})
export class ListaProfesional {
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
  
    displayedColumns = [ 'fecha', 'hora', 'cliente', 'servicio','estado', 'acciones', ];
  
    ngOnInit(): void {
    this.cargarTodoElSistema();
  }
  
  cargarTodoElSistema(): void {
    this.loading.set(true);
    this.error.set(null);
    const usuarioSesion = this.usuario;
    const emailUsuario = usuarioSesion?.email;
    if (!emailUsuario) {
    this.error.set('No se pudo determinar el correo del usuario en sesión.');
    this.loading.set(false);
    return;
  }
  this.profService.listar().subscribe({
    next: (resProf) => {
      const profesionales = resProf.data;
      const profEncontrado = profesionales.find(p => p.email?.toLowerCase() === emailUsuario.toLowerCase());
      if (!profEncontrado) {
        this.error.set('No se encontró un perfil profesional asociado a este correo.');
        this.loading.set(false);
        return;
      }
    forkJoin({
      usuarios: this.usuarioService.listar(),
        servicios: this.servService.listar(),
        estados: this.statusService.listar(),
        citas: this.appoService.getByProfessional(profEncontrado.id)
    }).subscribe({
      next: (resultado) => {
        this.usuariosLista.set(resultado.usuarios.data);
          this.serviciosLista.set(resultado.servicios.data);
          this.estados.set(resultado.estados.data);
          this.profesionalesLista.set(profesionales);

          const listaCitasRaw = resultado.citas.data;
          const servicios = resultado.servicios.data;
          const usuarios = resultado.usuarios.data;

          const citasProcesadas = listaCitasRaw.map((appoint: any) => {
            const servicioEncontrado = servicios.find((c: any) => c.id === appoint.servicioId);
            const usuarioEncontrado = usuarios.find((u: any) => u.id === appoint.clienteId);

            return {
              ...appoint,
              nombreProfesional: `${profEncontrado.nombre} ${profEncontrado.apellido}`,
              nombreServicio: servicioEncontrado ? `${servicioEncontrado.nombre}` : 'Sin servicio',
              nombreCliente: usuarioEncontrado ? `${usuarioEncontrado.nombre} ${usuarioEncontrado.apellido}` : 'Cliente no encontrado'
            };
          });
        this.citas.set(citasProcesadas);
        this.loading.set(false);
      },
      error: (err) => {
        console.error(err);
        this.error.set('No se pudieron cargar los datos del sistema.');
        this.loading.set(false);
      }
    });},
    error: (err) => {
      console.error(err);
      this.error.set('Error al verificar la lista de profesionales.');
      this.loading.set(false);
    }
  });
  }
  
    Filtrados = computed(() => {
      const selectedEstado = this.estadoId();
      const fechaInicio = this.fecha1();
      const fechaFinal = this.fecha2();
      return this.citas().filter((cita) => {
        const coincideEstado = !selectedEstado || cita.status === selectedEstado;
        let coincideRango = true;
          if (fechaInicio && fechaFinal) {coincideRango = cita.fecha >= fechaInicio && cita.fecha <= fechaFinal;
          } else if (fechaInicio) {coincideRango = cita.fecha >= fechaInicio;
          } else if (fechaFinal) {  coincideRango = cita.fecha <= fechaFinal;}
        return coincideEstado && coincideRango;
      });
    })
  
    total = computed(() => this.Filtrados().length);
}
