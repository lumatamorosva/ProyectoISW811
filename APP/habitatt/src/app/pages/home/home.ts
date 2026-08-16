import { Component, computed, inject, signal } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { RouterLink } from '@angular/router';
import { Role } from '../../../core/models/role.model'
import { RouterOutlet } from '@angular/router';
import {AuthService} from '../../../core/services/auth.service'

export interface ContentCard {
  title: string;
  description: string;
  icon: string;
  link?: string;
  roles?: Role[];
}
@Component({
  selector: 'app-home', standalone: true,
  imports: [RouterOutlet, MatCardModule, MatIconModule, MatButtonModule,RouterLink],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {
  private readonly authService = inject(AuthService);
  cards = signal<ContentCard[]>([
    {
      title: 'Servicios',
      description: 'Catálogo ofrecido.',
      icon: 'construction',
      link: '/servicios',
      roles: [Role.PROFESIONAL, Role.USER, Role.ADMIN],
    },
    {
      title: 'Citas',
      description: 'Vea y modifique sus citas.',
      icon: 'receipt_long',
      link: '/citas',
      roles: [Role.USER],
    },
    {
      title: 'Citas',
      description: 'Vea y acepte las citas solicitadas.',
      icon: 'receipt_long',
      link: '/citasProfesional',
      roles: [Role.PROFESIONAL],
    },
    {
      title: 'Especialidades',
      description: 'Encuentra el área que ocupas.',
      icon: 'star_rate',
      link: '/especialidades',
      roles: [Role.PROFESIONAL, Role.USER],
    },
    {
      title: 'Especialidades',
      description: 'Encuentra el área que ocupas.',
      icon: 'star_rate',
      link: 'admin/especialidades',
      roles: [Role.ADMIN],
    },
    {
      title: 'Profesionales',
      description: 'Todos nuestros asociados.',
      icon: 'badge',
      link: '/admin/profesionales',
      roles: [Role.ADMIN],
    },
  ]);
  visibleCards = computed(() => {
    const usuarioRole = this.authService.usuario()?.role;
    return this.cards().filter((card) => {
    if (!card.roles || card.roles.length === 0) { return true; }
    if (!usuarioRole) { return false; }return card.roles.includes(usuarioRole as Role); });
  });
}
