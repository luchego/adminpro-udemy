import { VerificaTokenGuard } from './../services/guards/verifica-token.guard';
import { AdminGuard } from './../services/guards/admin.guard';
import { BusquedaComponent } from './busqueda/busqueda.component';
import { MedicosComponent } from './medicos/medicos.component';
import { MedicoComponent } from './medicos/medico.component';
import { HospitalesComponent } from './hospitales/hospitales.component';
import { UsuariosComponent } from './usuarios/usuarios.component';
import { ProfileComponent } from './profile/profile.component';
import { LoginGuardGuard } from './../services/guards/login-guard.guard';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PagesComponent } from './pages.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ProgressComponent } from './progress/progress.component';
import { Graficas1Component } from './graficas1/graficas1.component';
import { AccountSettingsComponent } from './account-settings/account-settings.component';
import { PromesasComponent } from './promesas/promesas.component';
import { RxjsComponent } from './rxjs/rxjs.component';

const appRoutes: Routes = [
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [VerificaTokenGuard],
    data: { titulo: 'Dashboard'}
  },
  { path: 'progress', component: ProgressComponent , data: { titulo: 'Progress'}},
  { path: 'graficas1', component: Graficas1Component, data: { titulo: 'Gráficas'} },
  { path: 'promesas', component: PromesasComponent, data: { titulo: 'Promesas'} },
  { path: 'rxjs', component: RxjsComponent, data: { titulo: 'RxJs'} },
  { path: 'account-settings', component: AccountSettingsComponent, data: { titulo: 'Ajustes del Tema'} },
  { path: 'perfil', component: ProfileComponent, data: { titulo: 'Perfil de usuario'} },
  { path: 'busqueda/:termino', component: BusquedaComponent, data: { titulo: 'Buscador'} },
  // Mantenimientos
  {
    path: 'usuarios',
    component: UsuariosComponent,
    canActivate: [AdminGuard],
    data: { titulo: 'Mantenimientos de usuarios'}
  },
  { path: 'hospitales', component: HospitalesComponent, data: { titulo: 'Mantenimientos de hospitales'} },
  { path: 'medicos', component: MedicosComponent, data: { titulo: 'Mantenimientos de medicos'} },
  { path: 'medico/:id', component: MedicoComponent, data: { titulo: 'Actualizar médico'} },
  { path: '', pathMatch: 'full', redirectTo: '/dashboard' }
];

export const PAGES_ROUTES = RouterModule.forChild(appRoutes);
