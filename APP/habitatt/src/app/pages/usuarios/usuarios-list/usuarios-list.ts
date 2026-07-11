import { Component, computed, inject, signal, effect } from '@angular/core';
import { UsuarioService } from '../../../../core/services/usuario.service';
import {usuario, usuarioUpdateDto} from '../../../../core/models/usuario.model'
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
import {RoleService} from '../../../../core/services/role.service'
import { Role } from '../../../../core/models/role.model';

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
  private readonly rolService = inject(RoleService);
  //Listar:
  usuarios = signal<usuario[]>([]);
  //Filtro de busqueda
  search = signal('');
  //Indicador de carga
  loading = signal(false);
  //Error
  error = signal<string | null>(null);
  //Para filtro por rol
  rolId = signal<string | null>(null);
  rolLista = signal<Role[]>([]);

  ngOnInit(): void {
    this.loadUsuarios();
    this.loadRoles();
  }

  loadRoles(): void {
  this.rolService.listar().subscribe({
        next: (response: any) => {
          this.rolLista.set(response.data);
        }
    });
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
    const selectedRol = this.rolId() == "Cliente" ? "USER" : this.rolId() == "Administrador" ? "ADMIN" : null;
    return this.usuarios().filter((user) => {
      const nombre = user.nombre?.toLocaleLowerCase() ?? '';
      const apellido = user.apellido?.toLowerCase() ?? '';
      const rolUser = user.role.toLowerCase() ?? '';
      const coincidencia = text.length === 0 || nombre.includes(text) || apellido.includes(text);  
      const coincideRol = !selectedRol || rolUser === selectedRol.toLowerCase();
      return coincidencia && coincideRol;
    });
  })
  
  total = computed(() => this.usuariosFiltrados().length);

  getImageUrl(imageName: string): string {
    return this.usuariosService.getImageUrl(imageName);
  }

  cambiarEstado(user: usuario): void {
    const nuevoEstado = !user.isActive;
    const datosActualizados: Partial<usuarioUpdateDto> = {
      isActive: nuevoEstado
    };
    this.usuariosService.actualizar(user.id, datosActualizados)
      .subscribe({
        next: () => {user.isActive = nuevoEstado;
          this.usuarios.update(lista => lista.map(u => u.id === user.id ? {...u, isActive: nuevoEstado}: u));
        },
      });
    }
}
