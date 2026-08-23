import { Component} from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent,MenuItem } from '../header/header';
import { Footer } from '../footer/footer';
import { Role } from '../../../core/models/role.model'
@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent, Footer],
  templateUrl: './main-layout.html',
  styleUrl: './main-layout.css',
})
export class MainLayout {
  readonly publicMenu: MenuItem[] =[
    { label: 'Servicios', path: '/servicios', icon: 'square_foot', excludeRoles: [Role.ADMIN] },
    { label: 'Citas', path: '/citas', icon: 'receipt_long', roles: [Role.USER] },
    { label: 'Citas', path: '/citasProfesional', icon: 'receipt_long', roles: [Role.PROFESIONAL] },
  ];
  adminMaintenanceMenu: MenuItem[] =[
    { label: 'Servicios', path: '/admin/servicios', icon: 'construction',roles: [Role.ADMIN] },
    { label: 'Categorias', path: '/admin/categorias', icon: 'category' ,roles: [Role.ADMIN]},
    { label: 'Especialidades', path: '/admin/especialidades', icon: 'devices',roles: [Role.ADMIN] },
  ];
  adminManagementMenu: MenuItem[] =[
    { label: 'Usuarios', path: '/admin/usuarios', icon: 'group',roles: [Role.ADMIN] },
    { label: 'Profesionales', path: '/admin/profesionales', icon: 'work',roles: [Role.ADMIN] },
    { label: 'Citas', path: '/admin/citas', icon: 'receipt_long',roles: [Role.ADMIN] },
    { label: 'Reportes', path: '/admin/reportes', icon: 'bar_chart',roles: [Role.ADMIN] },
  ];
}
