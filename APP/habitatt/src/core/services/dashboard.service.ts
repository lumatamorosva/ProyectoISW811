import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { CitasService } from '../services/cita.service';
import { Cita } from '../models/cita.model';
import { CitasReportData, CitasKpis } from '../models/dashboard.model';

@Injectable({ providedIn: 'root' })
export class CitasReportService {
  private readonly citasService = inject(CitasService);

  obtenerReporteCompleto(): Observable<CitasReportData> {
    return this.citasService.listar().pipe(
      map((res) => {
        const citas = res.data ?? [];
        return this.procesarDatos(citas);
      })
    );
  }

  obtenerReportePorCliente(clienteId: number): Observable<CitasReportData> {
    return this.citasService.getByClient(clienteId).pipe(
      map((res) => this.procesarDatos(res.data ?? []))
    );
  }

  obtenerReportePorProfesional(profesionalId: number): Observable<CitasReportData> {
    return this.citasService.getByProfessional(profesionalId).pipe(
      map((res) => this.procesarDatos(res.data ?? []))
    );
  }

  private procesarDatos(citas: Cita[]): CitasReportData {
    // 1. Cálculo de KPIs
    const kpis: CitasKpis = {
      totalCitas: citas.length,
      pendientes: citas.filter(c => c.status === 'PENDING').length,
      confirmadas: citas.filter(c => c.status === 'CONFIRMED').length,
      completadas: citas.filter(c => c.status === 'COMPLETED').length,
      canceladas: citas.filter(c => c.status === 'CANCELLED').length,
      ingresosTotales: citas
        .filter(c => c.status === 'COMPLETED')
        .reduce((sum, c) => sum + Number(c.cobro || 0), 0)
    };

    // 2. Distribución por Estado
    const estadosCount: Record<string, number> = {};
    citas.forEach(c => {
      estadosCount[c.status] = (estadosCount[c.status] || 0) + 1;
    });

    // 3. Distribución por Modalidad
    const modalidadCount: Record<string, number> = {};
    citas.forEach(c => {
      modalidadCount[c.modalidad] = (modalidadCount[c.modalidad] || 0) + 1;
    });

    // 4. Agrupación por Meses (Tendencia)
    const mesesMap = new Map<string, { cantidad: number; ingresos: number }>();
    
    citas.forEach(c => {
      const date = new Date(c.fecha);
      const key = date.toLocaleString('es-ES', { month: 'short', year: 'numeric' });
      
      const actual = mesesMap.get(key) || { cantidad: 0, ingresos: 0 };
      actual.cantidad += 1;
      if (c.status === 'COMPLETED') {
        actual.ingresos += Number(c.cobro || 0);
      }
      mesesMap.set(key, actual);
    });

    const labelsMeses = Array.from(mesesMap.keys());
    const cantidadesMeses = Array.from(mesesMap.values()).map(v => v.cantidad);
    const ingresosMeses = Array.from(mesesMap.values()).map(v => v.ingresos);

    return {
      kpis,
      tendenciaMensual: {
        labels: labelsMeses,
        cantidades: cantidadesMeses,
        ingresos: ingresosMeses
      },
      distribucionEstado: {
        labels: Object.keys(estadosCount),
        cantidades: Object.values(estadosCount)
      },
      distribucionModalidad: {
        labels: Object.keys(modalidadCount),
        cantidades: Object.values(modalidadCount)
      }
    };
  }
}