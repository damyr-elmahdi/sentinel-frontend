import { Routes } from '@angular/router';
import { LandingComponent } from './pages/landing/landing';
import { AuthComponent } from './pages/auth/auth';
import { EmployeeDashboardComponent } from './pages/employee-dashboard/employee-dashboard';
import { AdminDashboardComponent } from './pages/admin-dashboard/admin-dashboard';

export const routes: Routes = [
  { path: '', component: LandingComponent },
  { path: 'auth', component: AuthComponent },
  { path: 'employee', component: EmployeeDashboardComponent },
  { path: 'admin', component: AdminDashboardComponent },
  { path: '**', redirectTo: '' }
];
