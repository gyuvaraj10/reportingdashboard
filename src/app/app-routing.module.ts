import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ProjectDashboardComponent } from './project-dashboard/project-dashboard.component';
import { AppComponent } from './app.component';
import { DashboardComponent } from './dashboard/dashboard.component';

const routes: Routes = [
  {
    path: 'project/:name', 
    component: ProjectDashboardComponent
  },
  {
    path: 'dashboard',
    component: DashboardComponent
  },
  {
    path: '', redirectTo: '/dashboard', pathMatch: 'full'
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes), 
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
