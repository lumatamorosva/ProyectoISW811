import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { ApiPaginatedResponse, ApiResponse } from '../models/api-response.model';
import { especialidad } from '../models/especialidad.model';


@Injectable({ providedIn: 'root' })
export class EspecialidadService {
    private readonly http = inject(HttpClient);
    private readonly apiUrl = `${environment.apiUrl}/especialidades`;
    //localhost:3000/especialidades
    listar() {return this.http.get<ApiPaginatedResponse<especialidad>>(this.apiUrl);}
    obtenerPorId(id: number) {return this.http.get<ApiResponse<especialidad>>(`${this.apiUrl}/${id}`);}
}
