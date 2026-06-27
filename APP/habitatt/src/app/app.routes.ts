import { Routes } from '@angular/router';
import { MainLayout } from './layout/main-layout/main-layout';
import { Home } from './pages/home/home';
import { UsuariosList } from './pages/usuarios/usuarios-list/usuarios-list';
import { ServiciosList } from './pages/servicios/servicios-list/servicios-list';

export const routes: Routes = [
    {
        path: '',
        component: MainLayout,
        children: [
            {path: '', component:Home, title: 'Página de Inicio'},
            {path: 'servicios', component:ServiciosList, title: 'Servicios disponibles'},
            { path: 'admin/usuarios', component: UsuariosList, title: 'Gestión de usuarios' },
        ]
    },
    {
        path: '**', redirectTo: '',
    }
];
