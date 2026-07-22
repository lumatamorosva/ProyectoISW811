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

export const routes: Routes = [
    {
        path: '',
        component: MainLayout,
        children: [
            {path: '', component:Home, title: 'Página de Inicio'},
            {path: 'servicios', component:ServiciosList, title: 'Servicios disponibles'},
            {path: 'servicios/:id', component:ServiciosDetail, title: 'Servicio Detalles'},
            {path: 'citas', component:Citas, title: 'Gestión de citas'},
            { path: 'admin/usuario-detail/:id', component: UserDetailPage, title: 'Gestión de usuario especifico' },
            { path: 'admin/usuarios', component: UsuariosList, title: 'Gestión de usuarios' },
            { path: 'admin/servicios', component: ServiciosAdminList, title: 'Gestión de servicios' },
            { path: 'admin/servicios/create', component: ServiciosAdminCreate, title: 'Creación de nuevos servicios' },
            { path: 'admin/servicios/editar/:id', component: ServiciosAdminEdit, title: 'Editar Servicio' },
            { path: 'admin/profesionales/editar/:id', component: ProfesionalesAdminEdit, title: 'Editar Profesional' },
            { path: 'admin/profesionales/create', component: ProfesionalesAdminCreate, title: 'Creación de nuevo profesional' },
            { path: 'admin/categorias', component: CategoriasAdminList, title: 'Gestión de categorias'},
            { path: 'admin/citas', component: CitasAdminList, title: 'Gestión de citas'},
            { path: 'admin/citas/detalles/:id', component: CitasAdminDetalles, title: 'Detalles de cita' },
            { path: 'citas/create', component: CitasAdminCreate, title: 'Crear una cita' },
            { path: 'admin/citas/editar/:id', component:CitasAdminCreate, title: 'Editar una cita' },
            { path: 'admin/especialidades', component: EspecialidadesAdminList, title: 'Gestión de especialidades'},
            { path: 'admin/reportes', component: Dashboard, title: 'Reportes'},
            { path: 'admin/profesionales', component: ProfesionalesAdminList, title: 'Gestión de profesionales'},
        ]
    },
    {
        path: '**', redirectTo: '',
    }
];
