import {Modality} from '../models/modality.model'
import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { ApiPaginatedResponse, ApiResponse } from '../models/api-response.model';

@Injectable({ providedIn: 'root' })
export class ModalityService {
    private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/modality`;
  listar() {
    return this.http.get<ApiPaginatedResponse<Modality>>(this.apiUrl);
  }
}