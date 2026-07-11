import { Component, computed, inject, signal } from '@angular/core';
import { CategoriaService } from '../../../../core/services/categoria.service';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTableModule } from '@angular/material/table';
import { MatChipsModule } from '@angular/material/chips';
import { categoria, CategoriaUpdateDto } from '../../../../core/models/categoria.model';
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
  templateUrl: './categorias-admin-list.html',
  styleUrl: './categorias-admin-list.css',
})
export class CategoriasAdminList {
  private readonly catsService = inject(CategoriaService);
  //Listar:
  cats = signal<categoria[]>([]);
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
    'activa',
    'acciones',
  ];

  ngOnInit(): void {
    this.loadDataCats();
  }
  loadDataCats(): void {
    this.loading.set(true);
    this.error.set(null);

    this.catsService.listar().subscribe({
      next: (response) => {
        this.cats.set(response.data);
        this.loading.set(false);
        console.log('Categorías encontradas:', response.data);
      },
      error: () => {
        this.error.set('No se pudieron cargar categorías.');
        this.loading.set(false);
      },
    });
  }
  Filtrados = computed(() => {
    const text = this.search().trim().toLowerCase();
    const selectedStatus = this.status();
    return this.cats().filter((category) => {
      const stat = category.isActive? 1 : 0;
      const nombre = category.nombre?.toLocaleLowerCase() ?? '';
      const coincidencia = text.length === 0 || nombre.includes(text);
      const coincideStatus = selectedStatus === null || stat === selectedStatus;
      return coincidencia && coincideStatus;
    });
  })

  total = computed(() => this.Filtrados().length);

  cambiarEstado(categoria: categoria): void {
    const nuevoEstado = !categoria.isActive;
    const datosActualizados: Partial<CategoriaUpdateDto> = {
      isActive: nuevoEstado
    };
    this.catsService.actualizar(categoria.id, datosActualizados)
      .subscribe({
        next: () => {categoria.isActive = nuevoEstado;
          this.cats.update(lista => lista.map(c => c.id === categoria.id ? {...c, isActive: nuevoEstado}: c));
        }
      });
    }
}
