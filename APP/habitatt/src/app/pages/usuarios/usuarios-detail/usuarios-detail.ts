import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { usuario } from '../../../../core/models/usuario.model';
import { UsuarioService } from '../../../../core/services/usuario.service';

@Component({
  selector: 'app-usuario-detail',
    imports: [
    RouterLink,
    MatButtonModule,
    MatCardModule,
    MatChipsModule,
    MatIconModule,
    MatProgressSpinnerModule,
    CommonModule
  ],
  templateUrl: './usuarios-detail.html',
  styleUrl: './usuarios-detail.css',
})
export class UserDetailPage {
  private readonly route = inject(ActivatedRoute);
  private readonly usuarioService = inject(UsuarioService);

  usuario = signal<usuario | null>(null);
  loading = signal(false);
  error = signal<string | null>(null);
ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));

    if (!id) {
      this.error.set('No se encuentra el usuario: ' + id);
      return;
    }

    this.loadUsuario(id);
  }

  loadUsuario(id: number): void {
    this.loading.set(true);
    this.error.set(null);

    this.usuarioService.obtenerPorId(id).subscribe({
      next: (response) => {
        this.usuario.set(response.data);
        this.loading.set(false);
        console.log(response.data)
      },
      error: () => {
        this.error.set('No se encuentra el usuario: ' + id);
        this.loading.set(false);
        
      },
    });
  }

  getImageUrl(imageName: string): string {
    return this.usuarioService.getImageUrl(imageName);
  }
}
