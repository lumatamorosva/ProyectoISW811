import { Component, computed, inject, input, signal } from '@angular/core';
import { EspecialidadService } from '../../../../core/services/especialidad.service';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { CommonModule } from '@angular/common';
import { Especialidad } from '../../../../core/models/especialidad.model';

@Component({
  selector: 'app-listado',
  imports: [FormsModule,
    RouterLink,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    FormsModule,
    CommonModule],
  templateUrl: './listado.html',
  styleUrl: './listado.css',
})
export class Listado {
  private readonly especialidadesService = inject(EspecialidadService);
  //Listar:
  specialidades = signal<Especialidad[]>([]);
  //Filtro de busqueda
  search = signal('');
  //Indicador de carga
  loading = signal(false);
  //Error
  error = signal<string | null>(null);

  precioMinimo = signal <number | null>(0);
  precioMaximo = signal <number | null>(100000);
  
  ngOnInit(): void {
    this.loadData();
  }
  loadData(): void {
  this.loading.set(true);
  this.error.set(null);
  this.especialidadesService.listar().subscribe({
    next: (specialidadResponse) => {
      this.specialidades.set(specialidadResponse.data);
      this.loading.set(false);
      console.log('Encontradas:', this.specialidades());
      },error: () => {this.error.set('No se pudieron cargar los servicios.');
  }
})}

  Filtrados = computed(() => {
    const text = this.search().trim().toLowerCase();
    const min = this.precioMinimo() !== null ? Number(this.precioMinimo()) : 0;
    const max = this.precioMaximo() !== null ? Number(this.precioMaximo()) : Infinity;
    return this.specialidades().filter((spe) => {
      const nombre = spe.nombre?.toLocaleLowerCase() ?? '';
      const descripcion = spe.descripcion?.toLowerCase() ?? '';
      const coincidencia = text.length === 0 || nombre.includes(text) || descripcion.includes(text);
      const coincideRango = Number(spe.precioBase) >= min && Number(spe.precioBase) <= max;
      return coincidencia && coincideRango;
    });
  })

  total = computed(() => this.Filtrados().length);
  totalEncontrados = computed(() => this.specialidades().length);
}
