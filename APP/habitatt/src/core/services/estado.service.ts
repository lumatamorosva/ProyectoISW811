import {Estado} from '../models/estado.model'
import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { ApiPaginatedResponse, ApiResponse } from '../models/api-response.model';

@Injectable({ providedIn: 'root' })
export class StatusService {
private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/estado`;
  listar() {
    return this.http.get<ApiPaginatedResponse<Estado>>(this.apiUrl);
  }
}