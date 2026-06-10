import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login';
import { DashboardComponent } from './components/dashboard/dashboard';
import { RegistroComponent } from './components/registro/registro';
import { RankingComponent } from './components/ranking/ranking';
import { AdminComponent } from './components/admin/admin';
import { PartidosComponent } from './components/partidos/partidos'; // 👈 Ruta corregida

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'registro', component: RegistroComponent },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'ranking', component: RankingComponent },
  { path: 'partidos', component: PartidosComponent },
  { path: 'admin', component: AdminComponent },
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: '**', redirectTo: '/login' }
];
