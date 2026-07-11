import {ProfesionaCreateDto, profesional, ProfesionalUpdateDto} from '../models/profesional.model'
import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { ApiPaginatedResponse, ApiResponse } from '../models/api-response.model';

@Injectable({ providedIn: 'root' })
export class ProfesionalService {
    private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/profesionales`;
  listar() {
    return this.http.get<ApiPaginatedResponse<profesional>>(this.apiUrl);
  }

  obtenerPorId(id: number) {
    return this.http.get<ApiResponse<profesional>>(`${this.apiUrl}/${id}`);
  }

  getImageUrl(imageName: string): string {
    return `${environment.imageUrl}/${imageName}`;
  }

  crear(data: ProfesionaCreateDto) {
      return this.http.post<ApiResponse<profesional>>(this.apiUrl, data);
    }
  
    actualizar(id: number, data: Partial<ProfesionalUpdateDto>) {
      return this.http.put<ApiResponse<profesional>>(`${this.apiUrl}/${id}`, data);
    }
  }