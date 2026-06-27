import { Component, signal } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { RouterLink } from '@angular/router';
interface ContentCard {
  title: string;
  description: string;
  icon: string;
  link?: string;
}
@Component({
  selector: 'app-home', standalone: true,
  imports: [MatCardModule, MatIconModule, MatButtonModule,RouterLink],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {
  cards = signal<ContentCard[]>([
    {
      title: 'Servicios',
      description: 'Mantenimiento del catálogo ofrecido.',
      icon: 'construction',
      link: '/servicios',
    },
    {
      title: 'Citas',
      description: 'Vea y modifique sus citas.',
      icon: 'receipt_long',
      link: '/citas',
    },
    {
      title: 'Especialidades',
      description: 'Encuentra el área que ocupas.',
      icon: 'star_rate',
      link: '/especialidades',
    },
    {
      title: 'Profesionales',
      description: 'Todos nuestros asociados.',
      icon: 'badge',
      link: '/profesionales',
    },
  ]);
}
