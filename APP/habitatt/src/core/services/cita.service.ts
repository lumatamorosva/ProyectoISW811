import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { ApiPaginatedResponse, ApiResponse } from '../models/api-response.model';
import { Cita, createCitaDto, updateCitaDto } from '../models/cita.model';
import { Observable } from 'rxjs/internal/Observable';

@Injectable({ providedIn: 'root' })
export class CitasService {
private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/citas`;

  listar() {
    return this.http.get<ApiPaginatedResponse<Cita>>(this.apiUrl);
  }

  obtenerPorId(id: number) {
    return this.http.get<ApiResponse<Cita>>(`${this.apiUrl}/${id}`);
  }

  getByClient(id: number) {
    return this.http.get<ApiPaginatedResponse<Cita>>(`${this.apiUrl}/client/${id}`);
  }

  getByProfessional(id: number) {
    return this.http.get<ApiPaginatedResponse<Cita>>(`${this.apiUrl}/profesional/${id}`);
  }

  crear(data: createCitaDto) {
    return this.http.post<ApiResponse<Cita>>(this.apiUrl, data);
  }

  actualizar(id: number, data: Partial<updateCitaDto>): Observable<ApiResponse<Cita>>;
  actualizar(id: number, data: Partial<updateCitaDto>, usuarioId: number, motivo: string): Observable<ApiResponse<Cita>>;
  actualizar(id: number, data: Partial<updateCitaDto>, usuarioId?: number, motivo?: string) {
    const body = {
    ...data,
    ...(usuarioId && { usuarioId }),
    ...(motivo && { motivo })
  };
  return this.http.put<ApiResponse<Cita>>(`${this.apiUrl}/${id}`, body);}
}
