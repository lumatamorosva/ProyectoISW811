import { Routes } from '@angular/router';
import { MainLayout } from './layout/main-layout/main-layout';
import { Home } from './pages/home/home';
import { UsuariosList } from './pages/usuarios/usuarios-list/usuarios-list';
import { ServiciosList } from './pages/servicios/servicios-list/servicios-list';
import { UserDetailPage } from './pages/usuarios/usuarios-detail/usuarios-detail';
import { ServiciosAdminList } from './pages/usuarios/servicios-admin-list/servicios-admin-list';
import { CategoriasAdminList } from './pages/usuarios/categorias-admin-list/categorias-admin-list';
import { EspecialidadesAdminList } from './pages/usuarios/especialidades-admin-list/especialidades-admin-list';
import { Dashboard } from './pages/usuarios/dashboard/dashboard';
import { ProfesionalesAdminList } from './pages/usuarios/profesionales-admin-list/profesionales-admin-list';
import { Citas } from './pages/usuarios/citas/citas';

export const routes: Routes = [
    {
        path: '',
        component: MainLayout,
        children: [
            {path: '', component:Home, title: 'Página de Inicio'},
            {path: 'servicios', component:ServiciosList, title: 'Servicios disponibles'},
            {path: 'citas', component:Citas, title: 'Gestión de citas'},
            { path: 'admin/usuario-detail/:id', component: UserDetailPage, title: 'Gestión de usuario especifico' },
            { path: 'admin/usuarios', component: UsuariosList, title: 'Gestión de usuarios' },
            { path: 'admin/servicios', component: ServiciosAdminList, title: 'Gestión de servicios' },
            { path: 'admin/categorias', component: CategoriasAdminList, title: 'Gestión de categorias'},
            { path: 'admin/especialidades', component: EspecialidadesAdminList, title: 'Gestión de especialidades'},
            { path: 'admin/reportes', component: Dashboard, title: 'Reportes'},
            { path: 'admin/profesionales', component: ProfesionalesAdminList, title: 'Gestión de profesionales'},
        ]
    },
    {
        path: '**', redirectTo: '',
    }
];
