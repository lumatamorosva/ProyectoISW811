import { Component, input, computed,inject,output, signal } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatBadgeModule } from '@angular/material/badge';
import { MatDividerModule } from '@angular/material/divider'
import { MatTooltipModule } from '@angular/material/tooltip'
import { AuthService } from '../../../core/services/auth.service'
import { Role, ROLE_OPTIONS} from '../../../core/models/role.model'
export interface MenuItem {
  label: string;
  path: string;
  icon: string;
  roles?: Role[]}
@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    RouterLink,
    RouterLinkActive,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    MatBadgeModule,
    MatBadgeModule,
    MatDividerModule,
    MatTooltipModule,
  ],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class HeaderComponent {
  private readonly authService = inject(AuthService)
  readonly publicMenu = input<MenuItem[]>([])
  readonly adminMaintenanceMenu = input<MenuItem[]>([])
  readonly adminManagementMenu = input<MenuItem[]>([])
  readonly cartCount = input(0)
  readonly usuario = this.authService.usuario
  readonly autenticado = this.authService.autenticado
  readonly cargandoSesion = this.authService.cargandoSesion
  readonly sesionInicializada = this.authService.sesionInicializada
  readonly rol = this.authService.rol
  readonly esAdmin = this.authService.esAdmin
  readonly nombreRol = computed(() => {
  const rol = this.rol();
  if (!rol) return 'Usuario';
 return ROLE_OPTIONS[rol as Role]?.label ?? 'Usuario';
});
  readonly publicMenuVisible = computed(() =>this.publicMenu().filter((item) =>this.puedeMostrar(item)))
  readonly adminMaintenanceMenuVisible =computed(() =>this.adminMaintenanceMenu().filter((item) => this.puedeMostrar(item)))
  readonly adminManagementMenuVisible =computed(() =>this.adminManagementMenu().filter((item) => this.puedeMostrar(item)))
  readonly mostrarMenuMantenimientos =computed(() =>this.adminMaintenanceMenuVisible().length > 0)
  readonly mostrarMenuGestion =computed(() =>this.adminManagementMenuVisible().length > 0)
  puedeMostrar(item: MenuItem): boolean {
    if (!item.roles?.length) {return true}
    return this.authService.tieneRol(item.roles)
  }
  cerrarSesion(): void {this.authService.logout()}
}
