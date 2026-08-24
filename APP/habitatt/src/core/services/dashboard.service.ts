import { inject, Injectable } from '@angular/core';
import { map, Observable, forkJoin } from 'rxjs';
import { CitasService } from '../services/cita.service';
import { Cita } from '../models/cita.model';
import { CitasReportData, CitasKpis } from '../models/dashboard.model';
import { StatusService } from '../services/estado.service';
import { Estado } from '../models/estado.model';

@Injectable({ providedIn: 'root' })
export class CitasReportService {
  private readonly statusService = inject(StatusService);
  private readonly citasService = inject(CitasService);
  obtenerReporteCompleto(): Observable<CitasReportData> {
    return forkJoin({
      citasRes: this.citasService.listar(),
      estadosRes: this.statusService.listar()
    }).pipe(
      map(({ citasRes, estadosRes }) => {
        const citas = citasRes.data ?? [];
        const estados = estadosRes.data ?? [];
        return this.procesarDatos(citas, estados);
      })
    );
  }
  obtenerReportePorCliente(clienteId: number): Observable<CitasReportData> {
    return forkJoin({
      citasRes: this.citasService.getByClient(clienteId),
      estadosRes: this.statusService.listar()
    }).pipe(
      map(({ citasRes, estadosRes }) => 
        this.procesarDatos(citasRes.data ?? [], estadosRes.data ?? [])
      )
    );
  }
  obtenerReportePorProfesional(profesionalId: number): Observable<CitasReportData> {
    return forkJoin({
      citasRes: this.citasService.getByProfessional(profesionalId),
      estadosRes: this.statusService.listar()
    }).pipe(
      map(({ citasRes, estadosRes }) => 
        this.procesarDatos(citasRes.data ?? [], estadosRes.data ?? [])
      )
    );
  }
  obtenerLabelEstado(statusKey: string, listaEstados: Estado[]): string {
    const estadoEncontrado = listaEstados.find(
      e => e.value.toUpperCase() === statusKey.toUpperCase()
    );
    return estadoEncontrado ? estadoEncontrado.label : statusKey;
  }
  private procesarDatos(citas: Cita[], estados: Estado[]): CitasReportData {
    // 1. Cálculo de KPIs
    const kpis: CitasKpis = {
      totalCitas: citas.length,
      pendientes: citas.filter(c => String(c.status).toUpperCase() === 'PENDING').length,
      confirmadas: citas.filter(c => String(c.status).toUpperCase() === 'CONFIRMED').length,
      completadas: citas.filter(c => String(c.status).toUpperCase() === 'COMPLETED').length,
      canceladas: citas.filter(c => String(c.status).toUpperCase() === 'CANCELLED').length,
      ingresosTotales: citas
        .filter(c => String(c.status).toUpperCase() === 'COMPLETED')
        .reduce((sum, c) => sum + Number(c.cobro || 0), 0)
    };
    // 2. Distribución por Estado
    const estadosCount: Record<string, number> = {};
    citas.forEach(c => {
      const labelEstado = this.obtenerLabelEstado(c.status, estados);
      estadosCount[labelEstado] = (estadosCount[labelEstado] || 0) + 1;
    });
    // 3. Distribución por Modalidad
    const modalidadCount: Record<string, number> = {};
    citas.forEach(c => { modalidadCount[c.modalidad] = (modalidadCount[c.modalidad] || 0) + 1; });
    // 4. Agrupación por Meses (Tendencia)
    const mesesMap = new Map<string, { cantidad: number; ingresos: number }>();
    citas.forEach(c => {
      const date = new Date(c.fecha);
      const key = date.toLocaleString('es-ES', { month: 'short', year: 'numeric' });
      const actual = mesesMap.get(key) || { cantidad: 0, ingresos: 0 };
      actual.cantidad += 1;
      if (c.status === 'COMPLETED') { actual.ingresos += Number(c.cobro || 0); }
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