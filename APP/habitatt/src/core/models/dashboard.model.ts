import { Cita } from '../models/cita.model';

export interface CitasKpis {
  totalCitas: number;
  pendientes: number;
  confirmadas: number;
  completadas: number;
  canceladas: number;
  ingresosTotales: number;
}

export interface CitasReportData {
  kpis: CitasKpis;
  tendenciaMensual: {
    labels: string[];
    cantidades: number[];
    ingresos: number[];
  };
  distribucionEstado: {
    labels: string[];
    cantidades: number[];
  };
  distribucionModalidad: {
    labels: string[];
    cantidades: number[];
  };
}