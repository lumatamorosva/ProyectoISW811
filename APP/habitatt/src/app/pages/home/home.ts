import { Component, signal } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
interface ContentCard {
  title: string;
  description: string;
  icon: string;
}
@Component({
  selector: 'app-home',
  imports: [MatCardModule, MatIconModule, MatButtonModule],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {
  cards = signal<ContentCard[]>([
    {
      title: 'Servicios',
      description: 'Mantenimiento del catálogo ofrecido.',
      icon: 'construction',
    },
    {
      title: 'Citas',
      description: 'Registro de las citas en el sistema.',
      icon: 'receipt_long',
    },
    {
      title: 'Usuarios',
      description: 'Gestión de usuarios, roles y acceso al sistema.',
      icon: 'group',
    },
  ]);
}
