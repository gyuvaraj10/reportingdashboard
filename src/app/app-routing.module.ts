import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ProjectDashboardComponent } from './project-dashboard/project-dashboard.component';
import { AppComponent } from './app.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ReportsComponent } from './reports/reports.component';
import { BarChartComponent } from './bar-chart/bar-chart.component';

const routes: Routes = [
  {
    path: 'project/:name/:buildNumber', 
    component: ProjectDashboardComponent
  },
  {
    path: 'dashboard',
    component: DashboardComponent
  },
  {
    path: 'reports',
    component: BarChartComponent
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
