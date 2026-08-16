import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration, ChartData } from 'chart.js';

import { CitasReportService } from '../../../core/services/dashboard.service';
import { CitasKpis } from '../../../core/models/dashboard.model';

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule,
    CurrencyPipe,
    MatCardModule,
    MatIconModule,
    MatProgressSpinnerModule,
    BaseChartDirective ],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard {
  private readonly reportService = inject(CitasReportService);
  loading = signal<boolean>(true);
  kpis = signal<CitasKpis | null>(null);
  //Líneas (Tendencia Mensual de Citas e Ingresos)
  lineChartOptions: ChartConfiguration['options'] = { responsive: true, maintainAspectRatio: false };
  lineChartData = signal<ChartData<'line'>>({ labels: [], datasets: [] });
  //Dona (Distribución por Estado)
  doughnutChartOptions: ChartConfiguration['options'] = { responsive: true, maintainAspectRatio: false };
  doughnutChartData = signal<ChartData<'doughnut'>>({ labels: [], datasets: [] });
  //Barras (Modalidad Presencial vs Virtual, etc.)
  barChartOptions: ChartConfiguration['options'] = { responsive: true, maintainAspectRatio: false };
  barChartData = signal<ChartData<'bar'>>({ labels: [], datasets: [] });

  ngOnInit(): void {
    this.cargarDatos();
  }

  cargarDatos(): void {
    this.loading.set(true);
    this.reportService.obtenerReporteCompleto().subscribe({
      next: (reporte) => {this.kpis.set(reporte.kpis);
        //Lneas
        this.lineChartData.set({
          labels: reporte.tendenciaMensual.labels,
          datasets: [
            {
              data: reporte.tendenciaMensual.cantidades,
              label: 'Total Citas',
              borderColor: '#c99e6e',
              backgroundColor: 'rgba(63, 81, 181, 0.1)',
              fill: true,
              yAxisID: 'y'
            },
            {
              data: reporte.tendenciaMensual.ingresos,
              label: 'Ingresos ($)',
              borderColor: '#85c6c9',
              backgroundColor: 'rgba(76, 175, 80, 0.1)',
              fill: true,
              yAxisID: 'y1'
            }
          ]
        });
        //Dona
        this.doughnutChartData.set({
          labels: reporte.distribucionEstado.labels,
          datasets: [{
            data: reporte.distribucionEstado.cantidades,
            backgroundColor: ['#c99e6e', '#85c6c9', '#4caf50', '#f44336']
          }]
        });
        //Barras
        this.barChartData.set({
          labels: reporte.distribucionModalidad.labels,
          datasets: [{
            data: reporte.distribucionModalidad.cantidades,
            label: 'Modalidad',
            backgroundColor: ['#c99e6e', '#85c6c9']
          }]
        });
      },
      complete: () => this.loading.set(false)
    });
  }
}
