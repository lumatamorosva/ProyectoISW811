import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { ApiPaginatedResponse, ApiResponse } from '../models/api-response.model';
import { Service } from '@angular/core';
import {Categoria} from '../models/categoria.model';
import { Profesional } from '../models/profesional.model';
import { Servicio } from '../models/servicio.model';
import { server } from 'typescript';

@Injectable({ providedIn: 'root' })
export class ServicioService {
    private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/servicios`;

  listar() {
    return this.http.get<ApiPaginatedResponse<Servicio>>(this.apiUrl);
  }

  obtenerPorId(id: number) {
    return this.http.get<ApiResponse<Servicio>>(`${this.apiUrl}/${id}`);
  }

  getImageUrl(imageName: string): string {
    return `${environment.imageUrl}/${imageName}`;
  }
}
