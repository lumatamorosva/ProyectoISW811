import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Servicio } from '../../../../core/models/servicio.model';
import { ServicioService } from '../../../../core/services/servicio.service';
import { ProfesionalService } from '../../../../core/services/profesional.service';
import { CategoriaService } from '../../../../core/services/categoria.service';
import { AuthService } from '../../../../core/services/auth.service';

@Component({
  selector: 'app-servicios-detail',
  imports: [
    RouterLink,
    MatButtonModule,
    MatCardModule,
    MatChipsModule,
    MatIconModule,
    MatProgressSpinnerModule,
    CommonModule
  ],
  templateUrl: './servicios-detail.html',
  styleUrl: './servicios-detail.css',
})
export class ServiciosDetail {
  private readonly route = inject(ActivatedRoute);
  private readonly authService = inject(AuthService);
  readonly usuario = this.authService.usuario();
  private readonly servicioService = inject(ServicioService);
  private readonly serviProf = inject(ProfesionalService);
  private readonly catService = inject(CategoriaService);

  servicio = signal<Servicio | null>(null);
  loading = signal(false);
  error = signal<string | null>(null);
  nombreProfesional = signal<string>('Cargando profesional...');
  nombreCategoria = signal<string>('Cargando Categoria');
  
  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));

    if (!id) {
      this.error.set('No se encuentra el servicio: ' + id);
      return;
    }
    this.loadDatosServicio(id);
  }

  loadDatosServicio(id: number): void {
    this.loading.set(true);
    this.error.set(null);

    this.servicioService.obtenerPorId(id).subscribe({
      next: (response) => {
        this.servicio.set(response.data);
        this.loading.set(false);
        console.log(response.data)
      
      if (response.data && response.data.profesionalId) {
          this.cargarNombreProfesional(response.data.profesionalId);
        }
        if (response.data && response.data.categoriaId) {
          this.cargarNombreCat(response.data.categoriaId);
        }},
      error: () => {
        this.error.set('No se encuentra el servicio: ' + id);
        this.loading.set(false);

      },
    });
  }

  private cargarNombreProfesional(id: number): void {
    this.serviProf.obtenerPorId(id).subscribe({
      next: (res) => {
        const prof = res.data;
        this.nombreProfesional.set(`${prof.nombre} ${prof.apellido}`);
      },
      error: (err) => {
        this.nombreProfesional.set('Error al cargar profesional: ' + err);
      }
    });}

    private cargarNombreCat(id: number): void{
      this.catService.obtenerPorId(id).subscribe({
        next: (response) => {
          const cat = response.data;
            this.nombreCategoria.set(`${cat.nombre}`);
        }
      })
    }
}
