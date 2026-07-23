import { Routes } from '@angular/router';
import { MainLayout } from './layout/main-layout/main-layout';
import { Home } from './pages/home/home';
import { UsuariosList } from './pages/usuarios/usuarios-list/usuarios-list';
import { ServiciosList } from './pages/servicios/servicios-list/servicios-list';
import { UserDetailPage } from './pages/usuarios/usuarios-detail/usuarios-detail';
import { ServiciosAdminList } from './pages/servicios/servicios-admin-list/servicios-admin-list';
import { CategoriasAdminList } from './pages/categorias/categorias-admin-list/categorias-admin-list';
import { EspecialidadesAdminList } from './pages/especialidades/especialidades-admin-list/especialidades-admin-list';
import { Dashboard } from './pages/dashboard/dashboard';
import { ProfesionalesAdminList } from './pages/profesionales/profesionales-admin-list/profesionales-admin-list';
import { Citas } from './pages/citas/citas';
import { ServiciosDetail } from './pages/servicios/servicios-detail/servicios-detail';
import { ProfesionalesAdminEdit } from './pages/profesionales/profesionales-admin-edit/profesionales-admin-edit';
import { ServiciosAdminEdit } from './pages/servicios/servicios-admin-edit/servicios-admin-edit';
import { ServiciosAdminCreate } from './pages/servicios/servicios-admin-create/servicios-admin-create';
import { ProfesionalesAdminCreate } from './pages/profesionales/profesionales-admin-create/profesionales-admin-create';
import { CitasAdminList } from './pages/citas/citas-admin-list/citas-admin-list';
import { CitasAdminDetalles } from './pages/citas/citas-admin-detalles/citas-admin-detalles';
import { CitasAdminCreate } from './pages/citas/citas-admin-create/citas-admin-create';
import { authGuard} from '../core/guards/auth.guard';
import { roleGuard } from '../core/guards/role.guard';
import { Role } from '../core/models/role.model';
import { Login } from './pages/usuarios/login/login';

export const routes: Routes = [
    {
        path: '',
        component: MainLayout,
        children: [
            {path: '', component:Home, title: 'Página de Inicio'},
            {path: 'login', component: Login, title: 'Inicio de sesión'},
            {path: 'servicios', component:ServiciosList, title: 'Servicios disponibles'},
            {path: 'servicios/:id', component:ServiciosDetail, title: 'Servicio Detalles',canActivate: [authGuard]},
            {path: 'citas', component:Citas, title: 'Gestión de citas', canActivate: [authGuard, roleGuard],data: { roles: [Role.ADMIN] }},
            { path: 'admin/usuario-detail/:id', component: UserDetailPage, title: 'Gestión de usuario especifico', canActivate: [authGuard, roleGuard],data: { roles: [Role.ADMIN] }},
            { path: 'admin/usuarios', component: UsuariosList, title: 'Gestión de usuarios', canActivate: [authGuard, roleGuard],data: { roles: [Role.ADMIN] } },
            { path: 'admin/servicios', component: ServiciosAdminList, title: 'Gestión de servicios', canActivate: [authGuard, roleGuard],data: { roles: [Role.ADMIN] } },
            { path: 'admin/servicios/create', component: ServiciosAdminCreate, title: 'Creación de nuevos servicios', canActivate: [authGuard, roleGuard],data: { roles: [Role.ADMIN] }},
            { path: 'admin/servicios/editar/:id', component: ServiciosAdminEdit, title: 'Editar Servicio', canActivate: [authGuard, roleGuard],data: { roles: [Role.ADMIN] } },
            { path: 'admin/profesionales/editar/:id', component: ProfesionalesAdminEdit, title: 'Editar Profesional', canActivate: [authGuard, roleGuard],data: { roles: [Role.ADMIN] } },
            { path: 'admin/profesionales/create', component: ProfesionalesAdminCreate, title: 'Creación de nuevo profesional' , canActivate: [authGuard, roleGuard],data: { roles: [Role.ADMIN] }},
            { path: 'admin/categorias', component: CategoriasAdminList, title: 'Gestión de categorias', canActivate: [authGuard, roleGuard],data: { roles: [Role.ADMIN] }},
            { path: 'admin/citas', component: CitasAdminList, title: 'Gestión de citas', canActivate: [authGuard, roleGuard],data: { roles: [Role.ADMIN] }},
            { path: 'admin/citas/detalles/:id', component: CitasAdminDetalles, title: 'Detalles de cita', canActivate: [authGuard, roleGuard],data: { roles: [Role.ADMIN] } },
            { path: 'citas/create', component: CitasAdminCreate, title: 'Crear una cita',canActivate: [authGuard] },
            { path: 'admin/citas/editar/:id', component:CitasAdminCreate, title: 'Editar una cita', canActivate: [authGuard, roleGuard],data: { roles: [Role.ADMIN] } },
            { path: 'admin/especialidades', component: EspecialidadesAdminList, title: 'Gestión de especialidades'},
            { path: 'admin/reportes', component: Dashboard, title: 'Reportes', canActivate: [authGuard, roleGuard],data: { roles: [Role.ADMIN] }},
            { path: 'admin/profesionales', component: ProfesionalesAdminList, title: 'Gestión de profesionales', canActivate: [authGuard, roleGuard],data: { roles: [Role.ADMIN] }},
        ]
    },
    {
        path: '**', redirectTo: '',
    },
];
