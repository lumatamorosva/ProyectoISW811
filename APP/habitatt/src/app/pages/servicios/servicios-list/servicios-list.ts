import { Component, computed, inject, signal } from '@angular/core';
import { ServicioService } from '../../../../core/services/servicio.service';
import {Servicio} from '../../../../core/models/servicio.model'
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

@Component({
  selector: 'app-usuarios-list',
  imports: [FormsModule,
    RouterLink,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    CommonModule],
  templateUrl: './servicios-list.html',
  styleUrl: './servicios-list.css',
})
export class ServiciosList {
  private readonly serviciosService = inject(ServicioService);
  //Listar:
  servicios = signal<Servicio[]>([]);
  //Filtro de busqueda
  search = signal('');
  //Indicador de carga
  loading = signal(false);
  //Error
  error = signal<string | null>(null);

   ngOnInit(): void {
    this.loadServisios();
  }
  loadServisios(): void {
    this.loading.set(true);
    this.error.set(null);

    this.serviciosService.listar().subscribe({
      next: (response) => {
        this.servicios.set(response.data);
        this.loading.set(false);
        console.log('Servicios cargados:', response.data);
      },
      error: () => {
        this.error.set('No se pudieron cargar los servicios.');
        this.loading.set(false);
      },
    });
  }
  Filtrados = computed(()=>{
    const text = this.search().trim().toLowerCase();
    return this.servicios().filter((servicio) => {
      const nombre = servicio.nombre?.toLocaleLowerCase() ?? '';
      const descripcion = servicio.descripcion?.toLowerCase() ?? '';
      const coincidencia = text.length === 0 || nombre.includes(text) || descripcion.includes(text)  
      return coincidencia;
     });
  })
  
  total = computed(() => this.Filtrados().length);
}
