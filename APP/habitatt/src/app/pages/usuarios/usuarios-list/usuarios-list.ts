import { Component, computed, inject, signal } from '@angular/core';
import { UsuarioService } from '../../../../core/services/usuario.service';
import {usuario} from '../../../../core/models/usuario.model'
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { Categoria } from '../../../../core/models/categoria.model';
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
  templateUrl: './usuarios-list.html',
  styleUrl: './usuarios-list.css',
})
export class UsuariosList {
  private readonly usuariosService = inject(UsuarioService);
  //Listar:
  usuarios = signal<usuario[]>([]);
  //Filtro de busqueda
  search = signal('');
  //Indicador de carga
  loading = signal(false);
  //Error
  error = signal<string | null>(null);

   ngOnInit(): void {
    this.loadUsuarios();
  }
  loadUsuarios(): void {
    this.loading.set(true);
    this.error.set(null);

    this.usuariosService.listar().subscribe({
      next: (response) => {
        this.usuarios.set(response.data);
        this.loading.set(false);
        console.log('Usuarios cargados:', response.data);
      },
      error: () => {
        this.error.set('No se pudieron cargar los usuarios.');
        this.loading.set(false);
      },
    });
  }
  usuariosFiltrados = computed(()=>{
    const text = this.search().trim().toLowerCase();
    return this.usuarios().filter((user) => {
      const nombre = user.nombre?.toLocaleLowerCase() ?? '';
      const apellido = user.apellido?.toLowerCase() ?? '';
      const coincidencia = text.length === 0 || nombre.includes(text) || apellido.includes(text)  
      return coincidencia;
     });
  })
  
  total = computed(() => this.usuariosFiltrados().length);

  getImageUrl(imageName: string): string {
    return this.usuariosService.getImageUrl(imageName);
  }
}
