import { Component, computed, inject, signal } from '@angular/core';
import { EspecialidadService } from '../../../../core/services/especialidad.service';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTableModule } from '@angular/material/table';
import { MatChipsModule } from '@angular/material/chips';
import { Especialidad} from '../../../../core/models/especialidad.model';
import { CommonModule } from '@angular/common';
import { MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'app-servicios-admin-list',
  imports: [FormsModule,
    RouterLink,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatTableModule,
    MatProgressSpinnerModule,
    MatFormFieldModule,
    MatInputModule,
    CommonModule,
  MatSelectModule],
  templateUrl: './especialidades-admin-list.html',
  styleUrl: './especialidades-admin-list.css',
})
export class EspecialidadesAdminList {
  private readonly SpService = inject(EspecialidadService);
  //Listar:
  specs = signal<Especialidad[]>([]);
  //Filtro de busqueda
  search = signal('');
  //Indicador de carga
  loading = signal(false);
  //Error
  error = signal<string | null>(null);
  //Para filtrar por activo/inactivo
  status = signal<number | null>(null);
  displayedColumns = [
    'nombre',
    'descripcion',
    'precio',
    'activa',
    'acciones',
  ];

  ngOnInit(): void {
    this.loadDataEspecialidades();
  }
  loadDataEspecialidades(): void {
    this.loading.set(true);
    this.error.set(null);

    this.SpService.listar().subscribe({
      next: (response) => {
        this.specs.set(response.data);
        this.loading.set(false);
        console.log('Especilidades encontradas:', response.data);
      },
      error: () => {
        this.error.set('No se pudieron cargar especialidades.');
        this.loading.set(false);
      },
    });
  }
  Filtrados = computed(() => {
    const text = this.search().trim().toLowerCase();
    const selectedStatus = this.status();
    return this.specs().filter((specialt) => {
      const stat = specialt.isActive? 1 : 0;
      const nombre = specialt.nombre?.toLocaleLowerCase() ?? '';
      const coincidencia = text.length === 0 || nombre.includes(text);
      const coincideStatus = selectedStatus === null || stat === selectedStatus;
      return coincidencia && coincideStatus;
    });
  })

  total = computed(() => this.Filtrados().length);
}
