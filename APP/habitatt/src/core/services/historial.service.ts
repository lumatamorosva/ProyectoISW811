import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { ApiPaginatedResponse, ApiResponse } from '../models/api-response.model';
import { Historial } from '../models/historial.model';

@Injectable({ providedIn: 'root' })
export class HistorialService {
    private readonly http = inject(HttpClient);
    private readonly apiUrl = `${environment.apiUrl}/historial`;

    getByCita(id: number) {
        return this.http.get<ApiPaginatedResponse<Historial>>(`${this.apiUrl}/${id}`);
    }
}
